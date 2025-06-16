import { MenuItem } from "./MenuItem"
import { Twitter, Video, FileText, Link, Hash } from "lucide-react"

export const Slidebar = () => {
  return (
    <div className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50">
      {/* Sidebar title */}
      <div className="flex items-center px-6 py-4 space-x-3">
        <img src="logo.png" alt="Logo" className="h-12 w-12 rounded-md shadow-sm" />
        <span className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Second Brain</span>
      </div>
      {/* <hr className="border-t border-gray-200/50 dark:border-gray-700/50" /> */}
      {/* menu items */}
      <div className="p-4">
        <MenuItem logo={<Twitter />} title="Tweets"></MenuItem>
        <MenuItem logo={<Video />} title="Videos"></MenuItem>
        <MenuItem logo={<FileText />} title="Documents"></MenuItem>
        <MenuItem logo={<Link />} title="Links"></MenuItem>
        <MenuItem logo={<Hash />} title="Tags"></MenuItem>
      </div>
    </div>
  )
}
