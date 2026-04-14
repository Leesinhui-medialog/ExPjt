package com.medialog.biz.comm;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

/**
 * 파일 업로드/다운로드 REST 컨트롤러.
 * 파일 업로드 및 다운로드 API를 제공한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 104, Total Code Line : 104
 */
@Slf4j
@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /** 업로드 루트 경로 */
    @Value("${app.upload.root}")
    private String uploadRoot;

    /**
     * 생성자 주입.
     *
     * @param fileUploadService 파일 업로드 서비스
     */
    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    /**
     * 파일을 업로드한다.
     *
     * @param file 업로드할 파일
     * @param subFolder 하위 폴더명 (선택)
     * @return 업로드된 파일 정보 (id, path, originalName)
     * @throws IOException 파일 저장 실패 시
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subFolder", required = false) String subFolder) throws IOException {
        log.info("파일 업로드 요청 - originalName: {}, subFolder: {}", file.getOriginalFilename(), subFolder);
        UploadFile uploadFile = fileUploadService.upload(file, subFolder);
        log.info("파일 업로드 완료 - id: {}, path: {}", uploadFile.getId(), uploadFile.getFilePath());
        return ResponseEntity.ok(Map.of(
                "id", uploadFile.getId(),
                "path", uploadFile.getFilePath(),
                "originalName", uploadFile.getOriginalName()
        ));
    }

    /**
     * 파일을 다운로드한다.
     * 파일이 존재하지 않으면 404를 반환한다.
     *
     * @param filePath 파일 저장 경로 (상대 경로)
     * @param originalName 원본 파일명 (선택, 다운로드 시 표시할 이름)
     * @return 파일 리소스
     * @throws IOException 파일 읽기 실패 시
     */
    @GetMapping("/download")
    public ResponseEntity<Resource> download(
            @RequestParam String filePath,
            @RequestParam(required = false) String originalName) throws IOException {
        log.info("파일 다운로드 요청 - filePath: {}", filePath);
        Path file = Paths.get(uploadRoot).resolve(filePath).normalize();
        Resource resource = new UrlResource(file.toUri());

        if (!resource.exists()) {
            log.warn("다운로드 파일을 찾을 수 없음 - filePath: {}", filePath);
            return ResponseEntity.notFound().build();
        }

        /* 다운로드 파일명 결정 (원본 파일명 우선) */
        String downloadName = (originalName != null && !originalName.isEmpty())
                ? originalName : file.getFileName().toString();

        String encodedName = URLEncoder.encode(downloadName, StandardCharsets.UTF_8)
                .replace("+", "%20");

        log.info("파일 다운로드 완료 - downloadName: {}", downloadName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename*=UTF-8''" + encodedName)
                .body(resource);
    }
}
