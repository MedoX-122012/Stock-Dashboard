import type { Stock, MarketIndex, NewsArticle } from '$lib/types';
export const SECTORS=['Technology','Healthcare','Financials','Energy','Consumer','Industrials','Utilities','Real Estate'];
function spark(base:number,len=20):number[]{let a=[base];for(let i=1;i<len;i++)a.push(a[i-1]+(Math.random()-.5)*(base*.01));return a;}
export const STOCKS:Stock[]=[
{symbol:'AAPL',name:'Apple Inc.',sector:'Technology',price:187.42,previousClose:186.18,open:186.5,high:188.1,low:185.9,volume:58342100,marketCap:2.9e12,peRatio:29.1,dividendYield:.52,id:'AAPL',change:1.24,changePercent:.67,sparkline:spark(187)},
{symbol:'MSFT',name:'Microsoft Corp.',sector:'Technology',price:412.35,previousClose:410.2,open:411,high:414,low:410.5,volume:24231200,marketCap:3.06e12,peRatio:36.2,dividendYield:.72,id:'MSFT',change:2.15,changePercent:.52,sparkline:spark(412)},
{symbol:'NVDA',name:'NVIDIA Corp.',sector:'Technology',price:875.28,previousClose:860.5,open:862,high:880,low:858,volume:43120000,marketCap:2.15e12,peRatio:65.4,dividendYield:.04,id:'NVDA',change:14.78,changePercent:1.72,sparkline:spark(875)},
{symbol:'AMZN',name:'Amazon.com Inc.',sector:'Consumer',price:178.15,previousClose:177.23,open:177.8,high:179.2,low:176.9,volume:31234000,marketCap:1.85e12,peRatio:52.1,dividendYield:0,id:'AMZN',change:.92,changePercent:.52,sparkline:spark(178)},
{symbol:'GOOGL',name:'Alphabet Inc.',sector:'Technology',price:165.23,previousClose:164.1,open:164.5,high:166,low:163.8,volume:18234000,marketCap:2.04e12,peRatio:24.8,dividendYield:0,id:'GOOGL',change:1.13,changePercent:.69,sparkline:spark(165)},
{symbol:'META',name:'Meta Platforms',sector:'Technology',price:485.58,previousClose:480.22,open:481,high:487,low:479,volume:15234000,marketCap:1.24e12,peRatio:23.4,dividendYield:.42,id:'META',change:5.36,changePercent:1.12,sparkline:spark(485)},
{symbol:'TSLA',name:'Tesla Inc.',sector:'Consumer',price:248.5,previousClose:252.1,open:251,high:252.5,low:247,volume:89234000,marketCap:789e9,peRatio:68.2,dividendYield:0,id:'TSLA',change:-3.6,changePercent:-1.43,sparkline:spark(248)},
{symbol:'NFLX',name:'Netflix Inc.',sector:'Consumer',price:610.34,previousClose:605.2,open:606,high:612,low:604,volume:4321000,marketCap:265e9,peRatio:42.1,dividendYield:0,id:'NFLX',change:5.14,changePercent:.85,sparkline:spark(610)},
{symbol:'AMD',name:'Advanced Micro Devices',sector:'Technology',price:164.21,previousClose:162.8,open:163,high:165.2,low:162.5,volume:52340000,marketCap:265e9,peRatio:245,dividendYield:0,id:'AMD',change:1.41,changePercent:.87,sparkline:spark(164)},
{symbol:'INTC',name:'Intel Corp.',sector:'Technology',price:32.15,previousClose:32.42,open:32.4,high:32.6,low:31.9,volume:34234000,marketCap:136e9,peRatio:28,dividendYield:1.55,id:'INTC',change:-.27,changePercent:-.83,sparkline:spark(32)},
{symbol:'JPM',name:'JPMorgan Chase',sector:'Financials',price:198.42,previousClose:197.1,open:197.5,high:199,low:196.8,volume:10234000,marketCap:570e9,peRatio:11.2,dividendYield:2.45,id:'JPM',change:1.32,changePercent:.67,sparkline:spark(198)},
{symbol:'V',name:'Visa Inc.',sector:'Financials',price:275.18,previousClose:274.5,open:274.8,high:276,low:273.9,volume:6234000,marketCap:550e9,peRatio:32.1,dividendYield:.82,id:'V',change:.68,changePercent:.25,sparkline:spark(275)},
{symbol:'MA',name:'Mastercard Inc.',sector:'Financials',price:485.12,previousClose:483.9,open:484,high:486.5,low:483,volume:2340000,marketCap:450e9,peRatio:35.2,dividendYield:.58,id:'MA',change:1.22,changePercent:.25,sparkline:spark(485)},
{symbol:'KO',name:'Coca-Cola Co.',sector:'Consumer',price:62.18,previousClose:62.05,open:62.1,high:62.4,low:61.9,volume:12340000,marketCap:268e9,peRatio:24.5,dividendYield:3.02,id:'KO',change:.13,changePercent:.21,sparkline:spark(62)},
{symbol:'PEP',name:'PepsiCo Inc.',sector:'Consumer',price:172.44,previousClose:171.9,open:172,high:173,low:171.5,volume:4234000,marketCap:237e9,peRatio:26.1,dividendYield:2.93,id:'PEP',change:.54,changePercent:.31,sparkline:spark(172)},
{symbol:'PFE',name:'Pfizer Inc.',sector:'Healthcare',price:26.82,previousClose:27.05,open:27,high:27.1,low:26.7,volume:28340000,marketCap:152e9,peRatio:85,dividendYield:6.1,id:'PFE',change:-.23,changePercent:-.85,sparkline:spark(26)},
{symbol:'XOM',name:'Exxon Mobil',sector:'Energy',price:118.42,previousClose:117.8,open:118,high:118.9,low:117.5,volume:11234000,marketCap:470e9,peRatio:8.5,dividendYield:3.22,id:'XOM',change:.62,changePercent:.53,sparkline:spark(118)},
{symbol:'NEE',name:'NextEra Energy',sector:'Utilities',price:68.12,previousClose:67.9,open:68,high:68.4,low:67.6,volume:8234000,marketCap:140e9,peRatio:20.1,dividendYield:3.1,id:'NEE',change:.22,changePercent:.32,sparkline:spark(68)},
{symbol:'PLD',name:'Prologis Inc.',sector:'Real Estate',price:132.18,previousClose:131.5,open:131.7,high:132.8,low:131.2,volume:2340000,marketCap:122e9,peRatio:28.4,dividendYield:2.8,id:'PLD',change:.68,changePercent:.52,sparkline:spark(132)},
{symbol:'CAT',name:'Caterpillar Inc.',sector:'Industrials',price:352.14,previousClose:349.8,open:350,high:354,low:349,volume:2340000,marketCap:175e9,peRatio:15.2,dividendYield:1.65,id:'CAT',change:2.34,changePercent:.67,sparkline:spark(352)},
];
export const INDICES:MarketIndex[]=[
{id:'spx',name:'S&P 500',symbol:'SPX',value:5246.68,change:12.42,changePercent:.24,sparkline:spark(5246,30)},
{id:'ndx',name:'NASDAQ',symbol:'IXIC',value:16451.84,change:45.2,changePercent:.28,sparkline:spark(16451,30)},
{id:'dji',name:'Dow Jones',symbol:'DJI',value:38765.12,change:-22.1,changePercent:-.06,sparkline:spark(38765,30)},
{id:'rut',name:'Russell 2000',symbol:'RUT',value:2012.45,change:8.3,changePercent:.41,sparkline:spark(2012,30)},
{id:'btc',name:'Bitcoin',symbol:'BTC-USD',value:67234.12,change:1234,changePercent:1.87,sparkline:spark(67234,30)},
{id:'gold',name:'Gold',symbol:'GC=F',value:2345.6,change:-5.2,changePercent:-.22,sparkline:spark(2345,30)},
];
export const NEWS:NewsArticle[]=[
{id:'1',headline:'Fed Signals Potential Rate Cut as Inflation Cools',source:'MarketPulse Wire',timestamp:Date.now()-3600000,category:'Economy',relatedSymbol:'SPX',summary:'Federal Reserve officials hinted at dovish stance after latest CPI data showed inflation easing to 3.2% year-over-year.'},
{id:'2',headline:'NVIDIA Unveils Next-Gen AI Accelerator, Shares Jump in Demo Session',source:'Tech Daily',timestamp:Date.now()-7200000,category:'Technology',relatedSymbol:'NVDA',summary:'New Blackwell successor promises 2x performance uplift, analyst price targets revised upward in simulated coverage.'},
{id:'3',headline:'Apple Services Revenue Hits Record in Simulated Quarter',source:'Equity Research',timestamp:Date.now()-10800000,category:'Earnings',relatedSymbol:'AAPL',summary:'Demo earnings show services segment driving margin expansion, iPhone sales steady amid upgrade cycle.'},
{id:'4',headline:'Energy Stocks Rally as Oil Holds Above $80',source:'Commodity Desk',timestamp:Date.now()-15000000,category:'Energy',relatedSymbol:'XOM',summary:'Simulated crude demand outlook improves ahead of OPEC meeting, energy sector leads demo gainers.'},
{id:'5',headline:'Tesla Delivery Numbers Beat Demo Expectations',source:'Auto Insider',timestamp:Date.now()-20000000,category:'Consumer',relatedSymbol:'TSLA',summary:'Simulated Q1 deliveries exceed consensus by 4%, focus shifts to margin trajectory.'},
{id:'6',headline:'JPMorgan CEO Warns on Commercial Real Estate Exposure',source:'Financial Times Demo',timestamp:Date.now()-25000000,category:'Financials',relatedSymbol:'JPM',summary:'Demo commentary highlights prudent risk management while maintaining buyback program.'},
];
