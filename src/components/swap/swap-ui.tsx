"use client";

import React, { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider";
import { ellipsify } from "../ui/ui-layout";
import { useDexProgram } from "./swap-mutation";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { Popover, Radio, Modal, message, Image } from "antd";
import {
  SwapOutlined,
  DownOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

type TokenData = {
  tokenMint: string;
  symbol: string;
  name: string;
};

export default function Swaps() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const {
    program,
    poolAccounts,
    swapExactInputMutation,
    swapExactOutputMutation,
  } = useDexProgram();
  const metaplex = Metaplex.make(connection);

  const [rangeValue, setRangeValue] = useState(100);
  const [fees, setFees] = useState(100);
  const [isOpen, setIsOpen] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState(0);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(0);
  const [changeToken, setChangeToken] = useState<number>(1);
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [tokenOne, setTokenOne] = useState<TokenData>();
  const [tokenTwo, setTokenTwo] = useState<TokenData>();
  const [isLoading, setLoading] = useState(false);
  const [userOneBalance, setUserOneBalance] = useState(0);
  const [userTwoBalance, setUserTwoBalance] = useState(0);
  const allPools = new Set<string>();
  const [exactInput, setExactInput] = useState(true);

  const settings = (
    <>
      <div>
        <div>Fee Tier</div>
        <div>
          <Radio.Group
            value={fees}
            onChange={(event: any) => setFees(event.target.value)}
          >
            <Radio.Button value={10}>0.1%</Radio.Button>
            <Radio.Button value={30}>0.3%</Radio.Button>
            <Radio.Button value={100}>1%</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <br />
      <hr />
      <br />
      <div>
        <div>Slippage Tolerance</div>
        <div className="flex justify-between">
          <input
            type="range"
            className="form-range mx-3"
            id="rangeSlider"
            min="0.1"
            max="100"
            step="0.1"
            value={rangeValue}
            onChange={(event: any) => setRangeValue(event.target.value)}
          />
          <p style={{ width: "45px" }}>{rangeValue} %</p>
        </div>
      </div>
    </>
  );

  function openModal(asset: number) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  async function modifyToken(i: number) {
    if (publicKey) {
      const token = tokenData[i];
      const ATA = await getAssociatedTokenAddress(
        new PublicKey(token.tokenMint),
        publicKey
      );
      if (changeToken === 1) {
        try {
          const tokenAccount = await connection.getTokenAccountBalance(ATA);
          setUserOneBalance(tokenAccount.value.uiAmount || 0);
        } catch (error) {
          setUserOneBalance(0);
        }
        setTokenOne(token);
      } else {
        try {
          const tokenAccount = await connection.getTokenAccountBalance(ATA);
          setUserTwoBalance(tokenAccount.value.uiAmount || 0);
        } catch (error) {
          setUserTwoBalance(0);
        }
        setTokenTwo(token);
      }
      setIsOpen(false);
    }
  }

  function switchTokens() {
    const one = tokenOne;
    setTokenOne(tokenTwo);
    setTokenTwo(one);
    // calculate the send input value
    const oneAmount = tokenOneAmount;
    setTokenOneAmount(tokenTwoAmount);
    setTokenTwoAmount(oneAmount);
    const oneBalance = userOneBalance;
    setUserOneBalance(userTwoBalance);
    setUserTwoBalance(oneBalance);
  }

  const swapTokens = async () => {
    if (tokenOneAmount == 0 || tokenTwoAmount == 0) {
      message.error("Enter valid amount to swap");
    } else if (
      !tokenOne?.tokenMint ||
      !tokenTwo?.tokenMint ||
      tokenOne?.tokenMint === tokenTwo?.tokenMint
    ) {
      message.error("Select valid tokens");
    } else {
      if (exactInput) {
        await swapExactInputMutation.mutateAsync({
          mintA:
            tokenOne?.tokenMint > tokenTwo?.tokenMint
              ? tokenOne.tokenMint
              : tokenTwo?.tokenMint,
          mintB:
            tokenOne?.tokenMint > tokenTwo?.tokenMint
              ? tokenTwo.tokenMint
              : tokenOne?.tokenMint,
          fees: fees,
          inputAmount: tokenOneAmount,
          deltaPriceChange: rangeValue,
          swapA: tokenOne?.tokenMint < tokenTwo?.tokenMint,
        });
        const ATAOne = await getAssociatedTokenAddress(
          new PublicKey(tokenOne.tokenMint),
          program.provider.publicKey || new PublicKey("")
        );
        try {
          const tokenAccount = await connection.getTokenAccountBalance(ATAOne);
          setUserOneBalance(tokenAccount.value.uiAmount || 0);
        } catch (error) {
          setUserOneBalance(0);
        }
        const ATATwo = await getAssociatedTokenAddress(
          new PublicKey(tokenTwo.tokenMint),
          program.provider.publicKey || new PublicKey("")
        );
        try {
          const tokenAccount = await connection.getTokenAccountBalance(ATATwo);
          setUserTwoBalance(tokenAccount.value.uiAmount || 0);
        } catch (error) {
          setUserTwoBalance(0);
        }
      } else {
        await swapExactOutputMutation.mutateAsync({
          mintA:
            tokenOne?.tokenMint > tokenTwo?.tokenMint
              ? tokenOne.tokenMint
              : tokenTwo?.tokenMint,
          mintB:
            tokenOne?.tokenMint > tokenTwo?.tokenMint
              ? tokenTwo.tokenMint
              : tokenOne?.tokenMint,
          fees: fees,
          outputAmount: tokenTwoAmount,
          deltaPriceChange: rangeValue,
          swapA: tokenOne?.tokenMint < tokenTwo?.tokenMint,
        });
        const ATAOne = await getAssociatedTokenAddress(
          new PublicKey(tokenOne.tokenMint),
          program.provider.publicKey || new PublicKey("")
        );
        try {
          const tokenAccount = await connection.getTokenAccountBalance(ATAOne);
          setUserOneBalance(tokenAccount.value.uiAmount || 0);
        } catch (error) {
          setUserOneBalance(0);
        }
        const ATATwo = await getAssociatedTokenAddress(
          new PublicKey(tokenTwo.tokenMint),
          program.provider.publicKey || new PublicKey("")
        );
        try {
          const tokenAccount = await connection.getTokenAccountBalance(ATATwo);
          setUserTwoBalance(tokenAccount.value.uiAmount || 0);
        } catch (error) {
          setUserTwoBalance(0);
        }
      }
    }
  };

  const handleInputAmount = async (event: any) => {
    setExactInput(true);
    const inputAmount = event.target.value;
    setTokenOneAmount(inputAmount);

    if (inputAmount !== "0" && inputAmount !== "" && tokenOne && tokenTwo) {
      try {
        const [ammAccount] = PublicKey.findProgramAddressSync(
          [Buffer.from("amm")],
          program.programId
        );

        const [poolAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool"),
            ammAccount.toBuffer(),
            tokenOne?.tokenMint > tokenTwo?.tokenMint
              ? new PublicKey(tokenOne?.tokenMint).toBuffer()
              : new PublicKey(tokenTwo?.tokenMint).toBuffer(),
            tokenOne?.tokenMint > tokenTwo?.tokenMint
              ? new PublicKey(tokenTwo?.tokenMint).toBuffer()
              : new PublicKey(tokenOne?.tokenMint).toBuffer(),
          ],
          program.programId
        );
        const accountData = await program.account.pool.fetch(poolAccount);
        const poolAccountA = accountData.poolAccountA;
        const poolAccountB = accountData.poolAccountB;
        const fees = Number(accountData.fees);
        const balanceA = Number(
          (await getAccount(connection, poolAccountA)).amount
        );
        const balanceB = Number(
          (await getAccount(connection, poolAccountB)).amount
        );
        const taxedInput =
          inputAmount - parseInt(((inputAmount * fees) / 10000).toString());
        let outputAmount = 0;
        if (tokenOne.tokenMint < tokenTwo.tokenMint) {
          outputAmount = (taxedInput * balanceA) / (taxedInput + balanceB);
        } else {
          outputAmount = (taxedInput * balanceB) / (taxedInput + balanceA);
        }
        setTokenTwoAmount(outputAmount);
      } catch (error) {
        setTokenTwoAmount(0);
      }
    } else {
      setTokenTwoAmount(0);
    }
  };

  const handleOutputAmount = async (event: any) => {
    setExactInput(false);
    const outputAmount = event.target.value;
    setTokenTwoAmount(outputAmount);

    if (outputAmount !== "0" && outputAmount !== "" && tokenOne && tokenTwo) {
      try {
        const [ammAccount] = PublicKey.findProgramAddressSync(
          [Buffer.from("amm")],
          program.programId
        );

        const [poolAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("pool"),
            ammAccount.toBuffer(),
            tokenOne?.tokenMint > tokenTwo?.tokenMint
              ? new PublicKey(tokenOne?.tokenMint).toBuffer()
              : new PublicKey(tokenTwo?.tokenMint).toBuffer(),
            tokenOne?.tokenMint > tokenTwo?.tokenMint
              ? new PublicKey(tokenTwo?.tokenMint).toBuffer()
              : new PublicKey(tokenOne?.tokenMint).toBuffer(),
          ],
          program.programId
        );
        const accountData = await program.account.pool.fetch(poolAccount);
        const poolAccountA = accountData.poolAccountA;
        const poolAccountB = accountData.poolAccountB;
        const fees = Number(accountData.fees);
        const balanceA = Number(
          (await getAccount(connection, poolAccountA)).amount
        );
        const balanceB = Number(
          (await getAccount(connection, poolAccountB)).amount
        );
        let inputAmount = 0;
        if (tokenOne.tokenMint > tokenTwo.tokenMint) {
          inputAmount = (outputAmount * balanceA) / (balanceB - outputAmount);
        } else {
          inputAmount = (outputAmount * balanceB) / (balanceA - outputAmount);
        }
        const taxedInput =
          inputAmount + parseInt(((inputAmount * fees) / 10000).toString());
        setTokenOneAmount(taxedInput);
      } catch (error) {
        setTokenOneAmount(0);
      }
    } else {
      setTokenOneAmount(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!poolAccounts.isLoading && poolAccounts.data) {
        const data: TokenData[] = [];
        const uniqueMints = new Set<string>();

        for (const pool of poolAccounts.data) {
          allPools.add(pool.publicKey.toString());
          try {
            const mintA = pool.account.mintA.toString();
            if (!uniqueMints.has(mintA)) {
              let symbolA = "NULL";
              let nameA = "UnKnown";
              const metadataAccountA = metaplex
                .nfts()
                .pdas()
                .metadata({ mint: pool.account.mintA });
              const metadataAccountInfoA = await connection.getAccountInfo(
                metadataAccountA
              );
              if (metadataAccountInfoA) {
                const tokenA = await metaplex
                  .nfts()
                  .findByMint({ mintAddress: pool.account.mintA });
                symbolA = tokenA.symbol;
                nameA = tokenA.name;
              }
              uniqueMints.add(mintA);
              data.push({
                tokenMint: mintA,
                symbol: symbolA,
                name: nameA,
              });
              console.log(data);
            }

            const mintB = pool.account.mintB.toString();
            if (!uniqueMints.has(mintB)) {
              let symbolB = "NULL";
              let nameB = "UnKnown";
              const metadataAccountB = metaplex
                .nfts()
                .pdas()
                .metadata({ mint: pool.account.mintB });
              const metadataAccountInfoB = await connection.getAccountInfo(
                metadataAccountB
              );
              if (metadataAccountInfoB) {
                const tokenB = await metaplex
                  .nfts()
                  .findByMint({ mintAddress: pool.account.mintB });
                symbolB = tokenB.symbol;
              }
              uniqueMints.add(mintB);
              data.push({
                tokenMint: mintB,
                symbol: symbolB,
                name: nameB,
              });
              console.log(data);
            }
          } catch (error) {
            console.error("Error fetching pool data:", error);
          }
        }

        setTokenData(data);
        console.log(tokenData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchOutput = async () => {
      setExactInput(!exactInput);
      setTokenOneAmount(tokenOneAmount);
      if (tokenOneAmount !== 0 && tokenOne && tokenTwo) {
        try {
          const [ammAccount] = PublicKey.findProgramAddressSync(
            [Buffer.from("amm")],
            program.programId
          );

          const [poolAccount] = PublicKey.findProgramAddressSync(
            [
              Buffer.from("pool"),
              ammAccount.toBuffer(),
              tokenOne?.tokenMint > tokenTwo?.tokenMint
                ? new PublicKey(tokenOne?.tokenMint).toBuffer()
                : new PublicKey(tokenTwo?.tokenMint).toBuffer(),
              tokenOne?.tokenMint > tokenTwo?.tokenMint
                ? new PublicKey(tokenTwo?.tokenMint).toBuffer()
                : new PublicKey(tokenOne?.tokenMint).toBuffer(),
            ],
            program.programId
          );
          const accountData = await program.account.pool.fetch(poolAccount);
          const poolAccountA = accountData.poolAccountA;
          const poolAccountB = accountData.poolAccountB;
          const fees = Number(accountData.fees);
          const balanceA = Number(
            (await getAccount(connection, poolAccountA)).amount
          );
          const balanceB = Number(
            (await getAccount(connection, poolAccountB)).amount
          );
          const taxedInput =
            tokenOneAmount -
            parseInt(((tokenOneAmount * fees) / 10000).toString());
          let outputAmount = 0;
          if (tokenOne.tokenMint < tokenTwo.tokenMint) {
            outputAmount = (taxedInput * balanceA) / (taxedInput + balanceB);
          } else {
            outputAmount = (taxedInput * balanceB) / (taxedInput + balanceA);
          }
          setTokenTwoAmount(outputAmount);
        } catch (error) {
          setTokenTwoAmount(0);
        }
      } else {
        setTokenTwoAmount(0);
      }
    };
    fetchOutput();
  }, [tokenOne, tokenTwo]);

  return publicKey ? (
    <div className="  from-blue-50 to-indigo-50 flex items-center justify-center p-4 lg:pb-0 text-white w-[100%] md:w-[800px] mx-auto h-calc(100vh-135px) relative mb-[15px] lg:mb-0">
      <div className="w-full">
        <div
        className="bg-zinc-900 p-2 px-1 sm:p-4 sm:px-6 rounded-xl my-2 text-white mx-auto relative">
        <Modal
          open={isOpen}
          footer={null}
          onCancel={() => setIsOpen(false)}
          title="Select a token"
          width="90%"
          className="max-w-[500px]"
        >
          <div className="modalContent overflow-x-scroll">
            {tokenData?.map((token: TokenData, i: any) => {
              return (
                <div
                  className="tokenChoice flex"
                  key={i}
                  onClick={() => modifyToken(i)}
                >
                  <div>
                    <Image
                      src="/token.webp"
                      alt={token.name}
                      className="tokenLogo"
                      width={50}
                      height={50}
                      style={{ float: "left" }}
                    />
                  </div>
                  <div
                    className="tokenChoiceNames px-5"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="tokenName">
                      {token.name} ({token.symbol})
                    </div>
                    <div className="tokenTicker">{token.tokenMint}</div>
                    <br />
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>

        {!isLoading ? (
          <div>
            <div className="flex items-center justify-between py-4 px-5">
              <b>Swap</b>
              <Popover
                content={settings}
                title="Settings"
                trigger="click"
                placement="bottomRight"
              >
                <SettingOutlined className="cog" />
              </Popover>
            </div>
            <div className="relative">
              <div className="relative bg-[#212429] p-4 rounded-xl border-[4px] border-zinc-900 hover:bg-[#2f333b]">
                <div className="flex justify-between mb-2">
                  <p>Sell</p>
                  <p>Balance: {userOneBalance}</p>
                </div>
                <div className="flex items-center  justify-between">
                  <div>
                    <input
                      className=" w-full outline-none h-8 appearance-none text-3xl bg-transparent"
                      type="number"
                      onChange={handleInputAmount}
                      value={tokenOneAmount}
                      placeholder={"0.0"}
                    />
                  </div>
                  <div
                    className="flex p-2 pr-5 pl-3 bg-black rounded-[20px] cursor-pointer ">
                    <div
                      className="assetOne pb-1 w-max"
                      onClick={() => openModal(1)}
                    >
                      <Image
                        src="./token.webp"
                        alt="assetOneLogo"
                        className="assetLogo"
                        width={30}
                        height={30}
                        style={{ float: "left", marginTop: "5px" }}
                      />
                      <b
                        style={{
                          fontSize: "20px",
                          marginLeft: "10px",
                        }}
                      >
                        {ellipsify(tokenOne?.tokenMint, 2)}
                      </b>
                      &nbsp;&nbsp;
                      <DownOutlined />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="switchButton bg-[#212429] footer-center absolute top-1/2 left-1/2 transform translate-y-[-50%] translate-x-[-50%] scale-[1.2] rotate-90 cursor-pointer w-[35px] h-[35px] m-auto flex justify-center fixed border-[2px] border-zinc-900"
                onClick={switchTokens}
              >
                <SwapOutlined className="switchArrow" />
              </div>

              <div className="bg-[#212429] p-4 pb-6 rounded-xl border-[4px] border-zinc-900 hover:bg-[#2f333b]">
                <div className="flex justify-between mb-2">
                  <p>Buy</p>
                  <p>Balance: {userTwoBalance}</p>
                </div>
                <div className="flex items-center  justify-between">
                  <div>
                    <input
                      className=" w-full outline-none h-8 appearance-none text-3xl bg-transparent"
                      type={"number"}
                      onChange={handleOutputAmount}
                      // disabled={true}
                      value={tokenTwoAmount}
                      placeholder={"0.0"}
                    />
                  </div>
                  <div
                    className="flex p-2 pr-5 pl-3 bg-black rounded-[20px] cursor-pointer"
                    style={{
                      backgroundColor: "black",
                      borderRadius: "20px",
                      cursor: "pointer",
                      width: "auto",
                    }}
                  >
                    <div
                      className="assetOne pb-1 w-max"
                      onClick={() => openModal(2)}
                      style={{ marginTop: "-5px" }}
                    >
                      <Image
                        src="./token.webp"
                        alt="assetOneLogo"
                        className="assetLogo"
                        width={30}
                        height={30}
                        style={{ float: "left", marginTop: "5px" }}
                      />
                      <b
                        style={{
                          fontSize: "20px",
                          marginLeft: "10px",
                        }}
                      >
                        {ellipsify(tokenTwo?.tokenMint, 2)}
                      </b>
                      &nbsp;&nbsp;
                      <DownOutlined />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            

            <br />
            <p>
              <InfoCircleOutlined /> Select the correct fee tier & slippage
              tolerance at swap settings.
              <br />
              <InfoCircleOutlined /> If the selected pool not exists the output
              amount always shows `0`.
            </p>

            <div>
              {swapExactInputMutation.isPending ||
              swapExactOutputMutation.isPending ? (
                <div className="my-5" style={{ marginLeft: "45%" }}>
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex btn btn-outline-primary my-5"
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "20px",
                  }}
                  onClick={swapTokens}
                >
                  Swap Tokens
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: "470px" }}
          >
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
