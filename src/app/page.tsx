export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">ent</h2>
        <nav className="hidden gap-6 sm:flex">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="/tetris" className="text-white/80 hover:text-white transition-colors">Tetris</a>
          <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
          <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
        </nav>
      </header>

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
      <footer id="contact" className="border-t border-white/10 px-8 py-8 text-center text-sm text-white/50">
        &copy; 2026 ent — Built with Next.js
      </footer>
    </div>
  );
}
