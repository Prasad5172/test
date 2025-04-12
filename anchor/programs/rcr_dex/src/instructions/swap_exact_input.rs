use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

pub fn swap_exact_input(
    ctx: Context<SwapExactInput>,
    swap_a: bool, // output should be mint_a
    input_amount: u64,
    min_output_amount: u64,
    delta_price_change: u64,
    fees: u64,
) -> Result<()> {
    // Prevent depositing assets the depositor does not own
    require!(input_amount > 0, Errors::ZeroAmount);
    require!(fees == ctx.accounts.pool.fees, Errors::InvalidFee);
    require!(
        delta_price_change > 0 && delta_price_change <= 10000,
        Errors::InvalidDeltaPrice
    );
    if swap_a {
        require!(
            ctx.accounts.trader_account_b.amount >= input_amount,
            Errors::InsufficientBalance
        );
    } else {
        require!(
            ctx.accounts.trader_account_a.amount >= input_amount,
            Errors::InsufficientBalance
        );
    }

    // Apply trading fee, used to compute the output
    let fee_amount = (input_amount.checked_mul(fees).unwrap())
        .checked_div(PRECISION)
        .unwrap();
    let taxed_input = input_amount.checked_sub(fee_amount).unwrap();

    let pool_a = &ctx.accounts.pool_account_a;
    let pool_b = &ctx.accounts.pool_account_b;
    let output_amount = if swap_a {
        (taxed_input.checked_mul(pool_a.amount).unwrap())
            .checked_div(pool_b.amount.checked_add(taxed_input).unwrap())
            .unwrap()
    } else {
        (taxed_input.checked_mul(pool_b.amount).unwrap())
            .checked_div(pool_a.amount.checked_add(taxed_input).unwrap())
            .unwrap()
    };

    require!(output_amount >= min_output_amount, Errors::OutputTooSmall);

    if swap_a {
        require!(
            delta_price_change >= get_price_percentage_changed(
                pool_a.amount,
                pool_b.amount,
                pool_a.amount.checked_sub(output_amount).unwrap(),
                pool_b.amount.checked_add(input_amount).unwrap(),
            ),
            Errors::InvalidPriceChange,
        );
    } else {
        require!(
            delta_price_change >= get_price_percentage_changed(
                pool_a.amount,
                pool_b.amount,
                pool_a.amount.checked_add(input_amount).unwrap(),
                pool_b.amount.checked_sub(output_amount).unwrap(),
            ),
            Errors::InvalidPriceChange,
        );
    }

    if swap_a {
        transfer_tokens(
            &ctx.accounts.trader_account_b,
            &ctx.accounts.pool_account_b,
            &ctx.accounts.trader,
            &ctx.accounts.token_program,
            input_amount,
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
            &ctx.accounts.trader_account_a,
            &ctx.accounts.pool_account_a,
            &ctx.accounts.token_program,
            signer_seeds,
            output_amount,
        )?;
    } else {
        transfer_tokens(
            &ctx.accounts.trader_account_a,
            &ctx.accounts.pool_account_a,
            &ctx.accounts.trader,
            &ctx.accounts.token_program,
            input_amount,
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
            &ctx.accounts.trader_account_b,
            &ctx.accounts.pool_account_b,
            &ctx.accounts.token_program,
            signer_seeds,
            output_amount,
        )?;
    }

    msg!(
        "Traded {} tokens ({} after fees) for {}",
        input_amount,
        taxed_input,
        output_amount
    );

    Ok(())
}

fn get_price_percentage_changed(
    before_amount_a: u64,
    before_amount_b: u64,
    after_amount_a: u64,
    after_amount_b: u64,
) -> u64 {
    let numerator = ((before_amount_a * after_amount_b) as i64
        - (before_amount_b * after_amount_a) as i64)
        .abs() as u64;
    let denominator = before_amount_b * after_amount_a;
    (numerator * PRECISION) / denominator
}

#[derive(Accounts)]
pub struct SwapExactInput<'info> {
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
            mint_b.key().as_ref(),
        ],
        bump = pool.pool_bump,
        has_one = amm,
        has_one = mint_a,
        has_one = mint_b,
        has_one = pool_account_a,
        has_one = pool_account_b,
    )]
    pub pool: Box<Account<'info, Pool>>,

    /// The account doing the swap
    #[account(mut)]
    pub trader: Signer<'info>,

    pub mint_a: Box<InterfaceAccount<'info, Mint>>,

    pub mint_b: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub pool_account_a: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub pool_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = trader,
        associated_token::mint = mint_a,
        associated_token::authority = trader,
        associated_token::token_program = token_program,
    )]
    pub trader_account_a: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = trader,
        associated_token::mint = mint_b,
        associated_token::authority = trader,
        associated_token::token_program = token_program,
    )]
    pub trader_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Solana ecosystem accounts
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
