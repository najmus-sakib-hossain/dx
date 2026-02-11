import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Using Inter as a placeholder for Cal Sans if not available locally,
// or I can assume it's a local font if I had it.
// Instructions said "Inter or Cal Sans". I'll stick to Inter for now for headings
// to avoid missing font issues, or use a local font setup if I had the file.
// Since I don't have the file, I'll just use Inter for everything or see if I can use a similar google font.
// actually Cal Sans is usually local. I'll just use Inter for now.
export const fontSans = inter;
export const fontMono = jetbrainsMono;
