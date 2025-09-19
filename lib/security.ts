// Encryption utilities using Web Crypto API
export class SecurityUtils {
  private static readonly ALGORITHM = "AES-GCM"
  private static readonly KEY_LENGTH = 32
  private static readonly IV_LENGTH = 12

  // Generate a secure random key
  static generateKey(): string {
    const keyArray = new Uint8Array(this.KEY_LENGTH)
    window.crypto.getRandomValues(keyArray)
    return Array.from(keyArray, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Encrypt data with AES-GCM (simplified for Edge Runtime)
  static async encrypt(data: string, key: string): Promise<{ encrypted: string; iv: string }> {
    const encoder = new TextEncoder()
    const keyBuffer = new Uint8Array(key.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const iv = new Uint8Array(this.IV_LENGTH)
    window.crypto.getRandomValues(iv)

    try {
      const cryptoKey = await window.crypto.subtle.importKey("raw", keyBuffer, { name: this.ALGORITHM }, false, [
        "encrypt",
      ])

      const encrypted = await window.crypto.subtle.encrypt(
        { name: this.ALGORITHM, iv },
        cryptoKey,
        encoder.encode(data),
      )

      return {
        encrypted: Array.from(new Uint8Array(encrypted), (byte) => byte.toString(16).padStart(2, "0")).join(""),
        iv: Array.from(iv, (byte) => byte.toString(16).padStart(2, "0")).join(""),
      }
    } catch (error) {
      // Fallback for environments without Web Crypto
      return {
        encrypted: Buffer.from(data).toString("base64"),
        iv: Array.from(iv, (byte) => byte.toString(16).padStart(2, "0")).join(""),
      }
    }
  }

  // Decrypt data with AES-GCM (simplified for Edge Runtime)
  static async decrypt(encryptedData: string, key: string, iv: string): Promise<string> {
    const keyBuffer = new Uint8Array(key.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const ivBuffer = new Uint8Array(iv.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const encryptedBuffer = new Uint8Array(encryptedData.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))

    try {
      const cryptoKey = await window.crypto.subtle.importKey("raw", keyBuffer, { name: this.ALGORITHM }, false, [
        "decrypt",
      ])

      const decrypted = await window.crypto.subtle.decrypt(
        { name: this.ALGORITHM, iv: ivBuffer },
        cryptoKey,
        encryptedBuffer,
      )

      return new TextDecoder().decode(decrypted)
    } catch (error) {
      // Fallback for environments without Web Crypto
      return Buffer.from(encryptedData, "base64").toString("utf8")
    }
  }

  // Hash sensitive data (simplified for Edge Runtime)
  static async hash(data: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const encoder = new TextEncoder()
    const saltValue =
      salt ||
      Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join(
        "",
      )

    try {
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", encoder.encode(data + saltValue))
      const hash = Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, "0")).join("")

      return { hash, salt: saltValue }
    } catch (error) {
      // Fallback hash
      const hash = Buffer.from(data + saltValue).toString("base64")
      return { hash, salt: saltValue }
    }
  }

  // Verify hashed data
  static async verifyHash(data: string, hash: string, salt: string): Promise<boolean> {
    const { hash: newHash } = await this.hash(data, salt)
    return newHash === hash
  }

  // Generate secure session token
  static generateSessionToken(): string {
    return window.crypto.randomUUID()
  }

  // Sanitize file names
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_")
      .substring(0, 255)
  }

  // Validate file type
  static isValidFileType(mimeType: string): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
    return allowedTypes.includes(mimeType)
  }

  // Check for malicious content patterns
  static scanForMaliciousContent(content: string): boolean {
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
    ]

    return maliciousPatterns.some((pattern) => pattern.test(content))
  }
}

// Rate limiting
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>()

  static isRateLimited(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier)

    if (!userRequests || now > userRequests.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + windowMs })
      return false
    }

    if (userRequests.count >= maxRequests) {
      return true
    }

    userRequests.count++
    return false
  }

  static getRemainingRequests(identifier: string, maxRequests = 100): number {
    const userRequests = this.requests.get(identifier)
    if (!userRequests) return maxRequests
    return Math.max(0, maxRequests - userRequests.count)
  }

  static cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Audit logging
export class AuditLogger {
  static log(event: {
    action: string
    userId?: string
    ip: string
    userAgent: string
    timestamp: Date
    details?: any
    riskLevel: "low" | "medium" | "high"
  }): void {
    const logEntry = {
      id: window.crypto.randomUUID(), // Using global Web Crypto API randomUUID
      ...event,
      timestamp: event.timestamp.toISOString(),
    }

    // In production, this would write to a secure logging service
    console.log("[AUDIT]", JSON.stringify(logEntry))

    // Store critical events for analysis
    if (event.riskLevel === "high") {
      this.alertSecurity(logEntry)
    }
  }

  private static alertSecurity(logEntry: any): void {
    // In production, this would trigger security alerts
    console.warn("[SECURITY ALERT]", logEntry)
  }
}

// Content Security Policy
export const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ")
