"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Rocket } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { RaceResults } from "@/components/features/race/RaceResults"

interface StatisticsPanelProps {
  comparisons: number
  swaps: number
  executionTime: number
  running: boolean
  currentStep: string
  progress: number
  raceMode: boolean
  startSorting: () => void
  stopSorting: () => void
  startRace: () => void
  resetAll: () => void
  resetRace: () => void // New prop for resetting race specifically
  raceAlgorithms: string[]
  raceResults: any[]
}

export function StatisticsPanel({
  comparisons,
  swaps,
  executionTime,
  running,
  currentStep,
  progress,
  raceMode,
  startSorting,
  stopSorting,
  startRace,
  resetAll,
  resetRace, // New prop
  raceAlgorithms,
  raceResults,
}: StatisticsPanelProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 transition-colors">
          <div className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 transition-colors">Comparisons</div>
          <div className="text-lg sm:text-2xl font-bold dark:text-[#FF6F61] text-blue-600 transition-colors">
            {comparisons}
          </div>
        </div>
        <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 transition-colors">
          <div className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 transition-colors">Swaps</div>
          <div className="text-lg sm:text-2xl font-bold dark:text-[#FF6F61] text-blue-600 transition-colors">
            {swaps}
          </div>
        </div>
        <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 transition-colors">
          <div className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 transition-colors">Time</div>
          <div className="text-lg sm:text-2xl font-bold dark:text-[#FF6F61] text-blue-600 transition-colors">
            {(executionTime / 1000).toFixed(2)}s
          </div>
        </div>
        <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 transition-colors">
          <div className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 transition-colors">Status</div>
          <div className="text-lg sm:text-2xl font-bold dark:text-[#FF6F61] text-blue-600 transition-colors">
            {running ? "Running" : "Idle"}
          </div>
        </div>
      </div>

      <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 min-h-[50px] sm:min-h-[60px] flex items-center transition-colors">
        <div className="text-xs sm:text-sm dark:text-[#F5E8D8] text-gray-700 w-full transition-colors">
          {raceMode
            ? running
              ? "Race in progress! Algorithms are competing..."
              : "Ready to start the algorithm race!"
            : currentStep || "Ready to start visualization"}
          {running && !raceMode && (
            <Progress
              value={progress}
              className="mt-2 h-1.5 sm:h-2 dark:bg-[#FF6F61]/30 bg-blue-200 transition-colors"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {raceMode ? (
          <>
            <Button
              onClick={startRace}
              disabled={running || raceAlgorithms.length < 2}
              className="flex-1 dark:bg-[#FF6F61] dark:hover:bg-[#e05a4d] bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              <Rocket className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Start Race
            </Button>
            <Button
              onClick={stopSorting}
              disabled={!running}
              variant="outline"
              className="flex-1 dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              <Pause className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Stop
            </Button>
            <Button
              onClick={resetRace} // Use resetRace instead of resetAll for race mode
              disabled={running}
              variant="outline"
              className="flex-1 dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Reset
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={startSorting}
              disabled={running}
              className="flex-1 dark:bg-[#FF6F61] dark:hover:bg-[#e05a4d] bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              <Play className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Start
            </Button>
            <Button
              onClick={stopSorting}
              disabled={!running}
              variant="outline"
              className="flex-1 dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              <Pause className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Stop
            </Button>
            <Button
              onClick={resetAll}
              disabled={running}
              variant="outline"
              className="flex-1 dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Reset
            </Button>
          </>
        )}
      </div>

      <AnimatePresence>{raceResults.length > 0 && <RaceResults results={raceResults} />}</AnimatePresence>
    </div>
  )
}
