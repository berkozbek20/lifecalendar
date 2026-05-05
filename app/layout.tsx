import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Calendar Wallpaper",
  description: "Hayatını, yılını ve hedeflerini minimal kilit ekranı wallpaperlarına dönüştür.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
