/**
 * 회원가입 단계별 캡처 스크립트.
 * Step1: 약관동의 → Step2: 실명인증 → Step3: 회원정보입력 → 가입완료
 */
const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'doc');

/** 팝업 내 확인 버튼을 찾아 클릭하는 헬퍼 */
async function closePopup(page) {
  await new Promise(r => setTimeout(r, 1500));
  /* fixed overlay 내부의 버튼 클릭 */
  const closed = await page.evaluate(() => {
    const overlays = document.querySelectorAll('div[style]');
    for (const el of overlays) {
      if (el.style.position === 'fixed' && el.style.zIndex) {
        const btn = el.querySelector('button');
        if (btn) { btn.click(); return true; }
      }
    }
    return false;
  });
  if (!closed) {
    /* fallback: 모든 btn-submit 중 '확인' 텍스트 */
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.textContent.trim() === '확인') { b.click(); return; }
      }
    });
  }
  await new Promise(r => setTimeout(r, 1000));
}

/** 특정 텍스트를 가진 버튼 클릭 */
async function clickButtonByText(page, text) {
  await page.evaluate((t) => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.trim() === t && b.offsetParent !== null) {
        b.click(); return;
      }
    }
  }, text);
}

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

    /* 1. 회원가입 화면 접속 */
    console.log('1. 회원가입 화면 접속...');
    await page.goto(BASE_URL + '/member/register', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    /* Step 01: 약관동의 화면 캡처 */
    console.log('2. Step 01 약관동의 화면 캡처...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09_회원가입_Step01_약관동의.png'), fullPage: true });

    /* 약관 동의 체크 */
    console.log('3. 약관 동의 체크...');
    const checkboxes = await page.$$('input[type="checkbox"]');
    for (const cb of checkboxes) {
      await cb.click();
      await new Promise(r => setTimeout(r, 300));
    }
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10_회원가입_Step01_약관동의완료.png'), fullPage: true });

    /* 다음 버튼 클릭 → Step 02 */
    console.log('4. Step 02로 이동...');
    await clickButtonByText(page, '다음');
    await new Promise(r => setTimeout(r, 1000));

    /* Step 02: 실명확인 화면 캡처 */
    console.log('5. Step 02 실명확인 화면 캡처...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '11_회원가입_Step02_실명확인.png'), fullPage: true });

    /* 이름, 생년월일 입력 */
    console.log('6. 실명인증 정보 입력...');
    await page.type('#memberName', '테스트회원', { delay: 30 });
    /* date input은 value를 직접 설정 */
    await page.evaluate(() => {
      const input = document.querySelector('#birthDate');
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, '1995-06-15');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await new Promise(r => setTimeout(r, 500));

    /* 실명인증 버튼 클릭 */
    console.log('  실명인증 버튼 클릭...');
    await clickButtonByText(page, '실명인증');
    
    /* 팝업 닫기 */
    console.log('  팝업 닫기...');
    await closePopup(page);

    /* 인증 완료 확인 대기 */
    await page.waitForFunction(
      () => {
        const p = document.querySelector('p');
        return p && p.textContent.includes('실명인증이 완료');
      },
      { timeout: 5000 }
    ).catch(() => console.log('  인증 완료 텍스트 미발견, 계속 진행'));

    await page.screenshot({ path: path.join(OUTPUT_DIR, '12_회원가입_Step02_실명인증완료.png'), fullPage: true });

    /* 다음 버튼 클릭 → Step 03 */
    console.log('7. Step 03으로 이동...');
    await clickButtonByText(page, '다음');
    await new Promise(r => setTimeout(r, 1000));

    /* 팝업이 뜨면 닫기 (실명인증 미완료 경고) */
    const hasPopup = await page.evaluate(() => {
      const overlays = document.querySelectorAll('div[style]');
      for (const el of overlays) {
        if (el.style.position === 'fixed' && el.style.zIndex) return true;
      }
      return false;
    });
    if (hasPopup) {
      console.log('  경고 팝업 발견, 닫기...');
      await closePopup(page);
      /* 실명인증 재시도 */
      console.log('  실명인증 재시도...');
      await clickButtonByText(page, '실명인증');
      await closePopup(page);
      await new Promise(r => setTimeout(r, 1000));
      await clickButtonByText(page, '다음');
      await new Promise(r => setTimeout(r, 1500));
    }

    /* Step 03 도달 확인 */
    const step3Check = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      return h2 ? h2.textContent : '';
    });
    console.log('  현재 스텝:', step3Check);

    /* Step 03: 회원정보입력 화면 캡처 */
    console.log('8. Step 03 회원정보입력 화면 캡처...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '13_회원가입_Step03_회원정보입력.png'), fullPage: true });

    /* 회원정보 입력 */
    console.log('9. 회원정보 입력...');
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.type('testai@medialog.co.kr', { delay: 20 });
    } else {
      /* id로 시도 */
      await page.evaluate(() => {
        const inputs = document.querySelectorAll('input:not([disabled])');
        for (const inp of inputs) {
          if (inp.placeholder && inp.placeholder.includes('이메일')) {
            inp.focus();
          }
        }
      });
      await page.keyboard.type('testai@medialog.co.kr');
    }

    const telInput = await page.$('input[type="tel"]');
    if (telInput) await telInput.type('010-9876-5432', { delay: 20 });

    const pwdInputs = await page.$$('input[type="password"]');
    if (pwdInputs.length >= 2) {
      await pwdInputs[0].type('test1234', { delay: 20 });
      await pwdInputs[1].type('test1234', { delay: 20 });
    }
    await new Promise(r => setTimeout(r, 500));

    /* 정보 입력 완료 후 캡처 */
    await page.screenshot({ path: path.join(OUTPUT_DIR, '14_회원가입_Step03_정보입력완료.png'), fullPage: true });

    /* 가입완료 버튼 클릭 */
    console.log('10. 가입완료 버튼 클릭...');
    await clickButtonByText(page, '가입완료');
    await new Promise(r => setTimeout(r, 2000));

    /* 가입완료 팝업 캡처 */
    await page.screenshot({ path: path.join(OUTPUT_DIR, '15_회원가입_완료팝업.png'), fullPage: true });

    console.log('\n회원가입 테스트 캡처 완료!');
  } catch (err) {
    console.error('캡처 실패:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
