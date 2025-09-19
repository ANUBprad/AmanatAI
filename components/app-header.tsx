"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Moon, Sun, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

const languages = ["English", "हिंदी", "বাংলা", "తెలుగు", "मराठी", "தமிழ்", "اردو", "ગુજરાતી"]

interface AppHeaderProps {
  title: string
  subtitle: string
  showBackButton?: boolean
  backHref?: string
}

export function AppHeader({ title, subtitle, showBackButton = false, backHref = "/" }: AppHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
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
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

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
  )
}
