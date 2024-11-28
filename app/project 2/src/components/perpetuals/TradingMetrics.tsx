import React from 'react';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { TradingMetrics as TradingMetricsType } from '../../lib/types/trading';

interface TradingMetricsProps {
  metrics: TradingMetricsType;
}

export function TradingMetrics({ metrics }: TradingMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <div className="text-sm text-gray-500">Leverage</div>
        <div className="font-medium">{metrics.leverage}x</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Liquidation Price</div>
        <div className="font-medium">{formatCurrency(metrics.liquidationPrice)}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Available Margin</div>
        <div className="font-medium">{formatCurrency(metrics.availableMargin)}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Open Interest</div>
        <div className="font-medium">{formatCurrency(metrics.openInterest)}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Funding Rate</div>
        <div className="font-medium">{formatNumber(metrics.fundingRate)}%</div>
      </div>
    </div>
  );
}