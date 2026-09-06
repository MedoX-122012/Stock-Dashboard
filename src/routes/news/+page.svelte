<script lang="ts">
import { NEWS } from '$lib/data/stocks';
</script>
<div class="card"><h3>Market News — Demo Content</h3><div style="font-size:11px;color:#6b7280">Fictional articles for demonstration — not copyrighted real news.</div></div>
<div style="display:grid;gap:10px;margin-top:12px">
{#each NEWS as n}
  <div class="card">
    <div style="display:flex;gap:8px;align-items:center"><span style="background:#1f2937;border:1px solid #374151;padding:2px 6px;border-radius:6px;font-size:11px">{n.category}</span><span style="color:#9ca3af;font-size:12px">{n.source} • {new Date(n.timestamp).toLocaleString()}</span>{#if n.relatedSymbol}<a href="/stocks/{n.relatedSymbol}" style="margin-left:auto;color:#60a5fa;text-decoration:none;font-size:12px">{n.relatedSymbol}</a>{/if}</div>
    <div style="font-weight:700;margin-top:6px">{n.headline}</div>
    <div style="color:#9ca3af;font-size:13px;margin-top:4px">{n.summary}</div>
  </div>
{/each}
</div>
<style>h3{margin:0;font-size:14px}</style>
