import { describe, expect, it } from "vitest";
import { APP_NAME, welcomeMessage } from "./app";

describe("welcomeMessage", () => {
  it("names the app", () => {
    expect(welcomeMessage()).toContain(APP_NAME);
  });
});
