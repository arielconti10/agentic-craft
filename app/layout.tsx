import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "@/index.css"

/* The PP Neue Montreal free cut ships no Medium (500), and font-medium is
   the site's dominant emphasis tier. The scale shifts down one face: Text
   Book (350) takes body duty at 400, Regular steps up to 500, Semibold
   holds 600 — keeping normal/medium/semibold visually distinct. */
const neueMontreal = localFont({
  src: [
    {
      path: "./fonts/pp-neue-montreal-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/pp-neue-montreal-text-book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/pp-neue-montreal-text-book-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/pp-neue-montreal-regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/pp-neue-montreal-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/pp-neue-montreal-semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  adjustFontFallback: "Arial",
  variable: "--font-neue-montreal",
})

/* Klim test cut of Signifier — limited character set; missing glyphs fall
   back to the metric-adjusted Times fallback next/font generates. */
const signifier = localFont({
  src: [
    {
      path: "./fonts/test-signifier-vf-roman.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/test-signifier-vf-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  adjustFontFallback: "Times New Roman",
  variable: "--font-signifier",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://agentic-craft.vercel.app"),
  title: {
    default: "Agentic Craft",
    template: "%s · Agentic Craft",
  },
  description:
    "Reference guide for designing agentic product interfaces beyond chat",
  openGraph: {
    title: "Agentic Craft",
    description:
      "Interaction patterns for agent orchestration, tool use, approvals, memory, and observability.",
    url: "/",
    siteName: "Agentic Craft",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Agentic Craft",
    description:
      "Interaction patterns for agent orchestration, tool use, approvals, memory, and observability.",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
}

const themeInitializerScript = `
  (function () {
    try {
      var storageKey = "agentic-craft-theme";
      var storedTheme = window.localStorage.getItem(storageKey);
      var theme =
        storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
          ? storedTheme
          : "system";
      var resolved =
        theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme;
      var root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.dataset.theme = theme;
      root.dataset.resolvedTheme = resolved;
      root.style.colorScheme = resolved;
    } catch (error) {}
  })();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${neueMontreal.variable} ${signifier.variable}`}
    >
      <body>
        {/* Plain inline script (not next/script): it must run synchronously
            during HTML parsing, before any content paints, or dark-mode
            loads flash the light theme. */}
        <script
          id="agentic-craft-theme"
          dangerouslySetInnerHTML={{ __html: themeInitializerScript }}
        />
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-50 -translate-y-16 rounded-md bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-1 ring-border transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <TooltipProvider>
          <ThemeProvider defaultTheme="system">
            <SidebarProvider
              style={{ "--sidebar-width": "220px" } as React.CSSProperties}
            >
              <AppSidebar />
              <SidebarInset>
                <div className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur md:static md:h-10 md:justify-start md:border-0 md:bg-transparent md:backdrop-blur-none">
                  <SidebarTrigger className="-ml-1" />
                  <span className="text-sm font-semibold tracking-tight md:hidden">
                    Agentic Craft
                  </span>
                  <span className="size-7 md:hidden" aria-hidden="true" />
                </div>
                <main
                  id="main-content"
                  tabIndex={-1}
                  className="min-w-0 flex-1 overflow-auto"
                >
                  <div className="mx-auto w-full max-w-[860px] px-4 pt-8 pb-24 sm:px-10">
                    {children}
                  </div>
                </main>
                <footer className="border-t border-dashed border-border/40 px-4 py-8 text-center text-xs text-muted-foreground sm:px-8">
                  <a
                    href="https://github.com/bitcomplete/agentic-craft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-8 items-center transition-colors hover:text-foreground"
                  >
                    Agentic Craft — Open Source
                  </a>
                </footer>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
