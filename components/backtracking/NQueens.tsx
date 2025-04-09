"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { useTheme } from "next-themes";
import type { VisualizationStyle } from "@/hooks/useBacktracking";

interface NQueensProps {
  size: number;
  board: number[][];
  currentRow?: number;
  currentCol?: number;
  isValid?: boolean;
  visualizationStyle?: VisualizationStyle;
  startingPosition?: [number, number] | null;
}

export function NQueens({
  size,
  board = [],
  currentRow,
  currentCol,
  isValid,
  visualizationStyle = "chess",
  startingPosition = null,
}: NQueensProps) {
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

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors w-full">
      <div className="flex flex-col items-center w-full">
        <h3 className="text-lg font-semibold mb-4 dark:text-[#F5E8D8] text-gray-800">
          N-Queens Problem (N={size})
        </h3>
        <div
          className="grid gap-1 sm:gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            width: "100%",
            maxWidth: "700px",
          }}
        >
          {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => {
              const isQueen = safeBoard[row][col] === 1;
              const isCurrentCell = row === currentRow && col === currentCol;
              const isStartingPosition =
                startingPosition &&
                row === startingPosition[0] &&
                col === startingPosition[1];

              const cellColor =
                (row + col) % 2 === 0
                  ? isDark
                    ? "bg-[#444444]"
                    : "bg-blue-200"
                  : isDark
                  ? "bg-[#333333]"
                  : "bg-blue-100";

              let borderColor = "";
              if (isCurrentCell) {
                borderColor =
                  isValid === false
                    ? "border-red-500"
                    : isValid === true
                    ? "border-green-500"
                    : isDark
                    ? "border-[#FF6F61]"
                    : "border-blue-500";
              } else if (isStartingPosition) {
                borderColor = isDark ? "border-[#DAA520]" : "border-yellow-500";
              }

              return (
                <motion.div
                  key={`${row}-${col}`}
                  className={`aspect-square flex items-center justify-center w-full h-full ${cellColor} ${
                    isCurrentCell || isStartingPosition
                      ? `border-2 ${borderColor}`
                      : ""
                  } rounded-md sm:rounded-lg transition-colors`}
                  animate={isCurrentCell ? { scale: [1, 1.05, 1] } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isCurrentCell ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  {isQueen && visualizationStyle === "chess" && (
                    <Crown
                      className={`h-6 w-6 sm:h-8 sm:w-8 ${
                        isDark ? "text-[#DAA520]" : "text-blue-600"
                      } transition-colors`}
                    />
                  )}
                  {isQueen && visualizationStyle === "numbers" && (
                    <div
                      className={`text-lg font-bold ${
                        isDark ? "text-[#DAA520]" : "text-blue-600"
                      }`}
                    >
                      Q
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
