import React from 'react';
import { Calendar, Download, Layout, Settings } from 'lucide-react';
import { TimeFrame, ChartType, ChartLayout } from '../../lib/types/trading';
import { cn } from '../../lib/utils';

interface ChartControlsProps {
  timeFrame: TimeFrame;
  setTimeFrame: (tf: TimeFrame) => void;
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  layout: ChartLayout;
  setLayout: (layout: ChartLayout) => void;
}

const TIME_FRAMES: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'];

export function ChartControls({
  timeFrame,
  setTimeFrame,
  chartType,
  setChartType,
  layout,
  setLayout,
}: ChartControlsProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        {TIME_FRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeFrame(tf)}
            className={cn(
              'px-3 py-1 rounded text-sm font-medium',
              timeFrame === tf
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setChartType('candlestick')}
          className={cn(
            'p-2 rounded',
            chartType === 'candlestick' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <Calendar className="w-4 h-4" />
        </button>
        <button
          onClick={() => setChartType('line')}
          className={cn(
            'p-2 rounded',
            chartType === 'line' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <span className="w-4 h-4">📈</span>
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={cn(
            'p-2 rounded',
            chartType === 'bar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <span className="w-4 h-4">📊</span>
        </button>
        <div className="w-px h-6 bg-gray-200" />
        <button
          onClick={() => setLayout('single')}
          className={cn(
            'p-2 rounded',
            layout === 'single' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <Layout className="w-4 h-4" />
        </button>
        <button className="p-2 rounded text-gray-600 hover:bg-gray-100">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-2 rounded text-gray-600 hover:bg-gray-100">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}