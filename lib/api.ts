export interface ExtractedData {
  name: string
  idNumber: string
  documentType: string
  issuingAuthority: string
  purpose: string
  dateOfIssue: string
  dateOfExpiry: string
  address: string
  confidence: number
}

export interface VerificationResult {
  isValid: boolean
  isExpired: boolean
  isAuthentic: boolean
  securityFeatures: {
    hologram: boolean
    watermark: boolean
    microtext: boolean
    digitalSignature: boolean
  }
  riskScore: number
  verificationTimestamp: string
  verificationId: string
}

export interface UploadResponse {
  success: boolean
  fileId: string
  fileName: string
  fileSize: number
  fileType: string
  isPasswordProtected: boolean
  base64Data: string
}

export interface ExtractionResponse {
  success: boolean
  extractedData: ExtractedData
  processingTime: string
}

export interface VerificationResponse {
  success: boolean
  verification: VerificationResult
  status: "valid" | "invalid" | "expired"
  message: string
}

export interface QAResponse {
  success: boolean
  answer: string
  language: string
  timestamp: string
}

export class DocumentAPI {
  static async uploadFile(file: File, password?: string): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append("file", file)
    if (password) {
      formData.append("password", password)
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Upload failed")
    }

    return response.json()
  }

  static async extractData(base64Data: string, fileType: string, fileName: string): Promise<ExtractionResponse> {
    const response = await fetch("/api/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ base64Data, fileType, fileName }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Extraction failed")
    }

    return response.json()
  }

  static async verifyDocument(extractedData: ExtractedData, documentType: string): Promise<VerificationResponse> {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ extractedData, documentType }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Verification failed")
    }

    return response.json()
  }

  static async askQuestion(question: string, language = "English", context?: any): Promise<QAResponse> {
    const response = await fetch("/api/qa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, language, context }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "QA processing failed")
    }

    return response.json()
  }
}
