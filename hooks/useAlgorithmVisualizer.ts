"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import confetti from "canvas-confetti"
import { algorithms } from "@/lib/algorithms"
import { challenges } from "@/lib/challenges"
import { achievementsList } from "@/lib/achievements"
import type { Achievement } from "@/types"

export function useAlgorithmVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [arraySize, setArraySize] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedSize = localStorage.getItem("algorithmVisualizerSize")
      return savedSize ? Number.parseInt(savedSize) : 50
    }
    return 50
  })
  const [algorithm, setAlgorithm] = useState<string>("bubbleSort")
  const [speed, setSpeed] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedSpeed = localStorage.getItem("algorithmVisualizerSpeed")
      return savedSpeed ? Number.parseFloat(savedSpeed) : 10
    }
    return 10
  })
  const [running, setRunning] = useState<boolean>(false)
  const [comparisons, setComparisons] = useState<number>(0)
  const [swaps, setSwaps] = useState<number>(0)
  const [executionTime, setExecutionTime] = useState<number>(0)
  const [currentStep, setCurrentStep] = useState<string>("")
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false)
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [activeIndices, setActiveIndices] = useState<number[]>([])
  const [visualizationMode, setVisualizationMode] = useState<string>("bars")
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [barStyle, setBarStyle] = useState<string>("gradient")
  const [accessPattern, setAccessPattern] = useState<number[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [raceMode, setRaceMode] = useState<boolean>(false)
  const [raceAlgorithms, setRaceAlgorithms] = useState<string[]>(["bubbleSort", "quickSort"])
  const [raceResults, setRaceResults] = useState<any[]>([])
  const [currentChallenge, setCurrentChallenge] = useState<number>(0)
  const [showTutorial, setShowTutorial] = useState<boolean>(false)
  const [tutorialStep, setTutorialStep] = useState<number>(0)
  const [achievements, setAchievements] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedAchievements = localStorage.getItem("algorithmVisualizerAchievements")
      return savedAchievements ? JSON.parse(savedAchievements) : []
    }
    return []
  })
  const [stats, setStats] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const savedStats = localStorage.getItem("algorithmVisualizerStats")
      return savedStats
        ? JSON.parse(savedStats)
        : {
            totalSorts: 0,
            fastestSort: Number.POSITIVE_INFINITY,
            algorithmsUsed: {},
            minComparisons: Number.POSITIVE_INFINITY,
            arraySize: 50,
            challengesCompleted: 0,
          }
    }
    return {
      totalSorts: 0,
      fastestSort: Number.POSITIVE_INFINITY,
      algorithmsUsed: {},
      minComparisons: Number.POSITIVE_INFINITY,
      arraySize: 50,
      challengesCompleted: 0,
    }
  })
  const [showNewAchievement, setShowNewAchievement] = useState<string | null>(null)
  const [is3D, setIs3D] = useState<boolean>(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Store the original array for race resets
  const originalRaceArrayRef = useRef<number[]>([])

  const startTimeRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const cancelRef = useRef<boolean>(false)
  const { theme } = useTheme()

  // Generate random array
  const generateArray = () => {
    const newArray = []
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 1)
    }
    setArray(newArray)

    // Store the original array for race resets
    originalRaceArrayRef.current = [...newArray]

    // Update race arrays if in race mode
    if (raceMode && typeof window !== "undefined") {
      raceAlgorithms.forEach((alg) => {
        window[`raceArray_${alg}`] = [...newArray]
      })
    }
  }

  // Generate nearly sorted array
  const generateNearlySortedArray = () => {
    const newArray = []
    for (let i = 0; i < arraySize; i++) {
      newArray.push(i + 1)
    }

    // Swap a few elements to make it nearly sorted
    const swapCount = Math.floor(arraySize * 0.1) // Swap about 10% of elements
    for (let i = 0; i < swapCount; i++) {
      const idx1 = Math.floor(Math.random() * arraySize)
      const idx2 = Math.floor(Math.random() * arraySize)
      const temp = newArray[idx1]
      newArray[idx1] = newArray[idx2]
      newArray[idx2] = temp
    }

    setArray(newArray)

    // Store the original array for race resets
    originalRaceArrayRef.current = [...newArray]

    // Update race arrays if in race mode
    if (raceMode && typeof window !== "undefined") {
      raceAlgorithms.forEach((alg) => {
        window[`raceArray_${alg}`] = [...newArray]
      })
    }
  }

  // Generate reversed array
  const generateReversedArray = () => {
    const newArray = []
    for (let i = arraySize; i > 0; i--) {
      newArray.push(i)
    }
    setArray(newArray)

    // Store the original array for race resets
    originalRaceArrayRef.current = [...newArray]

    // Update race arrays if in race mode
    if (raceMode && typeof window !== "undefined") {
      raceAlgorithms.forEach((alg) => {
        window[`raceArray_${alg}`] = [...newArray]
      })
    }
  }

  // Generate array with few unique values
  const generateFewUniqueArray = () => {
    const newArray = []
    const uniqueValues = [10, 30, 50, 70, 90]
    for (let i = 0; i < arraySize; i++) {
      newArray.push(uniqueValues[Math.floor(Math.random() * uniqueValues.length)])
    }
    setArray(newArray)

    // Store the original array for race resets
    originalRaceArrayRef.current = [...newArray]

    // Update race arrays if in race mode
    if (raceMode && typeof window !== "undefined") {
      raceAlgorithms.forEach((alg) => {
        window[`raceArray_${alg}`] = [...newArray]
      })
    }
  }

  // Reset statistics
  const resetStats = () => {
    setComparisons(0)
    setSwaps(0)
    setExecutionTime(0)
    setCurrentStep("")
    setActiveIndices([])
    setAccessPattern(Array(array.length).fill(0))
    setProgress(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    startTimeRef.current = null
    cancelRef.current = true
  }

  // Reset race without generating a new array
  const resetRace = () => {
    resetStats()
    setRaceResults([])

    // Reset race arrays to the original state
    if (typeof window !== "undefined") {
      raceAlgorithms.forEach((alg) => {
        window[`raceArray_${alg}`] = [...originalRaceArrayRef.current]
        window[`raceActiveIndices_${alg}`] = []
      })
    }

    // Force a re-render of race visualizations
    setRaceAlgorithms([...raceAlgorithms])
  }

  // Add a new resetAll function that calls both
  const resetAll = () => {
    resetStats()
    generateArray()
  }

  // Start sorting
  const startSorting = () => {
    if (!running && array.length > 0) {
      setRunning(true)
      resetStats() // Only reset stats, not the array
      cancelRef.current = false
      startTimeRef.current = Date.now()

      // Start timer
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setExecutionTime(Date.now() - startTimeRef.current)
        }
      }, 10)

      // Start sorting
      algorithms[algorithm].sort(
        array,
        setArray,
        speed,
        setComparisons,
        setSwaps,
        setRunning,
        cancelRef,
        timerRef,
        setCurrentStep,
        soundEnabled,
        setActiveIndices,
        setAccessPattern,
        setProgress,
      )
    }
  }

  // Stop sorting
  const stopSorting = () => {
    if (running) {
      // Set cancel flag to true to signal algorithms to stop
      cancelRef.current = true

      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Set running state to false
      setRunning(false)

      // For race mode, we need to ensure all visualizations stop immediately
      if (raceMode && typeof window !== "undefined") {
        // Force update the race visualizations to show they've stopped
        setRaceAlgorithms([...raceAlgorithms])

        // Clear race results if race was stopped before completion
        if (raceResults.length === 0) {
          setCurrentStep("Race stopped. Click 'Start Race' to begin again or 'Reset' to reset the arrays.")
        }
      }
    }
  }

  // Start algorithm race
  const startRace = async () => {
    if (!running && array.length > 0) {
      setRunning(true)
      setRaceResults([])
      resetStats() // Reset stats before starting
      cancelRef.current = false
      startTimeRef.current = Date.now()

      // Start timer
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setExecutionTime(Date.now() - startTimeRef.current)
        }
      }, 10)

      // Initialize arrays and active indices for each algorithm
      raceAlgorithms.forEach((alg) => {
        // Create a copy of the original array for each algorithm
        window[`raceArray_${alg}`] = [...originalRaceArrayRef.current]
        window[`raceActiveIndices_${alg}`] = []
      })

      // Create a state updater function
      const updateRaceState = () => {
        // This will trigger a re-render of the visualization components
        setRaceAlgorithms([...raceAlgorithms])
      }

      // Start race
      const racePromises = raceAlgorithms.map(async (alg) => {
        const startTime = Date.now()
        let comparisons = 0
        let swaps = 0

        // Create a promise that resolves when the algorithm is done
        return new Promise((resolve) => {
          const setArrayCopy = (newArray) => {
            // Store the array in a global object that can be accessed by the visualization
            window[`raceArray_${alg}`] = [...newArray]
            updateRaceState()
          }

          const setActiveIndicesCopy = (indices) => {
            // Store the active indices in a global object
            window[`raceActiveIndices_${alg}`] = [...indices]
            updateRaceState()
          }

          const setComparisonsCopy = (count) => {
            comparisons = count
          }

          const setSwapsCopy = (count) => {
            swaps = count
          }

          const setRunningCopy = (isRunning) => {
            if (!isRunning) {
              const endTime = Date.now()
              resolve({
                algorithm: alg,
                time: endTime - startTime,
                comparisons,
                swaps,
                name: algorithms[alg].name,
              })
            }
          }

          // Run the algorithm with visualization
          algorithms[alg].sort(
            [...window[`raceArray_${alg}`]], // Use a copy of the array
            setArrayCopy,
            speed, // Use the actual speed for visualization
            setComparisonsCopy,
            setSwapsCopy,
            setRunningCopy,
            cancelRef, // Pass the actual cancelRef object, not just its current value
            { current: null },
            () => {}, // No step updates
            false, // No sound
            setActiveIndicesCopy, // Pass the active indices setter
            () => {}, // No access pattern
            () => {}, // No progress
          )
        })
      })

      try {
        // Wait for all algorithms to finish
        const results = await Promise.all(racePromises)

        // Only process results if the race wasn't cancelled
        if (!cancelRef.current) {
          // Sort results by time
          results.sort((a, b) => a.time - b.time)

          setRaceResults(results)

          // Update stats
          const newStats = { ...stats }
          newStats.totalSorts += raceAlgorithms.length
          newStats.fastestSort = Math.min(newStats.fastestSort, results[0].time)

          raceAlgorithms.forEach((alg) => {
            newStats.algorithmsUsed[alg] = true
          })

          const minComparisons = Math.min(...results.map((r) => r.comparisons))
          newStats.minComparisons = Math.min(newStats.minComparisons, minComparisons)

          setStats(newStats)
          localStorage.setItem("algorithmVisualizerStats", JSON.stringify(newStats))

          // Check for new achievements
          checkAchievements(newStats)
        }
      } finally {
        // Always clean up and set running to false when done
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        setRunning(false)
      }
    }
  }

  // Start challenge
  const startChallenge = () => {
    if (!running) {
      const challenge = challenges[currentChallenge]
      const challengeArray = challenge.generator(arraySize)
      setArray(challengeArray)
      setCurrentStep(`Challenge: ${challenge.name} - ${challenge.description}`)
    }
  }

  // Complete challenge
  const completeChallenge = () => {
    const newStats = { ...stats }
    newStats.challengesCompleted++
    setStats(newStats)
    localStorage.setItem("algorithmVisualizerStats", JSON.stringify(newStats))

    // Move to next challenge
    setCurrentChallenge((currentChallenge + 1) % challenges.length)

    // Check for new achievements
    checkAchievements(newStats)

    // Show confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  // Check for new achievements
  const checkAchievements = (currentStats) => {
    achievementsList.forEach((achievement) => {
      if (!achievements.includes(achievement.id) && achievement.condition(currentStats)) {
        const newAchievements = [...achievements, achievement.id]
        setAchievements(newAchievements)
        localStorage.setItem("algorithmVisualizerAchievements", JSON.stringify(newAchievements))

        // Show achievement notification
        setShowNewAchievement(achievement.id)
        setTimeout(() => setShowNewAchievement(null), 3000)
      }
    })
  }

  // Handle drag and drop for manual sorting
  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (e, index) => {
    e.preventDefault()

    if (draggedIndex !== null) {
      const newArray = [...array]
      const draggedValue = newArray[draggedIndex]

      // Remove the dragged item
      newArray.splice(draggedIndex, 1)

      // Insert at the new position
      newArray.splice(index, 0, draggedValue)

      setArray(newArray)
      setDraggedIndex(null)
      setDragOverIndex(null)
    }
  }

  // Get achievement by ID
  const getAchievement = (id): Achievement | undefined => {
    return achievementsList.find((a) => a.id === id)
  }

  // Initialize array on component mount
  useEffect(() => {
    generateArray()
  }, [arraySize])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("algorithmVisualizerSpeed", speed.toString())
    }
  }, [speed])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("algorithmVisualizerSize", arraySize.toString())
    }
  }, [arraySize])

  // Update stats when a sort completes
  useEffect(() => {
    if (!running && executionTime > 0) {
      const newStats = { ...stats }
      newStats.totalSorts++
      newStats.fastestSort = Math.min(newStats.fastestSort, executionTime)
      newStats.algorithmsUsed[algorithm] = true
      newStats.minComparisons = Math.min(newStats.minComparisons, comparisons)
      newStats.arraySize = arraySize

      setStats(newStats)
      localStorage.setItem("algorithmVisualizerStats", JSON.stringify(newStats))

      // Check for new achievements
      checkAchievements(newStats)
    }
  }, [running, executionTime])

  // Set is3D when visualization mode changes
  useEffect(() => {
    setIs3D(visualizationMode === "3d")
  }, [visualizationMode])

  // Store original array when race mode is enabled
  useEffect(() => {
    if (raceMode) {
      originalRaceArrayRef.current = [...array]
    }
  }, [raceMode, array])

  return {
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
    currentChallenge,
    showTutorial,
    tutorialStep,
    achievements,
    stats,
    showNewAchievement,
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
    startChallenge,
    completeChallenge,
    handleDragStart,
    handleDragOver,
    handleDrop,
    getAchievement,
  }
}
