import Link from "next/link";
import type { OAuthGuide } from "@/lib/types";
import { difficultyColor, managedLabel } from "@/lib/labels";

export function GuideCard({ guide }: { guide: OAuthGuide }) {
  const href = guide.generated
    ? `/guides/generated/${guide.id}`
    : `/guides/${guide.slug}`;

  return (
    <Link href={href} className="guide-card">
      <div className="guide-card-top">
        <span
          className="diff-pill"
          style={{ ["--d" as string]: difficultyColor(guide.difficulty) }}
        >
          {guide.difficulty}/5 · {guide.difficultyLabel}
        </span>
        {guide.generated ? <span className="gen-tag">Live generated</span> : null}
      </div>
      <h3>{guide.name}</h3>
      <p>{guide.summary}</p>
      <div className="guide-card-meta">
        <span>{managedLabel(guide.managedStatus)}</span>
        <span>{guide.timeEstimate.calendarTotal}</span>
      </div>
    </Link>
  );
}
