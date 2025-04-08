"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Compass, Play, Pause, RotateCcw, Map } from "lucide-react"
import { PathfindingGrid } from "@/components/pathfinding/PathfindingGrid"
import { PathfindingControls } from "@/components/pathfinding/PathfindingControls"
import { PathfindingSettings } from "@/components/pathfinding/PathfindingSettings"
import { usePathfinding } from "@/hooks/usePathfinding"

interface PathfindingVisualizerProps {
  soundEnabled: boolean
}

export function PathfindingVisualizer({ soundEnabled }: PathfindingVisualizerProps) {
  const {
    grid,
    startNode,
    finishNode,
    algorithm,
    speed,
    isRunning,
    isFinished,
    visitedNodesInOrder,
    nodesInShortestPathOrder,
    currentStep,
    progress,
    setAlgorithm,
    setSpeed,
    setGrid,
    setStartNode,
    setFinishNode,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    resetGrid,
    clearPath,
    generateMaze,
    visualizeAlgorithm,
    stopVisualization,
  } = usePathfinding(soundEnabled)

  return (
    <>
      <Card className="mb-4 sm:mb-8 dark:bg-[#1C1C1C]/90 bg-white/90 border-0 shadow-lg rounded-xl sm:rounded-2xl backdrop-blur-sm transition-colors">
        <CardHeader className="dark:border-b dark:border-[#444444] border-b border-blue-200 rounded-t-xl sm:rounded-t-2xl transition-colors p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 dark:text-[#FF6F61] text-blue-600 font-semibold transition-colors">
            <Compass className="h-5 w-5 sm:h-6 sm:w-6 dark:text-[#FF6F61] text-blue-500 transition-colors" />
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent transition-colors">
              Pathfinding Algorithm Visualizer
            </span>
          </CardTitle>
          <CardDescription className="dark:text-[#F5E8D8]/70 text-gray-500 text-sm sm:text-base transition-colors">
            Visualize how different pathfinding algorithms explore a maze to find the shortest path
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <PathfindingControls algorithm={algorithm} setAlgorithm={setAlgorithm} isRunning={isRunning} />

              <PathfindingSettings
                speed={speed}
                setSpeed={setSpeed}
                isRunning={isRunning}
                generateMaze={generateMaze}
                clearPath={clearPath}
                resetGrid={resetGrid}
              />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 transition-colors">
                  <div className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 transition-colors">
                    Algorithm
                  </div>
                  <div className="text-lg sm:text-2xl font-bold dark:text-[#FF6F61] text-blue-600 transition-colors">
                    {algorithm === "bfs" && "Breadth-First Search"}
                    {algorithm === "dfs" && "Depth-First Search"}
                    {algorithm === "dijkstra" && "Dijkstra's Algorithm"}
                    {algorithm === "astar" && "A* Algorithm"}
                  </div>
                </div>
                <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 transition-colors">
                  <div className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 transition-colors">
                    Status
                  </div>
                  <div className="text-lg sm:text-2xl font-bold dark:text-[#FF6F61] text-blue-600 transition-colors">
                    {isRunning ? "Running" : isFinished ? "Finished" : "Ready"}
                  </div>
                </div>
              </div>

              <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 min-h-[50px] sm:min-h-[60px] flex items-center transition-colors">
                <div className="text-xs sm:text-sm dark:text-[#F5E8D8] text-gray-700 w-full transition-colors">
                  {currentStep || "Drag to place walls. Click Visualize to start the algorithm."}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={visualizeAlgorithm}
                  disabled={isRunning}
                  className="flex-1 dark:bg-[#FF6F61] dark:hover:bg-[#e05a4d] bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                >
                  <Play className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Visualize
                </Button>
                <Button
                  onClick={stopVisualization}
                  disabled={!isRunning}
                  variant="outline"
                  className="flex-1 dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                >
                  <Pause className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Stop
                </Button>
                <Button
                  onClick={clearPath}
                  disabled={isRunning}
                  variant="outline"
                  className="flex-1 dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Clear Path
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Start Node</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Target Node</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-800 dark:bg-gray-600 rounded-sm"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Wall</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-300 dark:bg-blue-700 rounded-sm"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Visited Node</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-yellow-300 dark:bg-yellow-500 rounded-sm"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Shortest Path</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-[#1C1C1C]/90 bg-white/90 border-0 shadow-lg rounded-xl sm:rounded-2xl backdrop-blur-sm transition-colors">
        <CardHeader className="dark:border-b dark:border-[#444444] border-b border-blue-200 rounded-t-xl sm:rounded-t-2xl transition-colors p-4 sm:p-6">
          <CardTitle className="dark:text-[#FF6F61] text-blue-600 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 transition-colors">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent font-semibold transition-colors">
              Maze Visualization
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateMaze}
                disabled={isRunning}
                className="dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm"
              >
                <Map className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Generate Maze
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetGrid}
                disabled={isRunning}
                className="dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm"
              >
                <RotateCcw className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Reset Grid
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="dark:text-[#F5E8D8]/70 text-gray-500 text-sm sm:text-base transition-colors">
            Drag to place walls. Click and drag the start (green) and target (red) nodes to reposition them.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl my-2 sm:my-4 mx-2 p-2 sm:p-4 transition-colors">
          <PathfindingGrid
            grid={grid}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        </CardContent>
      </Card>
    </>
  )
}
