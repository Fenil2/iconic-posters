"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, Mic, TrendingUp, Clock, X } from "@/components/icons";
import { cn } from "@/lib/utils";
import { popularSearches } from "@/config/navigation";

const RECENT_KEY = "pulse-recent-searches";

/** Live search with suggestions, popular & recent searches, voice-search UI. */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (value: string) => {
    const term = value.trim();
    if (!term) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const filtered = query
    ? popularSearches.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="relative flex items-center"
      >
        <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search posters, artists, themes…"
          className="h-11 w-full rounded-full border border-border bg-secondary/50 pl-10 pr-20 text-sm outline-none transition-colors focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear"
              className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            aria-label="Voice search"
            className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Mic className="size-4" />
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-13 z-50 overflow-hidden rounded-xl border border-border bg-popover p-2 shadow-xl">
          {filtered.length > 0 && (
            <div className="mb-2">
              {filtered.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                >
                  <Search className="size-4 text-muted-foreground" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {recent.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Recent
              </p>
              {recent.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                >
                  <Clock className="size-4 text-muted-foreground" />
                  {s}
                </button>
              ))}
            </div>
          )}

          <div>
            <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Trending
            </p>
            <div className="flex flex-wrap gap-2 p-2">
              {popularSearches.slice(0, 6).map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
                >
                  <TrendingUp className="size-3" />
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
