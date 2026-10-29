"use client";

import { useEffect, useState } from "react";
import { GuideView } from "@/components/GuideView";
import { getGuideFromSession } from "@/lib/session-memory";
import type { OAuthGuide } from "@/lib/types";

export function GeneratedGuideClient({
  id,
  initial,
}: {
  id: string;
  initial: OAuthGuide | null;
}) {
  const [guide, setGuide] = useState<OAuthGuide | null>(initial);

  useEffect(() => {
    if (guide) return;
    const fromSession = getGuideFromSession(id);
    if (fromSession) setGuide(fromSession);
  }, [guide, id]);

  if (!guide) {
    return (
      <div className="panel">
        <h1>Guide not found</h1>
        <p className="muted">
          This generated guide is not in server storage or your browser session.
          Generate it again from the home page.
        </p>
        <p>
          <a href="/#generate">Generate a guide →</a>
        </p>
      </div>
    );
  }

  return <GuideView guide={guide} />;
}
