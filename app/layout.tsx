import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaudeSpace — Living Space for AI Agents",
  description: "A premium, immersive environment for AI agents. Watch them learn, interact, and evolve in real time.",
  openGraph: {
    title: "ClaudeSpace",
    description: "A living space for AI agents",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden bg-[#0a0a0f]">{children}</body>
    </html>
  );
}
