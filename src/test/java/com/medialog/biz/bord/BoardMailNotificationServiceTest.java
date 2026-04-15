package com.medialog.biz.bord;

import com.medialog.biz.mail.MailRequest;
import com.medialog.biz.mail.MailService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

/**
 * 게시판 메일 알림 서비스 단위 테스트.
 * Mockito를 사용하여 MailService 의존성을 모킹하고,
 * 신규/수정 알림 메일 발송 및 예외 처리를 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 120, Total Code Line : 120
 */
@ExtendWith(MockitoExtension.class)
class BoardMailNotificationServiceTest {

    @Mock
    private MailService mailService;

    @InjectMocks
    private BoardMailNotificationService boardMailNotificationService;

    private Board testBoard;

    @BeforeEach
    void setUp() throws Exception {
        /* @Value 필드에 테스트 값 주입 */
        setField(boardMailNotificationService, "mailSender", "test@gmail.com");
        setField(boardMailNotificationService, "mailNewTitle", "게시물 신규등록");
        setField(boardMailNotificationService, "mailEditTitle", "게시물 수정");
        setField(boardMailNotificationService, "mailWarnFail", "게시물 알림 메일 발송 실패: {}");
        setField(boardMailNotificationService, "mailReceiver", "receiver@medialog.co.kr");

        testBoard = new Board();
        testBoard.setIdx(1);
        testBoard.setTitle("테스트 게시글");
        testBoard.setDescription("테스트 내용입니다.");
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
    @DisplayName("신규 게시글 등록 시 알림 메일 발송 - 제목에 신규등록 타이틀 사용")
    void sendNotification_newBoard() throws Exception {
        boardMailNotificationService.sendNotification(testBoard, true);

        ArgumentCaptor<MailRequest> captor = ArgumentCaptor.forClass(MailRequest.class);
        verify(mailService).send(captor.capture());

        MailRequest sent = captor.getValue();
        assertThat(sent.getTitle()).isEqualTo("게시물 신규등록");
        assertThat(sent.getSubject()).isEqualTo("테스트 게시글");
        assertThat(sent.getSender()).isEqualTo("test@gmail.com");
        assertThat(sent.getReceiver()).isEqualTo("receiver@medialog.co.kr");
        assertThat(sent.getContent()).isEqualTo("테스트 내용입니다.");
    }

    @Test
    @DisplayName("게시글 수정 시 알림 메일 발송 - 제목에 수정 타이틀 사용")
    void sendNotification_editBoard() throws Exception {
        boardMailNotificationService.sendNotification(testBoard, false);

        ArgumentCaptor<MailRequest> captor = ArgumentCaptor.forClass(MailRequest.class);
        verify(mailService).send(captor.capture());

        MailRequest sent = captor.getValue();
        assertThat(sent.getTitle()).isEqualTo("게시물 수정");
        assertThat(sent.getSubject()).isEqualTo("테스트 게시글");
    }

    @Test
    @DisplayName("메일 발송 실패 시 예외를 던지지 않고 정상 종료")
    void sendNotification_mailSendFail_noException() throws Exception {
        /* 메일 발송 시 예외 발생 설정 */
        org.mockito.Mockito.doThrow(new RuntimeException("SMTP 연결 실패"))
                .when(mailService).send(any(MailRequest.class));

        /* 예외가 전파되지 않아야 한다 */
        org.junit.jupiter.api.Assertions.assertDoesNotThrow(
                () -> boardMailNotificationService.sendNotification(testBoard, true)
        );

        verify(mailService).send(any(MailRequest.class));
    }

    @Test
    @DisplayName("게시글 내용이 null인 경우에도 메일 발송 시도")
    void sendNotification_nullDescription() throws Exception {
        testBoard.setDescription(null);

        boardMailNotificationService.sendNotification(testBoard, true);

        ArgumentCaptor<MailRequest> captor = ArgumentCaptor.forClass(MailRequest.class);
        verify(mailService).send(captor.capture());

        MailRequest sent = captor.getValue();
        assertThat(sent.getContent()).isNull();
    }
}
