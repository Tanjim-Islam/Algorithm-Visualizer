"use client"

import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { achievementsList } from "@/lib/achievements"
import { useAchievements } from "@/hooks/useAchievements"

export function AchievementDrawer() {
  const { achievements, stats } = useAchievements()

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle className="text-center text-2xl">Your Achievements</DrawerTitle>
        <DrawerDescription className="text-center">
          Complete different tasks to unlock all achievements
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievementsList.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                achievements.includes(achievement.id)
                  ? "dark:bg-red-900/20 bg-blue-100"
                  : "dark:bg-gray-800/50 bg-gray-200/50 opacity-70"
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  achievements.includes(achievement.id)
                    ? "dark:bg-red-500/20 bg-blue-200"
                    : "dark:bg-gray-700 bg-gray-300"
                }`}
              >
                {achievement.icon}
              </div>
              <div>
                <h3 className="font-medium dark:text-white text-gray-800">{achievement.name}</h3>
                <p className="text-sm dark:text-gray-400 text-gray-600">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg dark:bg-gray-800/50 bg-gray-200/50">
          <h3 className="font-medium dark:text-white text-gray-800 mb-2">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm dark:text-gray-400 text-gray-600">Total Sorts</p>
              <p className="text-lg font-medium dark:text-red-300 text-blue-600">{stats.totalSorts}</p>
            </div>
            <div>
              <p className="text-sm dark:text-gray-400 text-gray-600">Fastest Sort</p>
              <p className="text-lg font-medium dark:text-red-300 text-blue-600">
                {stats.fastestSort === Number.POSITIVE_INFINITY ? "-" : `${(stats.fastestSort / 1000).toFixed(2)}s`}
              </p>
            </div>
            <div>
              <p className="text-sm dark:text-gray-400 text-gray-600">Algorithms Used</p>
              <p className="text-lg font-medium dark:text-red-300 text-blue-600">
                {Object.keys(stats.algorithmsUsed).length} / {achievementsList.length}
              </p>
            </div>
            <div>
              <p className="text-sm dark:text-gray-400 text-gray-600">Challenges Completed</p>
              <p className="text-lg font-medium dark:text-red-300 text-blue-600">
                {stats.challengesCompleted} / {achievementsList.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DrawerContent>
  )
}
