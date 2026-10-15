import { APP_NAME, welcomeMessage } from "@/lib/app";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold">{APP_NAME}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{welcomeMessage()}</p>
    </main>
  );
}
