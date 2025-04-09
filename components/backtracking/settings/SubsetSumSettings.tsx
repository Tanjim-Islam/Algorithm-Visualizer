"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { VisualizationStyle } from "@/hooks/useBacktracking"
import { RefreshCw, PlusCircle, BarChart, PieChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SubsetSumSettingsProps {
  subsetSumConfig: {
    numbers: number[]
    target: number
  }
  setSubsetSumConfig: (config: { numbers: number[]; target: number }) => void
  findAllSolutions: boolean
  setFindAllSolutions: (find: boolean) => void
  maxSubsetSize: number | null
  setMaxSubsetSize: (size: number | null) => void
  visualizationStyle: VisualizationStyle
  setVisualizationStyle: (style: VisualizationStyle) => void
  resetVisualization: () => void
  running: boolean
}

export function SubsetSumSettings({
  subsetSumConfig,
  setSubsetSumConfig,
  findAllSolutions,
  setFindAllSolutions,
  maxSubsetSize,
  setMaxSubsetSize,
  visualizationStyle,
  setVisualizationStyle,
  resetVisualization,
  running,
}: SubsetSumSettingsProps) {
  const [numbers, setNumbers] = useState<string>(subsetSumConfig.numbers.join(", "))
  const [target, setTarget] = useState<string>(subsetSumConfig.target.toString())
  const [maxSize, setMaxSize] = useState<string>(maxSubsetSize ? maxSubsetSize.toString() : "")
  const [newNumber, setNewNumber] = useState<string>("")

  const updateConfig = () => {
    // Parse numbers
    const parsedNumbers = numbers
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n !== "")
      .map((n) => Number.parseInt(n))
      .filter((n) => !isNaN(n))

    // Parse target
    const parsedTarget = Number.parseInt(target)

    // Parse max subset size
    const parsedMaxSize = maxSize ? Number.parseInt(maxSize) : null

    // Update config
    if (parsedNumbers.length > 0 && !isNaN(parsedTarget)) {
      setSubsetSumConfig({
        numbers: parsedNumbers,
        target: parsedTarget,
      })
      setMaxSubsetSize(parsedMaxSize)
      resetVisualization()
    }
  }

  const addNumber = () => {
    const num = Number.parseInt(newNumber)
    if (!isNaN(num)) {
      const currentNumbers = numbers ? numbers.split(",").map((n) => n.trim()) : []
      currentNumbers.push(num.toString())
      setNumbers(currentNumbers.join(", "))
      setNewNumber("")
    }
  }

  const removeNumber = (index: number) => {
    const currentNumbers = numbers.split(",").map((n) => n.trim())
    currentNumbers.splice(index, 1)
    setNumbers(currentNumbers.join(", "))
  }

  const generateRandomNumbers = () => {
    // Generate 5-10 random numbers between 1 and 50
    const count = Math.floor(Math.random() * 6) + 5
    const randomNumbers: number[] = []
    for (let i = 0; i < count; i++) {
      randomNumbers.push(Math.floor(Math.random() * 50) + 1)
    }

    // Set a reasonable target (30-70% of the sum)
    const sum = randomNumbers.reduce((a, b) => a + b, 0)
    const targetValue = Math.floor(sum * (Math.random() * 0.4 + 0.3))

    setNumbers(randomNumbers.join(", "))
    setTarget(targetValue.toString())
  }

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors mb-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold dark:text-[#F5E8D8] text-gray-800">Subset Sum Settings</h3>

        <div className="space-y-2">
          <Label htmlFor="numbers" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
            Numbers
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {numbers.split(",").map((num, index) => {
              const trimmed = num.trim()
              if (trimmed === "") return null
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1 dark:border-[#FF6F61] dark:text-[#F5E8D8] border-blue-400 text-blue-500"
                >
                  {trimmed}
                  <button
                    onClick={() => removeNumber(index)}
                    disabled={running}
                    className="ml-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    ×
                  </button>
                </Badge>
              )
            })}
          </div>
          <div className="flex gap-2">
            <Input
              id="numbers"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              placeholder="Enter comma-separated numbers"
              disabled={running}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={generateRandomNumbers}
              disabled={running}
              className="dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
            >
              Random
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="Add a number"
            type="number"
            disabled={running}
            className="w-32"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={addNumber}
            disabled={running || !newNumber}
            className="dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
              Target Sum
            </Label>
            <Input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={running}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-size" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
              Max Subset Size (Optional)
            </Label>
            <Input
              id="max-size"
              type="number"
              min={1}
              value={maxSize}
              onChange={(e) => setMaxSize(e.target.value)}
              placeholder="No limit"
              disabled={running}
            />
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
                  <BarChart className="h-4 w-4 mr-2" />
                  <span>Default</span>
                </div>
              </SelectItem>
              <SelectItem value="heatmap">
                <div className="flex items-center">
                  <PieChart className="h-4 w-4 mr-2" />
                  <span>Heatmap</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
            Find All Solutions
          </Label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={updateConfig}
            disabled={running}
            className="flex-1 dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
        </div>
      </div>
    </Card>
  )
}
