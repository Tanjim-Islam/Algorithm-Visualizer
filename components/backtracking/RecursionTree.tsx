"use client"

import { useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import * as d3 from "d3"

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  data?: any
}

interface RecursionTreeProps {
  data: TreeNode
  currentNodeId?: string
}

export function RecursionTree({ data, currentNodeId }: RecursionTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight || 500

    const g = svg.append("g")

    // Create a tree layout
    const treeLayout = d3.tree().size([width - 60, height - 60])

    // Create a hierarchy from the data
    const root = d3.hierarchy(data)

    // Assign x and y coordinates to each node
    treeLayout(root)

    // Add links between nodes
    const links = g
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y),
      )
      .attr("fill", "none")
      .attr("stroke", isDark ? "#444444" : "#d1d5db")
      .attr("stroke-width", 1.5)

    // Add nodes
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)

    // Add circles for nodes
    nodes
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => {
        if (d.data.id === currentNodeId) {
          return isDark ? "#FF6F61" : "#3b82f6"
        }
        return isDark ? "#DAA520" : "#93c5fd"
      })
      .attr("stroke", (d) => {
        if (d.data.id === currentNodeId) {
          return isDark ? "#F5E8D8" : "white"
        }
        return "none"
      })
      .attr("stroke-width", 2)

    // Add labels for nodes
    nodes
      .append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", isDark ? "#F5E8D8" : "#374151")
      .text((d) => d.data.name)

    // Center the tree
    const rootNode = root.descendants()[0]
    g.attr("transform", `translate(${30},${30})`)
  }, [data, currentNodeId, isDark])

  return (
    <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-4 dark:text-[#F5E8D8] text-gray-800 text-center">Recursion Tree</h3>
        <div className="flex-grow overflow-auto">
          <svg ref={svgRef} width="100%" height="100%" style={{ minHeight: "400px" }}></svg>
        </div>
      </div>
    </Card>
  )
}
