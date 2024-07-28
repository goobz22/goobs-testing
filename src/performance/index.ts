import { performance } from 'perf_hooks';

export async function measureAsyncExecutionTime(func: () => Promise<void>): Promise<number> {
  const start = performance.now();
  await func();
  const end = performance.now();
  return end - start;
}

export async function measureMultipleAsyncExecutionTimes(
  func: () => Promise<void>,
  iterations: number,
): Promise<number[]> {
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const time = await measureAsyncExecutionTime(func);
    times.push(time);
  }
  return times;
}
