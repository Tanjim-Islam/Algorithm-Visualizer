"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Node {
  id: string
  x: number
  y: number
  label: string
}

interface Edge {
  id: string
  source: string
  target: string
  weight: number
}

interface Graph {
  nodes: Node[]
  edges: Edge[]
}

interface GraphCanvasProps {
  graph: Graph
  isDirected: boolean
  isWeighted: boolean
  visitedNodes: string[]
  activeEdges: string[]
  resultNodes: string[]
  resultEdges: string[]
  mode: string
  selectedNode: string | null
  isRunning: boolean
  onAddNode: (x: number, y: number) => void
  onAddEdge: (source: string, target: string, weight: number) => void
  onRemoveNode: (id: string) => void
  onRemoveEdge: (id: string) => void
  onSelectNode: (id: string | null) => void
}

export function GraphCanvas({
  graph,
  isDirected,
  isWeighted,
  visitedNodes,
  activeEdges,
  resultNodes,
  resultEdges,
  mode,
  selectedNode,
  isRunning,
  onAddNode,
  onAddEdge,
  onRemoveNode,
  onRemoveEdge,
  onSelectNode,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [showWeightDialog, setShowWeightDialog] = useState(false)
  const [edgeWeight, setEdgeWeight] = useState("1")
  const [pendingEdge, setPendingEdge] = useState<{ source: string; target: string } | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const [tempLineStart, setTempLineStart] = useState<{ x: number; y: number } | null>(null)

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isRunning) return

    // Get click position relative to canvas
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if click is on an existing node
    const clickedNode = graph.nodes.find((node) => Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 20)

    if (mode === "addNode" && !clickedNode) {
      onAddNode(x, y)
    } else if (mode === "delete" && !clickedNode) {
      // Check if click is on an edge
      const clickedEdge = findEdgeNearPoint(x, y)
      if (clickedEdge) {
        onRemoveEdge(clickedEdge)
      }
    }
  }

  // Find edge near a point
  const findEdgeNearPoint = (x: number, y: number): string | null => {
    const threshold = 10 // Distance threshold in pixels

    for (const edge of graph.edges) {
      const source = graph.nodes.find((n) => n.id === edge.source)
      const target = graph.nodes.find((n) => n.id === edge.target)

      if (!source || !target) continue

      // Calculate distance from point to line segment
      const distance = distanceToLineSegment(source.x, source.y, target.x, target.y, x, y)

      if (distance < threshold) {
        return edge.id
      }
    }

    return null
  }

  // Calculate distance from point to line segment
  const distanceToLineSegment = (x1: number, y1: number, x2: number, y2: number, x: number, y: number): number => {
    const A = x - x1
    const B = y - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1

    if (lenSq !== 0) {
      param = dot / lenSq
    }

    let xx, yy

    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }

    const dx = x - xx
    const dy = y - yy
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Handle node click
  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    if (isRunning) return

    if (mode === "delete") {
      onRemoveNode(nodeId)
      return
    }

    if (mode === "addEdge") {
      if (selectedNode === null) {
        onSelectNode(nodeId)
        const node = graph.nodes.find((n) => n.id === nodeId)
        if (node) {
          setTempLineStart({ x: node.x, y: node.y })
        }
      } else if (selectedNode !== nodeId) {
        // If weighted, show dialog to enter weight
        if (isWeighted) {
          setPendingEdge({ source: selectedNode, target: nodeId })
          setShowWeightDialog(true)
        } else {
          onAddEdge(selectedNode, nodeId, 1)
          onSelectNode(null)
          setTempLineStart(null)
        }
      } else {
        // Clicked the same node again, cancel edge creation
        onSelectNode(null)
        setTempLineStart(null)
      }
    }
  }

  // Handle edge click
  const handleEdgeClick = (e: React.MouseEvent, edgeId: string) => {
    e.stopPropagation()
    if (isRunning) return

    if (mode === "delete") {
      onRemoveEdge(edgeId)
    }
  }

  // Handle weight dialog confirm
  const handleWeightConfirm = () => {
    if (pendingEdge) {
      const weight = Number.parseInt(edgeWeight) || 1
      onAddEdge(pendingEdge.source, pendingEdge.target, weight)
      onSelectNode(null)
      setPendingEdge(null)
      setShowWeightDialog(false)
      setEdgeWeight("1")
      setTempLineStart(null)
    }
  }

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tempLineStart) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }
  }

  // Get node color based on its state
  const getNodeColor = (nodeId: string) => {
    if (resultNodes.includes(nodeId)) return theme === "dark" ? "#EF4444" : "#EF4444" // Red
    if (nodeId === selectedNode) return theme === "dark" ? "#F59E0B" : "#F59E0B" // Yellow
    if (visitedNodes.includes(nodeId)) return theme === "dark" ? "#10B981" : "#10B981" // Green
    return theme === "dark" ? "#3B82F6" : "#3B82F6" // Blue
  }

  // Get edge color based on its state
  const getEdgeColor = (edgeId: string) => {
    if (resultEdges.includes(edgeId)) return theme === "dark" ? "#EF4444" : "#EF4444" // Red
    if (activeEdges.includes(edgeId)) return theme === "dark" ? "#F59E0B" : "#F59E0B" // Yellow
    return theme === "dark" ? "#6B7280" : "#9CA3AF" // Gray
  }

  // Calculate edge path
  const getEdgePath = (source: Node, target: Node, isDirected: boolean) => {
    // Calculate the angle of the line
    const dx = target.x - source.x
    const dy = target.y - source.y
    const angle = Math.atan2(dy, dx)

    // Start and end points (adjusted to start/end at the node boundaries)
    const nodeRadius = 15
    const startX = source.x + nodeRadius * Math.cos(angle)
    const startY = source.y + nodeRadius * Math.sin(angle)
    const endX = target.x - nodeRadius * Math.cos(angle)
    const endY = target.y - nodeRadius * Math.sin(angle)

    if (isDirected) {
      // Calculate arrowhead points
      const arrowLength = 10
      const arrowAngle = Math.PI / 6 // 30 degrees
      const arrowPoint1X = endX - arrowLength * Math.cos(angle - arrowAngle)
      const arrowPoint1Y = endY - arrowLength * Math.sin(angle - arrowAngle)
      const arrowPoint2X = endX - arrowLength * Math.cos(angle + arrowAngle)
      const arrowPoint2Y = endY - arrowLength * Math.sin(angle + arrowAngle)

      return {
        line: `M${startX},${startY} L${endX},${endY}`,
        arrow: `M${endX},${endY} L${arrowPoint1X},${arrowPoint1Y} L${arrowPoint2X},${arrowPoint2Y} Z`,
        labelX: (source.x + target.x) / 2,
        labelY: (source.y + target.y) / 2 - 10,
      }
    } else {
      return {
        line: `M${startX},${startY} L${endX},${endY}`,
        arrow: "",
        labelX: (source.x + target.x) / 2,
        labelY: (source.y + target.y) / 2 - 10,
      }
    }
  }

  return (
    <>
      <div
        ref={canvasRef}
        className="w-full h-[500px] bg-white dark:bg-[#1C1C1C] rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      >
        {/* Render edges */}
        <svg className="absolute inset-0 w-full h-full">
          {graph.edges.map((edge) => {
            const source = graph.nodes.find((n) => n.id === edge.source)
            const target = graph.nodes.find((n) => n.id === edge.target)

            if (!source || !target) return null

            const { line, arrow, labelX, labelY } = getEdgePath(source, target, isDirected)
            const edgeColor = getEdgeColor(edge.id)

            return (
              <g key={edge.id} onClick={(e) => handleEdgeClick(e, edge.id)} className="pointer-events-auto">
                <path d={line} stroke={edgeColor} strokeWidth="2" fill="none" />
                {arrow && <path d={arrow} fill={edgeColor} />}
                {isWeighted && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={theme === "dark" ? "#F5E8D8" : "#4B5563"}
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            )
          })}

          {/* Render temporary line when creating an edge */}
          {tempLineStart && mousePosition && (
            <line
              x1={tempLineStart.x}
              y1={tempLineStart.y}
              x2={mousePosition.x}
              y2={mousePosition.y}
              stroke={theme === "dark" ? "#F59E0B" : "#F59E0B"}
              strokeWidth="2"
              strokeDasharray="5,5"
              className="pointer-events-none"
            />
          )}
        </svg>

        {/* Render nodes */}
        {graph.nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
            style={{
              left: node.x - 15,
              top: node.y - 15,
              width: 30,
              height: 30,
              backgroundColor: getNodeColor(node.id),
              boxShadow: node.id === selectedNode ? "0 0 0 3px rgba(245, 158, 11, 0.5)" : "none",
            }}
            onClick={(e) => handleNodeClick(e, node.id)}
            whileHover={{ scale: 1.1 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {node.label}
          </motion.div>
        ))}

        {/* Render cursor based on mode */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            mode === "addNode"
              ? "cursor-cell"
              : mode === "addEdge"
                ? "cursor-crosshair"
                : mode === "delete"
                  ? "cursor-not-allowed"
                  : "cursor-default"
          }`}
        />
      </div>

      {/* Weight dialog */}
      <Dialog open={showWeightDialog} onOpenChange={setShowWeightDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Edge Weight</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight
              </Label>
              <Input
                id="weight"
                type="number"
                min="1"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowWeightDialog(false)
                onSelectNode(null)
                setPendingEdge(null)
                setTempLineStart(null)
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleWeightConfirm}>
              Add Edge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
