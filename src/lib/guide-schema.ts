import { z } from "zod";

// Groq structured outputs require every property key to appear in `required`.
// Use empty strings instead of optional fields.
export const oauthGuideSchema = z.object({
  name: z.string(),
  website: z.string(),
  composioToolkitSlugs: z.array(z.string()),
  managedStatus: z.enum(["managed", "byo_required", "managed_optional"]),
  difficulty: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  difficultyLabel: z.string(),
  timeEstimate: z.object({
    setupHours: z.string(),
    approvalWait: z.string(),
    calendarTotal: z.string(),
  }),
  summary: z.string(),
  whenYouNeedThis: z.array(z.string()),
  prerequisites: z.array(z.string()),
  steps: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      url: z.string().describe("Official docs URL, or empty string if none"),
      owner: z.enum(["human", "agent", "either"]),
    }),
  ),
  blockers: z.array(z.string()),
  nuances: z.array(z.string()),
  agentCanDo: z.array(z.string()),
  humanMustDo: z.array(z.string()),
  nextAction: z.string(),
  composioHandoffNotes: z.array(z.string()),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      notes: z.string().describe("Short note, or empty string if none"),
    }),
  ),
  evidenceNotes: z.array(z.string()),
  confidence: z.enum(["verified", "docs_supported", "inferred", "uncertain"]),
  proposedDocUrls: z.array(z.string()),
});

export type GeneratedGuidePayload = z.infer<typeof oauthGuideSchema>;
