"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className = "" }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
