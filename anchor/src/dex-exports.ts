import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DexIDL from '../target/idl/rcr_dex.json'
import type { RcrDex } from '../target/types/rcr_dex'

// Re-export the generated IDL and type
export { DexIDL, RcrDex } 

// The programId is imported from the program IDL.
export const DEX_PROGRAM_ID = new PublicKey(DexIDL.address)

// This is a helper function to get the dex Anchor program.
export function getDexProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...DexIDL, address: address ? address.toBase58() : DexIDL.address } as RcrDex, provider)
}

// This is a helper function to get the program ID for the dex program depending on the cluster.
export function getDexProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the dex program on devnet and testnet.
      return new PublicKey('DX4TnoHCQoCCLC5pg7K49CMb9maMA3TMfHXiPBD55G1w')
    case 'mainnet-beta':
    default:
      return DEX_PROGRAM_ID
  }
}
