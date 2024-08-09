import { execSync } from 'child_process';

let isPreCommit = false;

export function setupGithubPreCommitLogging(): (message: string) => void {
  isPreCommit = process.env.HUSKY_GIT_PARAMS !== undefined;

  return (message: string): void => {
    if (isPreCommit) {
      console.log(`[Pre-commit] ${message}`);
    }
  };
}

export function logTestResults(
  log: (message: string) => void,
  failedTestCount: number,
  passedTestCount: number,
  totalTestCount: number,
): void {
  log(
    `Test Results: ${failedTestCount} failed, ${passedTestCount} passed, ${totalTestCount} total.`,
  );

  if (isPreCommit && failedTestCount > 0) {
    log('Tests failed. Commit aborted.');
    process.exit(1);
  }
}

export function setupHusky(): void {
  try {
    execSync('npx husky install', { stdio: 'inherit' });
    execSync('npx husky add .husky/pre-commit "npm test"', { stdio: 'inherit' });
    console.log('Husky pre-commit hook set up successfully.');
  } catch (error) {
    console.error('Failed to set up Husky:', error);
  }
}
