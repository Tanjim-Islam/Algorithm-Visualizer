"use client"

import { motion } from "framer-motion"
import type { Achievement } from "@/types"

interface AchievementNotificationProps {
  achievement: Achievement | undefined
}

export function AchievementNotification({ achievement }: AchievementNotificationProps) {
  if (!achievement) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 flex items-center gap-4 max-w-sm glass-card"
    >
      <div className="p-3 rounded-full dark:bg-red-500/20 bg-blue-200 animate-pulse-glow dark:animate-pulse-glow-red">
        {achievement.icon}
      </div>
      <div>
        <h3 className="font-semibold dark:text-white text-gray-800 text-lg">Achievement Unlocked!</h3>
        <p className="text-sm dark:text-gray-300 text-gray-700 mt-1">
          <span className="font-medium bg-gradient-to-r from-blue-500 to-blue-700 dark:from-red-500 dark:to-orange-500 bg-clip-text text-transparent">
            {achievement.name}:
          </span>{" "}
          {achievement.description}
        </p>
      </div>
    </motion.div>
  )
}
