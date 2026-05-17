import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniCue",
  description: "Voice-triggered Google Meet add-on prototype"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
