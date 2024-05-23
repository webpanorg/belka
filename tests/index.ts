import * as path from 'path';
import { chromium, firefox, webkit } from 'playwright';
import { launch } from '../src/os/launch';

(async () => {
    console.log('chromium.executablePath', chromium.executablePath());
    console.log('firefox.executablePath', firefox.executablePath());
    console.log('webkit.executablePath', webkit.executablePath());

    // const browser = await chromium.launch({
    //     headless: false,
    // });
    // const context = await browser.newContext();
    // const page = await context.newPage();
    // await page.goto('https://example.org/');
    // await new Promise((res) => setTimeout(res, 5_000));
    // await context.close();
    // await browser.close();

    const { close } = await launch({
        execPath: chromium.executablePath(),
        logDir: path.resolve(process.cwd(), './tmp'),
        onClose: () => {
            console.log('close');
        },
    });

    await new Promise((res) => setTimeout(res, 5_000));

    // $childProcess.stdin.end();
    // $childProcess.stdout.destroy();
    // $childProcess.stderr.destroy();
    // $childProcess.kill();

    console.log('kill');

    // await new Promise((res) => setTimeout(res, 5_000));
    // await close();

    console.log('exit');
})();
