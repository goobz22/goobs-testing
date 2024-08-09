import fs from 'fs';
import path from 'path';

let logStream: fs.WriteStream;
let failedTestsLogStream: fs.WriteStream;

export function setupLocalLogging(
  logFileName: string,
  testSuiteDir: string,
  logFolderName: string = 'logs',
): (message: string) => void {
  const baseDir = process.cwd();
  const logsDir = path.join(baseDir, logFolderName);
  const testSuitePath = path.join(logsDir, testSuiteDir);
  const logFilePath = path.join(testSuitePath, logFileName);

  if (!fs.existsSync(testSuitePath)) {
    fs.mkdirSync(testSuitePath, { recursive: true });
  }

  logStream = fs.createWriteStream(logFilePath, { flags: 'w' });
  failedTestsLogStream = fs.createWriteStream(path.join(logsDir, 'allFailedTests.log'), {
    flags: 'w',
  });

  return (message: string): void => {
    const timestamp = new Date().toISOString();
    logStream.write(`${timestamp} - ${message}\n`);
  };
}

export function logTestResults(
  log: (message: string) => void,
  failedTestCount: number,
  passedTestCount: number,
  totalTestCount: number,
  testSuiteDir: string,
): void {
  log(
    `All tests completed. ${failedTestCount} failed, ${passedTestCount} passed, ${totalTestCount} total.`,
  );
  failedTestsLogStream.write(
    `Test summary for ${path.basename(testSuiteDir)}:\nTest Suites: ${failedTestCount} failed, ${passedTestCount} passed, ${totalTestCount} total\nTests: ${failedTestCount} failed, ${passedTestCount} passed, ${totalTestCount} total\n`,
  );
}

export function closeLocalLogStreams(): void {
  logStream.end();
  failedTestsLogStream.end();
}
