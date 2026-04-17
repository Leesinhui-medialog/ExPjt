package com.medialog.biz.golf;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 골프장 데이터 VO 클래스.
 * JSON 파일에서 읽어온 전국 골프장 정보를 담는 순수 POJO 객체이다.
 * 골프장 이름, 위도, 경도, 주소, 지역, 유형(회원제/퍼블릭/회원제+퍼블릭) 정보를 포함한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 43, Total Code Line : 43
 */
@Getter
@Setter
@NoArgsConstructor
@ToString(includeFieldNames = true, callSuper = true)
@EqualsAndHashCode
public class GolfCourse {

    /** 골프장 이름 */
    private String name;

    /** 위도 */
    private double latitude;

    /** 경도 */
    private double longitude;

    /** 주소 */
    private String address;

    /** 지역 (예: 경기, 강원, 충남 등) */
    private String region;

    /** 유형 (회원제 / 퍼블릭 / 회원제+퍼블릭) */
    private String type;
}
