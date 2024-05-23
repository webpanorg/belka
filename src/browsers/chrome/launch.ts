// Когда запускается браузер, для него всегда, абсолютно всегда прописывается remote-debugging-port
// Если пользователь указал этот порт самостоятельно, то используется порт введеный пользователем
// firefoxArguments.push(`--remote-debugging-port=${debuggingPort || 0}`);
// Правильно заполняем аргументы для запуска chrome

export interface LaunchOptions {
    executablePath: string;
    headless?: boolean;
}

export class ChromeLauncer {}

export default async () => {};
