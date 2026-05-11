import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Tools Wizard | BairesDev",
  description:
    "Five questions, ranked recommendations, and the full inventory of every AI tool worth knowing in 2026. Built by BairesDev.",
  openGraph: {
    title: "AI Tools Wizard | Find the right AI tool in 60 seconds",
    description:
      "Five questions, ranked recommendations, and the full inventory of every AI tool worth knowing in 2026.",
    type: "website",
    siteName: "BairesDev",
  },
};

// Fonts load via a stylesheet link rather than `next/font` so the project
// builds in any environment without network access to fonts.googleapis.com.
// Per the BairesDev brand book, we use Outfit (medium for headlines, light
// for display, bold for emphasis, regular for body).
// Inline script to apply the theme class before paint so the page never
// flashes the wrong palette. Reads stored preference, falls back to OS.
const themeBootstrap = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    if (dark) document.documentElement.classList.add('dark');
  } catch (_) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
