use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Pool {
    pub authority: Pubkey,
    pub token_a_mint: Pubkey,
    pub token_b_mint: Pubkey,
    pub token_a_vault: Pubkey,
    pub token_b_vault: Pubkey,
    pub fee_rate: u64,
    pub total_liquidity: u64,
    pub paused: bool,
    pub bump: u8,
}

impl Pool {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // token_a_mint
        32 + // token_b_mint
        32 + // token_a_vault
        32 + // token_b_vault
        8 + // fee_rate
        8 + // total_liquidity
        1 + // paused
        1; // bump
}