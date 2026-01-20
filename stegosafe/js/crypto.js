/**
 * Crypto Module for StegoSafe
 * Handles AES-GCM encryption/decryption with PBKDF2 key derivation
 */

const CryptoModule = (() => {
  // Constants
  const ALGORITHM = 'AES-GCM';
  const KEY_LENGTH = 256;
  const SALT_LENGTH = 16;
  const IV_LENGTH = 12;
  const TAG_LENGTH = 128;
  const ITERATIONS = 100000;

  /**
   * Generate a random salt
   * @returns {Uint8Array} Random salt
   */
  function generateSalt() {
    return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  }

  /**
   * Generate a random IV (Initialization Vector)
   * @returns {Uint8Array} Random IV
   */
  function generateIV() {
    return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  }

  /**
   * Derive a key from password using PBKDF2
   * @param {string} password - The password
   * @param {Uint8Array} salt - The salt
   * @returns {Promise<CryptoKey>} Derived key
   */
  async function deriveKey(password, salt) {
    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    // Derive key using PBKDF2
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: ALGORITHM,
        length: KEY_LENGTH
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt a message with optional password
   * @param {string} message - The message to encrypt
   * @param {string} password - Optional password for encryption
   * @returns {Promise<string>} Base64 encoded encrypted data with salt and IV
   */
  async function encryptMessage(message, password) {
    if (!password || password.trim() === '') {
      // No encryption, return message as-is encoded in base64
      return btoa(JSON.stringify({
        encrypted: false,
        message: message
      }));
    }

    try {
      const salt = generateSalt();
      const iv = generateIV();
      const key = await deriveKey(password, salt);

      // Convert message to bytes
      const messageBytes = new TextEncoder().encode(message);

      // Encrypt the message
      const encryptedBytes = await crypto.subtle.encrypt(
        {
          name: ALGORITHM,
          iv: iv
        },
        key,
        messageBytes
      );

      // Combine salt + iv + encrypted data
      const combined = new Uint8Array(
        salt.length + iv.length + encryptedBytes.byteLength
      );
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedBytes), salt.length + iv.length);

      // Encode to base64 for transmission
      const encrypted = btoa(
        String.fromCharCode.apply(null, combined)
      );

      return JSON.stringify({
        encrypted: true,
        data: encrypted
      });
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt a message with password
   * @param {string} encryptedData - Base64 encoded encrypted data
   * @param {string} password - Password for decryption
   * @returns {Promise<string>} Decrypted message
   */
  async function decryptMessage(encryptedData, password) {
    try {
      const parsed = JSON.parse(encryptedData);

      // If not encrypted, just return the message
      if (!parsed.encrypted) {
        return parsed.message;
      }

      // Decode from base64
      const combined = new Uint8Array(
        atob(parsed.data).split('').map(c => c.charCodeAt(0))
      );

      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, SALT_LENGTH);
      const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const encryptedBytes = combined.slice(SALT_LENGTH + IV_LENGTH);

      // Derive key using the same salt
      const key = await deriveKey(password, salt);

      // Decrypt the message
      const decryptedBytes = await crypto.subtle.decrypt(
        {
          name: ALGORITHM,
          iv: iv
        },
        key,
        encryptedBytes
      );

      // Convert bytes to string
      return new TextDecoder().decode(decryptedBytes);
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  // Public API
  return {
    deriveKey,
    encryptMessage,
    decryptMessage,
    generateSalt,
    generateIV
  };
})();
