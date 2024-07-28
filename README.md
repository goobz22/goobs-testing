# goobs-testing

A comprehensive collection of testing utilities for JavaScript and TypeScript projects.

## Description

`goobs-testing` is a package that provides a set of utilities to enhance your testing workflow. It includes custom assertions, mocking utilities, performance measurement tools, benchmarking, and logging helpers. This package is designed to work seamlessly with Jest and TypeScript projects, and includes integration with Husky for pre-commit hooks.

## Installation

To install the package, run:

```bash
npm install goobs-testing
```

or if you're using Yarn:

```bash
yarn add goobs-testing
```

To set up Husky for pre-commit hooks, run:

```bash
npx goobs-testing setup-husky
```

This will install Husky and set up a pre-commit hook to run your tests.

## Modules and Usage

### Assertions (`assertions/index.ts`)

Custom assertion functions to make your tests more readable and maintainable.

```typescript
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
} from 'goobs-testing';

describe('Assertion Tests', () => {
  it('should be within range', () => {
    expectToBeWithinRange(5, 1, 10);
  });

  it('should be close to now', () => {
    expectToBeCloseToNow(new Date());
  });

  it('should have been called once with specific arguments', () => {
    const mock = jest.fn();
    mock('test');
    expectToHaveBeenCalledOnceWith(mock, 'test');
  });

  it('should be a valid email', () => {
    expectToBeValidEmail('test@example.com');
  });

  it('should be a non-empty string', () => {
    expectToBeNonEmptyString('test');
  });

  it('should be a positive number', () => {
    expectToBePositiveNumber(5);
  });

  it('should be a valid UUID', () => {
    expectToBeValidUUID('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should have property', () => {
    expectToHaveProperty({ test: 'value' }, 'test');
  });

  it('should be an empty array', () => {
    expectToBeEmptyArray([]);
  });

  it('should be a non-empty array', () => {
    expectToBeNonEmptyArray([1, 2, 3]);
  });

  it('should be true', () => {
    expectToBeTrue(true);
  });

  it('should be false', () => {
    expectToBeFalse(false);
  });

  it('should be null', () => {
    expectToBeNull(null);
  });

  it('should be undefined', () => {
    expectToBeUndefined(undefined);
  });

  it('should be null or undefined', () => {
    expectToBeNullOrUndefined(null);
    expectToBeNullOrUndefined(undefined);
  });

  it('should throw error', () => {
    expectToThrowError(() => {
      throw new Error('Test error');
    });
  });

  it('should be a promise', () => {
    expectToBePromise(Promise.resolve());
  });

  it('should be a date', () => {
    expectToBeDate(new Date());
  });

  it('should be sorted', () => {
    expectToBeSorted([1, 2, 3, 4, 5]);
  });
});
```

### Error Handling (`error/index.ts`)

Utilities for setting up global error handling in your tests.

```typescript
import { setupErrorHandling, restoreConsoleError } from 'goobs-testing';

describe('Error Handling', () => {
  let teardown: () => void;

  beforeAll(() => {
    teardown = setupErrorHandling((message) => console.log(message));
  });

  afterAll(() => {
    teardown();
    restoreConsoleError();
  });

  it('should handle uncaught exception', () => {
    // This will be caught by the global error handler
    throw new Error('Uncaught exception');
  });

  it('should handle unhandled rejection', async () => {
    // This will be caught by the global error handler
    await Promise.reject(new Error('Unhandled rejection'));
  });
});
```

### Logging (`logging/index.ts`)

Functions to assist with logging during test execution, including support for local logging and GitHub pre-commit logging.

```typescript
import { setupLogging, logTestResults, closeLogStreams } from 'goobs-testing';

describe('Logging Tests', () => {
  let log: (message: string) => void;

  beforeAll(() => {
    log = setupLogging('test-log.txt', 'TestSuite');
  });

  afterAll(() => {
    closeLogStreams();
  });

  it('should log test results', () => {
    log('Test passed');
    // Assertions would go here
  });

  it('should log failed tests', () => {
    log('Test failed');
    // Assertions would go here
  });

  afterAll(() => {
    logTestResults(log, 1, 1, 2, 'TestSuite');
  });
});
```

### Mocking (`mock/index.ts`)

Helper functions for mocking various JavaScript/TypeScript features.

```typescript
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
} from 'goobs-testing';

describe('Mocking Tests', () => {
  it('should mock performance.now', () => {
    const mockNow = mockPerformanceNow();
    expect(mockNow()).toBe(0);
    mockNow.advanceTime(100);
    expect(mockNow()).toBe(100);
  });

  it('should use real performance.now', () => {
    const now = realPerformanceNow();
    expect(typeof now).toBe('number');
  });

  it('should mock console', () => {
    const { mockLog, mockError, mockWarn, mockInfo } = mockConsole();
    console.log('test');
    expect(mockLog).toHaveBeenCalledWith('test');
  });

  it('should mock fetch', async () => {
    const mockFetchFn = mockFetch({ data: 'mocked data' });
    const response = await mockFetchFn('https://api.example.com');
    const data = await response.json();
    expect(data).toEqual({ data: 'mocked data' });
  });

  it('should mock async function', async () => {
    const mockAsync = mockAsyncFunction('result', 100);
    const result = await mockAsync();
    expect(result).toBe('result');
  });

  it('should create mock event', () => {
    const mockEvent = createMockEvent({ target: { value: 'test' } });
    expect(mockEvent.preventDefault).toBeDefined();
    expect(mockEvent.target.value).toBe('test');
  });

  it('should mock localStorage', () => {
    const mockStorage = mockLocalStorage();
    mockStorage.setItem('key', 'value');
    expect(mockStorage.getItem('key')).toBe('value');
  });

  it('should mock timer', () => {
    const { advanceTimersByTime, runAllTimers, clearAllTimers } = mockTimer();
    const callback = jest.fn();
    setTimeout(callback, 1000);
    advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
  });

  it('should mock module', () => {
    mockModule('fake-module', { fakeFunction: jest.fn() });
    const fakeModule = require('fake-module');
    fakeModule.fakeFunction();
    expect(fakeModule.fakeFunction).toHaveBeenCalled();
  });

  it('should mock environment', () => {
    mockEnvironment({ NODE_ENV: 'test' });
    expect(process.env.NODE_ENV).toBe('test');
  });
});
```

### Performance Measurement (`performance/index.ts`)

Tools for measuring the performance of asynchronous functions.

```typescript
import { measureAsyncExecutionTime, measureMultipleAsyncExecutionTimes } from 'goobs-testing';

describe('Performance Tests', () => {
  it('should measure async execution time', async () => {
    const time = await measureAsyncExecutionTime(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(time).toBeGreaterThanOrEqual(100);
  });

  it('should measure multiple async execution times', async () => {
    const times = await measureMultipleAsyncExecutionTimes(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }, 3);
    expect(times.length).toBe(3);
    times.forEach((time) => {
      expect(time).toBeGreaterThanOrEqual(100);
    });
  });
});
```

### Benchmarking (`benchmark/index.ts`)

Utilities for benchmarking functions and comparing their performance.

```typescript
import { benchmark, compareBenchmarks, formatBenchmarkResults, runBenchmarks } from 'goobs-testing';

describe('Benchmark Tests', () => {
  it('should benchmark a function', async () => {
    const result = await benchmark(() => {
      for (let i = 0; i < 1000000; i++) {}
    });
    expect(typeof result).toBe('number');
  });

  it('should compare benchmarks', async () => {
    const results = await compareBenchmarks({
      slowFunction: () => {
        for (let i = 0; i < 1000000; i++) {}
      },
      fastFunction: () => {
        for (let i = 0; i < 100000; i++) {}
      },
    });
    expect(results.slowFunction).toBeGreaterThan(results.fastFunction);
  });

  it('should format benchmark results', () => {
    const results = {
      slowFunction: 10.5,
      fastFunction: 1.2,
    };
    const formatted = formatBenchmarkResults(results);
    expect(formatted).toContain('slowFunction: 10.5000 ms');
    expect(formatted).toContain('fastFunction: 1.2000 ms');
  });

  it('should run benchmarks and return formatted results', async () => {
    const results = await runBenchmarks({
      slowFunction: () => {
        for (let i = 0; i < 1000000; i++) {}
      },
      fastFunction: () => {
        for (let i = 0; i < 100000; i++) {}
      },
    });
    expect(results).toContain('Benchmark Results:');
    expect(results).toContain('slowFunction:');
    expect(results).toContain('fastFunction:');
  });
});
```

## Full Example

Here's an example of how you might use multiple utilities from `goobs-testing` in a single test suite:

```typescript
import {
  expectToBeWithinRange,
  mockFetch,
  measureAsyncExecutionTime,
  setupErrorHandling,
  setupLogging,
  logTestResults,
  closeLogStreams,
  benchmark,
} from 'goobs-testing';

describe('Comprehensive Test Suite', () => {
  let log: (message: string) => void;
  let teardown: () => void;

  beforeAll(() => {
    // Set up error handling
    teardown = setupErrorHandling((message) => console.error(message));

    // Set up logging
    log = setupLogging('comprehensive-test.log', 'ComprehensiveTestSuite');
  });

  afterAll(() => {
    teardown();
    closeLogStreams();
  });

  it('should perform a complex test scenario', async () => {
    // Use custom assertion
    expectToBeWithinRange(5, 1, 10);

    // Use mocking
    const mockFetchFn = mockFetch({ data: 'mocked data' });
    const response = await mockFetchFn('https://api.example.com');
    const data = await response.json();
    expect(data).toEqual({ data: 'mocked data' });

    // Measure performance
    const time = await measureAsyncExecutionTime(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(time).toBeGreaterThanOrEqual(100);

    // Benchmark a function
    const benchmarkResult = await benchmark(() => {
      for (let i = 0; i < 1000000; i++) {}
    });

    // Log results
    log(`Test completed in ${time}ms`);
    log(`Benchmark result: ${benchmarkResult}ms`);
  });

  afterAll(() => {
    logTestResults(log, 0, 1, 1, 'ComprehensiveTestSuite');
  });
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

Matthew Goluba

## Repository

[https://github.com/goobz22/goobs-testing](https://github.com/goobz22/goobs-testing)
