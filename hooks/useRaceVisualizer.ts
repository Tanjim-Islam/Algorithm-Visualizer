"use client"

import { useState, useEffect } from "react"

export function useRaceVisualizer(raceAlgorithms: string[], originalArray: number[], running: boolean, speed: number) {
  // Create a state for each algorithm's array
  const [algorithmArrays, setAlgorithmArrays] = useState<Record<string, number[]>>({})
  const [algorithmActiveIndices, setAlgorithmActiveIndices] = useState<Record<string, number[]>>({})

  // Initialize arrays when race algorithms change
  useEffect(() => {
    const initialArrays: Record<string, number[]> = {}
    const initialActiveIndices: Record<string, number[]> = {}

    raceAlgorithms.forEach((alg) => {
      initialArrays[alg] = [...originalArray]
      initialActiveIndices[alg] = []
    })

    setAlgorithmArrays(initialArrays)
    setAlgorithmActiveIndices(initialActiveIndices)
  }, [raceAlgorithms, originalArray])

  return {
    algorithmArrays,
    algorithmActiveIndices,
    setAlgorithmArrays,
    setAlgorithmActiveIndices,
  }
}
