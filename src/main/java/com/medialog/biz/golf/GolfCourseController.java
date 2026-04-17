package com.medialog.biz.golf;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 골프장 REST 컨트롤러.
 * 전체 골프장 목록 조회 및 키워드 검색 API를 제공한다.
 * 세션 기반 인증을 확인하여 미인증 요청에 대해 HTTP 401을 반환한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 80, Total Code Line : 80
 */
@Slf4j
@RestController
@RequestMapping("/api/golf-courses")
public class GolfCourseController {

    private final GolfCourseService golfCourseService;

    /**
     * 생성자 주입.
     *
     * @param golfCourseService 골프장 서비스
     */
    public GolfCourseController(GolfCourseService golfCourseService) {
        this.golfCourseService = golfCourseService;
    }

    /**
     * 전체 골프장 목록을 조회한다.
     * 세션에 로그인 정보가 없으면 HTTP 401을 반환한다.
     *
     * @param session HTTP 세션
     * @return 전체 골프장 목록 JSON 배열
     */
    @GetMapping
    public ResponseEntity<List<GolfCourse>> retrieveAll(HttpSession session) {
        /* 세션 기반 인증 확인 */
        if (!isAuthenticated(session)) {
            log.warn("미인증 요청 — 전체 골프장 목록 조회 거부");
            return ResponseEntity.status(401).build();
        }

        log.info("전체 골프장 목록 조회 요청");
        List<GolfCourse> golfCourses = golfCourseService.retrieveAll();
        return ResponseEntity.ok(golfCourses);
    }

    /**
     * 키워드로 골프장을 검색한다.
     * 골프장 이름 또는 지역에 키워드가 포함된 결과를 반환한다.
     * 세션에 로그인 정보가 없으면 HTTP 401을 반환한다.
     *
     * @param keyword 검색 키워드
     * @param session HTTP 세션
     * @return 검색 결과 골프장 목록 JSON 배열
     */
    @GetMapping("/search")
    public ResponseEntity<List<GolfCourse>> searchByKeyword(
            @RequestParam(required = false) String keyword,
            HttpSession session) {
        /* 세션 기반 인증 확인 */
        if (!isAuthenticated(session)) {
            log.warn("미인증 요청 — 골프장 검색 거부");
            return ResponseEntity.status(401).build();
        }

        log.info("골프장 검색 요청 — keyword: {}", keyword);
        List<GolfCourse> result = golfCourseService.searchByKeyword(keyword);
        return ResponseEntity.ok(result);
    }

    /**
     * 세션에 로그인 정보가 존재하는지 확인한다.
     *
     * @param session HTTP 세션
     * @return 인증 여부 (true: 인증됨, false: 미인증)
     */
    private boolean isAuthenticated(HttpSession session) {
        String loginEmail = (String) session.getAttribute("loginEmail");
        return loginEmail != null;
    }
}
