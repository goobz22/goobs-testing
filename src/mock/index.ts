import { performance } from 'perf_hooks';

type MockWithAdvanceTime = jest.Mock<number, []> & {
  advanceTime: (ms: number) => void;
};

export const mockPerformanceNow = (): MockWithAdvanceTime => {
  let time = 0;
  const mock = jest.fn(() => time) as MockWithAdvanceTime;
  mock.advanceTime = (ms: number) => {
    time += ms;
  };
  return mock;
};

export const realPerformanceNow = performance.now;

export const mockConsole = () => {
  const mockLog = jest.fn();
  const mockError = jest.fn();
  const mockWarn = jest.fn();
  const mockInfo = jest.fn();
  const original = { ...console };
  beforeAll(() => {
    console.log = mockLog;
    console.error = mockError;
    console.warn = mockWarn;
    console.info = mockInfo;
  });
  afterAll(() => {
    console.log = original.log;
    console.error = original.error;
    console.warn = original.warn;
    console.info = original.info;
  });
  return { mockLog, mockError, mockWarn, mockInfo };
};

export const mockFetch = (response: unknown) => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    }),
  );
};

export const mockAsyncFunction = <T>(result: T, delay = 0) => {
  return jest
    .fn()
    .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(result), delay)));
};

export const createMockEvent = <T extends Record<string, unknown> = Record<string, unknown>>(
  overrides?: Partial<T>,
): T & { preventDefault: jest.Mock } =>
  ({
    preventDefault: jest.fn(),
    ...overrides,
  }) as T & { preventDefault: jest.Mock };

export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

export const mockTimer = () => {
  jest.useFakeTimers();
  return {
    advanceTimersByTime: jest.advanceTimersByTime,
    runAllTimers: jest.runAllTimers,
    clearAllTimers: jest.clearAllTimers,
  };
};

export const mockModule = (moduleName: string, mockExports: Record<string, unknown>) => {
  jest.mock(moduleName, () => mockExports, { virtual: true });
};

export const mockEnvironment = (envVars: { [key: string]: string }) => {
  const originalEnv = process.env;
  beforeAll(() => {
    process.env = { ...originalEnv, ...envVars };
  });
  afterAll(() => {
    process.env = originalEnv;
  });
};
