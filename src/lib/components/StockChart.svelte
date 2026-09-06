<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
let {prices, paused=false}:{prices:number[],paused?:boolean}= $props();
let canvas:HTMLCanvasElement;
let chart:Chart|null=null;
onMount(()=>{
  const labels=prices.map((_,i)=>i.toString());
  chart=new Chart(canvas,{
    type:'line',
    data:{labels, datasets:[{data:prices, borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,.12)', fill:true, tension:.4, pointRadius:0, borderWidth:1.6}]},
    options:{responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      scales:{x:{display:false,grid:{display:false}},y:{display:true,grid:{color:'#1f2937'},ticks:{color:'#9ca3af',maxTicksLimit:6}}},
      plugins:{legend:{display:false},tooltip:{enabled:true,backgroundColor:'#0f172a',titleColor:'#e5e7eb',bodyColor:'#e5e7eb'}}}
  });
});
$effect(()=>{
  if(chart && !paused){
    chart.data.datasets[0].data=prices as any;
    chart.data.labels=prices.map((_,i)=>i.toString());
    (chart.data.datasets[0] as any).borderColor=prices[prices.length-1]>=prices[0]?'#22c55e':'#ef4444';
    (chart.data.datasets[0] as any).backgroundColor=prices[prices.length-1]>=prices[0]?'rgba(34,197,94,.12)':'rgba(239,68,68,.12)';
    chart.update('none');
  }
});
onDestroy(()=>chart?.destroy());
</script>
<div style="height:340px"><canvas bind:this={canvas}></canvas></div>
