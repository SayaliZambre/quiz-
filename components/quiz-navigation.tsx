"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"

interface QuizNavigationProps {
  currentQuestion: number
  totalQuestions: number
  canGoNext: boolean
  canGoPrevious: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  isLastQuestion: boolean
  selectedOption: "A" | "B" | "C" | "D" | null
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  canGoNext,
  canGoPrevious,
  onPrevious,
  onNext,
  onSubmit,
  isLastQuestion,
  selectedOption,
}: QuizNavigationProps) {
  return (
    <motion.div
      className="flex justify-between items-center w-full max-w-2xl mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <motion.div whileHover={{ scale: canGoPrevious ? 1.05 : 1 }} whileTap={{ scale: canGoPrevious ? 0.95 : 1 }}>
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center gap-2 transition-all duration-200 bg-transparent"
          aria-label="Go to previous question"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
      </motion.div>

      <div className="text-center">
        <span className="text-sm text-muted-foreground font-medium">
          {currentQuestion} / {totalQuestions}
        </span>
        <div className="text-xs text-muted-foreground mt-1">
          {selectedOption ? "Answer selected" : "Select an answer"}
        </div>
      </div>

      {isLastQuestion ? (
        <motion.div whileHover={{ scale: selectedOption ? 1.05 : 1 }} whileTap={{ scale: selectedOption ? 0.95 : 1 }}>
          <Button
            onClick={onSubmit}
            disabled={!selectedOption}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center gap-2 shadow-lg transition-all duration-200"
            aria-label="Submit quiz"
          >
            <Send className="w-4 h-4" />
            Submit Quiz
          </Button>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: canGoNext && selectedOption ? 1.05 : 1 }}
          whileTap={{ scale: canGoNext && selectedOption ? 0.95 : 1 }}
        >
          <Button
            onClick={onNext}
            disabled={!canGoNext || !selectedOption}
            className="flex items-center gap-2 transition-all duration-200"
            aria-label="Go to next question"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
