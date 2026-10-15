"use client";

import posthog from "posthog-js";
import { useState } from "react";
import type { IdentifyResult } from "@/lib/identify";

export default function IdentifyForm() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    posthog.capture("photo_taken");
    setBusy(true);
    setResult(null);
    try {
      const body = new FormData();
      body.append("photo", file);
      const response = await fetch("/api/identify", { method: "POST", body });
      const data = (await response.json()) as IdentifyResult;
      setResult(data);
      posthog.capture(data.ok ? "plant_identified" : "plant_identification_failed");
    } catch {
      setResult({ ok: false, message: "Plant identification is unavailable right now. Please try again later." });
      posthog.capture("plant_identification_failed");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <label className="w-fit cursor-pointer rounded-lg bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800">
        {busy ? "Identifying your plant…" : "Take or choose a plant photo"}
        <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onChange} disabled={busy} />
      </label>
      {result?.ok && (
        <p role="status" className="text-lg">
          This looks like <strong>{result.plant.commonName}</strong> <em>({result.plant.scientificName})</em>.
          {result.plant.confidence === "low" && " We're not very sure, so try another photo to double-check."}
        </p>
      )}
      {result && !result.ok && (
        <p role="alert" className="text-amber-700 dark:text-amber-400">
          {result.message}
        </p>
      )}
    </section>
  );
}
