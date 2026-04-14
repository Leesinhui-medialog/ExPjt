package com.medialog.biz.memb;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 회원 서비스.
 * 회원 가입, 실명인증, 이메일 중복 확인 등의 비즈니스 로직을 처리한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 80, Total Code Line : 80
 */
@Slf4j
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    /**
     * 생성자 주입.
     *
     * @param memberRepository 회원 리포지토리
     */
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    /**
     * 삭제되지 않은 회원 목록을 조회한다.
     *
     * @return 회원 목록
     */
    public List<Member> list() {
        log.info("회원 목록 조회");
        return memberRepository.findByDelYn("N");
    }

    /**
     * 이메일 중복 여부를 확인한다.
     *
     * @param email 확인할 이메일 주소
     * @return 중복이면 {@code true}
     */
    public boolean existsByEmail(String email) {
        log.info("이메일 중복 확인 - email: {}", email);
        return memberRepository.existsByEmail(email);
    }

    /**
     * 실명인증을 수행한다.
     * 이름과 생년월일이 일치하는지 확인한다. (샘플이므로 단순 검증)
     *
     * @param memberName 회원 이름
     * @param birthDate 생년월일 (yyyy-MM-dd)
     * @return 인증 성공 여부
     */
    public boolean verifyIdentity(String memberName, String birthDate) {
        log.info("실명인증 요청 - memberName: {}, birthDate: {}", memberName, birthDate);
        /* 샘플 프로젝트이므로 이름과 생년월일이 비어있지 않으면 인증 성공 처리 */
        boolean verified = memberName != null && !memberName.isBlank()
                && birthDate != null && !birthDate.isBlank();
        log.info("실명인증 결과 - verified: {}", verified);
        return verified;
    }

    /**
     * 회원을 등록한다.
     * 등록일을 자동 설정하고 삭제 여부를 기본값으로 지정한다.
     *
     * @param member 등록할 회원 엔티티
     * @return 등록된 회원 엔티티
     */
    public Member create(Member member) {
        log.info("회원 등록 요청 - memberName: {}, email: {}", member.getMemberName(), member.getEmail());
        /* 등록일이 없으면 오늘 날짜로 설정 */
        if (member.getRegistrationDate() == null || member.getRegistrationDate().isEmpty()) {
            member.setRegistrationDate(java.time.LocalDate.now().toString());
        }
        /* 삭제 여부 기본값 설정 */
        if (member.getDelYn() == null) {
            member.setDelYn("N");
        }
        Member saved = memberRepository.save(member);
        log.info("회원 등록 완료 - memberIndex: {}", saved.getMemberIndex());
        return saved;
    }
}
