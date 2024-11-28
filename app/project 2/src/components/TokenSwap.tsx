import React from 'react';
import { ArrowDownUp, Settings } from 'lucide-react';
import { formatNumber } from '../lib/utils';
import { Token, tokens } from '../lib/tokens';
import { TokenSelect } from './TokenSelect';

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  balance: number;
  token: Token;
  onTokenChange: (token: Token) => void;
}

function TokenInput({ label, value, onChange, balance, token, onTokenChange }: TokenInputProps) {
  return (
    <div className="bg-white rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>{label}</span>
        <span>Balance: {formatNumber(balance)} {token.symbol}</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-2xl outline-none"
          placeholder="0.0"
        />
        <TokenSelect value={token} onChange={onTokenChange} />
      </div>
    </div>
  );
}

export function TokenSwap() {
  const [fromAmount, setFromAmount] = React.useState('');
  const [toAmount, setToAmount] = React.useState('');
  const [fromToken, setFromToken] = React.useState(tokens[0]);
  const [toToken, setToToken] = React.useState(tokens[1]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="w-full max-w-lg bg-gray-50 rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Swap</h2>
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <TokenInput
        label="From"
        value={fromAmount}
        onChange={setFromAmount}
        balance={100}
        token={fromToken}
        onTokenChange={setFromToken}
      />

      <div className="flex justify-center">
        <button
          onClick={handleSwapTokens}
          className="p-2 rounded-lg hover:bg-gray-200"
        >
          <ArrowDownUp className="w-5 h-5" />
        </button>
      </div>

      <TokenInput
        label="To"
        value={toAmount}
        onChange={setToAmount}
        balance={1000}
        token={toToken}
        onTokenChange={setToToken}
      />

      <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Swap
      </button>

      <div className="text-sm text-gray-500 space-y-2">
        <div className="flex justify-between">
          <span>Price Impact</span>
          <span>{'< 0.01%'}</span>
        </div>
        <div className="flex justify-between">
          <span>Minimum Received</span>
          <span>0 {toToken.symbol}</span>
        </div>
      </div>
    </div>
  );
}