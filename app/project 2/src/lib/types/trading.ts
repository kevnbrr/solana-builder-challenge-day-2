export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M';
export type ChartType = 'candlestick' | 'line' | 'bar';
export type ChartLayout = 'single' | 'dual' | 'quad';

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  minLeverage: number;
  maxLeverage: number;
  tickSize: number;
  minQuantity: number;
}

export interface TradingMetrics {
  leverage: number;
  liquidationPrice: number;
  availableMargin: number;
  openInterest: number;
  fundingRate: number;
  nextFundingTime: Date;
}