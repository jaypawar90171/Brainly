import type React from "react"

interface MenuItemProps {
  logo: React.ReactNode
  title: string
}

export function MenuItem({ logo, title }: MenuItemProps) {
  return (
    <button className="w-full flex items-center space-x-3 px-4 py-3 mb-2 text-left rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white transition-all duration-200 transform hover:scale-[1.02] group">
      <div className="text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors duration-200">
        {logo}
      </div>
      <span className="font-medium">{title}</span>
    </button>
  )
}
