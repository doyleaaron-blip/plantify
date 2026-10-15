import Anthropic from "@anthropic-ai/sdk";

// Plant identification with Claude. Runs on the server only: the key is read
// from the app's private settings (ANTHROPIC_API_KEY) and never sent to the
// browser or written into the code.

export const UNAVAILABLE_MESSAGE = "Plant identification is unavailable right now. Please try again later.";
export const NOT_A_PLANT_MESSAGE = "We couldn't spot a plant in that photo. Try a clearer, closer photo of the plant.";

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
export type ImageType = (typeof ALLOWED_TYPES)[number];
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export type Identification = { commonName: string; scientificName: string; confidence: "high" | "medium" | "low" };
export type IdentifyResult = { ok: true; plant: Identification } | { ok: false; message: string };

type MessagesClient = Pick<Anthropic["beta"]["messages"], "create">;

const SCHEMA = {
  type: "object",
  properties: {
    isPlant: { type: "boolean" },
    commonName: { type: "string" },
    scientificName: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
  required: ["isPlant", "commonName", "scientificName", "confidence"],
  additionalProperties: false,
};

export function isAllowedType(type: string): type is ImageType {
  return (ALLOWED_TYPES as readonly string[]).includes(type);
}

export async function identifyPlant(
  photo: { data: string; type: ImageType },
  options: { apiKey?: string; client?: MessagesClient } = {},
): Promise<IdentifyResult> {
  const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !options.client) {
    console.error("ANTHROPIC_API_KEY is not set, so plant identification is off.");
    return { ok: false, message: UNAVAILABLE_MESSAGE };
  }
  const client = options.client ?? new Anthropic({ apiKey }).beta.messages;

  try {
    const response = await client.create({
      model: "claude-opus-5-5",
      max_tokens: 1024,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: photo.type, data: photo.data } },
            {
              type: "text",
              text: "Identify the plant in this photo. Give its everyday name and its scientific name. If there is no plant in the photo, set isPlant to false.",
            },
          ],
        },
      ],
    });
    if (response.stop_reason === "refusal") return { ok: false, message: UNAVAILABLE_MESSAGE };
    const text = response.content.find((block) => block.type === "text");
    if (!text || text.type !== "text") return { ok: false, message: UNAVAILABLE_MESSAGE };
    const answer = JSON.parse(text.text) as Identification & { isPlant: boolean };
    if (!answer.isPlant) return { ok: false, message: NOT_A_PLANT_MESSAGE };
    return {
      ok: true,
      plant: { commonName: answer.commonName, scientificName: answer.scientificName, confidence: answer.confidence },
    };
  } catch (error) {
    // A wrong or expired key, an outage, or a bad reply: never crash, just explain.
    if (error instanceof Anthropic.AuthenticationError) console.error("The ANTHROPIC_API_KEY setting was rejected.");
    else console.error("Plant identification failed:", error);
    return { ok: false, message: UNAVAILABLE_MESSAGE };
  }
}
