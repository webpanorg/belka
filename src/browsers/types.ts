export interface LaunchOptions {
    executablePath: string;
    headless: boolean;
    env: Record<string, string>;
}
