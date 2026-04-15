package com.medialog.biz.lgin;

import com.medialog.biz.memb.Member;
import com.medialog.biz.memb.MemberRepository;
import com.medialog.biz.mail.MailNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * 로그인 서비스.
 * 이메일/비밀번호 기반 인증 로직을 처리한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 63, Total Code Line : 63
 */
@Slf4j
@Service
public class LoginService {

    private final MemberRepository memberRepository;
    private final MailNotificationService mailNotificationService;

    /**
     * 생성자 주입.
     *
     * @param memberRepository 회원 리포지토리
     * @param mailNotificationService 공통 메일 알림 서비스
     */
    public LoginService(MemberRepository memberRepository, MailNotificationService mailNotificationService) {
        this.memberRepository = memberRepository;
        this.mailNotificationService = mailNotificationService;
    }

    /**
     * 이메일과 비밀번호로 인증을 수행한다.
     *
     * @param email 이메일 주소
     * @param password 비밀번호
     * @return 인증 결과 (success: true/false, memberName: 회원명)
     */
    public Map<String, Object> authenticate(String email, String password) {
        log.info("로그인 인증 시도 - email: {}", email);
        Map<String, Object> result = new HashMap<>();

        Member member = memberRepository.findByEmail(email);
        if (member == null || "Y".equals(member.getDelYn())) {
            log.warn("로그인 실패 - 존재하지 않는 이메일: {}", email);
            result.put("success", false);
            result.put("message", "이메일 또는 비밀번호가 일치하지 않습니다.");
            return result;
        }

        /* 비밀번호 비교 (샘플이므로 평문 비교) */
        if (!password.equals(member.getPassword())) {
            log.warn("로그인 실패 - 비밀번호 불일치: {}", email);
            result.put("success", false);
            result.put("message", "이메일 또는 비밀번호가 일치하지 않습니다.");
            return result;
        }

        log.info("로그인 성공 - email: {}, memberName: {}", email, member.getMemberName());
        result.put("success", true);
        result.put("memberName", member.getMemberName());
        return result;
    }

    /**
     * 비밀번호 찾기를 수행한다.
     * 이메일이 존재하면 임시비밀번호 6자리를 생성하여 메일로 발송하고 DB에 저장한다.
     *
     * @param email 이메일 주소
     * @return 처리 결과 (success: true/false, message: 결과 메시지)
     */
    public Map<String, Object> retrievePassword(String email) {
        log.info("비밀번호 찾기 요청 - email: {}", email);
        Map<String, Object> result = new HashMap<>();

        Member member = memberRepository.findByEmail(email);
        if (member == null || "Y".equals(member.getDelYn())) {
            log.warn("비밀번호 찾기 실패 - 회원 정보 없음: {}", email);
            result.put("success", false);
            result.put("message", "회원 정보가 존재하지 않습니다.");
            return result;
        }

        /* 임시비밀번호 6자리 생성 (영문+숫자) */
        String temporaryPassword = generateTemporaryPassword(6);
        member.setPassword(temporaryPassword);
        memberRepository.save(member);
        log.info("임시비밀번호 생성 완료 - email: {}", email);

        /* 임시비밀번호 메일 발송 (공통 메일 알림 서비스 사용) */
        mailNotificationService.sendNotification(
            "임시비밀번호 안내",
            "[미디어로그] 임시비밀번호 안내",
            "임시비밀번호: " + temporaryPassword + "\n로그인 후 비밀번호를 변경해주세요.",
            email
        );
        log.info("임시비밀번호 메일 발송 요청 완료 - email: {}", email);

        result.put("success", true);
        result.put("message", "임시비밀번호가 이메일로 발송되었습니다.");
        return result;
    }

    /**
     * 임시비밀번호를 생성한다.
     *
     * @param length 비밀번호 길이
     * @return 영문+숫자 조합 임시비밀번호
     */
    private String generateTemporaryPassword(int length) {
        String characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        Random random = new Random();
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            password.append(characters.charAt(random.nextInt(characters.length())));
        }
        return password.toString();
    }
}
