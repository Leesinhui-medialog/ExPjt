package com.medialog.biz.golf;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 위치 정보 REST 컨트롤러.
 * 역지오코딩 API를 제공하여 위도·경도를 주소 문자열로 변환한다.
 * 세션 기반 인증을 확인하여 미인증 요청에 대해 HTTP 401을 반환한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 68, Total Code Line : 68
 */
@Slf4j
@RestController
@RequestMapping("/api/location")
public class LocationController {

    private final LocationService locationService;

    /**
     * 생성자 주입.
     *
     * @param locationService 위치 서비스
     */
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    /**
     * 위도·경도를 주소 문자열로 변환하여 반환한다.
     * Nominatim 역지오코딩 API를 통해 주소를 조회한다.
     * 세션에 로그인 정보가 없으면 HTTP 401을 반환한다.
     *
     * @param latitude  위도
     * @param longitude 경도
     * @param session   HTTP 세션
     * @return 주소 문자열을 포함한 JSON 응답 {"address": "주소 문자열"}
     */
    @GetMapping("/reverse-geocode")
    public ResponseEntity<Map<String, String>> reverseGeocode(
            @RequestParam("lat") double latitude,
            @RequestParam("lng") double longitude,
            HttpSession session) {
        /* 세션 기반 인증 확인 */
        if (!isAuthenticated(session)) {
            log.warn("미인증 요청 — 역지오코딩 거부");
            return ResponseEntity.status(401).build();
        }

        log.info("역지오코딩 API 요청 — 위도: {}, 경도: {}", latitude, longitude);
        String address = locationService.reverseGeocode(latitude, longitude);
        return ResponseEntity.ok(Map.of("address", address));
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
