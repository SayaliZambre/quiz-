import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all questions but exclude the correct_option field for security
    const { data: questions, error } = await supabase
      .from("questions")
      .select("id, question_text, option_a, option_b, option_c, option_d")
      .order("created_at")

    if (error) {
      console.error("Error fetching questions:", error)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
