import CryptoJS from "crypto-js";

/**
 * Derive a symmetric key from a passphrase using PBKDF2.
 * We store salt next to the ciphertext to re-derive later.
 */
function deriveKey(passphrase, saltHex) {
  const salt = CryptoJS.enc.Hex.parse(saltHex);
  const key = CryptoJS.PBKDF2(passphrase, salt, {
    keySize: 256 / 32,
    iterations: 100_000,
    hasher: CryptoJS.algo.SHA256,
  });
  return key;
}

export function encryptText(plain, passphrase) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const salt = CryptoJS.lib.WordArray.random(16);
  const key = deriveKey(passphrase, CryptoJS.enc.Hex.stringify(salt));

  const encrypted = CryptoJS.AES.encrypt(plain, key, { iv });
  return {
    cipher: encrypted.toString(),
    iv: CryptoJS.enc.Hex.stringify(iv),
    salt: CryptoJS.enc.Hex.stringify(salt),
  };
}

export function decryptText(cipher, ivHex, saltHex, passphrase) {
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const key = deriveKey(passphrase, saltHex);
  const decrypted = CryptoJS.AES.decrypt(cipher, key, { iv });
  const out = decrypted.toString(CryptoJS.enc.Utf8);
  if (!out) throw new Error("Sorry Buddy😞.... Wrong Passphrase! Try Again");
  return out;
}

/**
 * A tiny "vault proof" token: we store an encrypted constant string to
 * quickly validate a passphrase on next app load.
 */
const PROOF_KEY = "vault-proof";
const PROOF_PLAINTEXT = "vault-ok";

export function saveVaultProof(passphrase) {
  const { cipher, iv, salt } = encryptText(PROOF_PLAINTEXT, passphrase);
  localStorage.setItem(PROOF_KEY, JSON.stringify({ cipher, iv, salt }));
}

export function verifyVaultPassphrase(passphrase) {
  const raw = localStorage.getItem(PROOF_KEY);
  if (!raw) return true; // first-time use—no proof yet
  try {
    const { cipher, iv, salt } = JSON.parse(raw);
    const plain = decryptText(cipher, iv, salt, passphrase);
    return plain === PROOF_PLAINTEXT;
  } catch {
    return false;
  }
}
