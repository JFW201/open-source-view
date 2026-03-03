use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ── HTTP proxy command ──────────────────────────────────────────────────────
// Proxies all external HTTP requests through the Tauri backend to avoid CORS
// restrictions in the webview. Supports arbitrary headers for API key auth.

#[derive(Deserialize)]
pub struct ProxyRequest {
    pub url: String,
    pub method: Option<String>,
    pub headers: Option<HashMap<String, String>>,
    pub body: Option<String>,
}

#[derive(Serialize)]
pub struct ProxyResponse {
    pub status: u16,
    pub body: String,
    pub headers: HashMap<String, String>,
}

#[tauri::command]
async fn proxy_request(req: ProxyRequest) -> Result<ProxyResponse, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| e.to_string())?;

    let method = match req.method.as_deref().unwrap_or("GET") {
        "POST" => reqwest::Method::POST,
        "PUT" => reqwest::Method::PUT,
        "DELETE" => reqwest::Method::DELETE,
        "PATCH" => reqwest::Method::PATCH,
        _ => reqwest::Method::GET,
    };

    let mut builder = client.request(method, &req.url);

    if let Some(headers) = req.headers {
        for (key, value) in headers {
            builder = builder.header(&key, &value);
        }
    }

    if let Some(body) = req.body {
        builder = builder.body(body);
    }

    let response = builder.send().await.map_err(|e| e.to_string())?;
    let status = response.status().as_u16();
    let resp_headers: HashMap<String, String> = response
        .headers()
        .iter()
        .filter_map(|(k, v)| v.to_str().ok().map(|val| (k.to_string(), val.to_string())))
        .collect();
    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(ProxyResponse {
        status,
        body,
        headers: resp_headers,
    })
}

// ── RSS feed fetcher ────────────────────────────────────────────────────────
// Fetches and parses RSS/Atom feeds server-side for reliable cross-origin access.

#[derive(Serialize)]
pub struct FeedItem {
    pub title: String,
    pub link: String,
    pub description: String,
    pub pub_date: String,
    pub source: String,
}

#[tauri::command]
async fn fetch_rss(url: String, source_name: String) -> Result<Vec<FeedItem>, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .build()
        .map_err(|e| e.to_string())?;

    let content = client
        .get(&url)
        .header("User-Agent", "Waldorf/0.1 OSINT Monitor")
        .send()
        .await
        .map_err(|e| format!("Failed to fetch {}: {}", url, e))?
        .bytes()
        .await
        .map_err(|e| e.to_string())?;

    let channel = rss::Channel::read_from(&content[..]).map_err(|e| e.to_string())?;

    let items: Vec<FeedItem> = channel
        .items()
        .iter()
        .take(50)
        .map(|item| FeedItem {
            title: item.title().unwrap_or("").to_string(),
            link: item.link().unwrap_or("").to_string(),
            description: item
                .description()
                .unwrap_or("")
                .chars()
                .take(500)
                .collect(),
            pub_date: item.pub_date().unwrap_or("").to_string(),
            source: source_name.clone(),
        })
        .collect();

    Ok(items)
}

// ── Batch RSS fetcher ───────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct FeedSource {
    pub url: String,
    pub name: String,
}

#[tauri::command]
async fn fetch_rss_batch(sources: Vec<FeedSource>) -> Result<Vec<FeedItem>, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .build()
        .map_err(|e| e.to_string())?;

    let mut all_items: Vec<FeedItem> = Vec::new();

    let fetches: Vec<_> = sources
        .into_iter()
        .map(|src| {
            let client = client.clone();
            tokio::spawn(async move {
                let resp = client
                    .get(&src.url)
                    .header("User-Agent", "Waldorf/0.1 OSINT Monitor")
                    .send()
                    .await
                    .ok()?;
                let bytes = resp.bytes().await.ok()?;
                let channel = rss::Channel::read_from(&bytes[..]).ok()?;
                Some(
                    channel
                        .items()
                        .iter()
                        .take(20)
                        .map(|item| FeedItem {
                            title: item.title().unwrap_or("").to_string(),
                            link: item.link().unwrap_or("").to_string(),
                            description: item
                                .description()
                                .unwrap_or("")
                                .chars()
                                .take(500)
                                .collect(),
                            pub_date: item.pub_date().unwrap_or("").to_string(),
                            source: src.name.clone(),
                        })
                        .collect::<Vec<_>>(),
                )
            })
        })
        .collect();

    for handle in fetches {
        if let Ok(Some(items)) = handle.await {
            all_items.extend(items);
        }
    }

    all_items.sort_by(|a, b| b.pub_date.cmp(&a.pub_date));
    Ok(all_items)
}

// ── App entry point ─────────────────────────────────────────────────────────

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            proxy_request,
            fetch_rss,
            fetch_rss_batch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Waldorf");
}
