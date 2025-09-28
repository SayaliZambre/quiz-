"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { QuestionForClient } from "@/lib/types"

interface QuizQuestionProps {
  question: QuestionForClient
  questionNumber: number
  totalQuestions: number
  selectedOption: "A" | "B" | "C" | "D" | null
  onOptionSelect: (option: "A" | "B" | "C" | "D") => void
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onOptionSelect,
}: QuizQuestionProps) {
  const options = [
    { key: "A" as const, text: question.option_a },
    { key: "B" as const, text: question.option_b },
    { key: "C" as const, text: question.option_c },
    { key: "D" as const, text: question.option_d },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="w-full max-w-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-balance text-foreground" id={`question-${questionNumber}`}>
            {question.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${questionNumber}`}>
            {options.map((option, index) => (
              <motion.div
                key={option.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant={selectedOption === option.key ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto transition-all duration-200 hover:scale-[1.02] ${
                    selectedOption === option.key
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => onOptionSelect(option.key)}
                  role="radio"
                  aria-checked={selectedOption === option.key}
                  aria-describedby={`option-${option.key}-text`}
                >
                  <motion.span
                    className="font-semibold mr-3 flex items-center justify-center w-6 h-6 rounded-full bg-background/20 text-sm"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {option.key}
                  </motion.span>
                  <span className="text-pretty" id={`option-${option.key}-text`}>
                    {option.text}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
