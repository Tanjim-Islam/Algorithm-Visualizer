"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { algorithms } from "@/lib/algorithms"
import { BarsVisualization } from "@/components/features/visualization/BarsVisualization"
import { DotsVisualization } from "@/components/features/visualization/DotsVisualization"
import { NumbersVisualization } from "@/components/features/visualization/NumbersVisualization"
import { useTheme } from "next-themes"
// Update the imports to include the new RaceVisualizationContainer
import { RaceVisualizationContainer } from "@/components/features/race/RaceVisualizationContainer"

// Update the component props to include raceAlgorithms
interface VisualizationAreaProps {
  array: number[]
  visualizationMode: string
  is3D: boolean
  activeIndices: number[]
  barStyle: string
  accessPattern: number[]
  running: boolean
  handleDragStart: (index: number) => void
  handleDragOver: (e: React.DragEvent, index: number) => void
  handleDrop: (e: React.DragEvent, index: number) => void
  dragOverIndex: number | null
  algorithm: string
  raceMode: boolean
  raceAlgorithms: string[]
}

export function VisualizationArea({
  array,
  visualizationMode,
  is3D,
  activeIndices,
  barStyle,
  accessPattern,
  running,
  handleDragStart,
  handleDragOver,
  handleDrop,
  dragOverIndex,
  algorithm,
  raceMode,
  raceAlgorithms,
}: VisualizationAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  console.log("Race algorithms:", raceAlgorithms)

  // 3D visualization effect
  useEffect(() => {
    if (is3D && canvasRef.current && array.length > 0) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Set up 3D perspective
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const depth = 200
        const maxHeight = canvas.height * 0.8

        // Draw bars in 3D
        for (let i = 0; i < array.length; i++) {
          const value = array[i]
          const isActive = activeIndices.includes(i)

          // Calculate 3D positions
          const barWidth = canvas.width / array.length
          const x = i * barWidth
          const height = (value / 100) * maxHeight

          // 3D effect with perspective
          const z = (i / array.length) * depth
          const scale = 1 - z / (depth * 2)
          const x3d = centerX + (x - centerX) * scale
          const width3d = barWidth * scale

          // Color based on theme and activity
          if (isActive) {
            ctx.fillStyle = "rgba(250, 204, 21, 0.8)"
          } else {
            const hue = theme === "dark" ? 0 : 210 // Red for dark, blue for light
            const lightness = 50 + value / 2 // Vary lightness based on value
            ctx.fillStyle = `hsl(${hue}, 70%, ${lightness}%)`
          }

          // Draw 3D bar
          ctx.beginPath()
          ctx.rect(x3d, centerY + maxHeight / 2 - height * scale, width3d, height * scale)
          ctx.fill()

          // Add highlight for 3D effect
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
          ctx.beginPath()
          ctx.rect(x3d, centerY + maxHeight / 2 - height * scale, width3d, 5)
          ctx.fill()
        }
      }
    }
  }, [is3D, array, activeIndices, theme])

  return (
    <Card className="dark:bg-[#1C1C1C]/90 bg-white/90 border-0 shadow-lg rounded-xl sm:rounded-2xl backdrop-blur-sm transition-colors">
      <CardHeader className="dark:border-b dark:border-[#444444] border-b border-blue-200 rounded-t-xl sm:rounded-t-2xl transition-colors p-4 sm:p-6">
        <CardTitle className="dark:text-[#FF6F61] text-blue-600 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 transition-colors">
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent font-semibold transition-colors">
            Visualization
          </span>
          <Badge
            variant="outline"
            className="dark:border-[#FF6F61] dark:text-[#F5E8D8] border-blue-400 text-blue-500 rounded-full px-3 py-1 text-xs sm:text-sm sm:px-4 sm:py-1 font-medium transition-colors self-start sm:self-auto"
          >
            {raceMode ? "Algorithm Race" : algorithms[algorithm].name}
          </Badge>
        </CardTitle>
        <CardDescription className="dark:text-[#F5E8D8]/70 text-gray-500 text-sm sm:text-base transition-colors">
          {visualizationMode === "bars"
            ? "Each bar represents a value in the array"
            : visualizationMode === "dots"
              ? "Each dot represents a value in the array"
              : visualizationMode === "3d"
                ? "3D visualization of the array"
                : "Each number represents a value in the array"}
        </CardDescription>
      </CardHeader>
      {/* Update the CardContent section to use the RaceVisualizationContainer */}
      <CardContent className="pt-4 sm:pt-6 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl my-2 sm:my-4 mx-2 p-2 sm:p-4 transition-colors">
        {raceMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {raceAlgorithms.map((alg) => (
              <RaceVisualizationContainer
                key={alg}
                algorithm={alg}
                array={array}
                visualizationMode={visualizationMode}
                barStyle={barStyle}
                running={running}
                activeIndices={[]}
              />
            ))}
          </div>
        ) : visualizationMode === "3d" ? (
          <canvas ref={canvasRef} width={800} height={400} className="w-full h-48 sm:h-64 rounded-lg sm:rounded-xl" />
        ) : visualizationMode === "bars" ? (
          <BarsVisualization
            array={array}
            activeIndices={activeIndices}
            barStyle={barStyle}
            accessPattern={accessPattern}
            running={running}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            isRaceMode={false}
          />
        ) : visualizationMode === "dots" ? (
          <DotsVisualization
            array={array}
            activeIndices={activeIndices}
            running={running}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            isRaceMode={false}
          />
        ) : (
          <NumbersVisualization
            array={array}
            activeIndices={activeIndices}
            dragOverIndex={dragOverIndex}
            running={running}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            isRaceMode={false}
          />
        )}
      </CardContent>
      <CardFooter className="p-2 sm:p-4">
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-[#333333]/50 bg-gray-100/80 rounded-lg sm:rounded-xl transition-colors">
            <TabsTrigger
              value="performance"
              className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="complexity"
              className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:data-[state=active]:bg-[#FF6F61] dark:data-[state=active]:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
            >
              Complexity
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="performance"
            className="p-3 sm:p-5 dark:bg-[#333333]/30 bg-gray-50/80 rounded-lg sm:rounded-xl mt-2 sm:mt-3 transition-colors"
          >
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-medium dark:text-[#FF6F61] text-blue-600 text-base sm:text-lg transition-colors">
                Algorithm Performance Characteristics
              </h3>
              <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2 dark:text-[#F5E8D8] text-gray-700 text-sm sm:text-base transition-colors">
                <li>
                  <strong className="dark:text-[#FF6F61] text-blue-600 transition-colors">O(n²) algorithms</strong>{" "}
                  (Bubble, Selection, Insertion): Simple but inefficient for large datasets
                </li>
                <li>
                  <strong className="dark:text-[#FF6F61] text-blue-600 transition-colors">O(n log n) algorithms</strong>{" "}
                  (Quick, Merge, Heap): Much more efficient for large datasets
                </li>
                <li>
                  <strong className="dark:text-[#FF6F61] text-blue-600 transition-colors">O(n+k) algorithms</strong>{" "}
                  (Counting, Bucket): Very efficient for specific data distributions
                </li>
                <li>Insertion Sort performs well on nearly sorted data</li>
                <li>Quick Sort has excellent average-case performance but poor worst-case</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent
            value="complexity"
            className="p-3 sm:p-5 dark:bg-[#333333]/30 bg-gray-50/80 rounded-lg sm:rounded-xl mt-2 sm:mt-3 transition-colors"
          >
            <div className="overflow-x-auto text-xs sm:text-sm">
              <table className="w-full border-collapse dark:text-[#F5E8D8] text-gray-700 transition-colors">
                <thead>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <th className="text-left py-1 sm:py-2 dark:text-[#FF6F61] text-blue-600 transition-colors">
                      Algorithm
                    </th>
                    <th className="text-left py-1 sm:py-2 dark:text-[#FF6F61] text-blue-600 transition-colors">
                      Best Case
                    </th>
                    <th className="text-left py-1 sm:py-2 dark:text-[#FF6F61] text-blue-600 transition-colors">
                      Average Case
                    </th>
                    <th className="text-left py-1 sm:py-2 dark:text-[#FF6F61] text-blue-600 transition-colors">
                      Worst Case
                    </th>
                    <th className="text-left py-1 sm:py-2 dark:text-[#FF6F61] text-blue-600 transition-colors">
                      Space
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <td className="py-1 sm:py-2">Bubble Sort</td>
                    <td className="py-1 sm:py-2">O(n)</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(1)</td>
                  </tr>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <td className="py-1 sm:py-2">Selection Sort</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(1)</td>
                  </tr>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <td className="py-1 sm:py-2">Insertion Sort</td>
                    <td className="py-1 sm:py-2">O(n)</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(1)</td>
                  </tr>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <td className="py-1 sm:py-2">Quick Sort</td>
                    <td className="py-1 sm:py-2">O(n log n)</td>
                    <td className="py-1 sm:py-2">O(n log n)</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(log n)</td>
                  </tr>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <td className="py-1 sm:py-2">Merge Sort</td>
                    <td className="py-1 sm:py-2">O(n log n)</td>
                    <td className="py-1 sm:py-2">O(n log n)</td>
                    <td className="py-1 sm:py-2">O(n log n)</td>
                    <td className="py-1 sm:py-2">O(n)</td>
                  </tr>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <td className="py-1 sm:py-2">Heap Sort</td>
                    <td className="py-1 sm:py-2">O(n log n)</td>
                    <td className="py-1 sm:py-2">O(n log n)</td>
                    <td className="py-1 sm:py-2">O(n log n)</td>
                    <td className="py-1 sm:py-2">O(1)</td>
                  </tr>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <td className="py-1 sm:py-2">Counting Sort</td>
                    <td className="py-1 sm:py-2">O(n+k)</td>
                    <td className="py-1 sm:py-2">O(n+k)</td>
                    <td className="py-1 sm:py-2">O(n+k)</td>
                    <td className="py-1 sm:py-2">O(k)</td>
                  </tr>
                  <tr className="dark:border-b dark:border-[#444444] border-b border-gray-300 transition-colors">
                    <td className="py-1 sm:py-2">Radix Sort</td>
                    <td className="py-1 sm:py-2">O(nk)</td>
                    <td className="py-1 sm:py-2">O(nk)</td>
                    <td className="py-1 sm:py-2">O(nk)</td>
                    <td className="py-1 sm:py-2">O(n+k)</td>
                  </tr>
                  <tr>
                    <td className="py-1 sm:py-2">Bucket Sort</td>
                    <td className="py-1 sm:py-2">O(n+k)</td>
                    <td className="py-1 sm:py-2">O(n+k)</td>
                    <td className="py-1 sm:py-2">O(n²)</td>
                    <td className="py-1 sm:py-2">O(n)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardFooter>
    </Card>
  )
}
