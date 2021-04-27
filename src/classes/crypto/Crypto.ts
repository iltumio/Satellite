interface JsonKeyPair {
  public: JsonWebKey
  private: JsonWebKey
}

const ivLen = 16 // the IV is always 16 bytes

export default class Crypto {
  aesKeys: { [key: string]: CryptoKey } = {}

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
   * @param sharedSecret Previously computed ECDH shared secret
   * @returns AES key
   */
  async initializeRecipient (
    recipientAddress: string,
    sharedSecret: string
  ): Promise<CryptoKey> {
    if (this.aesKeys[recipientAddress]) {
      return this.aesKeys[recipientAddress]
    }

    return await this.aesKeyFromSharedSecret(sharedSecret)
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
}
