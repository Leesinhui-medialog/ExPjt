package com.medialog.biz.comm;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 업로드 파일 정보 엔티티 (VO).
 * 업로드된 파일의 원본명, 저장명, 경로, 크기, 타입 등을 관리한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 51, Total Code Line : 51
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString(includeFieldNames = true, callSuper = true)
@EqualsAndHashCode
public class UploadFile {

    /** 업로드 파일 고유 번호 (자동 증가) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 원본 파일명 */
    private String originalName;

    /** 저장된 파일명 (UUID + 원본명) */
    private String storedName;

    /** 파일 저장 경로 (상대 경로) */
    private String filePath;

    /** 하위 폴더명 */
    private String subFolder;

    /** 파일 크기 (바이트) */
    private long fileSize;

    /** 파일 MIME 타입 */
    private String contentType;

    /** 등록일 (yyyy-MM-dd 형식) */
    private String regDate;
}
