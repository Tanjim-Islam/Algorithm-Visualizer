"use client"

import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { tutorialSteps } from "@/lib/tutorial"

interface TutorialModalProps {
  tutorialStep: number
  setTutorialStep: (step: number) => void
  setShowTutorial: (show: boolean) => void
}

export function TutorialModal({ tutorialStep, setTutorialStep, setShowTutorial }: TutorialModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowTutorial(false)}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-[#1C1C1C] rounded-xl sm:rounded-2xl shadow-2xl max-w-xs sm:max-w-md w-full p-4 sm:p-6 glass-card transition-colors"
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-bold dark:text-[#F5E8D8] text-gray-800 flex items-center gap-2 sm:gap-3 transition-colors">
            <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-[#DAA520]" />
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-[#FF6F61] dark:to-[#DAA520] bg-clip-text text-transparent transition-colors">
              {tutorialSteps[tutorialStep].title}
            </span>
          </h2>
        </div>

        <p className="dark:text-[#F5E8D8] text-gray-700 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base transition-colors">
          {tutorialSteps[tutorialStep].content}
        </p>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
            disabled={tutorialStep === 0}
            className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:border-[#FF6F61] dark:text-[#F5E8D8] border-blue-400 text-blue-500 transition-colors"
          >
            Previous
          </Button>

          {tutorialStep < tutorialSteps.length - 1 ? (
            <Button
              onClick={() => setTutorialStep(tutorialStep + 1)}
              className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:bg-[#FF6F61] dark:hover:bg-[#e05a4d] bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => setShowTutorial(false)}
              className="text-xs sm:text-sm rounded-lg sm:rounded-xl dark:bg-[#FF6F61] dark:hover:bg-[#e05a4d] bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Get Started
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
