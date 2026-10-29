import type { OAuthGuide } from "./types";

const GUIDE_PREFIX = "oauth-pathfinder:guide:";
const SESSION_LIST_KEY = "oauth-pathfinder:session-guides";
const SESSION_QUERIES_KEY = "oauth-pathfinder:session-queries";

export type SessionGuideRef = {
  id: string;
  name: string;
  slug: string;
  difficulty: number;
  difficultyLabel: string;
  query: string;
  createdAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function saveGuideToSession(guide: OAuthGuide, query: string) {
  if (!canUseStorage()) return;
  localStorage.setItem(`${GUIDE_PREFIX}${guide.id}`, JSON.stringify(guide));

  const refs = getSessionGuideRefs().filter((r) => r.id !== guide.id);
  refs.unshift({
    id: guide.id,
    name: guide.name,
    slug: guide.slug,
    difficulty: guide.difficulty,
    difficultyLabel: guide.difficultyLabel,
    query,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(refs.slice(0, 20)));

  const queries = getSessionQueries().filter((q) => q !== query);
  queries.unshift(query);
  localStorage.setItem(SESSION_QUERIES_KEY, JSON.stringify(queries.slice(0, 12)));
}

export function getGuideFromSession(id: string): OAuthGuide | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(`${GUIDE_PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as OAuthGuide) : null;
  } catch {
    return null;
  }
}

export function getSessionGuideRefs(): SessionGuideRef[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(SESSION_LIST_KEY);
    return raw ? (JSON.parse(raw) as SessionGuideRef[]) : [];
  } catch {
    return [];
  }
}

export function getSessionQueries(): string[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(SESSION_QUERIES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function clearSessionMemory() {
  if (!canUseStorage()) return;
  const refs = getSessionGuideRefs();
  for (const ref of refs) {
    localStorage.removeItem(`${GUIDE_PREFIX}${ref.id}`);
  }
  localStorage.removeItem(SESSION_LIST_KEY);
  localStorage.removeItem(SESSION_QUERIES_KEY);
}
