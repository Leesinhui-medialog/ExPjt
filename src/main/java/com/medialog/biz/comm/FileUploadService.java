package com.medialog.biz.comm;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

/**
 * 파일 업로드 서비스.
 * 지정된 루트 폴더 하위에 서브 폴더를 지정하여 파일을 저장하고 DB에 기록한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 129, Total Code Line : 129
 */
@Slf4j
@Service
public class FileUploadService {

    /** 업로드 루트 경로 */
    @Value("${app.upload.root}")
    private String uploadRoot;

    /** 빈 파일 업로드 시 에러 메시지 */
    @Value("${app.messages.upload-empty}")
    private String uploadEmptyMessage;

    private final UploadFileRepository uploadFileRepository;

    /**
     * 생성자 주입.
     *
     * @param uploadFileRepository 업로드 파일 리포지토리
     */
    public FileUploadService(UploadFileRepository uploadFileRepository) {
        this.uploadFileRepository = uploadFileRepository;
    }

    /**
     * 파일을 업로드하고 DB에 저장한다.
     *
     * @param file      업로드할 파일
     * @param subFolder 하위 폴더명 (null 또는 빈 문자열이면 루트에 저장)
     * @return 저장된 UploadFile 엔티티
     * @throws IOException 파일 저장 실패 시
     */
    public UploadFile upload(MultipartFile file, String subFolder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(uploadEmptyMessage);
        }

        /* 저장 디렉토리 결정 */
        Path targetDirectory = Paths.get(uploadRoot);
        if (subFolder != null && !subFolder.isBlank()) {
            targetDirectory = targetDirectory.resolve(subFolder);
        }
        Files.createDirectories(targetDirectory);

        /* 파일 저장 (UUID + 원본 파일명) */
        String originalName = file.getOriginalFilename();
        String storedName = UUID.randomUUID() + "_" + originalName;
        Path targetPath = targetDirectory.resolve(storedName);
        file.transferTo(targetPath.toFile());

        /* 상대 경로 계산 */
        String relativePath = Paths.get(uploadRoot).relativize(targetPath).toString();

        /* DB에 파일 정보 저장 */
        UploadFile uploadFile = new UploadFile();
        uploadFile.setOriginalName(originalName);
        uploadFile.setStoredName(storedName);
        uploadFile.setFilePath(relativePath);
        uploadFile.setSubFolder(subFolder != null ? subFolder : "");
        uploadFile.setFileSize(file.getSize());
        uploadFile.setContentType(file.getContentType());
        uploadFile.setRegDate(LocalDate.now().toString());

        log.info("파일 업로드 완료 - originalName: {}, storedName: {}", originalName, storedName);
        return uploadFileRepository.save(uploadFile);
    }

    /**
     * ID로 업로드 파일 정보를 조회한다.
     *
     * @param id 업로드 파일 고유 번호
     * @return 업로드 파일 엔티티, 없으면 {@code null}
     */
    public UploadFile retrieveById(Long id) {
        log.info("업로드 파일 조회 - id: {}", id);
        return uploadFileRepository.findById(id).orElse(null);
    }

    /**
     * 파일 경로로 물리 파일을 삭제한다.
     *
     * @param filePath 삭제할 파일의 상대 경로
     * @throws IOException 파일 삭제 실패 시
     */
    public void deleteByPath(String filePath) throws IOException {
        Path file = Paths.get(uploadRoot).resolve(filePath).normalize();
        Files.deleteIfExists(file);
        log.info("물리 파일 삭제 완료 - filePath: {}", filePath);
    }

    /**
     * ID로 업로드 파일을 삭제한다 (DB + 물리 파일).
     *
     * @param id 삭제할 업로드 파일 고유 번호
     * @throws IOException 파일 삭제 실패 시
     */
    public void delete(Long id) throws IOException {
        UploadFile uploadFile = uploadFileRepository.findById(id).orElse(null);
        if (uploadFile != null) {
            Path filePath = Paths.get(uploadRoot).resolve(uploadFile.getFilePath());
            Files.deleteIfExists(filePath);
            uploadFileRepository.delete(uploadFile);
            log.info("업로드 파일 삭제 완료 (DB + 물리) - id: {}", id);
        } else {
            log.warn("삭제할 업로드 파일을 찾을 수 없음 - id: {}", id);
        }
    }
}
