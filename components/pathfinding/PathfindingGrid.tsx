"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface Node {
  row: number
  col: number
  isStart: boolean
  isFinish: boolean
  isWall: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  previousNode: Node | null
}

interface PathfindingGridProps {
  grid: Node[][]
  onMouseDown: (row: number, col: number) => void
  onMouseEnter: (row: number, col: number) => void
  onMouseUp: () => void
}

export function PathfindingGrid({ grid, onMouseDown, onMouseEnter, onMouseUp }: PathfindingGridProps) {
  const { theme } = useTheme()

  return (
    <div
      className="grid gap-[1px] sm:gap-[2px] mx-auto"
      style={{
        gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
        maxWidth: "100%",
        overflow: "auto",
      }}
      onMouseLeave={onMouseUp}
    >
      {grid.map((row, rowIdx) =>
        row.map((node, nodeIdx) => {
          const { row, col, isStart, isFinish, isWall, isVisited, isPath } = node

          let extraClassName = ""

          if (isStart) {
            extraClassName = "bg-green-500"
          } else if (isFinish) {
            extraClassName = "bg-red-500"
          } else if (isWall) {
            extraClassName = "bg-gray-800 dark:bg-gray-600"
          } else if (isPath) {
            extraClassName = "bg-yellow-300 dark:bg-yellow-500"
          } else if (isVisited) {
            extraClassName = "bg-blue-300 dark:bg-blue-700"
          } else {
            extraClassName = "bg-white dark:bg-[#1C1C1C]"
          }

          return (
            <motion.div
              key={`${row}-${col}`}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm sm:rounded-md cursor-pointer border border-gray-200 dark:border-gray-700 ${extraClassName}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  delay: 0.01 * (row + col),
                  duration: 0.2,
                },
              }}
              whileHover={{ scale: 1.1 }}
              onMouseDown={() => onMouseDown(row, col)}
              onMouseEnter={() => onMouseEnter(row, col)}
              onMouseUp={onMouseUp}
            />
          )
        }),
      )}
    </div>
  )
}
