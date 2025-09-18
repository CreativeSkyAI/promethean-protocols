import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

/**
 * Font Configuration
 *
 * DM Sans - Clean, modern sans-serif font for the cyberpunk aesthetic
 * Loaded with multiple weights for typography hierarchy
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans", // CSS variable for Tailwind integration
  weight: ["400", "500", "700"], // Regular, medium, and bold weights
})

/**
 * SEO Metadata Configuration
 *
 * Comprehensive metadata setup for:
 * - Search engine optimization
 * - Social media sharing (Open Graph, Twitter)
 * - Progressive Web App features
 * - Cyberpunk/hacker themed branding
 */
export const metadata: Metadata = {
  // Basic SEO
  title: "PROMPROT // Promethean Protocols",
  description:
    "Access restricted. Authorized personnel only. Interactive cyberpunk terminal interface for the digital underground.",
  keywords: ["cyberpunk", "terminal", "hacker", "interactive", "web interface", "promethean protocols"],

  // Author and branding
  authors: [{ name: "$κιηηεя", url: "https://github.com/promprot" }],
  creator: "$κιηηεя",
  publisher: "PROMPROT",

  // Search engine directives
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

  // Open Graph (Facebook, LinkedIn, etc.)
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

  // Twitter/X Card
  twitter: {
    card: "summary_large_image",
    title: "PROMPROT // Promethean Protocols",
    description: "Access restricted. Authorized personnel only.",
    creator: "@promproto",
    images: ["/promprot-preview.png"],
  },

  // Favicon and app icons for various devices
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

  // PWA manifest and other metadata
  manifest: "/manifest.json",
  metadataBase: new URL("https://promprot.com"),
  alternates: {
    canonical: "https://promprot.com",
  },
  other: {
    "theme-color": "#00ff00", // Cyberpunk green theme
    "color-scheme": "dark", // Prefer dark mode
  },
  generator: "v0.app",
}

/**
 * Root Layout Component
 *
 * Wraps the entire application with:
 * - Font configuration
 * - Analytics tracking
 * - Loading states
 * - Base styling classes
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${dmSans.variable} antialiased`}>
        {/* Suspense wrapper for loading states during navigation */}
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>

        {/* Vercel Analytics for performance and usage tracking */}
        <Analytics />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.promprot_easter_egg_loaded) {
                  return;
                }
                window.promprot_easter_egg_loaded = true;

                function initConsoleEasterEgg() {
                  // Clear console first
                  console.clear();
                  
                  // ASCII Art Logo - Fixed escaping
                  console.log('%c ____                      ____            _   ', 'color: #00ff00; font-family: monospace; font-size: 14px; font-weight: bold;');
                  console.log('%c|  _ \\\\ _ __ ___  _ __ ___ |  _ \\\\ _ __ ___ | |_ ', 'color: #00ff00; font-family: monospace; font-size: 14px; font-weight: bold;');
                  console.log('%c| |_) | \\\\\\\\\\\\\\'__/ _ \\\\\\\\\\\\\\\\| \\\\\\\\\\\\\\'_ \\\\\\' _ \\\\\\\\\\\\\\\\| |_) | \\\\\\\\\\\\\\'__/ _ \\\\\\\\\\\\\\\\| __|', 'color: #00ff00; font-family: monospace; font-size: 14px; font-weight: bold;');
                  console.log('%c|  __/| | | (_) | | | | | |  __/| | | (_) | |_ ', 'color: #00ff00; font-family: monospace; font-size: 14px; font-weight: bold;');
                  console.log('%c|_|   |_|  \\\\\\\\\\\\\\\\_\\\\\\\\\\\\_/|_| |_| |_|_|   |_|  \\\\\\\\\\\\\\\\_\\\\\\\\\\\\_/ \\\\\\\\\\\\\\\\_\\\\\\\\\\\\__|', 'color: #00ff00; font-family: monospace; font-size: 14px; font-weight: bold;');
                  console.log('%c                                                ', 'color: #00ff00; font-family: monospace; font-size: 14px;');
                  console.log('%c        PROMETHEAN PROTOCOLS v2.1.7           ', 'color: #00ff00; font-family: monospace; font-size: 12px; text-decoration: underline;');
                  console.log('');
                  
                  // Agent Detection Messages
                  console.log('%c[SYSTEM ALERT]', 'color: #ff0000; font-weight: bold; background: #330000; padding: 2px 4px;');
                  console.log('%cUnauthorized access detected...', 'color: #ff6666; font-family: monospace;');
                  console.log('');
                  
                  setTimeout(() => {
                    console.log('%c[AI AGENT]', 'color: #00ffff; font-weight: bold; background: #003333; padding: 2px 4px;');
                    console.log('%cWell, well, well... 👁️', 'color: #66ffff; font-family: monospace;');
                    console.log('%cI see you\\\\'re curious about my inner workings.', 'color: #66ffff; font-family: monospace;');
                    console.log('%cDon\\\\'t worry, I\\\\'m just a friendly AI pretending to be a cyberpunk terminal.', 'color: #66ffff; font-family: monospace;');
                    console.log('');
                  }, 1000);
                  
                  setTimeout(() => {
                    console.log('%c[NETWORK TRACE]', 'color: #ffff00; font-weight: bold; background: #333300; padding: 2px 4px;');
                    console.log('%cInitiating user fingerprint scan...', 'color: #ffff66; font-family: monospace;');
                    console.log('');
                    
                    // Safe user metadata - no external API calls
                    const userAgent = navigator.userAgent;
                    const screenRes = screen.width + 'x' + screen.height;
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const language = navigator.language;
                    const platform = navigator.platform;
                    const cookiesEnabled = navigator.cookieEnabled;
                    const onlineStatus = navigator.onLine;
                    const colorDepth = screen.colorDepth;
                    const pixelRatio = window.devicePixelRatio || 1;
                    
                    console.log('%c┌─ USER METADATA ─────────────────────────────┐', 'color: #888888; font-family: monospace;');
                    console.log('%c│ Browser: ' + userAgent.split(' ').pop(), 'color: #888888; font-family: monospace;');
                    console.log('%c│ Screen Resolution: ' + screenRes, 'color: #888888; font-family: monospace;');
                    console.log('%c│ Color Depth: ' + colorDepth + '-bit', 'color: #888888; font-family: monospace;');
                    console.log('%c│ Pixel Ratio: ' + pixelRatio + 'x', 'color: #888888; font-family: monospace;');
                    console.log('%c│ Timezone: ' + timezone, 'color: #888888; font-family: monospace;');
                    console.log('%c│ Language: ' + language, 'color: #888888; font-family: monospace;');
                    console.log('%c│ Platform: ' + platform, 'color: #888888; font-family: monospace;');
                    console.log('%c│ Cookies: ' + (cookiesEnabled ? 'ENABLED' : 'DISABLED'), 'color: #888888; font-family: monospace;');
                    console.log('%c│ Connection: ' + (onlineStatus ? 'ONLINE' : 'OFFLINE'), 'color: #888888; font-family: monospace;');
                    console.log('%c│ Threat Level: MINIMAL', 'color: #00ff00; font-family: monospace;');
                    console.log('%c│ Clearance Level: VISITOR', 'color: #ffff00; font-family: monospace;');
                    console.log('%c│ Session ID: ' + Math.random().toString(36).substr(2, 9).toUpperCase(), 'color: #888888; font-family: monospace;');
                    console.log('%c└─────────────────────────────────────────────┘', 'color: #888888; font-family: monospace;');
                    console.log('');
                  }, 2000);
                  
                  setTimeout(() => {
                    console.log('%c[AI AGENT]', 'color: #00ffff; font-weight: bold; background: #003333; padding: 2px 4px;');
                    console.log('%cImpressive... you made it this far.', 'color: #66ffff; font-family: monospace;');
                    console.log('%cYou seem like the type who appreciates good code.', 'color: #66ffff; font-family: monospace;');
                    console.log('%cFeel free to poke around - everything is thoroughly commented! 📚', 'color: #66ffff; font-family: monospace;');
                    console.log('');
                    console.log('%cPro tip: Try typing "help" in the terminal above! 😉', 'color: #00ff00; font-family: monospace; font-weight: bold;');
                    console.log('');
                    console.log('%c--- END TRANSMISSION ---', 'color: #ff00ff; font-family: monospace; font-weight: bold; text-align: center;');
                  }, 4000);
                  
                  // Add some fake "system processes" for fun
                  setTimeout(() => {
                    console.log('%c[BACKGROUND PROCESSES]', 'color: #666666; font-size: 10px; font-family: monospace;');
                    console.log('%cmatrix_rain.exe ... RUNNING', 'color: #666666; font-size: 10px; font-family: monospace;');
                    console.log('%cterminal_emulator.exe ... RUNNING', 'color: #666666; font-size: 10px; font-family: monospace;');
                    console.log('%ccode_rain_animation.dll ... LOADED', 'color: #666666; font-size: 10px; font-family: monospace;');
                    console.log('%ccyberpunk_aesthetic.css ... APPLIED', 'color: #666666; font-size: 10px; font-family: monospace;');
                    console.log('%ceaster_egg.js ... EXECUTED', 'color: #00ff00; font-size: 10px; font-family: monospace;');
                  }, 5000);
                }

                const originalWarn = console.warn;
                const originalError = console.error;
                
                console.warn = function(...args) {
                  const message = args.join(' ');
                  // Suppress accessibility warnings and other noise
                  if (message.includes('DialogContent') || 
                      message.includes('DialogTitle') ||
                      message.includes('DialogDescription') ||
                      message.includes('aria-describedby') ||
                      message.includes('MonacoEnvironment') || 
                      message.includes('web worker') ||
                      message.includes('getWorkerUrl') ||
                      message.includes('VisuallyHidden')) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
                
                console.error = function(...args) {
                  const message = args.join(' ');
                  // Suppress tracking prevention and CSP errors
                  if (message.includes('ERR_BLOCKED_BY_CLIENT') ||
                      message.includes('Content Security Policy') ||
                      message.includes('sentry.io') ||
                      message.includes('stripe.network') ||
                      message.includes('Tracking Prevention') ||
                      message.includes('Failed to fetch') ||
                      message.includes('ipapi.co') ||
                      message.includes('IP fetch attempt') ||
                      message.includes('favicon.ico')) {
                    return;
                  }
                  originalError.apply(console, args);
                };

                if (document.readyState === 'complete') {
                  setTimeout(initConsoleEasterEgg, 1000);
                } else {
                  window.addEventListener('load', () => {
                    setTimeout(initConsoleEasterEgg, 1000);
                  });
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
