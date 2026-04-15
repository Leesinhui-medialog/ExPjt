package com.medialog.biz.bord;

import com.medialog.biz.mail.MailRequest;
import com.medialog.biz.mail.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 게시판 메일 알림 서비스.
 * 게시글 등록/수정 시 알림 메일 발송을 전담한다.
 * 메일 발송 실패 시에도 예외를 던지지 않고 로그만 남긴다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 72, Total Code Line : 72
 */
@Slf4j
@Service
public class BoardMailNotificationService {

    private final MailService mailService;

    /** 메일 발신자 주소 */
    @Value("${spring.mail.username}")
    private String mailSender;

    /** 신규 등록 메일 제목 */
    @Value("${app.messages.mail-new-title}")
    private String mailNewTitle;

    /** 수정 메일 제목 */
    @Value("${app.messages.mail-edit-title}")
    private String mailEditTitle;

    /** 메일 발송 실패 경고 메시지 */
    @Value("${app.messages.mail-warn-fail}")
    private String mailWarnFail;

    /** 메일 수신자 주소 */
    @Value("${app.messages.mail-receiver}")
    private String mailReceiver;

    /**
     * 생성자 주입.
     *
     * @param mailService 메일 발송 서비스
     */
    public BoardMailNotificationService(MailService mailService) {
        this.mailService = mailService;
    }

    /**
     * 게시글 등록/수정 알림 메일을 발송한다.
     * 발송 실패 시에도 예외를 던지지 않고 경고 로그만 남긴다.
     *
     * @param board 게시글 엔티티
     * @param isNew 신규 등록 여부 (true: 신규, false: 수정)
     */
    public void sendNotification(Board board, boolean isNew) {
        try {
            MailRequest mail = new MailRequest();
            mail.setTitle(isNew ? mailNewTitle : mailEditTitle);
            mail.setSubject(board.getTitle());
            mail.setSender(mailSender);
            mail.setReceiver(mailReceiver);
            mail.setContent(board.getDescription());
            mailService.send(mail);
            log.info("게시글 알림 메일 발송 완료 - idx: {}, isNew: {}", board.getIdx(), isNew);
        } catch (Exception e) {
            log.warn(mailWarnFail, e.getMessage());
        }
    }
}
