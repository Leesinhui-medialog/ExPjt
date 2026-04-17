package com.medialog.biz.golf;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 위치 컨트롤러 단위 테스트.
 * 역지오코딩 API 엔드포인트 및 세션 인증 검증을 수행한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 95, Total Code Line : 95
 */
@WebMvcTest(LocationController.class)
class LocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LocationService locationService;

    /**
     * 로그인된 세션을 생성한다.
     *
     * @return 로그인 정보가 설정된 MockHttpSession
     */
    private MockHttpSession createAuthenticatedSession() {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("loginEmail", "test@example.com");
        session.setAttribute("loginMemberName", "홍길동");
        return session;
    }

    @Test
    @DisplayName("역지오코딩 — 인증된 사용자, 정상 주소 반환")
    void reverseGeocode_authenticated_returnsAddress() throws Exception {
        /* 서비스 응답 설정 */
        when(locationService.reverseGeocode(37.5012, 127.0396))
                .thenReturn("서울특별시 강남구 역삼동, 대한민국");

        mockMvc.perform(get("/api/location/reverse-geocode")
                        .param("lat", "37.5012")
                        .param("lng", "127.0396")
                        .session(createAuthenticatedSession()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value("서울특별시 강남구 역삼동, 대한민국"));
    }

    @Test
    @DisplayName("역지오코딩 — 미인증 시 401 반환")
    void reverseGeocode_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/location/reverse-geocode")
                        .param("lat", "37.5012")
                        .param("lng", "127.0396"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("역지오코딩 — 인증된 사용자, 주소 변환 실패 시 빈 문자열 반환")
    void reverseGeocode_authenticated_emptyAddress() throws Exception {
        /* 서비스가 빈 문자열을 반환하는 경우 */
        when(locationService.reverseGeocode(0.0, 0.0))
                .thenReturn("");

        mockMvc.perform(get("/api/location/reverse-geocode")
                        .param("lat", "0.0")
                        .param("lng", "0.0")
                        .session(createAuthenticatedSession()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value(""));
    }
}
