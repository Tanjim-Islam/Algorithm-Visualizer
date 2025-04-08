"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart3, Lightbulb, Volume2, VolumeX, Settings, Sun, Moon, Menu } from "lucide-react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface HeaderProps {
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  setShowTutorial: (show: boolean) => void
}

export function Header({ showSettings, setShowSettings, soundEnabled, setSoundEnabled, setShowTutorial }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const HeaderControls = () => (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowTutorial(true)}
        className="rounded-xl dark:border-[#FF6F61] dark:text-[#FF6F61] border-blue-400 text-blue-500 transition-colors"
      >
        <Lightbulb className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="rounded-xl dark:border-[#FF6F61] dark:text-[#FF6F61] border-blue-400 text-blue-500 transition-colors"
      >
        {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowSettings(!showSettings)}
        className="rounded-xl dark:border-[#FF6F61] dark:text-[#FF6F61] border-blue-400 text-blue-500 transition-colors"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="rounded-xl dark:border-[#FF6F61] dark:text-[#FF6F61] border-blue-400 text-blue-500 transition-colors"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </>
  )

  return (
    <div className="flex justify-between items-center mb-4 sm:mb-8 bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-sm p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-colors">
      <motion.h1
        className="text-xl sm:text-3xl font-bold dark:text-[#F5E8D8] text-gray-800 flex items-center gap-2 sm:gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 dark:text-[#FF6F61] text-blue-500 transition-colors" />
        <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent transition-colors">
          Algorithm Visualizer
        </span>
        <motion.span
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
          className="animate-float hidden sm:inline-block"
        >
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 dark:text-[#DAA520] text-yellow-500 transition-colors" />
        </motion.span>
      </motion.h1>

      {/* Desktop controls */}
      <div className="hidden sm:flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HeaderControls />
            </TooltipTrigger>
            <TooltipContent className="rounded-xl">
              <p>Controls</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[385px] dark:bg-[#1C1C1C] bg-white">
            <div className="py-6">
              <h2 className="text-lg font-semibold mb-6 dark:text-[#F5E8D8] text-gray-800">Controls</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 dark:text-[#FF6F61] text-blue-500" />
                  <Button
                    variant="link"
                    onClick={() => setShowTutorial(true)}
                    className="p-0 h-auto dark:text-[#F5E8D8] text-gray-800"
                  >
                    Show Tutorial
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {soundEnabled ? (
                    <Volume2 className="h-5 w-5 dark:text-[#FF6F61] text-blue-500" />
                  ) : (
                    <VolumeX className="h-5 w-5 dark:text-[#FF6F61] text-blue-500" />
                  )}
                  <Button
                    variant="link"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-0 h-auto dark:text-[#F5E8D8] text-gray-800"
                  >
                    {soundEnabled ? "Disable Sound" : "Enable Sound"}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 dark:text-[#FF6F61] text-blue-500" />
                  <Button
                    variant="link"
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-0 h-auto dark:text-[#F5E8D8] text-gray-800"
                  >
                    {showSettings ? "Hide Settings" : "Show Settings"}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 dark:text-[#FF6F61] text-blue-500" />
                  ) : (
                    <Moon className="h-5 w-5 dark:text-[#FF6F61] text-blue-500" />
                  )}
                  <Button variant="link" onClick={toggleTheme} className="p-0 h-auto dark:text-[#F5E8D8] text-gray-800">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
