package com.medialog.biz.comm;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 업로드 파일 리포지토리 테스트.
 * 저장, 조회, 삭제 기능을 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 58, Total Code Line : 58
 */
@DataJpaTest
class UploadFileRepositoryTest {

    @Autowired
    private UploadFileRepository uploadFileRepository;

    /** 저장 후 ID로 조회 검증 */
    @Test
    void save_and_findById() {
        UploadFile file = new UploadFile();
        file.setOriginalName("test.pdf");
        file.setStoredName("uuid_test.pdf");
        file.setFilePath("docs/uuid_test.pdf");
        file.setSubFolder("docs");
        file.setFileSize(1024);
        file.setContentType("application/pdf");
        file.setRegDate("2026-04-09");

        UploadFile saved = uploadFileRepository.save(file);

        UploadFile found = uploadFileRepository.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("test.pdf", found.getOriginalName());
        assertEquals(1024, found.getFileSize());
    }

    /** 삭제 후 조회 시 빈 결과 검증 */
    @Test
    void delete_removesRecord() {
        UploadFile file = new UploadFile();
        file.setOriginalName("delete.txt");
        file.setStoredName("uuid_delete.txt");
        file.setFilePath("uuid_delete.txt");
        file.setFileSize(100);
        file.setRegDate("2026-04-09");

        UploadFile saved = uploadFileRepository.save(file);
        uploadFileRepository.deleteById(saved.getId());

        assertTrue(uploadFileRepository.findById(saved.getId()).isEmpty());
    }
}
