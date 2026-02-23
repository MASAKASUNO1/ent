import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Header />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-8 pt-24 pb-32 text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
          Next.js + Tailwind CSS
        </div>
        <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-7xl">
          Build Something
          <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Amazing
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
          モダンなWebアプリケーションを、美しく、高速に。
          あなたのアイデアをカタチにする最高のスターターキット。
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#features"
            className="rounded-full bg-white px-8 py-3 font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Get Started
          </a>
          <a
            href="https://github.com/MASAKASUNO1/ent"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-white/40 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white/10 px-8 py-24 backdrop-blur-sm">
        <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">Features</h2>
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {[
            {
              icon: "⚡",
              title: "超高速",
              desc: "Turbopackによる爆速な開発体験。HMRもビルドも一瞬。",
            },
            {
              icon: "🎨",
              title: "美しいUI",
              desc: "Tailwind CSSで直感的にスタイリング。レスポンシブも簡単。",
            },
            {
              icon: "🔒",
              title: "型安全",
              desc: "TypeScriptで堅牢なコード。バグを未然に防ぐ。",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
            >
              <div className="mb-4 text-4xl">{f.icon}</div>
              <h3 className="mb-2 text-xl font-bold text-white">{f.title}</h3>
              <p className="text-white/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
          <a
            href="/tetris"
            className="group rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
          >
            <div className="mb-4 text-4xl">🎮</div>
            <h3 className="mb-2 text-xl font-bold text-white">Tetris</h3>
            <p className="text-white/70 leading-relaxed">ブラウザで遊べるテトリス。息抜きにどうぞ。</p>
          </a>
          <a
            href="/todo"
            className="group rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
          >
            <div className="mb-4 text-4xl">✅</div>
            <h3 className="mb-2 text-xl font-bold text-white">Todo</h3>
            <p className="text-white/70 leading-relaxed">シンプルなTodoアプリ。データはブラウザに保存。</p>
          </a>
          <a
            href="/kanban"
            className="group rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
          >
            <div className="mb-4 text-4xl">📋</div>
            <h3 className="mb-2 text-xl font-bold text-white">Kanban</h3>
            <p className="text-white/70 leading-relaxed">カンバンボードでタスク管理。ドラッグ不要のシンプル操作。</p>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">さあ、始めよう</h2>
        <p className="mx-auto mt-4 max-w-lg text-white/70">
          src/app/page.tsx を編集して、あなただけのアプリケーションを作りましょう。
        </p>
        <div className="mt-8 inline-block rounded-xl bg-black/20 px-6 py-4 font-mono text-sm text-white/90 backdrop-blur-sm">
          npm run dev
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-8 py-16">
          <div className="grid gap-12 sm:grid-cols-3">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">ent</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                Next.js + Tailwind CSS で作るモダンWebアプリ。高速で美しい開発体験を。
              </p>
            </div>

            {/* Apps */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">Apps</h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="/tetris" className="text-sm text-white/50 transition-colors hover:text-white">Tetris</a>
                </li>
                <li>
                  <a href="/todo" className="text-sm text-white/50 transition-colors hover:text-white">Todo</a>
                </li>
                <li>
                  <a href="/kanban" className="text-sm text-white/50 transition-colors hover:text-white">Kanban</a>
                </li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">Links</h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="https://github.com/MASAKASUNO1/ent" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 transition-colors hover:text-white">GitHub</a>
                </li>
                <li>
                  <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 transition-colors hover:text-white">Next.js</a>
                </li>
                <li>
                  <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 transition-colors hover:text-white">Tailwind CSS</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-xs text-white/30">&copy; 2026 ent. All rights reserved.</p>
            <p className="text-xs text-white/30">Built with Next.js &amp; Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
