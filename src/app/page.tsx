import { APP_NAME } from "@/lib/app";
import IdentifyForm from "./identify-form";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold">{APP_NAME}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Take a photo of a plant and we&apos;ll tell you what it is.</p>
      <IdentifyForm />
    </main>
  );
}
