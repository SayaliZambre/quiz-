"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Award, Clock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

interface LeaderboardEntry {
  id: string
  username: string
  score: number
  total_questions: number
  completion_time_seconds: number
  completed_at: string
  achievements: string[]
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard")
        if (!response.ok) throw new Error("Failed to fetch leaderboard")
        const data = await response.json()
        setLeaderboard(data)
      } catch (err) {
        setError("Failed to load leaderboard")
        console.error("Error fetching leaderboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
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
                <p className="text-muted-foreground">Loading leaderboard...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 transition-colors duration-300">
      <motion.header
        className="w-full p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Leaderboard
          </h1>
        </div>
        <ThemeToggle />
      </motion.header>

      <div className="container mx-auto px-4 pb-8">
        {error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : leaderboard.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No quiz attempts yet!</p>
                <Link href="/quiz">
                  <Button>Take the Quiz</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="max-w-4xl mx-auto space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`transition-all duration-300 hover:shadow-lg ${
                    index < 3 ? "ring-2 ring-purple-200 dark:ring-purple-800" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900">
                          {getRankIcon(index + 1)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold text-lg">{entry.username}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              Score: {entry.score}/{entry.total_questions}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(entry.completion_time_seconds)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {Math.round((entry.score / entry.total_questions) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.completed_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {entry.achievements && entry.achievements.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.achievements.map((achievement, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
