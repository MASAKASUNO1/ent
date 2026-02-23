import Tetris from "./Tetris";

export const metadata = {
  title: "Tetris — ent",
  description: "ブラウザで遊べるテトリスゲーム",
};

export default function TetrisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <header className="flex items-center justify-between px-8 py-6">
        <a href="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
          ent
        </a>
        <nav className="flex gap-6">
          <a href="/" className="text-white/80 hover:text-white transition-colors">
            Home
          </a>
        </nav>
      </header>

      <main className="flex flex-col items-center px-4 pb-16 pt-4">
        <h1 className="mb-8 text-4xl font-extrabold text-white sm:text-5xl">
          <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Tetris
          </span>
        </h1>
        <Tetris />
      </main>
    </div>
  );
}
