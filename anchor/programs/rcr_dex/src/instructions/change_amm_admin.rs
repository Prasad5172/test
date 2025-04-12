use anchor_lang::prelude::*;
use crate::errors::*;
use crate::state::*;

#[access_control(check(&ctx))]
pub fn change_amm_admin(ctx: Context<ChangeAmmAdmin>) -> Result<()> {
    let amm = &mut ctx.accounts.amm;
    amm.admin = ctx.accounts.new_admin.key();
    Ok(())
}

fn check(ctx: &Context<ChangeAmmAdmin>) -> Result<()> {
    // Check if signer === owner
    require_keys_eq!(
        ctx.accounts.payer.key(),
        ctx.accounts.amm.admin,
        Errors::InvalidAdmin
    );

    Ok(())
}

#[derive(Accounts)]
pub struct ChangeAmmAdmin<'info> {
    #[account(
        mut,
        seeds = [b"amm"],
        bump = amm.amm_bump,
        // has_one = payer,  // this is enough for checking admin
        // constraint = payer.key() == amm.admin @ Errors::InvalidAdmin,  // it is also used to check owner
    )]
    pub amm: Box<Account<'info, Amm>>,

    pub new_admin: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// i have changes add admin to wallet one address => KYtXXxc5ef3U3XPD43o3Z8FKLfL7BsqTbPj9GCNDvTzYLDLjDXqiFgt6ZgNvutxfJmMXu3NkP3Vduv1ou4zBK7d
// new admin = 414C5ffjEmZaVdrptaA5TfWWNsLWFVM6aqZfPvwsxsmr
// admin again changed from wallet-1 to wallet-4 successfully and no other wallets other than admin chnage the amm_admin
