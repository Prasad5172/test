use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("Invalid admin call")]
    InvalidAdmin,

    #[msg("Invalid fee value")]
    InvalidFee,

    #[msg("Change order of tokens")]
    InTokensOrder,

    #[msg("Insufficient token balance")]
    InsufficientBalance,

    #[msg("Adding liquidity with in balance ratio")]
    InBalanceOptimalAmounts,

    #[msg("Liquidity is not sufficient")]
    InsufficientLiquidity,

    #[msg("Minimum liquidity is not met")]
    MinLiquidityError,

    #[msg("Invalid zero amount")]
    ZeroAmount,

    #[msg("Output amount is small")]
    OutputTooSmall,

    #[msg("Output amount is high")]
    OutputTooHigh,

    #[msg("Unexpected change of price")]
    InvalidPriceChange,

    #[msg("Invalid delta price percentage")]
    InvalidDeltaPrice,

    #[msg("Transfering SOL failed")]
    TransferFailed,
}
