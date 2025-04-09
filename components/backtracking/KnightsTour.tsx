"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import type {
  KnightsTourType,
  VisualizationStyle,
} from "@/hooks/useBacktracking";
import { ArrowRight } from "lucide-react";

interface KnightsTourProps {
  size: number;
  board: number[][];
  currentRow?: number;
  currentCol?: number;
  moveNumber?: number;
  visualizationStyle?: VisualizationStyle;
  tourType?: KnightsTourType;
}

export function KnightsTour({
  size,
  board = [],
  currentRow,
  currentCol,
  moveNumber,
  visualizationStyle = "default",
  tourType = "open",
}: KnightsTourProps) {
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

  // Function to determine the direction of movement between two cells
  const getDirection = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // Calculate angle in degrees
    const angle = Math.atan2(rowDiff, colDiff) * (180 / Math.PI);
    return angle;
  };

  // Function to find the next cell in the knight's tour
  const findNextCell = (row: number, col: number) => {
    const currentValue = safeBoard[row][col];
    if (currentValue === 0 || currentValue === size * size) return null;

    // Look for the next move (current value + 1)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (safeBoard[r][c] === currentValue + 1) {
          return { row: r, col: c };
        }
      }
    }

    return null;
  };

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 dark:text-[#F5E8D8] text-gray-800">
          Knight's Tour ({size}x{size}) -{" "}
          {tourType === "closed" ? "Closed Tour" : "Open Tour"}
        </h3>
        <div
          className="grid gap-1 sm:gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            width: "100%",
            maxWidth: "500px",
          }}
        >
          {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => {
              const value = safeBoard[row][col];
              const isCurrentCell = row === currentRow && col === currentCol;
              const cellColor =
                (row + col) % 2 === 0
                  ? isDark
                    ? "bg-[#444444]"
                    : "bg-blue-200"
                  : isDark
                  ? "bg-[#333333]"
                  : "bg-blue-100";

              // Determine color intensity based on move number
              let textColor = "text-gray-400 dark:text-gray-600";
              if (value > 0) {
                const intensity = Math.min(
                  100,
                  Math.floor((value / (size * size)) * 100)
                );
                textColor = isDark
                  ? `text-[#FF6F61] opacity-${intensity}`
                  : `text-blue-600 opacity-${intensity}`;
              }

              // For arrow visualization, find the next cell
              const nextCell =
                visualizationStyle === "arrows" && value > 0
                  ? findNextCell(row, col)
                  : null;
              const arrowAngle = nextCell
                ? getDirection(row, col, nextCell.row, nextCell.col)
                : 0;

              return (
                <motion.div
                  key={`${row}-${col}`}
                  className={`aspect-square flex items-center justify-center ${cellColor} ${
                    isCurrentCell
                      ? isDark
                        ? "border-2 border-[#DAA520]"
                        : "border-2 border-green-500"
                      : ""
                  } rounded-md sm:rounded-lg transition-colors relative`}
                  animate={isCurrentCell ? { scale: [1, 1.05, 1] } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isCurrentCell ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  {value > 0 && visualizationStyle === "numbers" && (
                    <span
                      className={`text-xs sm:text-sm font-medium ${textColor}`}
                    >
                      {value}
                    </span>
                  )}

                  {value > 0 && visualizationStyle === "arrows" && nextCell && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ transform: `rotate(${arrowAngle}deg)` }}
                    >
                      <ArrowRight
                        className={`h-4 w-4 ${
                          isDark ? "text-[#FF6F61]" : "text-blue-600"
                        }`}
                      />
                    </div>
                  )}

                  {isCurrentCell && visualizationStyle === "default" && (
                    <motion.div
                      className={`absolute ${
                        isDark ? "text-[#DAA520]" : "text-green-600"
                      }`}
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      ♘
                    </motion.div>
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
