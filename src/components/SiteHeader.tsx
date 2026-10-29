import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        OAuth Pathfinder
      </Link>
      <nav className="nav-links">
        <Link href="/#library">Library</Link>
        <Link href="/#generate">Generate</Link>
        <Link href="/#session">Session</Link>
        <Link href="/verification">Verification</Link>
      </nav>
    </header>
  );
}
