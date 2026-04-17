package com.medialog.biz.golf;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * 골프장 서비스 단위 테스트.
 * JSON 로드, 전체 목록 조회, 키워드 검색 필터링 로직을 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 130, Total Code Line : 130
 */
class GolfCourseServiceTest {

    private GolfCourseService golfCourseService;

    /** 테스트용 골프장 데이터를 직접 주입하여 서비스를 초기화한다 */
    @BeforeEach
    void setUp() {
        golfCourseService = new GolfCourseService(new ObjectMapper());

        /* JSON 파일 대신 테스트 데이터를 직접 로드 — loadGolfCourses 호출 시 파일 없으면 빈 리스트 */
        golfCourseService.loadGolfCourses();
    }

    /**
     * 테스트용 골프장 데이터를 서비스에 주입하는 헬퍼 메서드.
     */
    private void injectTestData() {
        GolfCourse course1 = new GolfCourse();
        course1.setName("남서울CC");
        course1.setLatitude(37.3456);
        course1.setLongitude(127.1234);
        course1.setAddress("경기도 성남시 분당구");
        course1.setRegion("경기");
        course1.setType("회원제");

        GolfCourse course2 = new GolfCourse();
        course2.setName("블루원리조트CC");
        course2.setLatitude(35.8765);
        course2.setLongitude(128.6543);
        course2.setAddress("경북 경주시");
        course2.setRegion("경북");
        course2.setType("퍼블릭");

        GolfCourse course3 = new GolfCourse();
        course3.setName("제주오라CC");
        course3.setLatitude(33.4567);
        course3.setLongitude(126.5678);
        course3.setAddress("제주특별자치도 제주시");
        course3.setRegion("제주");
        course3.setType("회원제+퍼블릭");

        /* ReflectionTestUtils 대신 retrieveAll 결과를 활용하여 데이터 주입 */
        List<GolfCourse> testData = List.of(course1, course2, course3);
        org.springframework.test.util.ReflectionTestUtils.setField(golfCourseService, "golfCourses", testData);
    }

    @Test
    @DisplayName("JSON 파일 미존재 시 빈 리스트로 초기화 검증")
    void loadGolfCourses_fileNotFound_returnsEmptyList() {
        /* setUp에서 이미 loadGolfCourses 호출됨 — 파일 없으므로 빈 리스트 */
        List<GolfCourse> result = golfCourseService.retrieveAll();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("전체 골프장 목록 조회 검증")
    void retrieveAll_returnsAllCourses() {
        // given
        injectTestData();

        // when
        List<GolfCourse> result = golfCourseService.retrieveAll();

        // then
        assertEquals(3, result.size());
    }

    @Test
    @DisplayName("키워드 null 입력 시 전체 목록 반환 검증")
    void searchByKeyword_nullKeyword_returnsAll() {
        // given
        injectTestData();

        // when
        List<GolfCourse> result = golfCourseService.searchByKeyword(null);

        // then
        assertEquals(3, result.size());
    }

    @Test
    @DisplayName("키워드 빈 문자열 입력 시 전체 목록 반환 검증")
    void searchByKeyword_emptyKeyword_returnsAll() {
        // given
        injectTestData();

        // when
        List<GolfCourse> result = golfCourseService.searchByKeyword("");

        // then
        assertEquals(3, result.size());
    }

    @Test
    @DisplayName("키워드 공백 문자열 입력 시 전체 목록 반환 검증")
    void searchByKeyword_blankKeyword_returnsAll() {
        // given
        injectTestData();

        // when
        List<GolfCourse> result = golfCourseService.searchByKeyword("   ");

        // then
        assertEquals(3, result.size());
    }

    @Test
    @DisplayName("골프장 이름으로 키워드 검색 검증")
    void searchByKeyword_matchByName() {
        // given
        injectTestData();

        // when
        List<GolfCourse> result = golfCourseService.searchByKeyword("남서울");

        // then
        assertEquals(1, result.size());
        assertEquals("남서울CC", result.get(0).getName());
    }

    @Test
    @DisplayName("지역으로 키워드 검색 검증")
    void searchByKeyword_matchByRegion() {
        // given
        injectTestData();

        // when
        List<GolfCourse> result = golfCourseService.searchByKeyword("제주");

        // then
        assertEquals(1, result.size());
        assertEquals("제주오라CC", result.get(0).getName());
    }

    @Test
    @DisplayName("대소문자 무시 검색 검증")
    void searchByKeyword_caseInsensitive() {
        // given
        injectTestData();

        // when
        List<GolfCourse> result = golfCourseService.searchByKeyword("cc");

        // then — 모든 골프장 이름에 CC가 포함되어 있으므로 전체 반환
        assertEquals(3, result.size());
    }

    @Test
    @DisplayName("매칭 결과 없는 키워드 검색 검증")
    void searchByKeyword_noMatch() {
        // given
        injectTestData();

        // when
        List<GolfCourse> result = golfCourseService.searchByKeyword("존재하지않는골프장");

        // then
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("경기 지역 키워드로 복수 결과 검색 검증")
    void searchByKeyword_matchByRegionPrefix() {
        // given
        injectTestData();

        // when — "경" 키워드로 검색 시 경기, 경북 모두 매칭
        List<GolfCourse> result = golfCourseService.searchByKeyword("경");

        // then
        assertEquals(2, result.size());
    }
}
