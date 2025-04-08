"use client"
import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SettingsPanel } from "@/components/features/settings/SettingsPanel"
import { AlgorithmControls } from "@/components/sections/AlgorithmControls"
import { VisualizationArea } from "@/components/sections/VisualizationArea"
import { TutorialModal } from "@/components/features/tutorial/TutorialModal"
import { useAlgorithmVisualizer } from "@/hooks/useAlgorithmVisualizer"
import { PathfindingVisualizer } from "@/components/pathfinding/PathfindingVisualizer"
import { GraphVisualizer } from "@/components/graph/GraphVisualizer"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AlgorithmVisualizer() {
  const [activeTab, setActiveTab] = useState<string>("sorting")

  const {
    array,
    arraySize,
    algorithm,
    speed,
    running,
    comparisons,
    swaps,
    executionTime,
    currentStep,
    soundEnabled,
    showDetails,
    activeIndices,
    visualizationMode,
    showSettings,
    barStyle,
    accessPattern,
    progress,
    raceMode,
    raceAlgorithms,
    raceResults,
    showTutorial,
    tutorialStep,
    is3D,
    draggedIndex,
    dragOverIndex,
    setAlgorithm,
    setArraySize,
    setSpeed,
    setSoundEnabled,
    setShowDetails,
    setVisualizationMode,
    setShowSettings,
    setBarStyle,
    setRaceMode,
    setRaceAlgorithms,
    setShowTutorial,
    setTutorialStep,
    generateArray,
    generateNearlySortedArray,
    generateReversedArray,
    generateFewUniqueArray,
    resetAll,
    resetRace,
    startSorting,
    stopSorting,
    startRace,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useAlgorithmVisualizer()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-[#222222] dark:to-[#222222] py-4 px-2 sm:py-8 sm:px-4 transition-colors">
      <motion.div
        className="container mx-auto max-w-[1200px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          setShowTutorial={setShowTutorial}
        />

        <div className="mb-6">
          <Tabs defaultValue="sorting" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 dark:bg-[#333333]/50 bg-gray-100/80 rounded-lg sm:rounded-xl transition-colors mb-4">
              <TabsTrigger
                value="sorting"
                className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Sorting Algorithms
              </TabsTrigger>
              <TabsTrigger
                value="pathfinding"
                className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Pathfinding Algorithms
              </TabsTrigger>
              <TabsTrigger
                value="graph"
                className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Graph Algorithms
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {showSettings && (
          <SettingsPanel
            visualizationMode={visualizationMode}
            setVisualizationMode={setVisualizationMode}
            barStyle={barStyle}
            setBarStyle={setBarStyle}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            raceMode={raceMode}
            setRaceMode={setRaceMode}
            raceAlgorithms={raceAlgorithms}
            setRaceAlgorithms={setRaceAlgorithms}
          />
        )}

        {activeTab === "sorting" ? (
          <>
            <AlgorithmControls
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              arraySize={arraySize}
              setArraySize={setArraySize}
              speed={speed}
              setSpeed={setSpeed}
              running={running}
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              generateArray={generateArray}
              generateNearlySortedArray={generateNearlySortedArray}
              generateReversedArray={generateReversedArray}
              generateFewUniqueArray={generateFewUniqueArray}
              array={array}
              raceMode={raceMode}
              startSorting={startSorting}
              stopSorting={stopSorting}
              startRace={startRace}
              resetAll={resetAll}
              resetRace={resetRace}
              raceResults={raceResults}
              currentStep={currentStep}
              progress={progress}
              comparisons={comparisons}
              swaps={swaps}
              executionTime={executionTime}
              raceAlgorithms={raceAlgorithms}
            />

            <VisualizationArea
              array={array}
              visualizationMode={visualizationMode}
              is3D={is3D}
              activeIndices={activeIndices}
              barStyle={barStyle}
              accessPattern={accessPattern}
              running={running}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              dragOverIndex={dragOverIndex}
              algorithm={algorithm}
              raceMode={raceMode}
              raceAlgorithms={raceAlgorithms}
            />
          </>
        ) : activeTab === "pathfinding" ? (
          <PathfindingVisualizer soundEnabled={soundEnabled} />
        ) : (
          <GraphVisualizer soundEnabled={soundEnabled} />
        )}

        <Footer />

        {showTutorial && (
          <TutorialModal
            tutorialStep={tutorialStep}
            setTutorialStep={setTutorialStep}
            setShowTutorial={setShowTutorial}
          />
        )}
      </motion.div>
    </div>
  )
}
