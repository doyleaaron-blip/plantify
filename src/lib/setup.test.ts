import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { APP_NAME } from "./app";

// These checks make sure the factory can install, build and publish Plantify
// from a clean start, with nothing borrowed from someone's own computer.
const root = path.resolve(import.meta.dirname, "../..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? sourceFiles(full) : [full];
  });
}

describe("clean setup", () => {
  it("has a lockfile so every install gets the same packages", () => {
    expect(existsSync(path.join(root, "package-lock.json"))).toBe(true);
    expect(lock.packages[""].dependencies).toEqual(pkg.dependencies);
    expect(lock.packages[""].devDependencies).toEqual(pkg.devDependencies);
  });

  it("downloads every package from the public npm registry, not a local folder or private link", () => {
    for (const [name, entry] of Object.entries<{ resolved?: string; link?: boolean }>(lock.packages)) {
      if (!name) continue;
      expect(entry.link, name).toBeUndefined();
      if (entry.resolved) expect(entry.resolved, name).toMatch(/^https:\/\/registry\.npmjs\.org\//);
    }
    for (const version of Object.values<string>({ ...pkg.dependencies, ...pkg.devDependencies })) {
      expect(version).not.toMatch(/^(file:|link:|git|github:|\/|\.)/);
    }
  });

  it("uses the same Node.js version as the factory's checks", () => {
    expect(pkg.engines.node).toBe("22.x");
    expect(read(".nvmrc").trim()).toBe("22");
  });

  it("has the commands the factory runs", () => {
    for (const script of ["dev", "build", "start", "check"]) expect(pkg.scripts[script]).toBeTruthy();
  });

  it("doesn't point at folders on someone's own computer", () => {
    const files = [...sourceFiles(path.join(root, "src")), ...["package.json", "next.config.ts", "tsconfig.json"].map((f) => path.join(root, f))];
    for (const file of files) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/(\/Users\/|\/home\/|[A-Z]:\\\\Users)/);
    }
  });

  it("lists every setting the app reads in .env.example", () => {
    const example = read(".env.example");
    const used = new Set(sourceFiles(path.join(root, "src")).flatMap((f) => [...readFileSync(f, "utf8").matchAll(/process\.env\.([A-Z0-9_]+)/g)].map((m) => m[1])));
    for (const name of used) expect(example).toContain(`${name}=`);
  });
});

describe("home page", () => {
  it("opens without any settings and shows the app's name", () => {
    const html = renderToStaticMarkup(createElement(Home));
    expect(html).toContain(APP_NAME);
  });
});
