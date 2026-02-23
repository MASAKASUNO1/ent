"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const COLS = 10;
const ROWS = 20;

const TETROMINOS: Record<string, { shape: number[][]; color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#06b6d4",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#eab308",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#a855f7",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#22c55e",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#ef4444",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#3b82f6",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#f97316",
  },
};

const PIECE_KEYS = Object.keys(TETROMINOS);

type Cell = { color: string } | null;
type Board = Cell[][];

function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const key = PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
  return { key, ...TETROMINOS[key] };
}

function rotate(shape: number[][]): number[][] {
  const size = shape.length;
  const rotated: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0)
  );
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      rotated[c][size - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

function isValid(
  board: Board,
  shape: number[][],
  row: number,
  col: number
): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const nr = row + r;
        const nc = col + c;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
        if (board[nr][nc]) return false;
      }
    }
  }
  return true;
}

function placePiece(
  board: Board,
  shape: number[][],
  row: number,
  col: number,
  color: string
): Board {
  const newBoard = board.map((r) => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        newBoard[row + r][col + c] = { color };
      }
    }
  }
  return newBoard;
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const remaining = board.filter((row) => row.some((cell) => !cell));
  const cleared = ROWS - remaining.length;
  const emptyRows: Cell[][] = Array.from({ length: cleared }, () =>
    Array(COLS).fill(null)
  );
  return { board: [...emptyRows, ...remaining], cleared };
}

const LINE_SCORES = [0, 100, 300, 500, 800];

function getGhostRow(
  board: Board,
  shape: number[][],
  row: number,
  col: number
): number {
  let ghostRow = row;
  while (isValid(board, shape, ghostRow + 1, col)) {
    ghostRow++;
  }
  return ghostRow;
}

export default function Tetris() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [current, setCurrent] = useState(randomPiece);
  const [next, setNext] = useState(randomPiece);
  const [pos, setPos] = useState({ row: 0, col: 3 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const boardRef = useRef(board);
  const currentRef = useRef(current);
  const posRef = useRef(pos);
  const gameOverRef = useRef(gameOver);

  boardRef.current = board;
  currentRef.current = current;
  posRef.current = pos;
  gameOverRef.current = gameOver;

  const spawnPiece = useCallback(() => {
    const piece = next;
    const startCol = Math.floor((COLS - piece.shape[0].length) / 2);
    const startRow = 0;
    if (!isValid(boardRef.current, piece.shape, startRow, startCol)) {
      setGameOver(true);
      return;
    }
    setCurrent(piece);
    setNext(randomPiece());
    setPos({ row: startRow, col: startCol });
  }, [next]);

  const lockPiece = useCallback(() => {
    const { shape, color } = currentRef.current;
    const { row, col } = posRef.current;
    let newBoard = placePiece(boardRef.current, shape, row, col, color);
    const { board: clearedBoard, cleared } = clearLines(newBoard);
    setBoard(clearedBoard);
    if (cleared > 0) {
      setLines((prev) => {
        const newLines = prev + cleared;
        setLevel(Math.floor(newLines / 10) + 1);
        return newLines;
      });
      setScore((prev) => prev + LINE_SCORES[cleared] * level);
    }
    setTimeout(() => spawnPiece(), 0);
  }, [spawnPiece, level]);

  const moveLeft = useCallback(() => {
    if (gameOverRef.current) return;
    const { row, col } = posRef.current;
    if (isValid(boardRef.current, currentRef.current.shape, row, col - 1)) {
      setPos((p) => ({ ...p, col: p.col - 1 }));
    }
  }, []);

  const moveRight = useCallback(() => {
    if (gameOverRef.current) return;
    const { row, col } = posRef.current;
    if (isValid(boardRef.current, currentRef.current.shape, row, col + 1)) {
      setPos((p) => ({ ...p, col: p.col + 1 }));
    }
  }, []);

  const moveDown = useCallback((): boolean => {
    if (gameOverRef.current) return false;
    const { row, col } = posRef.current;
    if (isValid(boardRef.current, currentRef.current.shape, row + 1, col)) {
      setPos((p) => ({ ...p, row: p.row + 1 }));
      return true;
    }
    lockPiece();
    return false;
  }, [lockPiece]);

  const hardDrop = useCallback(() => {
    if (gameOverRef.current) return;
    const { row, col } = posRef.current;
    const ghostRow = getGhostRow(
      boardRef.current,
      currentRef.current.shape,
      row,
      col
    );
    const dropDistance = ghostRow - row;
    setScore((prev) => prev + dropDistance * 2);
    setPos((p) => ({ ...p, row: ghostRow }));
    setTimeout(() => lockPiece(), 0);
  }, [lockPiece]);

  const rotatePiece = useCallback(() => {
    if (gameOverRef.current) return;
    const rotated = rotate(currentRef.current.shape);
    const { row, col } = posRef.current;
    // Wall kick: try original, then left/right offsets
    for (const offset of [0, -1, 1, -2, 2]) {
      if (isValid(boardRef.current, rotated, row, col + offset)) {
        setCurrent((prev) => ({ ...prev, shape: rotated }));
        if (offset !== 0) setPos((p) => ({ ...p, col: p.col + offset }));
        return;
      }
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!started || gameOver) return;
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          moveDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          rotatePiece();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, gameOver, moveLeft, moveRight, moveDown, rotatePiece, hardDrop]);

  // Game tick
  useEffect(() => {
    if (!started || gameOver) return;
    const speed = Math.max(100, 800 - (level - 1) * 70);
    const id = setInterval(() => {
      moveDown();
    }, speed);
    return () => clearInterval(id);
  }, [started, gameOver, level, moveDown]);

  const startGame = useCallback(() => {
    const piece = randomPiece();
    const nextP = randomPiece();
    setBoard(createEmptyBoard());
    setCurrent(piece);
    setNext(nextP);
    setPos({ row: 0, col: Math.floor((COLS - piece.shape[0].length) / 2) });
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setStarted(true);
  }, []);

  // Render board with current piece and ghost
  const displayBoard = board.map((row) => [...row]);
  if (started && !gameOver) {
    const ghostRow = getGhostRow(board, current.shape, pos.row, pos.col);
    // Ghost piece
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (current.shape[r][c]) {
          const gr = ghostRow + r;
          const gc = pos.col + c;
          if (gr >= 0 && gr < ROWS && gc >= 0 && gc < COLS && !displayBoard[gr][gc]) {
            displayBoard[gr][gc] = { color: current.color + "40" };
          }
        }
      }
    }
    // Current piece
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (current.shape[r][c]) {
          const br = pos.row + r;
          const bc = pos.col + c;
          if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) {
            displayBoard[br][bc] = { color: current.color };
          }
        }
      }
    }
  }

  // Next piece preview (4x4 grid)
  const previewGrid: Cell[][] = Array.from({ length: 4 }, () =>
    Array(4).fill(null)
  );
  if (next) {
    const offsetR = Math.floor((4 - next.shape.length) / 2);
    const offsetC = Math.floor((4 - next.shape[0].length) / 2);
    for (let r = 0; r < next.shape.length; r++) {
      for (let c = 0; c < next.shape[r].length; c++) {
        if (next.shape[r][c]) {
          previewGrid[offsetR + r][offsetC + c] = { color: next.color };
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-10">
      {/* Game Board */}
      <div className="relative">
        <div
          className="grid rounded-xl border border-white/20 bg-black/40 p-1 backdrop-blur-md shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: "1px",
          }}
        >
          {displayBoard.flat().map((cell, i) => (
            <div
              key={i}
              className="aspect-square w-6 rounded-sm sm:w-7"
              style={{
                backgroundColor: cell ? cell.color : "rgba(255,255,255,0.05)",
                boxShadow: cell
                  ? `inset 0 0 6px rgba(255,255,255,0.3), 0 0 4px ${cell.color}`
                  : "none",
              }}
            />
          ))}
        </div>

        {/* Overlays */}
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold text-white">TETRIS</h2>
            <button
              onClick={startGame}
              className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              START
            </button>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm">
            <h2 className="mb-2 text-3xl font-bold text-red-400">
              GAME OVER
            </h2>
            <p className="mb-4 text-xl text-white">Score: {score}</p>
            <button
              onClick={startGame}
              className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              RETRY
            </button>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="flex flex-row gap-4 lg:flex-col lg:gap-6">
        {/* Next Piece */}
        <div className="rounded-xl border border-white/20 bg-black/30 p-4 backdrop-blur-md">
          <h3 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-white/60">
            Next
          </h3>
          <div
            className="grid gap-px"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {previewGrid.flat().map((cell, i) => (
              <div
                key={i}
                className="aspect-square w-5 rounded-sm sm:w-6"
                style={{
                  backgroundColor: cell
                    ? cell.color
                    : "rgba(255,255,255,0.05)",
                  boxShadow: cell
                    ? `inset 0 0 4px rgba(255,255,255,0.3)`
                    : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="rounded-xl border border-white/20 bg-black/30 p-4 backdrop-blur-md">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-white/60">
            Score
          </h3>
          <p className="text-2xl font-bold text-white">
            {score.toLocaleString()}
          </p>
        </div>

        {/* Level & Lines */}
        <div className="rounded-xl border border-white/20 bg-black/30 p-4 backdrop-blur-md">
          <div className="mb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Level
            </h3>
            <p className="text-xl font-bold text-white">{level}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Lines
            </h3>
            <p className="text-xl font-bold text-white">{lines}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="hidden rounded-xl border border-white/20 bg-black/30 p-4 backdrop-blur-md lg:block">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/60">
            Controls
          </h3>
          <div className="space-y-1 text-xs text-white/50">
            <p>
              <span className="text-white/80">←→</span> Move
            </p>
            <p>
              <span className="text-white/80">↑</span> Rotate
            </p>
            <p>
              <span className="text-white/80">↓</span> Soft Drop
            </p>
            <p>
              <span className="text-white/80">Space</span> Hard Drop
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div className="flex gap-3 lg:hidden">
        <button
          onPointerDown={moveLeft}
          className="rounded-xl bg-white/10 p-4 text-xl text-white active:bg-white/20"
        >
          ◀
        </button>
        <button
          onPointerDown={moveDown}
          className="rounded-xl bg-white/10 p-4 text-xl text-white active:bg-white/20"
        >
          ▼
        </button>
        <button
          onPointerDown={rotatePiece}
          className="rounded-xl bg-white/10 p-4 text-xl text-white active:bg-white/20"
        >
          ↻
        </button>
        <button
          onPointerDown={moveRight}
          className="rounded-xl bg-white/10 p-4 text-xl text-white active:bg-white/20"
        >
          ▶
        </button>
        <button
          onPointerDown={hardDrop}
          className="rounded-xl bg-white/10 px-5 py-4 text-sm font-bold text-white active:bg-white/20"
        >
          DROP
        </button>
      </div>
    </div>
  );
}
