import { writable } from 'svelte/store';
import type { Stock, MarketIndex, ConnectionStatus, StockUpdate } from '$lib/types';
import { STOCKS, INDICES } from '$lib/data/stocks';

export const stocks = writable<Record<string,Stock>>(
  Object.fromEntries(STOCKS.map(s=>[s.symbol,{...s}]))
);
export const indices = writable<MarketIndex[]>(INDICES.map(i=>({...i})));
export const connectionStatus = writable<ConnectionStatus>('DISCONNECTED');
export const lastUpdate = writable<number>(Date.now());
export const updateCount = writable<number>(0);
export const marketTime = writable<Date>(new Date());
export const flashMap = writable<Record<string,'up'|'down'|null>>({});
let flashTimeout:Record<string,any>={};
export function applyUpdate(u:StockUpdate){
  stocks.update(m=>{
    const s=m[u.symbol];
    if(!s) return m;
    const prev=s.price;
    const dir = u.price>prev?'up':u.price<prev?'down':null;
    if(dir){
      flashMap.update(f=>({...f,[u.symbol]:dir}));
      if(flashTimeout[u.symbol]) clearTimeout(flashTimeout[u.symbol]);
      flashTimeout[u.symbol]=setTimeout(()=>flashMap.update(f=>({...f,[u.symbol]:null})),600);
    }
    s.price=u.price;
    s.change=u.change;
    s.changePercent=u.changePercent;
    s.volume=u.volume;
    s.high=Math.max(s.high,u.high);
    s.low=Math.min(s.low,u.low);
    s.sparkline=[...s.sparkline.slice(-19),u.price];
    return m;
  });
  lastUpdate.set(u.timestamp);
  updateCount.update(n=>n+1);
  indices.update(list=>list.map(idx=>({...idx,value: idx.value + (Math.random()-.5)*idx.value*0.0005, change: idx.change + (Math.random()-.5)*0.2 })));
}
setInterval(()=>marketTime.set(new Date()),1000);
