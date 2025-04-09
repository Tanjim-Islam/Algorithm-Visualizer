"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shuffle, ArrowDownUp, Braces, Dices } from "lucide-react";
import { CustomSlider } from "@/components/ui/custom-slider";

interface ArrayControlsProps {
  arraySize: number;
  setArraySize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  running: boolean;
  generateArray: () => void;
  generateNearlySortedArray: () => void;
  generateReversedArray: () => void;
  generateFewUniqueArray: () => void;
}

export function ArrayControls({
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  running,
  generateArray,
  generateNearlySortedArray,
  generateReversedArray,
  generateFewUniqueArray,
}: ArrayControlsProps) {
  // Format speed display
  const formatSpeed = (value: number) => {
    if (value < 1) {
      return `${value.toFixed(1)}ms`;
    }
    return `${value}ms`;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <Label className="text-xs sm:text-sm font-medium mb-1 block dark:text-[#F5E8D8] text-gray-700 transition-colors">
          Array Size: {arraySize}
        </Label>
        <CustomSlider
          value={[arraySize]}
          min={10}
          max={100}
          step={1}
          onValueChange={(value) => setArraySize(value[0])}
          disabled={running}
          className="py-3 sm:py-4 relative"
          thumbClassName="dark:bg-[#FF6F61] bg-blue-500 dark:border-[#d35f5f] border-blue-300 dark:shadow-[0_0_10px_rgba(255,111,97,0.5)] shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-colors"
          trackClassName="dark:bg-[#FF6F61]/50 bg-blue-500/50 dark:shadow-[0_0_8px_rgba(255,111,97,0.3)] shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-colors"
        />
      </div>

      <div>
        <Label className="text-xs sm:text-sm font-medium mb-1 block dark:text-[#F5E8D8] text-gray-700 transition-colors">
          Speed: {formatSpeed(speed)}
        </Label>
        <CustomSlider
          value={[speed]}
          min={0.1}
          max={100}
          step={0.1}
          onValueChange={(value) => setSpeed(value[0])}
          disabled={running}
          className="py-3 sm:py-4 relative"
          thumbClassName="dark:bg-[#FF6F61] bg-blue-500 dark:border-[#d35f5f] border-blue-300 dark:shadow-[0_0_10px_rgba(255,111,97,0.5)] shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-colors"
          trackClassName="dark:bg-[#FF6F61]/50 bg-blue-500/50 dark:shadow-[0_0_8px_rgba(255,111,97,0.3)] shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-colors"
        />
        <p className="text-xs sm:text-sm dark:text-[#F5E8D8]/70 text-gray-500 mt-1 transition-colors">
          Lower value = faster animation (0.1ms = fastest)
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={generateArray}
          disabled={running}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
        >
          <Shuffle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Random
        </Button>
        <Button
          onClick={generateNearlySortedArray}
          disabled={running}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
        >
          <ArrowDownUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Nearly Sorted
        </Button>
        <Button
          onClick={generateReversedArray}
          disabled={running}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
        >
          <Braces className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Reversed
        </Button>
        <Button
          onClick={generateFewUniqueArray}
          disabled={running}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] dark:hover:bg-[#FF6F61]/20 border-blue-400 text-blue-500 hover:bg-blue-100 transition-colors"
        >
          <Dices className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Few Unique
        </Button>
      </div>
    </div>
  );
}
