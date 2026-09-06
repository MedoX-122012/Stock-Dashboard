<script lang="ts">
import { alerts, addAlert, removeAlert, triggeredAlerts } from '$lib/stores/alerts.svelte';
import { stocks } from '$lib/stores/market.svelte';
let list=$state<any[]>([]);
let smap=$state<Record<string,any>>({});
let trig=$state<string[]>([]);
let sym=$state('AAPL');
let type=$state<'above'|'below'>('above');
let target=$state(200);
alerts.subscribe(v=>list=v);
stocks.subscribe(v=>smap=v);
triggeredAlerts.subscribe(v=>trig=v);
let toast=$state('');
$effect(()=>{ if(trig.length){ toast=trig[trig.length-1]; setTimeout(()=>toast='',3000);} });
</script>
{#if toast}<div style="position:fixed;top:14px;right:14px;background:#052e16;border:1px solid #16a34a;color:#22c55e;padding:10px 14px;border-radius:8px;z-index:40">🔔 {toast} triggered</div>{/if}
<div class="card" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
  <b>Price Alerts (Demo)</b>
  <select bind:value={sym}>{#each Object.keys(smap) as k}<option value={k}>{k}</option>{/each}</select>
  <select bind:value={type}><option value="above">Above</option><option value="below">Below</option></select>
  <input type="number" bind:value={target} style="width:120px"/>
  <button class="btn primary" onclick={()=>addAlert(sym,type,Number(target))}>Create Alert</button>
</div>
<div class="card" style="margin-top:12px">
  <table><thead><tr><th>Symbol</th><th>Type</th><th>Target</th><th>Current</th><th>Status</th><th></th></tr></thead>
  <tbody>
    {#each list as a}
      <tr><td>{a.symbol}</td><td>{a.type}</td><td>${a.target.toFixed(2)}</td><td>{smap[a.symbol]?.price.toFixed(2)??'-'}</td><td>{a.triggered?'🔔 Triggered':'⏳ Active'}</td><td><button class="btn" onclick={()=>removeAlert(a.id)}>Remove</button></td></tr>
    {/each}
    {#if list.length===0}<tr><td colspan="6" style="color:#6b7280">No alerts — create one above. SSE will trigger when price meets condition.</td></tr>{/if}
  </tbody></table>
</div>
