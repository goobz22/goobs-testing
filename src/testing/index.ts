import fs from 'fs';
import path from 'path';

type LoggingMode = 'local' | 'precommit' | 'both';
type OperationType = 'get' | 'update' | 'remove';

interface LoggingConfig {
  logFileName: string;
  testSuiteDir: string;
  mode?: LoggingMode;
  logFolderName?: string;
}

export interface TestResult<T> {
  testName: string;
  operationType: OperationType;
  status: 'passed' | 'failed';
  duration: number;
  error: Error | null;
  operationResults: T;
  testLineNumber: number;
  filePath: string;
}

let localLogStream: fs.WriteStream | null = null;
let failedTestsLogStream: fs.WriteStream | null = null;
const isPreCommit = process.env.HUSKY_GIT_PARAMS !== undefined;

export function setupLogging(config: LoggingConfig) {
  const { logFileName, testSuiteDir, mode = 'local', logFolderName = 'logs' } = config;

  const setupLocalLogging = (): ((message: string) => void) => {
    const baseDir = process.cwd();
    const logsDir = path.join(baseDir, logFolderName);
    const testSuitePath = path.join(logsDir, testSuiteDir);
    const logFilePath = path.join(testSuitePath, logFileName);
    if (!fs.existsSync(testSuitePath)) {
      fs.mkdirSync(testSuitePath, { recursive: true });
    }
    localLogStream = fs.createWriteStream(logFilePath, { flags: 'w' });
    failedTestsLogStream = fs.createWriteStream(path.join(logsDir, 'allFailedTests.log'), {
      flags: 'a',
    });
    return (message: string): void => {
      localLogStream?.write(message + '\n');
    };
  };

  const setupGithubPreCommitLogging = (): ((message: string) => void) => {
    return (message: string): void => {
      console.log(`[Pre-commit] ${message}`);
    };
  };

  const localLog = mode === 'local' || mode === 'both' ? setupLocalLogging() : null;
  const preCommitLog =
    (mode === 'precommit' || mode === 'both') && isPreCommit ? setupGithubPreCommitLogging() : null;

  const log = (message: string): void => {
    if (localLog) localLog(message);
    if (preCommitLog) preCommitLog(message);
    console.log(message);
  };

  const logTestResults = <T>(testResults: TestResult<T>[]): void => {
    const groupedResults: { [testName: string]: TestResult<T>[] } = {};

    testResults.forEach((result) => {
      if (!groupedResults[result.testName]) {
        groupedResults[result.testName] = [];
      }
      groupedResults[result.testName].push(result);
    });

    Object.entries(groupedResults).forEach(([testName, results]) => {
      let message = `\nTest: ${testName}\n`;
      let totalDuration = 0;
      let overallStatus = 'passed';

      results.forEach((result) => {
        const {
          operationType,
          status,
          duration,
          error,
          operationResults,
          testLineNumber,
          filePath,
        } = result;
        totalDuration += duration;
        if (status === 'failed') overallStatus = 'failed';

        const resultString = JSON.stringify(operationResults, null, 2);
        const codeContext = getCodeContext(filePath, testLineNumber);

        message += `
  Operation Type: ${operationType}
  Status: ${status}
  Duration: ${duration}ms
  File: ${filePath}
  Line Number: ${testLineNumber}
  ${status === 'failed' && error ? `Error: ${error.message}\n${error.stack}` : ''}
  ${status === 'failed' ? `Code Context:\n${codeContext}` : ''}
  Operation Results:
  ${resultString}
  `;
      });

      message += `\nOverall Status: ${overallStatus}`;
      message += `\nTotal Duration: ${totalDuration}ms\n`;

      log(message);
    });
  };

  return {
    log,
    logTestResults,
  };
}

function getCodeContext(filePath: string, lineNumber: number, contextLines: number = 2): string {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
      return `File not found: ${absolutePath}`;
    }

    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const lines = fileContent.split('\n');

    if (lineNumber < 1 || lineNumber > lines.length) {
      return `Invalid line number: ${lineNumber}`;
    }

    const startLine = Math.max(1, lineNumber - contextLines);
    const endLine = Math.min(lines.length, lineNumber + contextLines);

    const contextArray = lines.slice(startLine - 1, endLine);
    const paddedLineNumbers = contextArray.map((_, index) =>
      (startLine + index).toString().padStart(6, ' '),
    );

    const codeWithLineNumbers = contextArray.map(
      (line, index) => `${paddedLineNumbers[index]} | ${line}`,
    );

    const errorLineIndex = lineNumber - startLine;
    if (errorLineIndex >= 0 && errorLineIndex < codeWithLineNumbers.length) {
      codeWithLineNumbers[errorLineIndex] = `>${codeWithLineNumbers[errorLineIndex].slice(1)}`;
    }

    return codeWithLineNumbers.join('\n');
  } catch (error) {
    return `Error reading file: ${error}`;
  }
}

export function closeLogStreams(): void {
  if (localLogStream) {
    localLogStream.end();
    localLogStream = null;
  }
  if (failedTestsLogStream) {
    failedTestsLogStream.end();
    failedTestsLogStream = null;
  }
}
