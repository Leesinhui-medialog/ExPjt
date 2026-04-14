package com.medialog.biz.bord;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 게시판 리포지토리 테스트.
 * 저장, 조회, 삭제 기능을 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 90, Total Code Line : 90
 */
@DataJpaTest
class BoardRepositoryTest {

    @Autowired
    private BoardRepository boardRepository;

    /** 저장 후 전체 조회 검증 */
    @Test
    void save_and_findAll() {
        Board board = new Board();
        board.setTitle("테스트 제목");
        board.setDescription("테스트 내용");
        board.setRegDate("2026-04-09");

        boardRepository.save(board);

        List<Board> boards = boardRepository.findAll();
        assertEquals(1, boards.size());
        assertEquals("테스트 제목", boards.get(0).getTitle());
    }

    /** ID로 조회 검증 */
    @Test
    void findById() {
        Board board = new Board();
        board.setTitle("조회 테스트");
        board.setDescription("설명");
        board.setRegDate("2026-04-09");

        Board saved = boardRepository.save(board);

        Board found = boardRepository.findById(saved.getIdx()).orElse(null);
        assertNotNull(found);
        assertEquals("조회 테스트", found.getTitle());
    }

    /** 삭제 검증 */
    @Test
    void delete() {
        Board board = new Board();
        board.setTitle("삭제 테스트");
        board.setDescription("설명");
        board.setRegDate("2026-04-09");

        Board saved = boardRepository.save(board);
        boardRepository.deleteById(saved.getIdx());

        assertTrue(boardRepository.findById(saved.getIdx()).isEmpty());
    }

    /** 작성자 이름(authorName) 저장 및 조회 검증 */
    @Test
    void save_and_findByAuthorName() {
        Board board = new Board();
        board.setTitle("작성자 테스트");
        board.setDescription("내용");
        board.setRegDate("2026-04-14");
        board.setAuthorName("홍길동");

        Board saved = boardRepository.save(board);

        Board found = boardRepository.findById(saved.getIdx()).orElse(null);
        assertNotNull(found);
        assertEquals("홍길동", found.getAuthorName());
    }

    /** 조회수(viewCount) 기본값 및 수정 검증 */
    @Test
    void save_viewCountDefaultAndUpdate() {
        Board board = new Board();
        board.setTitle("조회수 테스트");
        board.setDescription("내용");
        board.setRegDate("2026-04-14");

        Board saved = boardRepository.save(board);
        assertEquals(0, saved.getViewCount());

        /* 조회수 증가 후 저장 */
        saved.setViewCount(5);
        boardRepository.save(saved);

        Board found = boardRepository.findById(saved.getIdx()).orElse(null);
        assertNotNull(found);
        assertEquals(5, found.getViewCount());
    }
}
