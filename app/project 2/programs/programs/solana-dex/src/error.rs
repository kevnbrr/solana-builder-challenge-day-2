use anchor_lang::prelude::*;

#[error_code]
pub enum DexError {
    #[msg("Pool is paused")]
    PoolPaused,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
    #[msg("Invalid fee rate")]
    InvalidFeeRate,
    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,
    #[msg("Invalid token account")]
    InvalidTokenAccount,
    #[msg("Calculation overflow")]
    CalculationOverflow,
}