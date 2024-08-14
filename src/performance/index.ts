// Cross-environment compatible getTime function
const getTime = (): number => {
  if (typeof window !== 'undefined' && window.performance && window.performance.now) {
    return window.performance.now();
  } else if (typeof process !== 'undefined' && process.hrtime) {
    const [seconds, nanoseconds] = process.hrtime();
    return seconds * 1000 + nanoseconds / 1e6;
  } else {
    return Date.now();
  }
};

export async function measureAsyncExecutionTime<T>(
  func: () => Promise<T>,
): Promise<{ result: T; duration: number }> {
  const start = getTime();
  const result = await func();
  const end = getTime();
  return { result, duration: end - start };
}

export async function measureMultipleAsyncExecutionTimes<T>(
  func: () => Promise<T>,
  iterations: number,
): Promise<{ results: T[]; durations: number[] }> {
  const durations: number[] = [];
  const results: T[] = [];
  for (let i = 0; i < iterations; i++) {
    const { result, duration } = await measureAsyncExecutionTime(func);
    durations.push(duration);
    results.push(result);
  }
  return { results, durations };
}

export async function calculateExecutionTimeStats(times: number[]): Promise<{
  min: number;
  max: number;
  mean: number;
  median: number;
  standardDeviation: number;
}> {
  const sortedTimes = [...times].sort((a, b) => a - b);
  const min = sortedTimes[0];
  const max = sortedTimes[sortedTimes.length - 1];
  const mean = times.reduce((sum, time) => sum + time, 0) / times.length;
  const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
  const squaredDifferences = times.map((time) => Math.pow(time - mean, 2));
  const variance =
    squaredDifferences.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / times.length;
  const standardDeviation = Math.sqrt(variance);
  return { min, max, mean, median, standardDeviation };
}

export async function measureAsyncExecutionTimeWithStats<T>(
  func: () => Promise<T>,
  iterations: number,
): Promise<{
  results: T[];
  executionTimes: number[];
  stats: Awaited<ReturnType<typeof calculateExecutionTimeStats>>;
}> {
  const { results, durations } = await measureMultipleAsyncExecutionTimes(func, iterations);
  const stats = await calculateExecutionTimeStats(durations);
  return { results, executionTimes: durations, stats };
}

// Default export
export default {
  measureAsyncExecutionTime,
  measureMultipleAsyncExecutionTimes,
  calculateExecutionTimeStats,
  measureAsyncExecutionTimeWithStats,
};
