import { GenerateForm } from "@/components/GenerateForm";
import { LibrarySearch } from "@/components/LibrarySearch";
import { SessionMemory } from "@/components/SessionMemory";
import { SiteHeader } from "@/components/SiteHeader";
import { getCuratedGuides } from "@/lib/guides";

export default async function HomePage() {
  const guides = await getCuratedGuides();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <p className="brand-mark">OAuth Pathfinder</p>
          <h1>Know the path before you build the OAuth app.</h1>
          <p className="hero-sub">
            For Composio developers and agent builders: how hard is bring-your-own
            OAuth, how long will approval take, and what should you do next?
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#library">
              Browse guides
            </a>
            <a className="btn ghost" href="#generate">
              Generate for any app
            </a>
          </div>
        </section>

        <section id="library" className="section">
          <div className="section-head">
            <h2>Curated library</h2>
            <p>
              A focused sample across easy, marketplace-gated, verification-heavy,
              and BYO-required apps — not a pretend list of 100.
            </p>
          </div>
          <LibrarySearch guides={guides} />
        </section>

        <section id="generate" className="section generate-section">
          <div className="section-head">
            <h2>Live guide generation</h2>
            <p>
              Submit an unfamiliar app. An agent investigates public docs and drafts
              a shareable guide in real time.
            </p>
          </div>
          <GenerateForm />
        </section>

        <SessionMemory />
      </main>
      <footer className="site-footer">
        <p>
          Take-home demo for Composio · Guides cite sources and mark uncertainty ·{" "}
          <a href="/verification">Verification notes</a>
        </p>
      </footer>
    </>
  );
}
