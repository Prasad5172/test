use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

pub fn create_pool(ctx: Context<CreatePool>, fees: u64) -> Result<()> {
    // pool should have to select any one of the fee tier only
    require!(
        fees == SWAP_FEE_1 || fees == SWAP_FEE_2 || fees == SWAP_FEE_3,
        Errors::InvalidFee
    );
    require!(
        ctx.accounts.mint_a.key() > ctx.accounts.mint_b.key(),
        Errors::InTokensOrder
    );
    require!(
        ctx.accounts.payer.to_account_info().lamports() > POOL_CREATION_FEE,
        Errors::InsufficientBalance
    );

    // transfer 0.1 SOL to create a pool
    transfer_sol(
        &ctx.accounts.payer,
        &ctx.accounts.admin,
        &ctx.accounts.system_program,
        POOL_CREATION_FEE,
    )?;

    // update the data to pool account
    let pool = &mut ctx.accounts.pool;
    pool.amm = ctx.accounts.amm.key();
    pool.mint_a = ctx.accounts.mint_a.key();
    pool.mint_b = ctx.accounts.mint_b.key();
    pool.fees = fees;
    pool.mint_liquidity = ctx.accounts.mint_liquidity.key();
    pool.pool_account_a = ctx.accounts.pool_account_a.key();
    pool.pool_account_b = ctx.accounts.pool_account_b.key();
    pool.pool_bump = ctx.bumps.pool;
    pool.pool_mint_liquidity_bump = ctx.bumps.mint_liquidity;
    pool.pool_account_a_bump = ctx.bumps.pool_account_a;
    pool.pool_account_b_bump = ctx.bumps.pool_account_b;

    // increase the pool count
    let amm = &mut ctx.accounts.amm;
    amm.pool_count = amm.pool_count + 1;

    Ok(())
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(
        mut,
        seeds = [b"amm"],
        bump = amm.amm_bump,
        has_one = admin,
    )]
    pub amm: Box<Account<'info, Amm>>,

    #[account(
        init,
        payer = payer,
        space = 8 + Pool::INIT_SPACE,
        seeds = [
            b"pool",
            amm.key().as_ref(),
            mint_a.key().as_ref(),
            mint_b.key().as_ref(),
        ],
        bump,
    )]
    pub pool: Box<Account<'info, Pool>>,

    #[account(
        init,  // before creating this account we have to add rent sol in different instruction
        payer = payer,
        seeds = [
            b"liquidity",
            pool.key().as_ref()
        ],
        bump,
        mint::decimals = 6,
        mint::authority = mint_liquidity,
        mint::freeze_authority = mint_liquidity,
        mint::token_program = token_program
    )]
    pub mint_liquidity: Box<InterfaceAccount<'info, Mint>>, // liquidity token mint

    pub mint_a: Box<InterfaceAccount<'info, Mint>>,

    pub mint_b: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = payer,
        token::mint = mint_a,
        token::authority = pool_account_a,
        seeds=[
            b"pool-account-a",
            pool.key().as_ref(),
            mint_a.key().as_ref()
        ],
        bump
    )]
    pub pool_account_a: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init,
        payer = payer,
        token::mint = mint_b,
        token::authority = pool_account_b,
        seeds=[
            b"pool-account-b",
            pool.key().as_ref(),
            mint_b.key().as_ref()
        ],
        bump
    )]
    pub pool_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    /// check : Adding a admin to the AMM
    #[account(mut)]
    pub admin: AccountInfo<'info>,

    /// The account paying for all rents
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana ecosystem accounts
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
