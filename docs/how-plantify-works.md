# How Plantify works

A plain-English guide to Plantify's code, written by the Software Factory's
builder on 15 October 2026 after reading every file in the app.

## The short version

**Plantify is at an early stage.** The home page lets you take or choose a
photo of a plant and tells you what it is. There is no care advice and no
watering tracker yet. If you have seen these features somewhere else (for example an older
version of Plantify, or a prototype made with another tool), that code is
**not** in this app's code, so the factory can't see or reuse it.

The good news: there is nothing fragile to work around. The factory can build
each feature cleanly, one backlog item at a time.

## The screens

### Home page (the only page that exists)

Opening the website shows the name "Plantify", one sentence describing what
it is for, the photo button (below), and a "Coming soon" list of the four
main features.

### Taking a photo

The home page has a "Take or choose a plant photo" button. On a phone it
opens the camera straight from the web page, so a separate phone app isn't
needed. Photos are not saved anywhere.

### Identifying the plant

The photo is sent to Claude, which replies with the plant's everyday name and
scientific name. If there is no plant in the photo, the app says so.

### Care advice

**Not built yet.** There are no care tips (light, water, soil) in the app.

### Watering tracker

**Not built yet.** There is no list of your plants, no "I watered it" button
and no reminders.

## Where your plants and watering history are saved

**Nowhere yet.** The app doesn't save anything you do: there is no list of
plants and no watering history, so nothing survives closing the app or
switching phones, because there is nothing to keep.

When this gets built there are two choices, and it matters which one you pick:

- **Saved on the phone only** (in the web browser's storage). Quick to build
  and needs no accounts, but the list is lost if you clear your browser,
  switch phones or use a different browser.
- **Saved online in a database.** Your plants follow you to any phone or
  computer, but it needs a database service and usually a way to sign in.
  The factory's rules say it must ask you before adding a database.

## The AI service that identifies plants

**Claude** (Anthropic's AI) looks at each photo and names the plant. The key
for it lives only in the app's private settings, never in the code:

| Setting | What it's for |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Lets the app send usage counts to PostHog (analytics) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Which PostHog address to send them to (the EU one) |
| `ANTHROPIC_API_KEY` | Lets the app ask Claude to identify plants (kept secret, used on the server only) |

If that key is missing or wrong, people see "Plant identification is
unavailable right now" instead of an error. To change the key, the factory
asks you through its secure form; you never need to paste it anywhere yourself.

## Anything fragile or unusual

- **Analytics switch themselves off quietly** if the PostHog key is missing.
  The site still works, but no usage is recorded and nothing warns you.
- **The website uses a very new version of Next.js** (the toolkit it is built
  with). It works, but it behaves differently from older versions, so the
  builder has to check the toolkit's own notes before using unfamiliar parts.
- There are no other surprises: the code is small, tidy and fully tested.

## Tidy-up progress (15 October 2026)

What happened to each fix in the list below:

- **Done:** fix 7 (the home page now describes Plantify and lists the features
  on the way) and fix 8 (the page title and description now describe Plantify).
- **Skipped, needs your decision first:** fix 1 (phone-only or online saving)
  and fix 2 (which AI service, plus its key). The factory will ask you.
- **Skipped, too big for a tidy-up:** fixes 3, 4, 5 and 6 are whole new
  features, so each should be its own backlog item. Fixes 4 and 6 also wait on
  fixes 2 and 1.
- **Skipped, nothing to record yet:** fix 9. Each feature item should add its
  own analytics event when it is built.

## Recommended fixes and tidy-ups

1. **Decide where plants and watering history are saved (phone only or online)** — every later feature depends on this choice.
2. **Choose the AI service for identifying plants and provide its key** — the identify screen can't be built without one.
3. **Build the "take or upload a photo" screen** — it is the first step of everything else and needs no keys.
4. **Build plant identification using the chosen AI service** — turns the photo into a plant name.
5. **Add care advice for the identified plant** — gives people a reason to come back after identifying.
6. **Build the watering tracker (my plants list and "watered today" button)** — needs the storage decision from step 1.
7. **Replace the starter welcome page with a real Plantify home page** — the current page only says the app is ready for backlog items.
8. **Update the page title and description to describe Plantify** — this is what shows in browser tabs and search results.
9. **Record an analytics event for each new feature (photo taken, plant identified, plant watered)** — so you can see which features people actually use.
