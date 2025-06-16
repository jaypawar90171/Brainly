import React from "react";

interface CardProps {
  startIcon: React.ReactNode;
  heading: string;
  endIcon1: React.ReactNode;
  endIcon2: React.ReactNode;
  title: string;
  links: string;
  type: "youtube" | "twitter";
  tags: string[];
  date: string;
  user?: string
}

export function Card({
  startIcon,
  heading,
  endIcon1,
  endIcon2,
  title,
  links,
  type,
  tags,
  date,
  user
}: CardProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600 dark:text-blue-400">{startIcon}</div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {heading}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={links}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {endIcon1}
          </a>
          <button className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">
            {endIcon2}
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        {user && (
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mr-2">
            {user}
          </span>
        )}
        <span>{title}</span>
      </h4>

      {/* Embedded Content */}
      {type === "youtube" && links && (
        <div className="w-full h-64 aspect-video overflow-hidden rounded-lg mb-4">
          <iframe
            src={links}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      )}
      {type === "twitter" && links && (
        <div className="w-full h-64 aspect-video overflow-hidden rounded-lg mb-4">
          <blockquote className="twitter-tweet w-full h-full">
            <a href={links}></a>
          </blockquote>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(tags || []).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Date */}
      <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
    </div>
  );
}
