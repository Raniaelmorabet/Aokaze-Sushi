"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/translations"

type Language = "english" | "french" | "arabic"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("english")
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")

  useEffect(() => {
    // Set the direction based on language
    setDir(language === "arabic" ? "rtl" : "ltr")

    // Set the dir attribute on the html element
    document.documentElement.dir = language === "arabic" ? "rtl" : "ltr"

    // Store the language preference
    localStorage.setItem("language", language)
  }, [language])

  // Initialize language from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["english", "french", "arabic"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".")
    let value = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation is missing
        let fallback = translations.english
        for (const fallbackKey of keys) {
          if (fallback && typeof fallback === "object" && fallbackKey in fallback) {
            fallback = fallback[fallbackKey]
          } else {
            return key // Return the key if no translation found
          }
        }
        return typeof fallback === "string" ? fallback : key
      }
    }

    return typeof value === "string" ? value : key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
