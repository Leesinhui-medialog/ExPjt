package com.medialog.biz.mail;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

/**
 * 공통 메일 알림 서비스 단위 테스트.
 * Mockito를 사용하여 MailService 의존성을 모킹하고,
 * 기본 수신자/지정 수신자 알림 메일 발송 및 예외 처리를 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 130, Total Code Line : 130
 */
@ExtendWith(MockitoExtension.class)
class MailNotificationServiceTest {

    @Mock
    private MailService mailService;

    @InjectMocks
    private MailNotificationService mailNotificationService;

    @BeforeEach
    void setUp() throws Exception {
        /* @Value 필드에 테스트 값 주입 */
        setField(mailNotificationService, "defaultSender", "test@gmail.com");
        setField(mailNotificationService, "defaultReceiver", "receiver@medialog.co.kr");
        setField(mailNotificationService, "mailWarnFailMessage", "메일 알림 발송 실패: {}");
    }

    /**
     * 리플렉션으로 private 필드에 값을 설정한다.
     */
    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    @DisplayName("기본 수신자에게 알림 메일 발송 - 제목, 발신자, 수신자 검증")
    void sendNotification_defaultReceiver() throws Exception {
        /* 기본 수신자로 알림 메일 발송 */
        mailNotificationService.sendNotification("테스트 타이틀", "테스트 제목", "테스트 내용");

        ArgumentCaptor<MailRequest> captor = ArgumentCaptor.forClass(MailRequest.class);
        verify(mailService).send(captor.capture());

        MailRequest sent = captor.getValue();
        assertThat(sent.getTitle()).isEqualTo("테스트 타이틀");
        assertThat(sent.getSubject()).isEqualTo("테스트 제목");
        assertThat(sent.getContent()).isEqualTo("테스트 내용");
        assertThat(sent.getSender()).isEqualTo("test@gmail.com");
        assertThat(sent.getReceiver()).isEqualTo("receiver@medialog.co.kr");
    }

    @Test
    @DisplayName("지정 수신자에게 알림 메일 발송 - 수신자 주소 검증")
    void sendNotification_customReceiver() throws Exception {
        /* 지정 수신자로 알림 메일 발송 */
        mailNotificationService.sendNotification("알림", "제목", "내용", "custom@example.com");

        ArgumentCaptor<MailRequest> captor = ArgumentCaptor.forClass(MailRequest.class);
        verify(mailService).send(captor.capture());

        MailRequest sent = captor.getValue();
        assertThat(sent.getReceiver()).isEqualTo("custom@example.com");
        assertThat(sent.getSender()).isEqualTo("test@gmail.com");
    }

    @Test
    @DisplayName("메일 발송 실패 시 예외를 던지지 않고 정상 종료")
    void sendNotification_mailSendFail_noException() throws Exception {
        /* 메일 발송 시 예외 발생 설정 */
        doThrow(new RuntimeException("SMTP 연결 실패"))
                .when(mailService).send(any(MailRequest.class));

        /* 예외가 전파되지 않아야 한다 */
        assertDoesNotThrow(
                () -> mailNotificationService.sendNotification("알림", "제목", "내용")
        );

        verify(mailService).send(any(MailRequest.class));
    }

    @Test
    @DisplayName("본문이 null인 경우에도 메일 발송 시도")
    void sendNotification_nullContent() throws Exception {
        /* 본문 없이 알림 메일 발송 */
        mailNotificationService.sendNotification("알림", "제목", null);

        ArgumentCaptor<MailRequest> captor = ArgumentCaptor.forClass(MailRequest.class);
        verify(mailService).send(captor.capture());

        MailRequest sent = captor.getValue();
        assertThat(sent.getContent()).isNull();
        assertThat(sent.getTitle()).isEqualTo("알림");
    }

    @Test
    @DisplayName("제목이 null인 경우에도 메일 발송 시도")
    void sendNotification_nullSubject() throws Exception {
        /* 제목 없이 알림 메일 발송 */
        mailNotificationService.sendNotification("알림", null, "내용");

        ArgumentCaptor<MailRequest> captor = ArgumentCaptor.forClass(MailRequest.class);
        verify(mailService).send(captor.capture());

        MailRequest sent = captor.getValue();
        assertThat(sent.getSubject()).isNull();
    }
}
