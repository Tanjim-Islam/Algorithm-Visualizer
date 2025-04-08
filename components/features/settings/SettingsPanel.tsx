"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AlgorithmRaceSettings } from "@/components/features/race/AlgorithmRaceSettings"

interface SettingsPanelProps {
  visualizationMode: string
  setVisualizationMode: (mode: string) => void
  barStyle: string
  setBarStyle: (style: string) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  raceMode: boolean
  setRaceMode: (enabled: boolean) => void
  raceAlgorithms: string[]
  setRaceAlgorithms: (algorithms: string[]) => void
}

export function SettingsPanel({
  visualizationMode,
  setVisualizationMode,
  barStyle,
  setBarStyle,
  soundEnabled,
  setSoundEnabled,
  raceMode,
  setRaceMode,
  raceAlgorithms,
  setRaceAlgorithms,
}: SettingsPanelProps) {
  const handleRaceModeToggle = (checked: boolean) => {
    if (checked) {
      // Ensure at least 2 algorithms are selected when enabling race mode
      if (raceAlgorithms.length < 2) {
        setRaceAlgorithms(["bubbleSort", "quickSort"])
      }
      setRaceMode(true)
    } else {
      setRaceMode(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden mb-4 sm:mb-6"
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 dark:bg-[#1C1C1C]/90 bg-white/90 border-0 shadow-lg rounded-xl sm:rounded-2xl backdrop-blur-sm transition-colors">
        <CardHeader className="dark:border-b dark:border-[#444444] border-b border-blue-200 transition-colors p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2 dark:text-[#FF6F61] text-blue-600 transition-colors">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            Visualization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="visualizationMode" className="text-xs sm:text-sm font-medium">
                Visualization Mode
              </Label>
              <Select value={visualizationMode} onValueChange={setVisualizationMode}>
                <SelectTrigger className="dark:bg-[#333333] dark:border-[#444444] dark:text-[#F5E8D8] bg-gray-50 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#333333] dark:border-[#444444] dark:text-[#F5E8D8] bg-gray-50 border-gray-200 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm">
                  <SelectItem value="bars">Bars</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="numbers">Numbers</SelectItem>
                  <SelectItem value="3d">3D Visualization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="barStyle" className="text-xs sm:text-sm font-medium">
                Bar Style
              </Label>
              <Select value={barStyle} onValueChange={setBarStyle}>
                <SelectTrigger className="dark:bg-[#333333] dark:border-[#444444] dark:text-[#F5E8D8] bg-gray-50 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#333333] dark:border-[#444444] dark:text-[#F5E8D8] bg-gray-50 border-gray-200 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm">
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="rainbow">Rainbow</SelectItem>
                  <SelectItem value="value">Value-based</SelectItem>
                  <SelectItem value="access">Access Frequency</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:space-y-4 flex flex-col justify-center">
              <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#333333]/50 bg-gray-100/80 transition-colors">
                <Switch id="sound-mode" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                <Label htmlFor="sound-mode" className="text-xs sm:text-sm font-medium">
                  Sound Effects
                </Label>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#333333]/50 bg-gray-100/80 transition-colors">
                <Switch id="race-mode" checked={raceMode} onCheckedChange={handleRaceModeToggle} />
                <Label htmlFor="race-mode" className="text-xs sm:text-sm font-medium">
                  Algorithm Race Mode
                </Label>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {raceMode && (
              <AlgorithmRaceSettings raceAlgorithms={raceAlgorithms} setRaceAlgorithms={setRaceAlgorithms} />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
