# AI Football Predictor

Public football prediction website using Next.js App Router, football-data.org, optional NewsAPI + RSS, and transparent statistical scoring (form + ELO + H2H + standings proxy + news impact). No auth required.

## Features

- Daily upcoming fixtures with date navigation and league filters
- Local-time kickoff display in the browser
- Per-match prediction:
  - winner (`HOME` / `AWAY` / `DRAW`)
  - confidence badge
  - short deterministic reasoning
- Match detail page with probability split and factor breakdown
- Daily refresh endpoint for Vercel Cron
- Cache-first architecture with Upstash Redis (optional, fallback works without Redis)
- Safe fallback behavior: when data is missing, returns `INSUFFICIENT_DATA` (no fabricated stats)

## Stack

- Frontend + backend: Next.js App Router + API routes
- Styling: Tailwind CSS
- Football data: football-data.org free tier
- News/injury signals: NewsAPI (if key provided) + RSS fallback
- Cache: Upstash Redis REST
- Deploy: Vercel Hobby

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set:

- `FOOTBALL_DATA_API_KEY` (required for live fixtures)
- `NEWSAPI_KEY` (optional)
- `UPSTASH_REDIS_REST_URL` (optional but recommended)
- `UPSTASH_REDIS_REST_TOKEN` (optional but recommended)
- `CRON_SECRET` (required for protected refresh endpoint)

Signup links:

- football-data.org: https://www.football-data.org/client/register
- NewsAPI: https://newsapi.org/register
- Upstash: https://upstash.com/
- Vercel: https://vercel.com/signup

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API routes

- `GET /api/matches?date=YYYY-MM-DD&league=PL`
- `GET /api/predictions/{matchId}?date=YYYY-MM-DD`
- `GET /api/refresh?date=YYYY-MM-DD` with header `Authorization: Bearer <CRON_SECRET>`

## Cron

`vercel.json` config schedules daily refresh:

- `0 6 * * *` -> `/api/refresh`

## Prediction model (transparent)

- Weighted factors:
  - Form: 0.35
  - ELO-like rating: 0.30
  - Standings proxy: 0.20
  - H2H: 0.10
  - News/injuries: 0.05
- Probabilities derived from aggregate score with draw prior
- If team history is below minimum threshold, output `INSUFFICIENT_DATA`
