import { type NextRequest, NextResponse } from "next/server"
import { AuditLogger } from "@/lib/security"

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const { extractedData, documentType } = await request.json()

    if (!extractedData) {
      AuditLogger.log({
        action: "verify_no_data",
        ip,
        userAgent,
        timestamp: new Date(),
        riskLevel: "low",
      })
      return NextResponse.json({ error: "No data to verify" }, { status: 400 })
    }

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock verification logic with security considerations
    const verificationResult = {
      isValid: Math.random() > 0.2, // 80% chance of being valid
      isExpired: checkIfExpired(extractedData.dateOfExpiry),
      isAuthentic: Math.random() > 0.1, // 90% chance of being authentic
      securityFeatures: {
        hologram: Math.random() > 0.3,
        watermark: Math.random() > 0.2,
        microtext: Math.random() > 0.4,
        digitalSignature: Math.random() > 0.1,
      },
      riskScore: Math.random() * 0.3, // Low risk score (0-0.3)
      verificationTimestamp: new Date().toISOString(),
      verificationId: `VER_${Date.now()}`,
    }

    // Determine overall status
    let status = "valid"
    let riskLevel: "low" | "medium" | "high" = "low"

    if (!verificationResult.isValid || !verificationResult.isAuthentic) {
      status = "invalid"
      riskLevel = "high"
    } else if (verificationResult.isExpired) {
      status = "expired"
      riskLevel = "medium"
    }

    AuditLogger.log({
      action: "verify_complete",
      ip,
      userAgent,
      timestamp: new Date(),
      details: {
        documentType,
        status,
        verificationId: verificationResult.verificationId,
        riskScore: verificationResult.riskScore,
      },
      riskLevel,
    })

    return NextResponse.json({
      success: true,
      verification: verificationResult,
      status,
      message: getStatusMessage(status),
    })
  } catch (error) {
    AuditLogger.log({
      action: "verify_error",
      ip,
      userAgent,
      timestamp: new Date(),
      details: { error: error instanceof Error ? error.message : "Unknown error" },
      riskLevel: "medium",
    })

    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

function checkIfExpired(expiryDate: string): boolean {
  if (!expiryDate) return false

  const expiry = new Date(expiryDate)
  const now = new Date()

  return expiry < now
}

function getStatusMessage(status: string): string {
  switch (status) {
    case "valid":
      return "Document is authentic and valid"
    case "invalid":
      return "Document failed verification checks"
    case "expired":
      return "Document is authentic but expired"
    default:
      return "Verification status unknown"
  }
}
