const puppeteer = require('puppeteer');
(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log('Going to login page...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  
  console.log('Typing credentials...');
  await page.type('input[type="email"]', 'admin@medioptima.com');
  await page.type('input[type="password"]', 'Admin@12345');
  
  console.log('Clicking login...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('button[type="submit"]')
  ]);
  
  console.log('Current URL:', page.url());
  const h1 = await page.$eval('h1', el => el.textContent).catch(() => 'no h1');
  console.log('Page H1:', h1);
  
  await browser.close();
  console.log('Test complete!');
})().catch(console.error);
