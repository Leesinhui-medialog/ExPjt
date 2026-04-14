package com.medialog.biz.mail;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

/**
 * 메일 서비스 테스트.
 * 메일 발송 성공 및 발신자 미지정 시 예외를 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 65, Total Code Line : 65
 */
@ExtendWith(MockitoExtension.class)
class MailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private MailService mailService;

    /** 메일 발송 성공 검증 */
    @Test
    void send_success() throws Exception {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        MailRequest request = new MailRequest();
        request.setTitle("문의");
        request.setSubject("테스트 제목");
        request.setSender("sender@test.com");
        request.setReceiver("receiver@test.com");
        request.setContent("테스트 내용");

        mailService.send(request);

        verify(mailSender).send(mimeMessage);
    }

    /** 발신자가 null일 때 예외 발생 검증 */
    @Test
    void send_nullSender_throwsException() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        MailRequest request = new MailRequest();
        request.setTitle("문의");
        request.setSubject("제목");
        request.setSender(null);
        request.setReceiver("receiver@test.com");
        request.setContent("내용");

        assertThrows(Exception.class, () -> mailService.send(request));
    }
}
