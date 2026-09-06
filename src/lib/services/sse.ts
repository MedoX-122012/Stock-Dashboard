import { connectionStatus, applyUpdate } from '$lib/stores/market.svelte';
import { checkAlerts } from '$lib/stores/alerts.svelte';
let es:EventSource|null=null;
let retries=0, timer:any=null;
export function connect(){
  if(typeof window==='undefined') return;
  if(es) return;
  connectionStatus.set('CONNECTING');
  es=new EventSource('/api/stream');
  es.addEventListener('stock-update',(e:MessageEvent)=>{
    try{
      const d=JSON.parse(e.data);
      applyUpdate(d);
      checkAlerts(d.symbol,d.price);
      retries=0;
      connectionStatus.set('CONNECTED');
    }catch{}
  });
  es.onopen=()=>{retries=0;connectionStatus.set('CONNECTED');};
  es.onerror=()=>{
    connectionStatus.set('RECONNECTING');
    es?.close();es=null;
    const delay=Math.min(1000*Math.pow(1.8,retries),15000);
    retries++;
    clearTimeout(timer);
    timer=setTimeout(()=>connect(),delay);
  };
}
export function disconnect(){es?.close();es=null;clearTimeout(timer);connectionStatus.set('DISCONNECTED');}
