"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Home, Trophy, Clock, Target } from "lucide-react"
import { AchievementBadge, type Achievement } from "@/components/achievement-badge"
import { ThemeToggle } from "@/components/theme-toggle"
import type { QuizResult, QuestionForClient } from "@/lib/types"
import Link from "next/link"

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [questions, setQuestions] = useState<QuestionForClient[]>([])
  const [loading, setLoading] = useState(true)
  const [completionTime, setCompletionTime] = useState<number>(0)

  useEffect(() => {
    // Get results from sessionStorage
    const storedResult = sessionStorage.getItem("quizResult")
    const storedQuestions = sessionStorage.getItem("quizQuestions")
    const storedTime = sessionStorage.getItem("completionTime")

    if (storedResult && storedQuestions) {
      setResult(JSON.parse(storedResult))
      setQuestions(JSON.parse(storedQuestions))
      setCompletionTime(Number.parseInt(storedTime || "0"))
    } else {
      // Redirect to home if no results found
      router.push("/")
    }
    setLoading(false)
  }, [router])

  const handleRetakeQuiz = () => {
    // Clear stored results
    sessionStorage.removeItem("quizResult")
    sessionStorage.removeItem("quizQuestions")
    sessionStorage.removeItem("completionTime")
    router.push("/quiz")
  }

  const handleGoHome = () => {
    // Clear stored results
    sessionStorage.removeItem("quizResult")
    sessionStorage.removeItem("quizQuestions")
    sessionStorage.removeItem("completionTime")
    router.push("/")
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <motion.div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <p className="text-muted-foreground">Loading results...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!result || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No results found.</p>
            <Button onClick={handleGoHome}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const percentage = result.percentage || Math.round((result.score / result.totalQuestions) * 100)
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400"
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! Outstanding performance!"
    if (percentage >= 80) return "Great job! Well done!"
    if (percentage >= 70) return "Good work! Nice effort!"
    if (percentage >= 60) return "Not bad! Keep practicing!"
    return "Keep studying and try again!"
  }

  // Convert achievements to Achievement objects
  const achievements: Achievement[] = (result.achievements || []).map((name, index) => ({
    id: `achievement-${index}`,
    name,
    description: `You earned the ${name} achievement!`,
    icon: name.includes("Perfect")
      ? "trophy"
      : name.includes("Speed")
        ? "zap"
        : name.includes("Sharp")
          ? "target"
          : "star",
    unlocked: true,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 transition-colors duration-300">
      {/* Header */}
      <motion.header
        className="w-full p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Quiz Results
        </h1>
        <ThemeToggle />
      </motion.header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center shadow-xl">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Quiz Complete!
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
                  {result.score}/{result.totalQuestions}
                </div>
                <div className={`text-3xl font-semibold ${getScoreColor(percentage)}`}>{percentage}%</div>
                <p className="text-lg text-muted-foreground">{getScoreMessage(percentage)}</p>

                {/* Stats */}
                <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Time: {formatTime(completionTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>Accuracy: {percentage}%</span>
                  </div>
                </div>
              </motion.div>

              {/* Achievements */}
              {achievements.length > 0 && (
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Achievements Unlocked
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    <AnimatePresence>
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                        >
                          <AchievementBadge achievement={achievement} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              <motion.div
                className="flex justify-center gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1 }}
              >
                <Button onClick={handleRetakeQuiz} className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </Button>
                <Link href="/leaderboard">
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Trophy className="w-4 h-4" />
                    View Leaderboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleGoHome} className="flex items-center gap-2 bg-transparent">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Question Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = result.answers.find((a) => a.questionId === question.id)
                const correctOption = result.correctAnswers[question.id]
                const isCorrect = userAnswer?.selectedOption === correctOption

                const getOptionText = (option: "A" | "B" | "C" | "D") => {
                  switch (option) {
                    case "A":
                      return question.option_a
                    case "B":
                      return question.option_b
                    case "C":
                      return question.option_c
                    case "D":
                      return question.option_d
                  }
                }

                return (
                  <motion.div
                    key={question.id}
                    className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-balance">
                          {index + 1}. {question.question_text}
                        </h3>
                      </div>
                      <Badge variant={isCorrect ? "default" : "destructive"} className="ml-4">
                        {isCorrect ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      {userAnswer && (
                        <div
                          className={`p-2 rounded transition-colors duration-200 ${
                            isCorrect
                              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                          }`}
                        >
                          <strong>Your answer:</strong> {userAnswer.selectedOption}.{" "}
                          {getOptionText(userAnswer.selectedOption)}
                        </div>
                      )}

                      {!isCorrect && (
                        <div className="p-2 rounded bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 transition-colors duration-200">
                          <strong>Correct answer:</strong> {correctOption}. {getOptionText(correctOption)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
