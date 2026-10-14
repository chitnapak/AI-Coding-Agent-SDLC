# AI-Coding-Agent-SDLC

Farmart — Next.js 16 grocery e-commerce demo with SQLite.

## Getting Started

```bash
npm install
npm run db:seed   # seed farmart.db
npm run dev       # http://localhost:3000
```

## Build & Deploy

```bash
npm run build:vercel   # seed DB then next build
npm run start
```

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: SQLite via `better-sqlite3`
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest v4 + Playwright
