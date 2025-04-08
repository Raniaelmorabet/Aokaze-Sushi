"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Check } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1E1E1E] rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Mail size={32} className="text-orange-500" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8">
            Stay updated with our latest menu items, special offers, and events. We promise not to spam your inbox!
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-[#2a2a2a] text-white px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 pr-36"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>

          {submitted && (
            <motion.div
              className="mt-4 bg-green-500/20 text-green-400 text-center py-2 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Check size={16} />
                <span>Thank you for subscribing!</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
