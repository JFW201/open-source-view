import { invoke } from "@tauri-apps/api/core";
import type { ProxyRequest, ProxyResponse } from "../types";

let isTauri = false;
try {
  isTauri = !!(window as any).__TAURI_INTERNALS__;
} catch {
  // running in browser — no Tauri
}

/**
 * Route all external HTTP requests through the Tauri backend (avoids CORS).
 * Falls back to direct fetch when running in a browser for development.
 */
export async function proxyFetch(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  } = {}
): Promise<{ status: number; body: string; headers: Record<string, string> }> {
  if (isTauri) {
    const req: ProxyRequest = {
      url,
      method: options.method,
      headers: options.headers,
      body: options.body,
    };
    return invoke<ProxyResponse>("proxy_request", { req });
  }

  // Browser fallback for development
  const resp = await fetch(url, {
    method: options.method ?? "GET",
    headers: options.headers,
    body: options.body,
  });
  const body = await resp.text();
  const headers: Record<string, string> = {};
  resp.headers.forEach((v, k) => {
    headers[k] = v;
  });
  return { status: resp.status, body, headers };
}

/**
 * Convenience wrapper that parses the response body as JSON.
 */
export async function proxyFetchJSON<T>(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  } = {}
): Promise<T> {
  const { status, body } = await proxyFetch(url, options);
  if (status >= 400) {
    throw new Error(`HTTP ${status}: ${body.slice(0, 200)}`);
  }
  return JSON.parse(body) as T;
}
