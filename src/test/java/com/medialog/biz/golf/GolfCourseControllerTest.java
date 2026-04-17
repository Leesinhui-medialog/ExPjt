package com.medialog.biz.golf;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 골프장 컨트롤러 단위 테스트.
 * 전체 목록 조회, 키워드 검색, 세션 인증 검증을 수행한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 130, Total Code Line : 130
 */
@WebMvcTest(GolfCourseController.class)
class GolfCourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GolfCourseService golfCourseService;

    /**
     * 테스트용 골프장 데이터를 생성한다.
     *
     * @return 골프장 목록
     */
    private List<GolfCourse> createSampleGolfCourses() {
        GolfCourse course1 = new GolfCourse();
        course1.setName("남서울컨트리클럽");
        course1.setLatitude(37.3);
        course1.setLongitude(127.0);
        course1.setAddress("경기도 성남시");
        course1.setRegion("경기");
        course1.setType("회원제");

        GolfCourse course2 = new GolfCourse();
        course2.setName("파인크리크골프클럽");
        course2.setLatitude(36.8);
        course2.setLongitude(127.1);
        course2.setAddress("충남 아산시");
        course2.setRegion("충남");
        course2.setType("퍼블릭");

        return List.of(course1, course2);
    }

    /**
     * 로그인된 세션을 생성한다.
     *
     * @return 로그인 정보가 설정된 MockHttpSession
     */
    private MockHttpSession createAuthenticatedSession() {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("loginEmail", "test@example.com");
        session.setAttribute("loginMemberName", "홍길동");
        return session;
    }

    @Test
    @DisplayName("전체 골프장 목록 조회 — 인증된 사용자")
    void retrieveAll_authenticated() throws Exception {
        /* 서비스 응답 설정 */
        when(golfCourseService.retrieveAll()).thenReturn(createSampleGolfCourses());

        mockMvc.perform(get("/api/golf-courses")
                        .session(createAuthenticatedSession()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("남서울컨트리클럽"))
                .andExpect(jsonPath("$[1].name").value("파인크리크골프클럽"));
    }

    @Test
    @DisplayName("전체 골프장 목록 조회 — 미인증 시 401 반환")
    void retrieveAll_unauthenticated() throws Exception {
        mockMvc.perform(get("/api/golf-courses"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("키워드 검색 — 인증된 사용자, 결과 있음")
    void searchByKeyword_authenticated_withResults() throws Exception {
        GolfCourse course = new GolfCourse();
        course.setName("남서울컨트리클럽");
        course.setLatitude(37.3);
        course.setLongitude(127.0);
        course.setAddress("경기도 성남시");
        course.setRegion("경기");
        course.setType("회원제");

        when(golfCourseService.searchByKeyword("남서울")).thenReturn(List.of(course));

        mockMvc.perform(get("/api/golf-courses/search")
                        .param("keyword", "남서울")
                        .session(createAuthenticatedSession()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("남서울컨트리클럽"));
    }

    @Test
    @DisplayName("키워드 검색 — 미인증 시 401 반환")
    void searchByKeyword_unauthenticated() throws Exception {
        mockMvc.perform(get("/api/golf-courses/search")
                        .param("keyword", "골프"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("키워드 검색 — 키워드 미입력 시 전체 목록 반환")
    void searchByKeyword_emptyKeyword() throws Exception {
        when(golfCourseService.searchByKeyword(null)).thenReturn(createSampleGolfCourses());

        mockMvc.perform(get("/api/golf-courses/search")
                        .session(createAuthenticatedSession()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
