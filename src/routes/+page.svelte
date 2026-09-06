<script lang="ts">
import { onMount } from 'svelte';
import { stocks, indices, flashMap } from '$lib/stores/market.svelte';
import { initPortfolio } from '$lib/stores/portfolio.svelte';
import { initWatchlists } from '$lib/stores/watchlist.svelte';
import { initAlerts } from '$lib/stores/alerts.svelte';
import Sparkline from '$lib/components/Sparkline.svelte';
import StockChart from '$lib/components/StockChart.svelte';
let { data } = $props();
let idx=$state<any[]>([]);
let list=$state<any[]>([]);
let flash=$state<Record<string,any>>({});
let range=$state('1D');
let chartType=$state('area');
let paused=$state(false);
let showVol=$state(true);
indices.subscribe(v=>idx=v);
stocks.subscribe(v=>list=Object.values(v));
flashMap.subscribe(v=>flash=v);
onMount(()=>{
  if(data.user && data.portfolio) initPortfolio(data.portfolio, data.user.id);
  if(data.user && data.watchlists) initWatchlists(data.watchlists, data.user.id);
  if(data.user && data.alerts) initAlerts(data.alerts, data.user.id);
});
let movers=$derived([...list].sort((a,b)=>b.changePercent-a.changePercent));
let gainers=$derived(movers.slice(0,5));
let losers=$derived([...movers].reverse().slice(0,5));
let active=$derived([...list].sort((a,b)=>b.volume-a.volume).slice(0,5));
let spxPrices=$derived(idx.find(i=>i.symbol==='SPX')?.sparkline??[1,2,3]);
let sectorPerf=[
  {name:'Technology',perf:1.2,top:'NVDA +1.72%',worst:'INTC -0.83%'},
  {name:'Healthcare',perf:-.15,top:'PFE -0.85%',worst:'PFE -0.85%'},
  {name:'Financials',perf:.38,top:'JPM +0.67%',worst:'V +0.25%'},
  {name:'Energy',perf:.53,top:'XOM +0.53%',worst:'XOM +0.53%'},
  {name:'Consumer',perf:.41,top:'NFLX +0.85%',worst:'TSLA -1.43%'},
  {name:'Industrials',perf:.67,top:'CAT +0.67%',worst:'CAT +0.67%'},
  {name:'Utilities',perf:.32,top:'NEE +0.32%',worst:'NEE +0.32%'},
  {name:'Real Estate',perf:.52,top:'PLD +0.52%',worst:'PLD +0.52%'},
];
let heat=$derived(list.slice(0,12));
</script>
<div class="grid6">
  {#each idx as i}
    <div class="card">
      <div style="font-size:11px;color:#9ca3af">{i.name} • DEMO</div>
      <div style="font-weight:700;font-size:18px">{i.value.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
      <div class={i.changePercent>=0?'up':'down'}>{i.changePercent>=0?'↑':'↓'} {i.changePercent.toFixed(2)}% {i.change>=0?'+':''}{i.change.toFixed(2)}</div>
      <Sparkline data={i.sparkline} up={i.changePercent>=0}/>
    </div>
  {/each}
</div>

<div style="margin-top:14px" class="card">
  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <b>S&P 500 — Live Chart (Demo)</b>
    <span style="margin-left:auto;display:flex;gap:6px">
      {#each ['1D','1W','1M','3M','6M','1Y','5Y'] as r}
        <button class="btn" style:background={range===r?'#1f2937':''} onclick={()=>range=r}>{r}</button>
      {/each}
      <select bind:value={chartType}><option value="line">Line</option><option value="area">Area</option><option value="candlestick">Candlestick</option></select>
      <label style="font-size:12px"><input type="checkbox" bind:checked={showVol}/> Volume</label>
      <label style="font-size:12px"><input type="checkbox" bind:checked={paused}/> Pause Live</label>
    </span>
  </div>
  <StockChart prices={spxPrices} paused={paused}/>
  {#if showVol}<div style="height:60px;background:repeating-linear-gradient(90deg,#111827 0 8px,#0f1424 8px 16px);border:1px dashed #1f2937;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:12px">Volume — demo bars sync with price</div>{/if}
  <div style="font-size:11px;color:#6b7280;margin-top:6px">DEMO MODE — Simulated market data. Hover for price, change, time.</div>
</div>

<div class="grid3" style="margin-top:14px">
  <div class="card"><h3>Top Gainers</h3>
    {#each gainers as s}
      <div class:flash-up={flash[s.symbol]==='up'} class:flash-down={flash[s.symbol]==='down'} style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #111827"><a href="/stocks/{s.symbol}" style="color:#e5e7eb;text-decoration:none"><b>{s.symbol}</b> {s.name.slice(0,18)}</a><span class={s.changePercent>=0?'up':'down'}>{s.changePercent>=0?'↑':'↓'} {s.changePercent.toFixed(2)}%</span></div>
    {/each}
  </div>
  <div class="card"><h3>Top Losers</h3>
    {#each losers as s}
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #111827"><a href="/stocks/{s.symbol}" style="color:#e5e7eb;text-decoration:none"><b>{s.symbol}</b> {s.name.slice(0,18)}</a><span class={s.changePercent>=0?'up':'down'}>{s.changePercent>=0?'↑':'↓'} {s.changePercent.toFixed(2)}%</span></div>
    {/each}
  </div>
  <div class="card"><h3>Most Active</h3>
    {#each active as s}
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #111827"><a href="/stocks/{s.symbol}" style="color:#e5e7eb;text-decoration:none"><b>{s.symbol}</b></a><span style="color:#9ca3af">{(s.volume/1e6).toFixed(1)}M</span><span class={s.changePercent>=0?'up':'down'}>{s.price.toFixed(2)}</span></div>
    {/each}
  </div>
</div>

<div class="grid2" style="margin-top:14px">
  <div class="card">
    <h3>Sector Performance</h3>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
      {#each sectorPerf as sc}
        <div style="background:#111827;border:1px solid #1f2937;border-radius:8px;padding:8px;text-align:center">
          <div style="font-size:12px;color:#9ca3af">{sc.name}</div>
          <div class={sc.perf>=0?'up':'down'} style="font-weight:700">{sc.perf>=0?'↑':'↓'} {sc.perf.toFixed(2)}%</div>
          <div style="font-size:10px;color:#6b7280">{sc.top}</div>
        </div>
      {/each}
    </div>
  </div>
  <div class="card">
    <h3>Market Heatmap (size≈Market Cap, color≈Δ%)</h3>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
      {#each heat as s}
        <a href="/stocks/{s.symbol}" style="padding:10px;border-radius:8px;text-align:center;background:{s.changePercent>=1?'#052e16':s.changePercent<=-1?'#450a0a':'#111827'};border:1px solid {s.changePercent>=0?'#16a34a':'#ef4444'};text-decoration:none">
          <b style="font-size:12px;color:#e5e7eb">{s.symbol}</b><br/><span style="font-size:11px" class={s.changePercent>=0?'up':'down'}>{s.changePercent.toFixed(2)}%</span>
        </a>
      {/each}
    </div>
  </div>
</div>

<div class="card" style="margin-top:14px;overflow:auto">
  <h3>All Stocks — Live</h3>
  <table>
    <thead><tr><th>Symbol</th><th>Company</th><th>Price</th><th>Change</th><th>%</th><th>Volume</th><th>Market Cap</th><th>Sparkline</th></tr></thead>
    <tbody>
      {#each list as s}
        <tr class:flash-up={flash[s.symbol]==='up'} class:flash-down={flash[s.symbol]==='down'}>
          <td><a href="/stocks/{s.symbol}" style="color:#60a5fa;text-decoration:none;font-weight:700">{s.symbol}</a></td>
          <td>{s.name}</td>
          <td>${s.price.toFixed(2)}</td>
          <td class={s.change>=0?'up':'down'}>{s.change>=0?'↑':'↓'} {s.change.toFixed(2)}</td>
          <td class={s.changePercent>=0?'up':'down'}>{s.changePercent.toFixed(2)}%</td>
          <td>{(s.volume/1e6).toFixed(1)}M</td>
          <td>${(s.marketCap/1e9).toFixed(1)}B</td>
          <td><Sparkline data={s.sparkline} up={s.changePercent>=0}/></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<style>h3{margin:0 0 8px 0;font-size:14px}</style>
