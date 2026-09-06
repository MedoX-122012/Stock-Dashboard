<script lang="ts">
import { stocks } from '$lib/stores/market.svelte';
import StockChart from '$lib/components/StockChart.svelte';
import type { Stock } from '$lib/types';
let smap=$state<Record<string,Stock>>({});
stocks.subscribe(v=>smap=v);
let selected=$state<string[]>(['AAPL','MSFT']);
let addSym=$state('');
function addStock(){
  if(addSym && !selected.includes(addSym) && selected.length<5){
    selected=[...selected,addSym];
    addSym='';
  }
}
function removeStock(sym:string){
  selected=selected.filter(s=>s!==sym);
}
let compData=$derived(selected.map(sym=>{
  const s=smap[sym];
  if(!s) return null;
  return {
    symbol:sym,
    name:s.name,
    price:s.price,
    change:s.change,
    changePercent:s.changePercent,
    volume:s.volume,
    marketCap:s.marketCap,
    peRatio:s.peRatio,
    sparkline:s.sparkline
  };
}).filter((d): d is NonNullable<typeof d> => d!==null));
let maxPrice=$derived(Math.max(...compData.map(d=>d.price)));
</script>
<div class="card">
  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <b>Stock Comparison</b>
    <select bind:value={addSym}><option value="">Select stock…</option>{#each Object.keys(smap) as k}{#if !selected.includes(k)}<option value={k}>{k} — {smap[k].name}</option>{/if}{/each}</select>
    <button class="btn primary" onclick={addStock} disabled={selected.length>=5}>Add{selected.length>=5?' (max 5)':''}</button>
    <span style="margin-left:auto;color:#9ca3af;font-size:12px">{selected.length}/5 stocks</span>
  </div>
</div>

{#if compData.length>0}
  <div class="card" style="margin-top:12px">
    <h3>Price Chart Overlay</h3>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
      {#each compData as d,idx}
        <span style="background:#111827;border:1px solid #1f2937;padding:4px 8px;border-radius:6px;font-size:12px;display:flex;align-items:center;gap:4px">
          <span style="width:8px;height:8px;border-radius:50%;background:{idx===0?'#22c55e':idx===1?'#60a5fa':idx===2?'#f59e0b':idx===3?'#a78bfa':'#f472b6'}"></span>
          {d.symbol}
          <button onclick={()=>removeStock(d.symbol)} style="background:none;border:none;color:#6b7280;cursor:pointer;padding:0 2px;font-size:14px">×</button>
        </span>
      {/each}
    </div>
    <div style="height:340px;position:relative">
      {#each compData as d,idx}
        <div style="position:absolute;top:{idx*28}px;left:8px;z-index:1;background:rgba(15,20,36,.8);padding:2px 6px;border-radius:4px;font-size:11px">
          <span style="color:{idx===0?'#22c55e':idx===1?'#60a5fa':idx===2?'#f59e0b':idx===3?'#a78bfa':'#f472b6'}">● {d.symbol}</span>
        </div>
      {/each}
      <StockChart prices={compData[0]?.sparkline??[]} paused={false}/>
    </div>
  </div>

  <div class="card" style="margin-top:12px;overflow:auto">
    <h3>Side-by-Side Comparison</h3>
    <table>
      <thead>
        <tr><th>Metric</th>{#each compData as d}<th>{d.symbol}</th>{/each}</tr>
      </thead>
      <tbody>
        <tr><td>Company</td>{#each compData as d}<td>{d.name}</td>{/each}</tr>
        <tr><td>Price</td>{#each compData as d}<td>${d.price.toFixed(2)}</td>{/each}</tr>
        <tr><td>Change</td>{#each compData as d}<td class={d.change>=0?'up':'down'}>{d.change>=0?'+':''}{d.change.toFixed(2)}</td>{/each}</tr>
        <tr><td>Change %</td>{#each compData as d}<td class={d.changePercent>=0?'up':'down'}>{d.changePercent.toFixed(2)}%</td>{/each}</tr>
        <tr><td>Volume</td>{#each compData as d}<td>{(d.volume/1e6).toFixed(1)}M</td>{/each}</tr>
        <tr><td>Market Cap</td>{#each compData as d}<td>${(d.marketCap/1e9).toFixed(1)}B</td>{/each}</tr>
        <tr><td>P/E Ratio</td>{#each compData as d}<td>{d.peRatio}</td>{/each}</tr>
      </tbody>
    </table>
  </div>

  <div class="grid{Math.min(compData.length,3)}" style="margin-top:12px">
    {#each compData as d}
      <div class="card" style="text-align:center">
        <div style="font-size:24px;font-weight:800">${d.price.toFixed(2)}</div>
        <div style="font-weight:700">{d.symbol} <span style="color:#9ca3af;font-size:12px">{d.name}</span></div>
        <div class={d.changePercent>=0?'up':'down'} style="font-size:14px">{d.changePercent>=0?'↑':'↓'} {d.changePercent.toFixed(2)}%</div>
      </div>
    {/each}
  </div>
{:else}
  <div class="card" style="margin-top:12px;color:#6b7280;text-align:center;padding:40px">
    Select stocks to compare. You can add up to 5 stocks.
  </div>
{/if}
<style>h3{margin:0 0 8px 0;font-size:14px}</style>
