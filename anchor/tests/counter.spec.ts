import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  getTokenMetadata,
} from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import type { Constants } from "../target/types/constants";

describe("Test", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Constants as anchor.Program<Constants>;
  
  it("initialize", async () => {
    const ammAccount = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("amm")],
      program.programId
    )[0];
    console.log(program.programId.toString());
    // Send transaction
    const txHash = await program.methods
      .createAmm()
      .accounts({
        amm: ammAccount,
        admin: program.provider.wallet.payer.publicKey,
        payer: program.provider.wallet.payer.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([program.provider.wallet.payer])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
  });
  it("create pool", async () => {
    try {
      const ammAccount = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("amm")],
        program.programId
      )[0];
      console.log(ammAccount.toString());
      const mint_a = new web3.PublicKey(
        "Gvi3gqecizXrhEKpaqKPMz4VduHyu6KULTURKNq577AE"
      );
      const mint_b = new web3.PublicKey(
        "7UqEjPkUV3aL8aMJToVMGHXHXLAKotAgvTGQPJf72J3m"
      );
      const [poolAccount, _poolBump] = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool"),
          ammAccount.toBuffer(),
          mint_a.toBuffer(),
          mint_b.toBuffer(),
        ],
        program.programId
      );
      console.log(poolAccount.toString());
      const mint_liquidity = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("liquidity"), poolAccount.toBuffer()],
        program.programId
      )[0];
      console.log(mint_liquidity.toString());
      const pool_account_a = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool-account-a"),
          poolAccount.toBuffer(),
          mint_a.toBuffer(),
        ],
        program.programId
      )[0];
      console.log(pool_account_a.toString());
      const pool_account_b = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool-account-b"),
          poolAccount.toBuffer(),
          mint_b.toBuffer(),
        ],
        program.programId
      )[0];
      console.log(pool_account_b.toString());
      // Send transaction
      const txHash = await program.methods
        .createPool(new BN(100))
        .accounts({
          amm: ammAccount,
          pool: poolAccount,
          mintLiquidity: mint_liquidity,
          mintA: mint_a,
          mintB: mint_b,
          poolAccountA: pool_account_a,
          poolAccountB: pool_account_b,
          admin: program.provider.wallet.payer.publicKey,
          payer: program.provider.wallet.payer.publicKey,
          tokenProgram: new web3.PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
          associatedTokenProgram: new web3.PublicKey(
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          ),
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([program.provider.wallet.payer])
        .rpc();
      console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
    } catch (error) {
      console.log(error);
    }
  });
  it("Deposit liquidity", async () => {
    try {
      const ammAccount = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("amm")],
        program.programId
      )[0];
      console.log(ammAccount.toString());
      const mint_a = new web3.PublicKey(
        "Gvi3gqecizXrhEKpaqKPMz4VduHyu6KULTURKNq577AE"
      );
      const mint_b = new web3.PublicKey(
        "7UqEjPkUV3aL8aMJToVMGHXHXLAKotAgvTGQPJf72J3m"
      );
      const [poolAccount, poolBump] = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool"),
          ammAccount.toBuffer(),
          mint_a.toBuffer(),
          mint_b.toBuffer(),
        ],
        program.programId
      );
      console.log(poolAccount.toString());
      const mint_liquidity = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("liquidity"), poolAccount.toBuffer()],
        program.programId
      )[0];
      console.log(mint_liquidity.toString());
      const pool_account_a = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool-account-a"),
          poolAccount.toBuffer(),
          mint_a.toBuffer(),
        ],
        program.programId
      )[0];
      console.log(pool_account_a.toString());
      const pool_account_b = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool-account-b"),
          poolAccount.toBuffer(),
          mint_b.toBuffer(),
        ],
        program.programId
      )[0];
      console.log(pool_account_b.toString());
      const depositor_account_a = await getAssociatedTokenAddress(
        mint_a,
        program.provider.wallet.payer.publicKey
      );
      console.log(depositor_account_a.toString());
      const depositor_account_b = await getAssociatedTokenAddress(
        mint_b,
        program.provider.wallet.payer.publicKey
      );
      console.log(depositor_account_b.toString());
      const depositor_account_liquidity =
        await getOrCreateAssociatedTokenAccount(
          program.provider.connection,
          program.provider.wallet.payer,
          mint_liquidity,
          program.provider.publicKey
        );
      console.log(depositor_account_liquidity.address.toString());
      // Send transaction
      const txHash = await program.methods
        .depositLiquidity(
          new BN(500000),
          new BN(5000000),
          new BN(101),
          new BN(100),
          true
        )
        .accounts({
          amm: ammAccount,
          pool: poolAccount,
          depositor: program.provider.wallet.payer,
          mintLiquidity: mint_liquidity,
          mintA: mint_a,
          mintB: mint_b,
          poolAccountA: pool_account_a,
          poolAccountB: pool_account_b,
          depositorAccountLiquidity: depositor_account_liquidity.address,
          depositorAccountA: depositor_account_a,
          depositorAccountB: depositor_account_b,
          tokenProgram: new web3.PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
          associatedTokenProgram: new web3.PublicKey(
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          ),
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([program.provider.wallet.payer])
        .rpc();
      console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
    } catch (error) {
      console.log(error);
    }
  });
  it("Swap exact input", async () => {
    const ammAccount = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("amm")],
      program.programId
    )[0];
    console.log(ammAccount.toString());
    const mint_a = new web3.PublicKey(
      "Gvi3gqecizXrhEKpaqKPMz4VduHyu6KULTURKNq577AE"
    );
    const mint_b = new web3.PublicKey(
      "7UqEjPkUV3aL8aMJToVMGHXHXLAKotAgvTGQPJf72J3m"
    );
    const [poolAccount, poolBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("pool"),
        ammAccount.toBuffer(),
        mint_a.toBuffer(),
        mint_b.toBuffer(),
      ],
      program.programId
    );
    console.log(poolAccount.toString());
    const pool_account_a = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("pool-account-a"),
        poolAccount.toBuffer(),
        mint_a.toBuffer(),
      ],
      program.programId
    )[0];
    console.log(pool_account_a.toString());
    const pool_account_b = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("pool-account-b"),
        poolAccount.toBuffer(),
        mint_b.toBuffer(),
      ],
      program.programId
    )[0];
    console.log(pool_account_b.toString());
    const depositor_account_a = await getAssociatedTokenAddress(
      mint_a,
      program.provider.wallet.payer.publicKey
    );
    console.log(depositor_account_a.toString());
    const depositor_account_b = await getAssociatedTokenAddress(
      mint_b,
      program.provider.wallet.payer.publicKey
    );
    console.log(depositor_account_b.toString());
    // Send transaction
    const txHash = await program.methods
      .swapExactInput(true, new BN(100000), new BN(10), new BN(10000), new BN(100))
      .accounts({
        amm: ammAccount,
        pool: poolAccount,
        trader: program.provider.wallet.payer,
        mintA: mint_a,
        mintB: mint_b,
        poolAccountA: pool_account_a,
        poolAccountB: pool_account_b,
        traderAccountA: depositor_account_a,
        traderAccountB: depositor_account_b,
        tokenProgram: new web3.PublicKey(
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        ),
        associatedTokenProgram: new web3.PublicKey(
          "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        ),
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([program.provider.wallet.payer])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
  });
  it("Withdraw liquidity", async () => {
    try {
      const ammAccount = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("amm")],
        program.programId
      )[0];
      console.log(ammAccount.toString());
      const mint_a = new web3.PublicKey(
        "Gvi3gqecizXrhEKpaqKPMz4VduHyu6KULTURKNq577AE"
      );
      const mint_b = new web3.PublicKey(
        "7UqEjPkUV3aL8aMJToVMGHXHXLAKotAgvTGQPJf72J3m"
      );
      const [poolAccount, poolBump] = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool"),
          ammAccount.toBuffer(),
          mint_a.toBuffer(),
          mint_b.toBuffer(),
        ],
        program.programId
      );
      console.log(poolAccount.toString());
      const pool_account_a = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool-account-a"),
          poolAccount.toBuffer(),
          mint_a.toBuffer(),
        ],
        program.programId
      )[0];
      console.log(pool_account_a.toString());
      const pool_account_b = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool-account-b"),
          poolAccount.toBuffer(),
          mint_b.toBuffer(),
        ],
        program.programId
      )[0];
      console.log(pool_account_b.toString());
      const depositor_account_a = await getAssociatedTokenAddress(
        mint_a,
        program.provider.wallet.payer.publicKey
      );
      console.log(depositor_account_a.toString());
      const depositor_account_b = await getAssociatedTokenAddress(
        mint_b,
        program.provider.wallet.payer.publicKey
      );
      console.log(depositor_account_b.toString());
      const mint_liquidity = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("liquidity"), poolAccount.toBuffer()],
        program.programId
      )[0];
      console.log(mint_liquidity.toString());
      const liquidity_account = await getAssociatedTokenAddress(
        mint_liquidity,
        program.provider.publicKey
      );
      // Send transaction
      const txHash = await program.methods
        .withdrawLiquidity(new BN(10000), new BN(100), new BN(100), new BN(100))
        .accounts({
          amm: ammAccount,
          pool: poolAccount,
          depositor: program.provider.wallet.payer,
          mintA: mint_a,
          mintB: mint_b,
          poolAccountA: pool_account_a,
          poolAccountB: pool_account_b,
          mintLiquidity: mint_liquidity,
          depositorAccountA: depositor_account_a,
          depositorAccountB: depositor_account_b,
          depositorAccountLiquidity: liquidity_account,
          tokenProgram: new web3.PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
          associatedTokenProgram: new web3.PublicKey(
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          ),
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([program.provider.wallet.payer])
        .rpc();
      console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
    } catch (error) {
      console.log(error);
    }
  });
  it("read metadata", async () => {
    try {
      const updatedMetadata = await getTokenMetadata(
        program.provider.connection,
        new web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU") // Mint Account address,
      );
      console.log(
        "\nUpdated Metadata:",
        JSON.stringify(updatedMetadata, null, 2)
      );
    } catch (error) {
      console.log(error);
    }
  });
});
