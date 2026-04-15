import { License } from "@/types";

const USAGE_KEY = "contentspark_usage_count";
const LICENSE_KEY = "contentspark_license";
const FREE_LIMIT = 2;

export function getUsageCount(): number {
  if (typeof window === "undefined") return 0;
  const count = localStorage.getItem(USAGE_KEY);
  return count ? parseInt(count, 10) : 0;
}

export function incrementUsage(): number {
  const current = getUsageCount();
  const next = current + 1;
  localStorage.setItem(USAGE_KEY, String(next));
  return next;
}

export function getRemainingFreeUses(): number {
  return Math.max(0, FREE_LIMIT - getUsageCount());
}

export function getLicense(): License | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LICENSE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as License;
  } catch {
    return null;
  }
}

export function setLicense(license: License): void {
  localStorage.setItem(LICENSE_KEY, JSON.stringify(license));
}

export function isPaidUser(): boolean {
  return getLicense() !== null;
}

export function canGenerate(): boolean {
  return isPaidUser() || getUsageCount() < FREE_LIMIT;
}
