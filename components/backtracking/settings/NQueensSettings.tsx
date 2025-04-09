"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { VisualizationStyle } from "@/hooks/useBacktracking"
import { RefreshCw, Crown, Hash } from "lucide-react"

interface NQueensSettingsProps {
  nQueensSize: number
  setNQueensSize: (size: number) => void
  nQueensConfig: {
    startingPosition: [number, number] | null
  }
  setNQueensConfig: (config: { startingPosition: [number, number] | null }) => void
  findAllSolutions: boolean
  setFindAllSolutions: (find: boolean) => void
  visualizationStyle: VisualizationStyle
  setVisualizationStyle: (style: VisualizationStyle) => void
  resetVisualization: () => void
  running: boolean
}

export function NQueensSettings({
  nQueensSize,
  setNQueensSize,
  nQueensConfig,
  setNQueensConfig,
  findAllSolutions,
  setFindAllSolutions,
  visualizationStyle,
  setVisualizationStyle,
  resetVisualization,
  running,
}: NQueensSettingsProps) {
  const [startRow, setStartRow] = useState<string>(
    nQueensConfig.startingPosition ? nQueensConfig.startingPosition[0].toString() : "",
  )
  const [startCol, setStartCol] = useState<string>(
    nQueensConfig.startingPosition ? nQueensConfig.startingPosition[1].toString() : "",
  )

  const handleSizeChange = (size: number) => {
    if (size >= 4 && size <= 12) {
      setNQueensSize(size)
      resetVisualization()
    }
  }

  const handleStartingPositionChange = () => {
    const row = Number.parseInt(startRow)
    const col = Number.parseInt(startCol)

    if (!isNaN(row) && !isNaN(col) && row >= 0 && row < nQueensSize && col >= 0 && col < nQueensSize) {
      setNQueensConfig({ startingPosition: [row, col] })
      resetVisualization()
    } else {
      // Clear starting position if invalid
      setNQueensConfig({ startingPosition: null })
      resetVisualization()
    }
  }

  const clearStartingPosition = () => {
    setStartRow("")
    setStartCol("")
    setNQueensConfig({ startingPosition: null })
    resetVisualization()
  }

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors mb-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold dark:text-[#F5E8D8] text-gray-800">N-Queens Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="board-size" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
              Board Size (N)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="board-size"
                type="number"
                min={4}
                max={12}
                value={nQueensSize}
                onChange={(e) => handleSizeChange(Number.parseInt(e.target.value))}
                disabled={running}
                className="w-20"
              />
              <span className="text-sm dark:text-[#F5E8D8]/70 text-gray-500">(4-12)</span>
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
                <SelectItem value="chess">
                  <div className="flex items-center">
                    <Crown className="h-4 w-4 mr-2" />
                    <span>Chess Pieces</span>
                  </div>
                </SelectItem>
                <SelectItem value="numbers">
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-2" />
                    <span>Numbers</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
            Starting Queen Position (Optional)
          </Label>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="start-row" className="text-xs dark:text-[#F5E8D8]/70 text-gray-500">
                Row:
              </Label>
              <Input
                id="start-row"
                type="number"
                min={0}
                max={nQueensSize - 1}
                value={startRow}
                onChange={(e) => setStartRow(e.target.value)}
                onBlur={handleStartingPositionChange}
                disabled={running}
                className="w-16"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="start-col" className="text-xs dark:text-[#F5E8D8]/70 text-gray-500">
                Column:
              </Label>
              <Input
                id="start-col"
                type="number"
                min={0}
                max={nQueensSize - 1}
                value={startCol}
                onChange={(e) => setStartCol(e.target.value)}
                onBlur={handleStartingPositionChange}
                disabled={running}
                className="w-16"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearStartingPosition}
              disabled={running || (!startRow && !startCol)}
              className="dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500/10 border-red-400 text-red-500 hover:bg-red-50 transition-colors"
            >
              Clear
            </Button>
          </div>
          <p className="text-xs dark:text-[#F5E8D8]/60 text-gray-500 italic">
            Note: Indices start from 0. For a {nQueensSize}x{nQueensSize} board, valid indices are 0 to{" "}
            {nQueensSize - 1}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="find-all-solutions"
            checked={findAllSolutions}
            onCheckedChange={(checked) => {
              setFindAllSolutions(checked)
              resetVisualization()
            }}
            disabled={running}
          />
          <Label htmlFor="find-all-solutions" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
            Find All Solutions (may be slow for large boards)
          </Label>
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
