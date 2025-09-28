export interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: "A" | "B" | "C" | "D"
}

export interface QuestionForClient {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

export interface UserAnswer {
  questionId: string
  selectedOption: "A" | "B" | "C" | "D"
}

export interface QuizResult {
  score: number
  totalQuestions: number
  answers: UserAnswer[]
  correctAnswers: { [questionId: string]: "A" | "B" | "C" | "D" }
  achievements?: string[]
  percentage?: number
}
