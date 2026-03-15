import { useState, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Add01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
  Notification01Icon,
  Alert01Icon,
  Wrench01Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "navigation-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes nav-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes nav-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes nav-press {
      0% { transform: scale(1); }
      40% { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    @keyframes nav-highlight {
      from { background-color: var(--color-accent); }
      to { background-color: transparent; }
    }
    @keyframes nav-expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 400px; opacity: 1; }
    }
    @keyframes nav-badge-pop {
      0% { transform: scale(0); }
      60% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    .nav-slide-in {
      animation: nav-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .nav-fade-in {
      animation: nav-fade-in 0.2s ease forwards;
    }
    .nav-press {
      animation: nav-press 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .nav-highlight {
      animation: nav-highlight 0.8s ease forwards;
    }
    .nav-expand {
      animation: nav-expand 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
    }
    .nav-badge-pop {
      animation: nav-badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Controls                                                           */
/* ------------------------------------------------------------------ */

function Controls({
  options,
  active,
  onToggle,
}: {
  options: { key: string; label: string }[]
  active: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-5">
      <span className="section-label mr-1">Controls</span>
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onToggle(opt.key)}
          className={`
            relative text-xs px-2.5 py-1 rounded-md border transition-all duration-200
            ${active[opt.key]
              ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }
          `}
        >
          {opt.label}
          {active[opt.key] && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
          )}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  S1 — Command Palette                                               */
/* ------------------------------------------------------------------ */

const PALETTE_ACTIONS = [
  { label: "New evaluation thread", shortcut: "⌘N", category: "Actions" },
  { label: "Search all threads", shortcut: "⌘F", category: "Actions" },
  { label: "Toggle sidebar", shortcut: "⌘B", category: "Actions" },
  { label: "Export report", shortcut: "⌘E", category: "Actions" },
]

const PALETTE_THREADS = [
  { label: "CC EAL5 Gap Analysis — PP-0435", category: "Recent Threads" },
  { label: "CRA Article 11 Evidence Mapping", category: "Recent Threads" },
  { label: "TOE Boundary Review — v3.2", category: "Recent Threads" },
]

const PALETTE_DOCS = [
  { label: "Security Target v3.1.pdf", category: "Documents" },
  { label: "Protection Profile PP-CIMC-SLv3", category: "Documents" },
  { label: "AGD_OPE.1 Guidance Documentation", category: "Documents" },
]

const ALL_PALETTE_ITEMS = [...PALETTE_ACTIONS, ...PALETTE_THREADS, ...PALETTE_DOCS]

function CommandPaletteDemo() {
  useEffect(ensureStyles, [])

  const [ctrl, setCtrl] = useState<Record<string, boolean>>({
    closed: true,
    open: false,
    results: false,
  })
  const [animKey, setAnimKey] = useState(0)
  const [search, setSearch] = useState("")
  const [highlightIdx, setHighlightIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggle = (key: string) => {
    const next: Record<string, boolean> = { closed: false, open: false, results: false }
    next[key] = true
    setCtrl(next)
    setAnimKey((k) => k + 1)
    setHighlightIdx(0)
    if (key === "open") setSearch("")
    if (key === "results") setSearch("FCS_COP")
  }

  useEffect(() => {
    if ((ctrl.open || ctrl.results) && inputRef.current) {
      inputRef.current.focus()
    }
  }, [ctrl.open, ctrl.results, animKey])

  // Filter items based on search
  const filtered = search.trim()
    ? ALL_PALETTE_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    : ALL_PALETTE_ITEMS

  // Group filtered items by category
  const grouped: Record<string, typeof ALL_PALETTE_ITEMS> = {}
  for (const item of filtered) {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  }

  return (
    <>
      <Controls
        options={[
          { key: "closed", label: "Closed" },
          { key: "open", label: "Open" },
          { key: "results", label: "With Results" },
        ]}
        active={ctrl}
        onToggle={toggle}
      />
      <div className="border border-border/40 rounded-lg p-6">
        {ctrl.closed ? (
          <div key={animKey} className="nav-slide-in flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Press</span>
              <kbd className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs">⌘K</kbd>
              <span>to open command palette</span>
            </div>
          </div>
        ) : (
          <div key={animKey} className="nav-slide-in mx-auto max-w-lg">
            <div className="rounded-lg border border-border bg-background shadow-lg">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0 text-muted-foreground"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setHighlightIdx(0)
                  }}
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[320px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No results for "{search}"
                  </div>
                ) : (
                  (() => {
                    let globalIdx = 0
                    return Object.entries(grouped).map(([category, items]) => (
                      <div key={category}>
                        <div className="mb-1 mt-2 first:mt-0 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {category}
                        </div>
                        {items.map((item) => {
                          const idx = globalIdx++
                          const isHighlighted = idx === highlightIdx
                          const isAction = "shortcut" in item
                          return (
                            <div
                              key={item.label}
                              onClick={() => setHighlightIdx(idx)}
                              className={`flex items-center justify-between rounded-md px-2 py-2 text-sm cursor-pointer transition-colors ${
                                isHighlighted ? "bg-accent" : "hover:bg-accent/50"
                              }`}
                            >
                              <span className="truncate">{item.label}</span>
                              {isAction && (item as typeof PALETTE_ACTIONS[number]).shortcut && (
                                <kbd className="ml-2 shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                  {(item as typeof PALETTE_ACTIONS[number]).shortcut}
                                </kbd>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))
                  })()
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  S2 — Thread Sidebar                                                */
/* ------------------------------------------------------------------ */

const THREADS = [
  { id: "t1", text: "CC EAL5 Gap Analysis — PP-0435", date: "4m ago", group: "Today" },
  { id: "t2", text: "CRA Article 11 Evidence Mapping", date: "1h ago", group: "Today" },
  { id: "t3", text: "TOE Boundary Definition — v3.2", date: "18h ago", group: "Yesterday" },
  { id: "t4", text: "AVA_VAN.3 Evidence Preparation", date: "22h ago", group: "Yesterday" },
  { id: "t5", text: "ALC_CMC.4 Configuration Audit", date: "Mar 5", group: "Previous 7 Days" },
  { id: "t6", text: "Evaluation Methodology Review", date: "Mar 3", group: "Previous 7 Days" },
]

function ThreadSidebarDemo() {
  useEffect(ensureStyles, [])

  const [ctrl, setCtrl] = useState<Record<string, boolean>>({
    default: true,
    search: false,
  })
  const [animKey, setAnimKey] = useState(0)
  const [activeThread, setActiveThread] = useState("t1")
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const toggle = (key: string) => {
    const next: Record<string, boolean> = { default: false, search: false }
    next[key] = true
    setCtrl(next)
    setAnimKey((k) => k + 1)
    if (key === "search") setSearchQuery("")
  }

  useEffect(() => {
    if (ctrl.search && searchRef.current) {
      searchRef.current.focus()
    }
  }, [ctrl.search, animKey])

  const filtered = searchQuery.trim()
    ? THREADS.filter((t) => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : THREADS

  // Group threads
  const groups: Record<string, typeof THREADS> = {}
  for (const t of filtered) {
    if (!groups[t.group]) groups[t.group] = []
    groups[t.group].push(t)
  }

  return (
    <>
      <Controls
        options={[
          { key: "default", label: "Default" },
          { key: "search", label: "Search Active" },
        ]}
        active={ctrl}
        onToggle={toggle}
      />
      <div className="border border-border/40 rounded-lg p-6">
        <div key={animKey} className="nav-slide-in mx-auto max-w-xs">
          <div className="rounded-lg border border-border bg-background">
            {/* Action rows */}
            <div className="space-y-1 border-b border-border px-3 py-2.5">
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors">
                <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                <span>New thread</span>
              </button>
              {ctrl.search ? (
                <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5">
                  <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search threads…"
                    className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                      <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => toggle("search")}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                >
                  <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">Search threads…</span>
                </button>
              )}
            </div>

            {/* Thread list */}
            <div className="p-2">
              {filtered.length === 0 ? (
                <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                  No threads match "{searchQuery}"
                </div>
              ) : (
                Object.entries(groups).map(([group, threads]) => (
                  <div key={group}>
                    <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground mt-2 first:mt-0">
                      {group}
                    </div>
                    {threads.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveThread(t.id)}
                        className={`w-full text-left rounded-md px-2 py-2 transition-colors ${
                          activeThread === t.id ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm">{t.text}</span>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{t.date}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  S3 — Breadcrumbs                                                   */
/* ------------------------------------------------------------------ */

const SHALLOW_CRUMBS = ["Device", "Security Target"]
const DEEP_CRUMBS = ["Device", "Security Target", "SFR Mapping", "FCS_COP.1"]

function BreadcrumbsDemo() {
  useEffect(ensureStyles, [])

  const [ctrl, setCtrl] = useState<Record<string, boolean>>({
    shallow: true,
    deep: false,
  })
  const [animKey, setAnimKey] = useState(0)
  const [clickedCrumb, setClickedCrumb] = useState<string | null>(null)

  const toggle = (key: string) => {
    const next: Record<string, boolean> = { shallow: false, deep: false }
    next[key] = true
    setCtrl(next)
    setAnimKey((k) => k + 1)
    setClickedCrumb(null)
  }

  const crumbs = ctrl.shallow ? SHALLOW_CRUMBS : DEEP_CRUMBS

  const handleCrumbClick = (crumb: string, isLast: boolean) => {
    if (isLast) return
    setClickedCrumb(crumb)
    setTimeout(() => setClickedCrumb(null), 600)
  }

  return (
    <>
      <Controls
        options={[
          { key: "shallow", label: "Shallow" },
          { key: "deep", label: "Deep" },
        ]}
        active={ctrl}
        onToggle={toggle}
      />
      <div className="border border-border/40 rounded-lg p-6">
        <div key={animKey} className="nav-slide-in flex items-center gap-1.5 py-4">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <div key={crumb} className="flex items-center gap-1.5">
                {i > 0 && (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground/50"
                  />
                )}
                {isLast ? (
                  <span className="text-sm text-foreground">{crumb}</span>
                ) : (
                  <button
                    onClick={() => handleCrumbClick(crumb, isLast)}
                    className={`text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors ${
                      clickedCrumb === crumb ? "nav-press" : ""
                    }`}
                  >
                    {crumb}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  S4 — Tab Navigation                                                */
/* ------------------------------------------------------------------ */

const TABS_COMPACT = [
  { key: "overview", label: "Overview" },
  { key: "sfrs", label: "SFRs" },
  { key: "evidence", label: "Evidence" },
  { key: "findings", label: "Findings" },
]

const TAB_CONTENT: Record<string, string> = {
  overview: "Summary of the Security Target evaluation for the ACME SmartCard Module, covering EAL4+ assurance with augmented ALC_FLR.1.",
  sfrs: "12 Security Functional Requirements identified across FCS, FDP, FIA, and FAU classes. 10 of 12 have complete evidence mappings.",
  evidence: "37 evidence items collected. 3 items pending review: AGD_OPE.1 user guidance, ADV_FSP.4 functional specification, ATE_FUN.1 test documentation.",
  findings: "2 open findings: FCS_COP.1 references outdated algorithm suite; FDP_ACF.1 access control policy incomplete for remote management interface.",
}

function TabNavigationDemo() {
  useEffect(ensureStyles, [])

  const [ctrl, setCtrl] = useState<Record<string, boolean>>({
    compact: true,
    badges: false,
  })
  const [animKey, setAnimKey] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const toggle = (key: string) => {
    const next: Record<string, boolean> = { compact: false, badges: false }
    next[key] = true
    setCtrl(next)
    setAnimKey((k) => k + 1)
    setActiveTab("overview")
  }

  const findingsBadge = ctrl.badges ? 2 : 0

  return (
    <>
      <Controls
        options={[
          { key: "compact", label: "Compact" },
          { key: "badges", label: "With Badges" },
        ]}
        active={ctrl}
        onToggle={toggle}
      />
      <div className="border border-border/40 rounded-lg p-6">
        <div key={animKey} className="nav-slide-in">
          {/* Tab bar */}
          <div className="flex gap-0 border-b border-border">
            {TABS_COMPACT.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative border-b-2 px-4 py-2.5 text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {tab.label}
                  {tab.key === "findings" && findingsBadge > 0 && (
                    <span className="nav-badge-pop inline-flex h-4 min-w-4 items-center justify-center rounded-md bg-foreground/10 px-1 text-[10px] text-foreground">
                      {findingsBadge}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="pt-5">
            <p
              className="nav-fade-in"
              key={activeTab}
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "16px",
                lineHeight: "26px",
                letterSpacing: "-0.4px",
                fontVariationSettings: '"opsz" 12',
                color: "oklch(0.2642 0.013 93.9)",
              }}
            >
              {TAB_CONTENT[activeTab]}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  S5 — Context Switcher                                              */
/* ------------------------------------------------------------------ */

const DEVICES = [
  { id: "d1", name: "ACME SmartCard Module", eal: "EAL4+" },
  { id: "d2", name: "SecureNet Firewall v5.0", eal: "EAL3" },
  { id: "d3", name: "CryptoVault HSM 3000", eal: "EAL5+" },
]

function ContextSwitcherDemo() {
  useEffect(ensureStyles, [])

  const [ctrl, setCtrl] = useState<Record<string, boolean>>({
    single: true,
    multi: false,
  })
  const [animKey, setAnimKey] = useState(0)
  const [selectedDevice, setSelectedDevice] = useState("d1")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggle = (key: string) => {
    const next: Record<string, boolean> = { single: false, multi: false }
    next[key] = true
    setCtrl(next)
    setAnimKey((k) => k + 1)
    setSelectedDevice("d1")
    setDropdownOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const current = DEVICES.find((d) => d.id === selectedDevice) ?? DEVICES[0]

  return (
    <>
      <Controls
        options={[
          { key: "single", label: "Single Device" },
          { key: "multi", label: "Multi Device" },
        ]}
        active={ctrl}
        onToggle={toggle}
      />
      <div className="border border-border/40 rounded-lg p-6">
        <div key={animKey} className="nav-slide-in flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Evaluation context</span>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                if (ctrl.multi) setDropdownOpen((o) => !o)
              }}
              className={`flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent/50 ${
                ctrl.single ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <HugeiconsIcon icon={ComputerIcon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
              <span>{current.name}</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {current.eal}
              </span>
              {ctrl.multi && (
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={12}
                  strokeWidth={1.5}
                  className={`text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {dropdownOpen && ctrl.multi && (
              <div className="nav-slide-in absolute left-0 top-full z-10 mt-1 w-72 rounded-lg border border-border bg-background shadow-lg">
                <div className="p-1.5">
                  {DEVICES.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => {
                        setSelectedDevice(device.id)
                        setDropdownOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                        selectedDevice === device.id ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={ComputerIcon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                        <span>{device.name}</span>
                      </div>
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {device.eal}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  S6 — Notifications                                                 */
/* ------------------------------------------------------------------ */

const NOTIFICATION_ITEMS = [
  {
    id: "n1",
    icon: Wrench01Icon,
    title: "Evidence collection completed",
    detail: "AGD_OPE.1 guidance documentation — 3 items collected",
    time: "2m ago",
  },
  {
    id: "n2",
    icon: Alert01Icon,
    title: "Approval needed",
    detail: "FCS_COP.1 algorithm update requires evaluator sign-off",
    time: "15m ago",
  },
  {
    id: "n3",
    icon: Cancel01Icon,
    title: "Import failed",
    detail: "Protection Profile PP-0435 could not be parsed — invalid XML structure",
    time: "1h ago",
  },
]

function NotificationsDemo() {
  useEffect(ensureStyles, [])

  const [ctrl, setCtrl] = useState<Record<string, boolean>>({
    empty: true,
    items: false,
    badge: false,
  })
  const [animKey, setAnimKey] = useState(0)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    const next: Record<string, boolean> = { empty: false, items: false, badge: false }
    next[key] = true
    setCtrl(next)
    setAnimKey((k) => k + 1)
    setDismissed(new Set())
  }

  const visibleNotifications = NOTIFICATION_ITEMS.filter((n) => !dismissed.has(n.id))

  return (
    <>
      <Controls
        options={[
          { key: "empty", label: "Empty" },
          { key: "items", label: "With Items" },
          { key: "badge", label: "Badge" },
        ]}
        active={ctrl}
        onToggle={toggle}
      />
      <div className="border border-border/40 rounded-lg p-6">
        <div key={animKey} className="nav-slide-in">
          {ctrl.badge ? (
            /* Badge mode — just the bell icon with count dot */
            <div className="flex items-center justify-center py-8">
              <div className="relative inline-flex">
                <div className="rounded-md border border-border p-2">
                  <HugeiconsIcon icon={Notification01Icon} size={18} strokeWidth={1.5} className="text-foreground" />
                </div>
                <span className="nav-badge-pop absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-foreground px-1 text-[10px] text-background">
                  3
                </span>
              </div>
            </div>
          ) : (
            /* Panel mode */
            <div className="mx-auto max-w-sm">
              <div className="rounded-lg border border-border bg-background">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm">Notifications</span>
                  {!ctrl.empty && visibleNotifications.length > 0 && (
                    <button
                      onClick={() => setDismissed(new Set(NOTIFICATION_ITEMS.map((n) => n.id)))}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-2">
                  {ctrl.empty || visibleNotifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                      <HugeiconsIcon
                        icon={Notification01Icon}
                        size={20}
                        strokeWidth={1.5}
                        className="text-muted-foreground/50"
                      />
                      <span className="text-sm text-muted-foreground">No new notifications</span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {visibleNotifications.map((n, i) => (
                        <div
                          key={n.id}
                          className="group flex items-start gap-3 rounded-md px-3 py-2.5 hover:bg-accent/50 transition-colors"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <HugeiconsIcon
                            icon={n.icon}
                            size={14}
                            strokeWidth={1.5}
                            className="mt-0.5 shrink-0 text-muted-foreground"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm">{n.title}</span>
                              <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground truncate">{n.detail}</p>
                          </div>
                          <button
                            onClick={() => setDismissed((prev) => new Set([...prev, n.id]))}
                            className="mt-0.5 shrink-0 text-muted-foreground/0 group-hover:text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function Navigation() {
  return (
    <article>
      {/* Page header */}
      <header className="mb-20">
        <p className="section-label mb-4">Navigation</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Navigation &amp; Context
        </h1>
        <p className="mt-5 max-w-[640px] text-[15px] leading-relaxed text-muted-foreground">
          Command palette, thread sidebar, breadcrumbs, tab navigation,
          context switching, and notifications for navigating agent-powered
          evaluation workflows.
        </p>
      </header>

      {/* ─── S1 — Command Palette ─── */}
      <section id="command-palette" className="page-section">
        <p className="section-label mb-3">Quick Launcher</p>
        <h2 className="text-xl font-semibold tracking-tight">Command Palette</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          ⌘K quick-launcher with real-time search filtering across actions,
          recent threads, and documents. Results grouped by category with
          keyboard hint.
        </p>

        <div className="mt-10">
          <CommandPaletteDemo />
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Trigger", "⌘K or click search icon"],
              ["Width", "min(480px, 90vw)"],
              ["Max results per group", "5 items"],
              ["Keyboard nav", "↑↓ to move, Enter to select, Esc to close"],
              ["Search debounce", "150ms"],
              ["Backdrop", "Semi-transparent overlay, click to dismiss"],
            ].map(([prop, val]) => (
              <tr key={prop} className="border-b border-border/50">
                <td className="py-2.5 pr-6 text-muted-foreground">{prop}</td>
                <td className="py-2.5">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          The command palette surfaces actions and content through a single keyboard-driven
          entry point, reducing the cognitive load of navigating complex evaluation workflows.
          Grouping results by category prevents cross-domain confusion between actions,
          threads, and reference documents.
        </div>
      </section>

      {/* ─── S2 — Thread Sidebar ─── */}
      <section id="threads" className="page-section">
        <p className="section-label mb-3">Conversation Management</p>
        <h2 className="text-xl font-semibold tracking-tight">Thread Sidebar</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Conversation thread browser with date grouping, inline search,
          and active thread highlighting. Each thread shows text and date only.
        </p>

        <div className="mt-10">
          <ThreadSidebarDemo />
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Width", "280px fixed, collapsible via ⌘B"],
              ["Thread item", "Single line text + date, no icons"],
              ["Active state", "bg-accent background highlight"],
              ["Date groups", "Today, Yesterday, Previous 7 Days, then month labels"],
              ["Search", "Inline input, filters threads in real-time"],
              ["Actions", "New thread, Search — full-width rows at top"],
            ].map(([prop, val]) => (
              <tr key={prop} className="border-b border-border/50">
                <td className="py-2.5 pr-6 text-muted-foreground">{prop}</td>
                <td className="py-2.5">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Thread items use text and date only — no icons — to minimize visual noise
          in a sidebar that evaluators scan frequently. Date grouping preserves temporal
          context without requiring explicit timestamps on every item.
        </div>
      </section>

      {/* ─── S3 — Breadcrumbs ─── */}
      <section id="breadcrumbs" className="page-section">
        <p className="section-label mb-3">Wayfinding</p>
        <h2 className="text-xl font-semibold tracking-tight">Breadcrumbs</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Hierarchical path navigation showing current position within the
          evaluation structure. Clickable segments with hover underline;
          final segment is non-interactive.
        </p>

        <div className="mt-10">
          <BreadcrumbsDemo />
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Separator", "Chevron-right icon, 12px, muted"],
              ["Clickable segments", "All except the last (current location)"],
              ["Hover effect", "Underline with underline-offset-4"],
              ["Press effect", "Scale 0.97 animation"],
              ["Max depth", "No hard limit; truncate middle segments with ellipsis at 5+"],
              ["Typography", "text-sm for all segments"],
            ].map(([prop, val]) => (
              <tr key={prop} className="border-b border-border/50">
                <td className="py-2.5 pr-6 text-muted-foreground">{prop}</td>
                <td className="py-2.5">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Breadcrumbs anchor the evaluator within deeply nested CC structures —
          from device level through Security Target to individual SFR components.
          The final non-clickable segment confirms the current context without
          ambiguity.
        </div>
      </section>

      {/* ─── S4 — Tab Navigation ─── */}
      <section id="tabs" className="page-section">
        <p className="section-label mb-3">Content Switching</p>
        <h2 className="text-xl font-semibold tracking-tight">Tab Navigation</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Horizontal tab bar for switching between content views within a single
          context. Active tab uses a bottom border indicator. Optional count
          badges for items requiring attention.
        </p>

        <div className="mt-10">
          <TabNavigationDemo />
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Active indicator", "2px bottom border, foreground color"],
              ["Badge shape", "rounded-md, bg-foreground/10, 10px text"],
              ["Transition", "Color transition on hover, fade-in on content switch"],
              ["Tab count", "2–6 tabs recommended; scroll for overflow"],
              ["Content area", "Agent prose style (Source Serif 4, 16px/26px)"],
              ["Spacing", "px-4 py-2.5 per tab"],
            ].map(([prop, val]) => (
              <tr key={prop} className="border-b border-border/50">
                <td className="py-2.5 pr-6 text-muted-foreground">{prop}</td>
                <td className="py-2.5">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Bottom-border tab indicators avoid the visual weight of filled
          backgrounds, keeping the interface lightweight during long evaluation
          sessions. Badges surface actionable counts (open findings, pending
          evidence) without requiring the evaluator to switch contexts.
        </div>
      </section>

      {/* ─── S5 — Context Switcher ─── */}
      <section id="context-switcher" className="page-section">
        <p className="section-label mb-3">Evaluation Scope</p>
        <h2 className="text-xl font-semibold tracking-tight">Context Switcher</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Dropdown for switching between evaluation device contexts. Shows the
          current device name and EAL level. In multi-device mode, a dropdown
          reveals all available evaluation targets.
        </p>

        <div className="mt-10">
          <ContextSwitcherDemo />
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Trigger", "Click to open dropdown (multi-device only)"],
              ["Dropdown width", "w-72, shadow-lg"],
              ["Active item", "bg-accent highlight"],
              ["Device info", "Name + EAL badge in muted bg"],
              ["Close", "Click outside or select an item"],
              ["Animation", "Slide-in on open, rotate chevron"],
            ].map(([prop, val]) => (
              <tr key={prop} className="border-b border-border/50">
                <td className="py-2.5 pr-6 text-muted-foreground">{prop}</td>
                <td className="py-2.5">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Evaluation facilities often work on multiple TOEs simultaneously. The
          context switcher ensures the evaluator always knows which device is
          in scope, preventing cross-evaluation contamination of findings and
          evidence references.
        </div>
      </section>

      {/* ─── S6 — Notifications ─── */}
      <section id="notifications" className="page-section">
        <p className="section-label mb-3">Alerts</p>
        <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Notification panel with dismissible items for tool completions,
          approval requests, and error alerts. Badge mode shows a count indicator
          on the bell icon.
        </p>

        <div className="mt-10">
          <NotificationsDemo />
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Badge shape", "rounded-md, bg-foreground, text-background"],
              ["Badge animation", "Scale pop-in (0 → 1.2 → 1)"],
              ["Empty state", "Centered bell icon + 'No new notifications'"],
              ["Item layout", "Icon + title/detail + timestamp + dismiss on hover"],
              ["Dismiss", "Per-item ✕ or 'Clear all' in header"],
              ["Max visible", "5 items before scroll"],
            ].map(([prop, val]) => (
              <tr key={prop} className="border-b border-border/50">
                <td className="py-2.5 pr-6 text-muted-foreground">{prop}</td>
                <td className="py-2.5">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Notifications surface asynchronous events — completed evidence collection,
          required approvals, import failures — without interrupting the evaluator's
          current task. The badge provides at-a-glance awareness; the panel provides
          detail on demand.
        </div>
      </section>
    </article>
  )
}
