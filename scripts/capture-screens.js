/**
 * 화면 캡처 스크립트.
 * puppeteer-core + 시스템 Chrome을 사용하여
 * 로그인 화면과 로그인 후 게시판 목록 화면을 캡처한다.
 */
const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'doc');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
      defaultViewport: { width: 1280, height: 900 },
    });

    const page = await browser.newPage();

    /* 1. 로그인 화면 캡처 */
    console.log('1. 로그인 화면 접속 중...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('#email', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));

    const loginScreenPath = path.join(OUTPUT_DIR, '01_로그인화면.png');
    await page.screenshot({ path: loginScreenPath, fullPage: false });
    console.log('로그인 화면 캡처 완료:', loginScreenPath);

    /* 2. 로그인 수행 */
    console.log('2. 로그인 수행 중...');
    await page.type('#email', 'admin@medialog.co.kr', { delay: 50 });
    await page.type('#password', 'admin123', { delay: 50 });
    await page.click('button[type="button"]');

    /* 게시판 목록 화면으로 이동 대기 */
    await page.waitForFunction(
      () => window.location.pathname === '/board/list',
      { timeout: 15000 }
    );
    await new Promise(r => setTimeout(r, 2000));

    const boardScreenPath = path.join(OUTPUT_DIR, '02_게시판목록화면.png');
    await page.screenshot({ path: boardScreenPath, fullPage: false });
    console.log('게시판 목록 화면 캡처 완료:', boardScreenPath);

    console.log('\n캡처 완료!');
  } catch (err) {
    console.error('캡처 실패:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
