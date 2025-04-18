import { clusterApiUrl, PublicKey,Connection, TransactionMessage, VersionedTransaction, SystemProgram, Transaction, Keypair, TransactionInstruction } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import { sha256 } from "js-sha256";
// import { AnchorProvider, Program, BN, utils, web3 } from '@project-serum/anchor';
import { AnchorProvider,BN, web3 } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {getDexProgram} from "../../../../anchor/src";
import { useAnchorProvider } from "../../../components/solana/solana-provider";

// type GetData = {
//   label: string;
//   icon: string;
// };
// Devnet 'fake' USDC, you can get these tokens from https://spl-token-faucet.com/
// const USDC_ADDRESS = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
const ENDPOINT = clusterApiUrl("devnet");
// const NFT_NAME = "Golden Ticket";
// const PRICE_USDC = 0.1;
// type InputData = {
//   account: string;
// };
type Data = {
  label?: string;
  icon?: string;
  transaction?: string;
  message?: string;
};
export type PostError = {
  error: string;
};

const INCREMENT_PROGRAM_ID = new PublicKey("AAwQy1UeenPqH6poqtiR6sKePDgeF2YcnHmy2jSNYRL6");
const PROGRAM_ID = new PublicKey("DX4TnoHCQoCCLC5pg7K49CMb9maMA3TMfHXiPBD55G1w");
const DISCRIMINATOR = sha256.digest('global:increment').slice(0,8);
const data = Buffer.from([...DISCRIMINATOR])
export async function GET(
  request: NextRequest,
  response: NextResponse<Data>
) {
  console.log(new URL(request.url));
  const label = "Solana Pay";
  const icon = 'https://avatars.githubusercontent.com/u/92437260?v=4';

  return NextResponse.json({label,icon},{status:200});
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account } = body;

    const { searchParams } = new URL(request.url);
    const mintAPubkey = searchParams.get("mintA");
    const mintBPubkey = searchParams.get("mintB");
    const depositAmountA = searchParams.get("depositAmountA");
    const depositAmountB = searchParams.get("depositAmountB");
    const minLiquidity = searchParams.get("minLiquidity");
    const fees = searchParams.get("fees");
    const referenceParam = searchParams.get("reference");
    if (
      !account ||
      !mintAPubkey ||
      !mintBPubkey ||
      !depositAmountA ||
      !depositAmountB ||
      !minLiquidity ||
      !fees ||
      !referenceParam
    ) {
      throw new Error("Missing required fields in request parameters.");
    }

    const reference = new PublicKey(referenceParam);
    const depositor = new PublicKey(account);
    const mintA = new PublicKey(mintAPubkey);
    const mintB = new PublicKey(mintBPubkey);

    const depositAmountABN = new BN(depositAmountA);
    const depositAmountBBN = new BN(depositAmountB);
    const minLiquidityBN = new BN(minLiquidity);
    const feesBN = new BN(fees);

    // Derive PDAs
    const [amm] = PublicKey.findProgramAddressSync(
      [Buffer.from("amm")],
      PROGRAM_ID
    );
    const [pool] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), amm.toBuffer(), mintA.toBuffer(), mintB.toBuffer()],
      PROGRAM_ID
    );
    const [mintLiquidity] = PublicKey.findProgramAddressSync(
      [Buffer.from("liquidity"), pool.toBuffer()],
      PROGRAM_ID
    );
    const [poolAccountA] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool-account-a"), pool.toBuffer(), mintA.toBuffer()],
      PROGRAM_ID
    );
    const [poolAccountB] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool-account-b"), pool.toBuffer(), mintB.toBuffer()],
      PROGRAM_ID
    );

    // User associated token accounts
    const depositorAccountA = await getAssociatedTokenAddress(mintA, depositor);
    const depositorAccountB = await getAssociatedTokenAddress(mintB, depositor);
    const depositorAccountLiquidity = await getAssociatedTokenAddress(mintLiquidity, depositor);

    const tokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const associatedTokenProgram = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
    const systemProgram = new PublicKey("11111111111111111111111111111111");

    const instructionData = getInstructionData(
      depositAmountABN,
      depositAmountBBN,
      minLiquidityBN,
      feesBN,
      false // useEntireAmount (hardcoded to false)
    );
    const connection = new Connection(ENDPOINT);

    const depositIx = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: amm, isSigner: false, isWritable: false },
        { pubkey: pool, isSigner: false, isWritable: false },
        { pubkey: depositor, isSigner: true, isWritable: true },
        { pubkey: mintLiquidity, isSigner: false, isWritable: true },
        { pubkey: mintA, isSigner: false, isWritable: false },
        { pubkey: mintB, isSigner: false, isWritable: false },
        { pubkey: poolAccountA, isSigner: false, isWritable: true },
        { pubkey: poolAccountB, isSigner: false, isWritable: true },
        { pubkey: depositorAccountLiquidity, isSigner: false, isWritable: true },
        { pubkey: depositorAccountA, isSigner: false, isWritable: true },
        { pubkey: depositorAccountB, isSigner: false, isWritable: true },
        { pubkey: tokenProgram, isSigner: false, isWritable: false },
        { pubkey: associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: systemProgram, isSigner: false, isWritable: false },
        { pubkey: reference, isSigner: false, isWritable: false }
      ],
      data: instructionData,
    });
    console.log(account);


    // const incrementIx = new TransactionInstruction({
    //   programId: INCREMENT_PROGRAM_ID, // Your program's ID
    //   keys: [
    //     { pubkey: new PublicKey("4TeGWrrqMHW43r2QVYctp993pD6tAb4ZW4dxHJDNqmBR"), isSigner: false, isWritable: true },
    //     { pubkey: depositor, isSigner: true, isWritable: true }, 
    //     { pubkey: reference, isSigner: false, isWritable: false },
    //   ],
    //   data: data, 
    // });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const provider = useAnchorProvider();
    // const dummyWallet = {
    //   publicKey: depositor,
    //   signTransaction: async (tx: Transaction | web3.VersionedTransaction) => tx,
    //   signAllTransactions: async (txs: (Transaction | web3.VersionedTransaction)[]) => txs,
    //   // Add the missing required method
    //   signMessage: async (message: Uint8Array) => Uint8Array.from([])
    // };
    // const provider = new AnchorProvider(
    //   connection,
    //   dummyWallet as any,
    //   AnchorProvider.defaultOptions()
    // );
    // const program = getDexProgram(provider);

    // const depositIx = await program.methods.depositLiquidity(depositAmountABN, depositAmountBBN, minLiquidityBN, feesBN, true).accounts({
    //   // @ts-ignore
    //   amm: amm,
    //   pool: pool,
    //   depositor: depositor,
    //   mintLiquidity: mintLiquidity,
    //   mintA: mintA,
    //   mintB: mintB,
    //   poolAccountA: poolAccountA,
    //   poolAccountB: poolAccountB,
    //   depositorAccountLiquidity: depositorAccountLiquidity,
    //   depositorAccountA: depositorAccountA,
    //   depositorAccountB: depositorAccountB,
    //   tokenProgram: tokenProgram,
    //   associatedTokenProgram: associatedTokenProgram,
    //   systemProgram: systemProgram
    // }).instruction();

    // depositIx.keys.push({
    //   pubkey: reference,
    //   isSigner: false,
    //   isWritable: false,
    // });


    
    const transaction = new Transaction().add(depositIx);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = depositor;
    console.log("transction",transaction);

    const serializedTransaction = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
    });
    const base64Transaction = serializedTransaction.toString("base64");
    console.log("base64Transaction",base64Transaction);

    return NextResponse.json(
      {
        transaction: base64Transaction,
        message: "Deposit liquidity transaction created successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


const getInstructionData = (
  depositAmountA: BN,
  depositAmountB: BN,
  minLiquidity: BN,
  fees: BN,
  useEntireAmount: boolean
): Buffer => {
  const discriminator = sha256.digest("global:deposit_liquidity").slice(0, 8);
  return Buffer.concat([
    Buffer.from(discriminator),
    depositAmountA.toArrayLike(Buffer, "le", 8),
    depositAmountB.toArrayLike(Buffer, "le", 8),
    minLiquidity.toArrayLike(Buffer, "le", 8),
    fees.toArrayLike(Buffer, "le", 8),
    Buffer.from([useEntireAmount ? 1 : 0]),
  ]);
};
