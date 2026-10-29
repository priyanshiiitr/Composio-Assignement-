export type ManagedStatus = "managed" | "byo_required" | "managed_optional";

export type Confidence = "verified" | "docs_supported" | "inferred" | "uncertain";

export type GuideStep = {
  title: string;
  detail: string;
  url?: string;
  owner: "human" | "agent" | "either";
};

export type GuideSource = {
  title: string;
  url: string;
  notes?: string;
};

export type OAuthGuide = {
  id: string;
  slug: string;
  name: string;
  website: string;
  composioToolkitSlugs: string[];
  managedStatus: ManagedStatus;
  difficulty: 1 | 2 | 3 | 4 | 5;
  difficultyLabel: string;
  timeEstimate: {
    setupHours: string;
    approvalWait: string;
    calendarTotal: string;
  };
  summary: string;
  whenYouNeedThis: string[];
  prerequisites: string[];
  steps: GuideStep[];
  blockers: string[];
  nuances: string[];
  agentCanDo: string[];
  humanMustDo: string[];
  nextAction: string;
  composioHandoff: {
    redirectUri: string;
    notes: string[];
  };
  sources: GuideSource[];
  evidenceNotes: string[];
  confidence: Confidence;
  lastChecked: string;
  generated?: boolean;
};

export const COMPOSIO_REDIRECT_URI =
  "https://backend.composio.dev/api/v3/toolkits/auth/callback";
