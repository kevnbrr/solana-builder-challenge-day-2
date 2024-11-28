use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};


declare_id!("DPR8dcK3EQy6L79QLtNVUXSBqLeWyzAG6de8EvYXNZn1");


#[program]
pub mod dex {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        pool_bump: u8,
        initial_fee_rate: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.token_a_mint = ctx.accounts.token_a_mint.key();
        pool.token_b_mint = ctx.accounts.token_b_mint.key();
        pool.token_a_vault = ctx.accounts.token_a_vault.key();
        pool.token_b_vault = ctx.accounts.token_b_vault.key();
        pool.fee_rate = initial_fee_rate;
        pool.bump = pool_bump;
        pool.paused = false;
        Ok(())
    }

    pub fn deposit_liquidity(
        ctx: Context<DepositLiquidity>,
        amount_a: u64,
        amount_b: u64,
    ) -> Result<()> {
        require!(!ctx.accounts.pool.paused, DexError::PoolPaused);
        require!(amount_a > 0 && amount_b > 0, DexError::InvalidAmount);

        // Transfer tokens to pool vaults
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_a.to_account_info(),
                    to: ctx.accounts.token_a_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount_a,
        )?;

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_b.to_account_info(),
                    to: ctx.accounts.token_b_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount_b,
        )?;

        // Update pool state and mint LP tokens
        let pool = &mut ctx.accounts.pool;
        pool.total_liquidity = pool.total_liquidity.checked_add(amount_a).unwrap();
        
        emit!(LiquidityDeposited {
            user: ctx.accounts.user.key(),
            amount_a,
            amount_b,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn swap(
        ctx: Context<Swap>,
        amount_in: u64,
        minimum_amount_out: u64,
    ) -> Result<()> {
        require!(!ctx.accounts.pool.paused, DexError::PoolPaused);
        require!(amount_in > 0, DexError::InvalidAmount);

        let pool = &ctx.accounts.pool;
        
        // Calculate swap amounts with price impact and fees
        let (amount_out, fee) = calculate_swap_amount(
            amount_in,
            ctx.accounts.token_a_vault.amount,
            ctx.accounts.token_b_vault.amount,
            pool.fee_rate,
        )?;

        require!(
            amount_out >= minimum_amount_out,
            DexError::SlippageExceeded
        );

        // Execute token transfers
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_in.to_account_info(),
                    to: ctx.accounts.token_a_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount_in,
        )?;

        let seeds = &[
            pool.to_account_info().key.as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.token_b_vault.to_account_info(),
                    to: ctx.accounts.user_token_out.to_account_info(),
                    authority: ctx.accounts.pool.to_account_info(),
                },
                signer,
            ),
            amount_out,
        )?;

        emit!(SwapExecuted {
            user: ctx.accounts.user.key(),
            amount_in,
            amount_out,
            fee,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn set_fee_rate(ctx: Context<SetFeeRate>, new_fee_rate: u64) -> Result<()> {
        require!(
            new_fee_rate <= 10000, // Max 10% fee
            DexError::InvalidFeeRate
        );
        
        let pool = &mut ctx.accounts.pool;
        pool.fee_rate = new_fee_rate;
        
        emit!(FeeRateUpdated {
            old_fee_rate: pool.fee_rate,
            new_fee_rate,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    pub fn pause_pool(ctx: Context<PausePool>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.paused = true;
        
        emit!(PoolPaused {
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    pub fn unpause_pool(ctx: Context<PausePool>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.paused = false;
        
        emit!(PoolUnpaused {
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(pool_bump: u8)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = Pool::LEN,
        seeds = [
            b"pool".as_ref(),
            token_a_mint.key().as_ref(),
            token_b_mint.key().as_ref(),
        ],
        bump,
    )]
    pub pool: Account<'info, Pool>,
    
    pub token_a_mint: Account<'info, token::Mint>,
    pub token_b_mint: Account<'info, token::Mint>,
    
    #[account(
        init,
        payer = authority,
        token::mint = token_a_mint,
        token::authority = pool,
    )]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        token::mint = token_b_mint,
        token::authority = pool,
    )]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DepositLiquidity<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        constraint = !pool.paused,
    )]
    pub pool: Account<'info, Pool>,
    
    #[account(
        mut,
        constraint = user_token_a.mint == pool.token_a_mint,
        constraint = user_token_a.owner == user.key(),
    )]
    pub user_token_a: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = user_token_b.mint == pool.token_b_mint,
        constraint = user_token_b.owner == user.key(),
    )]
    pub user_token_b: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = token_a_vault.key() == pool.token_a_vault,
    )]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = token_b_vault.key() == pool.token_b_vault,
    )]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        constraint = !pool.paused,
    )]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub user_token_in: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_out: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = token_a_vault.key() == pool.token_a_vault,
    )]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = token_b_vault.key() == pool.token_b_vault,
    )]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SetFeeRate<'info> {
    #[account(
        constraint = authority.key() == pool.authority,
    )]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub pool: Account<'info, Pool>,
}

#[derive(Accounts)]
pub struct PausePool<'info> {
    #[account(
        constraint = authority.key() == pool.authority,
    )]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub pool: Account<'info, Pool>,
}

#[account]
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
}

#[event]
pub struct LiquidityDeposited {
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

// Helper function to calculate swap amounts
fn calculate_swap_amount(
    amount_in: u64,
    reserve_in: u64,
    reserve_out: u64,
    fee_rate: u64,
) -> Result<(u64, u64)> {
    // Calculate fee
    let fee = amount_in.checked_mul(fee_rate).unwrap().checked_div(10000).unwrap();
    let amount_in_with_fee = amount_in.checked_sub(fee).unwrap();

    // Calculate amount out using constant product formula: x * y = k
    let numerator = amount_in_with_fee.checked_mul(reserve_out).unwrap();
    let denominator = reserve_in.checked_add(amount_in_with_fee).unwrap();
    let amount_out = numerator.checked_div(denominator).unwrap();

    Ok((amount_out, fee))
}