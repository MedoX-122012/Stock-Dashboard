import { writable, get } from 'svelte/store';
import type { PriceAlert } from '$lib/types';
const KEY='mp_alerts';
function load():PriceAlert[]{try{const v=typeof localStorage!=='undefined'?localStorage.getItem(KEY):null;if(v) return JSON.parse(v);}catch{} return []}
export const alerts=writable<PriceAlert[]>(load());
export const triggeredAlerts=writable<string[]>([]);
if(typeof window!=='undefined') alerts.subscribe(v=>localStorage.setItem(KEY,JSON.stringify(v)));
export function addAlert(symbol:string,type:'above'|'below',target:number){alerts.update(a=>[...a,{id:Date.now().toString(),symbol,type,target,triggered:false,createdAt:Date.now()}])}
export function removeAlert(id:string){alerts.update(a=>a.filter(x=>x.id!==id))}
export function checkAlerts(symbol:string,price:number){
  alerts.update(list=>list.map(a=>{
    if(!a.triggered && a.symbol===symbol){
      const hit=(a.type==='above'&&price>=a.target)||(a.type==='below'&&price<=a.target);
      if(hit){triggeredAlerts.update(t=>[...t,`${a.symbol} ${a.type} $${a.target}`]);return {...a,triggered:true};}
    }
    return a;
  }));
}
