package com.medialog.biz.golf;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 골프장 서비스.
 * 클래스패스의 JSON 파일에서 전국 골프장 데이터를 로드하고,
 * 전체 목록 조회 및 키워드 검색 기능을 제공한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 82, Total Code Line : 82
 */
@Slf4j
@Service
public class GolfCourseService {

    /** JSON 파일 경로 (클래스패스 기준) */
    private static final String JSON_PATH = "data/golf-courses.json";

    /** JSON 파싱용 ObjectMapper */
    private final ObjectMapper objectMapper;

    /** 메모리에 보관하는 골프장 목록 */
    private List<GolfCourse> golfCourses = new ArrayList<>();

    /**
     * 생성자 주입.
     *
     * @param objectMapper Jackson ObjectMapper
     */
    public GolfCourseService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * 애플리케이션 시작 시 골프장 JSON 파일을 메모리에 로드한다.
     * 파일이 존재하지 않거나 파싱에 실패하면 빈 리스트로 초기화하고 경고 로그를 남긴다.
     */
    @PostConstruct
    public void loadGolfCourses() {
        try {
            ClassPathResource resource = new ClassPathResource(JSON_PATH);
            if (!resource.exists()) {
                log.warn("골프장 JSON 파일이 존재하지 않습니다: {}", JSON_PATH);
                golfCourses = new ArrayList<>();
                return;
            }
            try (InputStream inputStream = resource.getInputStream()) {
                golfCourses = objectMapper.readValue(inputStream, new TypeReference<List<GolfCourse>>() {});
                log.info("골프장 데이터 로드 완료 — 총 {}건", golfCourses.size());
            }
        } catch (Exception e) {
            log.warn("골프장 JSON 파일 로드 실패: {}", e.getMessage());
            golfCourses = new ArrayList<>();
        }
    }

    /**
     * 전체 골프장 목록을 조회한다.
     *
     * @return 전체 골프장 리스트
     */
    public List<GolfCourse> retrieveAll() {
        log.info("전체 골프장 목록 조회 — 총 {}건", golfCourses.size());
        return golfCourses;
    }

    /**
     * 키워드로 골프장을 검색한다.
     * 골프장 이름(name) 또는 지역(region)에 키워드가 포함되면 결과에 포함한다.
     * 대소문자를 무시하며, 키워드가 null이거나 빈 문자열이면 전체 목록을 반환한다.
     *
     * @param keyword 검색 키워드
     * @return 키워드에 매칭되는 골프장 리스트
     */
    public List<GolfCourse> searchByKeyword(String keyword) {
        /* 키워드가 null이거나 빈 문자열이면 전체 목록 반환 */
        if (keyword == null || keyword.trim().isEmpty()) {
            log.info("키워드 미입력 — 전체 골프장 목록 반환");
            return golfCourses;
        }

        String lowerKeyword = keyword.trim().toLowerCase();
        List<GolfCourse> result = golfCourses.stream()
                .filter(course -> {
                    boolean nameMatch = course.getName() != null
                            && course.getName().toLowerCase().contains(lowerKeyword);
                    boolean regionMatch = course.getRegion() != null
                            && course.getRegion().toLowerCase().contains(lowerKeyword);
                    return nameMatch || regionMatch;
                })
                .collect(Collectors.toList());

        log.info("키워드 '{}' 검색 결과 — {}건", keyword, result.size());
        return result;
    }
}
