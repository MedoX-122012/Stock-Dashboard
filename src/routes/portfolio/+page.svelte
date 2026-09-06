<script lang="ts">
import { onMount } from 'svelte';
import { positions, transactions, cash, initPortfolio } from '$lib/stores/portfolio.svelte';
import { stocks } from '$lib/stores/market.svelte';
let { data } = $props();
let pos=$state<any[]>([]);
let txs=$state<any[]>([]);
let c=$state(0);
let smap=$state<Record<string,any>>({});
let filter=$state('All');
positions.subscribe(v=>pos=v);
transactions.subscribe(v=>txs=v);
cash.subscribe(v=>c=v);
stocks.subscribe(v=>smap=v);
onMount(()=>{
  if(data.user && data.portfolio) initPortfolio(data.portfolio, data.user.id);
});
let rows=$derived(pos.map(p=>{
  const s=smap[p.symbol];
  const cur=s?.price??p.avgPrice;
  const mv=cur*p.shares;
  const cost=p.avgPrice*p.shares;
  const pl=mv-cost;
  return {...p,cur,mv,pl,plp:(pl/cost)*100};
}));
let totalMV=$derived(rows.reduce((a,r)=>a+r.mv,0));
let totalPL=$derived(rows.reduce((a,r)=>a+r.pl,0));
let filteredTxs=$derived(filter==='All'?txs:txs.filter(t=>t.action===filter.toUpperCase()));
</script>
{#if !data.user}
  <div class="card" style="text-align:center;padding:40px">
    <h3 style="margin:0 0 8px">Sign in to view your portfolio</h3>
    <p style="color:#9ca3af;margin:0 0 16px">Create an account to start trading with $100,000 demo cash</p>
    <a href="/login" class="btn primary" style="text-decoration:none;margin-right:8px">Sign In</a>
    <a href="/signup" class="btn primary" style="text-decoration:none">Sign Up Free</a>
  </div>
{:else}
  <div class="grid3">
    <div class="card"><div style="color:#9ca3af;font-size:12px">Demo Cash</div><div style="font-size:22px;font-weight:800">${c.toFixed(2)}</div></div>
    <div class="card"><div style="color:#9ca3af;font-size:12px">Holdings Value</div><div style="font-size:22px;font-weight:800">${totalMV.toFixed(2)}</div></div>
    <div class="card"><div style="color:#9ca3af;font-size:12px">Unrealized P/L</div><div style="font-size:22px;font-weight:800" class={totalPL>=0?'up':'down'}>{totalPL>=0?'↑':'↓'} ${totalPL.toFixed(2)}</div></div>
  </div>
  <div class="card" style="margin-top:12px;overflow:auto">
    <h3>Holdings — Live P/L updates via SSE</h3>
    <table><thead><tr><th>Symbol</th><th>Shares</th><th>Avg Price</th><th>Current</th><th>Market Value</th><th>P/L</th><th>P/L %</th></tr></thead>
    <tbody>
      {#each rows as r}
        <tr><td><a href="/stocks/{r.symbol}" style="color:#60a5fa;text-decoration:none;font-weight:700">{r.symbol}</a></td><td>{r.shares}</td><td>${r.avgPrice.toFixed(2)}</td><td>${r.cur.toFixed(2)}</td><td>${r.mv.toFixed(2)}</td><td class={r.pl>=0?'up':'down'}>{r.pl.toFixed(2)}</td><td class={r.pl>=0?'up':'down'}>{r.plp.toFixed(2)}%</td></tr>
      {/each}
      {#if rows.length===0}<tr><td colspan="7" style="color:#6b7280">No holdings — buy from Stock Details (demo).</td></tr>{/if}
    </tbody></table>
  </div>
  <div class="card" style="margin-top:12px">
    <div style="display:flex;gap:6px;align-items:center"><h3 style="margin:0">Transactions</h3><span style="margin-left:auto;display:flex;gap:6px">
      {#each ['All','Buy','Sell'] as f}<button class="btn" style:background={filter===f?'#1f2937':''} onclick={()=>filter=f}>{f}</button>{/each}
    </span></div>
    <table><thead><tr><th>Date</th><th>Symbol</th><th>Action</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
    <tbody>
      {#each filteredTxs as t}<tr><td>{new Date(t.date).toLocaleString()}</td><td>{t.symbol}</td><td><span style="padding:2px 6px;border-radius:4px;background:{t.action==='BUY'?'#052e16':'#450a0a'};color:{t.action==='BUY'?'#22c55e':'#ef4444'}">{t.action}</span></td><td>{t.quantity}</td><td>${t.price.toFixed(2)}</td><td>${t.total.toFixed(2)}</td></tr>{/each}
      {#if filteredTxs.length===0}<tr><td colspan="6" style="color:#6b7280">No transactions.</td></tr>{/if}
    </tbody></table>
    <div style="font-size:11px;color:#6b7280;margin-top:6px">Paper-trading only — simulated activity, not real brokerage.</div>
  </div>
{/if}
<style>h3{margin:0 0 8px 0;font-size:14px}</style>
