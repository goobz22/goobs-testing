'use client';

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug';

export interface GlobalConfig {
  loggingEnabled: boolean;
  logLevel: LogLevel;
  logDirectory: string;
}

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
};

let currentLogLevel: number = logLevels.info;
let loggingEnabled: boolean = true;

function initializeLogger(globalConfig: GlobalConfig): void {
  currentLogLevel = logLevels[globalConfig.logLevel];
  loggingEnabled = globalConfig.loggingEnabled;
}

type LogMetadata = Record<string, unknown>;

function log(level: LogLevel, message: string, metadata?: LogMetadata): void {
  if (!loggingEnabled || logLevels[level] > currentLogLevel) return;

  const timestamp = new Date().toISOString();
  let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;

  if (metadata && Object.keys(metadata).length > 0) {
    logMessage += '\n\t' + JSON.stringify(metadata);
  }

  switch (level) {
    case 'error':
      console.error(logMessage);
      break;
    case 'warn':
      console.warn(logMessage);
      break;
    case 'info':
      console.info(logMessage);
      break;
    default:
      console.log(logMessage);
  }
}

function debug(message: string, metadata?: LogMetadata): void {
  log('debug', message, metadata);
}

function info(message: string, metadata?: LogMetadata): void {
  log('info', message, metadata);
}

function warn(message: string, metadata?: LogMetadata): void {
  log('warn', message, metadata);
}

function error(message: string, metadata?: LogMetadata): void {
  log('error', message, metadata);
}

export const ClientLogger = {
  initializeLogger,
  debug,
  info,
  warn,
  error,
};
