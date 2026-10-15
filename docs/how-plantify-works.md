# How Plantify works

A plain-English guide to Plantify's code, written by the Software Factory's
builder on 15 October 2026 after reading every file in the app.

## The short version

**Plantify is a blank starting point right now.** The app's code contains one
welcome page and the factory's standard setup (analytics, tests, hosting).
None of the plant features have been built in this app's code yet: there is
no photo screen, no plant identification, no care advice and no watering
tracker. If you have seen these features somewhere else (for example an older
version of Plantify, or a prototype made with another tool), that code is
**not** in this app's code, so the factory can't see or reuse it.

The good news: there is nothing fragile to work around. The factory can build
each feature cleanly, one backlog item at a time.

## The screens

### Home page (the only page that exists)

Opening the website shows the name "Plantify" and one sentence saying the app
is ready for backlog items. It has no buttons and does nothing else.

### Taking a photo

**Not built yet.** There is no camera button and no way to choose a picture.
When it is built, phones can open the camera straight from a web page, so a
separate phone app isn't needed.

### Identifying the plant

**Not built yet.** Nothing sends a photo anywhere or names a plant.

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

**None is connected yet.** The app has no AI service and no setting or key for
one. The only settings the app uses today are for analytics:

| Setting | What it's for |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Lets the app send usage counts to PostHog (analytics) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Which PostHog address to send them to (the EU one) |

Identifying plants will need a new key from whichever service is chosen (for
example Plant.id, PlantNet, or a general AI model that can look at photos,
such as Claude). The factory will ask you for that key through its secure form
when the time comes; you never need to paste it anywhere yourself.

## Anything fragile or unusual

- **Analytics switch themselves off quietly** if the PostHog key is missing.
  The site still works, but no usage is recorded and nothing warns you.
- **The page title and description** still use the factory's starter wording
  ("built by the Software Factory") rather than describing Plantify.
- **The website uses a very new version of Next.js** (the toolkit it is built
  with). It works, but it behaves differently from older versions, so the
  builder has to check the toolkit's own notes before using unfamiliar parts.
- There are no other surprises: the code is small, tidy and fully tested.

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
