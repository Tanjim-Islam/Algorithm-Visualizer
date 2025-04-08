"use client"

import { AlgorithmVisualizer } from "@/components/AlgorithmVisualizer"
import { ThemeProvider } from "@/components/theme-provider"

export default function Page() {
  return (
    <ThemeProvider attribute="class">
      <AlgorithmVisualizer />
    </ThemeProvider>
  )
}
