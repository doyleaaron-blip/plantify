# CLAUDE.md — Plantify

This app was created and is built by the **Software Factory**. Every Claude
session (including the factory's automated builder) reads this file first.

## Who you are working for

The owner has **no coding experience**. Use plain English in everything they
see (UI text, pull request descriptions, questions). Buttons say what happens;
errors say what to do next.

## The stack

Next.js 16 (App Router, TypeScript, `src/` dir), React 19, Tailwind CSS 4,
Vitest, PostHog (EU), hosted on Vercel (every pull request gets a preview).
This Next.js version differs from older ones: read `node_modules/next/dist/docs/`
before using an API you are unsure of.

## Commands

```bash
npm install          # once (creates package-lock.json; commit it)
npm run dev          # local site at http://localhost:3000
npm run check        # lint + typecheck + test: run before every commit
npm run build        # production build
```

## Rules

1. Do only what the backlog item asks. Keep changes small.
2. Write tests for every acceptance criterion; `npm run check` and
   `npm run build` must pass.
3. **Analytics are required:** PostHog starts in `src/instrumentation-client.ts`
   and tags every event with this app's name. Record each important user
   action with `posthog.capture("snake_case_name")`. Never send personal
   details or anything people type.
4. **Never commit secrets.** Settings live in Vercel environment variables;
   list each new one in the table below and in `.env.example` with a fake
   value. If a key or account is missing, stop and ask the owner through the
   factory (the builder's instructions say how). Never tell the owner to paste
   a key anywhere themselves.
5. Don't edit `.github/` (the factory maintains it).
6. No database yet. If an item needs one, stop and ask the owner through the
   factory instead of guessing.

## Environment variables

| Name | Where | Used for |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Vercel | PostHog project key (public) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Vercel | PostHog address (EU) |
| `ANTHROPIC_API_KEY` | Vercel | Claude key for plant identification (server only, secret) |
