"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ChevronDown } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "english", label: "English" },
    { code: "french", label: "Français" },
    { code: "arabic", label: "العربية" },
  ]

  const toggleDropdown = () => setIsOpen(!isOpen)

  const selectLanguage = (lang) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  // Get the current language label
  const currentLanguageLabel = languages.find((lang) => lang.code === language)?.label || "English"

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 text-sm hover:text-orange-400 transition-colors"
        onClick={toggleDropdown}
      >
        <Globe size={16} />
        <span className="hidden md:inline">{currentLanguageLabel}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 bg-[#1E1E1E] rounded-lg shadow-xl overflow-hidden z-50 min-w-[150px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${lang.code === language ? "text-orange-500" : "text-white"}`}
                  onClick={() => selectLanguage(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
