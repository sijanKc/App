import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, Mukta, Hind, Noto_Serif_Devanagari } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// ── Latin base font ─────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ── Nepali / Devanagari fonts ────────────────────────────────────────────────
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto",
  weight: ["400", "500", "700"],
  display: "swap",
});

const mukta = Mukta({
  subsets: ["devanagari"],
  variable: "--font-mukta",
  weight: ["400", "500", "700"],
  display: "swap",
});

const hind = Hind({
  subsets: ["devanagari"],
  variable: "--font-hind",
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-tiro",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "टाइपिंग अभ्यास | Typing Practice — Nepali & English",
  description:
    "A modern Nepali & English typing practice app with real-time WPM tracking, accuracy measurement, multiple Devanagari font support and beautiful Nepal-inspired UI.",
  keywords: ["nepali typing", "typing practice", "WPM", "devanagari", "unicode"],
  openGraph: {
    title: "टाइपिंग अभ्यास | Typing Practice",
    description: "Practice Nepali & English typing with real-time feedback",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ne"
      suppressHydrationWarning
      className={`
        ${inter.variable}
        ${notoSansDevanagari.variable}
        ${mukta.variable}
        ${hind.variable}
        ${notoSerifDevanagari.variable}
      `}
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
