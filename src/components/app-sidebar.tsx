import { Link, useLocation } from "wouter"
import { useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Layers01Icon,
  BubbleChatIcon,
  ZapIcon,
  Compass01Icon,
  Activity01Icon,
  Shield01Icon,
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
  GridIcon,
  DashboardSpeed01Icon,
  Brain01Icon,
  CodeIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const sections = [
  {
    title: "Foundations",
    path: "/",
    icon: Layers01Icon,
    subs: [
      { title: "UX → AX Paradigm", id: "ux-ax" },
      { title: "Principles", id: "principles" },
      { title: "Pattern Taxonomy", id: "taxonomy" },
      { title: "Autonomy Spectrum", id: "autonomy-spectrum" },
      { title: "Design Tokens", id: "tokens" },
    ],
  },
  {
    title: "Conversation",
    path: "/conversation",
    icon: BubbleChatIcon,
    subs: [
      { title: "Messages", id: "messages" },
      { title: "Agent Prose", id: "prose" },
      { title: "Citations", id: "citations" },
      { title: "Streaming", id: "streaming" },
      { title: "Thinking Blocks", id: "thinking" },
      { title: "Composer", id: "composer" },
    ],
  },
  {
    title: "Agent Actions",
    path: "/actions",
    icon: ZapIcon,
    subs: [
      { title: "Tool Calls", id: "tool-calls" },
      { title: "Subagent Cards", id: "subagents" },
      { title: "Parallel Execution", id: "parallel" },
      { title: "Plan Cards", id: "plans" },
      { title: "Ask Blocks", id: "ask-blocks" },
      { title: "Decision Blocks", id: "decisions" },
    ],
  },
  {
    title: "Rich Previews",
    path: "/previews",
    icon: CheckmarkCircle01Icon,
    subs: [
      { title: "Service Cards", id: "service-cards" },
      { title: "Approval Flows", id: "approvals" },
      { title: "HITL Gates", id: "hitl-gates" },
      { title: "Wayfinders", id: "wayfinders" },
    ],
  },
  {
    title: "Navigation",
    path: "/navigation",
    icon: Compass01Icon,
    subs: [
      { title: "Command Palette", id: "command-palette" },
      { title: "Context Banners", id: "banners" },
      { title: "Scope Banners", id: "scope-banners" },
      { title: "Thread Sidebar", id: "threads" },
      { title: "Context Panel", id: "context-panel" },
    ],
  },
  {
    title: "Agent Config",
    path: "/config",
    icon: Settings01Icon,
    subs: [
      { title: "Config Wizard", id: "config-wizard" },
      { title: "Autonomy Controls", id: "autonomy-controls" },
      { title: "Rule Builder", id: "rule-builder" },
      { title: "Agent Preview", id: "agent-preview" },
      { title: "Connector Cards", id: "connectors" },
    ],
  },
  {
    title: "Multi-Agent Views",
    path: "/multi-agent",
    icon: GridIcon,
    subs: [
      { title: "Kanban Board", id: "kanban" },
      { title: "Mission Control", id: "dashboard" },
      { title: "Agent Inbox", id: "inbox" },
      { title: "Task List", id: "task-list" },
      { title: "Calendar", id: "calendar" },
    ],
  },
  {
    title: "Monitoring",
    path: "/monitoring",
    icon: DashboardSpeed01Icon,
    subs: [
      { title: "Overview Panel", id: "overview" },
      { title: "Activity Log", id: "activity-log" },
      { title: "Work Reports", id: "work-reports" },
      { title: "Scheduled Tasks", id: "scheduled-tasks" },
      { title: "Cost & Usage", id: "cost-usage" },
    ],
  },
  {
    title: "Memory & Knowledge",
    path: "/memory",
    icon: Brain01Icon,
    subs: [
      { title: "Memory UI", id: "memory-ui" },
      { title: "Cross-Session", id: "cross-session" },
      { title: "Context Ring", id: "context-ring" },
      { title: "RAG Scoping", id: "rag-scoping" },
      { title: "Connector Catalog", id: "connector-catalog" },
    ],
  },
  {
    title: "Feedback & Errors",
    path: "/feedback",
    icon: Activity01Icon,
    subs: [
      { title: "Toasts", id: "toasts" },
      { title: "Progress", id: "progress" },
      { title: "Empty States", id: "empty-states" },
      { title: "Error Recovery", id: "error-recovery" },
      { title: "Rating & Correction", id: "rating" },
    ],
  },
  {
    title: "Trust & Governance",
    path: "/trust",
    icon: Shield01Icon,
    subs: [
      { title: "Trust Builders", id: "trust-builders" },
      { title: "Agent Identity", id: "agent-identity" },
      { title: "Guardrails", id: "guardrails" },
      { title: "Handoff & Escalation", id: "handoff" },
    ],
  },
  {
    title: "Multi-Modal Output",
    path: "/output",
    icon: CodeIcon,
    subs: [
      { title: "Code Blocks", id: "code-blocks" },
      { title: "Data Tables", id: "data-tables" },
      { title: "Artifacts Panel", id: "artifacts" },
      { title: "Rich Outputs", id: "rich-outputs" },
    ],
  },
]

export function AppSidebar() {
  const [location, navigate] = useLocation()

  const scrollToSection = useCallback(
    (sectionPath: string, elementId: string) => {
      const doScroll = () => {
        requestAnimationFrame(() => {
          const el = document.getElementById(elementId)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        })
      }

      if (location !== sectionPath) {
        navigate(sectionPath)
        setTimeout(doScroll, 100)
      } else {
        doScroll()
      }
    },
    [location, navigate]
  )

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-sm font-semibold tracking-tight">
            Agentic DS
          </span>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            v2
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => {
          const isActive = location === section.path
          return (
            <SidebarGroup key={section.path}>
              <Collapsible defaultOpen={isActive}>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <CollapsibleTrigger className="w-full [&[data-panel-open]>div>svg:last-child]:rotate-180">
                      <SidebarMenuButton
                        render={<Link href={section.path} />}
                        isActive={isActive}
                      >
                        <HugeiconsIcon
                          icon={section.icon}
                          size={16}
                          strokeWidth={1.5}
                        />
                        <span>{section.title}</span>
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="ml-auto transition-transform duration-200"
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.subs.map((sub) => (
                          <SidebarMenuSubItem key={sub.id}>
                            <SidebarMenuSubButton
                              render={
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    scrollToSection(section.path, sub.id)
                                  }}
                                />
                              }
                              size="sm"
                            >
                              <span>{sub.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </SidebarMenu>
              </Collapsible>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
