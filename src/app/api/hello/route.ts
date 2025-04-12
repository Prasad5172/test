import { clusterApiUrl, PublicKey,Connection, TransactionMessage, VersionedTransaction, SystemProgram, Transaction, Keypair, TransactionInstruction } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import { sha256 } from "js-sha256";
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

const PROGRAM_ID = new PublicKey("AAwQy1UeenPqH6poqtiR6sKePDgeF2YcnHmy2jSNYRL6");
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
    // Parse the request body
    const body = await request.json();
    const accountField = body?.account;

    if (!accountField) {
      throw new Error("Missing account field in the request body.");
    }

    const { searchParams } = new URL(request.url);
    const referenceParam = searchParams.get('reference');
    if (!referenceParam) {
      throw new Error('Missing reference in the URL query parameters.');
    }
    const reference = new PublicKey(referenceParam);
    // const reference = new Keypair().publicKey;
    // console.log(reference.toBase58());

    // Create PublicKey for sender
    const sender = new PublicKey(accountField);
    // console.log(sender);
    // Load merchant private key
    

    // Create the increment instruction
    const incrementIx = new TransactionInstruction({
      programId: PROGRAM_ID, // Your program's ID
      keys: [
        { pubkey: new PublicKey("4TeGWrrqMHW43r2QVYctp993pD6tAb4ZW4dxHJDNqmBR"), isSigner: false, isWritable: true },
        { pubkey: sender, isSigner: true, isWritable: true }, 
        { pubkey: reference, isSigner: false, isWritable: false },
      ],
      data: data, 
    });

    // Create the transaction
    let transaction = new Transaction().add(incrementIx);

    const connection = new Connection(ENDPOINT);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = sender;

    // transaction.partialSign(merchant)

    // transaction = Transaction.from(transaction.serialize({
    //   verifySignatures:false,
    //   requireAllSignatures:false
    // }))

    const serializedTransaction = transaction.serialize({
      verifySignatures:false,
      requireAllSignatures:false
    });
    const base64Transaction = serializedTransaction.toString("base64");
    console.log(base64Transaction);
    // Send the transaction
  

    return NextResponse.json(
      { transaction: base64Transaction,message: "Transaction sent successfully"},
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

