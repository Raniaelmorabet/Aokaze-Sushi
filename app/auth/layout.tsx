import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Aokaze Sushi",
  description: "Sign in or create an account to enjoy Aokaze Sushi's delicious food and exclusive offers.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 