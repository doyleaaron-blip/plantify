import { APP_DESCRIPTION, APP_NAME, PLANNED_FEATURES } from "@/lib/app";
import IdentifyForm from "./identify-form";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">🌱 {APP_NAME}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{APP_DESCRIPTION}</p>
      </header>
      <IdentifyForm />
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Coming soon</h2>
        <ul className="flex flex-col gap-3">
          {PLANNED_FEATURES.map((feature) => (
            <li key={feature.title} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="font-medium">{feature.title}</p>
              <p className="text-zinc-600 dark:text-zinc-400">{feature.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
