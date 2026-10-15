// The app's name and short-name, set when the factory created it.
export const APP_NAME = "Plantify";
export const APP_SLUG = "plantify";

// One line describing Plantify, used on the home page and in search results.
export const APP_DESCRIPTION = "Snap a photo of a plant to find out what it is, how to care for it and when to water it.";

// The features Plantify is growing into, shown on the home page until each one is built.
export const PLANNED_FEATURES = [
  { title: "Take a photo", detail: "Use your phone's camera or pick a picture you already have." },
  { title: "Identify the plant", detail: "Find out the plant's name from the photo." },
  { title: "Care advice", detail: "See how much light, water and attention it needs." },
  { title: "Watering tracker", detail: "Keep a list of your plants and note when you last watered them." },
] as const;
