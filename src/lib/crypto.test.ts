import { describe, it, expect } from "vitest";
import {
  deriveKey,
  encryptData,
  decryptData,
  arrayBufferToBase64,
  base64ToArrayBuffer
} from "./crypto";

describe("crypto helpers", () => {
  it("should roundtrip encrypt and decrypt", async () => {
    const passphrase = "password123";
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 1000;
    const data = JSON.stringify({ hello: "world" });

    const key = await deriveKey(passphrase, salt, iterations);
    const { iv, ciphertext } = await encryptData(data, key);

    const decrypted = await decryptData(ciphertext, key, iv as any);
    expect(decrypted).toBe(data);
  });

  it("should fail to decrypt with wrong key", async () => {
    const passphrase1 = "password123";
    const passphrase2 = "wrongpassword";
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 1000;
    const data = "sensitive data";

    const key1 = await deriveKey(passphrase1, salt, iterations);
    const key2 = await deriveKey(passphrase2, salt, iterations);

    const { iv, ciphertext } = await encryptData(data, key1);

    await expect(decryptData(ciphertext, key2, iv as any)).rejects.toThrow();
  });

  it("should convert between ArrayBuffer and base64", () => {
    const buffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    const b64 = arrayBufferToBase64(buffer);
    const back = base64ToArrayBuffer(b64);
    expect(new Uint8Array(back)).toEqual(new Uint8Array(buffer));
  });
});
