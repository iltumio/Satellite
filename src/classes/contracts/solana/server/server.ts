import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY,
  Keypair
} from '@solana/web3.js'
import {
  encodeInstructionData,
  dwellerAccountLayout,
  serverAccountLayout
} from './layout'
import { stringToBuffer } from './helper'
import Solana from '../../../Solana'

const SERVER_PROGRAM_ID = new PublicKey(
  'GfSqvy1yHF2wFf7R2e3HXAFDYsH1WdbS4jktkA1T7arP'
)
const DWELLER_SERVER_SEED = 'DwellerServer'
const SERVER_MEMBER_SEED = 'ServerMember'

const USER_SEED = 'user'

export default class ServerProgram {
  solana: Solana
  constructor (solana: Solana) {
    this.solana = solana
  }

  initializeUser (userAccount: Keypair, name: string) {
    return new TransactionInstruction({
      keys: [
        { pubkey: userAccount.publicKey, isSigner: true, isWritable: true }
      ],
      programId: SERVER_PROGRAM_ID,
      data: encodeInstructionData({
        initializeDweller: { name: stringToBuffer(name, 32) }
      })
    })
  }

  initializeServer (dwellerOwner, server, dwellerServer, serverMember, name) {
    return new TransactionInstruction({
      keys: [
        { pubkey: dwellerOwner, isSigner: true, isWritable: true },
        { pubkey: server, isSigner: true, isWritable: false },
        { pubkey: dwellerServer, isSigner: false, isWritable: true },
        { pubkey: serverMember, isSigner: false, isWritable: true }
      ],
      programId: SERVER_PROGRAM_ID,
      data: encodeInstructionData({
        initializeServer: { name: stringToBuffer(name, 32) }
      })
    })
  }

  async getUserPublicKey (payerAccount: Keypair) {
    return PublicKey.createWithSeed(
      payerAccount.publicKey,
      USER_SEED,
      SERVER_PROGRAM_ID
    )
  }

  async createUser (name: string) {
    const { connection } = this.solana

    const space = dwellerAccountLayout.span
    const lamports = await connection.getMinimumBalanceForRentExemption(space)

    const payerAccount = this.solana.getActiveAccount()
    const userAccount = this.solana.getUserAccount()

    if (!payerAccount) return null
    if (!userAccount) return null

    const transaction = new Transaction()
      .add(
        SystemProgram.createAccount({
          fromPubkey: payerAccount.publicKey,
          newAccountPubkey: userAccount.publicKey,
          lamports,
          space,
          programId: SERVER_PROGRAM_ID
        })
      )
      .add(this.initializeUser(userAccount, name))

    const result = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userAccount],
      {
        commitment: 'finalized',
        preflightCommitment: 'finalized'
      }
    )

    return userAccount
  }

  stringFromBuffer (buffer) {
    return Buffer.from(buffer)
      .toString('utf-8')
      .replace(/\0.*$/g, '')
  }

  parseUserInfo (userInfo) {
    if (!userInfo) {
      return null
    }

    return {
      name: this.stringFromBuffer(userInfo.name),
      servers: userInfo.servers,
      status: this.stringFromBuffer(userInfo.status),
      photoHash: this.stringFromBuffer(userInfo.photo_hash)
    }
  }

  async getUser (userPubkey) {
    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(userPubkey)

    return accountInfo
      ? this.parseUserInfo(
          dwellerAccountLayout.decode(Buffer.from(accountInfo.data))
        )
      : null
  }

  async createDerivedAccount (
    connection,
    payerAccount,
    seedKey,
    seedString,
    index,
    addressTypeValue
  ) {
    let base = await PublicKey.findProgramAddress(
      [seedKey.toBytes()],
      SERVER_PROGRAM_ID
    )
    let addressToCreate = await PublicKey.createWithSeed(
      base[0],
      seedString + index,
      SERVER_PROGRAM_ID
    )
    let params = { createDerivedAccount: {} }
    params.createDerivedAccount[addressTypeValue] = index
    let instruction = new TransactionInstruction({
      keys: [
        { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: seedKey, isSigner: false, isWritable: false },
        { pubkey: base[0], isSigner: false, isWritable: false },
        { pubkey: addressToCreate, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      programId: SERVER_PROGRAM_ID,
      data: encodeInstructionData(params)
    })

    let transaction = new Transaction().add(instruction)

    const result = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip'
      }
    )
    return addressToCreate
  }

  async createServer (connection, payerAccount, dwellerAccount, name) {
    // let server = new Account()
    // let dwellerData = await getDweller(connection, dwellerAccount.publicKey)
    // let dwellerServer = await createDerivedAccount(
    //   connection,
    //   payerAccount,
    //   dwellerAccount.publicKey,
    //   DWELLER_SERVER_SEED,
    //   dwellerData.servers,
    //   'dwellerServer'
    // )
    // console.log('DwellerServer account created: ', dwellerServer.toBase58())
    // let serverMembers = 0
    // let serverMember = await createDerivedAccount(
    //   connection,
    //   payerAccount,
    //   server.publicKey,
    //   SERVER_MEMBER_SEED,
    //   serverMembers,
    //   'serverMember'
    // )
    // console.log('ServerMember account created: ', serverMember.toBase58())
    // const space = serverAccountLayout.span
    // const lamports = await connection.getMinimumBalanceForRentExemption(space)
    // const transaction = new Transaction()
    //   .add(
    //     SystemProgram.createAccount({
    //       fromPubkey: payerAccount.publicKey,
    //       newAccountPubkey: server.publicKey,
    //       lamports,
    //       space,
    //       programId: SERVER_PROGRAM_ID
    //     })
    //   )
    //   .add(
    //     initializeServer(
    //       dwellerAccount.publicKey,
    //       server.publicKey,
    //       dwellerServer,
    //       serverMember,
    //       name
    //     )
    //   )
    // const result = await sendAndConfirmTransaction(
    //   connection,
    //   transaction,
    //   [payerAccount, server, dwellerAccount],
    //   {
    //     commitment: 'singleGossip',
    //     preflightCommitment: 'singleGossip'
    //   }
    // )
    // return server
  }

  async getServer (connection, serverPubkey) {
    const accountInfo = await connection.getAccountInfo(serverPubkey)
    if (accountInfo === null) {
      throw 'Error: cannot find the account'
    }
    const info = serverAccountLayout.decode(Buffer.from(accountInfo.data))
    return info
  }
}
