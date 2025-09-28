import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import type { UserAnswer } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const {
      answers,
      sessionId,
      username = "Anonymous",
      completionTime = 0,
    }: {
      answers: UserAnswer[]
      sessionId: string
      username?: string
      completionTime?: number
    } = body

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Invalid answers provided" }, { status: 400 })
    }

    // Fetch all questions with correct answers
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, correct_option")
      .in(
        "id",
        answers.map((a) => a.questionId),
      )

    if (questionsError) {
      console.error("Error fetching questions for scoring:", questionsError)
      return NextResponse.json({ error: "Failed to fetch questions for scoring" }, { status: 500 })
    }

    // Calculate score
    let score = 0
    const correctAnswers: { [questionId: string]: "A" | "B" | "C" | "D" } = {}

    questions?.forEach((question) => {
      correctAnswers[question.id] = question.correct_option
      const userAnswer = answers.find((a) => a.questionId === question.id)
      if (userAnswer && userAnswer.selectedOption === question.correct_option) {
        score++
      }
    })

    const achievements: string[] = []
    const percentage = (score / answers.length) * 100

    if (percentage === 100) {
      achievements.push("Perfect Score")
    }
    if (percentage >= 80) {
      achievements.push("Sharp Shooter")
    }
    if (completionTime > 0 && completionTime <= 300) {
      // 5 minutes or less
      achievements.push("Speed Demon")
    }
    achievements.push("First Timer") // For now, everyone gets this

    const { error: saveError } = await supabase.from("quiz_attempts").insert({
      session_id: sessionId,
      score,
      total_questions: answers.length,
      answers: answers,
      completed_at: new Date().toISOString(),
      username,
      completion_time_seconds: completionTime,
      achievements,
    })

    if (saveError) {
      console.error("Error saving quiz attempt:", saveError)
      // Don't fail the request if saving fails, just log it
    }

    return NextResponse.json({
      score,
      totalQuestions: answers.length,
      answers,
      correctAnswers,
      achievements,
      percentage,
    })
  } catch (error) {
    console.error("Unexpected error in submit:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
