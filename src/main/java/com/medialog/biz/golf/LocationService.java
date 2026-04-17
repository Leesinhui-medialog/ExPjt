package com.medialog.biz.golf;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * 위치 서비스.
 * Nominatim 역지오코딩 API를 호출하여 위도·경도를 주소 문자열로 변환한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 80, Total Code Line : 80
 */
@Slf4j
@Service
public class LocationService {

    /** Nominatim 역지오코딩 API 엔드포인트 */
    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

    /** Nominatim API 호출 시 필수 User-Agent 헤더 값 */
    private static final String USER_AGENT = "ExPjt/1.0";

    /** 외부 API 호출용 RestTemplate */
    private final RestTemplate restTemplate;

    /** JSON 파싱용 ObjectMapper */
    private final ObjectMapper objectMapper;

    /**
     * 생성자 주입.
     *
     * @param objectMapper Jackson ObjectMapper
     */
    public LocationService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    /**
     * 위도·경도를 주소 문자열로 변환한다.
     * Nominatim 역지오코딩 API를 호출하여 display_name 필드를 반환한다.
     * 변환 실패 시 빈 문자열을 반환한다.
     *
     * @param latitude  위도
     * @param longitude 경도
     * @return 주소 문자열, 변환 실패 시 빈 문자열
     */
    public String reverseGeocode(double latitude, double longitude) {
        log.info("역지오코딩 요청 — 위도: {}, 경도: {}", latitude, longitude);

        try {
            /* Nominatim API URL 구성 */
            String url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                    .queryParam("lat", latitude)
                    .queryParam("lon", longitude)
                    .queryParam("format", "json")
                    .queryParam("accept-language", "ko")
                    .toUriString();

            /* User-Agent 헤더 설정 (Nominatim 정책상 필수) */
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.USER_AGENT, USER_AGENT);
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            /* 외부 API 호출 */
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, requestEntity, String.class);

            /* 응답에서 display_name 추출 */
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String displayName = rootNode.path("display_name").asText("");

            if (displayName.isEmpty()) {
                log.warn("역지오코딩 응답에 display_name이 없습니다 — 위도: {}, 경도: {}", latitude, longitude);
                return "";
            }

            log.info("역지오코딩 성공 — 주소: {}", displayName);
            return displayName;

        } catch (Exception e) {
            log.error("역지오코딩 실패 — 위도: {}, 경도: {}, 오류: {}", latitude, longitude, e.getMessage());
            return "";
        }
    }
}
