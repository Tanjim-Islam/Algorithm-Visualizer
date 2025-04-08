"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";

interface BarsVisualizationProps {
  array: number[];
  activeIndices: number[];
  barStyle: string;
  accessPattern: number[];
  running: boolean;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  isRaceMode?: boolean;
}

export function BarsVisualization({
  array,
  activeIndices,
  barStyle,
  accessPattern,
  running,
  handleDragStart,
  handleDragOver,
  handleDrop,
  isRaceMode = false,
}: BarsVisualizationProps) {
  const { getBarColor } = useVisualization();

  return (
    <div
      className={`w-full ${
        isRaceMode ? "h-[150px] sm:h-[200px]" : "h-40 sm:h-64"
      } flex items-end justify-center gap-[1px] sm:gap-[2px]`}
    >
      {array.map((value, index) => {
        const isActive = activeIndices.includes(index);
        const barColor = getBarColor(
          index,
          value,
          isActive,
          barStyle,
          accessPattern
        );

        return (
          <motion.div
            key={index}
            className={`w-full rounded-t-md sm:rounded-t-xl cursor-${
              running ? "default" : "grab"
            } transition-colors`}
            style={{
              height: `${value}%`,
              transition:
                "height 0.1s ease-in-out, box-shadow 0.3s ease, background-color 0.3s ease",
              boxShadow: isActive
                ? "0 0 15px rgba(250, 204, 21, 0.7)"
                : isRaceMode
                ? "none"
                : "0 0 10px rgba(59, 130, 246, 0.5)",
              ...(typeof barColor === "object"
                ? barColor
                : { backgroundColor: barColor }),
            }}
            animate={isActive && !isRaceMode ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
            draggable={!running && !isRaceMode}
            onDragStart={isRaceMode ? undefined : () => handleDragStart(index)}
            onDragOver={
              isRaceMode ? undefined : (e) => handleDragOver(e, index)
            }
            onDrop={isRaceMode ? undefined : (e) => handleDrop(e, index)}
          />
        );
      })}
    </div>
  );
}
