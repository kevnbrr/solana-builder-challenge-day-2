use anchor_lang::prelude::*;

#[event]
pub struct LiquidityDeposited {
    pub user: Pubkey,
    pub amount_a: u64,
    pub amount_b: u64,
    pub timestamp: i64,
}

#[event]
pub struct LiquidityWithdrawn {
    pub user: Pubkey,
    pub amount_a: u64,
    pub amount_b: u64,
    pub timestamp: i64,
}

#[event]
pub struct SwapExecuted {
    pub user: Pubkey,
    pub amount_in: u64,
    pub amount_out: u64,
    pub fee: u64,
    pub timestamp: i64,
}

#[event]
pub struct FeeRateUpdated {
    pub old_fee_rate: u64,
    pub new_fee_rate: u64,
    pub timestamp: i64,
}

#[event]
pub struct PoolPaused {
    pub timestamp: i64,
}

#[event]
pub struct PoolUnpaused {
    pub timestamp: i64,
}