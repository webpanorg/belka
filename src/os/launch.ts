import { spawn, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as fse from 'fs-extra';
import type { ChildProcess } from 'node:child_process';

// Universla kill process
export const processKill = (pid: number) => {
    // https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/utils/processLauncher.ts#L224
    if (process.platform === 'win32') {
        return spawnSync(`taskkill /pid ${pid} /T /F`, { shell: true, encoding: 'utf-8' });
    }

    process.kill(-pid, 'SIGINT');
};

export interface LauncOptions {
    execPath: string;
    args?: Array<string>;
    env?: NodeJS.ProcessEnv;
    logDir: string;
    callback?: (arg: { pid: number; code: number; signal: NodeJS.Signals }) => void | Promise<void>;
}

export interface LaunchResult {
    $options: LauncOptions;
    $childProcess: ChildProcess;
    close: () => Promise<void>;
}

export const launch = async (options: LauncOptions): Promise<LaunchResult> => {
    const { execPath, args, env, logDir, callback } = options;

    const logDirExist = await fse.pathExists(logDir);
    if (!logDirExist) {
        await fse.mkdir(logDir, { recursive: true });
    }

    const outFile = fs.openSync(`${logDir}/out.log`, 'a');
    const errFile = fs.openSync(`${logDir}/err.log`, 'a');

    const childProcess = spawn(execPath, args || [], {
        // On non-windows platforms, `detached: true` makes child process a leader of a new
        // process group, making it possible to kill child process tree with `.kill(-pid)` command.
        // @see https://nodejs.org/api/child_process.html#child_process_options_detached
        detached: process.platform !== 'win32',
        stdio: ['ignore', outFile, errFile],
        env: {
            ...process.env,
            ...(env || {}),
        },
    });

    // Prevent Unhandled 'error' event.
    childProcess.on('error', () => {});
    if (!childProcess.pid) {
        const errorMessage = await new Promise<string>((resolve) => {
            childProcess.once('error', (error) => {
                resolve('Failed to launch: ' + error);
            });
        });
        throw new Error(errorMessage);
    }

    childProcess.once('exit', (exitCode, signal) => {
        if (callback) {
            callback({
                pid: childProcess.pid,
                code: exitCode,
                signal,
            });
        }
    });

    const close = async () => {
        if (!childProcess.pid) {
            return; // childProcess might have already stopped
        }

        // kill childProcess
        await new Promise((resolve) => {
            childProcess.once('exit', resolve);
            processKill(childProcess.pid);
        });
    };

    return {
        $options: options,
        $childProcess: childProcess,
        close,
    };
};
