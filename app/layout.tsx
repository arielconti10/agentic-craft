import type { Metadata } from 'next'
import { Albert_Sans, Source_Serif_4 } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/theme-provider'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import '@/index.css'

const albertSans = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Agentic Craft',
  description: 'Agentic Design System — Interactive Component Showcase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${albertSans.variable} ${sourceSerif4.variable}`}>
      <body>
        <TooltipProvider>
          <ThemeProvider>
            <SidebarProvider
              style={{ '--sidebar-width': '220px' } as React.CSSProperties}
            >
              <AppSidebar />
              <SidebarInset>
                <div className="fixed top-3 left-3 z-40 group-data-[state=expanded]/sidebar-wrapper:hidden">
                  <SidebarTrigger className="h-8 w-8 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm" />
                </div>
                <div className="flex h-10 items-center px-4 md:hidden">
                  <SidebarTrigger />
                </div>
                <main className="flex-1 overflow-auto">
                  <div className="mx-auto max-w-[860px] px-6 sm:px-10 pt-12 pb-24">
                    {children}
                  </div>
                </main>
                <footer className="border-t border-dashed border-border/40 px-8 py-8 text-center text-xs text-muted-foreground/60">
                  <a
                    href="https://github.com/arielconti10/agentic-craft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-muted-foreground transition-colors"
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
