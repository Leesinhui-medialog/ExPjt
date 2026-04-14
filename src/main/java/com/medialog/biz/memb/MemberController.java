package com.medialog.biz.memb;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 회원 REST 컨트롤러.
 * 회원 가입(약관동의, 실명인증, 정보입력), 이메일 중복 확인 API를 제공한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 111, Total Code Line : 111
 */
@Slf4j
@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    /**
     * 생성자 주입.
     *
     * @param memberService 회원 서비스
     */
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    /**
     * 회원 목록을 조회한다.
     *
     * @return 삭제되지 않은 회원 목록
     */
    @GetMapping("/list")
    public ResponseEntity<List<Member>> list() {
        log.info("회원 목록 조회 요청");
        return ResponseEntity.ok(memberService.list());
    }

    /**
     * 이메일로 회원 상세 정보를 조회한다.
     *
     * @param email 이메일 주소
     * @return 회원 정보
     */
    @GetMapping("/detail")
    public ResponseEntity<Member> retrieveDetail(@RequestParam String email) {
        log.info("회원 상세 조회 요청 - email: {}", email);
        Member member = memberService.retrieveByEmail(email);
        if (member == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(member);
    }

    /**
     * 회원 프로필(이름, 전화번호)을 수정한다.
     *
     * @param params 이메일(email), 이름(memberName), 전화번호(telephoneNumber)
     * @return 수정 결과
     */
    @PutMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String memberName = params.get("memberName");
        String telephoneNumber = params.get("telephoneNumber");
        String birthDate = params.get("birthDate");
        log.info("회원 프로필 수정 요청 - email: {}", email);
        return ResponseEntity.ok(memberService.updateProfile(email, memberName, telephoneNumber, birthDate));
    }

    /**
     * 회원 비밀번호를 변경한다.
     *
     * @param params 이메일(email), 현재 비밀번호(currentPassword), 새 비밀번호(newPassword)
     * @return 변경 결과
     */
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String currentPassword = params.get("currentPassword");
        String newPassword = params.get("newPassword");
        log.info("비밀번호 변경 요청 - email: {}", email);
        return ResponseEntity.ok(memberService.changePassword(email, currentPassword, newPassword));
    }

    /**
     * 이메일 중복 여부를 확인한다.
     *
     * @param email 확인할 이메일 주소
     * @return 중복 여부 (exists: true/false)
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        log.info("이메일 중복 확인 요청 - email: {}", email);
        boolean exists = memberService.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    /**
     * 실명인증을 수행한다.
     *
     * @param params 이름(memberName), 생년월일(birthDate)
     * @return 인증 결과 (verified: true/false)
     */
    @PostMapping("/verify-identity")
    public ResponseEntity<Map<String, Boolean>> verifyIdentity(@RequestBody Map<String, String> params) {
        String memberName = params.get("memberName");
        String birthDate = params.get("birthDate");
        log.info("실명인증 API 요청 - memberName: {}, birthDate: {}", memberName, birthDate);
        boolean verified = memberService.verifyIdentity(memberName, birthDate);
        return ResponseEntity.ok(Map.of("verified", verified));
    }

    /**
     * 회원을 등록한다.
     *
     * @param member 등록할 회원 정보
     * @return 등록된 회원 정보
     */
    @PostMapping("/register")
    public ResponseEntity<Member> create(@RequestBody Member member) {
        log.info("회원 등록 API 요청 - memberName: {}", member.getMemberName());
        /* 이메일 중복 확인 */
        if (memberService.existsByEmail(member.getEmail())) {
            log.warn("이메일 중복 - email: {}", member.getEmail());
            return ResponseEntity.badRequest().build();
        }
        Member saved = memberService.create(member);
        return ResponseEntity.ok(saved);
    }
}
