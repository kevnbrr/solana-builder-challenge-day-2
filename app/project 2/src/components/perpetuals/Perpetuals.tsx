import React from 'react';
import { TradingChart } from './TradingChart';
import { ChartControls } from './ChartControls';
import { OrderBook } from './OrderBook';
import { TradeForm } from './TradeForm';
import { TradingMetrics } from './TradingMetrics';
import { AssetSelector } from './AssetSelector';
import { TimeFrame, ChartType, ChartLayout } from '../../lib/types/trading';
import { TRADING_PAIRS } from '../../lib/constants/tradingPairs';

export function Perpetuals() {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('1h');
  const [chartType, setChartType] = React.useState<ChartType>('candlestick');
  const [layout, setLayout] = React.useState<ChartLayout>('single');
  const [selectedPair, setSelectedPair] = React.useState(TRADING_PAIRS[0].symbol);
  const [positionType, setPositionType] = React.useState<'long' | 'short'>('long');

  const metrics = {
    leverage: 10,
    liquidationPrice: 48250.75,
    availableMargin: 25000,
    openInterest: 1250000,
    fundingRate: 0.01,
    nextFundingTime: new Date(),
  };

  const handlePairChange = (pair: string) => {
    setSelectedPair(pair);
  };

  return (
    <div className="space-y-4">
      <TradingMetrics metrics={metrics} />
      
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <AssetSelector
                selectedPair={selectedPair}
                onPairChange={handlePairChange}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setPositionType('long')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    positionType === 'long'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Long
                </button>
                <button
                  onClick={() => setPositionType('short')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    positionType === 'short'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Short
                </button>
              </div>
            </div>
            <ChartControls
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              chartType={chartType}
              setChartType={setChartType}
              layout={layout}
              setLayout={setLayout}
            />
          </div>
          <TradingChart
            theme="dark"
            timeFrame={timeFrame}
            chartType={chartType}
            selectedPair={selectedPair}
            positionType={positionType}
          />
        </div>
        
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <OrderBook />
          <TradeForm />
        </div>
      </div>
    </div>
  );
}