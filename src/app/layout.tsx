import type { Metadata } from "next";
import "./globals.css";
import "./retro.css";
import "./pop.css";
export const metadata: Metadata = {
  title: "The Madam Ji Box™ — A tiny break from everything",
  description:
    "An extremely unnecessary digital happiness experience. Made for Aarushi, by her extremely overqualified intern.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
