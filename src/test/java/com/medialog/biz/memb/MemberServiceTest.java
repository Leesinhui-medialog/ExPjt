package com.medialog.biz.memb;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * 회원 서비스 단위 테스트.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 85, Total Code Line : 85
 */
@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private MemberService memberService;

    private Member testMember;

    @BeforeEach
    void setUp() {
        testMember = new Member();
        testMember.setMemberName("홍길동");
        testMember.setBirthDate("1990-01-01");
        testMember.setEmail("test@example.com");
        testMember.setTelephoneNumber("010-1234-5678");
        testMember.setPassword("password123");
    }

    @Test
    @DisplayName("이메일 중복 확인 - 존재하는 이메일")
    void existsByEmail_exists() {
        when(memberRepository.existsByEmail("test@example.com")).thenReturn(true);
        assertThat(memberService.existsByEmail("test@example.com")).isTrue();
    }

    @Test
    @DisplayName("이메일 중복 확인 - 존재하지 않는 이메일")
    void existsByEmail_notExists() {
        when(memberRepository.existsByEmail("new@example.com")).thenReturn(false);
        assertThat(memberService.existsByEmail("new@example.com")).isFalse();
    }

    @Test
    @DisplayName("실명인증 - 성공")
    void verifyIdentity_success() {
        boolean result = memberService.verifyIdentity("홍길동", "1990-01-01");
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("실명인증 - 이름 누락 시 실패")
    void verifyIdentity_failWithEmptyName() {
        boolean result = memberService.verifyIdentity("", "1990-01-01");
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("실명인증 - 생년월일 누락 시 실패")
    void verifyIdentity_failWithNullBirthDate() {
        boolean result = memberService.verifyIdentity("홍길동", null);
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("회원 등록 - 성공")
    void create_success() {
        when(memberRepository.save(any(Member.class))).thenReturn(testMember);
        Member saved = memberService.create(testMember);
        assertThat(saved.getMemberName()).isEqualTo("홍길동");
        assertThat(saved.getEmail()).isEqualTo("test@example.com");
    }
}
