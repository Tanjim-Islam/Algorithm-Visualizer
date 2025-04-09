"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { KnightsTourType, VisualizationStyle } from "@/hooks/useBacktracking"
import { RefreshCw, CastleIcon as ChessKnight, ArrowRightCircle } from "lucide-react"

interface KnightsTourSettingsProps {
  knightsTourSize: number
  setKnightsTourSize: (size: number) => void
  knightsTourType: KnightsTourType
  setKnightsTourType: (type: KnightsTourType) => void
  visualizationStyle: VisualizationStyle
  setVisualizationStyle: (style: VisualizationStyle) => void
  resetVisualization: () => void
  running: boolean
}

export function KnightsTourSettings({
  knightsTourSize,
  setKnightsTourSize,
  knightsTourType,
  setKnightsTourType,
  visualizationStyle,
  setVisualizationStyle,
  resetVisualization,
  running,
}: KnightsTourSettingsProps) {
  const [startRow, setStartRow] = useState<string>("0")
  const [startCol, setStartCol] = useState<string>("0")

  const handleSizeChange = (size: number) => {
    if (size >= 5 && size <= 8) {
      setKnightsTourSize(size)
      resetVisualization()
    }
  }

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors mb-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold dark:text-[#F5E8D8] text-gray-800">Knight's Tour Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="board-size" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
              Board Size
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="board-size"
                type="number"
                min={5}
                max={8}
                value={knightsTourSize}
                onChange={(e) => handleSizeChange(Number.parseInt(e.target.value))}
                disabled={running}
                className="w-20"
              />
              <span className="text-sm dark:text-[#F5E8D8]/70 text-gray-500">(5-8)</span>
            </div>
            <p className="text-xs dark:text-[#F5E8D8]/60 text-gray-500 italic">
              Note: Larger boards may be very slow to solve
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tour-type" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
              Tour Type
            </Label>
            <Select
              value={knightsTourType}
              onValueChange={(value: KnightsTourType) => {
                setKnightsTourType(value)
                resetVisualization()
              }}
              disabled={running}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tour type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">
                  <div className="flex items-center">
                    <ChessKnight className="h-4 w-4 mr-2" />
                    <span>Open Tour (Any End Position)</span>
                  </div>
                </SelectItem>
                <SelectItem value="closed">
                  <div className="flex items-center">
                    <ArrowRightCircle className="h-4 w-4 mr-2" />
                    <span>Closed Tour (Can Return to Start)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visualization-style" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
            Visualization Style
          </Label>
          <Select
            value={visualizationStyle}
            onValueChange={(value: VisualizationStyle) => {
              setVisualizationStyle(value)
              resetVisualization()
            }}
            disabled={running}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">
                <div className="flex items-center">
                  <ChessKnight className="h-4 w-4 mr-2" />
                  <span>Knight Symbol</span>
                </div>
              </SelectItem>
              <SelectItem value="numbers">
                <div className="flex items-center">
                  <span className="w-4 h-4 flex items-center justify-center mr-2 text-xs font-bold">1,2..</span>
                  <span>Move Numbers</span>
                </div>
              </SelectItem>
              <SelectItem value="arrows">
                <div className="flex items-center">
                  <ArrowRightCircle className="h-4 w-4 mr-2" />
                  <span>Path Arrows</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetVisualization}
          disabled={running}
          className="w-full dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset with Current Settings
        </Button>
      </div>
    </Card>
  )
}
