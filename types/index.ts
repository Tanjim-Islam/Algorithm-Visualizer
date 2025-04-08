import type { ReactNode } from "react"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: ReactNode
  condition: (stats: any) => boolean
}

export interface Stats {
  totalSorts: number
  fastestSort: number
  algorithmsUsed: Record<string, boolean>
  minComparisons: number
  arraySize: number
  challengesCompleted: number
}
