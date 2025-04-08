"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Map, RotateCcw } from "lucide-react"
import { CustomSlider } from "@/components/ui/custom-slider"

interface PathfindingSettingsProps {
  speed: number
  setSpeed: (speed: number) => void
  isRunning: boolean
  generateMaze: () => void
  clearPath: () => void
  resetGrid: () => void
}

export function PathfindingSettings({
  speed,
  setSpeed,
  isRunning,
  generateMaze,
  clearPath,
  resetGrid,
}: PathfindingSettingsProps) {
  // Format speed display
  const formatSpeed = (value: number) => {
    if (value < 1) {
      return `${value.toFixed(1)}ms`
    }
    return `${value}ms`
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <Label className="text-xs sm:text-sm font-medium mb-1 block dark:text-[#F5E8D8] text-gray-700 transition-colors">
          Animation Speed: {formatSpeed(speed)}
        </Label>
        <CustomSlider
          value={[speed]}
          min={10}
          max={500}
          step={10}
          onValueChange={(value) => setSpeed(value[0])}
          disabled={isRunning}
          className="py-3 sm:py-4 relative"
          thumbClassName="dark:bg-[#FF6F61] bg-blue-500 dark:border-[#d35f5f] border-blue-300 dark:shadow-[0_0_10px_rgba(255,111,97,0.5)] shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-colors"
          trackClassName="dark:bg-[#FF6F61]/50 bg-blue-500/50 dark:shadow-[0_0_8px_rgba(255,111,97,0.3)] shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-colors"
        />
        <p className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 mt-1 transition-colors">
          Higher value = slower animation
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={generateMaze}
          disabled={isRunning}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
        >
          <Map className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Generate Maze
        </Button>
        <Button
          onClick={clearPath}
          disabled={isRunning}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
        >
          <RotateCcw className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Clear Path
        </Button>
        <Button
          onClick={resetGrid}
          disabled={isRunning}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
        >
          <RotateCcw className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Reset Grid
        </Button>
      </div>
    </div>
  )
}
