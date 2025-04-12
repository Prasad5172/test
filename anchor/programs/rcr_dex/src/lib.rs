pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

use {anchor_lang::prelude::*, instructions::*};

// Set the correct key here
declare_id!("DX4TnoHCQoCCLC5pg7K49CMb9maMA3TMfHXiPBD55G1w");

#[program]
pub mod rcr_dex {
    use super::*;

    pub fn create_amm(ctx: Context<CreateAmm>) -> Result<()> {
        msg!("Creating AMM ...");
        create_amm::create_amm(ctx)
    }

    pub fn change_amm_admin(ctx: Context<ChangeAmmAdmin>) -> Result<()> {
        msg!("Changing admin ...");
        change_amm_admin::change_amm_admin(ctx)
    }

    pub fn create_pool(ctx: Context<CreatePool>, fees: u64) -> Result<()> {
        msg!("Creating a new pool ...");
        create_pool::create_pool(ctx, fees)
    }

    pub fn deposit_liquidity(
        ctx: Context<DepositLiquidity>,
        amount_a: u64,
        amount_b: u64,
        min_liquidity: u64,
        fees: u64,
        use_entire_amount: bool,
    ) -> Result<()> {
        msg!("Depositing liquidity ...");
        deposit_liquidity::deposit_liquidity(
            ctx,
            amount_a,
            amount_b,
            min_liquidity,
            fees,
            use_entire_amount,
        )
    }

    pub fn withdraw_liquidity(
        ctx: Context<WithdrawLiquidity>,
        liquidity_amount: u64,
        min_amount_a: u64,
        min_amount_b: u64,
        fees: u64,
    ) -> Result<()> {
        msg!("Withdrawing liquidity ...");
        withdraw_liquidity::withdraw_liquidity(
            ctx,
            liquidity_amount,
            min_amount_a,
            min_amount_b,
            fees,
        )
    }

    pub fn swap_exact_input(
        ctx: Context<SwapExactInput>,
        swap_a: bool, // output should be mint_a
        input_amount: u64,
        min_output_amount: u64,
        delta_price_change: u64,
        fees: u64,
    ) -> Result<()> {
        msg!("Swaping token with exact input tokens ...");
        swap_exact_input::swap_exact_input(
            ctx,
            swap_a,
            input_amount,
            min_output_amount,
            delta_price_change,
            fees,
        )
    }

    pub fn swap_exact_output(
        ctx: Context<SwapExactOutput>,
        swap_a: bool,
        output_amount: u64,
        max_input_amount: u64,
        delta_price_change: u64,
        fees: u64,
    ) -> Result<()> {
        msg!("Swaping token with exact output tokens ...");
        swap_exact_output::swap_exact_output(
            ctx,
            swap_a,
            output_amount,
            max_input_amount,
            delta_price_change,
            fees,
        )
    }
}

// deployed transaction => 3XdCP7NxGtWkMkKrwhnFYGkjMDus7a5A9QQ9dnn28Cm1qfcCvp3Bky3xMavX1esGQvdnJ7fzJhFjuzB1A1DE6SDx
// proram ID => 74XC81Xx3DtdQTueXfVhKuCT1UweomZumwWM3PXXSpdS
