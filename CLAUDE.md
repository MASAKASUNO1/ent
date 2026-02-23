# CLAUDE.md

## プロジェクト概要
Next.js (App Router) + Tailwind CSS v4 のプロジェクト。

## 開発コマンド
- `npm run dev` — 開発サーバー起動
- `npm run build` — プロダクションビルド
- `npm run lint` — ESLint実行

## Entire (セッション管理)
- `entire enable --agent claude-code --force` で非対話モードが有効化済み
- コミット時の「Link this commit to Claude Code session context?」は常に自動で Y（紐付ける）
- フックを再セットアップする場合は `entire enable --agent claude-code --force` を実行すること
