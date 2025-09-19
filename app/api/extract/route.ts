import { type NextRequest, NextResponse } from "next/server"
import { SecurityUtils, AuditLogger } from "@/lib/security"

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const { base64Data, fileType, fileName, encryptionKey } = await request.json()

    if (!base64Data) {
      AuditLogger.log({
        action: "extract_no_data",
        ip,
        userAgent,
        timestamp: new Date(),
        riskLevel: "low",
      })
      return NextResponse.json({ error: "No file data provided" }, { status: 400 })
    }

    // Validate file type again
    if (!SecurityUtils.isValidFileType(fileType)) {
      AuditLogger.log({
        action: "extract_invalid_file_type",
        ip,
        userAgent,
        timestamp: new Date(),
        details: { fileType, fileName },
        riskLevel: "medium",
      })
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // In production, decrypt the data here
    // const decryptedData = SecurityUtils.decrypt(base64Data, encryptionKey, iv, tag);

    // Sanitize extracted data
    const mockExtractedData = {
      name: SecurityUtils.sanitizeFileName("Rajesh Kumar Singh"),
      idNumber: generateMockId(fileName),
      documentType: detectDocumentType(fileName),
      issuingAuthority: getIssuingAuthority(fileName),
      purpose: "Identity Verification",
      dateOfIssue: "2020-03-15",
      dateOfExpiry: "2030-03-14",
      address: "123 Main Street, Mumbai, Maharashtra 400001",
      confidence: 0.95,
    }

    // Validate extracted data
    if (SecurityUtils.scanForMaliciousContent(JSON.stringify(mockExtractedData))) {
      AuditLogger.log({
        action: "extract_malicious_data_detected",
        ip,
        userAgent,
        timestamp: new Date(),
        details: { fileName },
        riskLevel: "high",
      })
      return NextResponse.json({ error: "Malicious content detected in extracted data" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    AuditLogger.log({
      action: "extract_success",
      ip,
      userAgent,
      timestamp: new Date(),
      details: {
        fileName,
        documentType: mockExtractedData.documentType,
        confidence: mockExtractedData.confidence,
      },
      riskLevel: "low",
    })

    return NextResponse.json({
      success: true,
      extractedData: mockExtractedData,
      processingTime: "2.3s",
    })
  } catch (error) {
    AuditLogger.log({
      action: "extract_error",
      ip,
      userAgent,
      timestamp: new Date(),
      details: { error: error instanceof Error ? error.message : "Unknown error" },
      riskLevel: "medium",
    })

    console.error("Extraction error:", error)
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 })
  }
}

function generateMockId(fileName: string): string {
  const docType = detectDocumentType(fileName).toLowerCase()

  if (docType.includes("pan")) {
    return "ABCDE1234F"
  } else if (docType.includes("aadhaar")) {
    return "1234 5678 9012"
  } else if (docType.includes("passport")) {
    return "A1234567"
  } else if (docType.includes("voter")) {
    return "ABC1234567"
  } else if (docType.includes("driving")) {
    return "MH0120200012345"
  }

  return "DOC123456789"
}

function detectDocumentType(fileName: string): string {
  const name = fileName.toLowerCase()

  if (name.includes("pan")) return "PAN Card"
  if (name.includes("aadhaar") || name.includes("aadhar")) return "Aadhaar Card"
  if (name.includes("passport")) return "Passport"
  if (name.includes("voter")) return "Voter ID Card"
  if (name.includes("driving") || name.includes("license")) return "Driving License"

  return "Government Document"
}

function getIssuingAuthority(fileName: string): string {
  const docType = detectDocumentType(fileName)

  switch (docType) {
    case "PAN Card":
      return "Income Tax Department"
    case "Aadhaar Card":
      return "Unique Identification Authority of India (UIDAI)"
    case "Passport":
      return "Ministry of External Affairs"
    case "Voter ID Card":
      return "Election Commission of India"
    case "Driving License":
      return "Regional Transport Office (RTO)"
    default:
      return "Government of India"
  }
}
