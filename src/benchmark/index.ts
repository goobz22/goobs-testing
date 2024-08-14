'use server';

import { performance } from 'perf_hooks';

type BenchmarkFunction = (() => void) | (() => Promise<void>);

/**
 * Measures the execution time of a function.
 * @param fn The function to benchmark
 * @param iterations Number of times to run the function
 * @returns Promise resolving to the average execution time in milliseconds
 */
export async function benchmark(fn: BenchmarkFunction, iterations: number = 1000): Promise<number> {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    await Promise.resolve(fn());
  }
  const end = performance.now();
  return (end - start) / iterations;
}

/**
 * Compares the performance of multiple functions.
 * @param fns An object where keys are function names and values are the functions to benchmark
 * @param iterations Number of times to run each function
 * @returns Promise resolving to an object with the average execution time for each function
 */
export async function compareBenchmarks(
  fns: Record<string, BenchmarkFunction>,
  iterations: number = 1000,
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  for (const [name, fn] of Object.entries(fns)) {
    results[name] = await benchmark(fn, iterations);
  }
  return results;
}

/**
 * Formats benchmark results for easy reading.
 * @param results Benchmark results to format
 * @returns A Promise resolving to a formatted string of the results
 */
export async function formatBenchmarkResults(results: Record<string, number>): Promise<string> {
  return Object.entries(results)
    .map(([name, time]) => `${name}: ${time.toFixed(4)} ms`)
    .join('\n');
}

/**
 * Runs benchmarks and returns formatted results.
 * @param fns An object where keys are function names and values are the functions to benchmark
 * @param iterations Number of times to run each function
 * @returns Promise resolving to a formatted string of benchmark results
 */
export async function runBenchmarks(
  fns: Record<string, BenchmarkFunction>,
  iterations: number = 1000,
): Promise<string> {
  const results = await compareBenchmarks(fns, iterations);
  return `Benchmark Results:\n${await formatBenchmarkResults(results)}`;
}
