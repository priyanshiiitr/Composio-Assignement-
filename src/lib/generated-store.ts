import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { OAuthGuide } from "./types";

const memory = new Map<string, OAuthGuide>();
const SESSION_INDEX_KEY = "oauth-pathfinder:session-index";

function storeDir() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "oauth-pathfinder-guides");
  }
  return path.join(process.cwd(), "data", "generated");
}

function redisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function ensureDir() {
  await fs.mkdir(storeDir(), { recursive: true });
}

export async function saveGeneratedGuide(guide: OAuthGuide): Promise<void> {
  memory.set(guide.id, guide);

  const redis = redisClient();
  if (redis) {
    await redis.set(`guide:${guide.id}`, guide, { ex: 60 * 60 * 24 * 14 });
    await redis.lpush(SESSION_INDEX_KEY, guide.id);
    await redis.ltrim(SESSION_INDEX_KEY, 0, 49);
    return;
  }

  try {
    await ensureDir();
    await fs.writeFile(
      path.join(storeDir(), `${guide.id}.json`),
      JSON.stringify(guide, null, 2),
      "utf8",
    );
  } catch {
    // In-memory still holds it for this process.
  }
}

export async function getGeneratedGuide(id: string): Promise<OAuthGuide | null> {
  const cached = memory.get(id);
  if (cached) return cached;

  const redis = redisClient();
  if (redis) {
    const guide = await redis.get<OAuthGuide>(`guide:${id}`);
    if (guide) {
      memory.set(id, guide);
      return guide;
    }
  }

  try {
    const raw = await fs.readFile(path.join(storeDir(), `${id}.json`), "utf8");
    const guide = JSON.parse(raw) as OAuthGuide;
    memory.set(id, guide);
    return guide;
  } catch {
    return null;
  }
}

export function hasDurableStore() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}
