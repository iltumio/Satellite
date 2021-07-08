import { PublicKey } from '@solana/web3.js'

export const publicKeyFromSeed = async (
  seedKey: PublicKey,
  seed: string,
  programId: PublicKey
) => {
  const base = await PublicKey.findProgramAddress(
    [seedKey.toBytes()],
    programId
  )

  const key = await PublicKey.createWithSeed(base[0], seed, programId)
  return { base, key }
}

export async function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const SEEDS = {
  FRIEND_INFO: 'friendinfo',
  OUTGOING_REQUEST: 'outgoing',
  INCOMING_REQUEST: 'incoming'
}
