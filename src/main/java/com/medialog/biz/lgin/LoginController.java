package com.medialog.biz.lgin;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 로그인 REST 컨트롤러.
 * 이메일/비밀번호 기반 로그인 인증, 세션 확인, 로그아웃 API를 제공한다.
 * JSESSIONID 쿠키를 통해 로그인 상태를 유지한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 105, Total Code Line : 105
 */
@Slf4j
@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final LoginService loginService;

    /**
     * 생성자 주입.
     *
     * @param loginService 로그인 서비스
     */
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    /**
     * 이메일/비밀번호로 로그인을 수행한다.
     * 성공 시 세션에 회원 정보를 저장한다.
     *
     * @param params 이메일(email), 비밀번호(password)
     * @param session HTTP 세션
     * @return 로그인 결과 (success, memberName)
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> params, HttpSession session) {
        String email = params.get("email");
        String password = params.get("password");
        log.info("로그인 요청 - email: {}", email);

        Map<String, Object> result = loginService.authenticate(email, password);

        /* 로그인 성공 시 세션에 회원 정보 저장 */
        if (Boolean.TRUE.equals(result.get("success"))) {
            session.setAttribute("loginEmail", email);
            session.setAttribute("loginMemberName", result.get("memberName"));
            log.info("세션 저장 완료 - JSESSIONID: {}, email: {}", session.getId(), email);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * 현재 로그인 상태를 확인한다.
     * JSESSIONID 쿠키 기반으로 세션에 저장된 회원 정보를 반환한다.
     *
     * @param session HTTP 세션
     * @return 로그인 여부 (loggedIn, memberName, email)
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkLogin(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        String email = (String) session.getAttribute("loginEmail");
        if (email != null) {
            result.put("loggedIn", true);
            result.put("email", email);
            result.put("memberName", session.getAttribute("loginMemberName"));
            log.info("로그인 상태 확인 - loggedIn: true, email: {}", email);
        } else {
            result.put("loggedIn", false);
            log.info("로그인 상태 확인 - loggedIn: false");
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 비밀번호 찾기를 수행한다.
     * 이메일이 존재하면 임시비밀번호를 생성하여 메일로 발송한다.
     *
     * @param params 이메일(email)
     * @return 처리 결과 (success, message)
     */
    @PostMapping("/retrieve-password")
    public ResponseEntity<Map<String, Object>> retrievePassword(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        log.info("비밀번호 찾기 API 요청 - email: {}", email);
        return ResponseEntity.ok(loginService.retrievePassword(email));
    }

    /**
     * 로그아웃을 수행한다.
     * 세션을 무효화하여 JSESSIONID를 만료시킨다.
     *
     * @param session HTTP 세션
     * @return 로그아웃 결과
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        log.info("로그아웃 요청 - JSESSIONID: {}", session.getId());
        session.invalidate();
        return ResponseEntity.ok(Map.of("result", "ok"));
    }
}
