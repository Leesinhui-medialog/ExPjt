package com.medialog.biz.main;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * HelloWorld 컨트롤러 테스트.
 * /hello 엔드포인트 동작을 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 38, Total Code Line : 38
 */
@WebMvcTest(HelloWorldController.class)
class HelloWorldControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private HelloWorldService helloWorldService;

    /** HelloWorld 메시지 반환 검증 */
    @Test
    void hello_returnsHelloWorld() throws Exception {
        org.mockito.Mockito.when(helloWorldService.retrieve()).thenReturn("Hello, World!");

        mockMvc.perform(get("/hello"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello, World!"));
    }
}
