import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY,
  Keypair,
  ConfirmOptions
} from '@solana/web3.js'
import Solana from '../../../Solana'
import { publicKeyFromSeed, SEEDS } from '../../../SolanaUtils'
import config from '../../../../config/config.js'

import {
  encodeInstructionData,
  friendInfoAccountLayout,
  requestAccountLayout
} from './layout'

// export const FRIENDS_PROGRAM_ID = new PublicKey(
//   '92k8fHjwZV1tzFhokS1NoyLz65vhz3E3VdEcghXF4GRr'
// )

console.log('program id', config.solana.friendsProgramId)
export const FRIENDS_PROGRAM_ID = new PublicKey(config.solana.friendsProgramId)

export default class FriendsProgram {
  solana: Solana
  constructor (solana: Solana) {
    this.solana = solana
  }

  async createDerivedAccount (
    seedKey: PublicKey,
    seedString: string,
    params,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const { base, key } = await publicKeyFromSeed(
      seedKey,
      seedString,
      FRIENDS_PROGRAM_ID
    )

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: seedKey, isSigner: false, isWritable: false },
        { pubkey: base[0], isSigner: false, isWritable: false },
        { pubkey: key, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData(params)
    })

    const transaction = new Transaction().add(instruction)

    await sendAndConfirmTransaction(connection, transaction, [payerAccount], {
      commitment: 'finalized',
      preflightCommitment: 'finalized',
      ...confirmOptionsOverride
    })
    return key
  }

  async initFriendInfo (friendInfoPubKey: PublicKey, userKey: PublicKey) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendInfoPubKey, isSigner: false, isWritable: true },
        { pubkey: userKey, isSigner: true, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        initFriendInfo: {}
      })
    })
  }

  async createFriendInfo (
    userAccount: Keypair,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null
    if (!userAccount) return null

    const params = { createAccount: { friendInfo: {} } }
    const friendInfoKey = await this.createDerivedAccount(
      userAccount.publicKey,
      SEEDS.FRIEND_INFO,
      params
    )

    if (!friendInfoKey) throw new Error('Derived account error')

    const transaction = new Transaction().add(
      await this.initFriendInfo(friendInfoKey, userAccount.publicKey)
    )

    await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userAccount],
      {
        commitment: 'finalized',
        preflightCommitment: 'finalized',
        ...confirmOptionsOverride
      }
    )
    return friendInfoKey
  }

  async getFriendInfo (friendInfoKey: PublicKey) {
    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(friendInfoKey)

    return accountInfo
      ? friendInfoAccountLayout.decode(Buffer.from(accountInfo.data))
      : null
  }

  async initFriendRequest (
    requestFromToKey: PublicKey,
    requestToFromKey: PublicKey,
    friendInfoFromKey: PublicKey,
    friendInfoToKey: PublicKey,
    userFromKey: PublicKey
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: requestFromToKey, isSigner: false, isWritable: true },
        { pubkey: requestToFromKey, isSigner: false, isWritable: true },
        { pubkey: friendInfoFromKey, isSigner: false, isWritable: true },
        { pubkey: friendInfoToKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: true, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        makeRequest: {}
      })
    })
  }

  async createFriendRequest (
    userFromAccount: Keypair,
    userToKey: PublicKey,
    friendInfoFromKey: PublicKey,
    friendInfoToKey: PublicKey,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const friendInfoFromData = await this.getFriendInfo(friendInfoFromKey)

    const outgoingParams = {
      createAccount: {
        requestOutgoing: { index: friendInfoFromData.requests_outgoing }
      }
    }

    const requestFromAccount = await this.createDerivedAccount(
      userFromAccount.publicKey,
      friendInfoFromData.requests_outgoing + SEEDS.OUTGOING_REQUEST,
      outgoingParams
    )

    const friendInfoToData = await this.getFriendInfo(friendInfoToKey)

    const incomingParams = {
      createAccount: {
        requestIncoming: { index: friendInfoToData.requests_incoming }
      }
    }

    const requestToAccount = await this.createDerivedAccount(
      userToKey,
      friendInfoToData.requests_incoming + SEEDS.INCOMING_REQUEST,
      incomingParams
    )

    if (!requestFromAccount) throw new Error('')
    if (!requestToAccount) throw new Error('')

    const transaction = new Transaction().add(
      await this.initFriendRequest(
        requestFromAccount,
        requestToAccount,
        friendInfoFromKey,
        friendInfoToKey,
        userFromAccount.publicKey
      )
    )

    await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userFromAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
        ...confirmOptionsOverride
      }
    )
    return { outgoing: requestFromAccount, incoming: requestToAccount }
  }

  async getFriendRequest (friendRequestKey: PublicKey) {
    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(friendRequestKey)
    if (accountInfo === null) {
      throw 'Error: cannot find the account'
    }
    const info = requestAccountLayout.decode(Buffer.from(accountInfo.data))
    return info
  }
}
