import type { ExportFormat, NewsItem, MarketIndex, GrokSummary } from "../types";

/**
 * Data export utilities. Uses blob download which works in both
 * Tauri webview and browser dev mode.
 */

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCSV(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

// ── News Export ──────────────────────────────────────────────────────────

export function exportNews(items: NewsItem[], format: ExportFormat) {
  const ts = timestamp();

  switch (format) {
    case "json": {
      const json = JSON.stringify(items, null, 2);
      downloadBlob(json, `waldorf-news-${ts}.json`, "application/json");
      break;
    }
    case "csv": {
      const header = "Title,Source,Category,Published,URL";
      const rows = items.map(
        (item) =>
          [item.title, item.source, item.category, item.publishedAt, item.url]
            .map(escapeCSV)
            .join(",")
      );
      downloadBlob([header, ...rows].join("\n"), `waldorf-news-${ts}.csv`, "text/csv");
      break;
    }
    case "markdown": {
      const lines = [
        `# Waldorf Intelligence — News Export`,
        `> Generated ${new Date().toLocaleString()}`,
        `> ${items.length} articles`,
        "",
        ...items.map(
          (item) =>
            `- **[${item.title}](${item.url})** — *${item.source}* (${item.category}) — ${item.publishedAt}`
        ),
      ];
      downloadBlob(lines.join("\n"), `waldorf-news-${ts}.md`, "text/markdown");
      break;
    }
  }
}

// ── Market Data Export ───────────────────────────────────────────────────

export function exportMarkets(indices: MarketIndex[], format: ExportFormat) {
  const ts = timestamp();

  switch (format) {
    case "json": {
      downloadBlob(JSON.stringify(indices, null, 2), `waldorf-markets-${ts}.json`, "application/json");
      break;
    }
    case "csv": {
      const header = "Symbol,Name,Price,Change,Change%,Updated";
      const rows = indices.map(
        (idx) =>
          [idx.symbol, idx.name, idx.price, idx.change, idx.changePercent, idx.updatedAt]
            .map(escapeCSV)
            .join(",")
      );
      downloadBlob([header, ...rows].join("\n"), `waldorf-markets-${ts}.csv`, "text/csv");
      break;
    }
    case "markdown": {
      const lines = [
        `# Waldorf Intelligence — Market Data`,
        `> Generated ${new Date().toLocaleString()}`,
        "",
        "| Symbol | Name | Price | Change | Change% |",
        "|--------|------|------:|-------:|--------:|",
        ...indices.map(
          (idx) =>
            `| ${idx.symbol} | ${idx.name} | $${idx.price.toFixed(2)} | ${idx.change >= 0 ? "+" : ""}${idx.change.toFixed(2)} | ${idx.changePercent >= 0 ? "+" : ""}${idx.changePercent.toFixed(2)}% |`
        ),
      ];
      downloadBlob(lines.join("\n"), `waldorf-markets-${ts}.md`, "text/markdown");
      break;
    }
  }
}

// ── AI Summary Export ────────────────────────────────────────────────────

export function exportAISummary(summary: GrokSummary, format: ExportFormat) {
  const ts = timestamp();

  switch (format) {
    case "json": {
      downloadBlob(JSON.stringify(summary, null, 2), `waldorf-brief-${ts}.json`, "application/json");
      break;
    }
    case "csv": {
      const header = "Field,Value";
      const rows = [
        ["Summary", summary.summary],
        ["Sentiment", summary.sentiment],
        ["Confidence", String(summary.confidence)],
        ["Generated At", summary.generated_at],
        ...summary.key_points.map((pt, i) => [`Key Point ${i + 1}`, pt]),
      ]
        .map((r) => r.map(escapeCSV).join(","));
      downloadBlob([header, ...rows].join("\n"), `waldorf-brief-${ts}.csv`, "text/csv");
      break;
    }
    case "markdown": {
      const lines = [
        `# Waldorf Intelligence Brief`,
        `> Generated ${new Date(summary.generated_at).toLocaleString()}`,
        `> Sentiment: **${summary.sentiment}** | Confidence: **${(summary.confidence * 100).toFixed(0)}%**`,
        "",
        "## Executive Summary",
        "",
        summary.summary,
        "",
        "## Key Intelligence Points",
        "",
        ...summary.key_points.map((pt, i) => `${i + 1}. ${pt}`),
      ];
      downloadBlob(lines.join("\n"), `waldorf-brief-${ts}.md`, "text/markdown");
      break;
    }
  }
}
