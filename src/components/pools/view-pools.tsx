"use client";

import React, { useState, useEffect } from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { useDexProgram } from "./pool-mutation";
import { useConnection } from "@solana/wallet-adapter-react";
import { ExplorerLink } from "../cluster/cluster-ui";
import { ellipsify } from "../ui/ui-layout";


type PoolData = {
  tokenAmountA: number;
  tokenAmountB: number;
  lpSupply: number;
  mintA: string;
  mintB: string;
  fees: number;
  symbolA: string;
  symbolB: string;
};

export function ViewPools() {
  const { connection } = useConnection();
  const { poolAccounts } = useDexProgram();
  const [poolData, setPoolData] = useState<PoolData[]>([]);
  const [isLoading, setLoading] = useState(false);
  const metaplex = Metaplex.make(connection);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!poolAccounts.isLoading && poolAccounts.data) {
        const data: PoolData[] = [];

        for (const pool of poolAccounts.data) {
          try {
            const mintA = pool.account.mintA.toString();
            const mintB = pool.account.mintB.toString();
            const fees = pool.account.fees.toNumber() / 100;

            const balanceA = await connection.getTokenAccountBalance(
              pool.account.poolAccountA
            );
            const tokenAmountA = balanceA.value.uiAmount || 0;

            const balanceB = await connection.getTokenAccountBalance(
              pool.account.poolAccountB
            );
            const tokenAmountB = balanceB.value.uiAmount || 0;

            const lpSupplyData = await connection.getTokenSupply(
              pool.account.mintLiquidity
            );
            const lpSupply = lpSupplyData.value.uiAmount || 0;
            let symbolA = "UnKnown";
            let symbolB = "UnKnown";

            const metadataAccountA = metaplex
              .nfts()
              .pdas()
              .metadata({ mint: pool.account.mintA });
            const metadataAccountB = metaplex
              .nfts()
              .pdas()
              .metadata({ mint: pool.account.mintB });

            const metadataAccountInfoA = await connection.getAccountInfo(
              metadataAccountA
            );
            const metadataAccountInfoB = await connection.getAccountInfo(
              metadataAccountB
            );

            if (metadataAccountInfoA) {
              const tokenA = await metaplex
                .nfts()
                .findByMint({ mintAddress: pool.account.mintA });
              symbolA = tokenA.symbol;
            }
            if (metadataAccountInfoB) {
              const tokenB = await metaplex
                .nfts()
                .findByMint({ mintAddress: pool.account.mintB });
              symbolB = tokenB.symbol;
            }

            data.push({
              mintA,
              mintB,
              tokenAmountA,
              tokenAmountB,
              lpSupply,
              fees,
              symbolA,
              symbolB,
            });
          } catch (error) {
            console.error("Error fetching pool data:", error);
          }
        }

        setPoolData(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div
      className=" pt-3 text-white bg-black"
      style={{ alignItems: "center", justifyItems: "center" }}
    >
      <div
        className="bg-zinc-900 pt-2 px-1 sm:pt-4 sm:px-6 rounded-xl mt-2 text-white mx-auto rounded-20 overflow-scroll w-full max-h-[calc(100vh-230px)] scrollbar-hide"
      >
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Current Trading Pools</h1>
        </div>
        <div>
          {poolAccounts.isLoading || isLoading ? (
            <div style={{ marginLeft: "45%" }}>
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : poolData?.length != 0 ? (
            <table className="w-full text-center">
              <tr>
                <th className="w-1/12 px-1 overflow-x-scroll scrollbar-hide">#</th>
                <th className="w-4/12 px-1 overflow-x-scroll scrollbar-hide">Pool</th>
                <th className="w-2/12 px-1 overflow-x-scroll scrollbar-hide">Liquidity</th>
                <th className="w-2/12 px-1 overflow-x-scroll scrollbar-hide">Fees</th>
                <th className="w-2/12 px-1 overflow-x-scroll scrollbar-hide">LP Supply</th>
              </tr>
              {poolData?.map((account, index) => (
                <tr key={index}>
                  <td className="w-1/12 px-1 overflow-x-scroll scrollbar-hide">{index + 1}</td>
                  <td className="w-4/12 px-1 overflow-x-scroll scrollbar-hide">
                    <div>
                      <br />
                      <ExplorerLink
                        path={`account/${account.mintA}`}
                        label={ellipsify(account.mintA, 4)}
                      />{" "}
                      <i>({account.symbolA})</i>
                      <br />
                      <ExplorerLink
                        path={`account/${account.mintB}`}
                        label={ellipsify(account.mintB, 4)}
                      />{" "}
                      <i>({account.symbolB})</i>
                      <br />
                      <br />
                    </div>
                  </td>
                  <td className="w-2/12 px-1 overflow-x-scroll scrollbar-hide">
                    <div>
                      {account.tokenAmountA}
                      <br />
                      {account.tokenAmountB}
                    </div>
                  </td>
                  <td className="w-2/12 px-1 overflow-x-scroll scrollbar-hide">{account.fees}%</td>
                  <td className="w-2/12 px-1 overflow-x-scroll scrollbar-hide">{account.lpSupply}</td>
                </tr>
              ))}
            </table>
          ) : (
            <div>
              <div className="text-center" style={{ textAlign: "center" }}>
                <h2 className={"text-2xl"}>No Pools</h2>
                No pools found. Create any pool and start trading.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
