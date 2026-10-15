import posthog from "posthog-js";
import { APP_SLUG } from "@/lib/app";

// Product analytics (PostHog, EU), required for every app the factory builds:
// page views, clicks, errors and session replays with every input masked.
// Every event is tagged with this app's short-name so the factory's Analytics
// tab can show each app separately.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
if (key) {
  try {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      defaults: "2025-05-24",
      person_profiles: "identified_only",
      capture_exceptions: true,
      session_recording: { maskAllInputs: true },
    });
    posthog.register({ app: APP_SLUG });
  } catch (error) {
    console.error("PostHog didn't start:", error);
  }
}
