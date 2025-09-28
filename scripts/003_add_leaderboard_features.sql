-- Add username and completion time to quiz_attempts for leaderboard
ALTER TABLE quiz_attempts 
ADD COLUMN username TEXT DEFAULT 'Anonymous',
ADD COLUMN completion_time_seconds INTEGER DEFAULT 0,
ADD COLUMN achievements JSONB DEFAULT '[]'::jsonb;

-- Create index for leaderboard queries
CREATE INDEX idx_quiz_attempts_score_time ON quiz_attempts(score DESC, completion_time_seconds ASC);

-- Create achievements table
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition_type TEXT NOT NULL, -- 'perfect_score', 'fast_completion', 'first_attempt'
  condition_value INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, condition_type, condition_value) VALUES
('Perfect Score', 'Answer all questions correctly', 'trophy', 'perfect_score', 100),
('Speed Demon', 'Complete quiz in under 5 minutes', 'zap', 'fast_completion', 300),
('First Timer', 'Complete your first quiz', 'star', 'first_attempt', 1),
('Sharp Shooter', 'Score 80% or higher', 'target', 'high_score', 80);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policy for achievements (read-only for all users)
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
