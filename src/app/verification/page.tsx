import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Verification notes · OAuth Pathfinder",
};

export default function VerificationPage() {
  return (
    <>
      <SiteHeader />
      <main className="guide-main narrow">
        <article className="guide-view">
          <header className="guide-hero">
            <p className="eyebrow">Evidence</p>
            <h1>What we checked</h1>
            <p className="lede">
              Sample of curated guidance validated against public sources. We did
              not complete paid assessments or provider marketplace submissions.
            </p>
          </header>

          <section className="panel">
            <h2>Gmail / Google</h2>
            <ul>
              <li>
                <strong>Matched:</strong> Unverified apps can be tested with test
                users; verification is required before broad external launch when
                sensitive/restricted scopes apply (
                <a
                  href="https://support.google.com/cloud/answer/7454865"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Help
                </a>
                ).
              </li>
              <li>
                <strong>Matched:</strong> Restricted scopes can require a security
                assessment path beyond brand verification (
                <a
                  href="https://support.google.com/cloud/answer/13463073"
                  target="_blank"
                  rel="noreferrer"
                >
                  Verification Help Center
                </a>
                ).
              </li>
              <li>
                <strong>Corrected while drafting:</strong> Early draft treated
                “create OAuth client” as the hard part. The calendar risk is
                verification/assessment, not Cloud Console form fill.
              </li>
              <li>
                <strong>Unverified here:</strong> Exact assessor cost and current
                median turnaround for a specific Gmail scope set.
              </li>
            </ul>
          </section>

          <section className="panel">
            <h2>Slack</h2>
            <ul>
              <li>
                <strong>Matched:</strong> Creating an app and configuring OAuth
                redirect URLs is self-serve (
                <a
                  href="https://api.slack.com/authentication/oauth-v2"
                  target="_blank"
                  rel="noreferrer"
                >
                  Slack OAuth docs
                </a>
                ).
              </li>
              <li>
                <strong>Matched / clarified:</strong> Marketplace distribution is a
                separate, slower path with install prerequisites — not required to
                OAuth your own customers via an install link.
              </li>
              <li>
                <strong>Uncertain without submission:</strong> Current Marketplace
                queue length; treat multi-week estimates as planning ranges.
              </li>
            </ul>
          </section>

          <section className="panel">
            <h2>Composio managed vs BYO</h2>
            <ul>
              <li>
                Confirmed from{" "}
                <a
                  href="https://docs.composio.dev/toolkits/managed-auth"
                  target="_blank"
                  rel="noreferrer"
                >
                  Managed OAuth apps
                </a>{" "}
                that GitHub, Notion, Slack, and Gmail have managed OAuth available,
                while Shopify appears under Bring your own.
              </li>
              <li>
                Redirect URI used throughout:{" "}
                <code>
                  https://backend.composio.dev/api/v3/toolkits/auth/callback
                </code>
              </li>
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}
