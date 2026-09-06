import { writable, get } from 'svelte/store';
import type { PortfolioPosition, Transaction } from '$lib/types';

export const cash = writable<number>(100000);
export const positions = writable<PortfolioPosition[]>([]);
export const transactions = writable<Transaction[]>([]);

let userId: string | null = null;

export function initPortfolio(data: { cash: number; positions: PortfolioPosition[]; transactions: Transaction[] }, uid: string | null) {
  userId = uid;
  cash.set(data.cash);
  positions.set(data.positions);
  transactions.set(data.transactions);
}

async function save() {
  if (!userId) return;
  try {
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cash: get(cash),
        positions: get(positions),
        transactions: get(transactions)
      })
    });
  } catch {}
}

export function buy(symbol: string, qty: number, price: number) {
  const total = qty * price;
  const c = get(cash);
  if (total > c) throw new Error('Insufficient demo funds');
  cash.set(c - total);
  positions.update(p => {
    const ex = p.find(x => x.symbol === symbol);
    if (ex) {
      const t = ex.shares + qty;
      ex.avgPrice = (ex.avgPrice * ex.shares + price * qty) / t;
      ex.shares = t;
      return [...p];
    }
    return [...p, { symbol, shares: qty, avgPrice: price }];
  });
  transactions.update(t => [{
    id: Date.now().toString(), date: Date.now(), symbol, action: 'BUY',
    quantity: qty, price, total
  }, ...t]);
  save();
}

export function sell(symbol: string, qty: number, price: number) {
  const pos = get(positions).find(p => p.symbol === symbol);
  if (!pos || pos.shares < qty) throw new Error('Insufficient shares');
  cash.update(c => c + qty * price);
  positions.update(p => {
    const ex = p.find(x => x.symbol === symbol)!;
    ex.shares -= qty;
    return p.filter(x => x.shares > 0);
  });
  transactions.update(t => [{
    id: Date.now().toString(), date: Date.now(), symbol, action: 'SELL',
    quantity: qty, price, total: qty * price
  }, ...t]);
  save();
}
