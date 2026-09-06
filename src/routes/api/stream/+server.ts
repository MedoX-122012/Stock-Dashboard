import { STOCKS } from '$lib/data/stocks';
let prices: Record<string, number> = Object.fromEntries(STOCKS.map(s => [s.symbol, s.price]));

export async function GET() {
  let interval: ReturnType<typeof setInterval>;
  let hb: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      const send = (data: any) => {
        controller.enqueue(enc.encode(`event: stock-update\ndata: ${JSON.stringify(data)}\n\n`));
      };
      interval = setInterval(() => {
        const picks = [...STOCKS].sort(() => Math.random() - 0.5).slice(0, 4);
        for (const s of picks) {
          const prev = prices[s.symbol];
          const change = (Math.random() - 0.5) * prev * 0.004;
          let np = +(prev + change).toFixed(2);
          if (np < 1) np = 1;
          prices[s.symbol] = np;
          const prevClose = s.previousClose;
          send({
            symbol: s.symbol,
            price: np,
            change: +(np - prevClose).toFixed(2),
            changePercent: +(((np - prevClose) / prevClose) * 100).toFixed(2),
            volume: s.volume + Math.floor((Math.random() - 0.5) * 50000),
            timestamp: Date.now(),
            high: Math.max(s.high, np),
            low: Math.min(s.low, np)
          });
        }
      }, 700);
      hb = setInterval(() => controller.enqueue(enc.encode(': heartbeat\n\n')), 15000);
    },
    cancel() {
      clearInterval(interval);
      clearInterval(hb);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
