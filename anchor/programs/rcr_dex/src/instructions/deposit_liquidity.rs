use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

pub fn deposit_liquidity(
    ctx: Context<DepositLiquidity>,
    amount_a: u64,
    amount_b: u64,
    min_liquidity: u64,
    fees: u64,
    _use_entire_amount: bool,
) -> Result<()> {
    // Prevent depositing assets the depositor does not own
    require!(fees == ctx.accounts.pool.fees, Errors::InvalidFee);
    require!(
        amount_a <= ctx.accounts.depositor_account_a.amount,
        Errors::InsufficientBalance
    );
    require!(
        amount_b <= ctx.accounts.depositor_account_b.amount,
        Errors::InsufficientBalance
    );

    // Making sure they are provided in the same proportion as existing liquidity
    let pool_a = &ctx.accounts.pool_account_a;
    let pool_b = &ctx.accounts.pool_account_b;
    // Defining pool creation like this allows attackers to frontrun pool creation with bad ratios
    let pool_creation = pool_a.amount == 0 && pool_b.amount == 0;
    let (minimal_amount_a, minimal_amount_b) = if pool_creation {
        // Add as is if there is no liquidity
        (amount_a, amount_b)
    } else {
        let amount_b_optimal = (amount_a.checked_mul(pool_b.amount).unwrap())
            .checked_div(pool_a.amount)
            .unwrap();
        if amount_b_optimal <= amount_b {
            (amount_a, amount_b_optimal)
        } else {
            let amount_a_optimal = (amount_b.checked_mul(pool_a.amount).unwrap())
                .checked_div(pool_b.amount)
                .unwrap();
            require!(
                amount_a_optimal <= amount_a,
                Errors::InBalanceOptimalAmounts
            );
            (amount_a_optimal, amount_b)
        }
    };
    msg!(
        "amount-a: {} & amount-b: {}",
        minimal_amount_a,
        minimal_amount_b
    );

    // Computing the amount of liquidity about to be deposited
    let liquidity: u64 = if ctx.accounts.mint_liquidity.supply == 0 {
        let initial_liquidity =
            integer_sqrt(minimal_amount_a.checked_mul(minimal_amount_b).unwrap());
        require!(
            initial_liquidity > MINIMUM_LIQUIDITY,
            Errors::InsufficientLiquidity
        );
        initial_liquidity - MINIMUM_LIQUIDITY
    } else {
        let ratio_a = (minimal_amount_a
            .checked_mul(ctx.accounts.mint_liquidity.supply)
            .unwrap())
        .checked_div(pool_a.amount)
        .unwrap();
        let ratio_b = (minimal_amount_b
            .checked_mul(ctx.accounts.mint_liquidity.supply)
            .unwrap())
        .checked_div(pool_b.amount)
        .unwrap();
        if ratio_a > ratio_b {
            ratio_b
        } else {
            ratio_a
        }
    };

    require!(
        liquidity >= min_liquidity && liquidity >= MINIMUM_LIQUIDITY,
        Errors::MinLiquidityError
    );
    msg!("liquiidity: {}", liquidity);

    // Transfer tokens to the pool
    transfer_tokens(
        &ctx.accounts.depositor_account_a,
        &ctx.accounts.pool_account_a,
        &ctx.accounts.depositor,
        &ctx.accounts.token_program,
        minimal_amount_a,
    )?;
    transfer_tokens(
        &ctx.accounts.depositor_account_b,
        &ctx.accounts.pool_account_b,
        &ctx.accounts.depositor,
        &ctx.accounts.token_program,
        minimal_amount_b,
    )?;

    let pool_key = ctx.accounts.pool.key();

    // Use the authority_seeds in signer_seeds
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"liquidity",
        pool_key.as_ref(),
        &[ctx.accounts.pool.pool_mint_liquidity_bump],
    ]];

    mint_tokens(
        &ctx.accounts.mint_liquidity,
        &ctx.accounts.depositor_account_liquidity,
        &ctx.accounts.token_program,
        signer_seeds,
        liquidity,
    )?;

    msg!("Minted liquidity amount : {}", liquidity);

    Ok(())
}

fn integer_sqrt(number: u64) -> u64 {
    (number as f64).sqrt() as u64
}

#[derive(Accounts)]
pub struct DepositLiquidity<'info> {
    #[account(
        seeds = [b"amm"],
        bump = amm.amm_bump,
    )]
    pub amm: Box<Account<'info, Amm>>,

    #[account(
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
        has_one = mint_liquidity
    )]
    pub pool: Box<Account<'info, Pool>>,

    /// The account getting liquidity tokens & adding liquidity amount
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(mut)]
    pub mint_liquidity: Box<InterfaceAccount<'info, Mint>>,

    pub mint_a: Box<InterfaceAccount<'info, Mint>>,

    pub mint_b: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub pool_account_a: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub pool_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = depositor,
        associated_token::mint = mint_liquidity,
        associated_token::authority = depositor,
        associated_token::token_program = token_program,
    )]
    pub depositor_account_liquidity: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint_a,
        associated_token::authority = depositor,
        associated_token::token_program = token_program,
    )]
    pub depositor_account_a: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
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
