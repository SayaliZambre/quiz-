"use client"

import { useState, useCallback } from "react"
import type { QuestionForClient, UserAnswer } from "@/lib/types"

export function useQuizState(questions: QuestionForClient[]) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: "A" | "B" | "C" | "D" }>({})

  const currentQuestion = questions[currentQuestionIndex]
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : null

  const selectOption = useCallback(
    (option: "A" | "B" | "C" | "D") => {
      if (currentQuestion) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: option,
        }))
      }
    },
    [currentQuestion],
  )

  const goToNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }, [currentQuestionIndex, questions.length])

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }, [currentQuestionIndex])

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentQuestionIndex(index)
      }
    },
    [questions.length],
  )

  const getUserAnswers = useCallback((): UserAnswer[] => {
    return questions
      .map((question) => ({
        questionId: question.id,
        selectedOption: answers[question.id],
      }))
      .filter((answer) => answer.selectedOption) // Only include answered questions
  }, [questions, answers])

  const getAnsweredCount = useCallback(() => {
    return Object.keys(answers).length
  }, [answers])

  const isComplete = useCallback(() => {
    return questions.every((question) => answers[question.id])
  }, [questions, answers])

  return {
    currentQuestionIndex,
    currentQuestion,
    selectedOption,
    answers,
    selectOption,
    goToNext,
    goToPrevious,
    goToQuestion,
    getUserAnswers,
    getAnsweredCount,
    isComplete,
    canGoNext: currentQuestionIndex < questions.length - 1,
    canGoPrevious: currentQuestionIndex > 0,
    isLastQuestion: currentQuestionIndex === questions.length - 1,
  }
}
