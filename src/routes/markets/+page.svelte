<script lang="ts">
import { stocks } from '$lib/stores/market.svelte';
let list=$state<any[]>([]);
let sector=$state('All');
let minPrice=$state(0);
let minChg=$state(-100);
let q=$state('');
stocks.subscribe(v=>list=Object.values(v));
let filtered=$derived(list.filter(s=>{
  if(sector!=='All'&&s.sector!==sector) return false;
  if(s.price<minPrice) return false;
  if(s.changePercent<minChg) return false;
  if(q && !s.symbol.toLowerCase().includes(q.toLowerCase()) && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
  return true;
}));
</script>
<div class="card" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
  <b>Stock Screener</b>
  <input placeholder="Search…" bind:value={q}/>
  <select bind:value={sector}><option>All</option><option>Technology</option><option>Healthcare</option><option>Financials</option><option>Energy</option><option>Consumer</option><option>Industrials</option><option>Utilities</option><option>Real Estate</option></select>
  <label>Min Price $<input type="number" bind:value={minPrice} style="width:80px"/></label>
  <label>Min Chg %<input type="number" bind:value={minChg} style="width:80px"/></label>
  <span style="margin-left:auto;color:#9ca3af;font-size:12px">{filtered.length} results</span>
</div>
<div class="card" style="margin-top:12px;overflow:auto">
<table><thead><tr><th>Symbol</th><th>Name</th><th>Sector</th><th>Price</th><th>Change %</th><th>P/E</th><th>Volume</th></tr></thead>
<tbody>
{#each filtered as s}
<tr><td><a href="/stocks/{s.symbol}" style="color:#60a5fa;text-decoration:none;font-weight:700">{s.symbol}</a></td><td>{s.name}</td><td>{s.sector}</td><td>${s.price.toFixed(2)}</td><td class={s.changePercent>=0?'up':'down'}>{s.changePercent.toFixed(2)}%</td><td>{s.peRatio}</td><td>{(s.volume/1e6).toFixed(1)}M</td></tr>
{/each}
</tbody></table>
</div>
