"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/", label: "Discover" },
  { href: "/week", label: "Week" },
  { href: "/text", label: "Text" },
  { href: "/profile", label: "Profile" },
] as const;

function active(href: string, path: string): boolean {
  if (href === "/") return path === "/" || path.startsWith("/show");
  return path === href || path.startsWith(`${href}/`);
}

export function BottomNav() {
  const path = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-phone -translate-x-1/2 border-t border-white/10 bg-ink/95 backdrop-blur"
      style={{ height: "var(--nav-h)" }}
    >
      <ul className="grid h-[4.5rem] grid-cols-4 px-1 pt-1">
        {ITEMS.map((item) => {
          const on = active(item.href, path);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[11px] tracking-wide",
                  on ? "text-gold" : "text-mist",
                )}
              >
                <NavIcon name={item.label} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function NavIcon({ name }: { name: (typeof ITEMS)[number]["label"] }) {
  const common = "h-5 w-5";
  if (name === "Discover") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "Week") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M8 3.5v3M16 3.5v3" />
      </svg>
    );
  }
  if (name === "Text") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M6 16.5 4 20l3.8-1.4A8 8 0 1 0 6 16.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <circle cx="12" cy="9" r="3.2" />
      <path d="M6.2 19.2c1.2-2.4 3.2-3.5 5.8-3.5s4.6 1.1 5.8 3.5" />
    </svg>
  );
}
