import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const guide = readFileSync(path.resolve(import.meta.dirname, "../../docs/how-plantify-works.md"), "utf8");

describe("how Plantify works guide", () => {
  it("explains each main screen", () => {
    for (const heading of ["### Taking a photo", "### Identifying the plant", "### Care advice", "### Watering tracker"]) {
      expect(guide).toContain(heading);
    }
  });

  it("says where plants and watering history are stored and whether they survive", () => {
    expect(guide).toContain("## Where your plants and watering history are saved");
    expect(guide).toMatch(/closing the app/);
    expect(guide).toMatch(/switching phones/);
  });

  it("covers the AI service and the settings it needs", () => {
    expect(guide).toContain("## The AI service that identifies plants");
    expect(guide).toContain("NEXT_PUBLIC_POSTHOG_KEY");
  });

  it("ends with a numbered list of fixes, each with a one-line reason", () => {
    const last = guide.trimEnd().split("\n## ").at(-1)!;
    expect(last.startsWith("Recommended fixes")).toBe(true);
    const items = last.split("\n").filter((line) => /^\d+\. /.test(line));
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item, i) => {
      expect(item.startsWith(`${i + 1}. `)).toBe(true);
      expect(item).toContain(" — ");
    });
  });
});
