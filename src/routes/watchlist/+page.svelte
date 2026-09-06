<script lang="ts">
import { onMount } from 'svelte';
import { watchlists, addToWatchlist, removeFromWatchlist, createWatchlist, deleteWatchlist, initWatchlists } from '$lib/stores/watchlist.svelte';
import { stocks, flashMap } from '$lib/stores/market.svelte';
import Sparkline from '$lib/components/Sparkline.svelte';
let { data } = $props();
let wls=$state<any[]>([]);
let smap=$state<Record<string,any>>({});
let flash=$state<Record<string,any>>({});
let active=$state('default');
let newName=$state('');
let addSym=$state('');
watchlists.subscribe(v=>{wls=v; if(!v.find(x=>x.id===active)&&v[0]) active=v[0].id});
stocks.subscribe(v=>smap=v);
flashMap.subscribe(v=>flash=v);
onMount(()=>{
  if(data.user && data.watchlists) initWatchlists(data.watchlists, data.user.id);
});
let cur=$derived(wls.find(w=>w.id===active));
let searchList=$derived(Object.values(smap).slice(0,8));
</script>
{#if !data.user}
  <div class="card" style="text-align:center;padding:40px">
    <h3 style="margin:0 0 8px">Sign in to use watchlists</h3>
    <p style="color:#9ca3af;margin:0 0 16px">Track your favorite stocks across sessions</p>
    <a href="/login" class="btn primary" style="text-decoration:none;margin-right:8px">Sign In</a>
    <a href="/signup" class="btn primary" style="text-decoration:none">Sign Up Free</a>
  </div>
{:else}
  <div class="card" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <b>Watchlists</b>
    {#each wls as w}<button class="btn" style:background={w.id===active?'#1f2937':''} onclick={()=>active=w.id}>{w.name}</button>{/each}
    <input placeholder="New list name" bind:value={newName}/>
    <button class="btn primary" onclick={()=>{if(newName) createWatchlist(newName); newName='';}}>Create</button>
    {#if cur && cur.id!=='default'}<button class="btn danger" onclick={()=>deleteWatchlist(cur.id)}>Delete</button>{/if}
  </div>
  {#if cur}
  <div class="card" style="margin-top:12px">
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>{cur.name}</b>
      <select bind:value={addSym}><option value="">Add symbol…</option>{#each searchList as s}<option value={s.symbol}>{s.symbol} — {s.name}</option>{/each}</select>
      <button class="btn" onclick={()=>{if(addSym) addToWatchlist(cur.id,addSym)}}>Add</button>
    </div>
    <table style="margin-top:10px">
      <thead><tr><th>Symbol</th><th>Company</th><th>Price</th><th>Change</th><th>%</th><th>Volume</th><th>Market Cap</th><th>Sparkline</th><th></th></tr></thead>
      <tbody>
        {#each cur.symbols as sym}
          {@const s=smap[sym]}
          {#if s}
            <tr class:flash-up={flash[sym]==='up'} class:flash-down={flash[sym]==='down'}>
              <td><a href="/stocks/{sym}" style="color:#60a5fa;text-decoration:none;font-weight:700">{sym}</a></td>
              <td>{s.name}</td><td>${s.price.toFixed(2)}</td><td class={s.change>=0?'up':'down'}>{s.change.toFixed(2)}</td><td class={s.changePercent>=0?'up':'down'}>{s.changePercent.toFixed(2)}%</td><td>{(s.volume/1e6).toFixed(1)}M</td><td>${(s.marketCap/1e9).toFixed(1)}B</td><td><Sparkline data={s.sparkline} up={s.changePercent>=0}/></td>
              <td><button class="btn" onclick={()=>removeFromWatchlist(cur.id,sym)}>Remove</button></td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
    {#if cur.symbols.length===0}<div style="color:#6b7280;padding:12px">No symbols — add from dropdown.</div>{/if}
  </div>
  {/if}
{/if}
