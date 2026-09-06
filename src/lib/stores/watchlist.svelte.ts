import { writable, get } from 'svelte/store';
import type { Watchlist } from '$lib/types';

export const watchlists = writable<Watchlist[]>([
  { id: 'default', name: 'My Watchlist', symbols: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'] }
]);

let userId: string | null = null;

export function initWatchlists(data: Watchlist[], uid: string | null) {
  userId = uid;
  watchlists.set(data);
}

async function save() {
  if (!userId) return;
  try {
    await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(get(watchlists))
    });
  } catch {}
}

export function addToWatchlist(id: string, symbol: string) {
  watchlists.update(w => w.map(x => x.id === id && !x.symbols.includes(symbol) ? { ...x, symbols: [...x.symbols, symbol] } : x));
  save();
}

export function removeFromWatchlist(id: string, symbol: string) {
  watchlists.update(w => w.map(x => x.id === id ? { ...x, symbols: x.symbols.filter(s => s !== symbol) } : x));
  save();
}

export function createWatchlist(name: string) {
  watchlists.update(w => [...w, { id: Date.now().toString(), name, symbols: [] }]);
  save();
}

export function deleteWatchlist(id: string) {
  watchlists.update(w => w.filter(x => x.id !== id));
  save();
}
