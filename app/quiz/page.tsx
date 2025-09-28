"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { QuizQuestion } from "@/components/quiz-question"
import { QuizNavigation } from "@/components/quiz-navigation"
import { QuizTimer } from "@/components/quiz-timer"
import { ChatBot } from "@/components/chat-bot"
import { ProgressBar } from "@/components/progress-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"
import { AccessibilityAnnouncer } from "@/components/accessibility-announcer"
import { Card, CardContent } from "@/components/ui/card"
import { fetchQuestions, submitQuiz } from "@/lib/api"
import type { QuestionForClient, UserAnswer } from "@/lib/types"

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<QuestionForClient[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: "A" | "B" | "C" | "D" }>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [startTime] = useState(Date.now())
  const [username, setUsername] = useState("Anonymous")
  const [announceMessage, setAnnounceMessage] = useState("")

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1)
        setAnnounceMessage(`Moved to question ${currentQuestionIndex}`)
      } else if (event.key === "ArrowRight" && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setAnnounceMessage(`Moved to question ${currentQuestionIndex + 2}`)
      } else if (event.key === "Enter" && currentQuestionIndex === questions.length - 1) {
        handleSubmit()
      } else if (["1", "2", "3", "4"].includes(event.key)) {
        const optionMap = { "1": "A", "2": "B", "3": "C", "4": "D" } as const
        const option = optionMap[event.key as keyof typeof optionMap]
        handleOptionSelect(option)
        setAnnounceMessage(`Selected option ${option}`)
      }
    },
    [currentQuestionIndex, questions.length],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  // Load questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions()
        setQuestions(fetchedQuestions)
      } catch (err) {
        setError("Failed to load questions. Please try again.")
        console.error("Error loading questions:", err)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  useEffect(() => {
    const savedUsername = localStorage.getItem("quiz-username")
    if (savedUsername) {
      setUsername(savedUsername)
    } else {
      const newUsername = prompt("Enter your name for the leaderboard:") || "Anonymous"
      setUsername(newUsername)
      localStorage.setItem("quiz-username", newUsername)
    }
  }, [])

  const currentQuestion = questions[currentQuestionIndex]
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : null

  const handleOptionSelect = (option: "A" | "B" | "C" | "D") => {
    if (currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: option,
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setAnnounceMessage(`Question ${currentQuestionIndex + 2} of ${questions.length}`)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setAnnounceMessage(`Question ${currentQuestionIndex} of ${questions.length}`)
    }
  }

  const handleSubmit = async () => {
    if (submitting) return

    // Check if all questions are answered
    const unansweredQuestions = questions.filter((q) => !answers[q.id])
    if (unansweredQuestions.length > 0) {
      setAnnounceMessage(`Please answer all questions. ${unansweredQuestions.length} questions remaining.`)
      alert(`Please answer all questions. ${unansweredQuestions.length} questions remaining.`)
      return
    }

    setSubmitting(true)
    setAnnounceMessage("Submitting your quiz answers...")

    try {
      const userAnswers: UserAnswer[] = questions.map((question) => ({
        questionId: question.id,
        selectedOption: answers[question.id],
      }))

      const completionTime = Math.floor((Date.now() - startTime) / 1000)
      const result = await submitQuiz(userAnswers, sessionId, username, completionTime)

      // Store result in sessionStorage for the results page
      sessionStorage.setItem("quizResult", JSON.stringify(result))
      sessionStorage.setItem("quizQuestions", JSON.stringify(questions))
      sessionStorage.setItem("completionTime", completionTime.toString())

      setAnnounceMessage("Quiz submitted successfully! Redirecting to results...")
      router.push("/quiz/results")
    } catch (err) {
      setError("Failed to submit quiz. Please try again.")
      setAnnounceMessage("Failed to submit quiz. Please try again.")
      console.error("Error submitting quiz:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    setAnnounceMessage("Time's up! Submitting your current answers.")
    alert("Time's up! Submitting your current answers.")
    handleSubmit()
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
                <p className="text-muted-foreground">Loading quiz questions...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline transition-colors"
              >
                Try Again
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No questions available.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const canGoNext = currentQuestionIndex < questions.length - 1
  const canGoPrevious = currentQuestionIndex > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 transition-colors duration-300">
      <AccessibilityAnnouncer message={announceMessage} />

      <motion.header
        className="w-full p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Quiz Challenge
          </h1>
          <span className="text-sm text-muted-foreground">Welcome, {username}!</span>
        </div>
        <div className="flex items-center gap-4">
          <QuizTimer duration={600} onTimeUp={handleTimeUp} />
          <ThemeToggle />
        </div>
      </motion.header>

      <div className="flex flex-col items-center justify-center p-4 pt-0">
        <motion.div
          className="w-full max-w-2xl mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ProgressBar current={currentQuestionIndex + 1} total={questions.length} className="mb-4" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <QuizQuestion
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <QuizNavigation
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLastQuestion={isLastQuestion}
            selectedOption={selectedOption}
          />
        </motion.div>

        <motion.div
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <p>Use ← → arrow keys to navigate • Press Enter to submit on last question</p>
        </motion.div>
      </div>

      <KeyboardShortcutsHelp />
      <ChatBot />

      <AnimatePresence>
        {submitting && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="w-full max-w-sm">
                <CardContent className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <motion.div
                      className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <p className="text-muted-foreground">Submitting your quiz...</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
