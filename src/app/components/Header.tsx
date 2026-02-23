const NAV_LINKS = [
  { href: "/tetris", label: "Tetris" },
  { href: "/todo", label: "Todo" },
  { href: "/kanban", label: "Kanban" },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <a href="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
        ent
      </a>
      <nav className="hidden gap-4 sm:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
