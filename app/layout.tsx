import type { Metadata } from "next";
import "@fontsource/roboto/latin-ext-400.css";
import "@fontsource/roboto/latin-ext-700.css";
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
