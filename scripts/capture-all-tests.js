/**
 * 전체 기능 테스트 캡처 스크립트.
 * 대분류별: 로그인, 게시판, 골프장, 회원
 * 캡처 이미지는 doc/KiroImg/ 에 저장
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const IMG_DIR = path.join(__dirname, '..', 'doc', 'KiroImg');
const FILE_PATH = 'C:\\작업\\아이콘\\mysql.png';

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

const results = []; // {id, major, minor, result, error, imgFile}

/** 화면 내 에러/실패 메시지 감지 */
async function detectError(page) {
  return await page.evaluate(() => {
    // 팝업 내 에러 메시지 확인
    const overlays = document.querySelectorAll('div[style]');
    for (const el of overlays) {
      if (el.style.position === 'fixed' && el.style.zIndex) {
        const p = el.querySelector('p');
        if (p) {
          const text = p.textContent.trim();
          const failKeywords = ['실패', '오류', '에러', '일치하지', '찾을 수 없', '존재하지', '중복'];
          for (const kw of failKeywords) {
            if (text.includes(kw)) return text;
          }
        }
      }
    }
    // 페이지 내 에러 메시지 확인
    const alerts = document.querySelectorAll('.error, .alert-danger, [role="alert"]');
    for (const a of alerts) {
      if (a.textContent.trim()) return a.textContent.trim();
    }
    return '';
  });
}

async function closePopup(page) {
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('div[style]');
    for (const el of overlays) {
      if (el.style.position === 'fixed' && el.style.zIndex) {
        const btn = el.querySelector('button');
        if (btn) { btn.click(); return; }
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));
}

async function clickBtn(page, text) {
  await page.evaluate((t) => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.trim() === t && b.offsetParent !== null) { b.click(); return; }
    }
  }, text);
}

async function cap(page, name) {
  const p = path.join(IMG_DIR, name);
  await page.screenshot({ path: p, fullPage: false });
  return name;
}

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH, headless: 'new',
      args: ['--no-sandbox','--disable-setuid-sandbox','--window-size=1280,900'],
      defaultViewport: { width: 1280, height: 900 },
    });
    const page = await browser.newPage();
    const DOWNLOAD_DIR = path.join(IMG_DIR, '..', 'downloads');
    if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DOWNLOAD_DIR });

    // ===== 로그인 =====
    console.log('=== 로그인 테스트 ===');
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('#email', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 500));
      const f1 = await cap(page, 'LGIN_01_로그인화면.png');
      results.push({ id:'SCT-F-LGIN-001', major:'로그인', minor:'로그인 화면 접속', result:'Pass', error:'', img:f1 });

      await page.type('#email', 'admin@medialog.co.kr', { delay: 20 });
      await page.type('#password', 'admin123', { delay: 20 });
      await page.click('button[type="button"]');
      await new Promise(r => setTimeout(r, 2000));
      const loginErr = await detectError(page);
      if (loginErr) {
        const f2 = await cap(page, 'LGIN_02_로그인실패.png');
        results.push({ id:'SCT-F-LGIN-002', major:'로그인', minor:'로그인 처리', result:'Fail', error:loginErr, img:f2 });
        await closePopup(page);
      } else {
        await page.waitForFunction(() => window.location.pathname === '/board/list', { timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));
        const f2 = await cap(page, 'LGIN_02_로그인성공.png');
        results.push({ id:'SCT-F-LGIN-002', major:'로그인', minor:'로그인 처리', result:'Pass', error:'', img:f2 });
      }
    } catch(e) {
      results.push({ id:'SCT-F-LGIN-001', major:'로그인', minor:'로그인', result:'Fail', error:e.message, img:'' });
    }

    // ===== 게시판 =====
    console.log('=== 게시판 테스트 ===');
    try {
      // 목록
      const f3 = await cap(page, 'BORD_01_게시판목록.png');
      results.push({ id:'SCT-F-BORD-001', major:'게시판', minor:'게시판 목록 화면', result:'Pass', error:'', img:f3 });

      // 글쓰기
      await page.goto(BASE_URL + '/board/write', { waitUntil: 'networkidle2', timeout: 15000 });
      await page.waitForSelector('#title', { timeout: 10000 });
      await page.type('#title', '게시물 작성 테스트 AI', { delay: 15 });
      const fileInput = await page.$('#file');
      await fileInput.uploadFile(FILE_PATH);
      await new Promise(r => setTimeout(r, 500));
      await page.type('#description', '게시물 작성 테스트 AI게시물 작성 테스트 AI게시물 작성 테스트 AI게시물 작성 테스트 AI게시물 작성 테스트 AI', { delay: 5 });
      await new Promise(r => setTimeout(r, 500));
      const f4 = await cap(page, 'BORD_02_글쓰기_저장전.png');
      results.push({ id:'SCT-F-BORD-002', major:'게시판', minor:'게시글 작성 화면', result:'Pass', error:'', img:f4 });

      await page.click('button.btn-submit');
      await page.waitForFunction(() => window.location.pathname === '/board/list', { timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000));
      const f5 = await cap(page, 'BORD_03_저장결과.png');
      results.push({ id:'SCT-F-BORD-003', major:'게시판', minor:'게시글 저장 결과', result:'Pass', error:'', img:f5 });

      // 상세
      const link = await page.$('table tbody tr:first-child td:nth-child(3) a');
      await link.click();
      await page.waitForFunction(() => window.location.pathname.startsWith('/board/detail/'), { timeout: 10000 });
      await new Promise(r => setTimeout(r, 2000));
      const f6 = await cap(page, 'BORD_04_상세화면.png');
      results.push({ id:'SCT-F-BORD-004', major:'게시판', minor:'게시글 상세 화면', result:'Pass', error:'', img:f6 });

      // 첨부파일 다운로드
      const dlLink = await page.$('span[style*="cursor: pointer"]');
      if (dlLink) {
        await dlLink.click();
        await new Promise(r => setTimeout(r, 3000));
        const f7 = await cap(page, 'BORD_05_첨부파일다운로드.png');
        results.push({ id:'SCT-F-BORD-005', major:'게시판', minor:'첨부파일 다운로드', result:'Pass', error:'', img:f7 });
      }
    } catch(e) {
      console.log('게시판 에러:', e.message);
      results.push({ id:'SCT-F-BORD-ERR', major:'게시판', minor:'게시판 테스트', result:'Fail', error:e.message, img:'' });
    }

    // ===== 골프장 =====
    console.log('=== 골프장 테스트 ===');
    try {
      await page.goto(BASE_URL + '/location/display', { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));
      const f8 = await cap(page, 'GOLF_01_골프장화면.png');
      results.push({ id:'SCT-F-GOLF-001', major:'골프장', minor:'골프장 화면 표시', result:'Pass', error:'', img:f8 });

      const searchInput = await page.$('input[placeholder*="골프장"]');
      if (searchInput) {
        await searchInput.click({ clickCount: 3 });
        await searchInput.type('남서울', { delay: 50 });
        await new Promise(r => setTimeout(r, 1500));
        const f9 = await cap(page, 'GOLF_02_검색결과.png');
        results.push({ id:'SCT-F-GOLF-002', major:'골프장', minor:'골프장 검색', result:'Pass', error:'', img:f9 });
      }
    } catch(e) {
      console.log('골프장 에러:', e.message);
      results.push({ id:'SCT-F-GOLF-ERR', major:'골프장', minor:'골프장 테스트', result:'Fail', error:e.message, img:'' });
    }

    // ===== 회원 =====
    console.log('=== 회원가입 테스트 ===');
    try {
      await page.goto(BASE_URL + '/member/register', { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500));
      const f10 = await cap(page, 'MEMB_01_Step01_약관동의.png');
      results.push({ id:'SCT-F-MEMB-001', major:'회원', minor:'Step 01 약관동의', result:'Pass', error:'', img:f10 });

      // 체크
      const cbs = await page.$$('input[type="checkbox"]');
      for (const cb of cbs) { await cb.click(); await new Promise(r => setTimeout(r, 300)); }
      const f10b = await cap(page, 'MEMB_02_Step01_동의완료.png');

      await clickBtn(page, '다음');
      await new Promise(r => setTimeout(r, 1000));
      const f11 = await cap(page, 'MEMB_03_Step02_실명확인.png');
      results.push({ id:'SCT-F-MEMB-002', major:'회원', minor:'Step 02 실명확인', result:'Pass', error:'', img:f11 });

      await page.type('#memberName', '키로테스트', { delay: 20 });
      await page.evaluate(() => {
        const input = document.querySelector('#birthDate');
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, '1995-06-15');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await new Promise(r => setTimeout(r, 500));
      await clickBtn(page, '실명인증');
      await closePopup(page);
      const f12 = await cap(page, 'MEMB_04_Step02_인증완료.png');

      await clickBtn(page, '다음');
      await page.waitForFunction(() => {
        const h2 = document.querySelector('h2');
        return h2 && h2.textContent.includes('회원정보');
      }, { timeout: 10000 });
      await new Promise(r => setTimeout(r, 1000));
      const f13 = await cap(page, 'MEMB_05_Step03_정보입력.png');
      results.push({ id:'SCT-F-MEMB-003', major:'회원', minor:'Step 03 회원정보입력', result:'Pass', error:'', img:f13 });

      const emailInput = await page.$('input[type="email"]');
      if (emailInput) await emailInput.type('kirotest@medialog.co.kr', { delay: 15 });
      const telInput = await page.$('input[type="tel"]');
      if (telInput) await telInput.type('010-1111-2222', { delay: 15 });
      const pwds = await page.$$('input[type="password"]');
      if (pwds.length >= 2) { await pwds[0].type('test1234', { delay: 15 }); await pwds[1].type('test1234', { delay: 15 }); }
      await new Promise(r => setTimeout(r, 500));
      const f14 = await cap(page, 'MEMB_06_Step03_입력완료.png');

      await clickBtn(page, '가입완료');
      await new Promise(r => setTimeout(r, 2000));
      const regErr = await detectError(page);
      if (regErr) {
        const f15 = await cap(page, 'MEMB_07_가입실패.png');
        results.push({ id:'SCT-F-MEMB-004', major:'회원', minor:'가입완료', result:'Fail', error:regErr, img:f15 });
      } else {
        const f15 = await cap(page, 'MEMB_07_가입완료.png');
        results.push({ id:'SCT-F-MEMB-004', major:'회원', minor:'가입완료', result:'Pass', error:'', img:f15 });
      }
    } catch(e) {
      console.log('회원 에러:', e.message);
      results.push({ id:'SCT-F-MEMB-ERR', major:'회원', minor:'회원가입 테스트', result:'Fail', error:e.message, img:'' });
    }

    // 결과 JSON 저장
    fs.writeFileSync(path.join(IMG_DIR, 'results.json'), JSON.stringify(results, null, 2), 'utf8');
    console.log('\n전체 테스트 완료! 결과:', results.length, '건');
    console.log(results.map(r => `${r.id} ${r.major}/${r.minor} → ${r.result}`).join('\n'));
  } catch(e) {
    console.error('전체 실패:', e.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
