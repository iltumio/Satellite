import { Wallet } from '@ethersproject/wallet'
import { SigningKey } from 'ethers/lib/utils'

const ivLen = 16 // the IV is always 16 bytes

export default class Crypto {
  signingKey?: SigningKey
  aesKeys: { [key: string]: CryptoKey } = {}

  /**
   * @method init
   * @description Initializes the object using a specific private key
   */
  async init (wallet: Wallet) {
    this.signingKey = new SigningKey(wallet.privateKey)
  }

  /**
   * @method computeSharedSecret
   * @description Computes the ECDH shared secret between the current signing
   * key and the given recipient public key
   * @param guestPublicKey public key of the recipient
   * @returns shared secret string
   */
  computeSharedSecret (guestPublicKey: string) {
    if (!this.isInitialized()) return null

    return this.signingKey?.computeSharedSecret(
      `0x04${guestPublicKey.slice(2)}`
    )
  }

  /**
   *
   * @function aesKeyFromSharedSecret
   * @description Returns an AES-CBC Crypto Key computed from the ECDH shared secret
   * @param sharedSecret previously computed ECDH shared secret
   * @returns the AES CryptoKey
   */
  async aesKeyFromSharedSecret (sharedSecret: string): Promise<CryptoKey> {
    // Alternatively compute the aes key and cache it
    const buffered = Uint8Array.from(Buffer.from(sharedSecret.slice(2), 'hex'))

    return window.crypto.subtle.importKey(
      'raw',
      buffered,
      { name: 'AES-CBC' },
      true,
      ['encrypt', 'decrypt']
    )
  }

  /**
   *
   * @function initializeRecipient
   * @description Generates the AES key from the shared secret and caches it if
   * it's not present
   * @param recipientAddress Recipient address
   * @param guestPublicKey public key of the recipient
   * @returns AES key
   */
  async initializeRecipient (
    recipientAddress: string,
    guestPublicKey: string
  ): Promise<CryptoKey> {
    // Check if the instance has been initialized
    if (!this.isInitialized())
      throw new Error('Crypto Instance not initialized')

    // Check if the aes key for the given recipient is in cache
    if (this.aesKeys[recipientAddress]) {
      return this.aesKeys[recipientAddress]
    }

    // Compute the shared secret
    const sharedSecret = this.computeSharedSecret(guestPublicKey)

    // Check if the shared secret has been properly generated
    if (!sharedSecret) throw new Error('Impossible to generate shared secret')

    const aesKey = await this.aesKeyFromSharedSecret(sharedSecret)

    this.aesKeys[recipientAddress] = aesKey

    return aesKey
  }

  /**
   * @function joinIvAndData
   * @param iv initialization vector for AES CBC
   * @param data encrypted data converted in Uint8Array
   * @returns concatenated Uint8Array
   */
  joinIvAndData (iv: Uint8Array, data: Uint8Array) {
    let buf = new Uint8Array(iv.length + data.length)
    Array.prototype.forEach.call(iv, function (byte, i) {
      buf[i] = byte
    })
    Array.prototype.forEach.call(data, function (byte, i) {
      buf[ivLen + i] = byte
    })
    return buf
  }

  /**
   * @function separateIvFromData
   * @param buf concatenated iv and encrypted data
   * @returns an object containing separated values for iv and the data
   */
  separateIvFromData (buf: Uint8Array) {
    const iv = new Uint8Array(ivLen)
    const data = new Uint8Array(buf.length - ivLen)
    Array.prototype.forEach.call(buf, function (byte, i) {
      if (i < ivLen) {
        iv[i] = byte
      } else {
        data[i - ivLen] = byte
      }
    })
    return { iv: iv, data: data }
  }

  /**
   *
   * @param data string to encrypt
   * @param key AES key for the encryption
   * @returns base64 encrypted string
   */
  async encrypt (data: string, key: CryptoKey): Promise<string> {
    const encodedText = new TextEncoder().encode(data)

    const iv = window.crypto.getRandomValues(new Uint8Array(16))
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv
      },
      key,
      encodedText
    )

    const uintArray = this.joinIvAndData(iv, new Uint8Array(encryptedData))

    // @ts-ignore
    const string = String.fromCharCode.apply(null, uintArray)
    const base64Data = btoa(string)

    return base64Data
  }

  /**
   *
   * @param encryptedString base64 encrypted string
   * @param key AES key for the encryption
   * @returns decrypted string (clear text)
   */
  async decrypt (encryptedString: string, key: CryptoKey): Promise<string> {
    const string = atob(encryptedString)

    const encodedText = new Uint8Array(
      // @ts-ignore
      [...string].map(char => char.charCodeAt(0))
    )

    const { iv, data } = this.separateIvFromData(encodedText)

    // const iv = new Uint8Array(16);
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv
      },
      key,
      data
    )

    return new TextDecoder().decode(decryptedData)
  }

  /**
   * @method encryptFor
   * @description Encrypts a string with the ECDH shared secret for a specific address
   * @param recipientAddress Address of the recipient
   * @param data string to be encrypted
   * @returns the encrypted data
   */
  async encryptFor (recipientAddress: string, data: string) {
    // Check if the instance has been initialized
    if (!this.isInitialized())
      throw new Error('Crypto Instance not initialized')

    const aesKey = this.aesKeys[recipientAddress]

    if (!aesKey)
      throw new Error(
        'Encryption engine for this recipient has not yet been initialized'
      )

    return this.encrypt(data, aesKey)
  }

  /**
   * @method decryptFor
   * @description Decrypts a string with the ECDH shared secret from a specific address
   * @param senderAddress Address of the sender
   * @param data string to be encrypted
   * @returns the decrypted data
   */
  async decryptFor (senderAddress: string, data: string) {
    // Check if the instance has been initialized
    if (!this.isInitialized())
      throw new Error('Crypto Instance not initialized')

    const aesKey = this.aesKeys[senderAddress]

    if (!aesKey)
      throw new Error(
        'Encryption engine for this sender has not yet been initialized'
      )

    return this.decrypt(data, aesKey)
  }

  /**
   * @function isInitialized
   * @description Checks if the current instance is initialized
   * @returns a boolean value wether the instance has been initialized or not
   */
  isInitialized () {
    return Boolean(this.signingKey)
  }
}
