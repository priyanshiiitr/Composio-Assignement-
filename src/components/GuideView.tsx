import type { OAuthGuide } from "@/lib/types";
import { confidenceLabel, difficultyColor, managedLabel } from "@/lib/labels";

export function GuideView({ guide }: { guide: OAuthGuide }) {
  return (
    <article className="guide-view">
      <header className="guide-hero">
        <p className="eyebrow">
          {guide.generated ? "Generated guide" : "Curated guide"} ·{" "}
          {confidenceLabel(guide.confidence)}
        </p>
        <h1>{guide.name}</h1>
        <p className="lede">{guide.summary}</p>
        <div className="stat-row">
          <div>
            <span className="stat-label">Difficulty</span>
            <strong style={{ color: difficultyColor(guide.difficulty) }}>
              {guide.difficulty}/5 — {guide.difficultyLabel}
            </strong>
          </div>
          <div>
            <span className="stat-label">Setup effort</span>
            <strong>{guide.timeEstimate.setupHours}</strong>
          </div>
          <div>
            <span className="stat-label">Approval wait</span>
            <strong>{guide.timeEstimate.approvalWait}</strong>
          </div>
          <div>
            <span className="stat-label">Calendar total</span>
            <strong>{guide.timeEstimate.calendarTotal}</strong>
          </div>
        </div>
        <p className="managed-badge">{managedLabel(guide.managedStatus)}</p>
      </header>

      <section className="panel next-panel">
        <h2>What to do next</h2>
        <p>{guide.nextAction}</p>
      </section>

      <section className="panel">
        <h2>When you need BYO OAuth</h2>
        <ul>
          {guide.whenYouNeedThis.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Prerequisites</h2>
        <ul>
          {guide.prerequisites.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Setup steps</h2>
        <ol className="steps">
          {guide.steps.map((step, i) => (
            <li key={`${step.title}-${i}`}>
              <div className="step-head">
                <strong>{step.title}</strong>
                <span className={`owner owner-${step.owner}`}>{step.owner}</span>
              </div>
              <p>{step.detail}</p>
              {step.url ? (
                <a href={step.url} target="_blank" rel="noreferrer">
                  Open source →
                </a>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <div className="split">
        <section className="panel">
          <h2>Blockers</h2>
          <ul>
            {guide.blockers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>Nuances</h2>
          <ul>
            {guide.nuances.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="split">
        <section className="panel agent-panel">
          <h2>What an agent can do</h2>
          <ul>
            {guide.agentCanDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="panel human-panel">
          <h2>Where you take over</h2>
          <ul>
            {guide.humanMustDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panel">
        <h2>Composio handoff</h2>
        <p>
          Redirect URI:{" "}
          <code>{guide.composioHandoff.redirectUri}</code>
        </p>
        <ul>
          {guide.composioHandoff.notes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {guide.composioToolkitSlugs.length > 0 ? (
          <p className="slugs">
            Toolkit slugs:{" "}
            {guide.composioToolkitSlugs.map((s) => (
              <code key={s}>{s}</code>
            ))}
          </p>
        ) : null}
      </section>

      <section className="panel">
        <h2>Evidence & confidence</h2>
        <p className="confidence">{confidenceLabel(guide.confidence)}</p>
        <ul>
          {guide.evidenceNotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>Sources</h3>
        <ul className="sources">
          {guide.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
              {s.notes ? <span> — {s.notes}</span> : null}
            </li>
          ))}
        </ul>
        <p className="muted">Last checked: {guide.lastChecked}</p>
      </section>
    </article>
  );
}
