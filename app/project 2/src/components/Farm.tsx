import React from 'react';
import { tokens } from '../lib/tokens';
import { formatNumber, formatCurrency } from '../lib/utils';

interface Farm {
  name: string;
  token0: string;
  token1: string;
  tvl: number;
  apr: number;
  rewards: string[];
}

const farms: Farm[] = [
  {
    name: "SOL-USDC LP",
    token0: "SOL",
    token1: "USDC",
    tvl: 2500000,
    apr: 45.2,
    rewards: ["RAY", "SRM"]
  },
  {
    name: "RAY-USDC LP",
    token0: "RAY",
    token1: "USDC",
    tvl: 1200000,
    apr: 62.8,
    rewards: ["RAY"]
  },
  {
    name: "BONK-SOL LP",
    token0: "BONK",
    token1: "SOL",
    tvl: 800000,
    apr: 85.4,
    rewards: ["BONK", "RAY"]
  }
];

export function Farm() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-gray-50 font-medium">
          <div>Farm</div>
          <div>TVL</div>
          <div>APR</div>
          <div>Rewards</div>
          <div>Staked</div>
          <div></div>
        </div>
        {farms.map((farm) => (
          <div key={farm.name} className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img
                  src={tokens.find(t => t.symbol === farm.token0)?.logoURI}
                  alt={farm.token0}
                  className="w-6 h-6 rounded-full ring-2 ring-white"
                />
                <img
                  src={tokens.find(t => t.symbol === farm.token1)?.logoURI}
                  alt={farm.token1}
                  className="w-6 h-6 rounded-full ring-2 ring-white"
                />
              </div>
              <span>{farm.name}</span>
            </div>
            <div>{formatCurrency(farm.tvl)}</div>
            <div>{formatNumber(farm.apr)}%</div>
            <div className="flex items-center gap-1">
              {farm.rewards.map((reward) => (
                <img
                  key={reward}
                  src={tokens.find(t => t.symbol === reward)?.logoURI}
                  alt={reward}
                  className="w-5 h-5 rounded-full"
                  title={`Earn ${reward}`}
                />
              ))}
            </div>
            <div>-</div>
            <div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Stake
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}