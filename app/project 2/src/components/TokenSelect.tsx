import React from 'react';
import { Token, tokens } from '../lib/tokens';

interface TokenSelectProps {
  value: Token;
  onChange: (token: Token) => void;
}

export function TokenSelect({ value, onChange }: TokenSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        <img
          src={value.logoURI}
          alt={value.symbol}
          className="w-5 h-5 rounded-full"
        />
        <span className="font-medium">{value.symbol}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onChange(token);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
            >
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-5 h-5 rounded-full"
              />
              <span>{token.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}