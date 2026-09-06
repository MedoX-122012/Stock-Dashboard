<script lang="ts">
import { page } from '$app/stores';
import { stocks } from '$lib/stores/market.svelte';
import StockChart from '$lib/components/StockChart.svelte';
let sym=$derived($page.params.symbol??'');
let stock=$state<any>(null);
stocks.subscribe(m=>{ stock=sym ? m[sym] : null; });
let range=$state('1D');
let ctype=$state('line');
let paused=$state(false);
let qty=$state(1);
let tab=$state<'BUY'|'SELL'>('BUY');
let showModal=$state(false);
import { buy, sell, cash } from '$lib/stores/portfolio.svelte';
let cashV=$state(100000);
cash.subscribe(v=>cashV=v);
let msg=$state('');
function doTrade(){
  if(!sym || !stock) return;
  try{
    if(tab==='BUY') buy(sym,Number(qty),stock.price);
    else sell(sym,Number(qty),stock.price);
    msg=`${tab} ${qty} ${sym} @ $${stock.price.toFixed(2)} — simulated.`;
    showModal=false;
  }catch(e:any){msg=e.message;}
}
</script>
{#if !stock}
  <div class="card">Invalid symbol: {sym} — <a href="/" style="color:#60a5fa">Back</a></div>
{:else}
  <div class="card" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
    <div style="width:44px;height:44px;background:#1f2937;border-radius:10px;display:grid;place-items:center;font-weight:800">{sym[0]}</div>
    <div><div style="font-weight:800;font-size:18px">{stock.name} <span style="color:#9ca3af;font-weight:600">{sym}</span> <span style="font-size:12px;color:#6b7280">{stock.sector}</span></div>
    <div style="font-size:28px;font-weight:800">${stock.price.toFixed(2)} <span class={stock.change>=0?'up':'down'} style="font-size:16px">{stock.change>=0?'↑':'↓'} {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span></div></div>
    <button class="btn primary" style="margin-left:auto" onclick={()=>showModal=true}>Buy / Sell (Demo)</button>
  </div>
  <div class="grid3" style="margin-top:12px">
    <div class="card"><div style="color:#9ca3af;font-size:12px">Open</div><b>{stock.open.toFixed(2)}</b></div>
    <div class="card"><div style="color:#9ca3af;font-size:12px">High / Low</div><b>{stock.high.toFixed(2)} / {stock.low.toFixed(2)}</b></div>
    <div class="card"><div style="color:#9ca3af;font-size:12px">Prev Close</div><b>{stock.previousClose.toFixed(2)}</b></div>
    <div class="card"><div style="color:#9ca3af;font-size:12px">Volume</div><b>{stock.volume.toLocaleString()}</b></div>
    <div class="card"><div style="color:#9ca3af;font-size:12px">Market Cap</div><b>${(stock.marketCap/1e9).toFixed(1)}B</b></div>
    <div class="card"><div style="color:#9ca3af;font-size:12px">P/E / Yield</div><b>{stock.peRatio} / {stock.dividendYield}%</b></div>
  </div>
  <div class="card" style="margin-top:12px">
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      {#each ['1D','1W','1M','3M','6M','1Y','5Y'] as r}<button class="btn" onclick={()=>range=r} style:background={range===r?'#1f2937':''}>{r}</button>{/each}
      <select bind:value={ctype}><option value="line">Line</option><option value="area">Area</option><option value="candlestick">Candlestick</option></select>
      <label><input type="checkbox" bind:checked={paused}/> Pause Live</label>
    </div>
    <StockChart prices={stock.sparkline.concat([stock.price])} paused={paused}/>
    <div style="font-size:11px;color:#6b7280">Chart updates live via SSE • Candlestick mode shows OHLC simulation • DEMO data</div>
  </div>
  {#if msg}<div class="card" style="margin-top:10px;background:#052e16;border-color:#16a34a">{msg}</div>{/if}
  {#if showModal}
    <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:50" onclick={()=>showModal=false} role="button" tabindex="0" onkeydown={(e)=>{if(e.key==='Escape')showModal=false}}>
      <div class="card" style="width:360px" onclick={(e)=>e.stopPropagation()}>
        <div style="display:flex;gap:8px"><button class="btn" class:primary={tab==='BUY'} onclick={()=>tab='BUY'}>BUY</button><button class="btn" class:primary={tab==='SELL'} onclick={()=>tab='SELL'}>SELL</button><button class="btn" style="margin-left:auto" onclick={()=>showModal=false}>✕</button></div>
        <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">
          <div>Symbol: <b>{sym}</b></div>
          <label>Quantity <input type="number" min="1" bind:value={qty}/></label>
          <div>Est. price: ${stock.price.toFixed(2)}</div>
          <div>Est. total: ${(Number(qty)*stock.price).toFixed(2)}</div>
          <div style="font-size:12px;color:#9ca3af">Available demo cash: ${cashV.toFixed(2)}</div>
          <div style="font-size:11px;color:#f59e0b">Simulated order — no real brokerage.</div>
          <button class="btn primary" onclick={doTrade}>Confirm {tab} {qty} {sym}</button>
        </div>
      </div>
    </div>
  {/if}
{/if}
