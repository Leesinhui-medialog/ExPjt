package com.medialog.biz.bord;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 게시글 추천 엔티티 (VO).
 * 회원이 게시글에 추천한 이력을 관리한다.
 * 동일 회원이 동일 게시글에 중복 추천하는 것을 방지하기 위해 사용한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 46, Total Code Line : 49
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString(includeFieldNames = true, callSuper = true)
@EqualsAndHashCode
public class Recommand {

    /** 추천 고유 번호 (자동 증가) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recommendIndex;

    /** 추천 대상 게시글 번호 */
    private int boardIdx;

    /** 추천한 회원 이메일 */
    private String memberEmail;

    /** 추천자 명 */
    private String memberName;

    /** 추천 횟수 */
    @Column(columnDefinition="varchar(1) default 0")
    private int recommendCount;


    /** 추천일 (yyyy-MM-dd 형식) */
    private String recommendDate;
}
