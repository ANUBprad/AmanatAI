"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Shield,
  Lock,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Upload,
  MessageCircle,
  Moon,
  Sun,
  ChevronRight,
  Zap,
  Eye,
  Globe,
} from "lucide-react"
import { useTheme } from "next-themes"

const languages = ["English", "हिंदी", "বাংলা", "తెలుగు", "मराठी", "தமிழ்", "اردو", "ગુજરાતી"]

const documentTypes = [
  { name: "Aadhaar Card", icon: FileText },
  { name: "PAN Card", icon: FileText },
  { name: "Passport", icon: FileText },
  { name: "Voter ID", icon: FileText },
  { name: "Driving License", icon: FileText },
]

const features = [
  {
    icon: Upload,
    title: "Multi-Format Upload",
    description: "Support for JPG, PNG, and password-protected PDF files",
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description: "End-to-end encryption with no data storage",
  },
  {
    icon: Zap,
    title: "AI-Powered Extraction",
    description: "Google Gemini AI for accurate document analysis",
  },
  {
    icon: Eye,
    title: "Validity Verification",
    description: "Real-time document authenticity checking",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "8 Indian languages with native script support",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "Chat-based Q&A in your preferred language",
  },
]

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Amanat AI</h1>
              <p className="text-xs text-muted-foreground">Secure Document Verification</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Government-Grade Security
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6">
              <span className="text-foreground">Amanat AI</span>
              <br />
              <span className="text-primary">Simple. Secure. Smarter.</span>
            </h1>

            <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
              AI-powered verification for Indian government documents. Upload, verify, and validate your Aadhaar, PAN,
              Passport, and more with military-grade security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/upload">
                <Button size="lg" className="px-8 py-6 text-lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Document Securely
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg bg-transparent">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Try AI Assistant
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                End-to-End Encrypted
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                No Data Storage
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                GDPR Compliant
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Supported Documents */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Supported Documents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Verify all major Indian government-issued documents with AI-powered accuracy
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {documentTypes.map((doc, index) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-border/50">
                  <doc.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm text-foreground">{doc.name}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Advanced AI Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powered by Google Gemini AI with enterprise-grade security and multilingual support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow border-border/50">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Status Demo */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Instant Verification Results</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get immediate feedback on document authenticity with clear status indicators
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-accent/50 bg-accent/5">
              <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Valid Document</h3>
              <p className="text-sm text-muted-foreground">Document is authentic and verified</p>
            </Card>

            <Card className="p-6 text-center border-destructive/50 bg-destructive/5">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Invalid Document</h3>
              <p className="text-sm text-muted-foreground">Document failed verification checks</p>
            </Card>

            <Card className="p-6 text-center border-yellow-500/50 bg-yellow-500/5">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Expired Document</h3>
              <p className="text-sm text-muted-foreground">Document is past its validity date</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Amanat AI</h3>
              <p className="text-sm text-muted-foreground">Secure Document Verification</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            Developed by <span className="font-semibold text-foreground">Backend Brigades</span> | Powered by{" "}
            <span className="font-semibold text-primary">Google Cloud Gemini AI</span>
          </p>

          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Security
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
