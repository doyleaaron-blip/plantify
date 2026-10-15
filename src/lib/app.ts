// The app's name and short-name, set when the factory created it.
export const APP_NAME = "Plantify";
export const APP_SLUG = "plantify";

export function welcomeMessage(): string {
  return `${APP_NAME} is ready. Add backlog items for it in the Software Factory and the builder will make them.`;
}
