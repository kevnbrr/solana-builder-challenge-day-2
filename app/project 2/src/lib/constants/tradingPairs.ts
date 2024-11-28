import { TradingPair } from '../types/trading';

export const TRADING_PAIRS: TradingPair[] = [
  {
    symbol: 'SOL-PERP',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    minLeverage: 1,
    maxLeverage: 500,
    tickSize: 0.01,
    minQuantity: 0.1,
  },
  {
    symbol: 'BTC-PERP',
    baseAsset: 'BTC',
    quoteAsset: 'USD',
    minLeverage: 1,
    maxLeverage: 500,
    tickSize: 0.5,
    minQuantity: 0.001,
  },
  {
    symbol: 'ETH-PERP',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    minLeverage: 1,
    maxLeverage: 500,
    tickSize: 0.1,
    minQuantity: 0.01,
  },
];