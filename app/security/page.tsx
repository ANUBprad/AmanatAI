"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Lock,
  Eye,
  Server,
  Key,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Zap,
  Globe,
  Clock,
} from "lucide-react"
import Link from "next/link"

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted using AES-256-GCM encryption before transmission and processing.",
    status: "active",
  },
  {
    icon: Shield,
    title: "Zero Data Storage",
    description: "Documents are automatically deleted after processing. No personal data is stored on our servers.",
    status: "active",
  },
  {
    icon: Key,
    title: "Secure Key Management",
    description: "Encryption keys are generated per session and never stored or logged.",
    status: "active",
  },
  {
    icon: Eye,
    title: "Privacy Protection",
    description: "No tracking, no analytics on personal data, and no third-party data sharing.",
    status: "active",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime guarantee.",
    status: "active",
  },
  {
    icon: FileCheck,
    title: "Content Scanning",
    description: "Advanced malware and malicious content detection before processing.",
    status: "active",
  },
]

const complianceStandards = [
  {
    name: "GDPR Compliant",
    description: "Full compliance with European data protection regulations",
    verified: true,
  },
  {
    name: "ISO 27001",
    description: "Information security management system certification",
    verified: true,
  },
  {
    name: "SOC 2 Type II",
    description: "Security, availability, and confidentiality controls",
    verified: true,
  },
  {
    name: "India IT Act 2000",
    description: "Compliance with Indian information technology laws",
    verified: true,
  },
]

const securityMetrics = [
  {
    icon: Zap,
    label: "Processing Speed",
    value: "< 2 minutes",
    description: "Average document verification time",
  },
  {
    icon: Shield,
    label: "Security Score",
    value: "A+",
    description: "Industry-leading security rating",
  },
  {
    icon: Globe,
    label: "Data Centers",
    value: "3 Regions",
    description: "Distributed infrastructure for reliability",
  },
  {
    icon: Clock,
    label: "Uptime",
    value: "99.9%",
    description: "Service availability guarantee",
  },
]

export default function SecurityPage() {
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
                <h1 className="text-xl font-bold text-foreground">Security & Privacy</h1>
                <p className="text-xs text-muted-foreground">Government-Grade Protection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Military-Grade Security
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Security is Our <span className="text-primary">Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We implement the highest standards of security and privacy protection to ensure your sensitive documents
              are processed safely and securely.
            </p>
          </motion.div>

          {/* Security Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-4 gap-6 mb-16"
          >
            {securityMetrics.map((metric, index) => (
              <Card key={metric.label} className="p-6 text-center">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mx-auto mb-4">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="font-semibold text-foreground mb-2">{metric.label}</div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </Card>
            ))}
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Security Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="p-6 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                        <feature.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{feature.title}</h3>
                          <CheckCircle className="h-4 w-4 text-accent" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Compliance Standards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Compliance & Certifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {complianceStandards.map((standard, index) => (
                <Card key={standard.name} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <CheckCircle className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{standard.name}</h3>
                      <p className="text-sm text-muted-foreground">{standard.description}</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground ml-auto">Verified</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Security Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How We Protect Your Data</h2>
            <Card className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 w-fit mx-auto mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">1. Secure Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Documents are encrypted immediately upon upload using military-grade AES-256 encryption.
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 w-fit mx-auto mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">2. AI Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Data is processed in secure, isolated environments with no human access to your documents.
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 w-fit mx-auto mb-4">
                    <FileCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">3. Automatic Deletion</h3>
                  <p className="text-sm text-muted-foreground">
                    All documents and extracted data are permanently deleted within minutes of processing completion.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Security Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <Card className="p-8 bg-accent/5 border-accent/20">
              <AlertTriangle className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Security Concerns?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you have any security concerns or questions about our data protection practices, our security team is
                here to help.
              </p>
              <Button size="lg" className="px-8">
                Contact Security Team
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
