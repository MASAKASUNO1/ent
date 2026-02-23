"use client";

import { useState, useEffect, useCallback } from "react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "ent-todos";

function loadTodos(): TodoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: TodoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setTodos(loadTodos());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveTodos(todos);
  }, [todos, mounted]);

  const addTodo = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setInput("");
  }, [input]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startEdit = useCallback((todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  }, []);

  const saveEdit = useCallback(() => {
    const trimmed = editText.trim();
    if (!trimmed || !editingId) {
      setEditingId(null);
      return;
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, text: trimmed } : t))
    );
    setEditingId(null);
  }, [editingId, editText]);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/20 bg-black/30 p-8 backdrop-blur-md">
        <div className="animate-pulse space-y-4">
          <div className="h-12 rounded-xl bg-white/10" />
          <div className="h-8 rounded-xl bg-white/10" />
          <div className="h-8 rounded-xl bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-xl border border-white/20 bg-black/30 px-5 py-3 text-white placeholder-white/40 backdrop-blur-md outline-none transition-all focus:border-white/40 focus:ring-2 focus:ring-white/20"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100"
        >
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      {todos.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1 rounded-xl bg-black/20 p-1 backdrop-blur-sm">
            {(["all", "active", "completed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-sm text-white/50">
            {activeCount} remaining
          </span>
        </div>
      )}

      {/* Todo List */}
      <ul className="mt-4 space-y-2">
        {filtered.map((todo) => (
          <li
            key={todo.id}
            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/30"
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                todo.completed
                  ? "border-green-400 bg-green-400/20 text-green-300"
                  : "border-white/30 hover:border-white/50"
              }`}
            >
              {todo.completed && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Text / Edit */}
            {editingId === todo.id ? (
              <input
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="flex-1 rounded-lg border border-white/20 bg-black/30 px-3 py-1 text-white outline-none focus:border-white/40"
              />
            ) : (
              <span
                onDoubleClick={() => startEdit(todo)}
                className={`flex-1 cursor-default select-none text-sm transition-all ${
                  todo.completed
                    ? "text-white/30 line-through"
                    : "text-white/90"
                }`}
              >
                {todo.text}
              </span>
            )}

            {/* Delete */}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="shrink-0 rounded-lg p-1 text-white/0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:text-white/30"
              aria-label="Delete"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-lg text-white/40">No todos yet</p>
          <p className="mt-1 text-sm text-white/25">Add one above to get started</p>
        </div>
      )}

      {filtered.length === 0 && todos.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-white/40">
            No {filter} todos
          </p>
        </div>
      )}

      {/* Footer */}
      {completedCount > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearCompleted}
            className="rounded-lg px-3 py-1.5 text-sm text-white/40 transition-all hover:bg-red-500/10 hover:text-red-300"
          >
            Clear completed ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
}
