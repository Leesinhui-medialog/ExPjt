/**
 * 게시글 상세보기 + 첨부파일 다운로드 테스트 캡처 스크립트.
 * 1. 로그인 → 게시글 작성(첨부파일 포함) → 목록에서 제목 클릭 → 상세 화면 캡처
 * 2. 첨부파일 다운로드 링크 클릭 → 다운로드 응답 확인 → 캡처
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'doc');
const FILE_PATH = 'C:\\작업\\아이콘\\mysql.png';
const DOWNLOAD_DIR = path.join(__dirname, '..', 'doc', 'downloads');

(async () => {
  let browser;
  try {
    /* 다운로드 폴더 생성 */
    if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
      defaultViewport: { width: 1280, height: 900 },
    });

    const page = await browser.newPage();

    /* 다운로드 경로 설정 */
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DOWNLOAD_DIR,
    });

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

    /* 2. 게시글 작성 (첨부파일 포함) */
    console.log('2. 게시글 작성 중...');
    await page.goto(BASE_URL + '/board/write', { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForSelector('#title', { timeout: 10000 });
    await page.type('#title', '상세보기 테스트 AI', { delay: 20 });
    const fileInput = await page.$('#file');
    await fileInput.uploadFile(FILE_PATH);
    await new Promise(r => setTimeout(r, 500));
    await page.type('#description', '상세보기 및 첨부파일 다운로드 테스트용 게시글입니다.', { delay: 10 });
    await page.click('button.btn-submit');
    await page.waitForFunction(() => window.location.pathname === '/board/list', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    console.log('게시글 작성 완료');

    /* 3. 목록에서 제목 클릭 → 상세 화면 이동 */
    console.log('3. 목록에서 제목 클릭...');
    /* 첫 번째 게시글 제목 링크 클릭 (가장 최근 게시글) */
    const firstTitleLink = await page.$('table tbody tr:first-child td:nth-child(3) a');
    if (!firstTitleLink) throw new Error('게시글 제목 링크를 찾을 수 없습니다.');
    await firstTitleLink.click();
    await page.waitForFunction(() => window.location.pathname.startsWith('/board/detail/'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 2000));

    /* 4. 상세 화면 캡처 */
    console.log('4. 상세 화면 캡처...');
    const detailPath = path.join(OUTPUT_DIR, '05_게시글상세화면.png');
    await page.screenshot({ path: detailPath, fullPage: true });
    console.log('상세 화면 캡처 완료:', detailPath);

    /* 5. 첨부파일 다운로드 클릭 */
    console.log('5. 첨부파일 다운로드 클릭...');
    const downloadLink = await page.$('span[style*="cursor: pointer"]');
    if (downloadLink) {
      await downloadLink.click();
      /* 다운로드 대기 */
      await new Promise(r => setTimeout(r, 3000));

      /* 다운로드된 파일 확인 */
      const files = fs.readdirSync(DOWNLOAD_DIR);
      console.log('다운로드된 파일:', files);

      /* 다운로드 후 상세 화면 캡처 (다운로드 완료 상태) */
      const downloadCapturePath = path.join(OUTPUT_DIR, '06_첨부파일다운로드.png');
      await page.screenshot({ path: downloadCapturePath, fullPage: true });
      console.log('첨부파일 다운로드 캡처 완료:', downloadCapturePath);
    } else {
      console.log('첨부파일 링크를 찾을 수 없습니다. 상세 화면만 캡처합니다.');
    }

    console.log('\n상세보기 테스트 캡처 완료!');
  } catch (err) {
    console.error('캡처 실패:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
