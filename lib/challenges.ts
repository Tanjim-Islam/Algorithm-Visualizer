export const challenges = [
  {
    name: "Random Array",
    description: "Sort a completely random array",
    generator: (size) => {
      const arr = []
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 100) + 1)
      }
      return arr
    },
  },
  {
    name: "Nearly Sorted",
    description: "Sort an array that's almost in order",
    generator: (size) => {
      const arr = []
      for (let i = 0; i < size; i++) {
        arr.push(i + 1)
      }

      // Swap a few elements to make it nearly sorted
      const swapCount = Math.floor(size * 0.1) // Swap about 10% of elements
      for (let i = 0; i < swapCount; i++) {
        const idx1 = Math.floor(Math.random() * size)
        const idx2 = Math.floor(Math.random() * size)
        const temp = arr[idx1]
        arr[idx1] = arr[idx2]
        arr[idx2] = temp
      }

      return arr
    },
  },
  {
    name: "Reversed",
    description: "Sort an array in reverse order (worst case)",
    generator: (size) => {
      const arr = []
      for (let i = size; i > 0; i--) {
        arr.push(i)
      }
      return arr
    },
  },
  {
    name: "Few Unique",
    description: "Sort an array with only a few unique values",
    generator: (size) => {
      const arr = []
      const uniqueValues = [10, 30, 50, 70, 90]
      for (let i = 0; i < size; i++) {
        arr.push(uniqueValues[Math.floor(Math.random() * uniqueValues.length)])
      }
      return arr
    },
  },
  {
    name: "Mostly Sorted",
    description: "Sort an array where only a few elements are out of place",
    generator: (size) => {
      const arr = []
      for (let i = 0; i < size; i++) {
        arr.push(i + 1)
      }

      // Swap just 3 elements
      for (let i = 0; i < 3; i++) {
        const idx1 = Math.floor(Math.random() * size)
        const idx2 = Math.floor(Math.random() * size)
        const temp = arr[idx1]
        arr[idx1] = arr[idx2]
        arr[idx2] = temp
      }

      return arr
    },
  },
]
