import { spawn, SpawnOptionsWithoutStdio, ChildProcessWithoutNullStreams } from 'node:child_process';

function normalizeCommand(command: string): string {
    // trim and clear \n
    return command
        .replace(/\r?\n|\r/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function child_exec(
    command: string,
    optionsOrCallback?: SpawnOptionsWithoutStdio | ((error: Error | null, stdout: string, stderr: string) => void),
    callback?: (error: Error | null, stdout: string, stderr: string) => void,
): ChildProcessWithoutNullStreams {
    let options: SpawnOptionsWithoutStdio = {};

    if (typeof optionsOrCallback === 'function') {
        callback = optionsOrCallback;
    } else if (optionsOrCallback) {
        options = optionsOrCallback;
    }

    command = normalizeCommand(command);
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, options);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
    });

    child.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
    });

    child.on('close', (code: number) => {
        const error = code === 0 ? null : new Error(`Command failed: ${command}\n${stderr}`);
        if (error) {
            error['code'] = code;
            error['stdout'] = stdout;
            error['stderr'] = stderr;
        }
        if (callback) callback(error, stdout, stderr);
    });

    child.on('error', (error: Error) => {
        if (callback) callback(error, stdout, stderr);
    });

    return child;
}
