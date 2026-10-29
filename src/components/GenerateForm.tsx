"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSessionQueries, saveGuideToSession } from "@/lib/session-memory";
import type { OAuthGuide } from "@/lib/types";

type ProgressEvent = { type: "progress"; message: string };
type DoneEvent = { type: "done"; id: string; guide: OAuthGuide };
type ErrorEvent = { type: "error"; message: string };
type StreamEvent = ProgressEvent | DoneEvent | ErrorEvent;

export function GenerateForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || busy) return;
    const q = query.trim();
    setBusy(true);
    setError(null);
    setLogs(["Starting investigation…"]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          sessionQueries: getSessionQueries(),
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as StreamEvent;
          if (event.type === "progress") {
            setLogs((prev) => [...prev, event.message]);
          } else if (event.type === "done") {
            saveGuideToSession(event.guide, q);
            window.dispatchEvent(new Event("oauth-pathfinder-session"));
            setLogs((prev) => [...prev, "Guide ready — opening…"]);
            router.push(`/guides/generated/${event.id}`);
            return;
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="generate-box">
      <form onSubmit={onSubmit} className="generate-form">
        <label htmlFor="app-query">App name or website</label>
        <div className="generate-row">
          <input
            id="app-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. HubSpot, https://linear.app, DocuSign"
            disabled={busy}
            required
          />
          <button type="submit" disabled={busy || !query.trim()}>
            {busy ? "Investigating…" : "Generate guide"}
          </button>
        </div>
      </form>
      {error ? <p className="form-error">{error}</p> : null}
      {logs.length > 0 ? (
        <ul className="progress-log" aria-live="polite">
          {logs.map((log, i) => (
            <li key={`${log}-${i}`}>{log}</li>
          ))}
        </ul>
      ) : (
        <p className="muted generate-hint">
          The agent fetches public docs, checks Composio managed vs BYO context, and
          drafts a shareable guide. Portal logins and approvals stay with you.
          Earlier apps from this session are passed in as context.
        </p>
      )}
    </div>
  );
}
