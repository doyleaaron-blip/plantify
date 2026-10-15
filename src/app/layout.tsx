import type { Metadata } from "next";
import { APP_NAME } from "@/lib/app";
import "./globals.css";

export const metadata: Metadata = { title: APP_NAME, description: `${APP_NAME}, built by the Software Factory.` };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
