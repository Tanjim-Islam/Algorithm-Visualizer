"use client"

import { Badge } from "@/components/ui/badge"
import { BarsVisualization } from "@/components/features/visualization/BarsVisualization"
import { DotsVisualization } from "@/components/features/visualization/DotsVisualization"
import { NumbersVisualization } from "@/components/features/visualization/NumbersVisualization"
import { algorithms } from "@/lib/algorithms"
import { useEffect } from "react"

interface RaceVisualizationContainerProps {
  algorithm: string
  array: number[]
  visualizationMode: string
  barStyle: string
  running: boolean
  activeIndices: number[]
}

export function RaceVisualizationContainer({
  algorithm,
  array,
  visualizationMode,
  barStyle,
  running,
  activeIndices,
}: RaceVisualizationContainerProps) {
  // Initialize global state objects if they don't exist
  useEffect(() => {
    // Initialize the global state objects for this algorithm if they don't exist
    if (!window[`raceArray_${algorithm}`]) {
      window[`raceArray_${algorithm}`] = [...array]
    }

    if (!window[`raceActiveIndices_${algorithm}`]) {
      window[`raceActiveIndices_${algorithm}`] = []
    }
  }, [algorithm, array])

  // Get the current array and active indices from the global state
  const currentArray = window[`raceArray_${algorithm}`] || [...array]
  const currentActiveIndices = window[`raceActiveIndices_${algorithm}`] || []

  // Log for debugging
  console.log(`Rendering container for algorithm: ${algorithm}`, {
    arrayLength: currentArray.length,
    activeIndices: currentActiveIndices,
  })

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 text-center">
        <Badge
          variant="outline"
          className="dark:border-[#FF6F61] dark:text-[#F5E8D8] border-blue-400 text-blue-500 rounded-full px-3 py-1 text-xs font-medium transition-colors"
        >
          {algorithms[algorithm].name}
        </Badge>
      </div>
      <div className="flex-1 border dark:border-[#444444] border-gray-200 rounded-lg overflow-hidden">
        {visualizationMode === "bars" ? (
          <BarsVisualization
            array={currentArray}
            activeIndices={currentActiveIndices}
            barStyle={barStyle}
            accessPattern={[]}
            running={running}
            handleDragStart={() => {}}
            handleDragOver={() => {}}
            handleDrop={() => {}}
            isRaceMode={true}
          />
        ) : visualizationMode === "dots" ? (
          <DotsVisualization
            array={currentArray}
            activeIndices={currentActiveIndices}
            running={running}
            handleDragStart={() => {}}
            handleDragOver={() => {}}
            handleDrop={() => {}}
            isRaceMode={true}
          />
        ) : (
          <NumbersVisualization
            array={currentArray}
            activeIndices={currentActiveIndices}
            dragOverIndex={null}
            running={running}
            handleDragStart={() => {}}
            handleDragOver={() => {}}
            handleDrop={() => {}}
            isRaceMode={true}
          />
        )}
      </div>
    </div>
  )
}
