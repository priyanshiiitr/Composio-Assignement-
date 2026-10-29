"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearSessionMemory,
  getSessionGuideRefs,
  type SessionGuideRef,
} from "@/lib/session-memory";

export function SessionMemory() {
  const [refs, setRefs] = useState<SessionGuideRef[]>([]);

  useEffect(() => {
    setRefs(getSessionGuideRefs());
    const onStorage = () => setRefs(getSessionGuideRefs());
    window.addEventListener("storage", onStorage);
    window.addEventListener("oauth-pathfinder-session", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("oauth-pathfinder-session", onStorage);
    };
  }, []);

  if (refs.length === 0) return null;

  return (
    <section id="session" className="section">
      <div className="section-head session-head">
        <div>
          <h2>This session</h2>
          <p>Guides generated in this browser stay available here.</p>
        </div>
        <button
          type="button"
          className="btn ghost clear-session"
          onClick={() => {
            clearSessionMemory();
            setRefs([]);
          }}
        >
          Clear session
        </button>
      </div>
      <ul className="session-list">
        {refs.map((ref) => (
          <li key={ref.id}>
            <Link href={`/guides/generated/${ref.id}`}>
              <strong>{ref.name}</strong>
              <span>
                {ref.difficulty}/5 · {ref.difficultyLabel}
              </span>
              <span className="muted">from “{ref.query}”</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
