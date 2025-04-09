"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface SudokuSolverProps {
  board: number[][];
  currentRow?: number;
  currentCol?: number;
  currentValue?: number;
  isValid?: boolean;
  showHints?: boolean;
  size?: number;
}

export function SudokuSolver({
  board = [],
  currentRow,
  currentCol,
  currentValue,
  isValid,
  showHints = false,
  size = 9,
}: SudokuSolverProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Ensure board is always a size x size grid even if passed as undefined
  const safeBoard =
    Array.isArray(board) &&
    board.length === size &&
    board.every((row) => Array.isArray(row) && row.length === size)
      ? board
      : Array(size)
          .fill(0)
          .map(() => Array(size).fill(0));

  // Calculate possible values for each cell if hints are enabled
  const possibleValues = showHints
    ? calculatePossibleValues(safeBoard, size)
    : null;

  // Function to calculate possible values for each empty cell
  function calculatePossibleValues(board: number[][], size: number) {
    const boxSize = Math.sqrt(size);
    const result: Record<string, number[]> = {};

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          const possible = [];
          for (let num = 1; num <= size; num++) {
            if (isValidPlacement(board, row, col, num, boxSize, size)) {
              possible.push(num);
            }
          }
          result[`${row},${col}`] = possible;
        }
      }
    }

    return result;
  }

  // Function to check if a number can be placed at a position
  function isValidPlacement(
    board: number[][],
    row: number,
    col: number,
    num: number,
    boxSize: number,
    size: number
  ) {
    // Check row
    for (let j = 0; j < size; j++) {
      if (board[row][j] === num) return false;
    }

    // Check column
    for (let i = 0; i < size; i++) {
      if (board[i][col] === num) return false;
    }

    // Check box
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;

    for (let i = 0; i < boxSize; i++) {
      for (let j = 0; j < boxSize; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 dark:text-[#F5E8D8] text-gray-800">
          Sudoku Solver
        </h3>
        <div
          className="grid gap-0.5 sm:gap-1 mx-auto"
          style={{
            width: "100%",
            maxWidth: "500px",
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => {
              const isCurrentCell = row === currentRow && col === currentCol;
              const value = safeBoard[row][col];
              const isOriginal = value !== 0 && !isCurrentCell;
              const boxSize = Math.sqrt(size);

              // Determine cell background color
              let cellColor = "bg-white dark:bg-[#222222]";
              if (
                (Math.floor(row / boxSize) + Math.floor(col / boxSize)) % 2 ===
                0
              ) {
                cellColor = isDark ? "bg-[#333333]" : "bg-blue-50";
              }

              // Determine border styles for grid sections
              const borderStyles = [
                col % boxSize === boxSize - 1 && col < size - 1
                  ? "border-r-2"
                  : "border-r",
                row % boxSize === boxSize - 1 && row < size - 1
                  ? "border-b-2"
                  : "border-b",
                col === 0 ? "border-l" : "",
                row === 0 ? "border-t" : "",
              ].join(" ");

              // Highlight current cell
              let highlightStyle = "";
              if (isCurrentCell) {
                highlightStyle =
                  isValid === false
                    ? "border-2 border-red-500"
                    : isValid === true
                    ? "border-2 border-green-500"
                    : isDark
                    ? "border-2 border-[#FF6F61]"
                    : "border-2 border-blue-500";
              }

              // Get possible values for this cell if hints are enabled
              const cellPossibleValues =
                showHints && value === 0 && possibleValues
                  ? possibleValues[`${row},${col}`]
                  : null;

              return (
                <motion.div
                  key={`${row}-${col}`}
                  className={`aspect-square flex items-center justify-center ${cellColor} ${borderStyles} ${highlightStyle} dark:border-[#444444] border-gray-300 transition-colors`}
                  animate={isCurrentCell ? { scale: [1, 1.05, 1] } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isCurrentCell ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
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
                  {isCurrentCell && currentValue && value === 0 && (
                    <span
                      className={`text-sm sm:text-lg font-medium ${
                        isDark ? "text-[#DAA520]" : "text-blue-500"
                      } opacity-70`}
                    >
                      {currentValue}
                    </span>
                  )}
                  {showHints &&
                    value === 0 &&
                    !isCurrentCell &&
                    cellPossibleValues && (
                      <div className="grid grid-cols-3 gap-0.5 p-0.5 text-[7px] sm:text-[8px]">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <span
                            key={i}
                            className={`flex items-center justify-center ${
                              cellPossibleValues.includes(i + 1)
                                ? isDark
                                  ? "text-[#DAA520]/70"
                                  : "text-blue-500/70"
                                : "text-transparent"
                            }`}
                          >
                            {i + 1}
                          </span>
                        ))}
                      </div>
                    )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}
