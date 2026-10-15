import { describe, expect, it } from "vitest";
import { APP_DESCRIPTION, PLANNED_FEATURES } from "./app";

describe("app details", () => {
  it("describes Plantify rather than the factory's starter wording", () => {
    expect(APP_DESCRIPTION).toMatch(/plant/i);
    expect(APP_DESCRIPTION).not.toMatch(/Software Factory/);
  });

  it("lists the four main features", () => {
    expect(PLANNED_FEATURES.map((f) => f.title)).toEqual(["Take a photo", "Identify the plant", "Care advice", "Watering tracker"]);
  });
});
