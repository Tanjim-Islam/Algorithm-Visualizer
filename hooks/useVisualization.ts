"use client";

import { useTheme } from "next-themes";

export function useVisualization() {
  const { theme } = useTheme();

  // Get bar color based on index and value
  const getBarColor = (
    index: number,
    value: number,
    isActive: boolean,
    barStyle: string,
    accessPattern: number[]
  ) => {
    // Return actual CSS color values instead of Tailwind classes
    if (isActive) {
      return theme === "dark" ? "#DAA520" : "#FACC15"; // Gold for dark, yellow for light
    }

    if (barStyle === "gradient") {
      // Return an object with gradient properties instead of a class
      return theme === "dark"
        ? { background: "linear-gradient(to top, #FF6F61, #DAA520)" }
        : { background: "linear-gradient(to top, #3B82F6, #93C5FD)" };
    } else if (barStyle === "rainbow") {
      // Create rainbow effect based on value
      const hue = (value * 3.6) % 360; // Map 0-100 to 0-360 degrees
      return `hsl(${hue}, 70%, 60%)`;
    } else if (barStyle === "value") {
      // Color based on value (red for low, green for high)
      const hue = (value * 1.2) % 120; // Map 0-100 to 0-120 degrees (red to green)
      return `hsl(${hue}, 70%, 50%)`;
    } else if (barStyle === "access") {
      // Color based on access frequency
      const maxAccess = Math.max(...accessPattern, 1);
      const intensity = accessPattern[index] / maxAccess;
      return theme === "dark"
        ? `rgba(255, 111, 97, ${0.3 + intensity * 0.7})`
        : `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
    }

    // Default colors
    return theme === "dark" ? "#FF6F61" : "#3B82F6"; // Coral for dark, blue for light
  };

  return {
    getBarColor,
  };
}
