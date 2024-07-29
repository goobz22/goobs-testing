import fs from 'fs';
import path from 'path';

type LoggingMode = 'local' | 'precommit' | 'both';

let localLogStream: fs.WriteStream | null = null;
let failedTestsLogStream: fs.WriteStream | null = null;
const isPreCommit = process.env.HUSKY_GIT_PARAMS !== undefined;

export interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  error?: Error;
}

export function setupLogging(
  logFileName: string,
  testSuiteDir: string,
  mode: LoggingMode = 'local',
  logFolderName: string = 'logs',
): (message: string) => void {
  const setupLocalLogging = () => {
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

  const setupGithubPreCommitLogging = () => {
    return (message: string): void => {
      console.log(`[Pre-commit] ${message}`);
    };
  };

  const localLog = mode === 'local' || mode === 'both' ? setupLocalLogging() : null;
  const preCommitLog =
    (mode === 'precommit' || mode === 'both') && isPreCommit ? setupGithubPreCommitLogging() : null;

  return (message: string): void => {
    if (localLog) localLog(message);
    if (preCommitLog) preCommitLog(message);
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

export function logTestResults(
  log: (message: string) => void,
  testResults: TestResult[],
  testSuiteName: string,
  testSuiteFile: string,
  totalDuration: number,
): void {
  const failedTests = testResults.filter((test) => test.status === 'failed');
  const passedTests = testResults.filter((test) => test.status === 'passed');

  const status = failedTests.length > 0 ? 'FAIL' : 'PASS';
  const summary = `${status} ${testSuiteFile} (${totalDuration.toFixed(3)} s)
  ${testSuiteName}
${testResults.map((test) => `    ${test.status === 'passed' ? '√' : '×'} ${test.name} (${test.duration} ms)`).join('\n')}
`;
  log(summary);

  failedTests.forEach(({ name, error }) => {
    if (error) {
      const errorMessage = error.message;
      const stackLines = error.stack?.split('\n') || [];
      const relevantStackLine = stackLines.find((line) => line.includes(testSuiteFile));

      let lineNumber = -1;
      let columnNumber = -1;

      if (relevantStackLine) {
        const match = relevantStackLine.match(/:(\d+):(\d+)/);
        if (match) {
          lineNumber = parseInt(match[1], 10);
          columnNumber = parseInt(match[2], 10);
        }
      }

      const codeContext = getCodeContext(testSuiteFile, lineNumber);

      const failureDetails = `  ● ${testSuiteName} › ${name}
    ${errorMessage}
${codeContext}
${columnNumber > 0 ? `          ${' '.repeat(columnNumber - 1)}^` : ''}
${stackLines.filter((line) => line.includes(testSuiteFile)).join('\n')}
`;
      log(failureDetails);
    }
  });

  const finalSummary = `Test Suites: ${failedTests.length > 0 ? '1 failed, ' : ''}1 total
Tests:       ${failedTests.length} failed, ${passedTests.length} passed, ${testResults.length} total
Snapshots:   0 total
Time:        ${totalDuration.toFixed(3)} s
`;
  log(finalSummary);
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

export function debugLog(message: string): void {
  console.log(`[DEBUG] ${message}`);
  if (localLogStream) {
    localLogStream.write(`[DEBUG] ${message}\n`);
  }
}
