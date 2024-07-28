type ConsoleErrorFunction = (message?: unknown, ...optionalParams: unknown[]) => void;

let originalConsoleError: ConsoleErrorFunction;

export function setupErrorHandling(log: (message: string) => void): () => void {
  process.on('uncaughtException', (error: Error) => {
    log(`Uncaught Exception: ${error.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${String(reason)}`);
    process.exit(1);
  });

  // Store the original console.error function
  originalConsoleError = console.error;

  // Override console.error to use our custom log function
  console.error = (message?: unknown, ...optionalParams: unknown[]) => {
    log(`Error: ${String(message)} ${optionalParams.map(String).join(' ')}`);
  };

  // Return a function to restore the original console.error
  return restoreConsoleError;
}

export function restoreConsoleError(): void {
  if (originalConsoleError) {
    console.error = originalConsoleError;
  }
}
