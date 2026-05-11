import type { AppSession } from "@/types";
import type { Template } from "@/types";

export function isPremiumUser(session: AppSession | null): boolean {
  if (!session) return false;
  return session.user.subscription === "PREMIUM";
}

export function canAccessTemplate(
  session: AppSession | null,
  template: Template
): boolean {
  if (template.tier === "FREE") return true;
  return isPremiumUser(session);
}
