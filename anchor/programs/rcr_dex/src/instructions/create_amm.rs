use crate::state::*;
use anchor_lang::prelude::*;

pub fn create_amm(ctx: Context<CreateAmm>) -> Result<()> {
    let amm = &mut ctx.accounts.amm;
    amm.admin = ctx.accounts.admin.key();
    amm.pool_count = 0;
    amm.amm_bump = ctx.bumps.amm;
    Ok(())
}

#[derive(Accounts)]
pub struct CreateAmm<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Amm::INIT_SPACE,
        seeds = [b"amm"],
        bump,
    )]
    pub amm: Box<Account<'info, Amm>>,

    /// check : Adding a admin to the AMM
    pub admin: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}


// amm account address that is derived form seeds(AMM_SEED) => AHL2uq6qvk6yKbaHcEnw91E4pcbEmsZSYzF12MjA4J8Q
// calling createAmm function and the tx => 3BWBtxB3N7Jc8pFsG3npPvNhkPK3DSppL3z8yBCVSDNNtEeD4vvGUbzrfTFiiACfc7vjZXjF72r9rD2DJTyStjRa