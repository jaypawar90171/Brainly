"use client"

import type React from "react"

interface ButtonProps {
  varient: "primary" | "secondary"
  size: "sm" | "md" | "lg"
  text: string
  startIcon?: React.ReactNode
  onClick: () => void
}

export default function Button({ varient, size, text, startIcon, onClick }: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2"

  const varientClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary:
      "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg focus:ring-gray-500",
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${varientClasses[varient]} ${sizeClasses[size]}`}>
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {text}
    </button>
  )
}
