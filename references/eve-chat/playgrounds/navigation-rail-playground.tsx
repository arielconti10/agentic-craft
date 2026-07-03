"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  NavigationRail,
  type NavigationRailItem,
} from "@/components/ui/navigation-rail";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Navigation rail playground
//
// Renders the NavigationRail primitive against a fixture transcript so we can
// iterate on the gutter, hover previews, and jump-to-turn behavior without
// wiring up the agent runtime. The rail reads its active/visible state from the
// MessageScroller visibility hooks, so it lives inside MessageScrollerProvider.
// ---------------------------------------------------------------------------

type Role = "user" | "assistant";
type FixtureMessage = {
  readonly id: string;
  readonly role: Role;
  readonly text: string;
};

const TRANSCRIPT: readonly FixtureMessage[] = [
  {
    id: "t1-user",
    role: "user",
    text: "The scroll behavior in our chat keeps jumping when the assistant streams. How do I fix it?",
  },
  {
    id: "t1-assistant",
    role: "assistant",
    text: "Anchor the turn that should settle near the top instead of snapping to the document bottom. MessageScrollerItem with scrollAnchor handles that, leaving a peek of the previous exchange so context is not lost.",
  },
  {
    id: "t2-user",
    role: "user",
    text: "What happens if the reader scrolls up while a reply is still generating?",
  },
  {
    id: "t2-assistant",
    role: "assistant",
    text: "Auto-scroll only runs while the viewport is pinned to the live edge. Scrolling up is treated as a deliberate opt-out, so new chunks keep arriving below without yanking the reader back.",
  },
  {
    id: "t3-user",
    role: "user",
    text: "Can I add a navigation rail so people jump between turns without scrolling?",
  },
  {
    id: "t3-assistant",
    role: "assistant",
    text: "Yes. Use useMessageScrollerVisibility for currentAnchorId and visibleMessageIds, then render a dash per turn. Hovering previews the turn and clicking calls scrollToMessage to jump straight there.",
  },
  {
    id: "t4-user",
    role: "user",
    text: "How should the active dash behave as I read down the conversation?",
  },
  {
    id: "t4-assistant",
    role: "assistant",
    text: "currentAnchorId reports the current anchored turn and stays set after that anchor scrolls above the viewport, so the active dash tracks where you are even between anchors.",
  },
  {
    id: "t5-user",
    role: "user",
    text: "Does visibility tracking cost anything when nothing is using it?",
  },
  {
    id: "t5-assistant",
    role: "assistant",
    text: "No. Visibility is pay-for-what-you-use. Tracking only runs while a component subscribes to useMessageScrollerVisibility, and rows need a messageId to participate.",
  },
  {
    id: "t6-user",
    role: "user",
    text: "Last one: can I move the rail to the right edge for a different layout?",
  },
  {
    id: "t6-assistant",
    role: "assistant",
    text: "The rail takes a side prop. Set it to right and previews open toward the left instead. Everything else, including jump-to-turn and active tracking, stays identical.",
  },
];

export function NavigationRailPlayground() {
  const [side, setSide] = useState<"left" | "right">("left");
  const [showRail, setShowRail] = useState(true);

  const railItems = useMemo<NavigationRailItem[]>(
    () => buildRailItems(TRANSCRIPT),
    [],
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground md:flex-row">
      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/70 px-5 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">Navigation rail playground</p>
            <p className="truncate text-xs text-muted-foreground">
              <code className="font-mono">components/ui/navigation-rail</code>{" "}
              driven by the MessageScroller visibility hooks.
            </p>
          </div>
          <span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
            /playground/navigation-rail
          </span>
        </header>

        <div className="flex min-h-0 flex-1 items-center justify-center p-6">
          <div className="h-[36rem] w-full max-w-3xl overflow-hidden rounded-[14px] border border-border bg-card/40">
            <MessageScrollerProvider autoScroll defaultScrollPosition="start">
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent>
                    {TRANSCRIPT.map((message) => {
                      const isUser = message.role === "user";

                      return (
                        <MessageScrollerItem
                          key={message.id}
                          messageId={message.id}
                          scrollAnchor={isUser}
                        >
                          <Message align={isUser ? "end" : "start"}>
                            <MessageContent
                              className={
                                isUser
                                  ? undefined
                                  : "w-full max-w-none text-sm leading-relaxed"
                              }
                            >
                              {isUser ? (
                                <Bubble
                                  variant="muted"
                                  className="border border-border/40 bg-muted/70 px-3 py-1.5 text-[15px] leading-6"
                                >
                                  <BubbleContent>{message.text}</BubbleContent>
                                </Bubble>
                              ) : (
                                <p>{message.text}</p>
                              )}
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      );
                    })}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                {showRail ? (
                  <NavigationRail items={railItems} side={side} />
                ) : null}
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          </div>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-5 border-t border-border/70 bg-muted/30 p-5 text-sm md:w-80 md:border-l md:border-t-0">
        <Section title="Rail">
          <Toggle label="Show rail" checked={showRail} onChange={setShowRail} />
          <Field label="Side">
            <SegmentedControl
              ariaLabel="Rail side"
              onChange={(id) => setSide(id as "left" | "right")}
              options={[
                { id: "left", label: "Left" },
                { id: "right", label: "Right" },
              ]}
              value={side}
            />
          </Field>
        </Section>

        <Section title="How it works">
          <p className="text-[11px] leading-snug text-muted-foreground">
            Each dash is a user message. Hover the gutter to preview a turn, then
            click to jump straight to it. The active dash tracks{" "}
            <code className="font-mono">currentAnchorId</code> as you read.
          </p>
        </Section>
      </aside>
    </div>
  );
}

function buildRailItems(messages: readonly FixtureMessage[]): NavigationRailItem[] {
  const items: NavigationRailItem[] = [];

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];

    if (!message || message.role !== "user") {
      continue;
    }

    const reply = messages[index + 1];

    items.push({
      id: message.id,
      label: message.text,
      preview:
        reply && reply.role === "assistant" ? (
          <span className="line-clamp-3">{reply.text}</span>
        ) : undefined,
    });
  }

  return items;
}

// ---------------------------------------------------------------------------
// Local presentational helpers (mirrors the composer playground style).
// ---------------------------------------------------------------------------

function Section({ children, title }: { readonly children: ReactNode; readonly title: string }) {
  return (
    <section className="space-y-2">
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Field({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  readonly checked: boolean;
  readonly label: string;
  readonly onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-foreground">{label}</span>
      <button
        aria-checked={checked}
        className={cn(
          "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-emerald-500" : "bg-muted",
        )}
        onClick={(event) => {
          event.preventDefault();
          onChange(!checked);
        }}
        role="switch"
        type="button"
      >
        <span
          className={cn(
            "size-3 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[15px]" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}

function SegmentedControl({
  ariaLabel,
  onChange,
  options,
  value,
}: {
  readonly ariaLabel: string;
  readonly onChange: (id: string) => void;
  readonly options: readonly { readonly id: string; readonly label: string }[];
  readonly value: string;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-md border border-border/70 bg-muted/40 p-0.5"
      role="radiogroup"
    >
      {options.map((option) => {
        const selected = option.id === value;

        return (
          <button
            aria-checked={selected}
            className={cn(
              "rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-colors",
              selected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            key={option.id}
            onClick={() => onChange(option.id)}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
