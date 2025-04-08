"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { AlgorithmSelector } from "@/components/features/algorithms/AlgorithmSelector"
import { ArrayControls } from "@/components/features/arrays/ArrayControls"
import { StatisticsPanel } from "@/components/sections/StatisticsPanel"

interface AlgorithmControlsProps {
  algorithm: string
  setAlgorithm: (algorithm: string) => void
  arraySize: number
  setArraySize: (size: number) => void
  speed: number
  setSpeed: (speed: number) => void
  running: boolean
  showDetails: boolean
  setShowDetails: (show: boolean) => void
  generateArray: () => void
  generateNearlySortedArray: () => void
  generateReversedArray: () => void
  generateFewUniqueArray: () => void
  array: number[]
  raceMode: boolean
  startSorting: () => void
  stopSorting: () => void
  startRace: () => void
  resetAll: () => void
  resetRace: () => void // Add this line
  raceResults: any[]
  currentStep: string
  progress: number
  comparisons: number
  swaps: number
  executionTime: number
  raceAlgorithms: string[]
}

export function AlgorithmControls({
  algorithm,
  setAlgorithm,
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  running,
  showDetails,
  setShowDetails,
  generateArray,
  generateNearlySortedArray,
  generateReversedArray,
  generateFewUniqueArray,
  array,
  raceMode,
  startSorting,
  stopSorting,
  startRace,
  resetAll,
  resetRace, // Add this line
  raceResults,
  currentStep,
  progress,
  comparisons,
  swaps,
  executionTime,
  raceAlgorithms,
}: AlgorithmControlsProps) {
  return (
    <Card className="mb-4 sm:mb-8 dark:bg-[#1C1C1C]/90 bg-white/90 border-0 shadow-lg rounded-xl sm:rounded-2xl backdrop-blur-sm transition-colors">
      <CardHeader className="dark:border-b dark:border-[#444444] border-b border-blue-200 rounded-t-xl sm:rounded-t-2xl transition-colors p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 dark:text-[#FF6F61] text-blue-600 font-semibold transition-colors">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 dark:text-[#FF6F61] text-blue-500 transition-colors" />
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent transition-colors">
            Sorting Algorithm Speed Visualizer
          </span>
        </CardTitle>
        <CardDescription className="dark:text-[#F5E8D8]/70 text-gray-500 text-sm sm:text-base transition-colors">
          Compare the performance of different sorting algorithms in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <AlgorithmSelector
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              running={running}
              raceMode={raceMode}
              showDetails={showDetails}
              setShowDetails={setShowDetails}
            />

            <ArrayControls
              arraySize={arraySize}
              setArraySize={setArraySize}
              speed={speed}
              setSpeed={setSpeed}
              running={running}
              generateArray={generateArray}
              generateNearlySortedArray={generateNearlySortedArray}
              generateReversedArray={generateReversedArray}
              generateFewUniqueArray={generateFewUniqueArray}
            />
          </div>

          <StatisticsPanel
            comparisons={comparisons}
            swaps={swaps}
            executionTime={executionTime}
            running={running}
            currentStep={currentStep}
            progress={progress}
            raceMode={raceMode}
            startSorting={startSorting}
            stopSorting={stopSorting}
            startRace={startRace}
            resetAll={resetAll}
            resetRace={resetRace} // Add this line
            raceAlgorithms={raceAlgorithms}
            raceResults={raceResults}
          />
        </div>
      </CardContent>
    </Card>
  )
}
