use anchor_lang::prelude::*;

#[constant]
pub const MINIMUM_LIQUIDITY: u64 = 100; // any user have to deposit minimum of 100 liquidity
pub const PRECISION: u64 = 10000;
pub const SWAP_FEE_1: u64 = 10; // 0.1%
pub const SWAP_FEE_2: u64 = 30; // 0.3%
pub const SWAP_FEE_3: u64 = 100; // 1%
pub const ADMIN_FEE: u64 = 5; // 0.05%
pub const POOL_CREATION_FEE: u64 = 100_000_000; // 0.1 SOL have to pay to create a pool
