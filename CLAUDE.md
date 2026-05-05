# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

カレンダー付き日記 Web アプリ。React + Vite で構築し、データは localStorage に永続化する。

## Commands

```bash
# 依存インストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# 型チェック（TypeScript使用時）
npm run typecheck

# Lint
npm run lint
```

## Architecture

### Tech Stack
- **React + Vite** — フロントエンド
- **TailwindCSS** — スタイリング
- **localStorage** — データ永続化（サーバー不要、オフライン動作）

### Data Model

localStorage に以下の形式で保存する（キー: `diary_entries`）:

```json
{
  "2026-05-05": {
    "title": "今日の出来事",
    "body": "...",
    "mood": "happy",
    "createdAt": "2026-05-05T10:00:00",
    "updatedAt": "2026-05-05T12:30:00"
  }
}
```

日付キーは `YYYY-MM-DD` 形式。1日1エントリ（上書き保存）。

### Component Structure

```
App
├── Header（検索バー）
├── CalendarPanel（左ペイン）
│   └── CalendarGrid（月表示、日付セル）
└── DiaryEditor（右ペイン）
    ├── タイトル入力
    ├── 本文入力（Markdown 対応）
    ├── 気分セレクター
    └── 保存・削除ボタン
```

### State Management

グローバル状態は `App` コンポーネントで管理し、props で子に渡す（Context は不要な規模）:
- `entries` — 全日記データ（localStorage と同期）
- `selectedDate` — 現在選択中の日付（`YYYY-MM-DD`）
- `currentMonth` — カレンダーの表示月（`{ year, month }`）

### localStorage Sync

`entries` が変わるたびに `useEffect` で localStorage へ書き込む。初期値は localStorage から読み込む。

## Key Decisions

- **1日1エントリ**：同じ日付への保存は上書き
- **日付キー形式**：`YYYY-MM-DD`（`toISOString().slice(0, 10)` で生成）
- **検索**：クライアントサイドのみ、`entries` オブジェクトを走査してフィルタリング
