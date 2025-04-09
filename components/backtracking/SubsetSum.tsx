"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import type { VisualizationStyle } from "@/hooks/useBacktracking";

interface SubsetSumProps {
  numbers: number[];
  target: number;
  currentIndex?: number;
  currentSum?: number;
  currentSubset: number[];
  solutions: number[][];
  visualizationStyle?: VisualizationStyle;
  maxSubsetSize?: number | null;
}

export function SubsetSum({
  numbers = [],
  target = 0,
  currentIndex,
  currentSum = 0,
  currentSubset = [],
  solutions = [],
  visualizationStyle = "default",
  maxSubsetSize = null,
}: SubsetSumProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calculate the maximum value in the numbers array for heatmap scaling
  const maxValue = Math.max(...numbers, 1);

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 dark:text-[#F5E8D8] text-gray-800">
          Subset Sum Problem{" "}
          {maxSubsetSize ? `(Max Size: ${maxSubsetSize})` : ""}
        </h3>

        <div className="w-full max-w-3xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <span className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                Numbers:
              </span>
              {numbers.map((num, idx) => {
                // For heatmap visualization, calculate color intensity based on value
                let bgColor = "";
                if (visualizationStyle === "heatmap") {
                  const intensity = Math.floor((num / maxValue) * 100);
                  bgColor = isDark
                    ? `bg-gradient-to-r from-[#333333] to-[#FF6F61] bg-[length:${intensity}%_100%] bg-no-repeat`
                    : `bg-gradient-to-r from-blue-100 to-blue-500 bg-[length:${intensity}%_100%] bg-no-repeat`;
                } else {
                  bgColor =
                    idx === currentIndex
                      ? isDark
                        ? "bg-[#FF6F61] text-white"
                        : "bg-blue-500 text-white"
                      : currentSubset.includes(num)
                      ? isDark
                        ? "bg-[#DAA520] text-black"
                        : "bg-green-500 text-white"
                      : isDark
                      ? "bg-[#444444] text-[#F5E8D8]"
                      : "bg-gray-200 text-gray-700";
                }

                return (
                  <motion.div
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}
                    animate={idx === currentIndex ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 0.5,
                      repeat:
                        idx === currentIndex ? Number.POSITIVE_INFINITY : 0,
                      repeatType: "reverse",
                    }}
                  >
                    {num}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                Target Sum:
              </span>
              <Badge
                className={
                  isDark ? "bg-[#FF6F61] text-white" : "bg-blue-500 text-white"
                }
              >
                {target}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                Current Sum:
              </span>
              <Badge
                className={
                  currentSum === target
                    ? isDark
                      ? "bg-[#DAA520] text-black"
                      : "bg-green-500 text-white"
                    : currentSum > target
                    ? "bg-red-500 text-white"
                    : isDark
                    ? "bg-[#444444] text-[#F5E8D8]"
                    : "bg-gray-200 text-gray-700"
                }
              >
                {currentSum || 0}
              </Badge>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                Current Subset:
              </span>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentSubset.length > 0 ? (
                  currentSubset.map((num, idx) => (
                    <Badge
                      key={idx}
                      className={
                        isDark
                          ? "bg-[#DAA520] text-black"
                          : "bg-green-500 text-white"
                      }
                    >
                      {num}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm italic dark:text-[#F5E8D8]/60 text-gray-500">
                    Empty
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                Solutions Found ({solutions.length}):
              </span>
              <div className="max-h-40 overflow-y-auto w-full p-2 border dark:border-[#444444] border-gray-200 rounded-md">
                {solutions.length > 0 ? (
                  solutions.map((solution, solutionIdx) => (
                    <div
                      key={solutionIdx}
                      className="flex flex-wrap gap-1 mb-2 justify-center"
                    >
                      {solution.map((num, numIdx) => (
                        <Badge
                          key={numIdx}
                          variant="outline"
                          className={
                            isDark
                              ? "border-[#DAA520] text-[#DAA520]"
                              : "border-green-500 text-green-600"
                          }
                        >
                          {num}
                        </Badge>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm italic dark:text-[#F5E8D8]/60 text-gray-500">
                    No solutions found yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
