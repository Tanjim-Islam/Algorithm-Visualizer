import {
  BarChart2,
  BarChart4,
  Layers,
  Zap,
  Cpu,
  Hash,
  ListFilter,
  Database,
  ArrowUpDown,
} from "lucide-react";

export const algorithms = {
  bubbleSort: {
    name: "Bubble Sort",
    complexity: "O(n²)",
    icon: <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />,
    description:
      "Simple comparison-based algorithm that repeatedly steps through the list.",
    details:
      "Bubble Sort compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm gets its name because smaller elements 'bubble' to the top of the list.",
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const n = array.length;
      const newArray = [...array];
      let comparisons = 0;
      let swaps = 0;
      const accessPattern = Array(n).fill(0);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      for (let i = 0; i < n - 1; i++) {
        if (cancelRef.current) {
          setRunning(false);
          return;
        }

        let swapped = false;
        setCurrentStep(
          `Pass ${i + 1}: Comparing adjacent elements and swapping if needed`
        );
        setProgress(Math.floor((i / (n - 1)) * 100));

        for (let j = 0; j < n - i - 1; j++) {
          if (cancelRef.current) {
            setRunning(false);
            return;
          }

          // Update active indices
          setActiveIndices([j, j + 1]);

          // Update access pattern
          accessPattern[j]++;
          accessPattern[j + 1]++;
          setAccessPattern([...accessPattern]);

          // Play sound for current comparison
          playSound(newArray[j]);

          // Increment comparisons
          comparisons++;
          setComparisons(comparisons);

          // Delay for visualization
          await new Promise((resolve) => setTimeout(resolve, speed));

          if (newArray[j] > newArray[j + 1]) {
            // Swap elements
            const temp = newArray[j];
            newArray[j] = newArray[j + 1];
            newArray[j + 1] = temp;

            // Play sound for swap
            playSound(newArray[j + 1]);

            // Update array
            setArray([...newArray]);

            // Increment swaps
            swaps++;
            setSwaps(swaps);

            swapped = true;

            // Delay for visualization
            await new Promise((resolve) => setTimeout(resolve, speed));
          }
        }

        // If no swaps were made in this pass, the array is sorted
        if (!swapped) {
          break;
        }
      }

      // Clear active indices
      setActiveIndices([]);
      setCurrentStep("Bubble Sort completed!");
      setProgress(100);
      setRunning(false);
    },
  },
  selectionSort: {
    name: "Selection Sort",
    complexity: "O(n²)",
    description:
      "Simple in-place comparison sort that divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region.",
    details:
      "Selection sort works by dividing the input list into two parts: a sorted sublist of items which is built up from left to right, and a sublist of the remaining unsorted items. The algorithm repeatedly finds the minimum element from the unsorted sublist and swaps it with the leftmost unsorted element, moving the sublist boundaries one element to the right.",
    icon: <BarChart2 className="h-5 w-5" />,
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const arr = [...array];
      let swaps = 0;
      let comparisons = 0;
      const totalSteps = arr.length * arr.length;
      let currentStep = 0;

      // Initialize access pattern
      const accessPatternMap = Array(arr.length).fill(0);
      setAccessPattern([...accessPatternMap]);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      for (let i = 0; i < arr.length; i++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }
        let minIndex = i;
        setCurrentStep(`Finding minimum element starting from position ${i}`);
        setActiveIndices([i]);

        // Update access pattern
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        for (let j = i + 1; j < arr.length; j++) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          comparisons++;
          setComparisons(comparisons);

          // Update access pattern
          accessPatternMap[j]++;
          accessPatternMap[minIndex]++;
          setAccessPattern([...accessPatternMap]);

          setActiveIndices([minIndex, j]);
          setCurrentStep(
            `Comparing elements at positions ${minIndex} and ${j}`
          );

          currentStep++;
          setProgress(Math.floor((currentStep / totalSteps) * 100));

          playSound(arr[j]);

          await new Promise((resolve) => setTimeout(resolve, speed / 2));

          if (arr[j] < arr[minIndex]) {
            minIndex = j;
            setActiveIndices([minIndex]);
            setCurrentStep(`Found new minimum at position ${minIndex}`);
          }

          await new Promise((resolve) => setTimeout(resolve, speed / 2));
        }

        if (minIndex !== i) {
          // Swap
          setActiveIndices([i, minIndex]);
          setCurrentStep(`Swapping elements at positions ${i} and ${minIndex}`);

          // Update access pattern
          accessPatternMap[i]++;
          accessPatternMap[minIndex]++;
          setAccessPattern([...accessPatternMap]);

          const temp = arr[i];
          arr[i] = arr[minIndex];
          arr[minIndex] = temp;
          swaps++;
          setSwaps(swaps);
          setArray([...arr]);

          playSound(arr[i]);

          await new Promise((resolve) => setTimeout(resolve, speed));
        }

        // Mark the element as sorted
        setActiveIndices([i]);
        setCurrentStep(
          `Element at position ${i} is now in its correct position`
        );
        await new Promise((resolve) => setTimeout(resolve, speed / 2));
      }

      setActiveIndices([]);
      setCurrentStep("Sorting complete!");
      setProgress(100);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);
    },
  },
  insertionSort: {
    name: "Insertion Sort",
    complexity: "O(n²)",
    description:
      "Simple sorting algorithm that builds the final sorted array one item at a time, efficient for small data sets or nearly sorted data.",
    details:
      "Insertion sort iterates through an array and consumes one input element at each repetition, growing a sorted output list. At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there. It repeats until no input elements remain.",
    icon: <BarChart4 className="h-5 w-5" />,
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const arr = [...array];
      let swaps = 0;
      let comparisons = 0;
      const totalSteps = arr.length * arr.length;
      let currentStep = 0;

      // Initialize access pattern
      const accessPatternMap = Array(arr.length).fill(0);
      setAccessPattern([...accessPatternMap]);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      for (let i = 1; i < arr.length; i++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }
        const current = arr[i];
        let j = i - 1;

        // Update access pattern
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        setActiveIndices([i]);
        setCurrentStep(
          `Inserting element at position ${i} into the sorted portion`
        );

        while (j >= 0 && arr[j] > current) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          comparisons++;
          setComparisons(comparisons);

          // Update access pattern
          accessPatternMap[j]++;
          accessPatternMap[j + 1]++;
          setAccessPattern([...accessPatternMap]);

          setActiveIndices([j, j + 1]);
          setCurrentStep(
            `Moving element at position ${j} to position ${j + 1}`
          );

          currentStep++;
          setProgress(Math.floor((currentStep / totalSteps) * 100));

          playSound(arr[j]);

          arr[j + 1] = arr[j];
          j--;
          swaps++;
          setSwaps(swaps);
          setArray([...arr]);

          await new Promise((resolve) => setTimeout(resolve, speed));
        }

        arr[j + 1] = current;
        setArray([...arr]);
        setActiveIndices([j + 1]);
        setCurrentStep(`Placed element ${current} at position ${j + 1}`);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      setActiveIndices([]);
      setCurrentStep("Sorting complete!");
      setProgress(100);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);
    },
  },
  quickSort: {
    name: "Quick Sort",
    complexity: "O(n log n)",
    description:
      "Efficient divide-and-conquer sorting algorithm that works by selecting a 'pivot' element and partitioning the array around the pivot.",
    details:
      "Quick sort picks an element as a pivot and partitions the array around the pivot. There are different versions of quickSort that pick pivot in different ways: first element, last element, median, or random. After the array is partitioned, the algorithm recursively sorts the subarrays.",
    icon: <Zap className="h-5 w-5" />,
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const arr = [...array];
      let swaps = 0;
      let comparisons = 0;
      const totalSteps = arr.length * Math.log2(arr.length) * 2;
      let currentStep = 0;

      // Initialize access pattern
      const accessPatternMap = Array(arr.length).fill(0);
      setAccessPattern([...accessPatternMap]);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      const partition = async (arr, low, high) => {
        const pivot = arr[high];

        // Update access pattern
        accessPatternMap[high]++;
        setAccessPattern([...accessPatternMap]);

        setCurrentStep(
          `Partitioning array from index ${low} to ${high} with pivot ${pivot}`
        );
        setActiveIndices([high]);
        await new Promise((resolve) => setTimeout(resolve, speed));

        let i = low - 1;

        for (let j = low; j < high; j++) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          comparisons++;
          setComparisons(comparisons);

          // Update access pattern
          accessPatternMap[j]++;
          accessPatternMap[high]++;
          setAccessPattern([...accessPatternMap]);

          setActiveIndices([j, high]);
          setCurrentStep(
            `Comparing element at position ${j} with pivot ${pivot}`
          );

          currentStep++;
          setProgress(Math.floor((currentStep / totalSteps) * 100));

          playSound(arr[j]);

          await new Promise((resolve) => setTimeout(resolve, speed / 2));

          if (arr[j] <= pivot) {
            i++;
            // Swap
            setActiveIndices([i, j]);
            setCurrentStep(`Swapping elements at positions ${i} and ${j}`);

            // Update access pattern
            accessPatternMap[i]++;
            accessPatternMap[j]++;
            setAccessPattern([...accessPatternMap]);

            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            swaps++;
            setSwaps(swaps);
            setArray([...arr]);

            playSound(arr[i]);

            await new Promise((resolve) => setTimeout(resolve, speed));
          }
        }

        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        // Swap
        setActiveIndices([i + 1, high]);
        setCurrentStep(`Placing pivot at its correct position ${i + 1}`);

        // Update access pattern
        accessPatternMap[i + 1]++;
        accessPatternMap[high]++;
        setAccessPattern([...accessPatternMap]);

        const temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        swaps++;
        setSwaps(swaps);
        setArray([...arr]);

        playSound(arr[i + 1]);

        await new Promise((resolve) => setTimeout(resolve, speed));

        return i + 1;
      };

      const quickSort = async (arr, low, high) => {
        if (low < high) {
          setCurrentStep(`Sorting subarray from index ${low} to ${high}`);
          const pivotIndex = await partition(arr, low, high);

          setCurrentStep(
            `Recursively sorting left subarray from index ${low} to ${
              pivotIndex - 1
            }`
          );
          await quickSort(arr, low, pivotIndex - 1);

          setCurrentStep(
            `Recursively sorting right subarray from index ${
              pivotIndex + 1
            } to ${high}`
          );
          await quickSort(arr, pivotIndex + 1, high);
        }
      };

      await quickSort(arr, 0, arr.length - 1);

      setActiveIndices([]);
      setCurrentStep("Sorting complete!");
      setProgress(100);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);
    },
  },
  mergeSort: {
    name: "Merge Sort",
    complexity: "O(n log n)",
    description:
      "Efficient, stable, divide-and-conquer sorting algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    details:
      "Merge sort is a divide and conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. The merge step is the key operation, where elements from two sorted subarrays are combined to form a single sorted array.",
    icon: <Layers className="h-5 w-5" />,
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const arr = [...array];
      let comparisons = 0;
      let swaps = 0;
      const totalSteps = arr.length * Math.log2(arr.length) * 2;
      let currentStep = 0;

      // Initialize access pattern
      const accessPatternMap = Array(arr.length).fill(0);
      setAccessPattern([...accessPatternMap]);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      const merge = async (arr, left, mid, right) => {
        setCurrentStep(
          `Merging subarrays from index ${left} to ${mid} and ${
            mid + 1
          } to ${right}`
        );

        const n1 = mid - left + 1;
        const n2 = right - mid;

        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) {
          L[i] = arr[left + i];
          // Update access pattern
          accessPatternMap[left + i]++;
          setAccessPattern([...accessPatternMap]);
        }

        for (let j = 0; j < n2; j++) {
          R[j] = arr[mid + 1 + j];
          // Update access pattern
          accessPatternMap[mid + 1 + j]++;
          setAccessPattern([...accessPatternMap]);
        }

        let i = 0;
        let j = 0;
        let k = left;

        while (i < n1 && j < n2) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          comparisons++;
          setComparisons(comparisons);

          setCurrentStep(`Comparing elements ${L[i]} and ${R[j]}`);
          setActiveIndices([left + i, mid + 1 + j]);

          currentStep++;
          setProgress(Math.floor((currentStep / totalSteps) * 100));

          playSound(L[i]);

          await new Promise((resolve) => setTimeout(resolve, speed / 2));

          if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
          } else {
            arr[k] = R[j];
            j++;
          }

          // Update access pattern
          accessPatternMap[k]++;
          setAccessPattern([...accessPatternMap]);

          swaps++;
          setSwaps(swaps);
          k++;
          setArray([...arr]);

          await new Promise((resolve) => setTimeout(resolve, speed));
        }

        while (i < n1) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          setCurrentStep(`Copying remaining elements from left subarray`);
          setActiveIndices([left + i]);

          arr[k] = L[i];

          // Update access pattern
          accessPatternMap[k]++;
          setAccessPattern([...accessPatternMap]);

          i++;
          k++;
          swaps++;
          setSwaps(swaps);
          setArray([...arr]);

          playSound(arr[k - 1]);

          await new Promise((resolve) => setTimeout(resolve, speed));
        }

        while (j < n2) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          setCurrentStep(`Copying remaining elements from right subarray`);
          setActiveIndices([mid + 1 + j]);

          arr[k] = R[j];

          // Update access pattern
          accessPatternMap[k]++;
          setAccessPattern([...accessPatternMap]);

          j++;
          k++;
          swaps++;
          setSwaps(swaps);
          setArray([...arr]);

          playSound(arr[k - 1]);

          await new Promise((resolve) => setTimeout(resolve, speed));
        }
      };

      const mergeSort = async (arr, left, right) => {
        if (left < right) {
          const mid = Math.floor((left + right) / 2);

          setCurrentStep(`Dividing array at index ${mid}`);
          setActiveIndices([mid]);
          await new Promise((resolve) => setTimeout(resolve, speed / 2));

          await mergeSort(arr, left, mid);
          await mergeSort(arr, mid + 1, right);

          await merge(arr, left, mid, right);
        }
      };

      await mergeSort(arr, 0, arr.length - 1);

      setActiveIndices([]);
      setCurrentStep("Sorting complete!");
      setProgress(100);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);
    },
  },
  heapSort: {
    name: "Heap Sort",
    complexity: "O(n log n)",
    description:
      "Comparison-based sorting algorithm that uses a binary heap data structure to build a max-heap and then repeatedly extracts the maximum element.",
    details:
      "Heap sort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region.",
    icon: <Cpu className="h-5 w-5" />,
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const arr = [...array];
      let comparisons = 0;
      let swaps = 0;
      const totalSteps = arr.length * Math.log2(arr.length) * 2;
      let currentStep = 0;

      // Initialize access pattern
      const accessPatternMap = Array(arr.length).fill(0);
      setAccessPattern([...accessPatternMap]);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      const heapify = async (arr, n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        setCurrentStep(`Heapifying at index ${i}`);
        setActiveIndices([i]);

        // Update access pattern
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        await new Promise((resolve) => setTimeout(resolve, speed / 2));

        if (left < n) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          comparisons++;
          setComparisons(comparisons);

          // Update access pattern
          accessPatternMap[largest]++;
          accessPatternMap[left]++;
          setAccessPattern([...accessPatternMap]);

          setCurrentStep(
            `Comparing elements at positions ${largest} and ${left}`
          );
          setActiveIndices([largest, left]);

          currentStep++;
          setProgress(Math.floor((currentStep / totalSteps) * 100));

          playSound(arr[left]);

          await new Promise((resolve) => setTimeout(resolve, speed / 2));

          if (arr[left] > arr[largest]) {
            largest = left;
            setCurrentStep(`New largest element at position ${largest}`);
            setActiveIndices([largest]);
            await new Promise((resolve) => setTimeout(resolve, speed / 2));
          }
        }

        if (right < n) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          comparisons++;
          setComparisons(comparisons);

          // Update access pattern
          accessPatternMap[largest]++;
          accessPatternMap[right]++;
          setAccessPattern([...accessPatternMap]);

          setCurrentStep(
            `Comparing elements at positions ${largest} and ${right}`
          );
          setActiveIndices([largest, right]);
          await new Promise((resolve) => setTimeout(resolve, speed / 2));

          playSound(arr[right]);

          if (arr[right] > arr[largest]) {
            largest = right;
            setCurrentStep(`New largest element at position ${largest}`);
            setActiveIndices([largest]);
            await new Promise((resolve) => setTimeout(resolve, speed / 2));
          }
        }

        if (largest !== i) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }
          // Swap
          setCurrentStep(`Swapping elements at positions ${i} and ${largest}`);
          setActiveIndices([i, largest]);

          // Update access pattern
          accessPatternMap[i]++;
          accessPatternMap[largest]++;
          setAccessPattern([...accessPatternMap]);

          const temp = arr[i];
          arr[i] = arr[largest];
          arr[largest] = temp;
          swaps++;
          setSwaps(swaps);
          setArray([...arr]);

          playSound(arr[i]);

          await new Promise((resolve) => setTimeout(resolve, speed));

          await heapify(arr, n, largest);
        }
      };

      // Build max heap
      setCurrentStep("Building max heap");
      for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }
        await heapify(arr, arr.length, i);
      }

      // Extract elements from heap one by one
      for (let i = arr.length - 1; i > 0; i--) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }
        // Move current root to end
        setCurrentStep(`Moving largest element to position ${i}`);
        setActiveIndices([0, i]);

        // Update access pattern
        accessPatternMap[0]++;
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        const temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        swaps++;
        setSwaps(swaps);
        setArray([...arr]);

        playSound(arr[i]);

        await new Promise((resolve) => setTimeout(resolve, speed));

        // Call max heapify on the reduced heap
        await heapify(arr, i, 0);
      }

      setActiveIndices([]);
      setCurrentStep("Sorting complete!");
      setProgress(100);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);
    },
  },
  countingSort: {
    name: "Counting Sort",
    complexity: "O(n + k)",
    description:
      "Non-comparative integer sorting algorithm that operates by counting the number of objects that have each distinct key value.",
    details:
      "Counting sort works by creating an auxiliary array for counting the frequency of each value in the input array. It then uses this count array to determine the position of each element in the output array. It's efficient when the range of input values is not significantly larger than the number of elements.",
    icon: <Hash className="h-5 w-5" />,
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const arr = [...array];
      let comparisons = 0;
      let swaps = 0;
      const totalSteps = arr.length * 3;
      let currentStep = 0;

      // Initialize access pattern
      const accessPatternMap = Array(arr.length).fill(0);
      setAccessPattern([...accessPatternMap]);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      // Find the maximum value in the array
      let max = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        // Update access pattern
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        setActiveIndices([i]);
        setCurrentStep(
          `Finding maximum value: comparing ${arr[i]} with current max ${max}`
        );

        comparisons++;
        setComparisons(comparisons);

        if (arr[i] > max) {
          max = arr[i];
        }

        currentStep++;
        setProgress(Math.floor((currentStep / totalSteps) * 100));

        playSound(arr[i]);

        await new Promise((resolve) => setTimeout(resolve, speed / 2));
      }

      // Create a count array and initialize with zeros
      const count = new Array(max + 1).fill(0);

      // Count occurrences of each element
      setCurrentStep("Counting occurrences of each element");
      for (let i = 0; i < arr.length; i++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        // Update access pattern
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        setActiveIndices([i]);
        count[arr[i]]++;

        currentStep++;
        setProgress(Math.floor((currentStep / totalSteps) * 100));

        playSound(arr[i]);

        await new Promise((resolve) => setTimeout(resolve, speed / 2));
      }

      // Modify count array to store the position of each element
      setCurrentStep("Calculating positions in the sorted array");
      for (let i = 1; i <= max; i++) {
        count[i] += count[i - 1];
        await new Promise((resolve) => setTimeout(resolve, speed / 4));
      }

      // Build the output array
      const output = new Array(arr.length);
      setCurrentStep("Building the sorted array");
      for (let i = arr.length - 1; i >= 0; i--) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        // Update access pattern
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        const element = arr[i];
        const position = count[element] - 1;

        setActiveIndices([i, position]);
        setCurrentStep(`Placing element ${element} at position ${position}`);

        output[position] = element;
        count[element]--;
        swaps++;
        setSwaps(swaps);

        playSound(element);

        currentStep++;
        setProgress(Math.floor((currentStep / totalSteps) * 100));

        // Update the original array for visualization
        const tempArr = [...arr];
        for (let j = 0; j < output.length; j++) {
          if (output[j] !== undefined) {
            tempArr[j] = output[j];
          }
        }
        setArray([...tempArr]);

        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      // Copy the output array to the original array
      for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
      }
      setArray([...arr]);

      setActiveIndices([]);
      setCurrentStep("Sorting complete!");
      setProgress(100);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);
    },
  },

  radixSort: {
    name: "Radix Sort",
    complexity: "O(nk)",
    description:
      "Non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by individual digits which share the same significant position and value.",
    details:
      "Radix sort processes the digits of the numbers one by one, starting from the least significant digit (LSD) to the most significant digit (MSD). For each digit position, it uses a stable sorting algorithm to sort the numbers based on that digit. This process is repeated for each digit position until all digits have been processed.",
    icon: <ListFilter className="h-5 w-5" />,
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const arr = [...array];
      let swaps = 0;
      let comparisons = 0;

      // Initialize access pattern
      const accessPatternMap = Array(arr.length).fill(0);
      setAccessPattern([...accessPatternMap]);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      // Find the maximum number to know the number of digits
      let max = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
          max = arr[i];
        }
        comparisons++;
        setComparisons(comparisons);
      }

      // Count the number of digits in the maximum number
      const maxDigits = max.toString().length;
      const totalSteps = arr.length * maxDigits;
      let currentStep = 0;

      // Do counting sort for every digit
      for (let digit = 0; digit < maxDigits; digit++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        setCurrentStep(`Sorting by digit position ${digit + 1} (from right)`);

        // Create count array for this digit
        const count = new Array(10).fill(0);

        // Count occurrences of each digit
        for (let i = 0; i < arr.length; i++) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }

          // Update access pattern
          accessPatternMap[i]++;
          setAccessPattern([...accessPatternMap]);

          // Get the current digit
          const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;

          setActiveIndices([i]);
          setCurrentStep(`Counting digit ${digitValue} from number ${arr[i]}`);

          playSound(arr[i]);

          count[digitValue]++;

          currentStep++;
          setProgress(Math.floor((currentStep / totalSteps) * 100));

          await new Promise((resolve) => setTimeout(resolve, speed / 4));
        }

        // Modify count array to store positions
        for (let i = 1; i < 10; i++) {
          count[i] += count[i - 1];
        }

        // Build the output array
        const output = new Array(arr.length);
        for (let i = arr.length - 1; i >= 0; i--) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }

          // Update access pattern
          accessPatternMap[i]++;
          setAccessPattern([...accessPatternMap]);

          const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;
          const position = count[digitValue] - 1;

          setActiveIndices([i, position]);
          setCurrentStep(
            `Placing ${arr[i]} (digit ${digitValue}) at position ${position}`
          );

          output[position] = arr[i];
          count[digitValue]--;
          swaps++;
          setSwaps(swaps);

          // Update the array for visualization
          const tempArr = [...arr];
          for (let j = 0; j <= i; j++) {
            if (j < arr.length - i - 1) {
              tempArr[j] = output[j];
            }
          }
          setArray([...tempArr]);

          playSound(arr[i]);

          await new Promise((resolve) => setTimeout(resolve, speed));
        }

        // Copy the output array to the original array
        for (let i = 0; i < arr.length; i++) {
          arr[i] = output[i];
        }
        setArray([...arr]);

        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      setActiveIndices([]);
      setCurrentStep("Sorting complete!");
      setProgress(100);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);
    },
  },

  bucketSort: {
    name: "Bucket Sort",
    complexity: "O(n + k)",
    description:
      "Distribution sort that works by distributing elements into a number of buckets, then sorting each bucket individually.",
    details:
      "Bucket sort divides the range of values into equal-sized buckets, and distributes the elements into these buckets. Each bucket is then sorted individually, either using a different sorting algorithm or by recursively applying bucket sort. Finally, the sorted buckets are concatenated to form the final sorted array.",
    icon: <Database className="h-5 w-5" />,
    sort: async (
      array,
      setArray,
      speed,
      setComparisons,
      setSwaps,
      setRunning,
      cancelRef,
      timerRef,
      setCurrentStep,
      soundEnabled,
      setActiveIndices,
      setAccessPattern,
      setProgress
    ) => {
      const arr = [...array];
      let swaps = 0;
      let comparisons = 0;
      const totalSteps = arr.length * 3;
      let currentStep = 0;

      // Initialize access pattern
      const accessPatternMap = Array(arr.length).fill(0);
      setAccessPattern([...accessPatternMap]);

      // Function to play sound based on array value
      const playSound = (value) => {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            200 + value * 2,
            audioCtx.currentTime
          );

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.1
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        }
      };

      // Find the maximum and minimum values
      let max = arr[0];
      let min = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        // Update access pattern
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        setActiveIndices([i]);
        setCurrentStep(
          `Finding range: comparing ${arr[i]} with current min ${min} and max ${max}`
        );

        comparisons += 2;
        setComparisons(comparisons);

        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];

        currentStep++;
        setProgress(Math.floor((currentStep / totalSteps) * 100));

        playSound(arr[i]);

        await new Promise((resolve) => setTimeout(resolve, speed / 2));
      }

      // Create buckets
      const bucketCount = Math.min(arr.length, 10); // Use at most 10 buckets
      const buckets = Array.from({ length: bucketCount }, () => []);
      const range = max - min + 1;

      // Distribute elements into buckets
      setCurrentStep("Distributing elements into buckets");
      for (let i = 0; i < arr.length; i++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        // Update access pattern
        accessPatternMap[i]++;
        setAccessPattern([...accessPatternMap]);

        // Calculate bucket index
        const bucketIndex = Math.min(
          Math.floor((bucketCount * (arr[i] - min)) / range),
          bucketCount - 1
        );

        setActiveIndices([i]);
        setCurrentStep(`Placing ${arr[i]} in bucket ${bucketIndex}`);

        buckets[bucketIndex].push(arr[i]);

        currentStep++;
        setProgress(Math.floor((currentStep / totalSteps) * 100));

        playSound(arr[i]);

        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      // Sort individual buckets (using insertion sort)
      setCurrentStep("Sorting individual buckets");
      for (let i = 0; i < bucketCount; i++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        const bucket = buckets[i];
        setCurrentStep(`Sorting bucket ${i} with ${bucket.length} elements`);

        // Simple insertion sort for each bucket
        for (let j = 1; j < bucket.length; j++) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }

          const current = bucket[j];
          let k = j - 1;

          comparisons++;
          setComparisons(comparisons);

          while (k >= 0 && bucket[k] > current) {
            if (cancelRef.current) {
              setRunning(false);
              setActiveIndices([]);
              return;
            }

            bucket[k + 1] = bucket[k];
            k--;
            swaps++;
            setSwaps(swaps);

            comparisons++;
            setComparisons(comparisons);
          }

          bucket[k + 1] = current;

          // Visualize the current state by flattening all buckets
          const flattenedBuckets = [].concat(
            ...buckets.slice(0, i),
            bucket,
            ...buckets.slice(i + 1)
          );
          const tempArr = [...arr];
          for (let m = 0; m < flattenedBuckets.length; m++) {
            if (m < arr.length) {
              tempArr[m] = flattenedBuckets[m];
            }
          }
          setArray([...tempArr]);

          playSound(current);

          await new Promise((resolve) => setTimeout(resolve, speed / 2));
        }

        currentStep += bucket.length;
        setProgress(Math.floor((currentStep / totalSteps) * 100));
      }

      // Concatenate all buckets back into the original array
      setCurrentStep("Concatenating sorted buckets");
      let index = 0;
      for (let i = 0; i < bucketCount; i++) {
        if (cancelRef.current) {
          setRunning(false);
          setActiveIndices([]);
          return;
        }

        const bucket = buckets[i];
        setCurrentStep(`Adding elements from bucket ${i} to the final array`);

        for (let j = 0; j < bucket.length; j++) {
          if (cancelRef.current) {
            setRunning(false);
            setActiveIndices([]);
            return;
          }

          // Update access pattern
          if (index < arr.length) {
            accessPatternMap[index]++;
            setAccessPattern([...accessPatternMap]);
          }

          setActiveIndices([index]);

          arr[index] = bucket[j];
          index++;

          setArray([...arr]);

          playSound(arr[index - 1]);

          await new Promise((resolve) => setTimeout(resolve, speed / 2));
        }
      }

      setActiveIndices([]);
      setCurrentStep("Sorting complete!");
      setProgress(100);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRunning(false);
    },
  },
};
