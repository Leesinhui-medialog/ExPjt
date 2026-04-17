package com.medialog.biz.golf;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * GolfCourse VO 클래스 단위 테스트.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 */
class GolfCourseTest {

    @Test
    @DisplayName("GolfCourse 기본 생성 및 필드 설정 검증")
    void testGolfCourseGetterSetter() {
        // given
        GolfCourse golfCourse = new GolfCourse();

        // when
        golfCourse.setName("남서울CC");
        golfCourse.setLatitude(37.3456);
        golfCourse.setLongitude(127.1234);
        golfCourse.setAddress("경기도 성남시 분당구");
        golfCourse.setRegion("경기");
        golfCourse.setType("회원제");

        // then
        assertEquals("남서울CC", golfCourse.getName());
        assertEquals(37.3456, golfCourse.getLatitude());
        assertEquals(127.1234, golfCourse.getLongitude());
        assertEquals("경기도 성남시 분당구", golfCourse.getAddress());
        assertEquals("경기", golfCourse.getRegion());
        assertEquals("회원제", golfCourse.getType());
    }

    @Test
    @DisplayName("GolfCourse toString 출력 검증")
    void testGolfCourseToString() {
        // given
        GolfCourse golfCourse = new GolfCourse();
        golfCourse.setName("블루원CC");
        golfCourse.setType("퍼블릭");

        // when
        String result = golfCourse.toString();

        // then
        assertNotNull(result);
    }

    @Test
    @DisplayName("GolfCourse equals 및 hashCode 검증")
    void testGolfCourseEqualsAndHashCode() {
        // given
        GolfCourse course1 = new GolfCourse();
        course1.setName("레이크사이드CC");
        course1.setLatitude(35.1234);
        course1.setLongitude(128.5678);
        course1.setAddress("경남 창원시");
        course1.setRegion("경남");
        course1.setType("회원제+퍼블릭");

        GolfCourse course2 = new GolfCourse();
        course2.setName("레이크사이드CC");
        course2.setLatitude(35.1234);
        course2.setLongitude(128.5678);
        course2.setAddress("경남 창원시");
        course2.setRegion("경남");
        course2.setType("회원제+퍼블릭");

        // then
        assertEquals(course1, course2);
        assertEquals(course1.hashCode(), course2.hashCode());
    }
}
