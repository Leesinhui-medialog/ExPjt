package com.medialog.biz.bord;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 게시판 리포지토리.
 * 게시글 엔티티에 대한 데이터 접근을 담당한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 25, Total Code Line : 25
 */
public interface BoardRepository extends JpaRepository<Board, Integer> {

    /**
     * 삭제 여부(delYn)로 게시글을 페이징 조회한다.
     *
     * @param delYn 삭제 여부 ("N": 미삭제, "Y": 삭제)
     * @param pageable 페이징 정보
     * @return 페이징된 게시글 목록
     */
    Page<Board> findByDelYn(String delYn, Pageable pageable);
}
