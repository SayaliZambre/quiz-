"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, AlertTriangle } from "lucide-react"

interface QuizTimerProps {
  duration: number // in seconds
  onTimeUp: () => void
}

export function QuizTimer({ duration, onTimeUp }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isLowTime = timeLeft <= 60 // Last minute
  const isCriticalTime = timeLeft <= 30 // Last 30 seconds

  const getTimerColor = () => {
    if (isCriticalTime) return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    if (isLowTime) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
  }

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${getTimerColor()}`}
      animate={isCriticalTime ? { scale: [1, 1.05, 1] } : {}}
      transition={isCriticalTime ? { duration: 1, repeat: Number.POSITIVE_INFINITY } : {}}
      role="timer"
      aria-label={`Time remaining: ${minutes} minutes and ${seconds} seconds`}
    >
      {isCriticalTime ? (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <AlertTriangle className="w-4 h-4" />
        </motion.div>
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span className="font-mono font-semibold text-sm">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
      {isLowTime && (
        <motion.span
          className="text-xs font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isCriticalTime ? "Hurry!" : "Low time"}
        </motion.span>
      )}
    </motion.div>
  )
}
