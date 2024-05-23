
// Когда запускается браузер, для него всегда, абсолютно всегда прописывается remote-debugging-port
// Если пользователь указал этот порт самостоятельно, то используется порт введеный пользователем
// firefoxArguments.push(`--remote-debugging-port=${debuggingPort || 0}`);
// Правильно заполняем аргументы для запуска chrome


import { spawn } from 'child_process';
import type { ChildProcessWithoutNullStreams } from 'child_process';

export interface LaunchOptions {
    executablePath: string;
}

export class ChromeLauncer {
  private childProcess: null 
  
  private prepare = () => {
    // const platform = getPlatform() as SupportedPlatforms;
    // if (!_SUPPORTED_PLATFORMS.has(platform)) {
    //   throw new UnsupportedPlatformError();
    // }

    this.userDataDir = this.userDataDir || this.makeTmpDir();
    this.outFile = this.fs.openSync(`${this.userDataDir}/chrome-out.log`, 'a');
    this.errFile = this.fs.openSync(`${this.userDataDir}/chrome-err.log`, 'a');

    this.setBrowserPrefs();

    // fix for Node4
    // you can't pass a fd to fs.writeFileSync
    this.pidFile = `${this.userDataDir}/chrome.pid`;

    log.verbose('ChromeLauncher', `created ${this.userDataDir}`);

    this.tmpDirandPidFileReady = true;
  }

  private spawnPromise = async () => {

    const outFile = this.fs.openSync(`${this.userDataDir}/chrome-out.log`, 'a');
    const errFile = this.fs.openSync(`${this.userDataDir}/chrome-err.log`, 'a');



    // if (this.chromeProcess) {
    //   log.log('ChromeLauncher', `Chrome already running with pid ${this.chromeProcess.pid}.`);
    //   return this.chromeProcess.pid;
    // }

    // If a zero value port is set, it means the launcher
    // is responsible for generating the port number.
    // We do this here so that we can know the port before
    // we pass it into chrome.
    // if (this.requestedPort === 0) {
    //   this.port = await getRandomPort();
    // }

    log.verbose('ChromeLauncher', `Launching with command:\n"${execPath}" ${this.flags.join(' ')}`);
    const childProcess = childProcess.spawn(execPath, this.flags, {
      // On non-windows platforms, `detached: true` makes child process a leader of a new
      // process group, making it possible to kill child process tree with `.kill(-pid)` command.
      // @see https://nodejs.org/api/child_process.html#child_process_options_detached
      detached: process.platform !== 'win32',
      stdio: ['ignore', this.outFile, this.errFile],
      env: this.envVars,
    });


    this.childProcess = childProcess;

    // log.verbose('ChromeLauncher', `Chrome running with pid ${this.chromeProcess.pid} on port ${this.port}.`);
    return this.chromeProcess.pid;
  };


  private async spawnProcess(execPath: string) {
    const pid = await spawnPromise();
    await this.waitUntilReady();
    return pid;
  }

  public kill = async () => {};
}

export const launch = async () => {
    const launcer = new ChromeLauncer();

    return {
        kill: launcer.kill;
    }
}
