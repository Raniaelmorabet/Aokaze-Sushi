"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Apple, SmartphoneIcon as Android, Star } from "lucide-react"

export function MobileAppPromo() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#1a1a1a] to-[#121212] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get Our Mobile App</h2>
            <p className="text-gray-400 text-lg mb-6">
              Order your favorite sushi on the go, earn rewards, and get exclusive offers with our mobile app.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mt-1">
                  <Star size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Loyalty Program</h3>
                  <p className="text-gray-400">Earn points with every order and redeem them for free food</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Order Notifications</h3>
                  <p className="text-gray-400">Get real-time updates on your order status</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Exclusive Offers</h3>
                  <p className="text-gray-400">Access app-only discounts and special promotions</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Apple size={24} />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="font-bold">App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Android size={24} />
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 mx-auto max-w-[300px]">
              <Image
                src="/placeholder.svg?height=600&width=300"
                alt="Mobile App"
                width={300}
                height={600}
                className="rounded-3xl border-8 border-[#2a2a2a] shadow-2xl"
              />

              <div className="absolute -top-6 -right-6 bg-orange-500 text-white text-sm px-4 py-2 rounded-full transform rotate-12">
                20% OFF first order!
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
