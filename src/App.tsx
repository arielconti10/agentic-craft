import { Router, Route } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Foundations from "@/pages/foundations"
import Conversation from "@/pages/conversation"
import Actions from "@/pages/actions"
import Previews from "@/pages/previews"
import Navigation from "@/pages/navigation"
import Config from "@/pages/config"
import MultiAgent from "@/pages/multi-agent"
import Monitoring from "@/pages/monitoring"
import Memory from "@/pages/memory"
import Feedback from "@/pages/feedback"
import Trust from "@/pages/trust"
import Output from "@/pages/output"

function App() {
  return (
    <TooltipProvider>
      <Router hook={useHashLocation}>
        <SidebarProvider
          style={{ "--sidebar-width": "220px" } as React.CSSProperties}
        >
          <AppSidebar />
          <SidebarInset>
            {/* Floating sidebar trigger — no header bar */}
            <div className="fixed top-3 left-3 z-40 group-data-[state=expanded]/sidebar-wrapper:hidden">
              <SidebarTrigger className="h-8 w-8 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm" />
            </div>
            <div className="flex h-10 items-center px-4 md:hidden">
              <SidebarTrigger />
            </div>
            <main className="flex-1 overflow-auto">
              <div className="mx-auto max-w-[860px] px-6 sm:px-10 pt-12 pb-24">
                <Route path="/" component={Foundations} />
                <Route path="/conversation" component={Conversation} />
                <Route path="/actions" component={Actions} />
                <Route path="/previews" component={Previews} />
                <Route path="/navigation" component={Navigation} />
                <Route path="/config" component={Config} />
                <Route path="/multi-agent" component={MultiAgent} />
                <Route path="/monitoring" component={Monitoring} />
                <Route path="/memory" component={Memory} />
                <Route path="/feedback" component={Feedback} />
                <Route path="/trust" component={Trust} />
                <Route path="/output" component={Output} />
              </div>
            </main>
            <footer className="border-t border-dashed border-border/40 px-8 py-8 text-center text-xs text-muted-foreground/60">
              <a
                href="https://www.perplexity.ai/computer"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground transition-colors"
              >
                Created with Perplexity Computer
              </a>
            </footer>
          </SidebarInset>
        </SidebarProvider>
      </Router>
    </TooltipProvider>
  )
}

export default App
