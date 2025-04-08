"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface GraphControlsProps {
  algorithm: string
  setAlgorithm: (algorithm: string) => void
  isRunning: boolean
}

export function GraphControls({ algorithm, setAlgorithm, isRunning }: GraphControlsProps) {
  const [showDetails, setShowDetails] = useState(false)

  const algorithms = {
    bfs: {
      name: "Breadth-First Search",
      complexity: "O(V + E)",
      description: "Explores all vertices at the current depth before moving to vertices at the next depth level.",
      details:
        "BFS uses a queue to explore all neighbors of a node before moving to the next level. It's useful for finding the shortest path in unweighted graphs and for exploring connected components.",
    },
    dfs: {
      name: "Depth-First Search",
      complexity: "O(V + E)",
      description: "Explores as far as possible along each branch before backtracking.",
      details:
        "DFS uses a stack (or recursion) to explore one path as deeply as possible before backtracking. It's useful for topological sorting, finding connected components, and cycle detection.",
    },
    topological: {
      name: "Topological Sort",
      complexity: "O(V + E)",
      description: "Orders vertices such that for every directed edge (u,v), vertex u comes before v in the ordering.",
      details:
        "Topological sorting is only possible in Directed Acyclic Graphs (DAGs). It's commonly used for scheduling tasks with dependencies, course prerequisites, and build systems.",
    },
    kruskal: {
      name: "Kruskal's MST Algorithm",
      complexity: "O(E log E)",
      description: "Finds a minimum spanning tree by adding edges in order of increasing weight.",
      details:
        "Kruskal's algorithm builds a minimum spanning tree by adding the smallest weight edge that doesn't create a cycle. It uses a disjoint-set data structure to efficiently check for cycles.",
    },
    prim: {
      name: "Prim's MST Algorithm",
      complexity: "O(E log V)",
      description: "Builds a minimum spanning tree by adding vertices one at a time.",
      details:
        "Prim's algorithm starts with a single vertex and grows the minimum spanning tree by adding the lowest weight edge connecting a vertex in the tree to a vertex outside the tree.",
    },
    scc: {
      name: "Strongly Connected Components",
      complexity: "O(V + E)",
      description:
        "Finds maximal strongly connected subgraphs where every vertex is reachable from every other vertex.",
      details:
        "The algorithm typically uses two DFS passes (Kosaraju's algorithm) to find strongly connected components. It's useful for analyzing the structure of directed graphs and in many graph algorithms.",
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
