package com.medialog.biz.bord;

import com.medialog.biz.comm.FileUploadService;
import com.medialog.biz.comm.UploadFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

/**
 * 게시판 REST 컨트롤러.
 * 게시글 목록 조회, 상세 조회, 등록, 수정, 삭제 API를 제공한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 152, Total Code Line : 152
 */
@Slf4j
@RestController
@RequestMapping("/api/board")
public class BoardController {

    private final BoardService boardService;
    private final FileUploadService fileUploadService;

    /**
     * 생성자 주입.
     *
     * @param boardService 게시판 서비스
     * @param fileUploadService 파일 업로드 서비스
     */
    public BoardController(BoardService boardService, FileUploadService fileUploadService) {
        this.boardService = boardService;
        this.fileUploadService = fileUploadService;
    }

    /**
     * 게시글 목록을 페이징 조회한다.
     *
     * @param page 페이지 번호 (0부터 시작, 기본값 0)
     * @param size 페이지당 게시글 수 (기본값 10)
     * @return 페이징된 게시글 목록
     */
    @GetMapping("/list")
    public ResponseEntity<Page<Board>> retrieveList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("게시글 목록 조회 요청 - page: {}, size: {}", page, size);
        return ResponseEntity.ok(boardService.retrievePage(page, size));
    }

    /**
     * 게시글 상세를 조회한다.
     *
     * @param idx 게시글 고유 번호
     * @return 게시글 정보, 없으면 404
     */
    @GetMapping("/{idx}")
    public ResponseEntity<Board> retrieveDetail(@PathVariable int idx) {
        log.info("게시글 상세 조회 요청 - idx: {}", idx);
        Board board = boardService.retrieveById(idx);
        if (board == null) {
            log.warn("게시글을 찾을 수 없음 - idx: {}", idx);
            return ResponseEntity.notFound().build();
        }
        /* 조회수 증가 */
        board.setViewCount(board.getViewCount() + 1);
        boardService.save(board);
        log.info("게시글 조회수 증가 - idx: {}, viewCount: {}", idx, board.getViewCount());
        return ResponseEntity.ok(board);
    }

    /**
     * 게시글을 신규 등록한다.
     *
     * @param title 게시글 제목
     * @param description 게시글 내용
     * @param file 첨부파일 (선택)
     * @return 등록된 게시글 정보
     * @throws IOException 파일 업로드 실패 시
     */
    @PostMapping
    public ResponseEntity<Board> create(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile file,
            HttpSession session) throws IOException {
        log.info("게시글 등록 요청 - title: {}", title);
        Board board = new Board();
        board.setTitle(title);
        board.setDescription(description);
        /* 세션에서 로그인 사용자명을 작성자로 설정 */
        String loginMemberName = (String) session.getAttribute("loginMemberName");
        board.setAuthorName(loginMemberName != null ? loginMemberName : "익명");
        if (file != null && !file.isEmpty()) {
            UploadFile uploadFile = fileUploadService.upload(file, "board");
            board.setFilePath(uploadFile.getFilePath());
            board.setOriginalFileName(uploadFile.getOriginalName());
        }
        boardService.save(board);
        log.info("게시글 등록 완료 - idx: {}", board.getIdx());
        return ResponseEntity.ok(board);
    }

    /**
     * 게시글을 수정한다.
     *
     * @param idx 게시글 고유 번호
     * @param title 수정할 제목
     * @param description 수정할 내용
     * @param file 새 첨부파일 (선택, 기존 파일 교체)
     * @return 수정된 게시글 정보, 없으면 404
     * @throws IOException 파일 업로드 실패 시
     */
    @PutMapping("/{idx}")
    public ResponseEntity<Board> update(
            @PathVariable int idx,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile file) throws IOException {
        log.info("게시글 수정 요청 - idx: {}", idx);
        Board existing = boardService.retrieveById(idx);
        if (existing == null) {
            log.warn("수정할 게시글을 찾을 수 없음 - idx: {}", idx);
            return ResponseEntity.notFound().build();
        }
        existing.setTitle(title);
        existing.setDescription(description);
        if (file != null && !file.isEmpty()) {
            /* 기존 첨부파일이 있으면 물리 파일 삭제 후 새 파일 저장 */
            if (existing.getFilePath() != null && !existing.getFilePath().isEmpty()) {
                fileUploadService.deleteByPath(existing.getFilePath());
            }
            UploadFile uploadFile = fileUploadService.upload(file, "board");
            existing.setFilePath(uploadFile.getFilePath());
            existing.setOriginalFileName(uploadFile.getOriginalName());
        }
        boardService.save(existing);
        log.info("게시글 수정 완료 - idx: {}", idx);
        return ResponseEntity.ok(existing);
    }

    /**
     * 게시글을 소프트 삭제한다.
     *
     * @param idx 삭제할 게시글 고유 번호
     * @return 삭제 결과
     */
    @DeleteMapping("/{idx}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable int idx) {
        log.info("게시글 삭제 요청 - idx: {}", idx);
        boardService.softDelete(idx);
        log.info("게시글 삭제 완료 - idx: {}", idx);
        return ResponseEntity.ok(Map.of("result", "ok"));
    }
}
