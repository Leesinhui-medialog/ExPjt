package com.medialog.biz.comm;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 설정.
 * CORS 정책을 설정하여 프론트엔드(localhost:3000)에서의 API 호출을 허용한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 34, Total Code Line : 34
 */
@Slf4j
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * CORS 매핑을 설정한다.
     * /api/** 경로에 대해 localhost:3000에서의 GET, POST, PUT, DELETE 요청을 허용한다.
     *
     * @param registry CORS 레지스트리
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        log.info("CORS 설정 적용 - allowedOrigins: http://localhost:3000");
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
