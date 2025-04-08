import { Trophy, Flame, Cpu, Gauge } from "lucide-react"
import type { Achievement } from "@/types"

export const achievementsList: Achievement[] = [
  {
    id: "first_sort",
    name: "First Sort",
    description: "Complete your first sorting algorithm",
    icon: <Trophy className="h-5 w-5 text-yellow-500" />,
    condition: (stats) => stats.totalSorts >= 1,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Complete a sort in under 1 second",
    icon: <Flame className="h-5 w-5 text-orange-500" />,
    condition: (stats) => stats.fastestSort < 1000,
  },
  {
    id: "algorithm_master",
    name: "Algorithm Master",
    description: "Try all sorting algorithms",
    icon: <Cpu className="h-5 w-5 text-purple-500" />,
    condition: (stats) => Object.keys(stats.algorithmsUsed).length >= 6,
  },
  {
    id: "efficiency_expert",
    name: "Efficiency Expert",
    description: "Complete a sort with minimal comparisons",
    icon: <Gauge className="h-5 w-5 text-green-500" />,
    condition: (stats) => stats.minComparisons <= stats.arraySize * Math.log2(stats.arraySize),
  },
  {
    id: "challenge_champion",
    name: "Challenge Champion",
    description: "Complete all challenges",
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
    condition: (stats) => stats.challengesCompleted >= 5,
  },
]
