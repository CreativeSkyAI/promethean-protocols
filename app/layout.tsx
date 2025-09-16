import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "PROMPROT // Promethean Protocols",
  description:
    "Access restricted. Authorized personnel only. Interactive cyberpunk terminal interface for the digital underground.",
  keywords: ["cyberpunk", "terminal", "hacker", "interactive", "web interface", "promethean protocols"],
  authors: [{ name: "$κιηηεя", url: "https://github.com/promprot" }],
  creator: "$κιηηεя",
  publisher: "PROMPROT",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://promprot.com",
    title: "PROMPROT // Promethean Protocols",
    description:
      "Access restricted. Authorized personnel only. Interactive cyberpunk terminal interface for the digital underground.",
    siteName: "PROMPROT",
    images: [
      {
        url: "/promprot-preview.png",
        width: 1200,
        height: 630,
        alt: "PROMPROT Cyberpunk Terminal Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PROMPROT // Promethean Protocols",
    description: "Access restricted. Authorized personnel only.",
    creator: "@promproto",
    images: ["/promprot-preview.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/android-icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/android-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/android-icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/android-icon-36x36.png", sizes: "36x36", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://promprot.com"),
  alternates: {
    canonical: "https://promprot.com",
  },
  other: {
    "theme-color": "#00ff00",
    "color-scheme": "dark",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${dmSans.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
