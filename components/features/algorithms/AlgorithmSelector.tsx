"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { algorithms } from "@/lib/algorithms"
import { AnimatePresence, motion } from "framer-motion"

interface AlgorithmSelectorProps {
  algorithm: string
  setAlgorithm: (algorithm: string) => void
  running: boolean
  raceMode: boolean
  showDetails: boolean
  setShowDetails: (show: boolean) => void
}

export function AlgorithmSelector({
  algorithm,
  setAlgorithm,
  running,
  raceMode,
  showDetails,
  setShowDetails,
}: AlgorithmSelectorProps) {
  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        <label className="text-xs sm:text-sm font-medium mb-1 block dark:text-[#F5E8D8] text-gray-700 transition-colors">
          Algorithm
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 dark:text-[#FF6F61] text-blue-500 transition-colors"
                onClick={() => setShowDetails(!showDetails)}
              >
                <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs sm:text-sm">Show algorithm details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={algorithm} onValueChange={setAlgorithm} disabled={running || raceMode}>
        <SelectTrigger className="dark:bg-[#1C1C1C] dark:border-[#444444] dark:text-[#F5E8D8] bg-gray-50 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm">
          <SelectValue placeholder="Select algorithm" />
        </SelectTrigger>
        <SelectContent
          className="dark:bg-[#1C1C1C] dark:border-[#444444] dark:text-[#F5E8D8] bg-gray-50 border-gray-200 rounded-lg sm:rounded-xl transition-all duration-300 ease-in-out text-xs sm:text-sm"
          position="popper"
          sideOffset={4}
          align="start"
        >
          {Object.keys(algorithms).map((key) => (
            <SelectItem key={key} value={key} className="flex items-center text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                {algorithms[key].icon}
                {algorithms[key].name} - {algorithms[key].complexity}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 mt-1 transition-colors">
        {algorithms[algorithm].description}
      </p>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            transition={{ duration: 0.3 }}
          >
            <div className="mt-2 p-2 sm:p-3 rounded-md dark:bg-[#1C1C1C]/80 bg-[#f0f0e8] dark:text-[#F5E8D8] text-gray-700 text-xs sm:text-sm transition-colors">
              <h4 className="font-medium mb-1 dark:text-[#FF6F61] text-blue-600 transition-colors">How it works:</h4>
              <p>{algorithms[algorithm].details}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
