use anchor_lang::prelude::*;

pub fn calculate_swap_amount(
    amount_in: u64,
    reserve_in: u64,
    reserve_out: u64,
    fee_rate: u64,
) -> Result<(u64, u64)> {
    // Calculate fee
    let fee = amount_in
        .checked_mul(fee_rate)
        .ok_or(ErrorCode::CalculationOverflow)?
        .checked_div(10000)
        .ok_or(ErrorCode::CalculationOverflow)?;

    let amount_in_with_fee = amount_in
        .checked_sub(fee)
        .ok_or(ErrorCode::CalculationOverflow)?;

    // Calculate amount out using constant product formula: x * y = k
    let numerator = amount_in_with_fee
        .checked_mul(reserve_out)
        .ok_or(ErrorCode::CalculationOverflow)?;
    
    let denominator = reserve_in
        .checked_add(amount_in_with_fee)
        .ok_or(ErrorCode::CalculationOverflow)?;
    
    let amount_out = numerator
        .checked_div(denominator)
        .ok_or(ErrorCode::CalculationOverflow)?;

    Ok((amount_out, fee))
}

pub fn calculate_liquidity_amounts(
    amount_a: u64,
    amount_b: u64,
    reserve_a: u64,
    reserve_b: u64,
    total_supply: u64,
) -> Result<u64> {
    if total_supply == 0 {
        // Initial liquidity
        Ok(amount_a.min(amount_b))
    } else {
        // Subsequent liquidity
        let amount_a_shares = amount_a
            .checked_mul(total_supply)
            .ok_or(ErrorCode::CalculationOverflow)?
            .checked_div(reserve_a)
            .ok_or(ErrorCode::CalculationOverflow)?;

        let amount_b_shares = amount_b
            .checked_mul(total_supply)
            .ok_or(ErrorCode::CalculationOverflow)?
            .checked_div(reserve_b)
            .ok_or(ErrorCode::CalculationOverflow)?;

        Ok(amount_a_shares.min(amount_b_shares))
    }
}

pub fn validate_pool_accounts(
    pool: &Account<Pool>,
    token_a_vault: &Account<TokenAccount>,
    token_b_vault: &Account<TokenAccount>,
) -> Result<()> {
    require!(
        token_a_vault.key() == pool.token_a_vault
            && token_b_vault.key() == pool.token_b_vault,
        DexError::InvalidTokenAccount
    );

    require!(
        !pool.paused,
        DexError::PoolPaused
    );

    Ok(())
}