"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ScoreDisplayProps {
  score: number
  totalQuestions: number
  className?: string
}

export function ScoreDisplay({ score, totalQuestions, className = "" }: ScoreDisplayProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreGrade = (percentage: number) => {
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B"
    if (percentage >= 60) return "C"
    if (percentage >= 50) return "D"
    return "F"
  }

  return (
    <Card className={className}>
      <CardContent className="p-6 text-center">
        <div className="space-y-2">
          <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
            {score}/{totalQuestions}
          </div>
          <div className={`text-xl font-semibold ${getScoreColor(percentage)}`}>
            {percentage}% ({getScoreGrade(percentage)})
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
