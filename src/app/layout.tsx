import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/app";
import "./globals.css";

export const metadata: Metadata = { title: APP_NAME, description: APP_DESCRIPTION };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
