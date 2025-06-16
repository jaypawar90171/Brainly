"use client"

import type React from "react"

import { CloseIcon } from "../icons/CloseIcon"
import { useState } from "react"
import axios from "axios"

//@ts-ignore
export const CreateModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    link: "",
    type: "",
    title: "",
    tags: [""], // Initialize tags as an array
  })


  if (!open) return null

  const handleInputChange = (field: string, value: string) => {
    if (field === "tags") {
      setFormData((prev) => ({
        ...prev,
        tags: value.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData.link,formData.tags, formData.title, formData.type);
    const result = await axios.put("http://localhost:3000/api/v1/content", {
        link: formData.link,
        type: formData.type,
        title: formData.title,
        tags: formData.tags.map((tag) => tag.trim()), 
    },
    {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    }
    )
    console.log("Form submitted:", result.data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Create New Content</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group">
            <CloseIcon size="lg"/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Link Input */}
          <div className="space-y-2">
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">
              Content Link
            </label>
            <input
              id="link"
              placeholder="https://example.com"
              value={formData.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>

          {/* Type Select */}
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Content Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">Select content type</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="podcast">Audio</option>
            </select>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter a descriptive title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              placeholder="design, inspiration, tutorial (comma separated)"
              value={formData.tags.join(", ")}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500">Separate multiple tags with commas</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Content
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
