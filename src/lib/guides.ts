import { promises as fs } from "fs";
import path from "path";
import type { OAuthGuide } from "./types";

const CURATED_DIR = path.join(process.cwd(), "content", "guides");

export async function getCuratedGuides(): Promise<OAuthGuide[]> {
  const files = await fs.readdir(CURATED_DIR);
  const guides = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(CURATED_DIR, file), "utf8");
        return JSON.parse(raw) as OAuthGuide;
      }),
  );
  return guides.sort((a, b) => a.difficulty - b.difficulty || a.name.localeCompare(b.name));
}

export async function getGuideBySlug(slug: string): Promise<OAuthGuide | null> {
  try {
    const raw = await fs.readFile(path.join(CURATED_DIR, `${slug}.json`), "utf8");
    return JSON.parse(raw) as OAuthGuide;
  } catch {
    return null;
  }
}

export function searchGuides(guides: OAuthGuide[], query: string): OAuthGuide[] {
  const q = query.trim().toLowerCase();
  if (!q) return guides;
  return guides.filter((g) => {
    const hay = [
      g.name,
      g.slug,
      g.summary,
      g.website,
      ...g.composioToolkitSlugs,
      g.difficultyLabel,
      g.managedStatus,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
