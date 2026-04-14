package com.medialog.biz.mail;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 폼메일 요청 DTO (VO).
 * 메일 발송에 필요한 제목, 발신자, 수신자, 내용 정보를 담는다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 36, Total Code Line : 36
 */
@Getter
@Setter
@ToString(includeFieldNames = true, callSuper = true)
@EqualsAndHashCode
public class MailRequest {

    /** 메일 타이틀 (분류용) */
    private String title;

    /** 메일 제목 */
    private String subject;

    /** 발신자 이메일 주소 */
    private String sender;

    /** 수신자 이메일 주소 */
    private String receiver;

    /** 메일 본문 내용 */
    private String content;
}
