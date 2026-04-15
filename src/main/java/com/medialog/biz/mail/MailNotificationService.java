package com.medialog.biz.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 공통 메일 알림 서비스.
 * 게시판, 비밀번호 찾기 등 다양한 업무에서 메일 발송이 필요할 때 공통으로 사용한다.
 * 메일 발송 실패 시에도 예외를 던지지 않고 로그만 남긴다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 95, Total Code Line : 95
 */
@Slf4j
@Service
public class MailNotificationService {

    private final MailService mailService;

    /** 기본 메일 발신자 주소 */
    @Value("${spring.mail.username}")
    private String defaultSender;

    /** 기본 메일 수신자 주소 */
    @Value("${app.messages.mail-receiver}")
    private String defaultReceiver;

    /** 메일 발송 실패 경고 메시지 */
    @Value("${app.messages.mail-warn-fail}")
    private String mailWarnFailMessage;

    /**
     * 생성자 주입.
     *
     * @param mailService 메일 발송 서비스
     */
    public MailNotificationService(MailService mailService) {
        this.mailService = mailService;
    }

    /**
     * 기본 수신자에게 알림 메일을 발송한다.
     * 발송 실패 시에도 예외를 던지지 않고 경고 로그만 남긴다.
     *
     * @param title 메일 타이틀 (분류용)
     * @param subject 메일 제목
     * @param content 메일 본문
     */
    public void sendNotification(String title, String subject, String content) {
        sendNotification(title, subject, content, defaultReceiver);
    }

    /**
     * 지정된 수신자에게 알림 메일을 발송한다.
     * 발송 실패 시에도 예외를 던지지 않고 경고 로그만 남긴다.
     *
     * @param title 메일 타이틀 (분류용)
     * @param subject 메일 제목
     * @param content 메일 본문
     * @param receiver 수신자 이메일 주소
     */
    public void sendNotification(String title, String subject, String content, String receiver) {
        try {
            MailRequest mail = new MailRequest();
            mail.setTitle(title);
            mail.setSubject(subject);
            mail.setSender(defaultSender);
            mail.setReceiver(receiver);
            mail.setContent(content);
            mailService.send(mail);
            log.info("메일 알림 발송 완료 - title: {}, receiver: {}", title, receiver);
        } catch (Exception e) {
            log.warn(mailWarnFailMessage, e.getMessage());
        }
    }
}
