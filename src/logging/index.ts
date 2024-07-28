import {
  setupLocalLogging,
  logTestResults as logLocalTestResults,
  closeLocalLogStreams,
} from './local-logging';
import {
  setupGithubPreCommitLogging,
  logTestResults as logGithubTestResults,
  setupHusky,
} from './github-precommit';

const isGithubPreCommit = process.env.HUSKY_GIT_PARAMS !== undefined;

export function setupLogging(
  logFileName: string,
  testSuiteDir: string,
  logFolderName: string = 'logs',
): (message: string) => void {
  if (isGithubPreCommit) {
    return setupGithubPreCommitLogging();
  } else {
    return setupLocalLogging(logFileName, testSuiteDir, logFolderName);
  }
}

export function logTestResults(
  log: (message: string) => void,
  failedTestCount: number,
  passedTestCount: number,
  totalTestCount: number,
  testSuiteDir: string,
): void {
  if (isGithubPreCommit) {
    logGithubTestResults(log, failedTestCount, passedTestCount, totalTestCount);
  } else {
    logLocalTestResults(log, failedTestCount, passedTestCount, totalTestCount, testSuiteDir);
  }
}

export function closeLogStreams(): void {
  if (!isGithubPreCommit) {
    closeLocalLogStreams();
  }
}

export { setupHusky };
