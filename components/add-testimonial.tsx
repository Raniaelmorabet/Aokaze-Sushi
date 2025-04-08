"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, X } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function AddTestimonial() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(false)

    // Validate form
    if (!name || !title || !comment) {
      setError(true)
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setName("")
        setRating(5)
        setTitle("")
        setComment("")
        setSuccess(false)
        setIsOpen(false)
      }, 2000)
    }, 1000)
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1 mt-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t("testimonials.addYours")}
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6">{t("testimonials.addYours")}</h3>

            {success ? (
              <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-4">
                {t("testimonials.form.success")}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-4">
                    {t("testimonials.form.error")}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">{t("testimonials.form.name")}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t("testimonials.form.name")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">{t("testimonials.form.rating")}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">{t("testimonials.form.title")}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t("testimonials.form.title")}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">{t("testimonials.form.comment")}</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px]"
                    placeholder={t("testimonials.form.comment")}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("testimonials.form.submit")}
                    </span>
                  ) : (
                    t("testimonials.form.submit")
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </>
  )
}
