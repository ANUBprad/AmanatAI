import { type NextRequest, NextResponse } from "next/server"
import { SecurityUtils, AuditLogger } from "@/lib/security"

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const { question, language = "English", context } = await request.json()

    if (!question) {
      AuditLogger.log({
        action: "qa_no_question",
        ip,
        userAgent,
        timestamp: new Date(),
        riskLevel: "low",
      })
      return NextResponse.json({ error: "No question provided" }, { status: 400 })
    }

    // Security: Check for malicious content in question
    if (SecurityUtils.scanForMaliciousContent(question)) {
      AuditLogger.log({
        action: "qa_malicious_question",
        ip,
        userAgent,
        timestamp: new Date(),
        details: { question: question.substring(0, 100) },
        riskLevel: "high",
      })
      return NextResponse.json({ error: "Invalid question content" }, { status: 400 })
    }

    // Limit question length
    if (question.length > 1000) {
      AuditLogger.log({
        action: "qa_question_too_long",
        ip,
        userAgent,
        timestamp: new Date(),
        details: { questionLength: question.length },
        riskLevel: "medium",
      })
      return NextResponse.json({ error: "Question too long" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock responses based on common questions
    const response = generateMockResponse(question, language)

    // Security: Scan response for malicious content
    if (SecurityUtils.scanForMaliciousContent(response)) {
      AuditLogger.log({
        action: "qa_malicious_response_detected",
        ip,
        userAgent,
        timestamp: new Date(),
        riskLevel: "high",
      })
      return NextResponse.json({ error: "Response generation failed" }, { status: 500 })
    }

    AuditLogger.log({
      action: "qa_success",
      ip,
      userAgent,
      timestamp: new Date(),
      details: {
        language,
        questionLength: question.length,
        responseLength: response.length,
      },
      riskLevel: "low",
    })

    return NextResponse.json({
      success: true,
      answer: response,
      language,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    AuditLogger.log({
      action: "qa_error",
      ip,
      userAgent,
      timestamp: new Date(),
      details: { error: error instanceof Error ? error.message : "Unknown error" },
      riskLevel: "medium",
    })

    console.error("QA error:", error)
    return NextResponse.json({ error: "QA processing failed" }, { status: 500 })
  }
}

function generateMockResponse(question: string, language: string): string {
  const q = question.toLowerCase()

  // Common questions and responses
  if (q.includes("how") && q.includes("upload")) {
    return language === "हिंदी"
      ? "आप अपने दस्तावेज़ को ड्रैग एंड ड्रॉप करके या अपलोड बटन पर क्लिक करके अपलोड कर सकते हैं। हम JPG, PNG और PDF फाइलों को सपोर्ट करते हैं।"
      : "You can upload your document by dragging and dropping it into the upload zone or clicking the upload button. We support JPG, PNG, and PDF files."
  }

  if (q.includes("secure") || q.includes("safe")) {
    return language === "हिंदी"
      ? "हाँ, आपके दस्तावेज़ पूरी तरह से सुरक्षित हैं। हम एंड-टू-एंड एन्क्रिप्शन का उपयोग करते हैं और वेरिफिकेशन के बाद फाइलों को तुरंत डिलीट कर देते हैं।"
      : "Yes, your documents are completely secure. We use end-to-end encryption and automatically delete files after verification."
  }

  if (q.includes("time") || q.includes("long")) {
    return language === "हिंदी"
      ? "दस्तावेज़ वेरिफिकेशन में आमतौर पर 30 सेकंड से 2 मिनट का समय लगता है, फाइल के साइज़ और जटिलता के आधार पर।"
      : "Document verification typically takes 30 seconds to 2 minutes, depending on file size and complexity."
  }

  if (q.includes("support") || q.includes("document")) {
    return language === "हिंदी"
      ? "हम आधार कार्ड, पैन कार्ड, पासपोर्ट, वोटर आईडी और ड्राइविंग लाइसेंस जैसे सभी प्रमुख भारतीय सरकारी दस्तावेज़ों को सपोर्ट करते हैं।"
      : "We support all major Indian government documents including Aadhaar Card, PAN Card, Passport, Voter ID, and Driving License."
  }

  // Default response
  return language === "हिंदी"
    ? "मैं आपकी दस्तावेज़ वेरिफिकेशन में मदद करने के लिए यहाँ हूँ। कृपया अपना प्रश्न और स्पष्ट रूप से पूछें।"
    : "I'm here to help you with document verification. Please feel free to ask me any specific questions about the process."
}
