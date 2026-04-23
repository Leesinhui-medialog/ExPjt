/**
 * 게시글 작성 테스트 캡처 스크립트.
 * 로그인 → 글쓰기 이동 → 제목/내용/첨부파일 입력 → 저장 전 캡처 → 저장 → 결과 캡처
 */
const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'doc');
const FILE_PATH = 'C:\\작업\\아이콘\\mysql.png';

const TITLE = '게시물 작성 테스트 AI';
const CONTENT = '게시물 작성 테스트 AI게시물 작성 테스트 AI게시물 작성 테스트 AI게시물 작성 테스트 AI게시물 작성 테스트 AI';

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

    /* 게시판 목록으로 이동 대기 */
    await page.waitForFunction(
      () => window.location.pathname === '/board/list',
      { timeout: 15000 }
    );
    await new Promise(r => setTimeout(r, 2000));
    console.log('로그인 성공, 게시판 목록 도착');

    /* 2. 글쓰기 페이지로 이동 */
    console.log('2. 글쓰기 페이지 이동 중...');
    await page.goto(BASE_URL + '/board/write', { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForSelector('#title', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));

    /* 3. 제목 입력 */
    console.log('3. 제목 입력 중...');
    await page.type('#title', TITLE, { delay: 20 });

    /* 4. 첨부파일 업로드 */
    console.log('4. 첨부파일 업로드 중...');
    const fileInput = await page.$('#file');
    await fileInput.uploadFile(FILE_PATH);
    await new Promise(r => setTimeout(r, 500));

    /* 5. 내용 입력 */
    console.log('5. 내용 입력 중...');
    await page.type('#description', CONTENT, { delay: 10 });
    await new Promise(r => setTimeout(r, 1000));

    /* 6. 저장 전 화면 캡처 */
    console.log('6. 저장 전 화면 캡처...');
    const beforePath = path.join(OUTPUT_DIR, '03_게시글작성_저장전.png');
    await page.screenshot({ path: beforePath, fullPage: true });
    console.log('저장 전 캡처 완료:', beforePath);

    /* 7. 저장 (등록 버튼 클릭) */
    console.log('7. 저장 버튼 클릭...');
    await page.click('button.btn-submit');

    /* 게시판 목록으로 이동 대기 */
    await page.waitForFunction(
      () => window.location.pathname === '/board/list',
      { timeout: 15000 }
    );
    await new Promise(r => setTimeout(r, 2000));

    /* 8. 저장 결과 화면 캡처 */
    console.log('8. 저장 결과 화면 캡처...');
    const afterPath = path.join(OUTPUT_DIR, '04_게시글작성_저장결과.png');
    await page.screenshot({ path: afterPath, fullPage: true });
    console.log('저장 결과 캡처 완료:', afterPath);

    console.log('\n게시글 작성 테스트 캡처 완료!');
  } catch (err) {
    console.error('캡처 실패:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
