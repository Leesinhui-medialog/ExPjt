package com.medialog.biz.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * 메일 발송 서비스.
 * JavaMailSender를 사용하여 MIME 메일을 발송한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 71, Total Code Line : 71
 */
@Slf4j
@Service
public class MailService {

    private final JavaMailSender mailSender;

    /** 기본 발신자 주소 (application.yml에서 설정) */
    @Value("${spring.mail.username}")
    private String defaultSender;

    /**
     * 생성자 주입.
     *
     * @param mailSender JavaMailSender 인스턴스
     */
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * 기본 발신자 주소를 반환한다.
     *
     * @return 기본 발신자 이메일 주소
     */
    public String getDefaultSender() {
        return defaultSender;
    }

    /**
     * 폼메일을 발송한다.
     * 발신자가 지정되지 않으면 기본 발신자 주소를 사용한다.
     *
     * @param request 메일 요청 정보 (제목, 발신자, 수신자, 내용)
     * @throws MessagingException 메일 발송 실패 시
     */
    public void send(MailRequest request) throws MessagingException {
        log.info("메일 발송 시작 - receiver: {}", request.getReceiver());
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        /* 발신자가 없으면 기본 발신자 사용 */
        String from = (request.getSender() != null && !request.getSender().isBlank())
                ? request.getSender() : defaultSender;
        helper.setFrom(from);
        helper.setTo(request.getReceiver());
        helper.setSubject("[" + request.getTitle() + "] " + request.getSubject());
        helper.setText(request.getContent(), true);

        mailSender.send(message);
        log.info("메일 발송 완료 - receiver: {}", request.getReceiver());
    }
}
