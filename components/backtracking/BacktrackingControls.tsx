"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Zap,
  TreesIcon as Tree,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BacktrackingControlsProps {
  speed: number;
  setSpeed: (speed: number) => void;
  running: boolean;
  startVisualization: () => void;
  stopVisualization: () => void;
  resetVisualization: () => void;
  showRecursionTree: boolean;
  setShowRecursionTree: (show: boolean) => void;
  currentStep: string;
  progress: number;
  activeAlgorithm: string;
  nQueensSize: number;
  setNQueensSize: (size: number) => void;
  knightsTourSize: number;
  setKnightsTourSize: (size: number) => void;
}

export function BacktrackingControls({
  speed,
  setSpeed,
  running,
  startVisualization,
  stopVisualization,
  resetVisualization,
  showRecursionTree,
  setShowRecursionTree,
  currentStep,
  progress,
  activeAlgorithm,
  nQueensSize,
  setNQueensSize,
  knightsTourSize,
  setKnightsTourSize,
}: BacktrackingControlsProps) {
  // Add a function to get algorithm-specific title
  const getAlgorithmTitle = () => {
    switch (activeAlgorithm) {
      case "nqueens":
        return "N-Queens Problem";
      case "sudoku":
        return "Sudoku Solver";
      case "maze":
        return "Maze Solver";
      case "knights":
        return "Knight's Tour";
      case "subset":
        return "Subset Sum Problem";
      default:
        return "Backtracking Algorithm";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="speed"
                className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700"
              >
                Animation Speed
              </Label>
              <Badge
                variant="outline"
                className="dark:border-[#FF6F61] dark:text-[#F5E8D8] border-blue-400 text-blue-500 rounded-full px-2 py-0.5 text-xs font-medium transition-colors"
              >
                {speed}ms
              </Badge>
            </div>
            <Zap className="h-4 w-4 dark:text-[#FF6F61] text-blue-500" />
          </div>
          <Slider
            id="speed"
            min={1}
            max={1000}
            step={1}
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            disabled={running}
            className="dark:bg-[#444444] bg-blue-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Lower value = faster animation (1ms = fastest)
          </p>

          {(activeAlgorithm === "nqueens" || activeAlgorithm === "knights") && (
            <div className="flex items-center justify-between mt-4">
              <Label
                htmlFor="boardSize"
                className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700"
              >
                Board Size
              </Label>
              <Input
                id="boardSize"
                type="number"
                min={4}
                max={12}
                value={
                  activeAlgorithm === "nqueens" ? nQueensSize : knightsTourSize
                }
                onChange={(e) => {
                  const size = Number.parseInt(e.target.value);
                  if (size >= 4 && size <= 12) {
                    if (activeAlgorithm === "nqueens") {
                      setNQueensSize(size);
                      // Reset visualization when size changes
                      resetVisualization();
                    } else {
                      setKnightsTourSize(size);
                      // Reset visualization when size changes
                      resetVisualization();
                    }
                  }
                }}
                disabled={running}
                className="w-20 h-8 text-sm"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="recursion-tree"
              checked={showRecursionTree}
              onCheckedChange={(checked) => {
                setShowRecursionTree(checked);
                if (checked) {
                  // Reset visualization when enabling the tree
                  resetVisualization();
                }
              }}
              disabled={running}
            />
            <Label
              htmlFor="recursion-tree"
              className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700 flex items-center gap-2"
            >
              <Tree className="h-4 w-4 dark:text-[#FF6F61] text-blue-500" />
              Show Recursion Tree
            </Label>
          </div>
        </div>
      </Card>

      <Card className="p-4 dark:bg-[#333333]/30 bg-gray-50/50 rounded-lg sm:rounded-xl transition-colors">
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium dark:text-[#F5E8D8] text-gray-700">
                {getAlgorithmTitle()} - Progress
              </h3>
              <Badge
                variant="outline"
                className="dark:border-[#FF6F61] dark:text-[#F5E8D8] border-blue-400 text-blue-500 rounded-full px-2 py-0.5 text-xs font-medium transition-colors"
              >
                {progress}%
              </Badge>
            </div>
            <Progress
              value={progress}
              className="h-2 dark:bg-[#444444] bg-blue-100"
            />
            <p className="text-sm dark:text-[#F5E8D8]/80 text-gray-600 min-h-[40px] mt-1">
              {currentStep}
            </p>
            <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-1">
              If something doesn't work, hit the Reset button!
            </p>
          </div>

          <div className="flex justify-between mt-4 gap-2">
            {running ? (
              <Button
                variant="outline"
                size="sm"
                onClick={stopVisualization}
                className="flex-1 dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={startVisualization}
                className="flex-1 dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={resetVisualization}
              disabled={running}
              className="flex-1 dark:border-[#FF6F61] dark:text-[#FF6F61] dark:hover:bg-[#FF6F61]/10 border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
