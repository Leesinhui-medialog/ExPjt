package com.medialog.biz.memb;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 회원 리포지토리.
 * 회원 엔티티에 대한 데이터 접근을 담당한다.
 *
 * @ai-generated
 * @generator Kiro
 * @author sinhuiyo
 * @line Kiro Edit Line : 28, Total Code Line : 28
 */
public interface MemberRepository extends JpaRepository<Member, Integer> {

    /**
     * 삭제 여부로 회원 목록을 조회한다.
     *
     * @param delYn 삭제 여부 ("N": 미삭제, "Y": 삭제)
     * @return 회원 목록
     */
    List<Member> findByDelYn(String delYn);

    /**
     * 이메일로 회원을 조회한다.
     *
     * @param email 이메일 주소
     * @return 회원 엔티티, 없으면 {@code null}
     */
    Member findByEmail(String email);

    /**
     * 이메일 중복 여부를 확인한다.
     *
     * @param email 이메일 주소
     * @return 존재하면 {@code true}
     */
    boolean existsByEmail(String email);
}
