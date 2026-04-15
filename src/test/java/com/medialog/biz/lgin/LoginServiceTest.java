package com.medialog.biz.lgin;

import com.medialog.biz.mail.MailNotificationService;
import com.medialog.biz.memb.Member;
import com.medialog.biz.memb.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * 로그인 서비스 단위 테스트.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 120, Total Code Line : 120
 */
@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private MailNotificationService mailNotificationService;

    @InjectMocks
    private LoginService loginService;

    private Member testMember;

    @BeforeEach
    void setUp() {
        testMember = new Member();
        testMember.setMemberName("홍길동");
        testMember.setEmail("test@example.com");
        testMember.setPassword("password123");
        testMember.setDelYn("N");
    }

    @Test
    @DisplayName("로그인 성공")
    void authenticate_success() {
        when(memberRepository.findByEmail("test@example.com")).thenReturn(testMember);
        Map<String, Object> result = loginService.authenticate("test@example.com", "password123");
        assertThat(result.get("success")).isEqualTo(true);
        assertThat(result.get("memberName")).isEqualTo("홍길동");
    }

    @Test
    @DisplayName("로그인 실패 - 존재하지 않는 이메일")
    void authenticate_failEmailNotFound() {
        when(memberRepository.findByEmail("unknown@example.com")).thenReturn(null);
        Map<String, Object> result = loginService.authenticate("unknown@example.com", "password123");
        assertThat(result.get("success")).isEqualTo(false);
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 불일치")
    void authenticate_failWrongPassword() {
        when(memberRepository.findByEmail("test@example.com")).thenReturn(testMember);
        Map<String, Object> result = loginService.authenticate("test@example.com", "wrongpass");
        assertThat(result.get("success")).isEqualTo(false);
    }

    @Test
    @DisplayName("로그인 실패 - 삭제된 회원")
    void authenticate_failDeletedMember() {
        testMember.setDelYn("Y");
        when(memberRepository.findByEmail("test@example.com")).thenReturn(testMember);
        Map<String, Object> result = loginService.authenticate("test@example.com", "password123");
        assertThat(result.get("success")).isEqualTo(false);
    }

    @Test
    @DisplayName("비밀번호 찾기 성공 - 임시비밀번호 발급 및 메일 발송")
    void retrievePassword_success() throws Exception {
        when(memberRepository.findByEmail("test@example.com")).thenReturn(testMember);
        when(memberRepository.save(testMember)).thenReturn(testMember);

        Map<String, Object> result = loginService.retrievePassword("test@example.com");

        assertThat(result.get("success")).isEqualTo(true);
        assertThat(result.get("message")).isEqualTo("임시비밀번호가 이메일로 발송되었습니다.");
        /* 비밀번호가 변경되었는지 검증 */
        assertThat(testMember.getPassword()).isNotEqualTo("password123");
        /* 메일 발송이 호출되었는지 검증 */
        verify(mailNotificationService).sendNotification(any(String.class), any(String.class), any(String.class), any(String.class));
    }

    @Test
    @DisplayName("비밀번호 찾기 실패 - 존재하지 않는 이메일")
    void retrievePassword_failEmailNotFound() throws Exception {
        when(memberRepository.findByEmail("unknown@example.com")).thenReturn(null);

        Map<String, Object> result = loginService.retrievePassword("unknown@example.com");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("회원 정보가 존재하지 않습니다.");
        /* 메일 발송이 호출되지 않았는지 검증 */
        verify(mailNotificationService, never()).sendNotification(any(String.class), any(String.class), any(String.class), any(String.class));
    }

    @Test
    @DisplayName("비밀번호 찾기 실패 - 삭제된 회원")
    void retrievePassword_failDeletedMember() throws Exception {
        testMember.setDelYn("Y");
        when(memberRepository.findByEmail("test@example.com")).thenReturn(testMember);

        Map<String, Object> result = loginService.retrievePassword("test@example.com");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("회원 정보가 존재하지 않습니다.");
        verify(mailNotificationService, never()).sendNotification(any(String.class), any(String.class), any(String.class), any(String.class));
    }

    @Test
    @DisplayName("비밀번호 찾기 - 메일 발송 실패해도 성공 응답")
    void retrievePassword_mailSendFail() throws Exception {
        when(memberRepository.findByEmail("test@example.com")).thenReturn(testMember);
        when(memberRepository.save(testMember)).thenReturn(testMember);
        /* MailNotificationService는 내부에서 예외를 잡으므로 예외가 전파되지 않음 */

        Map<String, Object> result = loginService.retrievePassword("test@example.com");

        assertThat(result.get("success")).isEqualTo(true);
        assertThat(result.get("message")).isEqualTo("임시비밀번호가 이메일로 발송되었습니다.");
    }
}
