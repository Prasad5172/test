use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Amm {
    pub admin: Pubkey,
    pub pool_count: u16,
    pub amm_bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub amm: Pubkey,
    pub mint_a: Pubkey,
    pub mint_b: Pubkey,
    pub fees: u64,
    pub mint_liquidity: Pubkey,
    pub pool_account_a: Pubkey,
    pub pool_account_b: Pubkey,
    pub pool_bump: u8,
    pub pool_mint_liquidity_bump: u8,
    pub pool_account_a_bump: u8,
    pub pool_account_b_bump: u8,
}
