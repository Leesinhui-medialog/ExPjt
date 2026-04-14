package com.medialog.biz.main;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HelloWorld REST 컨트롤러.
 * 서버 동작 확인용 간단한 엔드포인트를 제공한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 40, Total Code Line : 40
 */
@Slf4j
@RestController
public class HelloWorldController {

    private final HelloWorldService helloWorldService;

    /**
     * 생성자 주입.
     *
     * @param helloWorldService HelloWorld 서비스
     */
    public HelloWorldController(HelloWorldService helloWorldService) {
        this.helloWorldService = helloWorldService;
    }

    /**
     * "Hello, World!" 메시지를 반환한다.
     *
     * @return HelloWorld 문자열
     */
    @GetMapping("/hello")
    public String hello() {
        log.info("HelloWorld 요청");
        return helloWorldService.retrieve();
    }
}
