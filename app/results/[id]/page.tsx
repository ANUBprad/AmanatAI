"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Share2,
  FileText,
  Calendar,
  MapPin,
  User,
  Hash,
  Building,
  Eye,
  Lock,
  Zap,
  Clock,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AppHeader } from "@/components/app-header"

interface VerificationData {
  id: string
  documentType: string
  fileName: string
  extractedData: {
    name: string
    idNumber: string
    documentType: string
    issuingAuthority: string
    dateOfIssue: string
    dateOfExpiry: string
    address: string
    confidence: number
  }
  verification: {
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
  status: "valid" | "invalid" | "expired"
  processingTime: string
}

export default function ResultsPage() {
  const params = useParams()
  const [data, setData] = useState<VerificationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading verification data
    setTimeout(() => {
      setData({
        id: params.id as string,
        documentType: "PAN Card",
        fileName: "pan_card_sample.pdf",
        extractedData: {
          name: "Rajesh Kumar Singh",
          idNumber: "ABCDE1234F",
          documentType: "PAN Card",
          issuingAuthority: "Income Tax Department",
          dateOfIssue: "2020-03-15",
          dateOfExpiry: "2030-03-14",
          address: "123 Main Street, Mumbai, Maharashtra 400001",
          confidence: 0.95,
        },
        verification: {
          isValid: true,
          isExpired: false,
          isAuthentic: true,
          securityFeatures: {
            hologram: true,
            watermark: true,
            microtext: true,
            digitalSignature: true,
          },
          riskScore: 0.15,
          verificationTimestamp: new Date().toISOString(),
          verificationId: `VER_${Date.now()}`,
        },
        status: "valid",
        processingTime: "2.3s",
      })
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "text-accent"
      case "expired":
        return "text-yellow-500"
      case "invalid":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-8 w-8 text-accent" />
      case "expired":
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />
      case "invalid":
        return <XCircle className="h-8 w-8 text-destructive" />
      default:
        return <AlertTriangle className="h-8 w-8 text-muted-foreground" />
    }
  }

  const getRiskLevel = (score: number) => {
    if (score < 0.3) return { level: "Low", color: "text-accent" }
    if (score < 0.7) return { level: "Medium", color: "text-yellow-500" }
    return { level: "High", color: "text-destructive" }
  }

  const downloadReport = () => {
    // Simulate report download
    const reportData = {
      verificationId: data?.verification.verificationId,
      timestamp: data?.verification.verificationTimestamp,
      status: data?.status,
      documentType: data?.documentType,
      extractedData: data?.extractedData,
      verification: data?.verification,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `verification_report_${data?.verification.verificationId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading verification results...</p>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Results Not Found</h2>
          <p className="text-muted-foreground mb-4">The verification results could not be loaded.</p>
          <Link href="/upload">
            <Button>Upload New Document</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const riskLevel = getRiskLevel(data.verification.riskScore)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader
        title="Verification Results"
        subtitle={`ID: ${data.verification.verificationId}`}
        showBackButton={true}
        backHref="/upload"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex justify-end gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Status Overview */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getStatusIcon(data.status)}
                  <div>
                    <h2 className="text-3xl font-bold text-foreground capitalize">{data.status} Document</h2>
                    <p className="text-muted-foreground">
                      {data.status === "valid" && "Document is authentic and verified"}
                      {data.status === "expired" && "Document is authentic but expired"}
                      {data.status === "invalid" && "Document failed verification checks"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={data.status === "valid" ? "default" : "destructive"}
                  className={`px-4 py-2 text-lg ${
                    data.status === "valid"
                      ? "bg-accent text-accent-foreground"
                      : data.status === "expired"
                        ? "bg-yellow-500 text-white"
                        : ""
                  }`}
                >
                  {data.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mx-auto mb-2">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Processing Time</p>
                  <p className="font-semibold text-foreground">{data.processingTime}</p>
                </div>
                <div className="text-center">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mx-auto mb-2">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Confidence Score</p>
                  <p className="font-semibold text-foreground">{(data.extractedData.confidence * 100).toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mx-auto mb-2">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <p className={`font-semibold ${riskLevel.color}`}>{riskLevel.level}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Extracted Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Extracted Information</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{data.extractedData.name}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">ID Number</p>
                    <p className="font-medium text-foreground font-mono">{data.extractedData.idNumber}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Issuing Authority</p>
                    <p className="font-medium text-foreground">{data.extractedData.issuingAuthority}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(data.extractedData.dateOfIssue).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(data.extractedData.dateOfExpiry).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground">{data.extractedData.address}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Security Features */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Security Features</h3>
              </div>

              <div className="space-y-4">
                {Object.entries(data.verification.securityFeatures).map(([feature, detected]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {detected ? (
                        <CheckCircle className="h-4 w-4 text-accent" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-foreground capitalize">{feature.replace(/([A-Z])/g, " $1").trim()}</span>
                    </div>
                    <Badge variant={detected ? "default" : "outline"} className={detected ? "bg-accent" : ""}>
                      {detected ? "Detected" : "Not Found"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Risk Assessment */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Risk Assessment</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <span className={`font-semibold ${riskLevel.color}`}>
                      {(data.verification.riskScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={data.verification.riskScore * 100}
                    className="h-2"
                    // @ts-ignore
                    style={{
                      "--progress-background":
                        data.verification.riskScore < 0.3
                          ? "hsl(var(--accent))"
                          : data.verification.riskScore < 0.7
                            ? "hsl(45 93% 47%)"
                            : "hsl(var(--destructive))",
                    }}
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-2">Assessment Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {data.verification.riskScore < 0.3 &&
                      "This document shows strong indicators of authenticity with minimal risk factors detected."}
                    {data.verification.riskScore >= 0.3 &&
                      data.verification.riskScore < 0.7 &&
                      "This document shows some risk factors that require additional verification."}
                    {data.verification.riskScore >= 0.7 &&
                      "This document shows significant risk factors and may require manual review."}
                  </p>
                </div>
              </div>
            </Card>

            {/* Verification Details */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Verification Details</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification ID</span>
                  <span className="font-mono text-foreground">{data.verification.verificationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="text-foreground">
                    {new Date(data.verification.verificationTimestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Document Type</span>
                  <span className="text-foreground">{data.extractedData.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Name</span>
                  <span className="text-foreground">{data.fileName}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/upload">
              <Button size="lg" className="px-8">
                Verify Another Document
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={downloadReport} className="px-8 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
