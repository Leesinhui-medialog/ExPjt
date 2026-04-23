/**
 * 골프장 화면 테스트 캡처 스크립트.
 * 1. 로그인 → 골프장 화면 이동 → 전체 목록 캡처
 * 2. 골프장 검색 → 검색 결과 캡처
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

    /* 1. 로그인 */
    console.log('1. 로그인 중...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('#email', { timeout: 10000 });
    await page.type('#email', 'admin@medialog.co.kr', { delay: 30 });
    await page.type('#password', 'admin123', { delay: 30 });
    await page.click('button[type="button"]');
    await page.waitForFunction(() => window.location.pathname === '/board/list', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    console.log('로그인 성공');

    /* 2. 골프장 화면으로 이동 */
    console.log('2. 골프장 화면 이동 중...');
    await page.goto(BASE_URL + '/location/display', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000)); /* 지도 + 골프장 데이터 로딩 대기 */

    /* 3. 골프장 전체 화면 캡처 */
    console.log('3. 골프장 전체 화면 캡처...');
    const fullPath = path.join(OUTPUT_DIR, '07_골프장화면.png');
    await page.screenshot({ path: fullPath, fullPage: false });
    console.log('골프장 화면 캡처 완료:', fullPath);

    /* 4. 골프장 검색 */
    console.log('4. 골프장 검색 중...');
    const searchInput = await page.$('input[placeholder*="골프장"]');
    if (searchInput) {
      /* 기존 텍스트 클리어 후 검색어 입력 */
      await searchInput.click({ clickCount: 3 });
      await searchInput.type('남서울', { delay: 50 });
      await new Promise(r => setTimeout(r, 1500)); /* 디바운스 + API 응답 대기 */

      /* 5. 검색 결과 캡처 */
      console.log('5. 검색 결과 캡처...');
      const searchPath = path.join(OUTPUT_DIR, '08_골프장검색결과.png');
      await page.screenshot({ path: searchPath, fullPage: false });
      console.log('검색 결과 캡처 완료:', searchPath);
    } else {
      console.log('검색 입력 필드를 찾을 수 없습니다.');
    }

    console.log('\n골프장 테스트 캡처 완료!');
  } catch (err) {
    console.error('캡처 실패:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
