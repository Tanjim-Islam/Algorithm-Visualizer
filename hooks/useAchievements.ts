"use client"

import { useState, useEffect } from "react"

export function useAchievements() {
  const [achievements, setAchievements] = useState<string[]>([])
  const [stats, setStats] = useState<any>({
    totalSorts: 0,
    fastestSort: Number.POSITIVE_INFINITY,
    algorithmsUsed: {},
    minComparisons: Number.POSITIVE_INFINITY,
    arraySize: 50,
    challengesCompleted: 0,
  })

  // Load achievements and stats from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAchievements = localStorage.getItem("algorithmVisualizerAchievements")
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements))
      }

      const savedStats = localStorage.getItem("algorithmVisualizerStats")
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }
    }
  }, [])

  return {
    achievements,
    stats,
  }
}
