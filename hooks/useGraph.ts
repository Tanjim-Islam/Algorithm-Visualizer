"use client";

import { useState, useRef } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export function useGraph(soundEnabled: boolean) {
  // State
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [algorithm, setAlgorithm] = useState<string>("bfs");
  // Update the speed range to allow faster animations
  const [speed, setSpeed] = useState<number>(100);
  const [isDirected, setIsDirected] = useState<boolean>(true);
  const [isWeighted, setIsWeighted] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [activeEdges, setActiveEdges] = useState<string[]>([]);
  const [resultNodes, setResultNodes] = useState<string[]>([]);
  const [resultEdges, setResultEdges] = useState<string[]>([]);
  const [mode, setMode] = useState<string>("addNode");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const animationRef = useRef<number | null>(null);
  const cancelRef = useRef<boolean>(false);
  const nodeCounter = useRef<number>(1);
  const edgeCounter = useRef<number>(1);

  // Toggle directed/undirected graph
  const toggleDirected = () => {
    if (isRunning) return;
    setIsDirected(!isDirected);
  };

  // Toggle weighted/unweighted edges
  const toggleWeighted = () => {
    if (isRunning) return;
    setIsWeighted(!isWeighted);
  };

  // Add a node to the graph
  const addNode = (x: number, y: number) => {
    const id = `node-${nodeCounter.current++}`;
    const label = (nodeCounter.current - 1).toString();

    setGraph((prev) => ({
      ...prev,
      nodes: [...prev.nodes, { id, x, y, label }],
    }));
  };

  // Add an edge to the graph
  const addEdge = (source: string, target: string, weight: number) => {
    // Check if edge already exists
    const edgeExists = graph.edges.some(
      (edge) =>
        (edge.source === source && edge.target === target) ||
        (!isDirected && edge.source === target && edge.target === source)
    );

    if (edgeExists) return;

    const id = `edge-${edgeCounter.current++}`;

    setGraph((prev) => ({
      ...prev,
      edges: [...prev.edges, { id, source, target, weight }],
    }));
  };

  // Remove a node from the graph
  const removeNode = (id: string) => {
    setGraph((prev) => ({
      nodes: prev.nodes.filter((node) => node.id !== id),
      edges: prev.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    }));

    // If we're removing the selected node, clear the selection
    if (selectedNode === id) {
      setSelectedNode(null);
    }
  };

  // Remove an edge from the graph
  const removeEdge = (id: string) => {
    setGraph((prev) => ({
      ...prev,
      edges: prev.edges.filter((edge) => edge.id !== id),
    }));
  };

  // Clear the graph
  const clearGraph = () => {
    if (isRunning) return;
    setGraph({ nodes: [], edges: [] });
    nodeCounter.current = 1;
    edgeCounter.current = 1;
    resetVisualization();
  };

  // Reset visualization
  const resetGraph = () => {
    if (isRunning) return;
    resetVisualization();
  };

  // Reset visualization state
  const resetVisualization = () => {
    cancelRef.current = true;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setVisitedNodes([]);
    setActiveEdges([]);
    setResultNodes([]);
    setResultEdges([]);
    setIsRunning(false);
    setIsFinished(false);
    setCurrentStep("");
    setProgress(0);
    setSelectedNode(null);
  };

  // Generate a random graph
  const generateRandomGraph = () => {
    if (isRunning) return;
    resetVisualization();

    const nodeCount = Math.floor(Math.random() * 5) + 5; // 5-10 nodes
    const nodes: Node[] = [];

    // Create nodes in a circle layout
    const centerX = 250;
    const centerY = 250;
    const radius = 180;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      nodes.push({
        id: `node-${i + 1}`,
        x,
        y,
        label: (i + 1).toString(),
      });
    }

    // Create edges
    const edges: Edge[] = [];
    const edgeProbability = isDirected ? 0.3 : 0.4;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = 0; j < nodeCount; j++) {
        // Fixed this line - was i < nodeCount
        if (i === j) continue;

        if (Math.random() < edgeProbability) {
          // Skip if undirected and we already have the reverse edge
          if (
            !isDirected &&
            edges.some(
              (e) => e.source === nodes[j].id && e.target === nodes[i].id
            )
          ) {
            continue;
          }

          const weight = isWeighted ? Math.floor(Math.random() * 9) + 1 : 1;

          edges.push({
            id: `edge-${edges.length + 1}`,
            source: nodes[i].id,
            target: nodes[j].id,
            weight,
          });
        }
      }
    }

    // Ensure the graph is connected
    for (let i = 0; i < nodeCount - 1; i++) {
      if (
        !edges.some(
          (e) =>
            (e.source === nodes[i].id && e.target === nodes[i + 1].id) ||
            (!isDirected &&
              e.source === nodes[i + 1].id &&
              e.target === nodes[i].id)
        )
      ) {
        const weight = isWeighted ? Math.floor(Math.random() * 9) + 1 : 1;

        edges.push({
          id: `edge-${edges.length + 1}`,
          source: nodes[i].id,
          target: nodes[i + 1].id,
          weight,
        });
      }
    }

    setGraph({ nodes, edges });
    nodeCounter.current = nodeCount + 1;
    edgeCounter.current = edges.length + 1;
  };

  // Visualize algorithm
  const visualizeAlgorithm = () => {
    if (isRunning || graph.nodes.length === 0) return;

    resetVisualization();
    setIsRunning(true);
    cancelRef.current = false;

    let visitedNodesInOrder: string[] = [];
    let resultNodesInOrder: string[] = [];
    let resultEdgesInOrder: string[] = [];

    // Choose a start node
    const startNodeId = graph.nodes[0].id;

    switch (algorithm) {
      case "bfs":
        setCurrentStep("Running Breadth-First Search...");
        visitedNodesInOrder = bfs(graph, startNodeId, isDirected);
        break;
      case "dfs":
        setCurrentStep("Running Depth-First Search...");
        visitedNodesInOrder = dfs(graph, startNodeId, isDirected);
        break;
      case "topological":
        setCurrentStep("Running Topological Sort...");
        resultNodesInOrder = topologicalSort(graph);
        break;
      case "kruskal":
        setCurrentStep("Running Kruskal's MST Algorithm...");
        resultEdgesInOrder = kruskalMST(graph);
        break;
      case "prim":
        setCurrentStep("Running Prim's MST Algorithm...");
        resultEdgesInOrder = primMST(graph, startNodeId);
        break;
      case "scc":
        setCurrentStep("Finding Strongly Connected Components...");
        resultNodesInOrder = findSCC(graph);
        break;
      default:
        setCurrentStep("Running Breadth-First Search...");
        visitedNodesInOrder = bfs(graph, startNodeId, isDirected);
    }

    animateAlgorithm(
      visitedNodesInOrder,
      [],
      resultNodesInOrder,
      resultEdgesInOrder
    );
  };

  // Stop visualization
  const stopVisualization = () => {
    if (!isRunning) return;

    cancelRef.current = true;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setIsRunning(false);
    setCurrentStep("Visualization stopped. Click Visualize to restart.");
  };

  // Add sound implementation to graph algorithms
  const animateAlgorithm = (
    visitedNodesInOrder: string[],
    activeEdgesInOrder: string[],
    resultNodesInOrder: string[],
    resultEdgesInOrder: string[]
  ) => {
    const totalSteps =
      visitedNodesInOrder.length +
      activeEdgesInOrder.length +
      resultNodesInOrder.length +
      resultEdgesInOrder.length;

    let step = 0;
    let visitedIdx = 0;
    let activeEdgeIdx = 0;
    let resultNodeIdx = 0;
    let resultEdgeIdx = 0;

    const animate = () => {
      if (cancelRef.current) {
        setIsRunning(false);
        return;
      }

      if (visitedIdx < visitedNodesInOrder.length) {
        const nodeId = visitedNodesInOrder[visitedIdx];

        setVisitedNodes((prev) => [...prev, nodeId]);
        setCurrentStep(
          `Visiting node ${
            graph.nodes.find((n) => n.id === nodeId)?.label || nodeId
          }...`
        );

        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + visitedIdx * 20,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }

        visitedIdx++;
        step++;
        setProgress(Math.floor((step / totalSteps) * 100));

        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate);
        }, speed);
      } else if (activeEdgeIdx < activeEdgesInOrder.length) {
        const edgeId = activeEdgesInOrder[activeEdgeIdx];

        setActiveEdges((prev) => [...prev, edgeId]);
        setCurrentStep(`Traversing edge ${edgeId}...`);

        activeEdgeIdx++;
        step++;
        setProgress(Math.floor((step / totalSteps) * 100));

        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate);
        }, speed);
      } else if (resultNodeIdx < resultNodesInOrder.length) {
        const nodeId = resultNodesInOrder[resultNodeIdx];

        setResultNodes((prev) => [...prev, nodeId]);
        setCurrentStep(
          `Adding node ${
            graph.nodes.find((n) => n.id === nodeId)?.label || nodeId
          } to result...`
        );

        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            300 + resultNodeIdx * 30,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }

        resultNodeIdx++;
        step++;
        setProgress(Math.floor((step / totalSteps) * 100));

        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate);
        }, speed);
      } else if (resultEdgeIdx < resultEdgesInOrder.length) {
        const edgeId = resultEdgesInOrder[resultEdgeIdx];

        setResultEdges((prev) => [...prev, edgeId]);
        setCurrentStep(`Adding edge ${edgeId} to result...`);

        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            400 + resultEdgeIdx * 40,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }

        resultEdgeIdx++;
        step++;
        setProgress(Math.floor((step / totalSteps) * 100));

        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate);
        }, speed);
      } else {
        setIsRunning(false);
        setIsFinished(true);

        if (algorithm === "bfs" || algorithm === "dfs") {
          setCurrentStep(
            `${algorithm.toUpperCase()} traversal complete! Visited ${
              visitedNodes.length
            } nodes.`
          );
        } else if (algorithm === "topological") {
          setCurrentStep(
            `Topological sort complete! Found ordering of ${resultNodes.length} nodes.`
          );
        } else if (algorithm === "kruskal" || algorithm === "prim") {
          setCurrentStep(
            `Minimum Spanning Tree complete! MST contains ${resultEdges.length} edges.`
          );
        } else if (algorithm === "scc") {
          setCurrentStep(
            `Found ${resultNodes.length} strongly connected components.`
          );
        }

        setProgress(100);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // BFS algorithm
  const bfs = (
    graph: Graph,
    startNodeId: string,
    isDirected: boolean
  ): string[] => {
    const visitedNodesInOrder: string[] = [];
    const queue: string[] = [];
    const visited = new Set<string>();

    queue.push(startNodeId);
    visited.add(startNodeId);

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      visitedNodesInOrder.push(currentNodeId);

      // Get all adjacent nodes
      const adjacentNodes = graph.edges
        .filter((edge) => {
          if (edge.source === currentNodeId) return true;
          return !isDirected && edge.target === currentNodeId;
        })
        .map((edge) =>
          edge.source === currentNodeId ? edge.target : edge.source
        );

      for (const neighborId of adjacentNodes) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      }
    }

    return visitedNodesInOrder;
  };

  // DFS algorithm
  const dfs = (
    graph: Graph,
    startNodeId: string,
    isDirected: boolean
  ): string[] => {
    const visitedNodesInOrder: string[] = [];
    const visited = new Set<string>();

    const dfsRecursive = (nodeId: string) => {
      visited.add(nodeId);
      visitedNodesInOrder.push(nodeId);

      // Get all adjacent nodes
      const adjacentNodes = graph.edges
        .filter((edge) => {
          if (edge.source === nodeId) return true;
          return !isDirected && edge.target === nodeId;
        })
        .map((edge) => (edge.source === nodeId ? edge.target : edge.source));

      for (const neighborId of adjacentNodes) {
        if (!visited.has(neighborId)) {
          dfsRecursive(neighborId);
        }
      }
    };

    dfsRecursive(startNodeId);
    return visitedNodesInOrder;
  };

  // Topological Sort algorithm
  const topologicalSort = (graph: Graph): string[] => {
    const result: string[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const visit = (nodeId: string): boolean => {
      // If node is in temporary set, we have a cycle
      if (temp.has(nodeId)) {
        return false; // Cycle detected
      }

      // If node is already visited, skip
      if (visited.has(nodeId)) {
        return true;
      }

      // Mark node as temporarily visited
      temp.add(nodeId);

      // Visit all neighbors
      const outgoingEdges = graph.edges.filter(
        (edge) => edge.source === nodeId
      );

      for (const edge of outgoingEdges) {
        if (!visit(edge.target)) {
          return false; // Cycle detected
        }
      }

      // Mark node as permanently visited
      temp.delete(nodeId);
      visited.add(nodeId);

      // Add node to result
      result.unshift(nodeId);
      return true;
    };

    // Try to visit all nodes
    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        if (!visit(node.id)) {
          // Cycle detected, return empty result
          return [];
        }
      }
    }

    return result;
  };

  // Kruskal's MST algorithm
  const kruskalMST = (graph: Graph): string[] => {
    if (graph.nodes.length === 0) return [];

    // Sort edges by weight
    const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);

    // Initialize disjoint set
    const parent: Record<string, string> = {};
    const rank: Record<string, number> = {};

    // Make set for each node
    for (const node of graph.nodes) {
      parent[node.id] = node.id;
      rank[node.id] = 0;
    }

    // Find root of a set
    const find = (nodeId: string): string => {
      if (parent[nodeId] !== nodeId) {
        parent[nodeId] = find(parent[nodeId]);
      }
      return parent[nodeId];
    };

    // Union two sets
    const union = (x: string, y: string) => {
      const rootX = find(x);
      const rootY = find(y);

      if (rootX === rootY) return;

      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
    };

    const resultEdges: string[] = [];

    // Process edges in order of increasing weight
    for (const edge of sortedEdges) {
      const rootSource = find(edge.source);
      const rootTarget = find(edge.target);

      // If including this edge doesn't create a cycle
      if (rootSource !== rootTarget) {
        resultEdges.push(edge.id);
        union(edge.source, edge.target);
      }
    }

    return resultEdges;
  };

  // Prim's MST algorithm
  const primMST = (graph: Graph, startNodeId: string): string[] => {
    if (graph.nodes.length === 0) return [];

    const resultEdges: string[] = [];
    const visited = new Set<string>();

    // Priority queue (simple array implementation)
    const pq: {
      edgeId: string;
      weight: number;
      source: string;
      target: string;
    }[] = [];

    // Start with the first node
    visited.add(startNodeId);

    // Add all edges from the start node to the priority queue
    for (const edge of graph.edges) {
      if (
        edge.source === startNodeId ||
        (!isDirected && edge.target === startNodeId)
      ) {
        pq.push({
          edgeId: edge.id,
          weight: edge.weight,
          source: edge.source,
          target: edge.target,
        });
      }
    }

    // Sort the priority queue by weight
    pq.sort((a, b) => a.weight - b.weight);

    while (pq.length > 0 && visited.size < graph.nodes.length) {
      // Get the edge with minimum weight
      const { edgeId, source, target } = pq.shift()!;

      // Determine which node is not visited
      const nextNode = visited.has(source) ? target : source;

      // If the node is already visited, skip
      if (visited.has(nextNode)) continue;

      // Add the edge to the result
      resultEdges.push(edgeId);

      // Mark the node as visited
      visited.add(nextNode);

      // Add all edges from the new node to the priority queue
      for (const edge of graph.edges) {
        if (
          (edge.source === nextNode && !visited.has(edge.target)) ||
          (!isDirected && edge.target === nextNode && !visited.has(edge.source))
        ) {
          pq.push({
            edgeId: edge.id,
            weight: edge.weight,
            source: edge.source,
            target: edge.target,
          });
        }
      }

      // Re-sort the priority queue
      pq.sort((a, b) => a.weight - b.weight);
    }

    return resultEdges;
  };

  // Strongly Connected Components algorithm (Kosaraju's algorithm)
  const findSCC = (graph: Graph): string[] => {
    const visited = new Set<string>();
    const stack: string[] = [];
    const resultNodes: string[] = [];

    // First DFS to fill the stack
    const fillOrder = (nodeId: string) => {
      visited.add(nodeId);

      // Get all adjacent nodes
      const adjacentNodes = graph.edges
        .filter((edge) => edge.source === nodeId)
        .map((edge) => edge.target);

      for (const neighborId of adjacentNodes) {
        if (!visited.has(neighborId)) {
          fillOrder(neighborId);
        }
      }

      stack.push(nodeId);
    };

    // Second DFS to find SCCs
    const dfsUtil = (nodeId: string, component: Set<string>) => {
      visited.add(nodeId);
      component.add(nodeId);

      // Get all adjacent nodes in the transposed graph
      const adjacentNodes = graph.edges
        .filter((edge) => edge.target === nodeId)
        .map((edge) => edge.source);

      for (const neighborId of adjacentNodes) {
        if (!visited.has(neighborId)) {
          dfsUtil(neighborId, component);
        }
      }
    };

    // Fill the stack
    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        fillOrder(node.id);
      }
    }

    // Reset visited set
    visited.clear();

    // Process nodes in order of finishing time
    let componentIndex = 0;
    while (stack.length > 0) {
      const nodeId = stack.pop()!;

      if (!visited.has(nodeId)) {
        const component = new Set<string>();
        dfsUtil(nodeId, component);

        // Add nodes to result with a delay between components
        for (const id of component) {
          resultNodes.push(id);
        }

        componentIndex++;
      }
    }

    return resultNodes;
  };

  // Select a node
  const selectNode = (id: string | null) => {
    setSelectedNode(id);
  };

  const areNodesConnected = (nodeId1: string, nodeId2: string) => {
    return graph.edges.some(
      (edge) =>
        (edge.source === nodeId1 && edge.target === nodeId2) ||
        (!isDirected && edge.source === nodeId2 && edge.target === nodeId1)
    );
  };

  return {
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
    resetVisualization,
  };
}
