"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface Node {
  row: number
  col: number
  isStart: boolean
  isFinish: boolean
  isWall: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  previousNode: Node | null
  fScore?: number
  gScore?: number
  hScore?: number
}

export function usePathfinding(soundEnabled: boolean) {
  // Grid dimensions
  const ROW_COUNT = 20
  const COL_COUNT = 40

  // State
  const [grid, setGrid] = useState<Node[][]>([])
  const [startNode, setStartNode] = useState<{ row: number; col: number }>({ row: 10, col: 5 })
  const [finishNode, setFinishNode] = useState<{ row: number; col: number }>({ row: 10, col: 35 })
  const [mouseIsPressed, setMouseIsPressed] = useState(false)
  const [isMovingStart, setIsMovingStart] = useState(false)
  const [isMovingFinish, setIsMovingFinish] = useState(false)
  const [algorithm, setAlgorithm] = useState<string>("dijkstra")
  const [speed, setSpeed] = useState<number>(50)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [visitedNodesInOrder, setVisitedNodesInOrder] = useState<Node[]>([])
  const [nodesInShortestPathOrder, setNodesInShortestPathOrder] = useState<Node[]>([])
  const [currentStep, setCurrentStep] = useState<string>("")
  const [progress, setProgress] = useState<number>(0)

  const animationRef = useRef<number | null>(null)
  const cancelRef = useRef<boolean>(false)

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: Node[][] = []
    for (let row = 0; row < ROW_COUNT; row++) {
      const currentRow: Node[] = []
      for (let col = 0; col < COL_COUNT; col++) {
        currentRow.push(createNode(row, col))
      }
      newGrid.push(currentRow)
    }
    return newGrid
  }, [])

  // Create a node
  const createNode = (row: number, col: number): Node => {
    return {
      row,
      col,
      isStart: row === startNode.row && col === startNode.col,
      isFinish: row === finishNode.row && col === finishNode.col,
      isWall: false,
      isVisited: false,
      isPath: false,
      distance: Number.POSITIVE_INFINITY,
      previousNode: null,
    }
  }

  // Initialize grid on component mount
  useEffect(() => {
    const initialGrid = initializeGrid()
    setGrid(initialGrid)
  }, [initializeGrid])

  // Reset grid when start or finish node changes
  useEffect(() => {
    if (grid.length > 0) {
      const newGrid = grid.map((row) =>
        row.map((node) => ({
          ...node,
          isStart: node.row === startNode.row && node.col === startNode.col,
          isFinish: node.row === finishNode.row && node.col === finishNode.col,
        })),
      )
      setGrid(newGrid)
    }
  }, [startNode, finishNode])

  // Handle mouse down
  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return

    const node = grid[row][col]

    if (node.isStart) {
      setIsMovingStart(true)
    } else if (node.isFinish) {
      setIsMovingFinish(true)
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col)
      setGrid(newGrid)
    }

    setMouseIsPressed(true)
  }

  // Handle mouse enter
  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isRunning) return

    if (isMovingStart) {
      setStartNode({ row, col })
    } else if (isMovingFinish) {
      setFinishNode({ row, col })
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col)
      setGrid(newGrid)
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setMouseIsPressed(false)
    setIsMovingStart(false)
    setIsMovingFinish(false)
  }

  // Toggle wall in grid
  const getNewGridWithWallToggled = (grid: Node[][], row: number, col: number) => {
    const newGrid = grid.slice()
    const node = newGrid[row][col]

    if (!node.isStart && !node.isFinish) {
      const newNode = {
        ...node,
        isWall: !node.isWall,
      }
      newGrid[row][col] = newNode
    }

    return newGrid
  }

  // Reset grid
  const resetGrid = () => {
    if (isRunning) return

    cancelRef.current = true
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    setStartNode({ row: 10, col: 5 })
    setFinishNode({ row: 10, col: 35 })
    setGrid(initializeGrid())
    setVisitedNodesInOrder([])
    setNodesInShortestPathOrder([])
    setIsFinished(false)
    setCurrentStep("")
    setProgress(0)
  }

  // Clear path
  const clearPath = () => {
    if (isRunning) return

    cancelRef.current = true
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Number.POSITIVE_INFINITY,
        previousNode: null,
      })),
    )

    setGrid(newGrid)
    setVisitedNodesInOrder([])
    setNodesInShortestPathOrder([])
    setIsFinished(false)
    setCurrentStep("")
    setProgress(0)
  }

  // Generate maze
  const generateMaze = () => {
    if (isRunning) return

    clearPath()

    // Simple recursive division maze generation
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
      })),
    )

    // Add border walls
    for (let i = 0; i < ROW_COUNT; i++) {
      if (i !== startNode.row && i !== finishNode.row) {
        newGrid[i][0].isWall = true
        newGrid[i][COL_COUNT - 1].isWall = true
      }
    }

    for (let j = 0; j < COL_COUNT; j++) {
      if (j !== startNode.col && j !== finishNode.col) {
        newGrid[0][j].isWall = true
        newGrid[ROW_COUNT - 1][j].isWall = true
      }
    }

    // Add random walls
    for (let i = 2; i < ROW_COUNT - 2; i++) {
      for (let j = 2; j < COL_COUNT - 2; j++) {
        if (
          Math.random() < 0.3 &&
          !newGrid[i][j].isStart &&
          !newGrid[i][j].isFinish &&
          !(Math.abs(i - startNode.row) <= 2 && Math.abs(j - startNode.col) <= 2) &&
          !(Math.abs(i - finishNode.row) <= 2 && Math.abs(j - finishNode.col) <= 2)
        ) {
          newGrid[i][j].isWall = true
        }
      }
    }

    setGrid(newGrid)
    setCurrentStep("Maze generated! Click Visualize to start the algorithm.")
  }

  // Visualize algorithm
  const visualizeAlgorithm = () => {
    if (isRunning) return

    clearPath()
    setIsRunning(true)
    cancelRef.current = false

    const startNodeObj = grid[startNode.row][startNode.col]
    const finishNodeObj = grid[finishNode.row][finishNode.col]

    let visitedNodes: Node[] = []

    switch (algorithm) {
      case "bfs":
        setCurrentStep("Running Breadth-First Search...")
        visitedNodes = bfs(grid, startNodeObj, finishNodeObj)
        break
      case "dfs":
        setCurrentStep("Running Depth-First Search...")
        visitedNodes = dfs(grid, startNodeObj, finishNodeObj)
        break
      case "dijkstra":
        setCurrentStep("Running Dijkstra's Algorithm...")
        visitedNodes = dijkstra(grid, startNodeObj, finishNodeObj)
        break
      case "astar":
        setCurrentStep("Running A* Algorithm...")
        visitedNodes = astar(grid, startNodeObj, finishNodeObj)
        break
      default:
        setCurrentStep("Running Dijkstra's Algorithm...")
        visitedNodes = dijkstra(grid, startNodeObj, finishNodeObj)
    }

    const nodesInShortestPath = getNodesInShortestPathOrder(finishNodeObj)

    setVisitedNodesInOrder(visitedNodes)
    setNodesInShortestPathOrder(nodesInShortestPath)

    animateAlgorithm(visitedNodes, nodesInShortestPath)
  }

  // Stop visualization
  const stopVisualization = () => {
    if (!isRunning) return

    cancelRef.current = true
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    setIsRunning(false)
    setCurrentStep("Visualization stopped. Click Visualize to restart.")
  }

  // Animate algorithm
  const animateAlgorithm = (visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[]) => {
    const totalSteps = visitedNodesInOrder.length + nodesInShortestPathOrder.length
    let step = 0

    const animate = (timestamp: number) => {
      if (cancelRef.current) {
        setIsRunning(false)
        return
      }

      if (step < visitedNodesInOrder.length) {
        const node = visitedNodesInOrder[step]

        setGrid((prevGrid) => {
          const newGrid = [...prevGrid]
          const newNode = {
            ...newGrid[node.row][node.col],
            isVisited: true,
          }
          newGrid[node.row][node.col] = newNode
          return newGrid
        })

        setProgress(Math.floor((step / totalSteps) * 100))
        setCurrentStep(`Exploring node at (${node.row}, ${node.col})...`)

        if (soundEnabled) {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
          const oscillator = audioCtx.createOscillator()
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(100 + node.row * 10, audioCtx.currentTime)

          const gainNode = audioCtx.createGain()
          gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1)

          oscillator.connect(gainNode)
          gainNode.connect(audioCtx.destination)

          oscillator.start()
          oscillator.stop(audioCtx.currentTime + 0.1)
        }

        step++
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate)
        }, speed / 2)
      } else if (step < totalSteps) {
        const pathIndex = step - visitedNodesInOrder.length
        const node = nodesInShortestPathOrder[pathIndex]

        setGrid((prevGrid) => {
          const newGrid = [...prevGrid]
          const newNode = {
            ...newGrid[node.row][node.col],
            isPath: true,
          }
          newGrid[node.row][node.col] = newNode
          return newGrid
        })

        setProgress(Math.floor((step / totalSteps) * 100))
        setCurrentStep(`Building shortest path... (${pathIndex + 1}/${nodesInShortestPathOrder.length} nodes)`)

        if (soundEnabled) {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
          const oscillator = audioCtx.createOscillator()
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(300 + pathIndex * 20, audioCtx.currentTime)

          const gainNode = audioCtx.createGain()
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1)

          oscillator.connect(gainNode)
          gainNode.connect(audioCtx.destination)

          oscillator.start()
          oscillator.stop(audioCtx.currentTime + 0.1)
        }

        step++
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate)
        }, speed)
      } else {
        setIsRunning(false)
        setIsFinished(true)

        if (nodesInShortestPathOrder.length > 0) {
          setCurrentStep(
            `Path found! Length: ${nodesInShortestPathOrder.length} nodes, Explored: ${visitedNodesInOrder.length} nodes`,
          )
        } else {
          setCurrentStep("No path found! The target is unreachable.")
        }

        setProgress(100)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Breadth-First Search algorithm
  const bfs = (grid: Node[][], startNode: Node, finishNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = []
    const queue: Node[] = []

    startNode.distance = 0
    queue.push(startNode)

    while (queue.length > 0) {
      if (cancelRef.current) break

      const currentNode = queue.shift()!

      if (currentNode.isWall) continue
      if (currentNode.isVisited) continue

      currentNode.isVisited = true
      visitedNodesInOrder.push(currentNode)

      if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
        return visitedNodesInOrder
      }

      const neighbors = getNeighbors(grid, currentNode)
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.distance = currentNode.distance + 1
          neighbor.previousNode = currentNode
          queue.push(neighbor)
        }
      }
    }

    return visitedNodesInOrder
  }

  // Depth-First Search algorithm
  const dfs = (grid: Node[][], startNode: Node, finishNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = []
    const stack: Node[] = []

    startNode.distance = 0
    stack.push(startNode)

    while (stack.length > 0) {
      if (cancelRef.current) break

      const currentNode = stack.pop()!

      if (currentNode.isWall) continue
      if (currentNode.isVisited) continue

      currentNode.isVisited = true
      visitedNodesInOrder.push(currentNode)

      if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
        return visitedNodesInOrder
      }

      const neighbors = getNeighbors(grid, currentNode)
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.distance = currentNode.distance + 1
          neighbor.previousNode = currentNode
          stack.push(neighbor)
        }
      }
    }

    return visitedNodesInOrder
  }

  // Dijkstra's algorithm
  const dijkstra = (grid: Node[][], startNode: Node, finishNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = []
    const unvisitedNodes = getAllNodes(grid)

    startNode.distance = 0

    while (unvisitedNodes.length > 0) {
      if (cancelRef.current) break

      sortNodesByDistance(unvisitedNodes)
      const closestNode = unvisitedNodes.shift()!

      if (closestNode.isWall) continue
      if (closestNode.distance === Number.POSITIVE_INFINITY) return visitedNodesInOrder

      closestNode.isVisited = true
      visitedNodesInOrder.push(closestNode)

      if (closestNode.row === finishNode.row && closestNode.col === finishNode.col) {
        return visitedNodesInOrder
      }

      updateUnvisitedNeighbors(closestNode, grid)
    }

    return visitedNodesInOrder
  }

  // A* algorithm
  const astar = (grid: Node[][], startNode: Node, finishNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = []
    const openSet: Node[] = []

    // Initialize nodes with A* specific properties
    for (const row of grid) {
      for (const node of row) {
        node.gScore = Number.POSITIVE_INFINITY
        node.fScore = Number.POSITIVE_INFINITY
        node.hScore = manhattanDistance(node, finishNode)
      }
    }

    startNode.gScore = 0
    startNode.fScore = startNode.hScore!
    openSet.push(startNode)

    while (openSet.length > 0) {
      if (cancelRef.current) break

      // Sort by fScore
      openSet.sort((a, b) => a.fScore! - b.fScore!)
      const currentNode = openSet.shift()!

      if (currentNode.isWall) continue

      currentNode.isVisited = true
      visitedNodesInOrder.push(currentNode)

      if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
        return visitedNodesInOrder
      }

      const neighbors = getNeighbors(grid, currentNode)
      for (const neighbor of neighbors) {
        if (neighbor.isVisited) continue

        const tentativeGScore = currentNode.gScore! + 1

        if (tentativeGScore < neighbor.gScore!) {
          neighbor.previousNode = currentNode
          neighbor.gScore = tentativeGScore
          neighbor.fScore = neighbor.gScore + neighbor.hScore!

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor)
          }
        }
      }
    }

    return visitedNodesInOrder
  }

  // Manhattan distance heuristic for A*
  const manhattanDistance = (nodeA: Node, nodeB: Node): number => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col)
  }

  // Get all nodes from grid
  const getAllNodes = (grid: Node[][]): Node[] => {
    const nodes: Node[] = []
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node)
      }
    }
    return nodes
  }

  // Sort nodes by distance
  const sortNodesByDistance = (nodes: Node[]): void => {
    nodes.sort((a, b) => a.distance - b.distance)
  }

  // Update unvisited neighbors
  const updateUnvisitedNeighbors = (node: Node, grid: Node[][]): void => {
    const neighbors = getNeighbors(grid, node)
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.distance = node.distance + 1
        neighbor.previousNode = node
      }
    }
  }

  // Get neighbors of a node
  const getNeighbors = (grid: Node[][], node: Node): Node[] => {
    const neighbors: Node[] = []
    const { row, col } = node

    if (row > 0) neighbors.push(grid[row - 1][col])
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
    if (col > 0) neighbors.push(grid[row][col - 1])
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])

    return neighbors.filter((neighbor) => !neighbor.isVisited)
  }

  // Get nodes in shortest path order
  const getNodesInShortestPathOrder = (finishNode: Node): Node[] => {
    const nodesInShortestPathOrder: Node[] = []
    let currentNode: Node | null = finishNode

    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode)
      currentNode = currentNode.previousNode
    }

    return nodesInShortestPathOrder
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cancelRef.current = true
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
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
  }
}
