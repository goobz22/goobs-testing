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

// Testing
import { setupLogging, closeLogStreams, TestResult } from './testing';

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
import {
  measureAsyncExecutionTime,
  measureMultipleAsyncExecutionTimes,
  calculateExecutionTimeStats,
  measureAsyncExecutionTimeWithStats,
} from './performance';

// Benchmark utilities
import { benchmark, compareBenchmarks, formatBenchmarkResults, runBenchmarks } from './benchmark';

import { ClientLogger } from './logging/logger.client';
import { ServerLogger } from './logging/logger.server';

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

  // Logging
  setupLogging,
  closeLogStreams,

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
  calculateExecutionTimeStats,
  measureAsyncExecutionTimeWithStats,

  // Benchmark utilities
  benchmark,
  compareBenchmarks,
  formatBenchmarkResults,
  runBenchmarks,
  ClientLogger,
  ServerLogger,
};

// Re-export TestResult as a type
export type { TestResult };
