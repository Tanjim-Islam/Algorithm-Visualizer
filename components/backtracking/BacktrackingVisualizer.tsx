"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacktrackingControls } from "@/components/backtracking/BacktrackingControls";
import { NQueens } from "@/components/backtracking/NQueens";
import { SudokuSolver } from "@/components/backtracking/SudokuSolver";
import { MazeSolver } from "@/components/backtracking/MazeSolver";
import { KnightsTour } from "@/components/backtracking/KnightsTour";
import { SubsetSum } from "@/components/backtracking/SubsetSum";
import { useBacktracking } from "@/hooks/useBacktracking";
import { RecursionTree } from "@/components/backtracking/RecursionTree";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { SudokuSettings } from "@/components/backtracking/settings/SudokuSettings";
import { NQueensSettings } from "@/components/backtracking/settings/NQueensSettings";
import { MazeSettings } from "@/components/backtracking/settings/MazeSettings";
import { KnightsTourSettings } from "@/components/backtracking/settings/KnightsTourSettings";
import { SubsetSumSettings } from "@/components/backtracking/settings/SubsetSumSettings";

interface BacktrackingVisualizerProps {
  soundEnabled: boolean;
}

export function BacktrackingVisualizer({
  soundEnabled,
}: BacktrackingVisualizerProps) {
  const [activeAlgorithm, setActiveAlgorithm] = useState<string>("nqueens");
  const {
    speed,
    setSpeed,
    running,
    setRunning,
    steps,
    currentStepIndex,
    startVisualization,
    stopVisualization,
    resetVisualization,
    showRecursionTree,
    setShowRecursionTree,
    recursionTreeData,
    nQueensSize,
    setNQueensSize,
    sudokuBoard,
    setSudokuBoard,
    mazeConfig,
    setMazeConfig,
    knightsTourSize,
    setKnightsTourSize,
    subsetSumConfig,
    setSubsetSumConfig,
    activeSteps,
    setActiveSteps,
    prepareAlgorithm,
    // New settings
    nQueensConfig,
    setNQueensConfig,
    findAllSolutions,
    setFindAllSolutions,
    showHints,
    setShowHints,
    sudokuDifficulty,
    setSudokuDifficulty,
    sudokuSize,
    setSudokuSize,
    mazeAlgorithm,
    setMazeAlgorithm,
    wallDensity,
    setWallDensity,
    showVisitedCells,
    setShowVisitedCells,
    knightsTourType,
    setKnightsTourType,
    visualizationStyle,
    setVisualizationStyle,
    maxSubsetSize,
    setMaxSubsetSize,
  } = useBacktracking(soundEnabled);

  // Effect to handle tab changes
  useEffect(() => {
    // When the active algorithm changes, prepare the visualization for that algorithm
    prepareAlgorithm(activeAlgorithm);

    // This ensures the current step display updates to reflect the newly selected algorithm
    // without requiring a manual reset
  }, [activeAlgorithm, prepareAlgorithm, showRecursionTree]);

  // Function to handle tab changes
  const handleAlgorithmChange = (value: string) => {
    // If a visualization is running, stop it
    if (running) {
      stopVisualization();
    }

    // Change the active algorithm
    setActiveAlgorithm(value);

    // If recursion tree is visible, ensure it's properly reset for the new algorithm
    if (showRecursionTree) {
      resetVisualization(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="dark:bg-[#1C1C1C]/90 bg-white/90 border-0 shadow-lg rounded-xl sm:rounded-2xl backdrop-blur-sm transition-colors">
        <CardHeader className="dark:border-b dark:border-[#444444] border-b border-blue-200 rounded-t-xl sm:rounded-t-2xl transition-colors p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 dark:text-[#FF6F61] text-blue-600 font-semibold transition-colors">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 dark:text-[#FF6F61] text-blue-500 transition-colors" />
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent transition-colors">
              Recursion & Backtracking Visualizer
            </span>
          </CardTitle>
          <CardDescription className="dark:text-[#F5E8D8]/70 text-gray-500 text-sm sm:text-base transition-colors">
            Visualize classic recursion and backtracking algorithms with
            step-by-step animations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs
            value={activeAlgorithm}
            onValueChange={handleAlgorithmChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 dark:bg-[#333333]/50 bg-gray-100/80 rounded-lg sm:rounded-xl transition-colors mb-6">
              <TabsTrigger
                value="nqueens"
                className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                N-Queens
              </TabsTrigger>
              <TabsTrigger
                value="sudoku"
                className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Sudoku
              </TabsTrigger>
              <TabsTrigger
                value="maze"
                className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Maze
              </TabsTrigger>
              <TabsTrigger
                value="knights"
                className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Knight's Tour
              </TabsTrigger>
              <TabsTrigger
                value="subset"
                className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Subset Sum
              </TabsTrigger>
            </TabsList>

            <BacktrackingControls
              speed={speed}
              setSpeed={setSpeed}
              running={running}
              startVisualization={() => startVisualization(activeAlgorithm)}
              stopVisualization={stopVisualization}
              resetVisualization={() => resetVisualization(activeAlgorithm)}
              showRecursionTree={showRecursionTree}
              setShowRecursionTree={setShowRecursionTree}
              currentStep={activeSteps[currentStepIndex]?.description || ""}
              progress={Math.floor(
                (currentStepIndex / Math.max(activeSteps.length - 1, 1)) * 100
              )}
              activeAlgorithm={activeAlgorithm}
              nQueensSize={nQueensSize}
              setNQueensSize={setNQueensSize}
              knightsTourSize={knightsTourSize}
              setKnightsTourSize={setKnightsTourSize}
            />

            {/* Algorithm-specific settings */}
            <div className="mt-6">
              <TabsContent value="nqueens" className="mt-0">
                <NQueensSettings
                  nQueensSize={nQueensSize}
                  setNQueensSize={setNQueensSize}
                  nQueensConfig={nQueensConfig}
                  setNQueensConfig={setNQueensConfig}
                  findAllSolutions={findAllSolutions}
                  setFindAllSolutions={setFindAllSolutions}
                  visualizationStyle={visualizationStyle}
                  setVisualizationStyle={setVisualizationStyle}
                  resetVisualization={() => resetVisualization("nqueens")}
                  running={running}
                />
              </TabsContent>
              <TabsContent value="sudoku" className="mt-0">
                <SudokuSettings
                  sudokuBoard={sudokuBoard}
                  setSudokuBoard={setSudokuBoard}
                  showHints={showHints}
                  setShowHints={setShowHints}
                  sudokuDifficulty={sudokuDifficulty}
                  setSudokuDifficulty={setSudokuDifficulty}
                  sudokuSize={sudokuSize}
                  setSudokuSize={setSudokuSize}
                  resetVisualization={() => resetVisualization("sudoku")}
                  running={running}
                />
              </TabsContent>
              <TabsContent value="maze" className="mt-0">
                <MazeSettings
                  mazeConfig={mazeConfig}
                  setMazeConfig={setMazeConfig}
                  mazeAlgorithm={mazeAlgorithm}
                  setMazeAlgorithm={setMazeAlgorithm}
                  wallDensity={wallDensity}
                  setWallDensity={setWallDensity}
                  showVisitedCells={showVisitedCells}
                  setShowVisitedCells={setShowVisitedCells}
                  resetVisualization={() => resetVisualization("maze")}
                  running={running}
                />
              </TabsContent>
              <TabsContent value="knights" className="mt-0">
                <KnightsTourSettings
                  knightsTourSize={knightsTourSize}
                  setKnightsTourSize={setKnightsTourSize}
                  knightsTourType={knightsTourType}
                  setKnightsTourType={setKnightsTourType}
                  visualizationStyle={visualizationStyle}
                  setVisualizationStyle={setVisualizationStyle}
                  resetVisualization={() => resetVisualization("knights")}
                  running={running}
                />
              </TabsContent>
              <TabsContent value="subset" className="mt-0">
                <SubsetSumSettings
                  subsetSumConfig={subsetSumConfig}
                  setSubsetSumConfig={setSubsetSumConfig}
                  findAllSolutions={findAllSolutions}
                  setFindAllSolutions={setFindAllSolutions}
                  maxSubsetSize={maxSubsetSize}
                  setMaxSubsetSize={setMaxSubsetSize}
                  visualizationStyle={visualizationStyle}
                  setVisualizationStyle={setVisualizationStyle}
                  resetVisualization={() => resetVisualization("subset")}
                  running={running}
                />
              </TabsContent>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
              <div
                className={`lg:col-span-${
                  showRecursionTree ? "3" : "5"
                } h-full`}
              >
                <TabsContent value="nqueens" className="mt-0">
                  <NQueens
                    size={nQueensSize}
                    board={
                      activeSteps[currentStepIndex]?.state?.board ||
                      Array(nQueensSize).fill(Array(nQueensSize).fill(0))
                    }
                    currentRow={
                      activeSteps[currentStepIndex]?.state?.currentRow
                    }
                    currentCol={
                      activeSteps[currentStepIndex]?.state?.currentCol
                    }
                    isValid={activeSteps[currentStepIndex]?.state?.isValid}
                    visualizationStyle={visualizationStyle}
                    startingPosition={nQueensConfig.startingPosition}
                  />
                </TabsContent>
                <TabsContent value="sudoku" className="mt-0">
                  <SudokuSolver
                    board={
                      activeSteps[currentStepIndex]?.state?.board || sudokuBoard
                    }
                    currentRow={
                      activeSteps[currentStepIndex]?.state?.currentRow
                    }
                    currentCol={
                      activeSteps[currentStepIndex]?.state?.currentCol
                    }
                    currentValue={
                      activeSteps[currentStepIndex]?.state?.currentValue
                    }
                    isValid={activeSteps[currentStepIndex]?.state?.isValid}
                    showHints={showHints}
                    size={sudokuSize}
                  />
                </TabsContent>
                <TabsContent value="maze" className="mt-0">
                  <MazeSolver
                    maze={
                      activeSteps[currentStepIndex]?.state?.maze ||
                      mazeConfig.maze
                    }
                    currentRow={
                      activeSteps[currentStepIndex]?.state?.currentRow
                    }
                    currentCol={
                      activeSteps[currentStepIndex]?.state?.currentCol
                    }
                    path={activeSteps[currentStepIndex]?.state?.path || []}
                    visited={
                      activeSteps[currentStepIndex]?.state?.visited || []
                    }
                    showVisitedCells={showVisitedCells}
                    startPosition={mazeConfig.start}
                    endPosition={mazeConfig.end}
                  />
                </TabsContent>
                <TabsContent value="knights" className="mt-0">
                  <KnightsTour
                    size={knightsTourSize}
                    board={
                      activeSteps[currentStepIndex]?.state?.board ||
                      Array(knightsTourSize).fill(
                        Array(knightsTourSize).fill(0)
                      )
                    }
                    currentRow={
                      activeSteps[currentStepIndex]?.state?.currentRow
                    }
                    currentCol={
                      activeSteps[currentStepIndex]?.state?.currentCol
                    }
                    moveNumber={
                      activeSteps[currentStepIndex]?.state?.moveNumber
                    }
                    visualizationStyle={visualizationStyle}
                    tourType={knightsTourType}
                  />
                </TabsContent>
                <TabsContent value="subset" className="mt-0">
                  <SubsetSum
                    numbers={subsetSumConfig.numbers}
                    target={subsetSumConfig.target}
                    currentIndex={
                      activeSteps[currentStepIndex]?.state?.currentIndex
                    }
                    currentSum={
                      activeSteps[currentStepIndex]?.state?.currentSum
                    }
                    currentSubset={
                      activeSteps[currentStepIndex]?.state?.currentSubset || []
                    }
                    solutions={
                      activeSteps[currentStepIndex]?.state?.solutions || []
                    }
                    visualizationStyle={visualizationStyle}
                    maxSubsetSize={maxSubsetSize}
                  />
                </TabsContent>
              </div>

              {showRecursionTree && (
                <div className="lg:col-span-2 h-full">
                  <RecursionTree
                    data={recursionTreeData}
                    currentNodeId={activeSteps[currentStepIndex]?.nodeId}
                  />
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
