import * as cheerio from "cheerio";
import { COMPOSIO_REDIRECT_URI } from "./types";

const MAX_CHARS = 2500;

export async function fetchPageText(url: string): Promise<{ url: string; text: string; ok: boolean }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "OAuthPathfinderBot/1.0 (Composio take-home research; +https://github.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(12000),
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return { url, text: `HTTP ${res.status}`, ok: false };
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    $("script, style, nav, footer, noscript, iframe").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim().slice(0, MAX_CHARS);
    return { url, text, ok: true };
  } catch (err) {
    return {
      url,
      text: err instanceof Error ? err.message : "fetch failed",
      ok: false,
    };
  }
}

export function defaultResearchUrls(query: string): string[] {
  const q = encodeURIComponent(`${query} OAuth app create developer documentation`);
  return [
    "https://docs.composio.dev/toolkits/managed-auth",
    "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app",
    `https://duckduckgo.com/html/?q=${q}`,
  ];
}

export function buildResearchContext(
  query: string,
  pages: { url: string; text: string; ok: boolean }[],
): string {
  const parts = pages.map(
    (p, i) =>
      `### Source ${i + 1}: ${p.url}\nFetch OK: ${p.ok}\n${p.text || "(empty)"}`,
  );
  return [
    `Developer query: ${query}`,
    `Composio OAuth redirect URI to use: ${COMPOSIO_REDIRECT_URI}`,
    "Goal: produce a practical BYO OAuth setup + approval guide for an agent builder using Composio.",
    ...parts,
  ].join("\n\n");
}
