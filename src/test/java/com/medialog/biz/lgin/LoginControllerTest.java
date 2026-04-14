package com.medialog.biz.lgin;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 로그인 컨트롤러 단위 테스트.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 150, Total Code Line : 150
 */
@WebMvcTest(LoginController.class)
class LoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LoginService loginService;

    @Test
    @DisplayName("로그인 API - 성공 시 세션에 회원 정보 저장")
    void login_success() throws Exception {
        /* 로그인 성공 응답 설정 */
        when(loginService.authenticate("test@example.com", "password123"))
                .thenReturn(Map.of("success", true, "memberName", "홍길동"));

        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(post("/api/login")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.memberName").value("홍길동"));

        /* 세션에 회원 정보가 저장되었는지 검증 */
        assertThat(session.getAttribute("loginEmail")).isEqualTo("test@example.com");
        assertThat(session.getAttribute("loginMemberName")).isEqualTo("홍길동");
    }

    @Test
    @DisplayName("로그인 API - 실패 시 세션에 정보 미저장")
    void login_fail() throws Exception {
        /* 로그인 실패 응답 설정 */
        when(loginService.authenticate("test@example.com", "wrong"))
                .thenReturn(Map.of("success", false, "message", "이메일 또는 비밀번호가 일치하지 않습니다."));

        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(post("/api/login")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));

        /* 세션에 회원 정보가 저장되지 않았는지 검증 */
        assertThat(session.getAttribute("loginEmail")).isNull();
    }

    @Test
    @DisplayName("로그인 상태 확인 API - 로그인 상태")
    void checkLogin_loggedIn() throws Exception {
        /* 세션에 로그인 정보가 있는 경우 */
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("loginEmail", "test@example.com");
        session.setAttribute("loginMemberName", "홍길동");

        mockMvc.perform(get("/api/login/check")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loggedIn").value(true))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.memberName").value("홍길동"));
    }

    @Test
    @DisplayName("로그인 상태 확인 API - 비로그인 상태")
    void checkLogin_notLoggedIn() throws Exception {
        /* 세션에 로그인 정보가 없는 경우 */
        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(get("/api/login/check")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loggedIn").value(false));
    }

    @Test
    @DisplayName("로그아웃 API - 세션 무효화")
    void logout_success() throws Exception {
        /* 로그인된 세션 준비 */
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("loginEmail", "test@example.com");
        session.setAttribute("loginMemberName", "홍길동");

        mockMvc.perform(post("/api/login/logout")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value("ok"));

        /* 세션이 무효화되었는지 검증 */
        assertThat(session.isInvalid()).isTrue();
    }

    @Test
    @DisplayName("비밀번호 찾기 API - 성공")
    void retrievePassword_success() throws Exception {
        when(loginService.retrievePassword("test@example.com"))
                .thenReturn(Map.of("success", true, "message", "임시비밀번호가 이메일로 발송되었습니다."));

        mockMvc.perform(post("/api/login/retrieve-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("임시비밀번호가 이메일로 발송되었습니다."));
    }

    @Test
    @DisplayName("비밀번호 찾기 API - 실패 (회원 없음)")
    void retrievePassword_failNotFound() throws Exception {
        when(loginService.retrievePassword("unknown@example.com"))
                .thenReturn(Map.of("success", false, "message", "회원 정보가 존재하지 않습니다."));

        mockMvc.perform(post("/api/login/retrieve-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"unknown@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("회원 정보가 존재하지 않습니다."));
    }
}
