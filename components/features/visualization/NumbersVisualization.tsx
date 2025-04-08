"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface NumbersVisualizationProps {
  array: number[]
  activeIndices: number[]
  dragOverIndex: number | null
  running: boolean
  handleDragStart: (index: number) => void
  handleDragOver: (e: React.DragEvent, index: number) => void
  handleDrop: (e: React.DragEvent, index: number) => void
  isRaceMode?: boolean
}

export function NumbersVisualization({
  array,
  activeIndices,
  dragOverIndex,
  running,
  handleDragStart,
  handleDragOver,
  handleDrop,
  isRaceMode = false,
}: NumbersVisualizationProps) {
  const { theme } = useTheme()

  return (
    <div
      className={`w-full ${isRaceMode ? "h-[150px] sm:h-[200px]" : "h-40 sm:h-64"} overflow-y-auto flex flex-wrap justify-center items-center gap-1 p-1 sm:p-2`}
    >
      {array.map((value, index) => {
        const isActive = activeIndices.includes(index)
        const isDraggedOver = dragOverIndex === index
        return (
          <motion.div
            key={index}
            className={`flex items-center justify-center rounded-md sm:rounded-xl p-1 cursor-${running || isRaceMode ? "default" : "grab"} ${
              isActive
                ? "bg-[#DAA520] text-black"
                : isDraggedOver
                  ? "bg-purple-400 text-white"
                  : theme === "dark"
                    ? "bg-[#FF6F61] text-white"
                    : "bg-blue-500 text-white"
            } transition-colors`}
            style={{
              minWidth: isRaceMode ? "20px" : "30px",
              fontSize: isRaceMode ? "0.6rem" : "0.75rem",
              boxShadow: isActive
                ? "0 0 15px rgba(250, 204, 21, 0.7)"
                : isRaceMode
                  ? "none"
                  : theme === "dark"
                    ? "0 0 10px rgba(255, 111, 97, 0.5)"
                    : "0 0 10px rgba(59, 130, 246, 0.5)",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              "@media (min-width: 640px)": {
                minWidth: isRaceMode ? "25px" : "45px",
                fontSize: isRaceMode ? "0.7rem" : "1rem",
              },
            }}
            animate={isActive && !isRaceMode ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
            draggable={!running && !isRaceMode}
            onDragStart={isRaceMode ? undefined : () => handleDragStart(index)}
            onDragOver={isRaceMode ? undefined : (e) => handleDragOver(e, index)}
            onDrop={isRaceMode ? undefined : (e) => handleDrop(e, index)}
          >
            <span className={`font-medium ${isRaceMode ? "text-xs" : "text-sm sm:text-lg"}`}>{value}</span>
          </motion.div>
        )
      })}
    </div>
  )
}
