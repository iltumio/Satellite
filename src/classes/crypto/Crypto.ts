interface JsonKeyPair {
  public: JsonWebKey;
  private: JsonWebKey;
}

const ivLen = 16; // the IV is always 16 bytes

export default class Crypto {
  aesKeys: {[key: string]: CryptoKey} = {};

  /** @function
   * Store a public key locally
   * @name storeKey
   */
  storeKey(address: string, key: JsonWebKey) {
    // TODO: encrypt this with the users pin
    localStorage.setItem(`pubkey.${address}`, JSON.stringify(key));
  }

  getKey(address: string) {
    const stringKey = localStorage.getItem(`pubkey.${address}`);
    return stringKey ? JSON.parse(stringKey) : false;
  }

  /** @function
   * Generate a new CryptoKeyPair
   * @name getKeyPair
   * @returns promise newley generated CryptoKeyPair
   */
  async getKeyPair(): Promise<CryptoKeyPair> {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey', 'deriveBits']
    );
    return keyPair;
  }

  /** @function
   * Export a key to JsonWebKey
   * @name export
   * @argument key the key to export
   * @returns promise which resolves the JsonWebKey
   */
  async export(key: CryptoKey): Promise<JsonWebKey> {
    return await window.crypto.subtle.exportKey('jwk', key);
  }

  /** @function
   * Export a public key from a keypair
   * @name pubKey
   * @argument keyPair the keypair to fetch the public key from
   * @returns promise which resolves the stored public key
   */
  async pubKey(keyPair: CryptoKeyPair): Promise<JsonWebKey> {
    const k = await this.export(keyPair.publicKey);
    return k;
  }

  async importPubKey(key: JsonWebKey): Promise<CryptoKey> {
    const publicKey = await window.crypto.subtle.importKey(
      'jwk',
      key,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      []
    );
    return publicKey;
  }

  /** @function
   * Export a private key from a keypair
   * @name privKey
   * @argument keyPair the keypair to fetch the private key from
   * @returns promise which resolves the stored private key
   */
  async privKey(keyPair: CryptoKeyPair): Promise<JsonWebKey> {
    const k = await this.export(keyPair.privateKey);
    return k;
  }

  async importPrivKey(key: JsonWebKey): Promise<CryptoKey> {
    const privateKey = await window.crypto.subtle.importKey(
      'jwk',
      key,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey', 'deriveBits']
    );
    return privateKey;
  }

  /** @function
   * Derive a symmetric key for encrypting messages
   * @name derive
   * @argument guestPublicKey Public key of the user we'll be sending encrypted messages to
   * @argument privateKey our local private key
   * @returns promise which resolves the new symmetric crypto key
   */
  async derive(
    guestPublicKey: CryptoKey,
    privateKey: CryptoKey
  ): Promise<CryptoKey> {
    const d = await window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: guestPublicKey },
      privateKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    return d;
  }

  /**
   *
   * @function aesKeyFromSharedSecret
   * @description Returns an AES-CBC Crypto Key computed from the ECDH shared secret
   * @param sharedSecret previously computed ECDH shared secret
   * @returns the AES CryptoKey
   */
  async aesKeyFromSharedSecret(sharedSecret: string): Promise<CryptoKey> {
    // Alternatively compute the aes key and cache it
    const buffered = Uint8Array.from(Buffer.from(sharedSecret.slice(2), 'hex'));

    return window.crypto.subtle.importKey(
      'raw',
      buffered,
      { name: 'AES-CBC' },
      true,
      ['encrypt', 'decrypt']
    );
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
  async initializeRecipient(
    recipientAddress: string,
    sharedSecret: string
  ): Promise<CryptoKey> {
    if(this.aesKeys[recipientAddress]){
      return this.aesKeys[recipientAddress];
    }

    return await this.aesKeyFromSharedSecret(sharedSecret)
  }

  /**
   * @function joinIvAndData
   * @param iv initialization vector for AES CBC
   * @param data encrypted data converted in Uint8Array
   * @returns concatenated Uint8Array
   */
  joinIvAndData(iv: Uint8Array, data: Uint8Array) {
    let buf = new Uint8Array(iv.length + data.length);
    Array.prototype.forEach.call(iv, function(byte, i) {
      buf[i] = byte;
    });
    Array.prototype.forEach.call(data, function(byte, i) {
      buf[ivLen + i] = byte;
    });
    return buf;
  }

  /**
   * @function separateIvFromData
   * @param buf concatenated iv and encrypted data
   * @returns an object containing separated values for iv and the data
   */
  separateIvFromData(buf: Uint8Array) {
    const iv = new Uint8Array(ivLen);
    const data = new Uint8Array(buf.length - ivLen);
    Array.prototype.forEach.call(buf, function(byte, i) {
      if (i < ivLen) {
        iv[i] = byte;
      } else {
        data[i - ivLen] = byte;
      }
    });
    return { iv: iv, data: data };
  }

  /**
   * 
   * @param data string to encrypt
   * @param key AES key for the encryption
   * @returns base64 encrypted string
   */
  async encrypt(data: string, key: CryptoKey): Promise<string> {
    const encodedText = new TextEncoder().encode(data);

    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv
      },
      key,
      encodedText
    );

    const uintArray = this.joinIvAndData(iv, new Uint8Array(encryptedData));

    // @ts-ignore
    const string = String.fromCharCode.apply(null, uintArray);
    const base64Data = btoa(string);

    return base64Data;
  }

  /**
   * 
   * @param encryptedString base64 encrypted string
   * @param key AES key for the encryption
   * @returns decrypted string (clear text)
   */
  async decrypt(encryptedString: string, key: CryptoKey): Promise<string> {
    const string = atob(encryptedString);

    const encodedText = new Uint8Array(
      // @ts-ignore
      [...string].map(char => char.charCodeAt(0))
    );

    const { iv, data } = this.separateIvFromData(encodedText);

    // const iv = new Uint8Array(16);
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedData);
  }
}
