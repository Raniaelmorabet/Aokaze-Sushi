"use client"
import type { ReactNode } from "react"
import SectionLoader from "./section-loader"

interface ContentLoaderProps {
    isLoading: boolean
    isEmpty?: boolean
    emptyMessage?: string
    children: ReactNode
    className?: string
    minHeight?: string
}

export default function ContentLoader({
                                          isLoading,
                                          isEmpty = false,
                                          emptyMessage = "No content available",
                                          children,
                                          className = "",
                                          minHeight = "300px",
                                      }: ContentLoaderProps) {
    if (isLoading) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ minHeight }}>
                <SectionLoader size="lg" />
            </div>
        )
    }

    if (isEmpty) {
        return (
            <div className={`flex items-center justify-center text-center ${className}`} style={{ minHeight }}>
                <p className="text-gray-400">{emptyMessage}</p>
            </div>
        )
    }

    return <>{children}</>
}
