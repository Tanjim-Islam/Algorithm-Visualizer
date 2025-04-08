"use client"

import { Slider as SliderPrimitive } from "@/components/ui/slider"

interface CustomSliderProps {
  value: number[]
  min: number
  max: number
  step: number
  onValueChange: (value: number[]) => void
  disabled?: boolean
  className?: string
  thumbClassName?: string
  trackClassName?: string
}

export function CustomSlider({ className, thumbClassName, trackClassName, ...props }: CustomSliderProps) {
  return (
    <SliderPrimitive {...props} className={className}>
      <SliderPrimitive.Track className={`h-2 rounded-full bg-slate-200 dark:bg-slate-700 ${trackClassName}`}>
        <SliderPrimitive.Range className="absolute h-full rounded-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={`block h-5 w-5 rounded-full border-2 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${thumbClassName}`}
      />
    </SliderPrimitive>
  )
}
