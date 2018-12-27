const tserver = require('express')();
const puppeteer = require('puppeteer');

const port = 3030;

tserver.get('/', (request, response) => {
    
    let targetURL = request.query.url;
    if (!/^http(s?):\/\//.test(targetURL)) {
        targetURL = 'http://' + request.query.url;
    }
    
    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--proxy-server="direct://"',
                '--proxy-bypass-list=*',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({width: 1200, height: 630});
        try {
            await page.goto(targetURL, {waitUntil: ['networkidle0']});
        } catch (e) {
            console.log(e);
        } finally {
            const data = await page.screenshot();
            const buffer = Buffer.from(data, 'base64');
            response.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': buffer.length
            });
            response.end(buffer);
            await browser.close();
        }
    })();
    
});

tserver.listen(port, 'localhost', (e) => {
    if (e) {
        return console.log(e);
    }
    console.log(`server is listening on ${port}`);
});
