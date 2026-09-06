import { writable, get } from 'svelte/store';
import type { PortfolioPosition, Transaction } from '$lib/types';
const POS_KEY='mp_positions', TX_KEY='mp_txs', CASH_KEY='mp_cash';
function load<T>(k:string,f:T):T{try{const v=typeof localStorage!=='undefined'?localStorage.getItem(k):null;return v?JSON.parse(v):f}catch{return f}}
export const cash = writable<number>(load(CASH_KEY,100000));
export const positions = writable<PortfolioPosition[]>(load(POS_KEY,[]));
export const transactions = writable<Transaction[]>(load(TX_KEY,[]));
if(typeof window!=='undefined'){
  cash.subscribe(v=>localStorage.setItem(CASH_KEY,JSON.stringify(v)));
  positions.subscribe(v=>localStorage.setItem(POS_KEY,JSON.stringify(v)));
  transactions.subscribe(v=>localStorage.setItem(TX_KEY,JSON.stringify(v)));
}
export function buy(symbol:string,qty:number,price:number){
  const total=qty*price;
  const c=get(cash);
  if(total>c) throw new Error('Insufficient demo funds');
  cash.set(c-total);
  positions.update(p=>{
    const ex=p.find(x=>x.symbol===symbol);
    if(ex){const t=ex.shares+qty;ex.avgPrice=(ex.avgPrice*ex.shares+price*qty)/t;ex.shares=t;return [...p];}
    return [...p,{symbol,shares:qty,avgPrice:price}];
  });
  transactions.update(t=>[{id:Date.now().toString(),date:Date.now(),symbol,action:'BUY',quantity:qty,price,total},...t]);
}
export function sell(symbol:string,qty:number,price:number){
  const pos=get(positions).find(p=>p.symbol===symbol);
  if(!pos||pos.shares<qty) throw new Error('Insufficient shares');
  cash.update(c=>c+qty*price);
  positions.update(p=>{
    const ex=p.find(x=>x.symbol===symbol)!;
    ex.shares-=qty;
    return p.filter(x=>x.shares>0);
  });
  transactions.update(t=>[{id:Date.now().toString(),date:Date.now(),symbol,action:'SELL',quantity:qty,price,total:qty*price},...t]);
}
