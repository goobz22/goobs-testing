import { expect } from '@jest/globals';

export function expectToBeGreaterThan(actual: number, expected: number): void {
  expect(actual).toBeGreaterThan(expected);
}

export function expectToBeWithinRange(actual: number, min: number, max: number): void {
  expect(actual).toBeGreaterThanOrEqual(min);
  expect(actual).toBeLessThanOrEqual(max);
}

export function expectToBeCloseToNow(date: Date, toleranceMs: number = 1000): void {
  const now = new Date().getTime();
  const actualTime = date.getTime();
  expect(Math.abs(now - actualTime)).toBeLessThanOrEqual(toleranceMs);
}

export function expectToHaveBeenCalledOnceWith(mock: jest.Mock, ...args: unknown[]): void {
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith(...args);
}

export function expectToBeValidEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  expect(email).toMatch(emailRegex);
}

export function expectToBeNonEmptyString(value: unknown): void {
  expect(typeof value).toBe('string');
  expect((value as string).length).toBeGreaterThan(0);
}

export function expectToBePositiveNumber(value: unknown): void {
  expect(typeof value).toBe('number');
  expect(value as number).toBeGreaterThan(0);
}

export function expectToBeValidUUID(value: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  expect(value).toMatch(uuidRegex);
}

export function expectToHaveProperty<T>(obj: T, prop: keyof T): void {
  expect(obj).toHaveProperty(prop as string);
}

export function expectToBeEmptyArray(value: unknown): void {
  expect(Array.isArray(value)).toBe(true);
  expect((value as unknown[]).length).toBe(0);
}

export function expectToBeNonEmptyArray(value: unknown): void {
  expect(Array.isArray(value)).toBe(true);
  expect((value as unknown[]).length).toBeGreaterThan(0);
}

export function expectToBeTrue(value: unknown): void {
  expect(value).toBe(true);
}

export function expectToBeFalse(value: unknown): void {
  expect(value).toBe(false);
}

export function expectToBeNull(value: unknown): void {
  expect(value).toBeNull();
}

export function expectToBeUndefined(value: unknown): void {
  expect(value).toBeUndefined();
}

export function expectToBeNullOrUndefined(value: unknown): void {
  expect(value == null).toBe(true);
}

export function expectToThrowError(func: () => void, errorMessage?: string): void {
  if (errorMessage) {
    expect(func).toThrow(errorMessage);
  } else {
    expect(func).toThrow();
  }
}

export function expectToBePromise(value: unknown): void {
  expect(value).toBeInstanceOf(Promise);
}

export function expectToBeDate(value: unknown): void {
  expect(value).toBeInstanceOf(Date);
  expect(isNaN((value as Date).getTime())).toBe(false);
}

export function expectToBeSorted(
  array: number[],
  order: 'ascending' | 'descending' = 'ascending',
): void {
  const sortedArray = [...array].sort((a, b) => (order === 'ascending' ? a - b : b - a));
  expect(array).toEqual(sortedArray);
}

export function wrapExpectToThrowError(
  func: () => Promise<void>,
  errorMessage?: string,
): Promise<void> {
  return expect(func()).rejects.toThrow(errorMessage);
}
