"use client";

import { useState, useEffect, useCallback } from "react";

type Column = "todo" | "inProgress" | "done";

interface Card {
  id: string;
  title: string;
  column: Column;
}

const STORAGE_KEY = "ent-kanban";

const COLUMNS: { key: Column; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "inProgress", label: "In Progress" },
  { key: "done", label: "Done" },
];

function loadCards(): Card[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCards(cards: Card[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
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
      { id: crypto.randomUUID(), title: trimmed, column: "todo" },
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

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 rounded-2xl border border-white/20 bg-black/30 p-4 backdrop-blur-md">
              <div className="animate-pulse space-y-3">
                <div className="h-8 rounded-xl bg-white/10" />
                <div className="h-16 rounded-xl bg-white/10" />
                <div className="h-16 rounded-xl bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-col gap-4 lg:flex-row">
        {COLUMNS.map((col) => {
          const columnCards = cards.filter((c) => c.column === col.key);
          return (
            <div
              key={col.key}
              className="flex-1 rounded-2xl border border-white/20 bg-black/30 p-4 backdrop-blur-md"
            >
              {/* Column Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{col.label}</h2>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-sm font-medium text-white/60">
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
                  className="mb-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a card..."
                    className="flex-1 rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/40 backdrop-blur-sm outline-none transition-all focus:border-white/40 focus:ring-2 focus:ring-white/20"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100"
                  >
                    Add
                  </button>
                </form>
              )}

              {/* Cards */}
              <div className="space-y-2">
                {columnCards.map((card) => (
                  <div
                    key={card.id}
                    className="group rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/30"
                  >
                    <p className="text-sm text-white/90">{card.title}</p>
                    <div className="mt-2 flex items-center gap-1">
                      {/* Move Left */}
                      {card.column !== "todo" && (
                        <button
                          onClick={() => moveCard(card.id, "left")}
                          className="rounded-md p-1 text-white/30 transition-all hover:bg-white/10 hover:text-white/70"
                          aria-label="Move left"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      {/* Move Right */}
                      {card.column !== "done" && (
                        <button
                          onClick={() => moveCard(card.id, "right")}
                          className="rounded-md p-1 text-white/30 transition-all hover:bg-white/10 hover:text-white/70"
                          aria-label="Move right"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                      {/* Spacer */}
                      <div className="flex-1" />
                      {/* Delete */}
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="rounded-md p-1 text-white/0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:text-white/30"
                        aria-label="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {columnCards.length === 0 && (
                <p className="py-4 text-center text-sm text-white/30">
                  No cards
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
