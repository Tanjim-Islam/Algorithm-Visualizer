"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface BacktrackingStep {
  description: string;
  state: any;
  nodeId: string;
}

interface RecursionTreeNode {
  id: string;
  name: string;
  children?: RecursionTreeNode[];
  data?: any;
}

export type SudokuDifficulty = "easy" | "medium" | "hard" | "custom";
export type MazeAlgorithm = "random" | "recursive-division" | "prim" | "custom";
export type KnightsTourType = "open" | "closed";
export type VisualizationStyle =
  | "default"
  | "numbers"
  | "arrows"
  | "heatmap"
  | "chess";

// Add new state and functions to manage algorithm-specific steps
export function useBacktracking(soundEnabled: boolean) {
  // Common state
  const [speed, setSpeed] = useState<number>(300);
  const [running, setRunning] = useState<boolean>(false);
  const [steps, setSteps] = useState<BacktrackingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showRecursionTree, setShowRecursionTree] = useState<boolean>(false);
  const [recursionTreeData, setRecursionTreeData] = useState<RecursionTreeNode>(
    {
      id: "root",
      name: "Root",
      children: [],
    }
  );

  // Add a new state to track the active steps for the current algorithm
  const [activeSteps, setActiveSteps] = useState<BacktrackingStep[]>([]);

  // Store algorithm-specific steps
  const [algorithmSteps, setAlgorithmSteps] = useState<
    Record<string, BacktrackingStep[]>
  >({
    nqueens: [],
    sudoku: [],
    maze: [],
    knights: [],
    subset: [],
  });

  // Common settings
  const [findAllSolutions, setFindAllSolutions] = useState<boolean>(false);
  const [visualizationStyle, setVisualizationStyle] =
    useState<VisualizationStyle>("default");

  // N-Queens settings
  const [nQueensSize, setNQueensSize] = useState<number>(4);
  const [nQueensConfig, setNQueensConfig] = useState<{
    startingPosition: [number, number] | null;
  }>({
    startingPosition: null,
  });

  // Sudoku settings
  const [sudokuBoard, setSudokuBoard] = useState<number[][]>([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [sudokuDifficulty, setSudokuDifficulty] =
    useState<SudokuDifficulty>("medium");
  const [sudokuSize, setSudokuSize] = useState<number>(9); // 4x4, 9x9, or 16x16

  // Maze settings
  const [mazeConfig, setMazeConfig] = useState<{
    maze: number[][];
    start: [number, number];
    end: [number, number];
  }>({
    maze: [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    start: [0, 0],
    end: [7, 7],
  });
  const [mazeAlgorithm, setMazeAlgorithm] = useState<MazeAlgorithm>("random");
  const [wallDensity, setWallDensity] = useState<number>(30); // percentage
  const [showVisitedCells, setShowVisitedCells] = useState<boolean>(true);

  // Knight's Tour settings
  const [knightsTourSize, setKnightsTourSize] = useState<number>(5);
  const [knightsTourType, setKnightsTourType] =
    useState<KnightsTourType>("open");

  // Subset Sum settings
  const [subsetSumConfig, setSubsetSumConfig] = useState<{
    numbers: number[];
    target: number;
  }>({
    numbers: [2, 4, 6, 8, 10, 12, 14],
    target: 30,
  });
  const [maxSubsetSize, setMaxSubsetSize] = useState<number | null>(null);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to prepare algorithm steps
  const prepareAlgorithm = useCallback(
    (algorithm: string) => {
      // Stop any running visualization
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);

      // Reset current step index
      setCurrentStepIndex(0);

      // Check if we already have steps for this algorithm
      if (algorithmSteps[algorithm] && algorithmSteps[algorithm].length > 0) {
        // Use existing steps
        setActiveSteps(algorithmSteps[algorithm]);
      } else {
        // Generate new steps for this algorithm
        generateSteps(algorithm);
      }
    },
    [algorithmSteps]
  );

  // Sound effect function
  const playSound = (frequency: number) => {
    if (!soundEnabled) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

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
  };

  // Start visualization
  const startVisualization = (algorithm: string) => {
    if (running) return;

    // Make sure we have steps for the current algorithm
    if (activeSteps.length === 0) {
      prepareAlgorithm(algorithm);
    }

    // If we're at the end, reset to the beginning
    if (currentStepIndex >= activeSteps.length - 1) {
      setCurrentStepIndex(0);
    }

    setRunning(true);

    // Start the animation
    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex >= activeSteps.length - 1) {
          clearInterval(timerRef.current!);
          setRunning(false);
          return prevIndex;
        }

        // Play sound based on the step
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            300 + (prevIndex % 10) * 50,
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

        return prevIndex + 1;
      });
    }, speed);
  };

  // Stop visualization
  const stopVisualization = () => {
    if (!running) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRunning(false);
  };

  // Reset visualization
  const resetVisualization = (algorithm: string) => {
    if (running) {
      stopVisualization();
    }

    setCurrentStepIndex(0);

    // Generate new steps for the algorithm
    generateSteps(algorithm);
  };

  // Generate steps for the selected algorithm
  const generateSteps = (algorithm: string) => {
    let newSteps: BacktrackingStep[] = [];

    switch (algorithm) {
      case "nqueens":
        newSteps = generateNQueensSteps();
        break;
      case "sudoku":
        newSteps = generateSudokuSteps();
        break;
      case "maze":
        newSteps = generateMazeSteps();
        break;
      case "knights":
        newSteps = generateKnightsTourSteps();
        break;
      case "subset":
        newSteps = generateSubsetSumSteps();
        break;
    }

    // Update both the general steps and algorithm-specific steps
    setSteps(newSteps);
    setActiveSteps(newSteps);

    // Store these steps for this algorithm
    setAlgorithmSteps((prev) => ({
      ...prev,
      [algorithm]: newSteps,
    }));
  };

  // N-Queens algorithm - update to return steps instead of setting them directly
  const generateNQueensSteps = () => {
    const newSteps: BacktrackingStep[] = [];
    const treeNodes: RecursionTreeNode = {
      id: "root",
      name: "N-Queens",
      children: [],
    };

    // Initialize board
    const board = Array(nQueensSize)
      .fill(0)
      .map(() => Array(nQueensSize).fill(0));

    // If there's a starting position, place a queen there
    if (nQueensConfig.startingPosition) {
      const [row, col] = nQueensConfig.startingPosition;
      if (row >= 0 && row < nQueensSize && col >= 0 && col < nQueensSize) {
        board[row][col] = 1;
      }
    }

    newSteps.push({
      description: `Starting N-Queens problem with board size ${nQueensSize}x${nQueensSize}`,
      state: {
        board: JSON.parse(JSON.stringify(board)),
        currentRow: null,
        currentCol: null,
      },
      nodeId: "root",
    });

    // Track all solutions if findAllSolutions is true
    const allSolutions: number[][][] = [];

    // Solve N-Queens using backtracking
    const solveNQueens = (
      row: number,
      board: number[][],
      parentNodeId: string
    ) => {
      if (row === nQueensSize) {
        // Found a solution
        const solution = JSON.parse(JSON.stringify(board));
        allSolutions.push(solution);

        newSteps.push({
          description: `Found ${
            findAllSolutions ? `solution #${allSolutions.length}` : "a solution"
          }!`,
          state: {
            board: JSON.parse(JSON.stringify(board)),
            currentRow: null,
            currentCol: null,
          },
          nodeId: parentNodeId,
        });

        // If we're looking for all solutions, return false to continue backtracking
        // Otherwise, return true to stop after the first solution
        return !findAllSolutions;
      }

      // Skip the row with the starting position
      if (
        nQueensConfig.startingPosition &&
        row === nQueensConfig.startingPosition[0] &&
        board[row][nQueensConfig.startingPosition[1]] === 1
      ) {
        return solveNQueens(row + 1, board, parentNodeId);
      }

      const nodeId = uuidv4();
      const nodeName = `Row ${row}`;

      // Add node to tree
      const parentNode = findNodeById(treeNodes, parentNodeId);
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push({
          id: nodeId,
          name: nodeName,
          children: [],
        });
      }

      newSteps.push({
        description: `Trying to place a queen in row ${row}`,
        state: {
          board: JSON.parse(JSON.stringify(board)),
          currentRow: row,
          currentCol: null,
        },
        nodeId,
      });

      for (let col = 0; col < nQueensSize; col++) {
        // Check if it's safe to place a queen
        const isValid = isSafe(row, col, board);

        newSteps.push({
          description: `Checking if we can place a queen at position (${row}, ${col})`,
          state: {
            board: JSON.parse(JSON.stringify(board)),
            currentRow: row,
            currentCol: col,
            isValid,
          },
          nodeId,
        });

        if (isValid) {
          // Place the queen
          board[row][col] = 1;

          newSteps.push({
            description: `Placing a queen at position (${row}, ${col})`,
            state: {
              board: JSON.parse(JSON.stringify(board)),
              currentRow: row,
              currentCol: col,
            },
            nodeId,
          });

          // Recursively place queens in the next row
          if (solveNQueens(row + 1, board, nodeId)) {
            return true;
          }

          // If placing queen doesn't lead to a solution, backtrack
          board[row][col] = 0;

          newSteps.push({
            description: `Backtracking: Removing queen from position (${row}, ${col})`,
            state: {
              board: JSON.parse(JSON.stringify(board)),
              currentRow: row,
              currentCol: col,
            },
            nodeId,
          });
        }
      }

      return false;
    };

    // Helper function to check if a queen can be placed at (row, col)
    const isSafe = (row: number, col: number, board: number[][]) => {
      // Check column
      for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false;
      }

      // Check upper left diagonal
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false;
      }

      // Check upper right diagonal
      for (let i = row, j = col; i >= 0 && j < nQueensSize; i--, j++) {
        if (board[i][j] === 1) return false;
      }

      return true;
    };

    // Find node by ID in the tree
    const findNodeById = (
      node: RecursionTreeNode,
      id: string
    ): RecursionTreeNode | null => {
      if (node.id === id) return node;

      if (node.children) {
        for (const child of node.children) {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }

      return null;
    };

    // Start solving
    solveNQueens(0, board, "root");

    // If we're finding all solutions, add a summary step
    if (findAllSolutions && allSolutions.length > 0) {
      newSteps.push({
        description: `Found ${allSolutions.length} solution${
          allSolutions.length !== 1 ? "s" : ""
        } for the ${nQueensSize}-Queens problem`,
        state: {
          board: allSolutions[allSolutions.length - 1],
          currentRow: null,
          currentCol: null,
        },
        nodeId: "root",
      });
    }

    // Update recursion tree data
    setRecursionTreeData(treeNodes);

    // Return the steps instead of setting them directly
    return newSteps;
  };

  // Sudoku solver algorithm - update to return steps
  const generateSudokuSteps = () => {
    const newSteps: BacktrackingStep[] = [];
    const treeNodes: RecursionTreeNode = {
      id: "root",
      name: "Sudoku",
      children: [],
    };

    // Create a deep copy of the initial board to avoid reference issues
    const board = JSON.parse(
      JSON.stringify(
        sudokuBoard || Array(sudokuSize).fill(Array(sudokuSize).fill(0))
      )
    );

    newSteps.push({
      description: "Starting Sudoku solver",
      state: {
        board: JSON.parse(JSON.stringify(board)),
        currentRow: null,
        currentCol: null,
      },
      nodeId: "root",
    });

    // Solve Sudoku using backtracking
    const solveSudoku = (board: number[][], parentNodeId: string) => {
      // Find an empty cell
      let row = -1;
      let col = -1;
      let isEmpty = false;

      for (let i = 0; i < sudokuSize; i++) {
        for (let j = 0; j < sudokuSize; j++) {
          if (board[i][j] === 0) {
            row = i;
            col = j;
            isEmpty = true;
            break;
          }
        }
        if (isEmpty) break;
      }

      // No empty cell found, puzzle solved
      if (!isEmpty) {
        newSteps.push({
          description: "Sudoku solved successfully!",
          state: {
            board: JSON.parse(JSON.stringify(board)),
            currentRow: null,
            currentCol: null,
          },
          nodeId: parentNodeId,
        });
        return true;
      }

      const nodeId = uuidv4();
      const nodeName = `Cell (${row},${col})`;

      // Add node to tree
      const parentNode = findNodeById(treeNodes, parentNodeId);
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push({
          id: nodeId,
          name: nodeName,
          children: [],
        });
      }

      newSteps.push({
        description: `Trying to fill cell at position (${row}, ${col})`,
        state: {
          board: JSON.parse(JSON.stringify(board)),
          currentRow: row,
          currentCol: col,
        },
        nodeId,
      });

      // Get the box size based on the sudoku size
      const boxSize = Math.sqrt(sudokuSize);

      // Try digits 1 to sudokuSize
      for (let num = 1; num <= sudokuSize; num++) {
        // Check if it's safe to place the number
        const isValid = isSafe(board, row, col, num, boxSize);

        newSteps.push({
          description: `Checking if we can place ${num} at position (${row}, ${col})`,
          state: {
            board: JSON.parse(JSON.stringify(board)),
            currentRow: row,
            currentCol: col,
            currentValue: num,
            isValid,
          },
          nodeId,
        });

        if (isValid) {
          // Place the number
          board[row][col] = num;

          newSteps.push({
            description: `Placing ${num} at position (${row}, ${col})`,
            state: {
              board: JSON.parse(JSON.stringify(board)),
              currentRow: row,
              currentCol: col,
            },
            nodeId,
          });

          // Recursively solve the rest of the puzzle
          if (solveSudoku(board, nodeId)) {
            return true;
          }

          // If placing the number doesn't lead to a solution, backtrack
          board[row][col] = 0;

          newSteps.push({
            description: `Backtracking: Removing ${num} from position (${row}, ${col})`,
            state: {
              board: JSON.parse(JSON.stringify(board)),
              currentRow: row,
              currentCol: col,
            },
            nodeId,
          });
        }
      }

      return false;
    };

    // Helper function to check if a number can be placed at (row, col)
    const isSafe = (
      board: number[][],
      row: number,
      col: number,
      num: number,
      boxSize: number
    ) => {
      // Check row
      for (let j = 0; j < sudokuSize; j++) {
        if (board[row][j] === num) return false;
      }

      // Check column
      for (let i = 0; i < sudokuSize; i++) {
        if (board[i][col] === num) return false;
      }

      // Check box
      const boxRow = Math.floor(row / boxSize) * boxSize;
      const boxCol = Math.floor(col / boxSize) * boxSize;

      for (let i = 0; i < boxSize; i++) {
        for (let j = 0; j < boxSize; j++) {
          if (board[boxRow + i][boxCol + j] === num) return false;
        }
      }

      return true;
    };

    // Find node by ID in the tree
    const findNodeById = (
      node: RecursionTreeNode,
      id: string
    ): RecursionTreeNode | null => {
      if (node.id === id) return node;

      if (node.children) {
        for (const child of node.children) {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }

      return null;
    };

    // Start solving
    solveSudoku(board, "root");

    // Update recursion tree data
    setRecursionTreeData(treeNodes);

    // Return the steps
    return newSteps;
  };

  // Maze solver algorithm
  const generateMazeSteps = () => {
    const newSteps: BacktrackingStep[] = [];
    const treeNodes: RecursionTreeNode = {
      id: "root",
      name: "Maze",
      children: [],
    };

    // Create a copy of the maze
    const maze = JSON.parse(JSON.stringify(mazeConfig.maze));
    const [startRow, startCol] = mazeConfig.start;
    const [endRow, endCol] = mazeConfig.end;

    newSteps.push({
      description: "Starting maze solver",
      state: {
        maze: JSON.parse(JSON.stringify(maze)),
        currentRow: startRow,
        currentCol: startCol,
        path: [[startRow, startCol]],
        visited: [[startRow, startCol]],
      },
      nodeId: "root",
    });

    // Solve maze using backtracking
    const solveMaze = (
      maze: number[][],
      row: number,
      col: number,
      endRow: number,
      endCol: number,
      path: [number, number][],
      visited: [number, number][],
      parentNodeId: string
    ) => {
      // Check if we've reached the end
      if (row === endRow && col === endCol) {
        newSteps.push({
          description: "Found the exit! Maze solved successfully!",
          state: {
            maze: JSON.parse(JSON.stringify(maze)),
            currentRow: row,
            currentCol: col,
            path: [...path],
            visited: [...visited],
          },
          nodeId: parentNodeId,
        });
        return true;
      }

      const nodeId = uuidv4();
      const nodeName = `Cell (${row},${col})`;

      // Add node to tree
      const parentNode = findNodeById(treeNodes, parentNodeId);
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push({
          id: nodeId,
          name: nodeName,
          children: [],
        });
      }

      // Define possible moves (up, right, down, left)
      const moves = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ];
      const moveNames = ["up", "right", "down", "left"];

      // Try each possible move
      for (let i = 0; i < moves.length; i++) {
        const [dr, dc] = moves[i];
        const newRow = row + dr;
        const newCol = col + dc;

        // Check if the move is valid
        if (
          newRow >= 0 &&
          newRow < maze.length &&
          newCol >= 0 &&
          newCol < maze[0].length &&
          maze[newRow][newCol] === 0 &&
          !visited.some(([r, c]) => r === newRow && c === newCol)
        ) {
          newSteps.push({
            description: `Trying to move ${moveNames[i]} from (${row}, ${col}) to (${newRow}, ${newCol})`,
            state: {
              maze: JSON.parse(JSON.stringify(maze)),
              currentRow: newRow,
              currentCol: newCol,
              path: [...path],
              visited: [...visited],
            },
            nodeId,
          });

          // Mark as visited and add to path
          visited.push([newRow, newCol]);
          path.push([newRow, newCol]);

          newSteps.push({
            description: `Moving ${moveNames[i]} to (${newRow}, ${newCol})`,
            state: {
              maze: JSON.parse(JSON.stringify(maze)),
              currentRow: newRow,
              currentCol: newCol,
              path: [...path],
              visited: [...visited],
            },
            nodeId,
          });

          // Recursively solve from the new position
          if (
            solveMaze(
              maze,
              newRow,
              newCol,
              endRow,
              endCol,
              path,
              visited,
              nodeId
            )
          ) {
            return true;
          }

          // If this path doesn't lead to the exit, backtrack
          path.pop();

          newSteps.push({
            description: `Backtracking: Moving back from (${newRow}, ${newCol}) to (${row}, ${col})`,
            state: {
              maze: JSON.parse(JSON.stringify(maze)),
              currentRow: row,
              currentCol: col,
              path: [...path],
              visited: [...visited],
            },
            nodeId,
          });
        }
      }

      return false;
    };

    // Find node by ID in the tree
    const findNodeById = (
      node: RecursionTreeNode,
      id: string
    ): RecursionTreeNode | null => {
      if (node.id === id) return node;

      if (node.children) {
        for (const child of node.children) {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }

      return null;
    };

    // Start solving
    const path: [number, number][] = [[startRow, startCol]];
    const visited: [number, number][] = [[startRow, startCol]];
    solveMaze(maze, startRow, startCol, endRow, endCol, path, visited, "root");

    setSteps(newSteps);
    setRecursionTreeData(treeNodes);

    return newSteps;
  };

  // Knight's Tour algorithm
  const generateKnightsTourSteps = () => {
    const newSteps: BacktrackingStep[] = [];
    const treeNodes: RecursionTreeNode = {
      id: "root",
      name: "Knight's Tour",
      children: [],
    };

    // Initialize board
    const board = Array(knightsTourSize)
      .fill(0)
      .map(() => Array(knightsTourSize).fill(0));

    newSteps.push({
      description: `Starting Knight's Tour problem with board size ${knightsTourSize}x${knightsTourSize}`,
      state: {
        board: JSON.parse(JSON.stringify(board)),
        currentRow: null,
        currentCol: null,
      },
      nodeId: "root",
    });

    // Solve Knight's Tour using backtracking
    const solveKnightsTour = (
      board: number[][],
      row: number,
      col: number,
      moveNum: number,
      parentNodeId: string
    ) => {
      // Mark current position with move number
      board[row][col] = moveNum;

      // If all squares are visited, we've found a solution
      if (moveNum === knightsTourSize * knightsTourSize) {
        // For closed tour, check if the knight can return to the starting position
        if (knightsTourType === "closed") {
          // Check if the last position can reach the starting position
          const canReturnToStart = canKnightMove(row, col, 0, 0);
          if (!canReturnToStart) {
            // If it can't return to start, this is not a valid closed tour
            board[row][col] = 0;
            return false;
          }
        }

        newSteps.push({
          description: `Knight's Tour completed successfully! (${knightsTourType} tour)`,
          state: {
            board: JSON.parse(JSON.stringify(board)),
            currentRow: row,
            currentCol: col,
            moveNumber: moveNum,
          },
          nodeId: parentNodeId,
        });
        return true;
      }

      const nodeId = uuidv4();
      const nodeName = `Move ${moveNum}`;

      // Add node to tree
      const parentNode = findNodeById(treeNodes, parentNodeId);
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push({
          id: nodeId,
          name: nodeName,
          children: [],
        });
      }

      newSteps.push({
        description: `Knight at position (${row}, ${col}), move number ${moveNum}`,
        state: {
          board: JSON.parse(JSON.stringify(board)),
          currentRow: row,
          currentCol: col,
          moveNumber: moveNum,
        },
        nodeId,
      });

      // Define possible knight moves
      const moves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];

      // Try each possible move
      for (let i = 0; i < moves.length; i++) {
        const [dr, dc] = moves[i];
        const newRow = row + dr;
        const newCol = col + dc;

        // Check if the move is valid
        if (
          newRow >= 0 &&
          newRow < knightsTourSize &&
          newCol >= 0 &&
          newCol < knightsTourSize &&
          board[newRow][newCol] === 0
        ) {
          newSteps.push({
            description: `Trying to move knight from (${row}, ${col}) to (${newRow}, ${newCol})`,
            state: {
              board: JSON.parse(JSON.stringify(board)),
              currentRow: newRow,
              currentCol: newCol,
              moveNumber: moveNum + 1,
            },
            nodeId,
          });

          // Recursively solve from the new position
          if (solveKnightsTour(board, newRow, newCol, moveNum + 1, nodeId)) {
            return true;
          }

          // If this move doesn't lead to a solution, backtrack
          board[newRow][newCol] = 0;

          newSteps.push({
            description: `Backtracking: Removing knight from (${newRow}, ${newCol})`,
            state: {
              board: JSON.parse(JSON.stringify(board)),
              currentRow: row,
              currentCol: col,
              moveNumber: moveNum,
            },
            nodeId,
          });
        }
      }

      // If no moves lead to a solution, backtrack
      board[row][col] = 0;
      return false;
    };

    // Helper function to check if a knight can move from (r1, c1) to (r2, c2)
    const canKnightMove = (r1: number, c1: number, r2: number, c2: number) => {
      const dr = Math.abs(r1 - r2);
      const dc = Math.abs(c1 - c2);
      return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
    };

    // Find node by ID in the tree
    const findNodeById = (
      node: RecursionTreeNode,
      id: string
    ): RecursionTreeNode | null => {
      if (node.id === id) return node;

      if (node.children) {
        for (const child of node.children) {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }

      return null;
    };

    // Start solving from position (0, 0)
    solveKnightsTour(board, 0, 0, 1, "root");

    setSteps(newSteps);
    setRecursionTreeData(treeNodes);

    return newSteps;
  };

  // Subset Sum algorithm
  const generateSubsetSumSteps = () => {
    const newSteps: BacktrackingStep[] = [];
    const treeNodes: RecursionTreeNode = {
      id: "root",
      name: "Subset Sum",
      children: [],
    };

    const { numbers, target } = subsetSumConfig;

    newSteps.push({
      description: `Starting Subset Sum problem with target ${target}`,
      state: {
        currentIndex: null,
        currentSum: 0,
        currentSubset: [],
        solutions: [],
      },
      nodeId: "root",
    });

    // Track all solutions
    const allSolutions: number[][] = [];

    // Solve Subset Sum using backtracking
    const solveSubsetSum = (
      index: number,
      currentSum: number,
      currentSubset: number[],
      solutions: number[][],
      parentNodeId: string
    ) => {
      // If current sum equals target, we found a solution
      if (currentSum === target) {
        // Check if the subset size is within the max size constraint
        if (maxSubsetSize === null || currentSubset.length <= maxSubsetSize) {
          solutions.push([...currentSubset]);

          newSteps.push({
            description: `Found a solution! Subset ${currentSubset.join(
              ", "
            )} sums to ${target}`,
            state: {
              currentIndex: index,
              currentSum,
              currentSubset: [...currentSubset],
              solutions: JSON.parse(JSON.stringify(solutions)),
            },
            nodeId: parentNodeId,
          });

          // If we're not finding all solutions, return true to stop
          if (!findAllSolutions) {
            return true;
          }
        }
      }

      // If we've gone through all numbers or sum exceeds target, stop
      if (index >= numbers.length || currentSum > target) {
        return false;
      }

      // If adding the current number would exceed the max subset size, skip it
      if (maxSubsetSize !== null && currentSubset.length >= maxSubsetSize) {
        return false;
      }

      const nodeId = uuidv4();
      const nodeName = `Index ${index}`;

      // Add node to tree
      const parentNode = findNodeById(treeNodes, parentNodeId);
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push({
          id: nodeId,
          name: nodeName,
          children: [],
        });
      }

      newSteps.push({
        description: `Considering number ${numbers[index]} at index ${index}`,
        state: {
          currentIndex: index,
          currentSum,
          currentSubset: [...currentSubset],
          solutions: JSON.parse(JSON.stringify(solutions)),
        },
        nodeId,
      });

      // Include current number
      currentSubset.push(numbers[index]);

      newSteps.push({
        description: `Including number ${numbers[index]}, current sum: ${
          currentSum + numbers[index]
        }`,
        state: {
          currentIndex: index,
          currentSum: currentSum + numbers[index],
          currentSubset: [...currentSubset],
          solutions: JSON.parse(JSON.stringify(solutions)),
        },
        nodeId,
      });

      // Recursively solve with current number included
      if (
        solveSubsetSum(
          index + 1,
          currentSum + numbers[index],
          currentSubset,
          solutions,
          nodeId
        )
      ) {
        return true;
      }

      // Exclude current number (backtrack)
      currentSubset.pop();

      newSteps.push({
        description: `Excluding number ${numbers[index]}, current sum: ${currentSum}`,
        state: {
          currentIndex: index,
          currentSum,
          currentSubset: [...currentSubset],
          solutions: JSON.parse(JSON.stringify(solutions)),
        },
        nodeId,
      });

      // Recursively solve with current number excluded
      return solveSubsetSum(
        index + 1,
        currentSum,
        currentSubset,
        solutions,
        nodeId
      );
    };

    // Find node by ID in the tree
    const findNodeById = (
      node: RecursionTreeNode,
      id: string
    ): RecursionTreeNode | null => {
      if (node.id === id) return node;

      if (node.children) {
        for (const child of node.children) {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }

      return null;
    };

    // Start solving
    const solutions: number[][] = [];
    solveSubsetSum(0, 0, [], solutions, "root");

    // If no solutions were found, add a step indicating that
    if (solutions.length === 0) {
      newSteps.push({
        description: `No solutions found for target sum ${target}`,
        state: {
          currentIndex: numbers.length,
          currentSum: 0,
          currentSubset: [],
          solutions: [],
        },
        nodeId: "root",
      });
    } else if (findAllSolutions && solutions.length > 1) {
      // If we found all solutions, add a summary step
      newSteps.push({
        description: `Found ${solutions.length} solutions for target sum ${target}`,
        state: {
          currentIndex: numbers.length,
          currentSum: 0,
          currentSubset: [],
          solutions: JSON.parse(JSON.stringify(solutions)),
        },
        nodeId: "root",
      });
    }

    setSteps(newSteps);
    setRecursionTreeData(treeNodes);

    return newSteps;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Initialize the first algorithm on mount
  useEffect(() => {
    prepareAlgorithm("nqueens");
  }, []);

  // Add a custom setter for showRecursionTree that resets visualization when enabled
  const toggleRecursionTree = useCallback(
    (show: boolean) => {
      setShowRecursionTree(show);

      // If enabling the tree, reset the visualization for the current algorithm
      if (show) {
        setCurrentStepIndex(0);
        if (running) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setRunning(false);
        }
      }
    },
    [running]
  );

  return {
    speed,
    setSpeed,
    running,
    setRunning,
    steps,
    currentStepIndex,
    startVisualization,
    stopVisualization,
    resetVisualization,
    showRecursionTree,
    setShowRecursionTree: toggleRecursionTree,
    recursionTreeData,
    nQueensSize,
    setNQueensSize,
    sudokuBoard,
    setSudokuBoard,
    mazeConfig,
    setMazeConfig,
    knightsTourSize,
    setKnightsTourSize,
    subsetSumConfig,
    setSubsetSumConfig,
    // Add new exports
    activeSteps,
    setActiveSteps,
    prepareAlgorithm,
    // New settings
    nQueensConfig,
    setNQueensConfig,
    findAllSolutions,
    setFindAllSolutions,
    showHints,
    setShowHints,
    sudokuDifficulty,
    setSudokuDifficulty,
    sudokuSize,
    setSudokuSize,
    mazeAlgorithm,
    setMazeAlgorithm,
    wallDensity,
    setWallDensity,
    showVisitedCells,
    setShowVisitedCells,
    knightsTourType,
    setKnightsTourType,
    visualizationStyle,
    setVisualizationStyle,
    maxSubsetSize,
    setMaxSubsetSize,
  };
}
