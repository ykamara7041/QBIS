"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { dictionaries, LanguageCode } from "@/lib/dictionaries"

type LanguageContextType = {
  language: LanguageCode
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode, initialLanguage: string }) {
  // Fallback to "en" if the language doesn't exist in our dictionary
  const lang = (dictionaries[initialLanguage as LanguageCode] ? initialLanguage : "en") as LanguageCode

  const t = (key: string) => {
    return dictionaries[lang]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language: lang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
