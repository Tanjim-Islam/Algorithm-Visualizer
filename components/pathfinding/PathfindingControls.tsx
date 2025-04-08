"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface PathfindingControlsProps {
  algorithm: string
  setAlgorithm: (algorithm: string) => void
  isRunning: boolean
}

export function PathfindingControls({ algorithm, setAlgorithm, isRunning }: PathfindingControlsProps) {
  const [showDetails, setShowDetails] = useState(false)

  const algorithms = {
    bfs: {
      name: "Breadth-First Search",
      complexity: "O(V + E)",
      description:
        "Guarantees the shortest path in an unweighted graph by exploring all neighbors at the current depth before moving to nodes at the next depth level.",
      details:
        "BFS uses a queue data structure to keep track of nodes to visit next. It explores all neighbors of a node before moving to the next level of nodes. This ensures that when the target is found, the path to it is the shortest possible in terms of the number of edges.",
    },
    dfs: {
      name: "Depth-First Search",
      complexity: "O(V + E)",
      description:
        "Explores as far as possible along each branch before backtracking, which may not find the shortest path but is memory-efficient.",
      details:
        "DFS uses a stack data structure (or recursion) to explore one path as deeply as possible before backtracking. It's not guaranteed to find the shortest path, but it uses less memory than BFS and can be useful for maze generation or exploring all possible paths.",
    },
    dijkstra: {
      name: "Dijkstra's Algorithm",
      complexity: "O(V² + E) or O((V+E)log V) with priority queue",
      description:
        "Finds the shortest path in a weighted graph by greedily selecting the unvisited node with the smallest known distance.",
      details:
        "Dijkstra's algorithm maintains a priority queue of nodes to visit, always choosing the node with the smallest current distance. It guarantees the shortest path in graphs with non-negative weights by gradually expanding the frontier of visited nodes in order of increasing distance from the start.",
    },
    astar: {
      name: "A* Algorithm",
      complexity: "O(E)",
      description:
        "An informed search algorithm that uses heuristics to find the shortest path more efficiently than Dijkstra's algorithm.",
      details:
        "A* combines Dijkstra's algorithm with a heuristic function that estimates the distance to the target. By adding this estimate to the known distance from the start, A* can prioritize paths that seem more promising, making it more efficient than Dijkstra's algorithm while still guaranteeing the shortest path if the heuristic is admissible.",
    },
  }

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
      <Select value={algorithm} onValueChange={setAlgorithm} disabled={isRunning}>
        <SelectTrigger className="dark:bg-[#1C1C1C] dark:border-[#444444] dark:text-[#F5E8D8] bg-gray-50 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm">
          <SelectValue placeholder="Select algorithm" />
        </SelectTrigger>
        <SelectContent
          className="dark:bg-[#1C1C1C] dark:border-[#444444] dark:text-[#F5E8D8] bg-gray-50 border-gray-200 rounded-lg sm:rounded-xl transition-all duration-300 ease-in-out text-xs sm:text-sm"
          position="popper"
          sideOffset={4}
          align="start"
        >
          {Object.entries(algorithms).map(([key, value]) => (
            <SelectItem key={key} value={key} className="flex items-center text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                {value.name} - {value.complexity}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 mt-1 transition-colors">
        {algorithms[algorithm as keyof typeof algorithms].description}
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
              <p>{algorithms[algorithm as keyof typeof algorithms].details}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
