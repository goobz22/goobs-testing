// Assertions
import {
  expectToBeWithinRange,
  expectToBeCloseToNow,
  expectToHaveBeenCalledOnceWith,
  expectToBeValidEmail,
  expectToBeNonEmptyString,
  expectToBePositiveNumber,
  expectToBeValidUUID,
  expectToHaveProperty,
  expectToBeEmptyArray,
  expectToBeNonEmptyArray,
  expectToBeTrue,
  expectToBeFalse,
  expectToBeNull,
  expectToBeUndefined,
  expectToBeNullOrUndefined,
  expectToThrowError,
  expectToBePromise,
  expectToBeDate,
  expectToBeSorted,
  expectToBeGreaterThan,
  wrapExpectToThrowError,
} from './assertions';

// Error handling
import { setupErrorHandling, restoreConsoleError } from './error';

// Logging
import { setupLogging, logTestResults, closeLogStreams, TestResult, debugLog } from './logging';

// Mocking utilities
import {
  mockPerformanceNow,
  realPerformanceNow,
  mockConsole,
  mockFetch,
  mockAsyncFunction,
  createMockEvent,
  mockLocalStorage,
  mockTimer,
  mockModule,
  mockEnvironment,
} from './mock';

// Performance measurement
import { measureAsyncExecutionTime, measureMultipleAsyncExecutionTimes } from './performance';

// Benchmark utilities
import { benchmark, compareBenchmarks, formatBenchmarkResults, runBenchmarks } from './benchmark';

export {
  // Assertions
  expectToBeWithinRange,
  expectToBeCloseToNow,
  expectToHaveBeenCalledOnceWith,
  expectToBeValidEmail,
  expectToBeNonEmptyString,
  expectToBePositiveNumber,
  expectToBeValidUUID,
  expectToHaveProperty,
  expectToBeEmptyArray,
  expectToBeNonEmptyArray,
  expectToBeTrue,
  expectToBeFalse,
  expectToBeNull,
  expectToBeUndefined,
  expectToBeNullOrUndefined,
  expectToThrowError,
  expectToBePromise,
  expectToBeDate,
  expectToBeSorted,
  expectToBeGreaterThan,
  wrapExpectToThrowError,

  // Error handling
  setupErrorHandling,
  restoreConsoleError,

  // Logging
  setupLogging,
  logTestResults,
  closeLogStreams,
  debugLog,

  // Mocking utilities
  mockPerformanceNow,
  realPerformanceNow,
  mockConsole,
  mockFetch,
  mockAsyncFunction,
  createMockEvent,
  mockLocalStorage,
  mockTimer,
  mockModule,
  mockEnvironment,

  // Performance measurement
  measureAsyncExecutionTime,
  measureMultipleAsyncExecutionTimes,

  // Benchmark utilities
  benchmark,
  compareBenchmarks,
  formatBenchmarkResults,
  runBenchmarks,
};

// Re-export TestResult as a type
export type { TestResult };
