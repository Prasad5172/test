"use client";

import { getDexProgram, getDexProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { message } from "antd";
import BN from "bn.js";

export function useDexProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
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

  // const particularPool = useQuery({
  //   queryKey: ["counter", "fetch", { cluster }],
  //   queryFn: async ({ account }: { account: string }) =>
  //     program.account.pool.fetch(new PublicKey(account)),
  // });

  const swapExactInputMutation = useMutation({
    mutationKey: ["dex", "swapExactInput", { cluster }],
    mutationFn: async ({
      mintA,
      mintB,
      fees,
      inputAmount,
      deltaPriceChange,
      swapA,
    }: {
      mintA: string;
      mintB: string;
      fees: number;
      inputAmount: number;
      deltaPriceChange: number;
      swapA: boolean;
    }) => {
      console.log("exact input");
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

        const traderAccountA = await getAssociatedTokenAddress(
          mintAPubkey,
          program.provider.publicKey
        );
        console.log(traderAccountA.toString());

        const traderAccountB = await getAssociatedTokenAddress(
          mintBPubkey,
          program.provider.publicKey
        );
        console.log(traderAccountB.toString());

        if (traderAccountB) {
          return await program.methods
            .swapExactInput(
              swapA,
              new BN(inputAmount),
              new BN(1),
              new BN(deltaPriceChange * 100),
              new BN(fees)
            )
            .accounts({
              // @ts-ignore
              amm: ammAccount,
              pool: poolAccount,
              trader: program.provider.publicKey,
              mintA: mintAPubkey,
              mintB: mintBPubkey,
              poolAccountA: poolAccountA,
              poolAccountB: poolAccountB,
              traderAccountA: traderAccountA,
              traderAccountB: traderAccountB,
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
      toast.success("Tokens swapped successfully");
    },
    onError: (error) => {
      toast.error(`Failed to swap tokens`);
      console.log(error);
    },
  });

  const swapExactOutputMutation = useMutation({
    mutationKey: ["dex", "swapExactOutput", { cluster }],
    mutationFn: async ({
      mintA,
      mintB,
      fees,
      outputAmount,
      deltaPriceChange,
      swapA,
    }: {
      mintA: string;
      mintB: string;
      fees: number;
      outputAmount: number;
      deltaPriceChange: number;
      swapA: boolean;
    }) => {
      console.log("exact output");
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

        const traderAccountA = await getAssociatedTokenAddress(
          mintAPubkey,
          program.provider.publicKey
        );
        console.log(traderAccountA.toString());

        const traderAccountB = await getAssociatedTokenAddress(
          mintBPubkey,
          program.provider.publicKey
        );
        console.log(traderAccountB.toString());

        const MAX = 18446744073709551615;
        const u64MAX = 9007199254740991;

        if (traderAccountB) {
          await program.methods
            .swapExactOutput(
              swapA,
              new BN(outputAmount),
              // new BN(MAX),
              new BN(u64MAX),
              new BN(deltaPriceChange),
              new BN(fees)
            )
            .accounts({
              // @ts-ignore
              amm: ammAccount,
              pool: poolAccount,
              trader: program.provider.publicKey,
              mintA: mintAPubkey,
              mintB: mintBPubkey,
              poolAccountA: poolAccountA,
              poolAccountB: poolAccountB,
              traderAccountA: traderAccountA,
              traderAccountB: traderAccountB,
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
      toast.success("Tokens swapped successfully");
    },
    onError: (error) => {
      toast.error(`Failed to swap tokens`);
      console.log(error);
    },
  });

  return {
    program,
    programId,
    poolAccounts,
    swapExactInputMutation,
    swapExactOutputMutation,
  };
}
