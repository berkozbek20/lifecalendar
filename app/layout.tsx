import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Calendar Wallpaper",
  description: "Generate a life calendar wallpaper from your birth date and preferred colors.",
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
