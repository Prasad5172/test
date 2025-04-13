// import {
//     Program,
//     AnchorProvider,
//     Idl,
//     setProvider,
//   } from "@project-serum/anchor"
//   import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet"
//   import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js"
//   import { programIDL, RcrDex } from "./data"


//   // Create a placeholder wallet to set up AnchorProvider
//   let wallet = new NodeWallet(Keypair.generate())
  
//   // Create a connection to the devnet cluster
//   export const connection = new Connection(clusterApiUrl("devnet"))
  
//   // Create an AnchorProvider instance with the connection and mock wallet
//   const provider = new AnchorProvider(connection, wallet, {})
  
//   // Set the provider as the default provider
//   setProvider(provider)
  
//   // Create a program object with the specified program ID
//   const programId = new PublicKey(programIDL.address)
  
//   export const program = new Program(
//     programIDL as Idl,
//     programId
//   ) as unknown as Program<RcrDex>
//   6
//   export const gameId = Keypair.generate().publicKey