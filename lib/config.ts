export const WAKE_PHRASE =
  process.env.NEXT_PUBLIC_WAKE_PHRASE?.trim() || "Hey OmniCue";

export const GOOGLE_CLOUD_PROJECT_NUMBER =
  process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_NUMBER?.trim() || "";

export const ENABLE_MEET_MEDIA =
  process.env.NEXT_PUBLIC_ENABLE_MEET_MEDIA === "true";

export const GOOGLE_OAUTH_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID?.trim() || "";

export function getMainStageUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_MAIN_STAGE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window === "undefined") {
    return "/mainstage/";
  }

  return new URL("/mainstage/", window.location.origin).toString();
}

export function hasMeetSdkConfig() {
  return GOOGLE_CLOUD_PROJECT_NUMBER.length > 0;
}
