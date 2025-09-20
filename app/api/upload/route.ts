import { type NextRequest, NextResponse } from "next/server"
import { SecurityUtils, AuditLogger } from "@/lib/security"

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string

    if (!file) {
      AuditLogger.log({
        action: "upload_no_file",
        ip,
        userAgent,
        timestamp: new Date(),
        riskLevel: "low",
      })
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Security validations
    if (!SecurityUtils.isValidFileType(file.type)) {
      AuditLogger.log({
        action: "upload_invalid_file_type",
        ip,
        userAgent,
        timestamp: new Date(),
        details: { fileType: file.type, fileName: file.name },
        riskLevel: "medium",
      })
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      AuditLogger.log({
        action: "upload_file_too_large",
        ip,
        userAgent,
        timestamp: new Date(),
        details: { fileSize: file.size, fileName: file.name },
        riskLevel: "medium",
      })
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Sanitize file name
    const sanitizedFileName = SecurityUtils.sanitizeFileName(file.name)

    // Convert file to buffer and scan for malicious content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Basic malicious content detection for text-based files
    if (file.type.startsWith("text/")) {
      const content = buffer.toString("utf8")
      if (SecurityUtils.scanForMaliciousContent(content)) {
        AuditLogger.log({
          action: "upload_malicious_content_detected",
          ip,
          userAgent,
          timestamp: new Date(),
          details: { fileName: sanitizedFileName },
          riskLevel: "high",
        })
        return NextResponse.json({ error: "Malicious content detected" }, { status: 400 })
      }
    }

    // Encrypt file data
    const encryptionKey = SecurityUtils.generateKey()
    const base64Data = buffer.toString("base64")
    const encryptedData = SecurityUtils.encrypt(base64Data, encryptionKey)

    // Check if PDF is password protected
    let isPasswordProtected = false
    if (file.type === "application/pdf") {
      // More accurate password protection detection
      // Check for specific PDF encryption markers and user/owner password flags
      const pdfContent = buffer.toString("binary")

      // Look for encryption dictionary and user password requirements
      const hasEncryptDict = pdfContent.includes("/Encrypt")
      const hasUserPassword = pdfContent.includes("/U ") || pdfContent.includes("/UE ")
      const hasOwnerPassword = pdfContent.includes("/O ") || pdfContent.includes("/OE ")

      // Only consider it password protected if it has encryption AND user/owner password entries
      isPasswordProtected = hasEncryptDict && (hasUserPassword || hasOwnerPassword)

      // Additional check: try to detect if the PDF actually requires a password to open
      // This is a more conservative approach - only require password if we're confident it's needed
      if (isPasswordProtected) {
        // Check if the PDF has content that suggests it's actually encrypted
        const hasEncryptedContent = pdfContent.includes("/Filter") && pdfContent.includes("/Length")
        isPasswordProtected = hasEncryptedContent
      }

      if (isPasswordProtected && !password) {
        AuditLogger.log({
          action: "upload_password_required",
          ip,
          userAgent,
          timestamp: new Date(),
          details: { fileName: sanitizedFileName },
          riskLevel: "low",
        })
        return NextResponse.json(
          {
            error: "Password required",
            isPasswordProtected: true,
          },
          { status: 400 },
        )
      }

      if (password) {
        // Hash the password for security
        const { hash: passwordHash } = SecurityUtils.hash(password)
        AuditLogger.log({
          action: "upload_password_provided",
          ip,
          userAgent,
          timestamp: new Date(),
          details: { fileName: sanitizedFileName, passwordHash },
          riskLevel: "low",
        })
      }
    }

    // Generate secure file ID
    const fileId = SecurityUtils.generateSessionToken()

    AuditLogger.log({
      action: "upload_success",
      ip,
      userAgent,
      timestamp: new Date(),
      details: {
        fileId,
        fileName: sanitizedFileName,
        fileSize: file.size,
        fileType: file.type,
        isPasswordProtected,
      },
      riskLevel: "low",
    })

    return NextResponse.json({
      success: true,
      fileId,
      fileName: sanitizedFileName,
      fileSize: file.size,
      fileType: file.type,
      isPasswordProtected,
      base64Data: base64Data, // In production, this would be the encrypted data
      encryptionKey, // In production, this would be stored securely
    })
  } catch (error) {
    AuditLogger.log({
      action: "upload_error",
      ip,
      userAgent,
      timestamp: new Date(),
      details: { error: error instanceof Error ? error.message : "Unknown error" },
      riskLevel: "medium",
    })

    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
