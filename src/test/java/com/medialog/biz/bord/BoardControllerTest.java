package com.medialog.biz.bord;

import com.medialog.biz.comm.FileUploadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 게시판 컨트롤러 테스트.
 * 목록 조회, 상세 조회 API를 검증한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author Unknown
 * @line Kiro Edit Line : 70, Total Code Line : 70
 */
@WebMvcTest(BoardController.class)
class BoardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BoardService boardService;

    @MockitoBean
    private FileUploadService fileUploadService;

    /** 목록 조회 시 JSON 배열을 반환하는지 검증 */
    @Test
    void retrieveList_returnsJson() throws Exception {
        when(boardService.retrievePage(anyInt(), anyInt()))
                .thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/board/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    /** 상세 조회 시 게시글 정보를 반환하는지 검증 */
    @Test
    void retrieveDetail_found() throws Exception {
        Board board = new Board();
        board.setIdx(1);
        board.setTitle("테스트");
        when(boardService.retrieveById(1)).thenReturn(board);

        mockMvc.perform(get("/api/board/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("테스트"));
    }

    /** 존재하지 않는 게시글 조회 시 404를 반환하는지 검증 */
    @Test
    void retrieveDetail_notFound() throws Exception {
        when(boardService.retrieveById(999)).thenReturn(null);

        mockMvc.perform(get("/api/board/999"))
                .andExpect(status().isNotFound());
    }
}
