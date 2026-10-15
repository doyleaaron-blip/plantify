import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/identify/route";
import { identifyPlant, NOT_A_PLANT_MESSAGE, UNAVAILABLE_MESSAGE } from "./identify";

const root = path.resolve(import.meta.dirname, "../..");
const photo = { data: "aGVsbG8=", type: "image/jpeg" as const };

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? files(full) : [full];
  });
}

function fakeClient(reply: () => unknown) {
  const create = vi.fn(async () => reply());
  return { client: { create } as never, create };
}

const answer = (body: object) => ({ stop_reason: "end_turn", content: [{ type: "text", text: JSON.stringify(body) }] });

afterEach(() => vi.unstubAllEnvs());

describe("the AI key stays out of the code", () => {
  it("has no Anthropic key written into any app file", () => {
    const checked = [...files(path.join(root, "src")), ...["CLAUDE.md", "next.config.ts", "package.json"].map((f) => path.join(root, f))];
    for (const file of checked) expect(readFileSync(file, "utf8"), file).not.toMatch(/sk-ant-[A-Za-z0-9_-]{20,}/);
  });

  it("reads the key from the private ANTHROPIC_API_KEY setting, and lists it for the owner", () => {
    expect(readFileSync(path.join(root, "src/lib/identify.ts"), "utf8")).toContain("process.env.ANTHROPIC_API_KEY");
    expect(readFileSync(path.join(root, "CLAUDE.md"), "utf8")).toContain("`ANTHROPIC_API_KEY`");
    expect(readFileSync(path.join(root, ".env.example"), "utf8")).toMatch(/ANTHROPIC_API_KEY=.*fake/);
  });

  it("never sends the key to the browser", () => {
    for (const file of files(path.join(root, "src")).filter((f) => !f.endsWith(".test.ts"))) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toContain("NEXT_PUBLIC_ANTHROPIC");
      if (source.startsWith('"use client"')) expect(source, file).not.toContain("ANTHROPIC_API_KEY");
    }
  });
});

describe("identifying a plant from a photo", () => {
  it("sends the photo to Claude and returns the plant's name", async () => {
    const { client, create } = fakeClient(() => answer({ isPlant: true, commonName: "Swiss cheese plant", scientificName: "Monstera deliciosa", confidence: "high" }));
    const result = await identifyPlant(photo, { client });
    expect(result).toEqual({ ok: true, plant: { commonName: "Swiss cheese plant", scientificName: "Monstera deliciosa", confidence: "high" } });
    const request = (create.mock.calls[0] as unknown[])[0] as { messages: { content: { type: string; source?: { data: string } }[] }[] };
    expect(request.messages[0].content[0]).toMatchObject({ type: "image", source: { data: photo.data } });
  });

  it("says so kindly when the photo has no plant in it", async () => {
    const { client } = fakeClient(() => answer({ isPlant: false, commonName: "", scientificName: "", confidence: "low" }));
    expect(await identifyPlant(photo, { client })).toEqual({ ok: false, message: NOT_A_PLANT_MESSAGE });
  });

  it("works end to end through the upload address", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const form = new FormData();
    form.append("photo", new File([Buffer.from("hello")], "plant.jpg", { type: "image/jpeg" }));
    const response = await POST(new Request("http://localhost/api/identify", { method: "POST", body: form }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: false, message: UNAVAILABLE_MESSAGE });
  });

  it("asks for a photo when none was sent", async () => {
    const response = await POST(new Request("http://localhost/api/identify", { method: "POST", body: new FormData() }));
    expect(response.status).toBe(400);
    expect((await response.json()).message).toMatch(/choose a photo/);
  });

  it("turns away files that aren't photos", async () => {
    const form = new FormData();
    form.append("photo", new File(["hi"], "notes.txt", { type: "text/plain" }));
    const response = await POST(new Request("http://localhost/api/identify", { method: "POST", body: form }));
    expect(response.status).toBe(400);
  });
});

describe("when the key is missing or wrong", () => {
  it("shows the friendly message if the key isn't set", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await identifyPlant(photo)).toEqual({ ok: false, message: UNAVAILABLE_MESSAGE });
  });

  it("shows the friendly message if Claude rejects the key", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { client } = fakeClient(() => {
      throw new Anthropic.AuthenticationError(401, { error: { type: "authentication_error" } }, "invalid x-api-key", new Headers());
    });
    expect(await identifyPlant(photo, { client })).toEqual({ ok: false, message: UNAVAILABLE_MESSAGE });
  });

  it("shows the friendly message if Claude is down or replies oddly", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const down = fakeClient(() => {
      throw new Error("network down");
    });
    expect(await identifyPlant(photo, { client: down.client })).toEqual({ ok: false, message: UNAVAILABLE_MESSAGE });
    const odd = fakeClient(() => ({ stop_reason: "end_turn", content: [{ type: "text", text: "not json" }] }));
    expect(await identifyPlant(photo, { client: odd.client })).toEqual({ ok: false, message: UNAVAILABLE_MESSAGE });
  });

  it("uses the message the owner asked for", () => {
    expect(UNAVAILABLE_MESSAGE).toContain("Plant identification is unavailable right now");
  });
});
