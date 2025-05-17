"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";
// Import the config file to ensure it's loaded
import "@/app/config.js";
import { isClient } from "./utils/client-utils";
import ClientSafety from "./ClientSafety";

const inter = Inter({ subsets: ["latin"] });

// Metadata needs to be in a separate server component
// or configured in next.config.js instead

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Aokaaze - Fresh & Delicious Sushi</title>
        <meta
          name="description"
          content="Experience authentic Japanese flavors with our carefully crafted sushi made from the freshest ingredients."
        />
        <meta name="generator" content="v0.dev" />
        <link
          rel="icon"
          href="/Logopage.png"
          type="image/png"
          sizes="128x128"
        />
      </head>
      <body className={inter.className}>
        <ClientSafety />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

import "./globals.css";
