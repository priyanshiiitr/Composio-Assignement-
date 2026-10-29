import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OAuth Pathfinder",
  description:
    "Actionable OAuth app setup and approval guides for Composio developers and AI agent builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
