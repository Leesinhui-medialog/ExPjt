package com.medialog.biz.memb;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 회원 컨트롤러 단위 테스트.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 90, Total Code Line : 90
 */
@WebMvcTest(MemberController.class)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MemberService memberService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("이메일 중복 확인 API - 중복 없음")
    void checkEmail_notExists() throws Exception {
        when(memberService.existsByEmail("new@example.com")).thenReturn(false);
        mockMvc.perform(get("/api/member/check-email").param("email", "new@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(false));
    }

    @Test
    @DisplayName("이메일 중복 확인 API - 중복 있음")
    void checkEmail_exists() throws Exception {
        when(memberService.existsByEmail("test@example.com")).thenReturn(true);
        mockMvc.perform(get("/api/member/check-email").param("email", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(true));
    }

    @Test
    @DisplayName("실명인증 API - 성공")
    void verifyIdentity_success() throws Exception {
        when(memberService.verifyIdentity("홍길동", "1990-01-01")).thenReturn(true);
        mockMvc.perform(post("/api/member/verify-identity")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"memberName\":\"홍길동\",\"birthDate\":\"1990-01-01\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(true));
    }

    @Test
    @DisplayName("회원 등록 API - 성공")
    void register_success() throws Exception {
        when(memberService.existsByEmail("new@example.com")).thenReturn(false);
        Member member = new Member();
        member.setMemberIndex(1);
        member.setMemberName("홍길동");
        member.setEmail("new@example.com");
        when(memberService.create(any(Member.class))).thenReturn(member);

        Member request = new Member();
        request.setMemberName("홍길동");
        request.setEmail("new@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/member/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.memberName").value("홍길동"));
    }

    @Test
    @DisplayName("회원 등록 API - 이메일 중복 시 실패")
    void register_duplicateEmail() throws Exception {
        when(memberService.existsByEmail("test@example.com")).thenReturn(true);

        Member request = new Member();
        request.setMemberName("홍길동");
        request.setEmail("test@example.com");

        mockMvc.perform(post("/api/member/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
