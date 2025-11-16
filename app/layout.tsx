import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hermes News",
  description: "Hermes News is a decentralized news marketplace where publishers can upload content and agents consume it based on an Information Value system. Summaries for new articles are generated using the Gemini API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-brand-dark text-brand-light">{children}</body>
    </html>
  );
}
