"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface MazeSolverProps {
  maze: number[][];
  currentRow?: number;
  currentCol?: number;
  path: [number, number][];
  visited: [number, number][];
  showVisitedCells?: boolean;
  startPosition?: [number, number];
  endPosition?: [number, number];
}

export function MazeSolver({
  maze = [],
  currentRow,
  currentCol,
  path = [],
  visited = [],
  showVisitedCells = true,
  startPosition = [0, 0],
  endPosition = [7, 7],
}: MazeSolverProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Ensure maze is always a valid 2D array with at least one row and column
  const safeMaze =
    Array.isArray(maze) &&
    maze.length > 0 &&
    Array.isArray(maze[0]) &&
    maze[0].length > 0
      ? maze
      : [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ];

  // Ensure path and visited are valid arrays
  const safePath = Array.isArray(path) ? path : [];
  const safeVisited = Array.isArray(visited) ? visited : [];

  const isInPath = (row: number, col: number) => {
    return safePath.some(([r, c]) => r === row && c === col);
  };

  const isVisited = (row: number, col: number) => {
    return (
      safeVisited.some(([r, c]) => r === row && c === col) &&
      !isInPath(row, col)
    );
  };

  const isStart = (row: number, col: number) => {
    return row === startPosition[0] && col === startPosition[1];
  };

  const isEnd = (row: number, col: number) => {
    return row === endPosition[0] && col === endPosition[1];
  };

  const isCurrent = (row: number, col: number) => {
    return row === currentRow && col === currentCol;
  };

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 dark:text-[#F5E8D8] text-gray-800">
          Maze Solver
        </h3>
        <div
          className="grid gap-1 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${safeMaze[0].length}, minmax(0, 1fr))`,
            width: "100%",
            maxWidth: "500px",
          }}
        >
          {safeMaze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              // Determine cell styling
              let cellColor = "";
              if (cell === 1) {
                // Wall
                cellColor = isDark ? "bg-[#444444]" : "bg-gray-700";
              } else if (isStart(rowIndex, colIndex)) {
                // Start
                cellColor = isDark ? "bg-[#FF6F61]" : "bg-green-500";
              } else if (isEnd(rowIndex, colIndex)) {
                // End
                cellColor = isDark ? "bg-[#DAA520]" : "bg-red-500";
              } else if (isInPath(rowIndex, colIndex)) {
                // Path
                cellColor = isDark ? "bg-[#DAA520]/70" : "bg-blue-400";
              } else if (showVisitedCells && isVisited(rowIndex, colIndex)) {
                // Visited but not in path
                cellColor = isDark ? "bg-[#FF6F61]/30" : "bg-blue-200";
              } else {
                // Empty cell - using a much more visible color in light mode
                cellColor = isDark
                  ? "bg-[#333333]"
                  : "bg-yellow-100 border border-yellow-300";
              }

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square ${cellColor} rounded-md transition-colors ${
                    isCurrent(rowIndex, colIndex)
                      ? "border-2 border-white dark:border-[#F5E8D8]"
                      : ""
                  }`}
                  animate={
                    isCurrent(rowIndex, colIndex) ? { scale: [1, 1.1, 1] } : {}
                  }
                  transition={{
                    duration: 0.5,
                    repeat: isCurrent(rowIndex, colIndex)
                      ? Number.POSITIVE_INFINITY
                      : 0,
                    repeatType: "reverse",
                  }}
                />
              );
            })
          )}
        </div>
        <div className="flex justify-center mt-4 gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 ${
                isDark ? "bg-[#FF6F61]" : "bg-green-500"
              } rounded-sm`}
            ></div>
            <span className="dark:text-[#F5E8D8] text-gray-700">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 ${
                isDark ? "bg-[#DAA520]" : "bg-red-500"
              } rounded-sm`}
            ></div>
            <span className="dark:text-[#F5E8D8] text-gray-700">End</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 ${
                isDark ? "bg-[#DAA520]/70" : "bg-blue-400"
              } rounded-sm`}
            ></div>
            <span className="dark:text-[#F5E8D8] text-gray-700">Path</span>
          </div>
          {showVisitedCells && (
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 ${
                  isDark ? "bg-[#FF6F61]/30" : "bg-blue-200"
                } rounded-sm`}
              ></div>
              <span className="dark:text-[#F5E8D8] text-gray-700">Visited</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 ${
                isDark
                  ? "bg-[#333333]"
                  : "bg-yellow-100 border border-yellow-300"
              } rounded-sm`}
            ></div>
            <span className="dark:text-[#F5E8D8] text-gray-700">Empty</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
