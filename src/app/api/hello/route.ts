// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionConfirmationStrategy } from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from "next/server";
// import * as base58 from "base-58";

type GetData = {
  label: string
  icon: string
}
type Data = {
  label?: string;
  icon?: string;
  transaction?: string;
  message?: string;
};
type PostData = {
  transaction: string,
  message?: string
}

export async function GET(
  request: NextRequest,
  response: NextResponse<Data>
) {
  console.log(new URL(request.url));
  const label = "Solana Pay";
  const icon = 'https://avatars.githubusercontent.com/u/92437260?v=4';

  return NextResponse.json({label,icon},{status:200});
}