import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";

import { config } from "@/lib/config";

function getKeyBuffer() {
  return createHash("sha256").update(config.encryptionKey).digest();
}

export function encryptKey(plainText: string) {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", getKeyBuffer(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptKey(cipherText: string) {
  const [ivHex, payloadHex] = cipherText.split(":");
  if (!ivHex || !payloadHex) {
    throw new Error("Malformed encrypted key payload");
  }

  const decipher = createDecipheriv(
    "aes-256-cbc",
    getKeyBuffer(),
    Buffer.from(ivHex, "hex"),
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payloadHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function hashOpaqueToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

