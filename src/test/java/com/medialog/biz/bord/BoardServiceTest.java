package com.medialog.biz.bord;

import com.medialog.biz.comm.FileUploadService;
import com.medialog.biz.mail.MailRequest;
import com.medialog.biz.mail.MailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 게시판 서비스 테스트.
 * 조회, 저장, 소프트 삭제, 메일 발송 로직을 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 181, Total Code Line : 181
 */
@ExtendWith(MockitoExtension.class)
class BoardServiceTest {

    @Mock
    private BoardRepository boardRepository;

    @Mock
    private FileUploadService fileUploadService;

    @Mock
    private MailService mailService;

    @InjectMocks
    private BoardService boardService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(boardService, "mailSender", "test@test.com");
        ReflectionTestUtils.setField(boardService, "mailNewTitle", "게시물 신규등록");
        ReflectionTestUtils.setField(boardService, "mailEditTitle", "게시물 수정");
        ReflectionTestUtils.setField(boardService, "mailWarnFail", "게시물 알림 메일 발송 실패: {}");
        ReflectionTestUtils.setField(boardService, "mailReceiver", "sinhuiyo@medialog.co.kr");
    }

    /** 전체 목록 조회 검증 */
    @Test
    void retrieveAll_returnsList() {
        Board board = new Board();
        board.setTitle("테스트");
        when(boardRepository.findAll()).thenReturn(List.of(board));

        List<Board> result = boardService.retrieveAll();

        assertEquals(1, result.size());
        assertEquals("테스트", result.get(0).getTitle());
    }

    /** 페이징 조회 검증 */
    @Test
    void retrievePage_returnsPage() {
        Board board = new Board();
        board.setTitle("페이지 테스트");
        Page<Board> page = new PageImpl<>(List.of(board));
        when(boardRepository.findByDelYn(any(String.class), any(Pageable.class))).thenReturn(page);

        Page<Board> result = boardService.retrievePage(0, 10);

        assertEquals(1, result.getTotalElements());
    }

    /** ID로 게시글 조회 성공 검증 */
    @Test
    void retrieveById_found() {
        Board board = new Board();
        board.setIdx(1);
        board.setTitle("조회");
        when(boardRepository.findById(1)).thenReturn(Optional.of(board));

        Board result = boardService.retrieveById(1);

        assertNotNull(result);
        assertEquals("조회", result.getTitle());
    }

    /** ID로 게시글 조회 실패 검증 */
    @Test
    void retrieveById_notFound() {
        when(boardRepository.findById(999)).thenReturn(Optional.empty());

        Board result = boardService.retrieveById(999);

        assertNull(result);
    }

    /** 저장 시 등록일 자동 설정 검증 */
    @Test
    void save_setsRegDate() {
        Board board = new Board();
        board.setTitle("저장");
        when(boardRepository.save(any(Board.class))).thenReturn(board);

        boardService.save(board);

        assertNotNull(board.getRegDate());
        assertEquals("N", board.getDelYn());
        verify(boardRepository).save(board);
    }

    /** 저장 시 메일 발송 및 수신자 검증 */
    @Test
    void save_sendsMailWithCorrectReceiver() throws Exception {
        Board board = new Board();
        board.setTitle("메일 테스트");
        board.setDescription("내용");
        when(boardRepository.save(any(Board.class))).thenReturn(board);

        boardService.save(board);

        ArgumentCaptor<MailRequest> captor = ArgumentCaptor.forClass(MailRequest.class);
        verify(mailService).send(captor.capture());
        MailRequest sent = captor.getValue();
        assertEquals("sinhuiyo@medialog.co.kr", sent.getReceiver());
        assertEquals("게시물 신규등록", sent.getTitle());
        assertEquals("메일 테스트", sent.getSubject());
    }

    /** 메일 발송 실패 시에도 게시글 저장은 정상 진행되는지 검증 */
    @Test
    void save_mailFailure_doesNotThrow() throws Exception {
        Board board = new Board();
        board.setTitle("메일실패");
        when(boardRepository.save(any(Board.class))).thenReturn(board);
        doThrow(new RuntimeException("SMTP 오류")).when(mailService).send(any(MailRequest.class));

        assertDoesNotThrow(() -> boardService.save(board));
        verify(boardRepository).save(board);
    }

    /** 소프트 삭제 시 delYn이 Y로 변경되는지 검증 */
    @Test
    void softDelete_setsDelYnToY() {
        Board board = new Board();
        board.setIdx(1);
        board.setDelYn("N");
        when(boardRepository.findById(1)).thenReturn(Optional.of(board));
        when(boardRepository.save(any(Board.class))).thenReturn(board);

        boardService.softDelete(1);

        assertEquals("Y", board.getDelYn());
        verify(boardRepository).save(board);
    }

    /** 첨부파일이 있는 게시글 삭제 시 물리 파일도 삭제되는지 검증 */
    @Test
    void softDelete_withFile_deletesPhysicalFile() throws Exception {
        Board board = new Board();
        board.setIdx(2);
        board.setDelYn("N");
        board.setFilePath("board/uuid_test.txt");
        when(boardRepository.findById(2)).thenReturn(Optional.of(board));
        when(boardRepository.save(any(Board.class))).thenReturn(board);

        boardService.softDelete(2);

        assertEquals("Y", board.getDelYn());
        verify(fileUploadService).deleteByPath("board/uuid_test.txt");
    }
}
