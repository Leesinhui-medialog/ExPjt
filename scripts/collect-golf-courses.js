/**
 * 전국 골프장 데이터 수집 스크립트
 *
 * Kakao 로컬 API 키워드 검색을 사용하여 "골프장" 키워드로
 * 전국 골프장 데이터를 수집하고 JSON 파일로 저장한다.
 *
 * 사용법:
 *   KAKAO_REST_API_KEY=<카카오_REST_API_키> node scripts/collect-golf-courses.js
 *
 * 요구사항: 7.8, 7.9
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// 환경변수에서 Kakao REST API 키를 읽는다
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
if (!KAKAO_REST_API_KEY) {
  console.error("오류: KAKAO_REST_API_KEY 환경변수가 설정되지 않았습니다.");
  console.error(
    "사용법: KAKAO_REST_API_KEY=<키> node scripts/collect-golf-courses.js"
  );
  process.exit(1);
}

// Kakao 로컬 API 키워드 검색 엔드포인트
const KAKAO_API_HOST = "dapi.kakao.com";
const KAKAO_API_PATH = "/v2/local/search/keyword.json";
const SEARCH_KEYWORD = "골프장";
const PAGE_SIZE = 15; // 최대 15
const MAX_PAGE = 45; // Kakao API 최대 페이지

// 결과 저장 경로
const OUTPUT_DIR = path.join(
  __dirname,
  "..",
  "src",
  "main",
  "resources",
  "data"
);
const OUTPUT_FILE = path.join(OUTPUT_DIR, "golf-courses.json");

/**
 * Kakao 로컬 API 키워드 검색을 호출한다
 * @param {string} query - 검색 키워드
 * @param {number} page - 페이지 번호 (1~45)
 * @returns {Promise<object>} API 응답 JSON
 */
function searchKeyword(query, page) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      query,
      page: String(page),
      size: String(PAGE_SIZE),
    });

    const options = {
      hostname: KAKAO_API_HOST,
      path: `${KAKAO_API_PATH}?${params.toString()}`,
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `API 호출 실패: HTTP ${res.statusCode} - ${data}`
            )
          );
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON 파싱 실패: ${e.message}`));
        }
      });
    });

    req.on("error", (e) => {
      reject(new Error(`네트워크 오류: ${e.message}`));
    });

    req.end();
  });
}

/**
 * 골프장 유형을 분류한다
 * - 이름이나 카테고리에 "퍼블릭"이 포함되면 "퍼블릭"
 * - "회원제"가 포함되면 "회원제"
 * - 둘 다 포함되거나 판별 불가 시 "회원제+퍼블릭"
 * @param {string} placeName - 장소 이름
 * @param {string} categoryName - 카테고리 이름
 * @returns {string} 골프장 유형
 */
function classifyType(placeName, categoryName) {
  const combined = `${placeName} ${categoryName}`;
  const hasPublic = combined.includes("퍼블릭");
  const hasMember = combined.includes("회원제");

  if (hasPublic && hasMember) return "회원제+퍼블릭";
  if (hasPublic) return "퍼블릭";
  if (hasMember) return "회원제";
  return "회원제+퍼블릭"; // 판별 불가 시 기본값
}

/**
 * 주소에서 시/도 단위 지역명을 추출한다
 * @param {string} address - 전체 주소
 * @returns {string} 시/도 단위 지역명
 */
function extractRegion(address) {
  if (!address) return "기타";
  const parts = address.trim().split(" ");
  return parts.length > 0 ? parts[0] : "기타";
}

/**
 * API 호출 간 딜레이를 준다 (Rate Limit 방지)
 * @param {number} ms - 대기 시간(밀리초)
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 전국 골프장 데이터를 수집한다
 */
async function collectGolfCourses() {
  console.log("전국 골프장 데이터 수집을 시작합니다...");
  console.log(`검색 키워드: "${SEARCH_KEYWORD}"`);

  const allCourses = [];
  // 중복 제거를 위한 Set (장소 ID 기준)
  const seenIds = new Set();

  let page = 1;
  let isEnd = false;

  while (page <= MAX_PAGE && !isEnd) {
    try {
      console.log(`페이지 ${page} 조회 중...`);
      const result = await searchKeyword(SEARCH_KEYWORD, page);

      const { meta, documents } = result;

      if (!documents || documents.length === 0) {
        console.log("더 이상 결과가 없습니다.");
        break;
      }

      for (const doc of documents) {
        // 중복 제거
        if (seenIds.has(doc.id)) continue;
        seenIds.add(doc.id);

        const course = {
          name: doc.place_name,
          latitude: parseFloat(doc.y),
          longitude: parseFloat(doc.x),
          address: doc.road_address_name || doc.address_name,
          region: extractRegion(doc.address_name),
          type: classifyType(doc.place_name, doc.category_name || ""),
        };

        allCourses.push(course);
      }

      console.log(
        `  → ${documents.length}건 조회, 누적 ${allCourses.length}건`
      );

      // 마지막 페이지 여부 확인
      isEnd = meta.is_end;
      page++;

      // API Rate Limit 방지를 위한 딜레이 (200ms)
      await delay(200);
    } catch (error) {
      console.error(`페이지 ${page} 조회 중 오류 발생: ${error.message}`);
      // 오류 발생 시 다음 페이지로 계속 진행
      page++;
      await delay(500);
    }
  }

  console.log(`\n수집 완료: 총 ${allCourses.length}개 골프장`);
  return allCourses;
}

/**
 * 수집한 데이터를 JSON 파일로 저장한다
 * @param {Array} courses - 골프장 데이터 배열
 */
function saveToFile(courses) {
  // 출력 디렉토리가 없으면 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`디렉토리 생성: ${OUTPUT_DIR}`);
  }

  const jsonContent = JSON.stringify(courses, null, 2);
  fs.writeFileSync(OUTPUT_FILE, jsonContent, "utf-8");
  console.log(`파일 저장 완료: ${OUTPUT_FILE}`);
  console.log(`저장된 골프장 수: ${courses.length}개`);
}

// 메인 실행
(async () => {
  try {
    const courses = await collectGolfCourses();

    if (courses.length === 0) {
      console.warn("경고: 수집된 골프장 데이터가 없습니다.");
    }

    saveToFile(courses);
    console.log("\n골프장 데이터 수집이 완료되었습니다.");
  } catch (error) {
    console.error(`치명적 오류: ${error.message}`);
    process.exit(1);
  }
})();
