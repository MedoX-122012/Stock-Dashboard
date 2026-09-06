import { writable, get } from 'svelte/store';
import type { PriceAlert } from '$lib/types';

export const alerts = writable<PriceAlert[]>([]);
export const triggeredAlerts = writable<string[]>([]);

let userId: string | null = null;

export function initAlerts(data: PriceAlert[], uid: string | null) {
  userId = uid;
  alerts.set(data);
}

async function save() {
  if (!userId) return;
  try {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(get(alerts))
    });
  } catch {}
}

export function addAlert(symbol: string, type: 'above' | 'below', target: number) {
  alerts.update(a => [...a, {
    id: Date.now().toString(), symbol, type, target, triggered: false, createdAt: Date.now()
  }]);
  save();
}

export function removeAlert(id: string) {
  alerts.update(a => a.filter(x => x.id !== id));
  save();
}

export function checkAlerts(symbol: string, price: number) {
  alerts.update(list => list.map(a => {
    if (!a.triggered && a.symbol === symbol) {
      const hit = (a.type === 'above' && price >= a.target) || (a.type === 'below' && price <= a.target);
      if (hit) {
        triggeredAlerts.update(t => [...t, `${a.symbol} ${a.type} $${a.target}`]);
        return { ...a, triggered: true };
      }
    }
    return a;
  }));
}
