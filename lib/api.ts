import type { QuestionForClient, UserAnswer, QuizResult } from "./types"

export async function fetchQuestions(): Promise<QuestionForClient[]> {
  const response = await fetch("/api/quiz/questions")
  if (!response.ok) {
    throw new Error("Failed to fetch questions")
  }
  const data = await response.json()
  return data.questions
}

export async function submitQuiz(
  answers: UserAnswer[],
  sessionId: string,
  username?: string,
  completionTime?: number,
): Promise<QuizResult> {
  const response = await fetch("/api/quiz/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers, sessionId, username, completionTime }),
  })

  if (!response.ok) {
    throw new Error("Failed to submit quiz")
  }

  return response.json()
}
