
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { TRADING_PAIRS } from '../../lib/constants/tradingPairs';
import { cn } from '../../lib/utils';

interface AssetSelectorProps {
  selectedPair: string;
  onPairChange: (pair: string) => void;
}

export function AssetSelector({ selectedPair, onPairChange }: AssetSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedPairData = TRADING_PAIRS.find(pair => pair.symbol === selectedPair);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-xl",
          "hover:bg-gray-100 transition-colors min-w-[160px]",
          "text-lg font-semibold"
        )}
      >
        <span>{selectedPairData?.symbol}</span>
        <ChevronDown className={cn(
          "w-5 h-5 text-gray-500 transition-transform ml-auto",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-[200px] bg-white rounded-xl shadow-lg border py-2 animate-in fade-in slide-in-from-top-2">
          {TRADING_PAIRS.map((pair) => (
            <button
              key={pair.symbol}
              onClick={() => {
                onPairChange(pair.symbol);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50",
                "transition-colors",
                selectedPair === pair.symbol && "bg-gray-50 font-semibold"
              )}
            >
              <div className="flex flex-col">
                <span>{pair.symbol}</span>
                <span className="text-xs text-gray-500">
                  Max Leverage {pair.maxLeverage}x
                </span>
              </div>
              {selectedPair === pair.symbol && (
                <div className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
