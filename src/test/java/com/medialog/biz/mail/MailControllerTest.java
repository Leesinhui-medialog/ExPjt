package com.medialog.biz.mail;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 메일 컨트롤러 테스트.
 * 메일 발송 성공/실패 API를 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 60, Total Code Line : 60
 */
@WebMvcTest(MailController.class)
@TestPropertySource(properties = {
    "app.messages.mail-send-ok=메일이 발송되었습니다."
})
class MailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MailService mailService;

    /** 메일 발송 성공 검증 */
    @Test
    void send_success() throws Exception {
        doNothing().when(mailService).send(any(MailRequest.class));

        mockMvc.perform(post("/api/mail/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"문의\",\"subject\":\"테스트\",\"sender\":\"a@b.com\",\"receiver\":\"c@d.com\",\"content\":\"내용\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value("ok"));
    }

    /** 메일 발송 실패 검증 */
    @Test
    void send_fail() throws Exception {
        doThrow(new RuntimeException("SMTP 오류")).when(mailService).send(any(MailRequest.class));

        mockMvc.perform(post("/api/mail/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"문의\",\"subject\":\"테스트\",\"sender\":\"a@b.com\",\"receiver\":\"c@d.com\",\"content\":\"내용\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.result").value("fail"));
    }
}
