export interface PlatformOutputs {
  twitter: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  email: string;
  reddit: string;
}

export interface RepurposeRequest {
  text: string;
}

export interface RepurposeResponse {
  outputs: PlatformOutputs;
}

export interface CheckoutRequest {
  plan: "starter" | "lifetime";
}

export interface CheckoutResponse {
  url: string;
}

export interface License {
  email: string;
  plan: "starter" | "lifetime";
  purchasedAt: string;
}

export type Platform = keyof PlatformOutputs;

export const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: "twitter", label: "Twitter/X", icon: "twitter" },
  { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
  { key: "email", label: "Email", icon: "mail" },
  { key: "reddit", label: "Reddit", icon: "message-circle" },
];
