import crypto from "crypto"

// Encryption utilities
export class SecurityUtils {
  private static readonly ALGORITHM = "aes-256-gcm"
  private static readonly KEY_LENGTH = 32
  private static readonly IV_LENGTH = 16
  private static readonly TAG_LENGTH = 16

  // Generate a secure random key
  static generateKey(): string {
    return crypto.randomBytes(this.KEY_LENGTH).toString("hex")
  }

  // Encrypt data with AES-256-GCM
  static encrypt(data: string, key: string): { encrypted: string; iv: string; tag: string } {
    const keyBuffer = Buffer.from(key, "hex")
    const iv = crypto.randomBytes(this.IV_LENGTH)
    const cipher = crypto.createCipher(this.ALGORITHM, keyBuffer)
    cipher.setAAD(Buffer.from("amanat-ai", "utf8"))

    let encrypted = cipher.update(data, "utf8", "hex")
    encrypted += cipher.final("hex")

    const tag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
    }
  }

  // Decrypt data with AES-256-GCM
  static decrypt(encryptedData: string, key: string, iv: string, tag: string): string {
    const keyBuffer = Buffer.from(key, "hex")
    const ivBuffer = Buffer.from(iv, "hex")
    const tagBuffer = Buffer.from(tag, "hex")

    const decipher = crypto.createDecipher(this.ALGORITHM, keyBuffer)
    decipher.setAAD(Buffer.from("amanat-ai", "utf8"))
    decipher.setAuthTag(tagBuffer)

    let decrypted = decipher.update(encryptedData, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  // Hash sensitive data
  static hash(data: string, salt?: string): { hash: string; salt: string } {
    const saltBuffer = salt ? Buffer.from(salt, "hex") : crypto.randomBytes(16)
    const hash = crypto.pbkdf2Sync(data, saltBuffer, 100000, 64, "sha512")

    return {
      hash: hash.toString("hex"),
      salt: saltBuffer.toString("hex"),
    }
  }

  // Verify hashed data
  static verifyHash(data: string, hash: string, salt: string): boolean {
    const { hash: newHash } = this.hash(data, salt)
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(newHash, "hex"))
  }

  // Generate secure session token
  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex")
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
      id: crypto.randomUUID(),
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
