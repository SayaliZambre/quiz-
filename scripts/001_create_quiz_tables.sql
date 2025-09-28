-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempts table to track user attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Questions are public (read-only for everyone)
CREATE POLICY "questions_select_all" ON public.questions FOR SELECT USING (true);

-- Quiz attempts can be inserted by anyone (no auth required for this demo)
CREATE POLICY "quiz_attempts_insert_all" ON public.quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "quiz_attempts_select_own" ON public.quiz_attempts FOR SELECT USING (true);
