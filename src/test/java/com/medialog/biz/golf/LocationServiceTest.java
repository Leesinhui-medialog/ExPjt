package com.medialog.biz.golf;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

/**
 * 위치 서비스 단위 테스트.
 * Nominatim 역지오코딩 API 호출 및 에러 처리 로직을 검증한다.
 * MockRestServiceServer를 사용하여 외부 API 호출을 모킹한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 120, Total Code Line : 120
 */
class LocationServiceTest {

    private LocationService locationService;
    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        locationService = new LocationService(new ObjectMapper());

        /* 서비스 내부의 RestTemplate을 MockRestServiceServer로 바인딩 */
        RestTemplate restTemplate = (RestTemplate) ReflectionTestUtils.getField(locationService, "restTemplate");
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    @DisplayName("정상 응답 시 display_name 주소 반환 검증")
    void reverseGeocode_success_returnsDisplayName() {
        // given
        String jsonResponse = """
                {
                    "place_id": 12345,
                    "display_name": "서울특별시 강남구 역삼동, 대한민국",
                    "address": {
                        "city": "서울특별시",
                        "county": "강남구"
                    }
                }
                """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("nominatim.openstreetmap.org/reverse")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        // when
        String result = locationService.reverseGeocode(37.5012, 127.0396);

        // then
        assertNotNull(result);
        assertEquals("서울특별시 강남구 역삼동, 대한민국", result);
        mockServer.verify();
    }

    @Test
    @DisplayName("응답에 display_name이 없을 때 빈 문자열 반환 검증")
    void reverseGeocode_noDisplayName_returnsEmpty() {
        // given
        String jsonResponse = """
                {
                    "place_id": 12345,
                    "address": {
                        "city": "서울특별시"
                    }
                }
                """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("nominatim.openstreetmap.org/reverse")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        // when
        String result = locationService.reverseGeocode(37.5012, 127.0396);

        // then
        assertTrue(result.isEmpty());
        mockServer.verify();
    }

    @Test
    @DisplayName("외부 API 서버 오류 시 빈 문자열 반환 검증")
    void reverseGeocode_serverError_returnsEmpty() {
        // given
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("nominatim.openstreetmap.org/reverse")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR));

        // when
        String result = locationService.reverseGeocode(37.5012, 127.0396);

        // then
        assertTrue(result.isEmpty());
        mockServer.verify();
    }

    @Test
    @DisplayName("외부 API 404 응답 시 빈 문자열 반환 검증")
    void reverseGeocode_notFound_returnsEmpty() {
        // given
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("nominatim.openstreetmap.org/reverse")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.NOT_FOUND));

        // when
        String result = locationService.reverseGeocode(37.5012, 127.0396);

        // then
        assertTrue(result.isEmpty());
        mockServer.verify();
    }

    @Test
    @DisplayName("빈 JSON 응답 시 빈 문자열 반환 검증")
    void reverseGeocode_emptyJson_returnsEmpty() {
        // given
        String jsonResponse = "{}";

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("nominatim.openstreetmap.org/reverse")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        // when
        String result = locationService.reverseGeocode(37.5012, 127.0396);

        // then
        assertTrue(result.isEmpty());
        mockServer.verify();
    }
}
