import { groq } from "@ai-sdk/groq";
import { generateObject, generateText } from "ai";
import { nanoid } from "nanoid";
import { oauthGuideSchema } from "@/lib/guide-schema";
import { saveGeneratedGuide } from "@/lib/generated-store";
import {
  buildResearchContext,
  defaultResearchUrls,
  fetchPageText,
} from "@/lib/research";
import { COMPOSIO_REDIRECT_URI, type OAuthGuide } from "@/lib/types";

export const maxDuration = 60;

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "GROQ_API_KEY is not set. Add it to .env.local" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query || query.length > 200) {
    return Response.json({ error: "Provide an app name or website (max 200 chars)." }, { status: 400 });
  }
  const sessionQueries = Array.isArray(body.sessionQueries)
    ? body.sessionQueries
        .filter((q: unknown): q is string => typeof q === "string")
        .map((q: string) => q.trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        send({ type: "progress", message: `Identifying provider from “${query}”…` });

        // llama-3.3-70b-versatile was shut down for free/dev tiers (Aug 2026)
        const modelId = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
        const model = groq(modelId);

        send({ type: "progress", message: "Asking model for official doc URLs to fetch…" });
        const urlPlan = await generateText({
          model,
          temperature: 0.2,
          maxOutputTokens: 1024,
          providerOptions: {
            groq: {
              reasoningEffort: "low",
            },
          },
          prompt: `You help developers set up OAuth apps for AI agent integrations (Composio).
Given this app query: "${query}"
Return a JSON array of up to 5 absolute https URLs to official developer documentation about OAuth app creation, verification, or marketplace approval.
Prefer vendor docs (developers.*, docs.*, api.*) over blogs.
Also include Composio managed auth if relevant: https://docs.composio.dev/toolkits/managed-auth
Return ONLY a JSON array of strings.`,
        });

        let plannedUrls: string[] = [];
        try {
          const match = urlPlan.text.match(/\[[\s\S]*\]/);
          if (match) plannedUrls = JSON.parse(match[0]) as string[];
        } catch {
          plannedUrls = [];
        }

        const urls = Array.from(
          new Set(
            [...plannedUrls, ...defaultResearchUrls(query)].filter((u) =>
              /^https?:\/\//i.test(u),
            ),
          ),
        ).slice(0, 4);

        send({
          type: "progress",
          message: `Fetching ${urls.length} sources…`,
        });

        const pages = [];
        for (const url of urls) {
          send({ type: "progress", message: `Reading ${url}` });
          pages.push(await fetchPageText(url));
        }

        const okCount = pages.filter((p) => p.ok).length;
        send({
          type: "progress",
          message: `Fetched ${okCount}/${pages.length} pages. Drafting structured guide…`,
        });

        const context = buildResearchContext(query, pages);
        const sessionMemory =
          sessionQueries.length > 0
            ? `Apps already researched in this browser session: ${sessionQueries.join(", ")}. Avoid repeating identical advice unless this app differs; call out contrasts when useful.`
            : "No prior apps in this session yet.";

        if (sessionQueries.length > 0) {
          send({
            type: "progress",
            message: `Using session memory (${sessionQueries.length} prior app${sessionQueries.length === 1 ? "" : "s"})…`,
          });
        }

        const { object } = await generateObject({
          model,
          schema: oauthGuideSchema,
          temperature: 0.2,
          // gpt-oss spends completion budget on reasoning; default 1024 truncates JSON
          maxOutputTokens: 16384,
          providerOptions: {
            groq: {
              reasoningEffort: "low",
            },
          },
          prompt: `Produce a concise OAuth setup + approval guide for Composio agent builders.

Hard limits (keep the JSON short enough to finish):
- summary: 1-2 sentences
- arrays (whenYouNeedThis, prerequisites, blockers, nuances, agentCanDo, humanMustDo, evidenceNotes, composioHandoffNotes, proposedDocUrls): 2-4 short items each
- steps: 4-6 items; each detail max ~25 words
- sources: 2-4 items; notes empty string if none
- Separate create-credentials time from marketplace/verification wait
- Redirect URI must be ${COMPOSIO_REDIRECT_URI}
- If unsure on Composio managed auth, use managed_optional or byo_required and mark confidence inferred/uncertain
- difficulty 1=same-day easy, 5=multi-week verification/marketplace

Session memory:
${sessionMemory}

Research context:
${context}`,
        });

        const id = nanoid(10);
        const today = new Date().toISOString().slice(0, 10);
        const guide: OAuthGuide = {
          id,
          slug: slugify(object.name) || id,
          name: object.name,
          website: object.website,
          composioToolkitSlugs: object.composioToolkitSlugs,
          managedStatus: object.managedStatus,
          difficulty: object.difficulty,
          difficultyLabel: object.difficultyLabel,
          timeEstimate: object.timeEstimate,
          summary: object.summary,
          whenYouNeedThis: object.whenYouNeedThis,
          prerequisites: object.prerequisites,
          steps: object.steps.map((step) => ({
            ...step,
            url: step.url.trim() || undefined,
          })),
          blockers: object.blockers,
          nuances: object.nuances,
          agentCanDo: object.agentCanDo,
          humanMustDo: object.humanMustDo,
          nextAction: object.nextAction,
          composioHandoff: {
            redirectUri: COMPOSIO_REDIRECT_URI,
            notes: object.composioHandoffNotes,
          },
          sources:
            object.sources.length > 0
              ? object.sources.map((s) => ({
                  title: s.title,
                  url: s.url,
                  notes: s.notes.trim() || undefined,
                }))
              : pages
                  .filter((p) => p.ok)
                  .map((p) => ({ title: p.url, url: p.url })),
          evidenceNotes: [
            ...object.evidenceNotes,
            `Live research fetched ${okCount} page(s) for query “${query}”.`,
            `Generated by Groq (${modelId}); verify critical approval claims against official docs before launch planning.`,
          ],
          confidence: object.confidence,
          lastChecked: today,
          generated: true,
        };

        await saveGeneratedGuide(guide);
        send({ type: "progress", message: "Saved shareable guide." });
        send({ type: "done", id: guide.id, guide });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to generate guide";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
