package com.medialog.biz.bord;

import com.medialog.biz.comm.FileUploadService;
import com.medialog.biz.mail.MailRequest;
import com.medialog.biz.mail.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * 게시판 서비스.
 * 게시글 CRUD 및 메일 알림 발송 로직을 처리한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 162, Total Code Line : 162
 */
@Slf4j
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final FileUploadService fileUploadService;
    private final MailService mailService;

    /** 메일 발신자 주소 */
    @Value("${spring.mail.username}")
    private String mailSender;

    /** 신규 등록 메일 제목 */
    @Value("${app.messages.mail-new-title}")
    private String mailNewTitle;

    /** 수정 메일 제목 */
    @Value("${app.messages.mail-edit-title}")
    private String mailEditTitle;

    /** 메일 발송 실패 경고 메시지 */
    @Value("${app.messages.mail-warn-fail}")
    private String mailWarnFail;

    /** 메일 수신자 주소 */
    @Value("${app.messages.mail-receiver}")
    private String mailReceiver;

    /**
     * 생성자 주입.
     *
     * @param boardRepository 게시판 리포지토리
     * @param fileUploadService 파일 업로드 서비스
     * @param mailService 메일 발송 서비스
     */
    public BoardService(BoardRepository boardRepository, FileUploadService fileUploadService, MailService mailService) {
        this.boardRepository = boardRepository;
        this.fileUploadService = fileUploadService;
        this.mailService = mailService;
    }

    /**
     * 전체 게시글 목록을 조회한다.
     *
     * @return 전체 게시글 리스트
     */
    public List<Board> retrieveAll() {
        log.info("전체 게시글 목록 조회");
        return boardRepository.findAll();
    }

    /**
     * 삭제되지 않은 게시글을 페이징 조회한다.
     *
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지당 게시글 수
     * @return 페이징된 게시글 목록
     */
    public Page<Board> retrievePage(int page, int size) {
        log.info("게시글 페이징 조회 - page: {}, size: {}", page, size);
        return boardRepository.findByDelYn("N",
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "regDate", "idx"))
        );
    }

    /**
     * 게시글을 ID로 조회한다.
     *
     * @param idx 게시글 고유 번호
     * @return 게시글 엔티티, 없으면 {@code null}
     */
    public Board retrieveById(int idx) {
        log.info("게시글 상세 조회 - idx: {}", idx);
        return boardRepository.findById(idx).orElse(null);
    }

    /**
     * 게시글을 저장(신규 등록 또는 수정)하고 알림 메일을 발송한다.
     * 메일 발송 실패 시에도 게시글 저장은 정상 진행된다.
     *
     * @param board 저장할 게시글 엔티티
     */
    public void save(Board board) {
        boolean isNew = (board.getIdx() == 0);
        log.info("게시글 저장 요청 - isNew: {}, title: {}", isNew, board.getTitle());

        /* 등록일이 없으면 오늘 날짜로 설정 */
        if (board.getRegDate() == null || board.getRegDate().isEmpty()) {
            board.setRegDate(java.time.LocalDate.now().toString());
        }
        /* 삭제 여부 기본값 설정 */
        if (board.getDelYn() == null) {
            board.setDelYn("N");
        }
        boardRepository.save(board);
        log.info("게시글 저장 완료 - idx: {}", board.getIdx());

        /* 메일 발송 (실패해도 게시글 저장은 유지) */
        try {
            MailRequest mail = new MailRequest();
            mail.setTitle(isNew ? mailNewTitle : mailEditTitle);
            mail.setSubject(board.getTitle());
            mail.setSender(mailSender);
            mail.setReceiver(mailReceiver);
            mail.setContent(board.getDescription());
            mailService.send(mail);
            log.info("게시글 알림 메일 발송 완료");
        } catch (Exception e) {
            log.warn(mailWarnFail, e.getMessage());
        }
    }

    /**
     * 게시글을 소프트 삭제한다.
     * 첨부파일이 있으면 물리 파일도 함께 삭제한다.
     *
     * @param idx 삭제할 게시글 고유 번호
     */
    public void softDelete(int idx) {
        log.info("게시글 소프트 삭제 요청 - idx: {}", idx);
        Board board = boardRepository.findById(idx).orElse(null);
        if (board != null) {
            /* 첨부파일이 있으면 물리 파일 삭제 */
            if (board.getFilePath() != null && !board.getFilePath().isEmpty()) {
                try {
                    fileUploadService.deleteByPath(board.getFilePath());
                    log.info("첨부파일 삭제 완료 - filePath: {}", board.getFilePath());
                } catch (IOException e) {
                    log.warn("첨부파일 삭제 실패 - filePath: {}, error: {}", board.getFilePath(), e.getMessage());
                }
            }
            board.setDelYn("Y");
            boardRepository.save(board);
            log.info("게시글 소프트 삭제 완료 - idx: {}", idx);
        } else {
            log.warn("삭제할 게시글을 찾을 수 없음 - idx: {}", idx);
        }
    }
}
