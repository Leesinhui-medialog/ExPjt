package com.medialog.biz.main;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * HelloWorld 서비스 테스트.
 * retrieve 메소드의 반환값을 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 28, Total Code Line : 28
 */
class HelloWorldServiceTest {

    private final HelloWorldService service = new HelloWorldService();

    /** "Hello, World!" 메시지 반환 검증 */
    @Test
    void retrieve_shouldReturnHelloWorld() {
        String result = service.retrieve();

        assertNotNull(result);
        assertEquals("Hello, World!", result);
    }
}
