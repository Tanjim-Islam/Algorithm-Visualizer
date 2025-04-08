"use client"

import { Label } from "@/components/ui/label"
import { CustomSlider } from "@/components/ui/custom-slider"
import { Switch } from "@/components/ui/switch"

interface GraphSettingsProps {
  speed: number
  setSpeed: (speed: number) => void
  isRunning: boolean
  isDirected: boolean
  isWeighted: boolean
  toggleDirected: () => void
  toggleWeighted: () => void
  generateRandomGraph: () => void
  clearGraph: () => void
  resetGraph: () => void
}

export function GraphSettings({
  speed,
  setSpeed,
  isRunning,
  isDirected,
  isWeighted,
  toggleDirected,
  toggleWeighted,
  generateRandomGraph,
  clearGraph,
  resetGraph,
}: GraphSettingsProps) {
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

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#333333]/50 bg-gray-100/80 transition-colors">
          <Switch id="directed-mode" checked={isDirected} onCheckedChange={toggleDirected} disabled={isRunning} />
          <Label htmlFor="directed-mode" className="text-xs sm:text-sm font-medium">
            Directed Graph
          </Label>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#333333]/50 bg-gray-100/80 transition-colors">
          <Switch id="weighted-mode" checked={isWeighted} onCheckedChange={toggleWeighted} disabled={isRunning} />
          <Label htmlFor="weighted-mode" className="text-xs sm:text-sm font-medium">
            Weighted Edges
          </Label>
        </div>
      </div>
    </div>
  )
}
