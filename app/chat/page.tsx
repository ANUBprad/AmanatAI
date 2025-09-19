"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Shield,
  MessageCircle,
  Send,
  ArrowLeft,
  Bot,
  User,
  Loader2,
  Globe,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react"
import Link from "next/link"
import { DocumentAPI } from "@/lib/api"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  language: string
}

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
]

const quickQuestions = {
  en: [
    "How do I upload a document?",
    "Is my data secure?",
    "What documents are supported?",
    "How long does verification take?",
  ],
  hi: ["मैं दस्तावेज़ कैसे अपलोड करूं?", "क्या मेरा डेटा सुरक्षित है?", "कौन से दस्तावेज़ समर्थित हैं?", "वेरिफिकेशन में कितना समय लगता है?"],
  bn: ["আমি কীভাবে একটি নথি আপলোড করব?", "আমার ডেটা কি নিরাপদ?", "কোন নথিগুলি সমর্থিত?", "যাচাইকরণে কত সময় লাগে?"],
  te: ["నేను డాక్యుమెంట్‌ను ఎలా అప్‌లోడ్ చేయాలి?", "నా డేటా సురక్షితంగా ఉందా?", "ఏ డాక్యుమెంట్‌లు మద్దతు ఇవ్వబడతాయి?", "వెరిఫికేషన్‌కు ఎంత సమయం పడుతుంది?"],
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: "welcome",
      content: getWelcomeMessage(selectedLanguage),
      sender: "assistant",
      timestamp: new Date(),
      language: selectedLanguage,
    }
    setMessages([welcomeMessage])
  }, [selectedLanguage])

  const getWelcomeMessage = (lang: string) => {
    const welcomeMessages = {
      en: "Hello! I'm your AI assistant for document verification. I can help you with questions about uploading, verifying, and understanding your documents. How can I assist you today?",
      hi: "नमस्ते! मैं दस्तावेज़ सत्यापन के लिए आपका AI सहायक हूँ। मैं आपको अपलोड, सत्यापन और आपके दस्तावेज़ों को समझने में मदद कर सकता हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
      bn: "হ্যালো! আমি নথি যাচাইকরণের জন্য আপনার AI সহায়ক। আমি আপলোড, যাচাইকরণ এবং আপনার নথিগুলি বোঝার বিষয়ে প্রশ্নে সাহায্য করতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      te: "హలో! నేను డాక్యుమెంట్ వెరిఫికేషన్ కోసం మీ AI అసిస్టెంట్. అప్‌లోడ్, వెరిఫికేషన్ మరియు మీ డాక్యుమెంట్‌లను అర్థం చేసుకోవడంలో నేను మీకు సహాయం చేయగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    }
    return welcomeMessages[lang as keyof typeof welcomeMessages] || welcomeMessages.en
  }

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputMessage.trim()
    if (!messageContent || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
      language: selectedLanguage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await DocumentAPI.askQuestion(messageContent, getLanguageName(selectedLanguage))

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response.answer,
        sender: "assistant",
        timestamp: new Date(),
        language: selectedLanguage,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Text-to-speech for assistant response
      if (isSpeaking) {
        speakText(response.answer, selectedLanguage)
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: getErrorMessage(selectedLanguage),
        sender: "assistant",
        timestamp: new Date(),
        language: selectedLanguage,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (lang: string) => {
    const errorMessages = {
      en: "I apologize, but I'm having trouble processing your request right now. Please try again.",
      hi: "मुझे खेद है, लेकिन मुझे अभी आपके अनुरोध को संसाधित करने में परेशानी हो रही है। कृपया पुनः प्रयास करें।",
      bn: "আমি দুঃখিত, কিন্তু আমি এখন আপনার অনুরোধ প্রক্রিয়া করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      te: "క్షమించండి, కానీ నేను ఇప్పుడు మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో ఇబ్బంది పడుతున్నాను. దయచేసి మళ్లీ ప్రయత్నించండి।",
    }
    return errorMessages[lang as keyof typeof errorMessages] || errorMessages.en
  }

  const getLanguageName = (code: string) => {
    const lang = languages.find((l) => l.code === code)
    return lang?.name || "English"
  }

  const speakText = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === "hi" ? "hi-IN" : lang === "bn" ? "bn-IN" : "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = selectedLanguage === "hi" ? "hi-IN" : selectedLanguage === "bn" ? "bn-IN" : "en-US"
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
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
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Assistant</h1>
                <p className="text-xs text-muted-foreground">Multilingual Document Help</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={isSpeaking ? "text-primary" : ""}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col h-full">
          {/* Messages */}
          <ScrollArea className="flex-1 mb-6">
            <div className="space-y-4 pb-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          message.sender === "user"
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-accent/10 border border-accent/20"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="h-5 w-5 text-primary" />
                        ) : (
                          <Bot className="h-5 w-5 text-accent" />
                        )}
                      </div>
                      <Card
                        className={`p-4 ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border-border/50"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                      <Bot className="h-5 w-5 text-accent" />
                    </div>
                    <Card className="p-4 bg-card border-border/50">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <p className="text-sm text-muted-foreground">Thinking...</p>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {(quickQuestions[selectedLanguage as keyof typeof quickQuestions] || quickQuestions.en).map(
                  (question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(question)}
                      className="text-xs bg-transparent"
                    >
                      {question}
                    </Button>
                  ),
                )}
              </div>
            </motion.div>
          )}

          {/* Input Area */}
          <Card className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedLanguage === "hi"
                      ? "अपना प्रश्न यहाँ टाइप करें..."
                      : selectedLanguage === "bn"
                        ? "এখানে আপনার প্রশ্ন টাইপ করুন..."
                        : selectedLanguage === "te"
                          ? "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి..."
                          : "Type your question here..."
                  }
                  disabled={isLoading}
                  className="pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={startListening}
                  disabled={isLoading || isListening}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 ${isListening ? "text-primary animate-pulse" : ""}`}
                >
                  {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={() => handleSendMessage()} disabled={!inputMessage.trim() || isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="mt-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <p className="text-xs text-muted-foreground">
                  {selectedLanguage === "hi"
                    ? "आपकी बातचीत एन्क्रिप्टेड और सुरक्षित है। कोई व्यक्तिगत जानकारी संग्रहीत नहीं की जाती।"
                    : selectedLanguage === "bn"
                      ? "আপনার কথোপকথন এনক্রিপ্ট করা এবং নিরাপদ। কোনো ব্যক্তিগত তথ্য সংরক্ষণ করা হয় না।"
                      : selectedLanguage === "te"
                        ? "మీ సంభాషణ ఎన్‌క్రిప్ట్ చేయబడింది మరియు సురక్షితం. వ్యక్తిగత సమాచారం నిల్వ చేయబడదు."
                        : "Your conversation is encrypted and secure. No personal information is stored."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
