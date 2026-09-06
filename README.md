# MarketPulse — Stock Dashboard

A real-time stock market dashboard built with **SvelteKit 5**, **Chart.js**, and **Server-Sent Events (SSE)**. Features simulated market data for demo/trading education purposes.

## Features

- **Live Market Data** — Real-time stock prices via SSE streaming
- **Interactive Charts** — Line, area, and candlestick charts with Chart.js
- **Stock Screener** — Filter by sector, price, and change percentage
- **Portfolio Tracker** — Paper trading with buy/sell simulation and P/L tracking
- **Watchlists** — Create and manage multiple custom watchlists
- **Price Alerts** — Set alerts triggered when price crosses target thresholds
- **Market Heatmap** — Visual market cap/sector performance overview
- **Sector Performance** — Sector-by-sector breakdown with top/worst performers
- **News Feed** — Curated market news with related stock links
- **Keyboard Shortcuts** — `Ctrl+K` to focus search
- **Responsive Design** — Works on desktop and mobile with collapsible sidebar
- **Dark Theme** — Professional dark UI with flash animations on price updates

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit 2 + Svelte 5 (Runes) |
| Language | TypeScript |
| Charts | Chart.js 4 |
| Styling | Scoped CSS (no framework) |
| State | Svelte Stores + `$state` runes |
| Streaming | Server-Sent Events (SSE) |
| Deployment | adapter-node |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/stock-dashboard.git
cd stock-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm start` | Run production server |
| `npm run check` | Type-check with svelte-check |

## Deployment

### Node.js Server (Recommended)

```bash
npm run build
npm start
```

The app will be available on `http://localhost:4173` by default.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm run build
EXPOSE 4173
CMD ["npm", "start"]
```

### Vercel / Netlify / Cloudflare

Replace `adapter-node` with the appropriate adapter:

```bash
# Vercel
npm install @sveltejs/adapter-vercel

# Netlify
npm install @sveltejs/adapter-netlify

# Cloudflare
npm install @sveltejs/adapter-cloudflare
```

Update `vite.config.ts` to use the new adapter.

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5173` | Dev server port |
| `HOST` | `127.0.0.1` | Dev server host |
| `PUBLIC_APP_NAME` | `MarketPulse` | App display name |
| `PUBLIC_DEMO_MODE` | `true` | Enable demo mode |
| `PUBLIC_SSE_INTERVAL` | `700` | SSE update interval (ms) |

## Project Structure

```
src/
├── lib/
│   ├── components/       # Reusable Svelte components
│   │   ├── StockChart.svelte
│   │   └── Sparkline.svelte
│   ├── data/             # Static stock/index data
│   │   └── stocks.ts
│   ├── services/         # SSE client connection
│   │   └── sse.ts
│   ├── stores/           # Svelte stores (state management)
│   │   ├── market.svelte.ts
│   │   ├── portfolio.svelte.ts
│   │   ├── watchlist.svelte.ts
│   │   └── alerts.svelte.ts
│   └── types/            # TypeScript interfaces
│       └── index.ts
├── routes/               # SvelteKit file-based routing
│   ├── +layout.svelte    # Main layout with sidebar
│   ├── +page.svelte      # Dashboard overview
│   ├── alerts/           # Price alerts page
│   ├── markets/          # Stock screener
│   ├── news/             # Market news
│   ├── portfolio/        # Portfolio tracker
│   ├── settings/         # User settings
│   ├── stocks/[symbol]/  # Individual stock detail
│   ├── watchlist/        # Watchlist manager
│   └── api/stream/       # SSE endpoint
└── app.html              # HTML template
```

## License

MIT
