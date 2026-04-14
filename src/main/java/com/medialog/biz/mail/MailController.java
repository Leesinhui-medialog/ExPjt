package com.medialog.biz.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 폼메일 발송 REST 컨트롤러.
 * 메일 발송 API를 제공한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 56, Total Code Line : 56
 */
@Slf4j
@RestController
@RequestMapping("/api/mail")
public class MailController {

    private final MailService mailService;

    /** 메일 발송 성공 메시지 */
    @Value("${app.messages.mail-send-ok}")
    private String mailSendOk;

    /**
     * 생성자 주입.
     *
     * @param mailService 메일 발송 서비스
     */
    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    /**
     * 폼메일을 발송한다.
     *
     * @param request 메일 요청 정보 (제목, 발신자, 수신자, 내용)
     * @return 발송 결과 (성공/실패)
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> send(@RequestBody MailRequest request) {
        log.info("메일 발송 요청 - title: {}, receiver: {}", request.getTitle(), request.getReceiver());
        try {
            mailService.send(request);
            log.info("메일 발송 성공");
            return ResponseEntity.ok(Map.of("result", "ok", "message", mailSendOk));
        } catch (Exception e) {
            log.error("메일 발송 실패 - error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("result", "fail", "message", e.getMessage()));
        }
    }
}
