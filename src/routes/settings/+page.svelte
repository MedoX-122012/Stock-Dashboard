<script lang="ts">
let theme=$state(typeof localStorage!=='undefined'?localStorage.getItem('mp_theme')||'dark':'dark');
let ctype=$state(typeof localStorage!=='undefined'?localStorage.getItem('mp_ctype')||'area':'area');
let trange=$state(typeof localStorage!=='undefined'?localStorage.getItem('mp_trange')||'1D':'1D');
let saved=$state(false);
function save(){
  localStorage.setItem('mp_theme',theme);
  localStorage.setItem('mp_ctype',ctype);
  localStorage.setItem('mp_trange',trange);
  document.documentElement.dataset.theme=theme;
  saved=true;
  setTimeout(()=>saved=false,2000);
}
</script>
<div class="card" style="max-width:520px">
  <h3>Settings</h3>
  <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px">
    <label>Theme <select bind:value={theme}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select></label>
    <label>Default chart type <select bind:value={ctype}><option value="line">Line</option><option value="area">Area</option><option value="candlestick">Candlestick</option></select></label>
    <label>Default time range <select bind:value={trange}><option>1D</option><option>1W</option><option>1M</option><option>3M</option><option>6M</option><option>1Y</option><option>5Y</option></select></label>
    <button class="btn primary" onclick={save}>{saved?'✓ Saved!':'Save'}</button>
    <div style="font-size:11px;color:#6b7280">Persisted via LocalStorage • Demo only</div>
  </div>
</div>
<style>h3{margin:0;font-size:14px}label{display:flex;justify-content:space-between;align-items:center;gap:12px}</style>
