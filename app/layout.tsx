import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/context/language-context"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {

    title: "Aokaaze - Fresh & Delicious Sushi",
    description: "Experience authentic Japanese flavors with our carefully crafted sushi made from the freshest ingredients.",
    generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
    <body className={inter.className}>
    <link rel="icon" href="/Logopage.png" type="image/png" sizes="128x128"/>
    <LanguageProvider>{children}</LanguageProvider>
    </body>
    </html>
  )
}


import './globals.css'