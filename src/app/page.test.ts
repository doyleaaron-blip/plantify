import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { APP_DESCRIPTION, APP_NAME, PLANNED_FEATURES } from "@/lib/app";
import { metadata } from "./layout";
import Home from "./page";

describe("Plantify home page", () => {
  const html = renderToStaticMarkup(createElement(Home));

  it("replaces the starter welcome message with a description of Plantify", () => {
    expect(html).toContain(APP_NAME);
    expect(html).toContain(APP_DESCRIPTION);
    expect(html).not.toContain("ready for backlog items");
    expect(html).not.toContain("Software Factory");
  });

  it("shows each main feature that is on the way", () => {
    for (const feature of PLANNED_FEATURES) expect(html).toContain(feature.title);
  });
});

describe("page title and description", () => {
  it("describe Plantify in browser tabs and search results", () => {
    expect(metadata.title).toBe(APP_NAME);
    expect(metadata.description).toBe(APP_DESCRIPTION);
    expect(String(metadata.description)).not.toMatch(/Software Factory/);
  });
});
