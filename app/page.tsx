"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Trophy, Clock, Target, Users, Zap, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    { icon: Target, text: "10 multiple choice questions" },
    { icon: Clock, text: "10 minute time limit" },
    { icon: Trophy, text: "Instant results & achievements" },
    { icon: Users, text: "Global leaderboard" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 transition-colors duration-300">
      {/* Header */}
      <motion.header
        className="w-full p-4 flex justify-end"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ThemeToggle />
      </motion.header>

      <div className="flex items-center justify-center p-4 pt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Quiz Challenge
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Test your knowledge with our interactive quiz
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <feature.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <Link href="/quiz" className="block">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 text-lg shadow-lg transition-all duration-200">
                      <Zap className="w-5 h-5 mr-2" />
                      Start Quiz
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/leaderboard" className="block">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full py-3 text-lg transition-all duration-200 bg-transparent"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      View Leaderboard
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Achievement preview */}
              <motion.div
                className="text-center pt-4 border-t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1 }}
              >
                <p className="text-xs text-muted-foreground mb-2">Unlock achievements:</p>
                <div className="flex justify-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    <span>Perfect Score</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3 text-blue-500" />
                    <span>Speed Demon</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-purple-500" />
                    <span>First Timer</span>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
