"use client";

import { getDexProgram, getDexProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import BN from "bn.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { message } from "antd";

export function useDexProgram() {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getDexProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getDexProgram(provider, programId),
    [provider, programId]
  );

  const poolAccounts = useQuery({
    queryKey: ["counter", "all", { cluster }],
    queryFn: () => program.account.pool.all(),
  });

  const addLiquidityMutation = useMutation({
    mutationKey: ["dex", "addLiquidity", { cluster }],
    mutationFn: async ({
      mintA,
      mintB,
      fees,
      amountA,
      amountB,
    }: {
      mintA: string;
      mintB: string;
      fees: number;
      amountA: number;
      amountB: number;
    }) => {
      if (program.provider.publicKey) {
        const mintAPubkey = new PublicKey(mintA);
        const mintBPubkey = new PublicKey(mintB);

        const [ammAccount] = PublicKey.findProgramAddressSync(
          [Buffer.from("amm")],
          program.programId
        );
        console.log(ammAccount.toString());

        const [poolAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool"),
            ammAccount.toBuffer(),
            mintAPubkey.toBuffer(),
            mintBPubkey.toBuffer(),
          ],
          program.programId
        );
        console.log(poolAccount.toString());

        const [mintLiquidity] = PublicKey.findProgramAddressSync(
          [Buffer.from("liquidity"), poolAccount.toBuffer()],
          program.programId
        );
        console.log(mintLiquidity.toString());

        const [poolAccountA] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool-account-a"),
            poolAccount.toBuffer(),
            mintAPubkey.toBuffer(),
          ],
          program.programId
        );
        console.log(poolAccountA.toString());

        const [poolAccountB] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool-account-b"),
            poolAccount.toBuffer(),
            mintBPubkey.toBuffer(),
          ],
          program.programId
        );
        console.log(poolAccountB.toString());

        const depositorAccountA = await getAssociatedTokenAddress(
          mintAPubkey,
          program.provider.publicKey
        );
        console.log(depositorAccountA.toString());

        const depositorAccountB = await getAssociatedTokenAddress(
          mintBPubkey,
          program.provider.publicKey
        );
        console.log(depositorAccountB.toString());

        const depositorLiquidityAccount = await getAssociatedTokenAddress(
          mintLiquidity,
          program.provider.publicKey
        );
        console.log(depositorLiquidityAccount.toString());

        if (depositorAccountA && depositorAccountB) {
          await program.methods
            .depositLiquidity(
              new BN(amountA),
              new BN(amountB),
              new BN(101),
              new BN(fees),
              true
            )
            .accounts({
              // @ts-ignore
              amm: ammAccount,
              pool: poolAccount,
              depositor: program.provider.publicKey,
              mintLiquidity: mintLiquidity,
              mintA: mintAPubkey,
              mintB: mintBPubkey,
              poolAccountA: poolAccountA,
              poolAccountB: poolAccountB,
              depositorAccountLiquidity: depositorLiquidityAccount,
              depositorAccountA: depositorAccountA,
              depositorAccountB: depositorAccountB,
              tokenProgram: new PublicKey(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
              ),
              associatedTokenProgram: new PublicKey(
                "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
              ),
              systemProgram: new PublicKey("11111111111111111111111111111111"), // System Program ID
            })
            .rpc();
        } else {
          console.log("Error: Depositor accounts not found");
          toast.error(`Error: Depositor accounts not found`);
        }
      } else {
        toast.error(`Connect the wallet`);
      }
    },
    onSuccess: (tx) => {
      console.log(tx);
      toast.success("Liquidity added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add liquidity`);
      console.log(error);
    },
  });

  const removeLiquidityMutation = useMutation({
    mutationKey: ["dex", "removeLiquidity", { cluster }],
    mutationFn: async ({
      mintA,
      mintB,
      fees,
      liquidity,
    }: {
      mintA: string;
      mintB: string;
      fees: number;
      liquidity: number;
    }) => {
      if (program.provider.publicKey) {
        const mintAPubkey = new PublicKey(mintA);
        const mintBPubkey = new PublicKey(mintB);

        const [ammAccount] = PublicKey.findProgramAddressSync(
          [Buffer.from("amm")],
          program.programId
        );
        console.log(ammAccount.toString());

        const [poolAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool"),
            ammAccount.toBuffer(),
            mintAPubkey.toBuffer(),
            mintBPubkey.toBuffer(),
          ],
          program.programId
        );
        console.log(poolAccount.toString());

        const [mintLiquidity] = PublicKey.findProgramAddressSync(
          [Buffer.from("liquidity"), poolAccount.toBuffer()],
          program.programId
        );
        console.log(mintLiquidity.toString());

        const [poolAccountA] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool-account-a"),
            poolAccount.toBuffer(),
            mintAPubkey.toBuffer(),
          ],
          program.programId
        );
        console.log(poolAccountA.toString());

        const [poolAccountB] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool-account-b"),
            poolAccount.toBuffer(),
            mintBPubkey.toBuffer(),
          ],
          program.programId
        );
        console.log(poolAccountB.toString());

        const depositorAccountA = await getAssociatedTokenAddress(
          mintAPubkey,
          program.provider.publicKey
        );
        console.log(depositorAccountA.toString());

        const depositorAccountB = await getAssociatedTokenAddress(
          mintBPubkey,
          program.provider.publicKey
        );
        console.log(depositorAccountB.toString());

        const depositorLiquidityAccount = await getAssociatedTokenAddress(
          mintLiquidity,
          program.provider.publicKey
        );
        console.log(depositorLiquidityAccount.toString());

        if (depositorAccountA && depositorAccountB) {
          await program.methods
            .withdrawLiquidity(
              new BN(liquidity),
              new BN(1),
              new BN(1),
              new BN(fees)
            )
            .accounts({
              // @ts-ignore
              amm: ammAccount,
              pool: poolAccount,
              depositor: program.provider.publicKey,
              mintLiquidity: mintLiquidity,
              mintA: mintAPubkey,
              mintB: mintBPubkey,
              poolAccountA: poolAccountA,
              poolAccountB: poolAccountB,
              depositorAccountLiquidity: depositorLiquidityAccount,
              depositorAccountA: depositorAccountA,
              depositorAccountB: depositorAccountB,
              tokenProgram: new PublicKey(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
              ),
              associatedTokenProgram: new PublicKey(
                "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
              ),
              systemProgram: new PublicKey("11111111111111111111111111111111"), // System Program ID
            })
            .rpc();
        } else {
          console.log("Error: Depositor accounts not found");
          message.error(`Error: Depositor accounts not found`);
        }
      } else {
        message.error(`Connect the wallet`);
      }
    },
    onSuccess: (tx) => {
      console.log(tx);
      message.success("Liquidity removed successfully");
    },
    onError: (error) => {
      toast.error(`Failed to remove liquidity`);
      console.log(error);
    },
  });

  return {
    program,
    programId,
    poolAccounts,
    addLiquidityMutation,
    removeLiquidityMutation,
  };
}
