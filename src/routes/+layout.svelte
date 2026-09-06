<script lang="ts">
import { onMount } from 'svelte';
import { connect, disconnect } from '$lib/services/sse';
import { connectionStatus, lastUpdate, updateCount, marketTime, stocks } from '$lib/stores/market.svelte';
import { page } from '$app/stores';
let {children}= $props();
let query=$state('');
let results=$state<any[]>([]);
let status=$state('DISCONNECTED');
let upd=$state(0);
let last=$state(Date.now());
let mtime=$state(new Date());
let qDeb:any;
let sidebarOpen=$state(false);
let searchInput: HTMLInputElement;
connectionStatus.subscribe(v=>status=v);
updateCount.subscribe(v=>upd=v);
lastUpdate.subscribe(v=>last=v);
marketTime.subscribe(v=>mtime=v);
let stockList=$state<Record<string,any>>({});
stocks.subscribe(v=>stockList=v);
function onSearch(v:string){
  clearTimeout(qDeb);
  qDeb=setTimeout(()=>{
    if(!v){results=[];return;}
    const q=v.toLowerCase();
    results=Object.values(stockList).filter((s:any)=>s.symbol.toLowerCase().includes(q)||s.name.toLowerCase().includes(q)||s.sector.toLowerCase().includes(q)).slice(0,6);
  },200);
}
$effect(()=>{ onSearch(query); });
onMount(()=>{
  connect();
  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput?.focus();
    }
  }
  window.addEventListener('keydown', handleKeydown);
  return ()=>{disconnect(); window.removeEventListener('keydown', handleKeydown);};
});
let nav=[
  ['/','Overview'],['/markets','Markets'],['/compare','Compare'],['/watchlist','Watchlist'],['/portfolio','Portfolio'],['/news','News'],['/alerts','Alerts'],['/settings','Settings']
];
</script>
<svelte:head><title>MarketPulse — Demo Trading Terminal</title></svelte:head>
<div class="app">
  <aside class="sidebar" class:open={sidebarOpen}>
    <div class="logo">◈ MarketPulse <span class="demo">DEMO</span></div>
    <nav>
      {#each nav as [href,label]}
        <a href={href} class:active={$page.url.pathname===href} onclick={()=>sidebarOpen=false}>{label}</a>
      {/each}
    </nav>
    <div class="disclaimer">Simulated prices for demo only. Not real financial data.</div>
  </aside>
  <div class="main">
    <header class="topbar">
      <button class="hamburger" aria-label="Menu" onclick={()=>sidebarOpen=!sidebarOpen}>☰</button>
      <div class="searchWrap">
        <input bind:this={searchInput} placeholder="Search symbol, name, sector… (Ctrl+K)" bind:value={query} aria-label="Search stocks"/>
        {#if results.length}
          <div class="searchResults">
            {#each results as r}
              <a href="/stocks/{r.symbol}" onclick={()=>{query='';results=[]}}><b>{r.symbol}</b> <span>{r.name}</span> <em>{r.sector}</em></a>
            {/each}
          </div>
        {/if}
      </div>
      <div class="status">
        <span class="dot" class:live={status==='CONNECTED'} class:recon={status==='RECONNECTING'}></span>
        <span class="conn">{status==='CONNECTED'?'Live':status==='RECONNECTING'?'Reconnecting…':status}</span>
        <span class="hide-m">{new Date(last).toLocaleTimeString()} • {upd.toLocaleString()} updates</span>
        <span class="hide-m">{mtime.toLocaleTimeString()} • Demo Market</span>
      </div>
    </header>
    <div class="content">
      {@render children()}
    </div>
    <footer class="foot">SSE: {status} • Last: {new Date(last).toLocaleTimeString()} • Data source: Demo Market • {mtime.toLocaleDateString()} {mtime.toLocaleTimeString()} • Latency ~120ms</footer>
  </div>
</div>
<style>
*{box-sizing:border-box}
:global(body){margin:0;background:#070a12;color:#e5e7eb;font-family:Inter,system-ui,sans-serif}
.app{display:flex;min-height:100vh}
.sidebar{width:210px;background:#0b0f1c;border-right:1px solid #1f2937;padding:16px;display:flex;flex-direction:column;gap:16px;position:sticky;top:0;height:100vh}
.logo{font-weight:800;letter-spacing:.04em;font-size:15px}
.demo{font-size:10px;background:#f59e0b;color:#111;padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle}
nav{display:flex;flex-direction:column;gap:4px}
nav a{color:#9ca3af;text-decoration:none;padding:8px 10px;border-radius:8px;font-size:13px;border:1px solid transparent}
nav a.active,nav a:hover{background:#111827;color:#fff;border-color:#1f2937}
.disclaimer{margin-top:auto;font-size:11px;color:#6b7280;line-height:1.4;border-top:1px solid #1f2937;padding-top:12px}
.main{flex:1;display:flex;flex-direction:column;min-width:0}
.topbar{display:flex;align-items:center;gap:12px;padding:10px 16px;background:#0b0f1c;border-bottom:1px solid #1f2937;position:sticky;top:0;z-index:10}
.searchWrap{position:relative;flex:1;max-width:420px}
.searchWrap input{width:100%;background:#111827;border:1px solid #1f2937;color:#e5e7eb;padding:8px 12px;border-radius:8px;outline:none}
.searchWrap input:focus{border-color:#22c55e;box-shadow:0 0 0 2px rgba(34,197,94,.2)}
.searchResults{position:absolute;top:40px;left:0;right:0;background:#111827;border:1px solid #1f2937;border-radius:8px;overflow:hidden;z-index:20}
.searchResults a{display:flex;gap:8px;align-items:center;padding:8px 10px;color:#e5e7eb;text-decoration:none;font-size:13px}
.searchResults a:hover{background:#1f2937}
.searchResults span{color:#9ca3af}
.searchResults em{margin-left:auto;color:#6b7280;font-style:normal;font-size:11px}
.status{margin-left:auto;display:flex;align-items:center;gap:8px;font-size:12px;color:#9ca3af;white-space:nowrap}
.dot{width:8px;height:8px;border-radius:50%;background:#6b7280}
.dot.live{background:#22c55e;box-shadow:0 0 8px #22c55e}
.dot.recon{background:#f59e0b}
.content{padding:16px;flex:1}
.foot{padding:8px 16px;border-top:1px solid #1f2937;background:#0b0f1c;color:#6b7280;font-size:11px}
.hamburger{display:none;background:transparent;color:#e5e7eb;border:1px solid #1f2937;border-radius:8px;padding:6px 10px}
@media(max-width:900px){
  .sidebar{position:fixed;left:-100%;z-index:30;transition:.2s}
  .sidebar.open{left:0}
  .hamburger{display:block}
  .hide-m{display:none}
}
:global(.card){background:#0f1424;border:1px solid #1f2937;border-radius:12px;padding:14px}
:global(.grid6){display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
:global(.grid3){display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
:global(.grid2){display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media(max-width:1200px){:global(.grid6){grid-template-columns:repeat(3,1fr)}}
@media(max-width:700px){:global(.grid6),:global(.grid3),:global(.grid2){grid-template-columns:1fr}}
:global(table){width:100%;border-collapse:collapse;font-size:13px}
:global(th){text-align:left;color:#9ca3af;font-weight:600;padding:8px;border-bottom:1px solid #1f2937}
:global(td){padding:8px;border-bottom:1px solid #111827}
:global(.up){color:#22c55e}
:global(.down){color:#ef4444}
:global(.flash-up){animation:flashUp .6s}
:global(.flash-down){animation:flashDown .6s}
@keyframes flashUp{0%{background:rgba(34,197,94,.35)}100%{background:transparent}}
@keyframes flashDown{0%{background:rgba(239,68,68,.35)}100%{background:transparent}}
:global(.btn){background:#1f2937;color:#e5e7eb;border:1px solid #374151;padding:7px 12px;border-radius:8px;cursor:pointer;font-size:13px;transition:all .15s}
:global(.btn:hover){background:#374151}
:global(.btn.primary){background:#22c55e;color:#052e16;border-color:#16a34a}
:global(.btn.primary:hover){background:#16a34a}
:global(.btn.danger){background:#ef4444;color:#fff}
:global(.btn.danger:hover){background:#dc2626}
:global(input,select){background:#111827;border:1px solid #1f2937;color:#e5e7eb;padding:7px 10px;border-radius:8px;transition:border-color .15s}
:global(input:focus,select:focus){border-color:#22c55e;outline:none}
</style>
