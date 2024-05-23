import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        product: 'firefox',
        headless: false,
    });

    console.log(browser.browserContexts);

    const page = await browser.newPage();
    await page.goto('https://www.bannerbear.com');
    await page.screenshot({ path: 'example.png' });

    await browser.close();
})();
