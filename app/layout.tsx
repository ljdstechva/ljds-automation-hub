import type { Metadata } from "next";
import { Archivo, Syne } from "next/font/google";
import Script from "next/script";
import { ThemeInitScript } from "@/components/theme-init-script";
import "./globals.css";

const displayFont = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ljds-automation-hub.vercel.app"),
  title: {
    default: "Laurenz Julian | AI Automation Specialist | LJDS Tech",
    template: "%s | LJDS Tech",
  },
  description:
    "Portfolio of Laurenz Julian: AI automation specialist building reliable workflow systems with n8n, OpenAI, GoHighLevel, and custom integrations.",
  icons: {
    icon: "/icon.png",
  },
  keywords: [
    "AI automation specialist",
    "n8n automation",
    "workflow engineering",
    "OpenAI automation",
    "GoHighLevel automation",
    "portfolio",
  ],
  openGraph: {
    title: "LJDS Tech | AI Automation Specialist",
    description:
      "Real automation systems that reduce manual work, improve response speed, and scale business operations.",
    siteName: "LJDS Tech",
    type: "website",
    images: [
      {
        url: "/media/branding/logo-horizontal-light.png",
        width: 1200,
        height: 630,
        alt: "LJDS Tech",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        {children}
        <Script
          src="https://daily-sod.vercel.app/widget.js"
          strategy="afterInteractive"
          data-client-id="d43144d9-79b4-41e3-99fe-dad106277b67"
        />
      </body>
    </html>
  );
}
