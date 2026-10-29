"use client";

import { useMemo, useState } from "react";
import type { OAuthGuide } from "@/lib/types";
import { GuideCard } from "./GuideCard";

export function LibrarySearch({ guides }: { guides: OAuthGuide[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return guides;
    return guides.filter((g) =>
      [g.name, g.summary, g.difficultyLabel, g.managedStatus, ...g.composioToolkitSlugs]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [guides, q]);

  return (
    <div>
      <div className="library-toolbar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter guides…"
          aria-label="Filter guides"
        />
        <span className="muted">
          {filtered.length} of {guides.length}
        </span>
      </div>
      <div className="guide-grid">
        {filtered.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
}
