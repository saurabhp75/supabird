import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twitter/X clone",
  description: "App using Nextjs and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-gray-900 min-h-screen flex">{children}</div>
      </body>
    </html>
  );
}
