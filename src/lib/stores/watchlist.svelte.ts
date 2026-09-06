import { writable } from 'svelte/store';
import type { Watchlist } from '$lib/types';
const KEY='mp_watchlists';
function load():Watchlist[]{try{const v=typeof localStorage!=='undefined'?localStorage.getItem(KEY):null;if(v) return JSON.parse(v);}catch{} return [{id:'default',name:'My Watchlist',symbols:['AAPL','MSFT','NVDA','TSLA','AMZN']}] }
export const watchlists=writable<Watchlist[]>(load());
if(typeof window!=='undefined') watchlists.subscribe(v=>localStorage.setItem(KEY,JSON.stringify(v)));
export function addToWatchlist(id:string,symbol:string){watchlists.update(w=>w.map(x=>x.id===id&&!x.symbols.includes(symbol)?{...x,symbols:[...x.symbols,symbol]}:x))}
export function removeFromWatchlist(id:string,symbol:string){watchlists.update(w=>w.map(x=>x.id===id?{...x,symbols:x.symbols.filter(s=>s!==symbol)}:x))}
export function createWatchlist(name:string){watchlists.update(w=>[...w,{id:Date.now().toString(),name,symbols:[]}])}
export function deleteWatchlist(id:string){watchlists.update(w=>w.filter(x=>x.id!==id))}
