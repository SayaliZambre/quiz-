"use client"

import { motion } from "framer-motion"
import { Trophy, Zap, Target, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type Achievement = {
  id: string
  name: string
  description: string
  icon: "trophy" | "zap" | "target" | "star"
  unlocked: boolean
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: "sm" | "md" | "lg"
}

const iconMap = {
  trophy: Trophy,
  zap: Zap,
  target: Target,
  star: Star,
}

export function AchievementBadge({ achievement, size = "md" }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon]

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Badge
        variant={achievement.unlocked ? "default" : "secondary"}
        className={`flex items-center gap-2 ${achievement.unlocked ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" : ""}`}
      >
        <Icon className={sizeClasses[size]} />
        <span className="text-xs font-medium">{achievement.name}</span>
      </Badge>
    </motion.div>
  )
}
