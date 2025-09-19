"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Shield,
  Upload,
  FileText,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowLeft,
  Scan,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { DocumentAPI, type ExtractedData, type VerificationResult } from "@/lib/api"

interface UploadedFile {
  file: File
  preview: string
  isPasswordProtected?: boolean
  extractedData?: ExtractedData
  verificationResult?: VerificationResult
  status?: "valid" | "invalid" | "expired"
  verificationId?: string
}

export default function UploadPage() {
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [processingStage, setProcessingStage] = useState("")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const uploadResult = await DocumentAPI.uploadFile(file)

        const newFile: UploadedFile = {
          file,
          preview: URL.createObjectURL(file),
          isPasswordProtected: uploadResult.isPasswordProtected,
        }

        setUploadedFiles((prev) => [...prev, newFile])

        if (uploadResult.isPasswordProtected) {
          setCurrentFile(file)
          setShowPasswordModal(true)
        } else {
          await processFile(newFile, uploadResult.base64Data)
        }
      } catch (error) {
        console.error("Upload error:", error)
        // Handle error appropriately
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const processFile = async (fileData: UploadedFile, base64Data: string) => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStage("Uploading document...")

    try {
      // Simulate processing stages with real API calls
      const stages = [
        "Uploading document...",
        "Scanning for security features...",
        "Extracting text with AI...",
        "Verifying authenticity...",
        "Checking validity dates...",
        "Finalizing results...",
      ]

      for (let i = 0; i < stages.length; i++) {
        setProcessingStage(stages[i])
        setProcessingProgress((i + 1) * (100 / stages.length))
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      const extractionResult = await DocumentAPI.extractData(base64Data, fileData.file.type, fileData.file.name)

      const verificationResult = await DocumentAPI.verifyDocument(
        extractionResult.extractedData,
        extractionResult.extractedData.documentType,
      )

      const verificationId = `result_${Date.now()}`

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === fileData.file
            ? {
                ...f,
                extractedData: extractionResult.extractedData,
                verificationResult: verificationResult.verification,
                status: verificationResult.status,
                verificationId,
              }
            : f,
        ),
      )

      // Auto-redirect to results page after processing
      setTimeout(() => {
        router.push(`/results/${verificationId}`)
      }, 2000)
    } catch (error) {
      console.error("Processing error:", error)
      // Handle error appropriately
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
      setProcessingStage("")
    }
  }

  const handlePasswordSubmit = async () => {
    if (currentFile && password) {
      try {
        const uploadResult = await DocumentAPI.uploadFile(currentFile, password)
        const fileData = uploadedFiles.find((f) => f.file === currentFile)
        if (fileData) {
          await processFile(fileData, uploadResult.base64Data)
        }
      } catch (error) {
        console.error("Password unlock error:", error)
      }

      setShowPasswordModal(false)
      setPassword("")
      setCurrentFile(null)
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "invalid":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "expired":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "valid":
        return <CheckCircle className="h-5 w-5 text-accent" />
      default:
        return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "invalid":
        return <Badge variant="destructive">Invalid</Badge>
      case "expired":
        return <Badge className="bg-yellow-500 text-white">Expired</Badge>
      case "valid":
        return <Badge className="bg-accent text-accent-foreground">Valid</Badge>
      default:
        return <Badge variant="outline">Processing...</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Document Upload</h1>
                <p className="text-xs text-muted-foreground">Secure AI Verification</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Upload Zone */}
          <Card className="mb-8">
            <div className="p-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <input {...getInputProps()} />
                <motion.div animate={isDragActive ? { scale: 1.05 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                  <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isDragActive ? "Drop files here" : "Upload Your Documents"}
                  </h3>
                  <p className="text-muted-foreground mb-4">Drag and drop your files here, or click to browse</p>
                  <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">JPG</Badge>
                    <Badge variant="outline">PNG</Badge>
                    <Badge variant="outline">PDF</Badge>
                    <Badge variant="outline">Max 10MB</Badge>
                  </div>
                </motion.div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Secure Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Your documents are processed with end-to-end encryption and automatically deleted after
                      verification. No data is stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Processing Status */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <Scan className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Processing Document</h3>
                      <p className="text-sm text-muted-foreground">{processingStage}</p>
                    </div>
                  </div>
                  <Progress value={processingProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground text-center">{processingProgress.toFixed(0)}% Complete</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Uploaded Files */}
          <div className="space-y-6">
            {uploadedFiles.map((fileData, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{fileData.file.name}</h3>
                        {fileData.isPasswordProtected && (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Password Protected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB • {fileData.file.type}
                      </p>

                      {fileData.extractedData && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(fileData.status)}
                            <span className="font-semibold text-foreground">Verification Complete</span>
                            {getStatusBadge(fileData.status)}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Name</Label>
                                <p className="font-medium text-foreground">{fileData.extractedData.name}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">ID Number</Label>
                                <p className="font-medium text-foreground">{fileData.extractedData.idNumber}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Document Type</Label>
                                <p className="font-medium text-foreground">{fileData.extractedData.documentType}</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Issuing Authority</Label>
                                <p className="font-medium text-foreground">{fileData.extractedData.issuingAuthority}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                                <p className="font-medium text-foreground">{fileData.extractedData.dateOfExpiry}</p>
                              </div>
                            </div>
                          </div>

                          {fileData.verificationId && (
                            <div className="mt-4">
                              <Link href={`/results/${fileData.verificationId}`}>
                                <Button className="w-full">View Detailed Results</Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Password Protected PDF
            </DialogTitle>
            <DialogDescription>
              This PDF is password protected. Please enter the password to unlock and process the document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Document Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit} disabled={!password}>
                <Lock className="h-4 w-4 mr-2" />
                Unlock & Process
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
