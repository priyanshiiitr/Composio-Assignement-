import type { Confidence, ManagedStatus } from "./types";

export function managedLabel(status: ManagedStatus): string {
  switch (status) {
    case "managed":
      return "Composio managed OAuth available";
    case "managed_optional":
      return "Managed available · BYO for branding/scopes";
    case "byo_required":
      return "Bring your own OAuth required";
  }
}

export function confidenceLabel(c: Confidence): string {
  switch (c) {
    case "verified":
      return "Verified in portal";
    case "docs_supported":
      return "Supported by official docs";
    case "inferred":
      return "Inferred — verify before relying";
    case "uncertain":
      return "Uncertain — treat as hypothesis";
  }
}

export function difficultyColor(d: number): string {
  if (d <= 2) return "var(--ease)";
  if (d === 3) return "var(--mid)";
  return "var(--hard)";
}
