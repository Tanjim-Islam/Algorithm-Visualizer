"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { algorithms } from "@/lib/algorithms"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface AlgorithmRaceSettingsProps {
  raceAlgorithms: string[]
  setRaceAlgorithms: (algorithms: string[]) => void
}

export function AlgorithmRaceSettings({ raceAlgorithms, setRaceAlgorithms }: AlgorithmRaceSettingsProps) {
  const [showWarning, setShowWarning] = useState(false)

  const handleAlgorithmToggle = (alg: string, checked: boolean) => {
    if (checked) {
      // Adding an algorithm is always allowed
      setRaceAlgorithms([...raceAlgorithms, alg])
      setShowWarning(false)
    } else {
      // Only allow removing if we'll still have at least 2 algorithms
      if (raceAlgorithms.length > 2) {
        setRaceAlgorithms(raceAlgorithms.filter((a) => a !== alg))
        setShowWarning(false)
      } else {
        // Show warning and don't remove the algorithm
        setShowWarning(true)
        // Optional: Show a toast notification
        toast({
          title: "Cannot remove algorithm",
          description: "At least 2 algorithms must be selected for the race",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 overflow-hidden"
      transition={{ duration: 0.3 }}
    >
      <div className="p-3 sm:p-4 rounded-lg dark:bg-[#333333] bg-[#f0f0e8] transition-colors">
        <h3 className="text-base sm:text-lg font-medium mb-2 dark:text-[#FF6F61] text-blue-600 transition-colors">
          Algorithm Race Settings
        </h3>
        <p className="text-xs sm:text-sm dark:text-[#F5E8D8] text-gray-700 mb-3 transition-colors">
          Select algorithms to compare in a head-to-head race
        </p>

        {showWarning && (
          <p className="text-xs sm:text-sm dark:text-[#FF6F61] text-red-500 mb-3 transition-colors font-medium">
            At least 2 algorithms must be selected for the race
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.keys(algorithms).map((alg) => (
            <div key={alg} className="flex items-center space-x-2">
              <Switch
                id={`race-${alg}`}
                checked={raceAlgorithms.includes(alg)}
                onCheckedChange={(checked) => handleAlgorithmToggle(alg, checked)}
              />
              <Label htmlFor={`race-${alg}`} className="flex items-center gap-1 text-xs sm:text-sm transition-colors">
                {algorithms[alg].icon}
                {algorithms[alg].name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
