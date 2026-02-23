"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "/tetris", label: "Tetris", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" },
  { href: "/todo", label: "Todo", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { href: "/kanban", label: "Kanban", icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50">
      <div className="flex items-center justify-between px-8 py-5">
        <a href="/" className="group flex items-center gap-2 text-2xl font-bold text-white tracking-tight transition-opacity hover:opacity-80">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-base backdrop-blur-sm transition-transform group-hover:scale-110">
            e
          </span>
          <span>ent</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-1 rounded-xl bg-white/5 p-1 backdrop-blur-sm sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-white/60 transition-all hover:bg-white/10 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white sm:hidden"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="absolute left-4 right-4 top-full rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl sm:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
