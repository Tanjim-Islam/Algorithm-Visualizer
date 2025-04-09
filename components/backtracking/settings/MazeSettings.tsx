"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { MazeAlgorithm } from "@/hooks/useBacktracking"
import { RefreshCw, SquareMIcon as Maze, Footprints } from "lucide-react"

interface MazeSettingsProps {
  mazeConfig: {
    maze: number[][]
    start: [number, number]
    end: [number, number]
  }
  setMazeConfig: (config: { maze: number[][]; start: [number, number]; end: [number, number] }) => void
  mazeAlgorithm: MazeAlgorithm
  setMazeAlgorithm: (algorithm: MazeAlgorithm) => void
  wallDensity: number
  setWallDensity: (density: number) => void
  showVisitedCells: boolean
  setShowVisitedCells: (show: boolean) => void
  resetVisualization: () => void
  running: boolean
}

export function MazeSettings({
  mazeConfig,
  setMazeConfig,
  mazeAlgorithm,
  setMazeAlgorithm,
  wallDensity,
  setWallDensity,
  showVisitedCells,
  setShowVisitedCells,
  resetVisualization,
  running,
}: MazeSettingsProps) {
  const [mazeSize, setMazeSize] = useState<number>(mazeConfig.maze.length)
  const [startRow, setStartRow] = useState<string>(mazeConfig.start[0].toString())
  const [startCol, setStartCol] = useState<string>(mazeConfig.start[1].toString())
  const [endRow, setEndRow] = useState<string>(mazeConfig.end[0].toString())
  const [endCol, setEndCol] = useState<string>(mazeConfig.end[1].toString())

  // Function to generate a new maze
  const generateNewMaze = () => {
    // Create a new maze with the specified size and wall density
    const newMaze: number[][] = []
    for (let i = 0; i < mazeSize; i++) {
      const row: number[] = []
      for (let j = 0; j < mazeSize; j++) {
        // 0 = path, 1 = wall
        row.push(Math.random() < wallDensity / 100 ? 1 : 0)
      }
      newMaze.push(row)
    }

    // Ensure start and end positions are valid and not walls
    const start: [number, number] = [Number.parseInt(startRow) || 0, Number.parseInt(startCol) || 0]
    const end: [number, number] = [Number.parseInt(endRow) || mazeSize - 1, Number.parseInt(endCol) || mazeSize - 1]

    // Make sure start and end positions are within bounds
    if (start[0] < 0 || start[0] >= mazeSize) start[0] = 0
    if (start[1] < 0 || start[1] >= mazeSize) start[1] = 0
    if (end[0] < 0 || end[0] >= mazeSize) end[0] = mazeSize - 1
    if (end[1] < 0 || end[1] >= mazeSize) end[1] = mazeSize - 1

    // Ensure start and end positions are not walls
    newMaze[start[0]][start[1]] = 0
    newMaze[end[0]][end[1]] = 0

    // Update state
    setMazeConfig({
      maze: newMaze,
      start,
      end,
    })

    // Update form values
    setStartRow(start[0].toString())
    setStartCol(start[1].toString())
    setEndRow(end[0].toString())
    setEndCol(end[1].toString())

    resetVisualization()
  }

  // Function to update start and end positions
  const updatePositions = () => {
    const start: [number, number] = [Number.parseInt(startRow) || 0, Number.parseInt(startCol) || 0]
    const end: [number, number] = [Number.parseInt(endRow) || mazeSize - 1, Number.parseInt(endCol) || mazeSize - 1]

    // Make sure positions are within bounds
    if (start[0] < 0 || start[0] >= mazeSize) start[0] = 0
    if (start[1] < 0 || start[1] >= mazeSize) start[1] = 0
    if (end[0] < 0 || end[0] >= mazeSize) end[0] = mazeSize - 1
    if (end[1] < 0 || end[1] >= mazeSize) end[1] = mazeSize - 1

    // Create a copy of the current maze
    const newMaze = JSON.parse(JSON.stringify(mazeConfig.maze))

    // Ensure start and end positions are not walls
    newMaze[start[0]][start[1]] = 0
    newMaze[end[0]][end[1]] = 0

    // Update state
    setMazeConfig({
      maze: newMaze,
      start,
      end,
    })

    resetVisualization()
  }

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors mb-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold dark:text-[#F5E8D8] text-gray-800">Maze Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maze-size" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
              Maze Size
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="maze-size"
                type="number"
                min={5}
                max={20}
                value={mazeSize}
                onChange={(e) => setMazeSize(Number.parseInt(e.target.value) || 8)}
                disabled={running}
                className="w-20"
              />
              <span className="text-sm dark:text-[#F5E8D8]/70 text-gray-500">(5-20)</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maze-algorithm" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
              Generation Algorithm
            </Label>
            <Select
              value={mazeAlgorithm}
              onValueChange={(value: MazeAlgorithm) => {
                setMazeAlgorithm(value)
                resetVisualization()
              }}
              disabled={running}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">
                  <div className="flex items-center">
                    <Maze className="h-4 w-4 mr-2" />
                    <span>Random</span>
                  </div>
                </SelectItem>
                <SelectItem value="recursive-division">
                  <div className="flex items-center">
                    <Maze className="h-4 w-4 mr-2" />
                    <span>Recursive Division</span>
                  </div>
                </SelectItem>
                <SelectItem value="prim">
                  <div className="flex items-center">
                    <Maze className="h-4 w-4 mr-2" />
                    <span>Prim's Algorithm</span>
                  </div>
                </SelectItem>
                <SelectItem value="custom">
                  <div className="flex items-center">
                    <Maze className="h-4 w-4 mr-2" />
                    <span>Custom</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="wall-density" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
              Wall Density: {wallDensity}%
            </Label>
          </div>
          <Slider
            id="wall-density"
            min={10}
            max={50}
            step={5}
            value={[wallDensity]}
            onValueChange={(value) => setWallDensity(value[0])}
            disabled={running}
            className="dark:bg-[#444444] bg-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">Start Position</Label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="start-row" className="text-xs dark:text-[#F5E8D8]/70 text-gray-500">
                  Row:
                </Label>
                <Input
                  id="start-row"
                  type="number"
                  min={0}
                  max={mazeSize - 1}
                  value={startRow}
                  onChange={(e) => setStartRow(e.target.value)}
                  disabled={running}
                  className="w-16"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="start-col" className="text-xs dark:text-[#F5E8D8]/70 text-gray-500">
                  Col:
                </Label>
                <Input
                  id="start-col"
                  type="number"
                  min={0}
                  max={mazeSize - 1}
                  value={startCol}
                  onChange={(e) => setStartCol(e.target.value)}
                  disabled={running}
                  className="w-16"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">End Position</Label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="end-row" className="text-xs dark:text-[#F5E8D8]/70 text-gray-500">
                  Row:
                </Label>
                <Input
                  id="end-row"
                  type="number"
                  min={0}
                  max={mazeSize - 1}
                  value={endRow}
                  onChange={(e) => setEndRow(e.target.value)}
                  disabled={running}
                  className="w-16"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="end-col" className="text-xs dark:text-[#F5E8D8]/70 text-gray-500">
                  Col:
                </Label>
                <Input
                  id="end-col"
                  type="number"
                  min={0}
                  max={mazeSize - 1}
                  value={endCol}
                  onChange={(e) => setEndCol(e.target.value)}
                  disabled={running}
                  className="w-16"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-visited"
            checked={showVisitedCells}
            onCheckedChange={setShowVisitedCells}
            disabled={running}
          />
          <Label
            htmlFor="show-visited"
            className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700 flex items-center gap-2"
          >
            <Footprints className="h-4 w-4 dark:text-[#FF6F61] text-blue-500" />
            Show Visited Cells
          </Label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateNewMaze}
            disabled={running}
            className="flex-1 dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Maze
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={updatePositions}
            disabled={running}
            className="flex-1 dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
          >
            Update Positions
          </Button>
        </div>
      </div>
    </Card>
  )
}
