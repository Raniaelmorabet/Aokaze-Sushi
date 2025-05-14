"use client"

import { motion } from "framer-motion"

interface SectionLoaderProps {
    text?: string
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}

export default function SectionLoader({ text = "Loading...", size = "md", className = "" }: SectionLoaderProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
    }

    return (
        <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
            <motion.div
                className={`rounded-full border-2 border-t-orange-500 border-r-orange-500 border-b-orange-300 border-l-orange-200 ${sizeClasses[size]}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            {text && <p className="text-gray-400 mt-3">{text}</p>}
        </div>
    )
}