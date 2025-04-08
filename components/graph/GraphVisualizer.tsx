"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Network, Play, Pause, RotateCcw, Plus, Trash, HelpCircle, Eraser, ArrowRight } from "lucide-react"
import { GraphControls } from "@/components/graph/GraphControls"
import { GraphSettings } from "@/components/graph/GraphSettings"
import { GraphCanvas } from "@/components/graph/GraphCanvas"
import { useGraph } from "@/hooks/useGraph"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface GraphVisualizerProps {
  soundEnabled: boolean
}

export function GraphVisualizer({ soundEnabled }: GraphVisualizerProps) {
  const [showInstructions, setShowInstructions] = useState(false)

  const {
    graph,
    algorithm,
    speed,
    isDirected,
    isWeighted,
    isRunning,
    isFinished,
    currentStep,
    progress,
    visitedNodes,
    activeEdges,
    resultNodes,
    resultEdges,
    mode,
    selectedNode,
    setAlgorithm,
    setSpeed,
    setIsDirected,
    setIsWeighted,
    toggleDirected,
    toggleWeighted,
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    clearGraph,
    resetGraph,
    generateRandomGraph,
    visualizeAlgorithm,
    stopVisualization,
    setMode,
    selectNode,
    setGraph,
    nodeCounter,
    edgeCounter,
    setCurrentStep,
  } = useGraph(soundEnabled)

  // Helper functions for detailed results
  const calculateMSTWeight = () => {
    let totalWeight = 0
    for (const edgeId of resultEdges) {
      const edge = graph.edges.find((e) => e.id === edgeId)
      if (edge) {
        totalWeight += edge.weight
      }
    }
    return totalWeight
  }

  const countNodesInMST = () => {
    if (resultEdges.length === 0) return 0

    const nodesInMST = new Set()

    for (const edgeId of resultEdges) {
      const edge = graph.edges.find((e) => e.id === edgeId)
      if (edge) {
        nodesInMST.add(edge.source)
        nodesInMST.add(edge.target)
      }
    }

    return nodesInMST.size
  }

  const countSCCComponents = () => {
    if (resultNodes.length === 0) return 0

    // Count components by tracking changes in the resultNodes order
    let componentCount = 1
    let lastNodeId = resultNodes[0]

    for (let i = 1; i < resultNodes.length; i++) {
      // In the SCC algorithm, nodes from different components are grouped together
      // We need to detect when we move to a new component
      const nodeIndex = graph.nodes.findIndex((n) => n.id === resultNodes[i])
      const lastNodeIndex = graph.nodes.findIndex((n) => n.id === lastNodeId)

      // If we jump to a node that's not connected to the previous one, it's a new component
      if (Math.abs(nodeIndex - lastNodeIndex) > 1 && !areNodesConnected(lastNodeId, resultNodes[i])) {
        componentCount++
      }

      lastNodeId = resultNodes[i]
    }

    return componentCount
  }

  const areNodesConnected = (nodeId1: string, nodeId2: string) => {
    return graph.edges.some(
      (e) =>
        (e.source === nodeId1 && e.target === nodeId2) || (!isDirected && e.source === nodeId2 && e.target === nodeId1),
    )
  }

  const largestSCCSize = () => {
    if (resultNodes.length === 0) return 0

    // Track component sizes
    const componentSizes = []
    let currentSize = 1
    let lastNodeId = resultNodes[0]

    for (let i = 1; i < resultNodes.length; i++) {
      const nodeIndex = graph.nodes.findIndex((n) => n.id === resultNodes[i])
      const lastNodeIndex = graph.nodes.findIndex((n) => n.id === lastNodeId)

      if (Math.abs(nodeIndex - lastNodeIndex) > 1 && !areNodesConnected(lastNodeId, resultNodes[i])) {
        componentSizes.push(currentSize)
        currentSize = 1
      } else {
        currentSize++
      }

      lastNodeId = resultNodes[i]
    }

    componentSizes.push(currentSize)
    return Math.max(...componentSizes, 0)
  }

  // Function to generate a highly complex graph
  const generateComplexGraph = () => {
    if (isRunning) return
    resetGraph()

    // Create a more structured complex graph with different patterns
    const nodeCount = 20 // Slightly fewer nodes for better visibility
    const nodes = []

    // Create nodes in a more organized layout
    // Main circle of nodes
    const centerX = 250
    const centerY = 250
    const mainRadius = 150

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 2 * Math.PI
      const x = centerX + mainRadius * Math.cos(angle)
      const y = centerY + mainRadius * Math.sin(angle)

      nodes.push({
        id: `node-${i + 1}`,
        x,
        y,
        label: (i + 1).toString(),
      })
    }

    // Inner circle of nodes
    const innerRadius = 80
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI + Math.PI / 6
      const x = centerX + innerRadius * Math.cos(angle)
      const y = centerY + innerRadius * Math.sin(angle)

      nodes.push({
        id: `node-${i + 13}`,
        x,
        y,
        label: (i + 13).toString(),
      })
    }

    // Add a couple of outlier nodes
    nodes.push({
      id: `node-19`,
      x: centerX - 200,
      y: centerY - 100,
      label: "19",
    })

    nodes.push({
      id: `node-20`,
      x: centerX + 200,
      y: centerY + 100,
      label: "20",
    })

    // Create a complex edge network with different patterns
    const edges = []

    // Connect outer circle in sequence (ring)
    for (let i = 0; i < 12; i++) {
      const weight = isWeighted ? Math.floor(Math.random() * 5) + 1 : 1
      edges.push({
        id: `edge-${edges.length + 1}`,
        source: nodes[i].id,
        target: nodes[(i + 1) % 12].id,
        weight,
      })
    }

    // Connect inner circle in sequence
    for (let i = 12; i < 18; i++) {
      const weight = isWeighted ? Math.floor(Math.random() * 5) + 1 : 1
      edges.push({
        id: `edge-${edges.length + 1}`,
        source: nodes[i].id,
        target: nodes[i === 17 ? 12 : i + 1].id,
        weight,
      })
    }

    // Connect outer to inner (spokes)
    for (let i = 0; i < 6; i++) {
      const weight = isWeighted ? Math.floor(Math.random() * 5) + 1 : 1
      edges.push({
        id: `edge-${edges.length + 1}`,
        source: nodes[i * 2].id,
        target: nodes[i + 12].id,
        weight,
      })
    }

    // Connect outliers
    edges.push({
      id: `edge-${edges.length + 1}`,
      source: nodes[0].id,
      target: nodes[18].id,
      weight: isWeighted ? Math.floor(Math.random() * 5) + 1 : 1,
    })

    edges.push({
      id: `edge-${edges.length + 1}`,
      source: nodes[6].id,
      target: nodes[19].id,
      weight: isWeighted ? Math.floor(Math.random() * 5) + 1 : 1,
    })

    // Add some cross-connections for complexity
    const crossConnections = [
      [1, 7],
      [2, 8],
      [3, 9],
      [4, 10],
      [5, 11],
      [12, 15],
      [13, 16],
      [14, 17],
      [18, 19],
    ]

    for (const [from, to] of crossConnections) {
      edges.push({
        id: `edge-${edges.length + 1}`,
        source: nodes[from].id,
        target: nodes[to].id,
        weight: isWeighted ? Math.floor(Math.random() * 5) + 1 : 1,
      })
    }

    setGraph({ nodes, edges })
    nodeCounter.current = nodeCount + 1
    edgeCounter.current = edges.length + 1
    setCurrentStep(
      "Complex graph generated with wheel structure, inner and outer rings, and strategic cross-connections. Perfect for testing different graph algorithms.",
    )
  }

  return (
    <>
      <Card className="mb-4 sm:mb-8 dark:bg-[#1C1C1C]/90 bg-white/90 border-0 shadow-lg rounded-xl sm:rounded-2xl backdrop-blur-sm transition-colors">
        <CardHeader className="dark:border-b dark:border-[#444444] border-b border-blue-200 rounded-t-xl sm:rounded-t-2xl transition-colors p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 dark:text-[#FF6F61] text-blue-600 font-semibold transition-colors">
            <Network className="h-5 w-5 sm:h-6 sm:w-6 dark:text-[#FF6F61] text-blue-500 transition-colors" />
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent transition-colors">
              Graph Algorithm Visualizer
            </span>
          </CardTitle>
          <CardDescription className="dark:text-[#F5E8D8]/70 text-gray-500 text-sm sm:text-base transition-colors">
            Visualize how different graph algorithms traverse and analyze graph structures
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <GraphControls algorithm={algorithm} setAlgorithm={setAlgorithm} isRunning={isRunning} />

              <GraphSettings
                speed={speed}
                setSpeed={setSpeed}
                isRunning={isRunning}
                isDirected={isDirected}
                isWeighted={isWeighted}
                toggleDirected={toggleDirected}
                toggleWeighted={toggleWeighted}
              />
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  onClick={generateRandomGraph}
                  disabled={isRunning}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
                >
                  <Network className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Random Graph
                </Button>
                <Button
                  onClick={generateComplexGraph}
                  disabled={isRunning}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
                >
                  <Network className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Complex Graph
                </Button>
                <Button
                  onClick={clearGraph}
                  disabled={isRunning}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
                >
                  <Trash className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Clear Graph
                </Button>
                <Button
                  onClick={resetGraph}
                  disabled={isRunning}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
                >
                  <RotateCcw className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Reset Visualization
                </Button>
              </div>
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
                    {algorithm === "topological" && "Topological Sort"}
                    {algorithm === "kruskal" && "Kruskal's MST"}
                    {algorithm === "prim" && "Prim's MST"}
                    {algorithm === "scc" && "Strongly Connected Components"}
                  </div>
                </div>
                <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 transition-colors">
                  <div className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 transition-colors">
                    Graph Type
                  </div>
                  <div className="text-lg sm:text-2xl font-bold dark:text-[#FF6F61] text-blue-600 transition-colors">
                    {isDirected ? "Directed" : "Undirected"} {isWeighted ? "Weighted" : "Unweighted"}
                  </div>
                </div>
              </div>

              <div className="dark:bg-[#1C1C1C]/80 bg-[#f8f8f5] p-3 sm:p-4 rounded-lg sm:rounded-xl dark:border dark:border-[#444444] border border-blue-200 min-h-[80px] sm:min-h-[100px] flex items-center transition-colors">
                <div className="text-xs sm:text-sm dark:text-[#F5E8D8] text-gray-700 w-full transition-colors">
                  {isFinished ? (
                    <div>
                      <p className="font-medium mb-2">
                        {algorithm === "bfs" && "BFS traversal complete!"}
                        {algorithm === "dfs" && "DFS traversal complete!"}
                        {algorithm === "topological" && "Topological sort complete!"}
                        {algorithm === "kruskal" && "Kruskal's MST algorithm complete!"}
                        {algorithm === "prim" && "Prim's MST algorithm complete!"}
                        {algorithm === "scc" && "Strongly Connected Components found!"}
                      </p>

                      {(algorithm === "bfs" || algorithm === "dfs") && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <span className="font-semibold">Visited:</span> {visitedNodes.length} nodes
                          </div>
                          <div>
                            <span className="font-semibold">Coverage:</span>{" "}
                            {graph.nodes.length > 0 ? Math.round((visitedNodes.length / graph.nodes.length) * 100) : 0}%
                            of graph
                          </div>
                          <div>
                            <span className="font-semibold">Starting node:</span>{" "}
                            {graph.nodes.length > 0 ? graph.nodes[0].label : "None"}
                          </div>
                          <div className="col-span-2">
                            <span className="font-semibold">Traversal order:</span>{" "}
                            <div className="max-h-20 overflow-y-auto mt-1 p-1 bg-gray-800 rounded text-xs">
                              {visitedNodes.map((id) => graph.nodes.find((n) => n.id === id)?.label || id).join(" → ")}
                            </div>
                          </div>
                          <div className="col-span-2 mt-2">
                            <span className="font-semibold">Analysis:</span>{" "}
                            {visitedNodes.length === graph.nodes.length
                              ? "Complete graph traversal achieved. All nodes are reachable from the start node."
                              : `${graph.nodes.length - visitedNodes.length} nodes were not reachable from the start node. The graph may have disconnected components.`}
                          </div>
                          <div className="col-span-2 mt-2">
                            <span className="font-semibold">Performance:</span>{" "}
                            {`Time complexity: O(V+E) where V=${graph.nodes.length} nodes and E=${graph.edges.length} edges. Space complexity: O(V).`}
                          </div>
                        </div>
                      )}

                      {algorithm === "topological" && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <span className="font-semibold">Ordered:</span> {resultNodes.length} nodes
                          </div>
                          <div>
                            <span className="font-semibold">Valid DAG:</span>{" "}
                            {resultNodes.length === graph.nodes.length ? "Yes" : "No"}
                          </div>
                          <div className="col-span-2">
                            <span className="font-semibold">Topological order:</span>{" "}
                            <div className="max-h-20 overflow-y-auto mt-1 p-1 bg-gray-800 rounded text-xs">
                              {resultNodes.map((id) => graph.nodes.find((n) => n.id === id)?.label || id).join(" → ")}
                            </div>
                          </div>
                          <div className="col-span-2 mt-2">
                            <span className="font-semibold">Analysis:</span>{" "}
                            {resultNodes.length === graph.nodes.length
                              ? "Complete topological ordering found. This graph is a valid Directed Acyclic Graph (DAG)."
                              : "Cycle detected in graph, partial ordering shown. Topological sort requires a Directed Acyclic Graph (DAG)."}
                          </div>
                          <div className="col-span-2 mt-2">
                            <span className="font-semibold">Applications:</span>{" "}
                            {
                              "Useful for scheduling tasks, dependency resolution, and determining build order in software compilation."
                            }
                          </div>
                        </div>
                      )}

                      {(algorithm === "kruskal" || algorithm === "prim") && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <span className="font-semibold">MST Edges:</span> {resultEdges.length} edges
                          </div>
                          <div>
                            <span className="font-semibold">Total Weight:</span> {calculateMSTWeight()}
                          </div>
                          <div>
                            <span className="font-semibold">Nodes Connected:</span> {countNodesInMST()} of{" "}
                            {graph.nodes.length}
                          </div>
                          <div>
                            <span className="font-semibold">Avg. Edge Weight:</span>{" "}
                            {resultEdges.length > 0 ? (calculateMSTWeight() / resultEdges.length).toFixed(2) : 0}
                          </div>
                          <div className="col-span-2 mt-1">
                            <span className="font-semibold">MST Edges:</span>{" "}
                            <div className="max-h-20 overflow-y-auto mt-1 p-1 bg-gray-800 rounded text-xs">
                              {resultEdges
                                .map((edgeId) => {
                                  const edge = graph.edges.find((e) => e.id === edgeId)
                                  if (!edge) return null
                                  const source = graph.nodes.find((n) => n.id === edge.source)?.label || edge.source
                                  const target = graph.nodes.find((n) => n.id === edge.target)?.label || edge.target
                                  return `${source} → ${target} (${edge.weight})`
                                })
                                .join(", ")}
                            </div>
                          </div>
                          <div className="col-span-2 mt-2">
                            <span className="font-semibold">Analysis:</span>{" "}
                            {resultEdges.length === graph.nodes.length - 1
                              ? `Complete spanning tree found with minimum total weight of ${calculateMSTWeight()}.`
                              : `Graph is not connected. Found ${countNodesInMST()} nodes in the largest component with total weight ${calculateMSTWeight()}.`}
                          </div>
                          <div className="col-span-2 mt-2">
                            <span className="font-semibold">Algorithm Efficiency:</span>{" "}
                            {algorithm === "kruskal"
                              ? `Kruskal's algorithm runs in O(E log E) time where E=${graph.edges.length}.`
                              : `Prim's algorithm runs in O(E log V) time where V=${graph.nodes.length} and E=${graph.edges.length}.`}
                          </div>
                        </div>
                      )}

                      {algorithm === "scc" && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <span className="font-semibold">Components:</span> {countSCCComponents()} found
                          </div>
                          <div>
                            <span className="font-semibold">Largest:</span> {largestSCCSize()} nodes
                          </div>
                          <div>
                            <span className="font-semibold">Nodes in SCCs:</span> {resultNodes.length} of{" "}
                            {graph.nodes.length}
                          </div>
                          <div>
                            <span className="font-semibold">Connectivity:</span>{" "}
                            {countSCCComponents() === 1 ? "Strongly connected" : "Not strongly connected"}
                          </div>
                          <div className="col-span-2 mt-1">
                            <span className="font-semibold">Components:</span>{" "}
                            <div className="max-h-20 overflow-y-auto mt-1 p-1 bg-gray-800 rounded text-xs">
                              {(() => {
                                // Group nodes by component
                                const components = []
                                let currentComponent = []
                                let lastNodeId = resultNodes.length > 0 ? resultNodes[0] : null

                                for (let i = 0; i < resultNodes.length; i++) {
                                  const nodeId = resultNodes[i]
                                  const nodeLabel = graph.nodes.find((n) => n.id === nodeId)?.label || nodeId

                                  if (i > 0) {
                                    const nodeIndex = graph.nodes.findIndex((n) => n.id === nodeId)
                                    const lastNodeIndex = graph.nodes.findIndex((n) => n.id === lastNodeId)

                                    if (
                                      Math.abs(nodeIndex - lastNodeIndex) > 1 &&
                                      !areNodesConnected(lastNodeId, nodeId)
                                    ) {
                                      components.push([...currentComponent])
                                      currentComponent = []
                                    }
                                  }

                                  currentComponent.push(nodeLabel)
                                  lastNodeId = nodeId
                                }

                                if (currentComponent.length > 0) {
                                  components.push(currentComponent)
                                }

                                return components
                                  .map((comp, idx) => `Component ${idx + 1}: {${comp.join(", ")}}`)
                                  .join("\n")
                              })()}
                            </div>
                          </div>
                          <div className="col-span-2 mt-2">
                            <span className="font-semibold">Analysis:</span>{" "}
                            {countSCCComponents() === 1 && resultNodes.length === graph.nodes.length
                              ? "Graph is strongly connected (every node can reach every other node)."
                              : `Graph has ${countSCCComponents()} separate strongly connected regions. In a directed graph, this indicates distinct areas where nodes can reach each other.`}
                          </div>
                          <div className="col-span-2 mt-2">
                            <span className="font-semibold">Applications:</span>{" "}
                            {
                              "Useful for analyzing website link structures, social networks, and dependency analysis in software."
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    currentStep || "Click on the canvas to add nodes. Select nodes to create edges between them."
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={visualizeAlgorithm}
                  disabled={isRunning || graph.nodes.length === 0}
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
                  onClick={resetGraph}
                  disabled={isRunning}
                  variant="outline"
                  className="flex-1 dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Reset
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Regular Node</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Visited Node</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Active Node</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="dark:text-[#F5E8D8] text-gray-700">Result Node</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-[#1C1C1C]/90 bg-white/90 border-0 shadow-lg rounded-xl sm:rounded-2xl backdrop-blur-sm transition-colors">
        <CardHeader className="dark:border-b dark:border-[#444444] border-b border-blue-200 rounded-t-xl sm:rounded-t-2xl transition-colors p-4 sm:p-6">
          <CardTitle className="dark:text-[#FF6F61] text-blue-600 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 transition-colors">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent font-semibold transition-colors">
                Graph Visualization
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 dark:text-[#FF6F61] text-blue-500 transition-colors"
                      onClick={() => setShowInstructions(true)}
                    >
                      <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs sm:text-sm">Show instructions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("addNode")}
                disabled={isRunning}
                className={`dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm ${
                  mode === "addNode" ? "bg-blue-100 dark:bg-[#FF6F61]/20 font-bold" : ""
                }`}
              >
                <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Add Node
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("addEdge")}
                disabled={isRunning}
                className={`dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm ${
                  mode === "addEdge" ? "bg-blue-100 dark:bg-[#FF6F61]/20 font-bold" : ""
                }`}
              >
                <ArrowRight className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Add Edge
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("delete")}
                disabled={isRunning}
                className={`dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm ${
                  mode === "delete" ? "bg-blue-100 dark:bg-[#FF6F61]/20 font-bold" : ""
                }`}
              >
                <Eraser className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Erase
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="dark:text-[#F5E8D8]/70 text-gray-500 text-sm sm:text-base transition-colors">
            Click to add nodes. Select two nodes to create an edge. Use the buttons above to switch modes.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl my-2 sm:my-4 mx-2 p-2 sm:p-4 transition-colors">
          <GraphCanvas
            graph={graph}
            isDirected={isDirected}
            isWeighted={isWeighted}
            visitedNodes={visitedNodes}
            activeEdges={activeEdges}
            resultNodes={resultNodes}
            resultEdges={resultEdges}
            mode={mode}
            selectedNode={selectedNode}
            isRunning={isRunning}
            onAddNode={addNode}
            onAddEdge={addEdge}
            onRemoveNode={removeNode}
            onRemoveEdge={removeEdge}
            onSelectNode={selectNode}
          />
        </CardContent>
      </Card>

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Graph Visualization Instructions</DialogTitle>
            <DialogDescription>Learn how to use the Graph Algorithm Visualizer effectively</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-semibold text-lg dark:text-[#FF6F61] text-blue-600 mb-2">Creating Nodes</h3>
              <p className="text-sm dark:text-[#F5E8D8] text-gray-700">
                1. Select the "Add Node" mode from the buttons above the canvas.
                <br />
                2. Click anywhere on the canvas to create a new node.
                <br />
                3. Nodes are automatically labeled with sequential numbers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg dark:text-[#FF6F61] text-blue-600 mb-2">Creating Edges</h3>
              <p className="text-sm dark:text-[#F5E8D8] text-gray-700">
                1. Select the "Add Edge" mode from the buttons above the canvas.
                <br />
                2. Click on a node to select it as the source node (it will turn yellow).
                <br />
                3. A temporary line will follow your cursor until you click another node.
                <br />
                4. Click on a different node to create an edge between the two nodes.
                <br />
                5. If "Weighted Edges" is enabled, you'll be prompted to enter a weight for the edge.
                <br />
                6. To cancel edge creation, click on the same node again or switch modes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg dark:text-[#FF6F61] text-blue-600 mb-2">Deleting Elements</h3>
              <p className="text-sm dark:text-[#F5E8D8] text-gray-700">
                1. Select the "Delete" mode from the buttons above the canvas.
                <br />
                2. Click on a node to delete it and all its connected edges.
                <br />
                3. Click on an edge to delete just that edge.
                <br />
                4. The cursor will change to indicate you're in delete mode.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg dark:text-[#FF6F61] text-blue-600 mb-2">Graph Types</h3>
              <p className="text-sm dark:text-[#F5E8D8] text-gray-700">
                1. Toggle "Directed Graph" to switch between directed and undirected graphs.
                <br />
                2. In directed graphs, edges have arrows showing their direction.
                <br />
                3. Toggle "Weighted Edges" to add numerical weights to edges.
                <br />
                4. Weights are displayed on the edges and used by algorithms like Dijkstra's.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg dark:text-[#FF6F61] text-blue-600 mb-2">Running Algorithms</h3>
              <p className="text-sm dark:text-[#F5E8D8] text-gray-700">
                1. Select an algorithm from the dropdown menu.
                <br />
                2. Click the "Visualize" button to start the algorithm.
                <br />
                3. Watch as nodes and edges change color to show the algorithm's progress:
                <br />- Blue: Regular nodes
                <br />- Green: Visited nodes
                <br />- Yellow: Currently active nodes/edges
                <br />- Red: Result nodes/edges (e.g., nodes in topological order, edges in MST)
                <br />
                4. Use the speed slider to control the animation speed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg dark:text-[#FF6F61] text-blue-600 mb-2">Tips</h3>
              <p className="text-sm dark:text-[#F5E8D8] text-gray-700">
                • Use "Random Graph" to quickly generate a graph for testing.
                <br />• "Reset" clears the visualization but keeps your graph structure.
                <br />• "Clear Graph" removes all nodes and edges to start fresh.
                <br />• Some algorithms only work on specific graph types (e.g., Topological Sort requires a directed
                acyclic graph).
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
