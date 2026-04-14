package com.medialog.biz.main;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * HelloWorld 서비스.
 * 서버 동작 확인용 메시지를 제공한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 27, Total Code Line : 27
 */
@Slf4j
@Service
public class HelloWorldService {

    /**
     * "Hello, World!" 메시지를 조회한다.
     *
     * @return HelloWorld 문자열
     */
    public String retrieve() {
        log.info("HelloWorld 메시지 조회");
        return "Hello, World!";
    }
}
