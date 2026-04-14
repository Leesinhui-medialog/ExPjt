package com.medialog.biz.bord;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 게시판 엔티티 (VO).
 * 게시글의 제목, 내용, 등록일, 첨부파일 경로, 삭제 여부 등을 관리한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 57, Total Code Line : 57
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString(includeFieldNames = true, callSuper = true)
@EqualsAndHashCode
public class Board {

    /** 게시글 고유 번호 (자동 증가) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idx;

    /** 게시글 제목 */
    private String title;

    /** 게시글 내용 */
    private String description;

    /** 등록일 (yyyy-MM-dd 형식) */
    private String regDate;

    /** 첨부파일 저장 경로 (상대 경로) */
    private String filePath;

    /** 첨부파일 원본 파일명 */
    private String originalFileName;

    /** 삭제 여부 (N: 미삭제, Y: 삭제) */
    @Column(columnDefinition = "varchar(1) default 'N'")
    private String delYn = "N";

    /** 작성자 이름 */
    private String authorName;

    /** 조회수 */
    @Column(columnDefinition = "int default 0")
    private int viewCount = 0;
}
