package com.medialog.biz.memb;

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
 * 회원 엔티티 (VO).
 * 회원의 이름, 생년월일, 이메일, 전화번호, 약관동의 여부 등을 관리한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 72, Total Code Line : 72
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString(includeFieldNames = true, callSuper = true)
@EqualsAndHashCode
public class Member {

    /** 회원 고유 번호 (자동 증가) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int memberIndex;

    /** 회원 이름 */
    private String memberName;

    /** 생년월일 (yyyy-MM-dd 형식) */
    private String birthDate;

    /** 이메일 주소 */
    private String email;

    /** 전화번호 */
    private String telephoneNumber;

    /** 비밀번호 (암호화 저장) */
    private String password;

    /** 이용약관 동의 여부 (Y/N) */
    @Column(columnDefinition = "varchar(1) default 'N'")
    private String termsAgreement = "N";

    /** 개인정보 수집 동의 여부 (Y/N) */
    @Column(columnDefinition = "varchar(1) default 'N'")
    private String privacyAgreement = "N";

    /** 실명인증 여부 (Y/N) */
    @Column(columnDefinition = "varchar(1) default 'N'")
    private String identityVerified = "N";

    /** 등록일 (yyyy-MM-dd 형식) */
    private String registrationDate;

    /** 삭제 여부 (N: 미삭제, Y: 삭제) */
    @Column(columnDefinition = "varchar(1) default 'N'")
    private String delYn = "N";
}
