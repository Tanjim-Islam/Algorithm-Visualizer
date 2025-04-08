"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface DotsVisualizationProps {
  array: number[]
  activeIndices: number[]
  running: boolean
  handleDragStart: (index: number) => void
  handleDragOver: (e: React.DragEvent, index: number) => void
  handleDrop: (e: React.DragEvent, index: number) => void
  isRaceMode?: boolean
}

export function DotsVisualization({
  array,
  activeIndices,
  running,
  handleDragStart,
  handleDragOver,
  handleDrop,
  isRaceMode = false,
}: DotsVisualizationProps) {
  const { theme } = useTheme()

  return (
    <div className={`w-full ${isRaceMode ? "h-[150px] sm:h-[200px]" : "h-40 sm:h-64"} relative`}>
      {array.map((value, index) => {
        const isActive = activeIndices.includes(index)
        const size = Math.max(value / (isRaceMode ? 12 : 8), isRaceMode ? 2 : 3) // Scale dot size for race mode
        const sizeSm = Math.max(value / (isRaceMode ? 8 : 5), isRaceMode ? 3 : 5) // Scale dot size for desktop
        return (
          <motion.div
            key={index}
            className={`absolute rounded-full cursor-${running || isRaceMode ? "default" : "grab"} ${isActive ? "bg-[#DAA520]" : theme === "dark" ? "bg-[#FF6F61]" : "bg-blue-500"} transition-colors`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${(index / array.length) * 100}%`,
              top: `${100 - value}%`,
              boxShadow: isActive
                ? "0 0 15px rgba(250, 204, 21, 0.7)"
                : isRaceMode
                  ? "none"
                  : theme === "dark"
                    ? "0 0 10px rgba(255, 111, 97, 0.5)"
                    : "0 0 10px rgba(59, 130, 246, 0.5)",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              "@media (min-width: 640px)": {
                width: `${sizeSm}px`,
                height: `${sizeSm}px`,
              },
            }}
            animate={isActive && !isRaceMode ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.3 }}
            draggable={!running && !isRaceMode}
            onDragStart={isRaceMode ? undefined : () => handleDragStart(index)}
            onDragOver={isRaceMode ? undefined : (e) => handleDragOver(e, index)}
            onDrop={isRaceMode ? undefined : (e) => handleDrop(e, index)}
          />
        )
      })}
    </div>
  )
}
