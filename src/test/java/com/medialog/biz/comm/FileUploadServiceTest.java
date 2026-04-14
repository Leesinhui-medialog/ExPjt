package com.medialog.biz.comm;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 파일 업로드 서비스 테스트.
 * 업로드 성공, 빈 파일, null 파일, 서브 폴더 미지정 케이스를 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 87, Total Code Line : 87
 */
@ExtendWith(MockitoExtension.class)
class FileUploadServiceTest {

    @Mock
    private UploadFileRepository uploadFileRepository;

    private FileUploadService fileUploadService;

    @TempDir
    Path tempDirectory;

    @BeforeEach
    void setUp() {
        fileUploadService = new FileUploadService(uploadFileRepository);
        ReflectionTestUtils.setField(fileUploadService, "uploadRoot", tempDirectory.toString());
        ReflectionTestUtils.setField(fileUploadService, "uploadEmptyMessage", "업로드할 파일이 없습니다.");
    }

    /** 파일 업로드 성공 검증 */
    @Test
    void upload_success() throws IOException {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "hello".getBytes());
        UploadFile saved = new UploadFile();
        saved.setId(1L);
        saved.setOriginalName("test.txt");
        when(uploadFileRepository.save(any(UploadFile.class))).thenReturn(saved);

        UploadFile result = fileUploadService.upload(file, "docs");

        assertNotNull(result);
        assertEquals("test.txt", result.getOriginalName());
        verify(uploadFileRepository).save(any(UploadFile.class));
    }

    /** 빈 파일 업로드 시 예외 발생 검증 */
    @Test
    void upload_emptyFile() {
        MockMultipartFile file = new MockMultipartFile("file", "empty.txt", "text/plain", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> fileUploadService.upload(file, null));
    }

    /** null 파일 업로드 시 예외 발생 검증 */
    @Test
    void upload_nullFile() {
        assertThrows(IllegalArgumentException.class, () -> fileUploadService.upload(null, null));
    }

    /** 서브 폴더 미지정 시 루트에 저장되는지 검증 */
    @Test
    void upload_noSubFolder() throws IOException {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "data".getBytes());
        UploadFile saved = new UploadFile();
        saved.setId(2L);
        when(uploadFileRepository.save(any(UploadFile.class))).thenReturn(saved);

        UploadFile result = fileUploadService.upload(file, null);

        assertNotNull(result);
    }
}
