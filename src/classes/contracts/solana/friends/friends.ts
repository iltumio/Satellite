import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import Solana from '../../../Solana'

import {
  encodeInstructionData,
  friendInfoAccountLayout,
  requestAccountLayout
} from './layout'

export const FRIENDS_PROGRAM_ID = new PublicKey(
  '92k8fHjwZV1tzFhokS1NoyLz65vhz3E3VdEcghXF4GRr'
)

export const FRIEND_INFO_SEED = 'friendinfo'
export const OUTGOING_REQUEST = 'outgoing'
export const INCOMING_REQUEST = 'incoming'

export default class FriendsProgram {
  solana: Solana
  constructor (solana: Solana) {
    this.solana = solana
  }

  async createDerivedAccount (seedKey, seedString, params) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const base = await PublicKey.findProgramAddress(
      [seedKey.toBytes()],
      FRIENDS_PROGRAM_ID
    )

    const addressToCreate = await PublicKey.createWithSeed(
      base[0],
      seedString,
      FRIENDS_PROGRAM_ID
    )

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: seedKey, isSigner: false, isWritable: false },
        { pubkey: base[0], isSigner: false, isWritable: false },
        { pubkey: addressToCreate, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData(params)
    })

    const transaction = new Transaction().add(instruction)

    await sendAndConfirmTransaction(connection, transaction, [payerAccount], {
      commitment: 'singleGossip',
      preflightCommitment: 'singleGossip'
    })
    return addressToCreate
  }

  async initFriendInfo (friendInfoPubKey, userKey) {
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

  async createFriendInfo (userAccount) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const params = { createAccount: { friendInfo: {} } }
    const friendInfoKey = await this.createDerivedAccount(
      userAccount.publicKey,
      FRIEND_INFO_SEED,
      params
    )

    const transaction = new Transaction().add(
      await this.initFriendInfo(friendInfoKey, userAccount.publicKey)
    )

    await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip'
      }
    )
    return friendInfoKey
  }

  async getFriendInfo (friendInfoKey) {
    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(friendInfoKey)

    return accountInfo
      ? friendInfoAccountLayout.decode(Buffer.from(accountInfo.data))
      : null
  }

  async initFriendRequest (
    requestFromToKey,
    requestToFromKey,
    friendInfoFromKey,
    friendInfoToKey,
    userFromKey
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
    userFromAccount,
    userToKey,
    friendInfoFromKey,
    friendInfoToKey
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
      friendInfoFromData.requests_outgoing + OUTGOING_REQUEST,
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
      friendInfoToData.requests_incoming + INCOMING_REQUEST,
      incomingParams
    )

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
        preflightCommitment: 'singleGossip'
      }
    )
    return { outgoing: requestFromAccount, incoming: requestToAccount }
  }

  async getFriendRequest (connection, friendRequestKey) {
    const accountInfo = await connection.getAccountInfo(friendRequestKey)
    if (accountInfo === null) {
      throw 'Error: cannot find the account'
    }
    const info = requestAccountLayout.decode(Buffer.from(accountInfo.data))
    return info
  }
}
