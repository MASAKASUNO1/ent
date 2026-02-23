"use client";

import { useState, useEffect, useCallback } from "react";

type Column = "todo" | "inProgress" | "done";

interface Card {
  id: string;
  title: string;
  column: Column;
  createdAt: number;
}

const STORAGE_KEY = "ent-kanban";

const COLUMNS: {
  key: Column;
  label: string;
  icon: string;
  gradient: string;
  accent: string;
  glow: string;
}[] = [
  {
    key: "todo",
    label: "Todo",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    gradient: "from-blue-500 to-cyan-400",
    accent: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    glow: "shadow-blue-500/20",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    gradient: "from-amber-500 to-orange-400",
    accent: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    glow: "shadow-amber-500/20",
  },
  {
    key: "done",
    label: "Done",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-emerald-500 to-green-400",
    accent: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    glow: "shadow-emerald-500/20",
  },
];

function loadCards(): Card[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((c: Card & { createdAt?: number }) => ({
      ...c,
      createdAt: c.createdAt ?? Date.now(),
    }));
  } catch {
    return [];
  }
}

function saveCards(cards: Card[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Kanban() {
  const [cards, setCards] = useState<Card[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCards(loadCards());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveCards(cards);
  }, [cards, mounted]);

  const addCard = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setCards((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: trimmed, column: "todo", createdAt: Date.now() },
    ]);
    setInput("");
  }, [input]);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const moveCard = useCallback((id: string, direction: "left" | "right") => {
    const order: Column[] = ["todo", "inProgress", "done"];
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = order.indexOf(c.column);
        const nextIdx = direction === "left" ? idx - 1 : idx + 1;
        if (nextIdx < 0 || nextIdx >= order.length) return c;
        return { ...c, column: order[nextIdx] };
      })
    );
  }, []);

  const totalCards = cards.length;

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-6xl px-2">
        <div className="mb-6 h-3 rounded-full bg-white/10" />
        <div className="flex flex-col gap-6 lg:flex-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
              <div className="animate-pulse space-y-4">
                <div className="h-10 rounded-xl bg-white/10" />
                <div className="h-20 rounded-xl bg-white/5" />
                <div className="h-20 rounded-xl bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-2">
      {/* Progress Bar */}
      {totalCards > 0 && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-white/50">
            <span>{cards.filter((c) => c.column === "done").length} / {totalCards} completed</span>
            <span>{Math.round((cards.filter((c) => c.column === "done").length / totalCards) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/30 backdrop-blur-sm">
            <div className="flex h-full transition-all duration-500">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${(cards.filter((c) => c.column === "todo").length / totalCards) * 100}%` }}
              />
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                style={{ width: `${(cards.filter((c) => c.column === "inProgress").length / totalCards) * 100}%` }}
              />
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                style={{ width: `${(cards.filter((c) => c.column === "done").length / totalCards) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Columns */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {COLUMNS.map((col) => {
          const columnCards = cards.filter((c) => c.column === col.key);
          return (
            <div
              key={col.key}
              className={`flex-1 rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl shadow-xl ${col.glow} transition-all`}
            >
              {/* Column Header */}
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${col.gradient} shadow-lg`}>
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={col.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-white">{col.label}</h2>
                </div>
                <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${col.accent}`}>
                  {columnCards.length}
                </span>
              </div>

              {/* Add Card Form (Todo column only) */}
              {col.key === "todo" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addCard();
                  }}
                  className="mb-5"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Add a new task..."
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/20"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className={`rounded-xl bg-gradient-to-r ${col.gradient} px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-30 disabled:hover:scale-100`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}

              {/* Cards */}
              <div className="space-y-3">
                {columnCards.map((card) => (
                  <div
                    key={card.id}
                    className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-200 hover:border-white/15 hover:bg-white/10 hover:shadow-lg"
                  >
                    {/* Color accent bar */}
                    <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${col.gradient} opacity-50 transition-opacity group-hover:opacity-100`} />

                    <p className="pl-2 text-sm font-medium leading-relaxed text-white/90">{card.title}</p>

                    <div className="mt-3 flex items-center gap-1 pl-2">
                      {/* Timestamp */}
                      <span className="text-[10px] text-white/25">{timeAgo(card.createdAt)}</span>

                      <div className="flex-1" />

                      {/* Move Left */}
                      {card.column !== "todo" && (
                        <button
                          onClick={() => moveCard(card.id, "left")}
                          className="rounded-lg p-1.5 text-white/20 transition-all hover:bg-white/10 hover:text-white/70"
                          aria-label="Move left"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      {/* Move Right */}
                      {card.column !== "done" && (
                        <button
                          onClick={() => moveCard(card.id, "right")}
                          className="rounded-lg p-1.5 text-white/20 transition-all hover:bg-white/10 hover:text-white/70"
                          aria-label="Move right"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                      {/* Delete */}
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="rounded-lg p-1.5 text-white/0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:text-white/20"
                        aria-label="Delete"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {columnCards.length === 0 && (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${col.gradient} opacity-20`}>
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={col.icon} />
                    </svg>
                  </div>
                  <p className="text-sm text-white/20">No cards yet</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      {totalCards > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/30">
          {COLUMNS.map((col) => {
            const count = cards.filter((c) => c.column === col.key).length;
            return (
              <div key={col.key} className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${col.gradient}`} />
                <span>{col.label}: {count}</span>
              </div>
            );
          })}
          <span className="text-white/15">|</span>
          <span>Total: {totalCards}</span>
        </div>
      )}
    </div>
  );
}
