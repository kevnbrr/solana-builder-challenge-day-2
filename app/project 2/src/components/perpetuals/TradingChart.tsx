import React, { useEffect, useRef, useCallback } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { format } from 'date-fns';
import { TimeFrame, ChartType } from '../../lib/types/trading';
import { TRADING_PAIRS } from '../../lib/constants/tradingPairs';

interface TradingChartProps {
  theme?: 'light' | 'dark';
  timeFrame: TimeFrame;
  chartType: ChartType;
  selectedPair: string;
  positionType: 'long' | 'short';
}

interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export function TradingChart({ theme = 'dark', timeFrame, chartType, selectedPair, positionType }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<{
    chart: IChartApi | null;
    mainSeries: ISeriesApi<'candlestick'> | ISeriesApi<'line'> | ISeriesApi<'bar'> | null;
    volumeSeries: ISeriesApi<'histogram'> | null;
    resizeObserver: ResizeObserver | null;
  }>({
    chart: null,
    mainSeries: null,
    volumeSeries: null,
    resizeObserver: null,
  });

  // Define colors based on position type
  const upColor = positionType === 'long' ? '#26a69a' : '#ef5350';
  const downColor = positionType === 'long' ? '#ef5350' : '#26a69a';

  const generateChartData = useCallback((pair: string, tf: TimeFrame) => {
    const basePrice = pair.includes('BTC') ? 50000 : pair.includes('ETH') ? 3000 : 100;
    const volatility = basePrice * 0.02;
    const currentTime = new Date();
    const data: ChartData[] = [];
    const volumeData: { time: Time; value: number; color: string }[] = [];
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(currentTime.getTime() - i * getTimeFrameMilliseconds(tf));
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const high = open + Math.random() * (volatility / 2);
      const low = open - Math.random() * (volatility / 2);
      const close = (high + low) / 2 + (Math.random() - 0.5) * (volatility / 2);
      const volume = Math.random() * basePrice * 0.1;
      const isUp = close >= open;

      data.unshift({
        time: time.getTime() / 1000 as Time,
        open,
        high,
        low,
        close,
        volume,
      });

      volumeData.unshift({
        time: time.getTime() / 1000 as Time,
        value: volume,
        color: (positionType === 'long' ? isUp : !isUp) ? `${upColor}40` : `${downColor}40`,
      });
    }

    return { data, volumeData };
  }, [positionType, upColor, downColor]);

  const cleanupChart = useCallback(() => {
    if (chartInstanceRef.current.resizeObserver) {
      chartInstanceRef.current.resizeObserver.disconnect();
      chartInstanceRef.current.resizeObserver = null;
    }

    if (chartInstanceRef.current.chart) {
      chartInstanceRef.current.chart.remove();
      chartInstanceRef.current.chart = null;
      chartInstanceRef.current.mainSeries = null;
      chartInstanceRef.current.volumeSeries = null;
    }
  }, []);

  const createChartInstance = useCallback(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { color: theme === 'dark' ? '#1B1B1B' : '#FFFFFF' },
        textColor: theme === 'dark' ? '#FFFFFF' : '#191919',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: theme === 'dark' ? '#2B2B2B' : '#E6E6E6', style: 1 },
        horzLines: { color: theme === 'dark' ? '#2B2B2B' : '#E6E6E6', style: 1 },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: theme === 'dark' ? '#4B4B4B' : '#999999',
          style: 2,
          labelBackgroundColor: theme === 'dark' ? '#1B1B1B' : '#FFFFFF',
        },
        horzLine: {
          width: 1,
          color: theme === 'dark' ? '#4B4B4B' : '#999999',
          style: 2,
          labelBackgroundColor: theme === 'dark' ? '#1B1B1B' : '#FFFFFF',
        },
      },
      rightPriceScale: {
        borderColor: theme === 'dark' ? '#2B2B2B' : '#E6E6E6',
        borderVisible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.15,
        },
        entireTextOnly: true,
      },
      timeScale: {
        borderColor: theme === 'dark' ? '#2B2B2B' : '#E6E6E6',
        timeVisible: true,
        secondsVisible: timeFrame === '1m',
        borderVisible: true,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartInstanceRef.current.chart = chart;

    // Create main series based on chart type
    if (chartType === 'candlestick') {
      chartInstanceRef.current.mainSeries = chart.addCandlestickSeries({
        upColor,
        downColor,
        borderVisible: true,
        wickUpColor: upColor,
        wickDownColor: downColor,
        borderUpColor: upColor,
        borderDownColor: downColor,
        wickVisible: true,
        priceScaleId: 'right',
        priceFormat: {
          type: 'price',
          precision: 2,
          minMove: 0.01,
        },
      });
    } else if (chartType === 'line') {
      chartInstanceRef.current.mainSeries = chart.addLineSeries({
        color: positionType === 'long' ? '#2962FF' : '#FF2962',
        lineWidth: 3,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        lineType: 0,
        priceScaleId: 'right',
      });
    } else {
      chartInstanceRef.current.mainSeries = chart.addBarSeries({
        upColor,
        downColor,
        thinBars: false,
        priceScaleId: 'right',
      });
    }

    // Add volume series
    chartInstanceRef.current.volumeSeries = chart.addHistogramSeries({
      color: upColor,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
      overlay: true,
    });

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current && chartInstanceRef.current.chart) {
        chartInstanceRef.current.chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);
    chartInstanceRef.current.resizeObserver = resizeObserver;
  }, [theme, chartType, upColor, downColor, timeFrame, positionType]);

  const updateChartData = useCallback(() => {
    if (!chartInstanceRef.current.mainSeries || !chartInstanceRef.current.volumeSeries) return;

    const { data, volumeData } = generateChartData(selectedPair, timeFrame);
    
    chartInstanceRef.current.mainSeries.setData(data);
    chartInstanceRef.current.volumeSeries.setData(volumeData);

    const lastPrice = data[data.length - 1].close;
    chartInstanceRef.current.mainSeries.createPriceLine({
      price: lastPrice,
      color: positionType === 'long' ? '#2962FF' : '#FF2962',
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'Current Price',
    });

    chartInstanceRef.current.chart?.timeScale().fitContent();
  }, [selectedPair, timeFrame, positionType, generateChartData]);

  // Initialize chart
  useEffect(() => {
    cleanupChart();
    createChartInstance();
    updateChartData();

    return cleanupChart;
  }, [theme, chartType, timeFrame, cleanupChart, createChartInstance, updateChartData]);

  // Update data when selectedPair or positionType changes
  useEffect(() => {
    updateChartData();
  }, [selectedPair, positionType, updateChartData]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{selectedPair}</div>
          <div className={`px-2 py-1 rounded text-sm font-medium ${
            positionType === 'long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {positionType.toUpperCase()}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={positionType === 'long' ? 'text-green-500' : 'text-red-500'}>
            <div className="text-sm">24h Change</div>
            <div className="font-bold">+2.45%</div>
          </div>
          <div>
            <div className="text-sm">24h Volume</div>
            <div className="font-bold">$1.2M</div>
          </div>
          <div>
            <div className="text-sm">Funding Rate</div>
            <div className="font-bold">0.01%</div>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />
    </div>
  );
}

function getTimeFrameMilliseconds(timeFrame: TimeFrame): number {
  const map: Record<TimeFrame, number> = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
  };
  return map[timeFrame];
}