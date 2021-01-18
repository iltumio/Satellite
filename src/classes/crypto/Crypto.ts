export default class Crypto {
  /** @function
   * Generate a new CryptoKeyPair
   * @name getKeyPair
   * @returns promise newley generated CryptoKeyPair
   */
  async getKeyPair() : Promise<CryptoKeyPair> {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"],
    );
    return keyPair;
  }

  /** @function
   * Export a key to JsonWebKey
   * @name export
   * @argument key the key to export
   * @returns promise which resolves the JsonWebKey
   */
  async export(key: CryptoKey) : Promise<JsonWebKey> {
    const k = await window.crypto.subtle.exportKey(
      "jwk",
      key,
    );
    return k;
  }

  /** @function
   * Export a public key from a keypair
   * @name pubKey
   * @argument keyPair the keypair to fetch the public key from
   * @returns promise which resolves the stored public key
   */
  async pubKey(keyPair: CryptoKeyPair) : Promise<JsonWebKey> {
    const k = await this.export(keyPair.publicKey);
    return k;
  }

  async importPubKey(key: JsonWebKey) : Promise<CryptoKey> {
    const publicKey = await window.crypto.subtle.importKey(
      "jwk",
      key,
      {
        name: "ECDH",
        namedCurve: "P-256",
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
  async privKey(keyPair: CryptoKeyPair) : Promise<JsonWebKey> {
    const k = await this.export(keyPair.privateKey);
    return k;
  }

  async importPrivKey(key: JsonWebKey) : Promise<CryptoKey> {
    const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      key,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
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
  async derive(guestPublicKey: CryptoKey, privateKey: CryptoKey) : Promise<CryptoKey> {
    const d = await window.crypto.subtle.deriveKey(
      { name: "ECDH", public: guestPublicKey },
      privateKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    return d;
  }

  async encrypt(data: string, derivedKey: CryptoKey) : Promise<string> {
    const encodedText = new TextEncoder().encode(data);
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") },
      derivedKey,
      encodedText
    );
    const uintArray = new Uint8Array(encryptedData);
    // @ts-ignore
    const string = String.fromCharCode.apply(null, uintArray);
    const base64Data = btoa(string);
    return base64Data;
  }

  async decrypt(data: string, derivedKey: CryptoKey) : Promise<string> {
    const string = atob(data);
    const uintArray = new Uint8Array(
      // @ts-ignore
      [...string].map((char) => char.charCodeAt(0))
    );
    const algorithm = {
      name: "AES-GCM",
      iv: new TextEncoder().encode("Initialization Vector"),
    };
    const decryptedData = await window.crypto.subtle.decrypt(
      algorithm,
      derivedKey,
      uintArray
    );

    return new TextDecoder().decode(decryptedData);
  }
}