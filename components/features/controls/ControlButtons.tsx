"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Rocket } from "lucide-react"

interface ControlButtonsProps {
  running: boolean
  raceMode: boolean
  raceAlgorithms: string[]
  startSorting: () => void
  stopSorting: () => void
  startRace: () => void
  resetAll: () => void
}

export function ControlButtons({
  running,
  raceMode,
  raceAlgorithms,
  startSorting,
  stopSorting,
  startRace,
  resetAll,
}: ControlButtonsProps) {
  return (
    <div className="flex gap-2">
      {!raceMode ? (
        <>
          <Button
            onClick={startSorting}
            disabled={running}
            className="flex-1 dark:bg-red-600 dark:hover:bg-red-700 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
          <Button
            onClick={stopSorting}
            disabled={!running}
            variant="outline"
            className="flex-1 dark:border-red-500 dark:text-red-300 dark:hover:bg-red-900/20 border-blue-400 text-blue-500 hover:bg-blue-100"
          >
            <Pause className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </>
      ) : (
        <Button
          onClick={startRace}
          disabled={running || raceAlgorithms.length < 2}
          className="flex-1 dark:bg-red-600 dark:hover:bg-red-700 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Start Race
        </Button>
      )}
      <Button
        onClick={resetAll}
        disabled={running}
        variant="outline"
        className="flex-1 dark:border-red-500 dark:text-red-300 dark:hover:bg-red-900/20 border-blue-400 text-blue-500 hover:bg-blue-100"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  )
}
