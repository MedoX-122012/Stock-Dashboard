import fs from 'node:fs';
import path from 'node:path';
import type { PortfolioPosition, Transaction, PriceAlert, Watchlist } from '$lib/types';

const DATA_DIR = path.resolve('data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  ensureDir();
  const fp = path.join(DATA_DIR, file);
  try { return JSON.parse(fs.readFileSync(fp, 'utf-8')); }
  catch { return fallback; }
}

function writeJson(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf-8');
}

// --- Portfolio ---
export function getPortfolio(userId: string): { cash: number; positions: PortfolioPosition[]; transactions: Transaction[] } {
  const all = readJson<Record<string, { cash: number; positions: PortfolioPosition[]; transactions: Transaction[] }>>('portfolio.json', {});
  return all[userId] ?? { cash: 100000, positions: [], transactions: [] };
}

export function savePortfolio(userId: string, data: { cash: number; positions: PortfolioPosition[]; transactions: Transaction[] }) {
  const all = readJson<Record<string, any>>('portfolio.json', {});
  all[userId] = data;
  writeJson('portfolio.json', all);
}

// --- Watchlists ---
export function getWatchlists(userId: string): Watchlist[] {
  const all = readJson<Record<string, Watchlist[]>>('watchlists.json', {});
  return all[userId] ?? [{ id: 'default', name: 'My Watchlist', symbols: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'] }];
}

export function saveWatchlists(userId: string, data: Watchlist[]) {
  const all = readJson<Record<string, Watchlist[]>>('watchlists.json', {});
  all[userId] = data;
  writeJson('watchlists.json', all);
}

// --- Alerts ---
export function getAlerts(userId: string): PriceAlert[] {
  const all = readJson<Record<string, PriceAlert[]>>('alerts.json', {});
  return all[userId] ?? [];
}

export function saveAlerts(userId: string, data: PriceAlert[]) {
  const all = readJson<Record<string, PriceAlert[]>>('alerts.json', {});
  all[userId] = data;
  writeJson('alerts.json', all);
}
