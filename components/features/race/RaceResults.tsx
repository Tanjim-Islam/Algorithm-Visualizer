"use client"

import { Trophy } from "lucide-react"
import { motion } from "framer-motion"

interface RaceResultsProps {
  results: any[]
}

export function RaceResults({ results }: RaceResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
      transition={{ duration: 0.3 }}
    >
      <div className="p-3 sm:p-4 rounded-lg dark:bg-[#333333] bg-[#f0f0e8] dark:border dark:border-[#444444] border border-blue-200 transition-colors">
        <h3 className="text-base sm:text-lg font-medium mb-2 dark:text-[#FF6F61] text-blue-600 flex items-center gap-2 transition-colors">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
          Race Results
        </h3>
        <div className="space-y-2 text-xs sm:text-sm">
          {results.map((result, index) => (
            <div
              key={result.algorithm}
              className={`flex items-center justify-between p-2 rounded-lg sm:rounded-xl ${
                index === 0
                  ? "dark:bg-[#FF6F61]/30 bg-blue-100 dark:text-[#F5E8D8] text-blue-800"
                  : "dark:bg-[#333333]/30 bg-gray-100"
              } transition-colors`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">{index + 1}.</span>
                <span>{result.name}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <span>{(result.time / 1000).toFixed(2)}s</span>
                <span className="hidden sm:inline">{result.comparisons} comparisons</span>
                <span className="hidden sm:inline">{result.swaps} swaps</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
