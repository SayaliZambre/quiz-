"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface QuizSummaryProps {
  score: number
  totalQuestions: number
  timeSpent?: number // in seconds
  correctAnswers: number
  incorrectAnswers: number
}

export function QuizSummary({ score, totalQuestions, timeSpent, correctAnswers, incorrectAnswers }: QuizSummaryProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quiz Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Score</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Correct: {correctAnswers}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Incorrect: {incorrectAnswers}</span>
          </div>
        </div>

        {timeSpent && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Time: {formatTime(timeSpent)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
