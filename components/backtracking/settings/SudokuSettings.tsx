"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SudokuDifficulty } from "@/hooks/useBacktracking"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { Pencil, Trash2, Download, Upload, Wand2 } from "lucide-react"

interface SudokuSettingsProps {
  sudokuBoard: number[][]
  setSudokuBoard: (board: number[][]) => void
  showHints: boolean
  setShowHints: (show: boolean) => void
  sudokuDifficulty: SudokuDifficulty
  setSudokuDifficulty: (difficulty: SudokuDifficulty) => void
  sudokuSize: number
  setSudokuSize: (size: number) => void
  resetVisualization: () => void
  running: boolean
}

export function SudokuSettings({
  sudokuBoard,
  setSudokuBoard,
  showHints,
  setShowHints,
  sudokuDifficulty,
  setSudokuDifficulty,
  sudokuSize,
  setSudokuSize,
  resetVisualization,
  running,
}: SudokuSettingsProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [editMode, setEditMode] = useState(false)
  const [editBoard, setEditBoard] = useState<number[][]>(JSON.parse(JSON.stringify(sudokuBoard)))
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)

  // Function to generate a new Sudoku board based on difficulty
  const generateNewBoard = () => {
    // Simple implementation - in a real app, you'd use a more sophisticated algorithm
    let newBoard: number[][] = []
    let filledCells = 0

    switch (sudokuDifficulty) {
      case "easy":
        filledCells = Math.floor(sudokuSize * sudokuSize * 0.5) // 50% filled
        break
      case "medium":
        filledCells = Math.floor(sudokuSize * sudokuSize * 0.4) // 40% filled
        break
      case "hard":
        filledCells = Math.floor(sudokuSize * sudokuSize * 0.3) // 30% filled
        break
      default:
        filledCells = Math.floor(sudokuSize * sudokuSize * 0.4) // Default to medium
    }

    // Initialize empty board
    newBoard = Array(sudokuSize)
      .fill(0)
      .map(() => Array(sudokuSize).fill(0))

    // For simplicity, we'll just place random numbers that satisfy basic constraints
    // In a real app, you'd use a proper Sudoku generator
    const boxSize = Math.sqrt(sudokuSize)

    // Helper function to check if a number can be placed at (row, col)
    const isSafe = (board: number[][], row: number, col: number, num: number) => {
      // Check row
      for (let j = 0; j < sudokuSize; j++) {
        if (board[row][j] === num) return false
      }

      // Check column
      for (let i = 0; i < sudokuSize; i++) {
        if (board[i][col] === num) return false
      }

      // Check box
      const boxRow = Math.floor(row / boxSize) * boxSize
      const boxCol = Math.floor(col / boxSize) * boxSize

      for (let i = 0; i < boxSize; i++) {
        for (let j = 0; j < boxSize; j++) {
          if (board[boxRow + i][boxCol + j] === num) return false
        }
      }

      return true
    }

    // Try to fill the board with valid numbers
    let attempts = 0
    let cellsFilled = 0
    while (cellsFilled < filledCells && attempts < 1000) {
      const row = Math.floor(Math.random() * sudokuSize)
      const col = Math.floor(Math.random() * sudokuSize)

      if (newBoard[row][col] === 0) {
        const num = Math.floor(Math.random() * sudokuSize) + 1
        if (isSafe(newBoard, row, col, num)) {
          newBoard[row][col] = num
          cellsFilled++
        }
      }

      attempts++
    }

    setSudokuBoard(newBoard)
    setEditBoard(JSON.parse(JSON.stringify(newBoard)))
    resetVisualization()
  }

  // Function to handle cell click in edit mode
  const handleCellClick = (row: number, col: number) => {
    if (!editMode || running) return
    setSelectedCell([row, col])
  }

  // Function to handle number input for selected cell
  const handleNumberInput = (num: number) => {
    if (!selectedCell || !editMode || running) return

    const [row, col] = selectedCell
    const newBoard = [...editBoard]
    newBoard[row][col] = num
    setEditBoard(newBoard)
  }

  // Function to clear selected cell
  const clearSelectedCell = () => {
    if (!selectedCell || !editMode || running) return

    const [row, col] = selectedCell
    const newBoard = [...editBoard]
    newBoard[row][col] = 0
    setEditBoard(newBoard)
  }

  // Function to apply edited board
  const applyChanges = () => {
    setSudokuBoard(editBoard)
    setEditMode(false)
    resetVisualization()
  }

  // Function to cancel editing
  const cancelEditing = () => {
    setEditBoard(JSON.parse(JSON.stringify(sudokuBoard)))
    setEditMode(false)
    setSelectedCell(null)
  }

  // Function to clear the entire board
  const clearBoard = () => {
    const emptyBoard = Array(sudokuSize)
      .fill(0)
      .map(() => Array(sudokuSize).fill(0))

    setEditBoard(emptyBoard)
    if (!editMode) {
      setSudokuBoard(emptyBoard)
      resetVisualization()
    }
  }

  // Function to export the current board as JSON
  const exportBoard = () => {
    const boardJson = JSON.stringify(sudokuBoard)
    const blob = new Blob([boardJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `sudoku-board-${sudokuDifficulty}-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Function to import a board from JSON
  const importBoard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedBoard = JSON.parse(e.target?.result as string)
        if (
          Array.isArray(importedBoard) &&
          importedBoard.length === sudokuSize &&
          importedBoard.every((row) => Array.isArray(row) && row.length === sudokuSize)
        ) {
          setSudokuBoard(importedBoard)
          setEditBoard(JSON.parse(JSON.stringify(importedBoard)))
          resetVisualization()
        } else {
          alert("Invalid board format or size mismatch")
        }
      } catch (error) {
        alert("Error importing board: " + error)
      }
    }
    reader.readAsText(file)

    // Reset the input value so the same file can be imported again
    event.target.value = ""
  }

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors mb-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold dark:text-[#F5E8D8] text-gray-800">Sudoku Settings</h3>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-[#222222] bg-gray-100 rounded-lg">
            <TabsTrigger value="general" className="rounded-md">
              General Settings
            </TabsTrigger>
            <TabsTrigger value="board" className="rounded-md">
              Board Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                  Difficulty Level
                </Label>
                <Select
                  value={sudokuDifficulty}
                  onValueChange={(value: SudokuDifficulty) => {
                    setSudokuDifficulty(value)
                    if (value !== "custom") {
                      generateNewBoard()
                    }
                  }}
                  disabled={running}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                  Board Size
                </Label>
                <Select
                  value={sudokuSize.toString()}
                  onValueChange={(value) => {
                    const newSize = Number.parseInt(value)
                    setSudokuSize(newSize)
                    // Create a new empty board of the selected size
                    const newBoard = Array(newSize)
                      .fill(0)
                      .map(() => Array(newSize).fill(0))
                    setSudokuBoard(newBoard)
                    setEditBoard(JSON.parse(JSON.stringify(newBoard)))
                    resetVisualization()
                  }}
                  disabled={running}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select board size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4x4 (2x2 boxes)</SelectItem>
                    <SelectItem value="9">9x9 (3x3 boxes)</SelectItem>
                    <SelectItem value="16">16x16 (4x4 boxes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="show-hints" checked={showHints} onCheckedChange={setShowHints} disabled={running} />
              <Label htmlFor="show-hints" className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                Show Possible Values (Hints)
              </Label>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateNewBoard}
                disabled={running}
                className="flex-1 dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate New Board
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportBoard}
                disabled={running}
                className="flex-1 dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Board
              </Button>

              <div className="flex-1">
                <label htmlFor="import-board">
                  <div className="flex items-center justify-center h-9 px-3 rounded-md border dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer text-sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Board
                  </div>
                  <input
                    id="import-board"
                    type="file"
                    accept=".json"
                    onChange={importBoard}
                    disabled={running}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="board" className="mt-4 space-y-4">
            <div className="flex justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                disabled={running}
                className={`${
                  editMode ? "dark:bg-[#FF6F61]/20 bg-blue-100" : "dark:hover:bg-[#FF6F61]/10 hover:bg-blue-50"
                } dark:border-[#FF6F61] dark:text-[#FF6F61] border-blue-400 text-blue-500 transition-colors`}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {editMode ? "Editing Mode (Active)" : "Edit Board"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={clearBoard}
                disabled={running}
                className="dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500/10 border-red-400 text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Board
              </Button>
            </div>

            {editMode && (
              <div className="mb-4 p-3 rounded-lg dark:bg-[#222222] bg-gray-100">
                <p className="text-sm dark:text-[#F5E8D8]/80 text-gray-600 mb-2">
                  Click on a cell to select it, then use the number pad below to set its value.
                </p>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      size="sm"
                      onClick={() => handleNumberInput(num)}
                      disabled={!selectedCell || running || num > sudokuSize}
                      className={`${
                        num > sudokuSize ? "opacity-50 cursor-not-allowed" : ""
                      } dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors`}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelectedCell}
                    disabled={!selectedCell || running}
                    className="dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500/10 border-red-400 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            <div
              className="grid grid-cols-9 gap-0.5 sm:gap-1 mx-auto"
              style={{
                width: "100%",
                maxWidth: "500px",
                gridTemplateColumns: `repeat(${sudokuSize}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: sudokuSize }).map((_, row) =>
                Array.from({ length: sudokuSize }).map((_, col) => {
                  const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col
                  const value = editMode ? editBoard[row][col] : sudokuBoard[row][col]
                  const isOriginal = value !== 0

                  // Determine cell background color
                  let cellColor = "bg-white dark:bg-[#222222]"
                  if ((Math.floor(row / Math.sqrt(sudokuSize)) + Math.floor(col / Math.sqrt(sudokuSize))) % 2 === 0) {
                    cellColor = isDark ? "bg-[#333333]" : "bg-blue-50"
                  }

                  // Determine border styles for grid sections
                  const boxSize = Math.sqrt(sudokuSize)
                  const borderStyles = [
                    col % boxSize === boxSize - 1 && col < sudokuSize - 1 ? "border-r-2" : "border-r",
                    row % boxSize === boxSize - 1 && row < sudokuSize - 1 ? "border-b-2" : "border-b",
                    col === 0 ? "border-l" : "",
                    row === 0 ? "border-t" : "",
                  ].join(" ")

                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`
                        aspect-square flex items-center justify-center 
                        ${cellColor} ${borderStyles} 
                        ${isSelected ? "border-2 border-yellow-500 dark:border-yellow-500" : ""} 
                        dark:border-[#444444] border-gray-300 transition-colors
                        ${editMode && !running ? "cursor-pointer hover:bg-opacity-80" : ""}
                      `}
                      onClick={() => handleCellClick(row, col)}
                    >
                      {value !== 0 && (
                        <span
                          className={`text-sm sm:text-lg font-medium ${
                            isOriginal
                              ? isDark
                                ? "text-[#F5E8D8]"
                                : "text-gray-700"
                              : isDark
                                ? "text-[#FF6F61]"
                                : "text-blue-600"
                          }`}
                        >
                          {value}
                        </span>
                      )}
                    </div>
                  )
                }),
              )}
            </div>

            {editMode && (
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEditing}
                  className="dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500/10 border-red-400 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyChanges}
                  className="dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500/10 border-green-400 text-green-600 hover:bg-green-50 transition-colors"
                >
                  Apply Changes
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}
