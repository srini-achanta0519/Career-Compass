import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// ENCRYPTION_KEY must be set in environment - this is a dedicated key for data encryption
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = "aes-256-gcm";

function validateEncryptionKey(): void {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY environment variable is required for data encryption. Please set a strong, unique encryption key.");
  }
  if (ENCRYPTION_KEY.length < 32) {
    throw new Error("ENCRYPTION_KEY must be at least 32 characters long for security.");
  }
}

async function getDerivedKey(): Promise<Buffer> {
  validateEncryptionKey();
  return (await scryptAsync(ENCRYPTION_KEY!, "achievement-salt", 32)) as Buffer;
}

export async function encryptText(text: string): Promise<string> {
  const key = await getDerivedKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export async function decryptText(encryptedData: string): Promise<string> {
  try {
    const key = await getDerivedKey();
    const parts = encryptedData.split(":");
    
    if (parts.length !== 3) {
      // Data is not encrypted, return as-is (for backward compatibility)
      return encryptedData;
    }
    
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    // If decryption fails, return original (for backward compatibility with unencrypted data)
    return encryptedData;
  }
}

export function isEncrypted(text: string): boolean {
  const parts = text.split(":");
  return parts.length === 3 && parts[0].length === 32 && parts[1].length === 32;
}
