<script lang="ts">
let {data,up}:{data:number[],up:boolean}= $props();
let pts=$derived(()=>{
 const w=80,h=28;
 if(!data.length) return '';
 const min=Math.min(...data),max=Math.max(...data),rng=max-min||1;
 return data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/rng)*h}`).join(' ');
});
</script>
<svg width="80" height="28" viewBox="0 0 80 28" class:up class:down={!up}>
  <polyline fill="none" stroke={up?'#22c55e':'#ef4444'} stroke-width="1.5" points={pts()} />
</svg>
<style>svg.up{filter:drop-shadow(0 0 2px #22c55e66)}svg.down{filter:drop-shadow(0 0 2px #ef444466)}</style>
