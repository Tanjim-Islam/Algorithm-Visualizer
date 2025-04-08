"use client"

import { Button } from "@/components/ui/button"
import { Trophy, Wand2 } from "lucide-react"
import { challenges } from "@/lib/challenges"

interface ChallengeControlsProps {
  running: boolean
  startChallenge: () => void
  completeChallenge: () => void
  currentChallenge: number
  array: number[]
}

export function ChallengeControls({
  running,
  startChallenge,
  completeChallenge,
  currentChallenge,
  array,
}: ChallengeControlsProps) {
  // Check if array is sorted
  const isSorted = array.length > 0 && array.every((val, i, arr) => i === 0 || val >= arr[i - 1])

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={startChallenge}
        disabled={running}
        variant="outline"
        size="sm"
        className="dark:border-red-500 dark:text-red-300 dark:hover:bg-red-900/20 border-blue-400 text-blue-500 hover:bg-blue-100"
      >
        <Trophy className="mr-1 h-4 w-4" />
        Challenge: {challenges[currentChallenge].name}
      </Button>

      {isSorted && (
        <Button
          onClick={completeChallenge}
          variant="outline"
          size="sm"
          className="dark:border-green-500 dark:text-green-300 dark:hover:bg-green-900/20 border-green-400 text-green-500 hover:bg-green-100"
        >
          <Wand2 className="mr-1 h-4 w-4" />
          Complete Challenge
        </Button>
      )}
    </div>
  )
}
