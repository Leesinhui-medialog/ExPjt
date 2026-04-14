package com.medialog.biz.memb;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
    @DisplayName("회원 상세 조회 API - 성공")
    void retrieveDetail_success() throws Exception {
        Member member = new Member();
        member.setMemberIndex(1);
        member.setMemberName("홍길동");
        member.setEmail("test@example.com");
        member.setTelephoneNumber("010-1234-5678");
        when(memberService.retrieveByEmail("test@example.com")).thenReturn(member);

        mockMvc.perform(get("/api/member/detail").param("email", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.memberName").value("홍길동"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("회원 상세 조회 API - 존재하지 않는 이메일")
    void retrieveDetail_notFound() throws Exception {
        when(memberService.retrieveByEmail("unknown@example.com")).thenReturn(null);

        mockMvc.perform(get("/api/member/detail").param("email", "unknown@example.com"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("회원 프로필 수정 API - 성공")
    void updateProfile_success() throws Exception {
        when(memberService.updateProfile(eq("test@example.com"), eq("홍길동"), eq("010-9999-8888"), any()))
                .thenReturn(Map.of("success", true));

        mockMvc.perform(put("/api/member/update-profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"memberName\":\"홍길동\",\"telephoneNumber\":\"010-9999-8888\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("회원 프로필 수정 API - 회원 없음")
    void updateProfile_notFound() throws Exception {
        when(memberService.updateProfile(eq("unknown@example.com"), eq("홍길동"), eq("010-9999-8888"), any()))
                .thenReturn(Map.of("success", false, "message", "회원 정보를 찾을 수 없습니다."));

        mockMvc.perform(put("/api/member/update-profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"unknown@example.com\",\"memberName\":\"홍길동\",\"telephoneNumber\":\"010-9999-8888\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("회원 정보를 찾을 수 없습니다."));
    }

    @Test
    @DisplayName("비밀번호 변경 API - 성공")
    void changePassword_success() throws Exception {
        when(memberService.changePassword("test@example.com", "oldPass", "newPass"))
                .thenReturn(Map.of("success", true));

        mockMvc.perform(put("/api/member/change-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"currentPassword\":\"oldPass\",\"newPassword\":\"newPass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("비밀번호 변경 API - 현재 비밀번호 불일치")
    void changePassword_wrongCurrentPassword() throws Exception {
        when(memberService.changePassword("test@example.com", "wrongPass", "newPass"))
                .thenReturn(Map.of("success", false, "message", "현재 비밀번호가 일치하지 않습니다."));

        mockMvc.perform(put("/api/member/change-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"currentPassword\":\"wrongPass\",\"newPassword\":\"newPass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("현재 비밀번호가 일치하지 않습니다."));
    }

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
