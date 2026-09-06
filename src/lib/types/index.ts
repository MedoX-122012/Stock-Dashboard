export type ConnectionStatus='CONNECTED'|'CONNECTING'|'RECONNECTING'|'DISCONNECTED'|'ERROR';
export interface Stock{
  id:string;symbol:string;name:string;sector:string;price:number;previousClose:number;open:number;high:number;low:number;volume:number;marketCap:number;peRatio:number;dividendYield:number;change:number;changePercent:number;sparkline:number[];
}
export interface StockUpdate{symbol:string;price:number;change:number;changePercent:number;volume:number;timestamp:number;high:number;low:number;}
export interface MarketIndex{id:string;name:string;symbol:string;value:number;change:number;changePercent:number;sparkline:number[]}
export interface PortfolioPosition{symbol:string;shares:number;avgPrice:number}
export interface Transaction{id:string;date:number;symbol:string;action:'BUY'|'SELL';quantity:number;price:number;total:number}
export interface PriceAlert{id:string;symbol:string;type:'above'|'below';target:number;triggered:boolean;createdAt:number}
export interface Watchlist{id:string;name:string;symbols:string[]}
export interface NewsArticle{id:string;headline:string;source:string;timestamp:number;category:string;relatedSymbol?:string;summary:string}
export type TimeRange='1D'|'1W'|'1M'|'3M'|'6M'|'1Y'|'5Y';
export type ChartType='line'|'area'|'candlestick';
