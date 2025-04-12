use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::*;
use crate::state::*;
use crate::utils::*;

pub fn withdraw_liquidity(
    ctx: Context<WithdrawLiquidity>,
    liquidity_amount: u64,
    min_amount_a: u64,
    min_amount_b: u64,
    fees: u64,
) -> Result<()> {
    require!(liquidity_amount > 0, Errors::ZeroAmount);
    require!(fees == ctx.accounts.pool.fees, Errors::InvalidFee);
    // Transfer tokens from the pool
    let amount_a = (liquidity_amount
        .checked_mul(ctx.accounts.pool_account_a.amount)
        .unwrap()).checked_div(ctx.accounts.mint_liquidity.supply)
    .unwrap();

    let amount_b = (liquidity_amount
        .checked_mul(ctx.accounts.pool_account_b.amount)
        .unwrap()).checked_div(ctx.accounts.mint_liquidity.supply)
    .unwrap();

    require!(
        amount_a >= min_amount_a && amount_b >= min_amount_b,
        Errors::MinLiquidityError
    );

    // Burn the liquidity tokens
    burn_tokens(
        &ctx.accounts.mint_liquidity,
        &ctx.accounts.depositor_account_liquidity,
        &ctx.accounts.depositor,
        &ctx.accounts.token_program,
        liquidity_amount,
    )?;

    let pool_key = ctx.accounts.pool.key();
    let mint_a_key = ctx.accounts.mint_a.key();

    let signer_seeds: &[&[&[u8]]] = &[&[
        b"pool-account-a",
        pool_key.as_ref(),
        mint_a_key.as_ref(),
        &[ctx.accounts.pool.pool_account_a_bump],
    ]];

    transfer_tokens_with_seeds(
        &ctx.accounts.pool_account_a,
        &ctx.accounts.depositor_account_a,
        &ctx.accounts.pool_account_a,
        &ctx.accounts.token_program,
        signer_seeds,
        amount_a,
    )?;

    let pool_key = ctx.accounts.pool.key();
    let mint_b_key = ctx.accounts.mint_b.key();

    let signer_seeds: &[&[&[u8]]] = &[&[
        b"pool-account-b",
        pool_key.as_ref(),
        mint_b_key.as_ref(),
        &[ctx.accounts.pool.pool_account_b_bump],
    ]];

    transfer_tokens_with_seeds(
        &ctx.accounts.pool_account_b,
        &ctx.accounts.depositor_account_b,
        &ctx.accounts.pool_account_b,
        &ctx.accounts.token_program,
        signer_seeds,
        amount_b,
    )?;

    msg!(
        "Burned {} tokens and got amount-A : {} and amount-B : {}",
        liquidity_amount,
        amount_a,
        amount_b
    );

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawLiquidity<'info> {
    #[account(
        seeds = [b"amm"],
        bump = amm.amm_bump,
    )]
    pub amm: Box<Account<'info, Amm>>,

    #[account(
        mut,
        seeds = [
            b"pool",
            amm.key().as_ref(),
            mint_a.key().as_ref(),
            mint_b.key().as_ref()
        ],
        bump = pool.pool_bump,
        has_one = mint_a,
        has_one = mint_b,
        has_one = pool_account_a,
        has_one = pool_account_b,
        has_one = mint_liquidity
    )]
    pub pool: Box<Account<'info, Pool>>,

    /// The account paying for all rents
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(mut)]
    pub mint_liquidity: InterfaceAccount<'info, Mint>,

    pub mint_a: Box<InterfaceAccount<'info, Mint>>,

    pub mint_b: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub pool_account_a: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub pool_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint_liquidity,
        associated_token::authority = depositor,
        associated_token::token_program = token_program,
    )]
    pub depositor_account_liquidity: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = depositor,
        associated_token::mint = mint_a,
        associated_token::authority = depositor,
        associated_token::token_program = token_program,
    )]
    pub depositor_account_a: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = depositor,
        associated_token::mint = mint_b,
        associated_token::authority = depositor,
        associated_token::token_program = token_program,
    )]
    pub depositor_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Solana ecosystem accounts
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
