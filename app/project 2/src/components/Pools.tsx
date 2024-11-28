import React from 'react';
import { tokens } from '../lib/tokens';
import { formatNumber, formatCurrency } from '../lib/utils';

interface Pool {
  token0: string;
  token1: string;
  tvl: number;
  apr: number;
}

const pools: Pool[] = [
  { token0: "SOL", token1: "USDC", tvl: 1500000, apr: 12.5 },
  { token0: "RAY", token1: "USDC", tvl: 800000, apr: 15.2 },
  { token0: "SRM", token1: "USDC", tvl: 600000, apr: 18.7 },
  { token0: "BONK", token1: "SOL", tvl: 250000, apr: 25.4 },
];

export function Pools() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50 font-medium">
          <div>Pool</div>
          <div>TVL</div>
          <div>APR</div>
          <div>My Liquidity</div>
          <div></div>
        </div>
        {pools.map((pool) => (
          <div key={`${pool.token0}-${pool.token1}`} className="grid grid-cols-5 gap-4 p-4 border-b hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img
                  src={tokens.find(t => t.symbol === pool.token0)?.logoURI}
                  alt={pool.token0}
                  className="w-6 h-6 rounded-full ring-2 ring-white"
                />
                <img
                  src={tokens.find(t => t.symbol === pool.token1)?.logoURI}
                  alt={pool.token1}
                  className="w-6 h-6 rounded-full ring-2 ring-white"
                />
              </div>
              <span>{pool.token0}/{pool.token1}</span>
            </div>
            <div>{formatCurrency(pool.tvl)}</div>
            <div>{formatNumber(pool.apr)}%</div>
            <div>-</div>
            <div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Liquidity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}