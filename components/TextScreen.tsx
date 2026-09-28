"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { opener, replyTo } from "@/lib/chat";
import { markGoing, readDemo, skipShow, useDemoState } from "@/lib/demo-store";
import { SHOWS, SIGNALS } from "@/lib/mock-data";
import { DEFAULT_WEIGHTS, rankShows } from "@/lib/ranker";

interface ChatMessage {
  id: string;
  role: "user" | "encore";
  text: string;
}

const CHIPS = ["Go", "Skip", "More comedy"] as const;

function seed(): ChatMessage[] {
  return [
    {
      id: "opener",
      role: "encore",
      text: opener(rankShows(SHOWS, SIGNALS, DEFAULT_WEIGHTS)),
    },
  ];
}

export function TextScreen() {
  const { weights, going, skipped, ready } = useDemoState();
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    setMessages((current) => {
      if (current.some((message) => message.role === "user")) return current;
      const text = opener(rankShows(SHOWS, SIGNALS, weights));
      if (current[0]?.text === text) return current;
      return [{ id: "opener", role: "encore", text }];
    });
  }, [ready, weights]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  function send(raw: string) {
    const text = raw.trim();
    if (!text) return;
    const demo = readDemo();
    const result = replyTo(text, rankShows(SHOWS, SIGNALS, weights), demo.going, demo.skipped);
    if (result.goId) markGoing(result.goId);
    if (result.skipId) skipShow(result.skipId);
    setMessages((current) => [
      ...current,
      { id: `u-${current.length}`, role: "user", text },
      { id: `e-${current.length}`, role: "encore", text: result.text },
    ]);
    setDraft("");
  }

  let lastUser = -1;
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      lastUser = index;
      break;
    }
  }

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100dvh - var(--nav-h))" }}
    >
      <header className="shrink-0 border-b border-white/10 px-4 pb-3 pt-4 text-center">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-xl text-ink">E</div>
        <h1 className="mt-1 text-[15px] font-medium text-paper">Encore</h1>
        <p className="text-[11px] text-mist">Demo · Seattle</p>
      </header>

      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3" role="log" aria-live="polite" aria-relevant="additions">
        <p className="mb-1 text-center text-[11px] text-mist">Today 9:41 AM</p>
        {messages.map((message, index) => (
          <div key={message.id} className={cn("flex flex-col", message.role === "user" ? "items-end" : "items-start")}>
            <div
              className={cn(
                "max-w-[82%] whitespace-pre-wrap rounded-[18px] px-3 py-2 text-[15px] leading-snug text-white",
                message.role === "user" ? "rounded-br-[5px] bg-[#0A84FF]" : "rounded-bl-[5px] bg-[#3A3A3C]",
              )}
            >
              <Linkified text={message.text} mine={message.role === "user"} />
            </div>
            {index === lastUser ? <p className="mt-0.5 pr-1 text-[10px] text-mist">Delivered</p> : null}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="shrink-0 border-t border-white/10 px-3 pb-2 pt-2"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <div className="mb-2 flex gap-2 overflow-x-auto">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => send(chip)}
              className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-sm text-paper"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sms" className="sr-only">
            Message
          </label>
          <input
            id="sms"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Text Encore"
            autoComplete="off"
            enterKeyHint="send"
            className="h-10 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-[15px] text-paper placeholder:text-mist/70"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send"
            className="grid h-9 w-9 place-items-center rounded-full bg-[#0A84FF] text-white disabled:bg-white/15"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M4 12 20 4l-6 16-2.2-6.2L4 12Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

function Linkified({ text, mine }: { text: string; mine: boolean }) {
  const parts = text.split(/(\/show\/[a-z0-9-]+)/g);
  return parts.map((part, index) => {
    if (!part.startsWith("/show/")) return <span key={index}>{part}</span>;
    return (
      <Link key={index} href={part} className={mine ? "underline" : "text-gold underline decoration-gold/50"}>
        Open show
      </Link>
    );
  });
}
