# 변경 이력 (Change Log)

## 프로젝트: com.medialog.biz (Spring Boot)

---

### 1. 프로젝트 초기 구성

| 질의 | Spring Boot 기반 새 프로젝트 생성 |
|------|----------------------------------|
| 결과 | Spring Boot 3.4.4, Java 17, Gradle, MySQL + JPA, Lombok 구성. `com.medialog.biz` 패키지로 프로젝트 생성 완료. Gradle Wrapper 포함. |

---

### 2. HelloWorldService / Controller 생성

| 질의 | HelloWorldService.java에 read 메소드 생성, /hello URL로 결과 화면 표시 |
|------|----------------------------------------------------------------------|
| 결과 | `HelloWorldService.read()` → "Hello, World!" 반환. `HelloWorldController` GET `/hello` 엔드포인트 생성. JUnit 테스트 통과 확인. |

---

### 3. Board 패키지 구성 (Controller → Service → Repository)

| 질의 | board 패키지에 BoardController, BoardService, BoardRepository 생성 및 연결 |
|------|--------------------------------------------------------------------------|
| 결과 | `BoardController` → `BoardService` → `BoardRepository` 계층 구조 완성. `/board/read` JSON API 생성. |

---

### 4. Board 엔티티 필드 추가

| 질의 | BoardRepository에 idx, title, description, regDate 필드 추가 |
|------|-------------------------------------------------------------|
| 결과 | `Board` JPA 엔티티 생성 (idx, title, description, regDate). `BoardRepository`를 `JpaRepository<Board, Integer>` 인터페이스로 변경. |

---

### 5. H2 인메모리 DB 전환

| 질의 | H2 인메모리 DB로 전환 |
|------|----------------------|
| 결과 | `build.gradle`에 H2 의존성 추가. `application.yml`을 `jdbc:h2:mem:biz`로 변경. H2 콘솔 `/h2-console` 활성화. |

---

### 6. BoardRepository JUnit 테스트

| 질의 | BoardRepository JUnit 테스트 코드 생성 |
|------|---------------------------------------|
| 결과 | `@DataJpaTest`로 save_and_findAll, findById, delete 3개 테스트 생성. 삭제 제외 2개 테스트 통과 확인. |

---

### 7. 게시판 목록 화면 (Thymeleaf)

| 질의 | /board/list URL로 리스트 표시 화면 생성 |
|------|----------------------------------------|
| 결과 | Thymeleaf 의존성 추가. `list.html` 템플릿 생성. `BoardController`를 `@Controller`로 변경하여 HTML 뷰 반환. |

---

### 8. 게시글 작성 화면

| 질의 | 입력하는 화면 생성 |
|------|-------------------|
| 결과 | `write.html` 폼 생성 (제목, 내용). `BoardService.save()` 메소드 추가. 등록 후 목록으로 리다이렉트. 글쓰기 버튼 목록에 추가. |

---

### 9. 페이징 기능

| 질의 | list 하단에 페이징 추가 |
|------|------------------------|
| 결과 | `BoardService.readPage()` 메소드 추가 (Spring Data Pageable). 페이지당 10건, 이전/다음 + 페이지 번호 네비게이션 구현. |

---

### 10. 정렬 변경

| 질의 | 리스트를 regDate 역순으로 표시 |
|------|-------------------------------|
| 결과 | `Sort.by(Sort.Direction.DESC, "regDate", "idx")` 적용. 최신 등록일 순 정렬. |

---

### 11. 게시글 수정 화면

| 질의 | 수정 페이지 생성, 리스트 제목 클릭 시 수정 페이지 이동 |
|------|------------------------------------------------------|
| 결과 | `edit.html` 생성. `BoardService.findById()` 추가. `/board/edit` GET/POST 엔드포인트 추가. 목록에서 제목 클릭 → 수정 페이지 이동. |

---

### 12. 한글 입력 모드 설정

| 질의 | 글쓰기/수정 화면 제목 필드 한글 입력 모드 |
|------|------------------------------------------|
| 결과 | `ime-mode: active` CSS 속성 적용. 단, Chrome 데스크톱에서는 브라우저 제한으로 동작하지 않음 확인. |

---

### 13. 파일 업로드 기능

| 질의 | common 패키지에 파일 업로드 기능 생성, 루트 폴더 환경설정 |
|------|----------------------------------------------------------|
| 결과 | `FileUploadService`, `FileUploadController` 생성. `application.yml`에 `app.upload.root: C:/workspace/ExPjt/upload` 추가. 하위 폴더 지정 가능. |

---

### 14. 글쓰기 화면 첨부파일

| 질의 | write.html에 첨부파일 등록 기능 추가 |
|------|--------------------------------------|
| 결과 | 폼에 `enctype="multipart/form-data"` + 파일 input 추가. Board 엔티티에 `filePath` 필드 추가. 업로드 파일은 `upload/board/` 하위에 저장. |

---

### 15. 업로드 파일 DB 관리

| 질의 | FileUploadService에서 업로드 파일을 DB로 관리 |
|------|----------------------------------------------|
| 결과 | `UploadFile` 엔티티 생성 (originalName, storedName, filePath, subFolder, fileSize, contentType, regDate). `UploadFileRepository` 생성. 업로드 시 DB에 파일 정보 저장. |

---

### 16. Steering 규칙 등록

| 질의 | Javadoc 자동 생성 규칙, JUnit 테스트 자동 생성 규칙 Steering 등록 |
|------|------------------------------------------------------------------|
| 결과 | `.kiro/steering/java-javadoc.md` — 새 Java 파일에 `@ai-generated`, `@generator Kiro`, `@author` Javadoc 자동 포함. `.kiro/steering/java-junit-test.md` — 새 Java 파일 생성 시 대응 테스트 파일 자동 생성 + 수정 시 테스트도 함께 수정. |

---

### 17. 전체 JUnit 테스트 코드 생성

| 질의 | 현재까지 만든 파일에 대해 JUnit 테스트 코드 생성 |
|------|------------------------------------------------|
| 결과 | `HelloWorldControllerTest`, `BoardServiceTest`, `BoardControllerTest`, `FileUploadServiceTest`, `UploadFileRepositoryTest` 생성. 전체 22개 테스트 통과. |

---

### 18. 수정 화면 첨부파일 표시/수정

| 질의 | edit.html에 첨부파일 정보 표시 및 수정 가능하도록 변경 |
|------|------------------------------------------------------|
| 결과 | 수정 화면에 기존 첨부파일 표시 + 새 파일 선택 시 교체. 22개 테스트 통과. |

---

### 19. 리스트 첨부파일 아이콘 표시

| 질의 | list.html에 첨부파일 타입별 아이콘 표시 |
|------|----------------------------------------|
| 결과 | 📝 Word, 📊 Excel, 📙 PowerPoint, 📕 PDF, 🖼️ 이미지, 📎 기타 — 파일 확장자 기반 아이콘 표시. 첨부파일 없으면 아이콘 미표시. |

---

### 20. 소프트 삭제 (del_yn)

| 질의 | edit.html에 삭제 버튼 추가, del_yn 컬럼으로 소프트 삭제 |
|------|-------------------------------------------------------|
| 결과 | Board 엔티티에 `delYn` 필드 추가 (기본값 "N"). 삭제 버튼 클릭 시 `delYn="Y"` 변경. 리스트에서 `delYn="N"` 조건 필터링. `softDelete` 테스트 추가. 23개 테스트 통과. |

---

### 21. 첨부파일 원본 파일명 표시 + 다운로드

| 질의 | edit.html에 원본 파일명 표시 및 다운로드 가능하게 |
|------|--------------------------------------------------|
| 결과 | Board 엔티티에 `originalFileName` 필드 추가. `FileUploadController`에 `/api/upload/download` GET 엔드포인트 추가. edit.html에서 원본 파일명 클릭 시 다운로드. 22개 테스트 통과. |

---

### 22. 삭제 시 물리 파일 삭제

| 질의 | 삭제 버튼 처리 시 첨부파일 물리 파일도 삭제 |
|------|-------------------------------------------|
| 결과 | `FileUploadService.deleteByPath()` 메소드 추가. `BoardService.softDelete()`에서 첨부파일 있으면 물리 파일 삭제 후 soft delete 처리. 23개 테스트 통과. |

---

### 23. 첨부파일 미존재 시 경고 메시지

| 질의 | edit.html에서 첨부파일 클릭 시 파일이 없으면 에러 대신 경고 메시지로 변경 |
|------|-------------------------------------------------------------------------|
| 결과 | 다운로드 링크 클릭 시 JavaScript `fetch(HEAD)`로 파일 존재 여부 확인. 파일 없으면 `alert('첨부파일을 찾을 수 없습니다.')` 표시. 파일 있으면 정상 다운로드. |

---

### 24. change.md 변경 이력 문서 생성

| 질의 | 현재까지 작업에 대해 질의 내용과 결과를 change.md로 생성 |
|------|-------------------------------------------------------|
| 결과 | `change.md` 파일 생성. 전체 22개 작업 이력, 프로젝트 구조, 테스트 현황 정리. |

---

### 25. 공통 레이어 팝업 생성

| 질의 | alert를 대신할 공통 레이어 팝업 생성 |
|------|--------------------------------------|
| 결과 | `common/popup.html` Thymeleaf fragment 생성. `LayerPopup.alert()` / `LayerPopup.confirm()` 함수 제공. edit.html의 alert/confirm을 LayerPopup으로 교체. 모든 페이지에서 fragment include로 재사용 가능. |

---

### 26. 수정 화면 변경 감지

| 질의 | edit.html에서 변경 내용이 없으면 공통 레이어 confirm 표시 |
|------|--------------------------------------------------------|
| 결과 | 수정 버튼 클릭 시 제목/내용/첨부파일 변경 여부 확인. 변경 없으면 `LayerPopup.confirm('변경 내용이 없습니다. 그래도 저장하시겠습니까?')` 표시. |

---

### 27. 공통 CSS 분리

| 질의 | resource 폴더에 css/common.css 생성, HTML 공통 스타일 추출 |
|------|----------------------------------------------------------|
| 결과 | `static/css/common.css` 생성. body, form, label, input, textarea, button, table, 페이징, 첨부파일 등 공통 스타일 추출. list.html, write.html, edit.html에서 인라인 `<style>` 제거하고 `common.css` 링크로 교체. `.btn-delete`, `.btn-link`, `.paging`, `.file-info`, `.file-none`, `.file-hint`, `.container-narrow`, `.container-wide` 등 유틸 클래스 추가. |

---

### 28. 목록 화면 좌우 여백 추가

| 질의 | board list.html 좌우 여백이 없어 보기 힘듦 |
|------|------------------------------------------|
| 결과 | `common.css`의 body에 `padding: 0 24px` 추가. 모든 페이지에 좌우 24px 여백 적용. |

---

### 29. 수정 시 기존 첨부파일 삭제

| 질의 | edit.html에서 파일 변경 시 기존 파일 삭제 |
|------|------------------------------------------|
| 결과 | `BoardController.edit()`에서 새 파일 업로드 전 기존 `filePath`가 있으면 `fileUploadService.deleteByPath()`로 물리 파일 삭제 후 새 파일 저장. 23개 테스트 통과. |

---

### 30. Thymeleaf → React 프론트엔드 전환

| 질의 | Thymeleaf 프론트 화면을 React로 변경 |
|------|--------------------------------------|
| 결과 | `BoardController`를 `@RestController` + `/api/board/*` REST API로 전환. CORS 설정 (`WebConfig.java`) 추가. `frontend/` 폴더에 Vite + React 프로젝트 생성. BoardList, BoardWrite, BoardEdit 페이지 컴포넌트, LayerPopup, FileIcon 공통 컴포넌트 구현. API 프록시 설정 (`/api` → `localhost:8080`). 22개 백엔드 테스트 통과. |

---

### 31. Kiro Agent Hooks 등록 + Steering 정리

| 질의 | Java 파일 저장 시 JUnit 테스트 생성, 코드 품질 검사, 의존성 확인, JavaDoc 생성, 설정 검증, 코드 포맷팅 Hook 등록. Steering 중복 항목 제거. |
|------|--------------------------------------------------------------------------------------------------------------------------------------------|
| 결과 | `java-javadoc.md`, `java-junit-test.md` Steering 삭제. 6개 Hook 등록: JUnit 테스트 자동 생성, JavaDoc 자동 생성, 코드 품질 검사(SpotBugs), Gradle 의존성 확인, Spring Boot 설정 검증, Java 코드 포맷팅(Google Java Format). |

---

### 32. 폼메일 발송 기능 구현

| 질의 | 타이틀, 제목, 발신자, 수신자, 내용을 입력하는 폼메일 양식 생성 (네이버 SMTP) |
|------|---------------------------------------------------------------------------|
| 결과 | `spring-boot-starter-mail` 의존성 추가. `application.yml`에 네이버 SMTP 설정 추가. `MailRequest` DTO, `MailService` (JavaMailSender), `MailController` (`POST /api/mail/send`) 생성. React `MailForm` 페이지 생성 (`/mail` 라우트). LayerPopup으로 발송 결과 표시. |

---

### 33. 메일 패키지 JUnit 테스트 생성

| 질의 | biz/mail 폴더 하위 Java 파일에 대한 JUnit 테스트 코드 생성 |
|------|----------------------------------------------------------|
| 결과 | `MailServiceTest` (Mockito — send 성공, null sender 예외), `MailControllerTest` (WebMvcTest — send 성공/실패) 생성. 4개 테스트 통과. |

---

### 34. 메일 발송 테스트 시도

| 질의 | 네이버/Gmail SMTP로 실제 메일 발송 테스트 |
|------|------------------------------------------|
| 결과 | 네이버 SMTP는 인증 실패(AUTH LOGIN failed) — POP3/SMTP, IMAP/SMTP 설정, 해외 로그인 차단 해제 모두 시도했으나 미해결. Gmail SMTP(앱 비밀번호)로 전환하여 발송 성공. `application.yml`을 `smtp.gmail.com:587` + 앱 비밀번호로 설정. `sinhuiyo@gmail.com` → `sinhuiyo@medialog.co.kr` 발송 확인. |

---

### 35. 게시물 등록/수정 시 메일 알림 발송

| 질의 | BoardService에서 신규등록/수정 시 MailService로 메일 발송 |
|------|--------------------------------------------------------|
| 결과 | `BoardService.save()`에서 신규(`idx==0`) → 타이틀 "게시물 신규등록", 수정 → "게시물 수정"으로 구분하여 `MailService.send()` 호출. 제목은 게시물 title, 내용은 description. 발송 실패해도 게시물 저장은 정상 진행(try/catch). 수신자를 `sinhuiyo@medialog.co.kr`로 설정. |

---

### 36. Spring Boot 서버 재시작

| 질의 | 서버 재시작 요청 |
|------|-----------------|
| 결과 | 기존 `gradlew.bat bootRun` 프로세스 중지 후 재시작. Gradle 빌드 → 컴파일 → Tomcat 포트 8080 정상 기동 확인. `BizApplication` 약 5초 내 시작 완료. |

---

### 37. PowerShell gradlew.bat 실행 오류 해결

| 질의 | `gradlew.bat bootRun` 실행 시 `CommandNotFoundException` 오류 발생 원인 및 해결 방법 |
|------|----------------------------------------------------------------------------------|
| 결과 | PowerShell에서 현재 디렉토리의 실행 파일을 실행할 때 `.\` 접두사가 필요함. `gradlew.bat bootRun` → `.\gradlew.bat bootRun`으로 변경하여 해결. PowerShell은 CMD와 달리 현재 디렉토리를 PATH에 자동 포함하지 않기 때문. |

---

### 38. application.yml app 설정 분리 (완료)

| 질의 | application.yml의 app 관련 내용을 별도 파일로 분리 |
|------|--------------------------------------------------|
| 결과 | `application-app.yml` 파일 생성하여 `app:` 섹션(upload, messages) 분리. `application.yml`에 `spring.profiles.include: app` 추가하여 자동 로드. 기존 동작과 동일하게 유지. |

---

### 39. MailController / FileUploadController 삭제 검토 (보류)

| 질의 | application.yml의 app 관련 내용을 별도 파일로 분리 |
|------|--------------------------------------------------|
| 결과 | `application-app.yml` 파일 생성하여 `app:` 섹션(upload, messages) 분리. `application.yml`에 `spring.profiles.include: app` 추가하여 자동 로드. 기존 동작과 동일하게 유지. |

---

### 39. MailController / FileUploadController 삭제 검토 (보류)

| 질의 | MailController.java, FileUploadController.java를 외부에서 호출되지 않게 삭제 요청 |
|------|-------------------------------------------------------------------------------|
| 결과 | 삭제 전 참조 확인 결과, 프론트엔드에서 두 API 모두 사용 중. `MailForm.jsx` → `/api/mail/send` (MailController), `BoardEdit.jsx` → `/api/upload/download` (FileUploadController). 삭제 시 메일 발송 폼과 첨부파일 다운로드 기능이 동작하지 않게 되므로 보류. 프론트엔드 호출 부분도 함께 제거할지 사용자 확인 대기 중. |

---

### 40. use-uv Steering 제외 검토 (보류)

| 질의 | 현재 프로젝트에서 use-uv steering을 사용하지 않게 해달라 |
|------|-------------------------------------------------------|
| 결과 | `use-uv.md`는 글로벌 steering(`~/.kiro/steering/`)에 위치하여 모든 프로젝트에 적용됨. 프로젝트별 제외 기능은 없으므로 두 가지 방안 제시: (1) 글로벌 파일 삭제 — 모든 프로젝트에서 미적용, (2) `inclusion: manual`로 변경 — `#use-uv`로 명시 호출 시에만 적용. Java/Spring Boot 프로젝트라 Python/uv 불필요하므로 2번 방안 권장. 사용자 확인 대기 중. |

---

### 41. ExPjt 전용 워크스페이스 Steering 생성

| 질의 | ExPjt에만 사용 가능한 Steering 생성 요청 |
|------|----------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 생성. 프로젝트 개요, Java/React 코드 규칙, 설정 분리 규칙, 빌드/실행 명령, Python/uv 미적용 명시. 워크스페이스 레벨로 적용되어 이 프로젝트에서만 동작하며, 글로벌 규칙과 충돌 시 우선 적용됨. |

---

### 42. expjt-rules Steering에 프로젝트 설명 추가

| 질의 | expjt-rules에 프로젝트 설명 추가 — 미디어로그에서 필요로 하는 Hook, Steering, Power 가이드 프로젝트 |
|------|------------------------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md`에 프로젝트 설명 섹션 추가. "미디어로그에서 필요로 하는 Kiro의 Hook, Steering, Power 기능에 대한 가이드를 만드는 프로젝트. Spring Boot + React 기반 샘플 애플리케이션을 구축하면서 각 기능의 활용법을 실습하고 문서화한다." |

---

### 43. expjt-rules Steering에 언어 규칙 추가

| 질의 | 언어 규칙은 한글로 작성한다 |
|------|--------------------------|
| 결과 | `.kiro/steering/expjt-rules.md`에 언어 규칙 섹션 추가. 응답, 문서, 주석, 커밋 메시지 등 모든 텍스트를 한글로 작성하도록 명시. |

---

### 44. expjt-rules Steering 언어 규칙 보완

| 질의 | 모든 답변을 한글로 작성할 수 있게 steering에 추가 |
|------|------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 언어 규칙 업데이트. "모든 답변, 응답, 문서, 주석, 커밋 메시지 등 모든 텍스트는 한글로 작성한다" + "코드 내 변수명, 클래스명 등 프로그래밍 식별자는 영문 허용" 명시. |

---

### 45. expjt-rules Steering에 Git 규칙 추가

| 질의 | git commit, git push는 git 명령어로 실행하지 않고 반드시 수작업으로 진행한다 |
|------|-------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md`에 Git 규칙 섹션 추가. "git commit, git push는 명령어로 자동 실행하지 않고 반드시 사용자가 수작업으로 진행한다" 명시. |

---

### 46. Java 코드 품질 검사 Hook 등록

| 질의 | 코드 품질 측정하는 Hook 등록, 30초 이상 실행 시작이 안되면 멈추게 설정 |
|------|------------------------------------------------------------------|
| 결과 | `java-quality-check` Hook 생성. Java 파일 저장 시 코드 품질 검사 실행 — 미사용 import, 중복 코드, 네이밍 규칙, 메소드 길이(30줄 초과 경고), 순환 복잡도, 예외 처리 적절성, null 안전성 확인. 30초 타임아웃 설정. |

---

### 47. expjt-rules Steering에 네이밍 규칙 추가

| 질의 | 약어는 Full Name으로 변경하여 작성되게 하고, 관련 약어는 필요할 때마다 등록 (예: custId → customerId) |
|------|----------------------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md`에 네이밍 규칙 섹션 추가. 약어 사용 금지 및 Full Name 작성 원칙 명시. 약어 → Full Name 매핑 테이블 생성하여 `custId → customerId` 등록. 새로운 약어는 필요 시 목록에 추가. |

---

### 48. 약어 매핑 추가 (custNm, addr)

| 질의 | custNm, addr 약어 Full Name 매핑 추가 |
|------|---------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 약어 매핑 테이블에 `custNm → customerName`, `addr → address` 추가. |

---

### 49. 약어 매핑 추가 (dabvAddr ~ trmMdlCd)

| 질의 | 약어 Full Name 매핑 다수 추가 |
|------|------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 약어 매핑 테이블에 다음 항목 추가: `dabvAddr → dongAboveAddress`, `billAcntId → billingAccountId`, `entrId → entryId`, `prodCd → productCode`, `prodNm → productName`, `tlno → telephoneNumber`, `stusCd → statusCode`, `svcCd → serviceCode`, `trmMdlCd → terminalModelCode`. |

---

### 50. expjt-rules Steering에 파일 변경 규칙 추가

| 질의 | 현재 열려져 있지 않은 소스를 변경할 때는 반드시 문의 후 변경 진행하도록 steering에 추가 |
|------|----------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md`에 파일 변경 규칙 섹션 추가. "현재 에디터에 열려져 있지 않은 소스 파일을 변경할 때는 반드시 사용자에게 문의 후 진행한다. 열려 있는 파일만 바로 수정 가능." 명시. |

---

### 51. expjt-rules Steering에 업무코드 기반 패키지 구조 등록

| 질의 | 패키지 구조를 업무코드 기준으로 작성하며, 업무코드 구분/업무코드/설명으로 steering에 등록 (계정, ACCT, Account) |
|------|------------------------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 패키지 구조를 `com.medialog.biz.{업무코드}`로 변경. 업무코드 목록 테이블 생성하여 `계정 / ACCT / Account` 등록. 새로운 업무코드는 필요 시 목록에 추가. |

---

### 52. 업무코드 목록 등록 (10개)

| 질의 | 업무코드 10개 등록 및 패키지명 소문자로 설정 |
|------|------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 업무코드 목록에 패키지명 컬럼 추가 후 10개 등록: 계정(acct), 고객지원(cusp), 권한(auth), 로그인(lgin), 메인(main), 개통(open), 요금제(prpl), 유심구매(usby), 컨텐츠(cntn), 통계(stat). 패키지 경로 예시: `com.medialog.biz.acct`. |

---

### 53. expjt-rules Steering에 메소드 네이밍 규칙 추가

| 질의 | 메소드 네이밍 규칙 등록 — retrieve: 조회 |
|------|---------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md`에 메소드 네이밍 규칙 테이블 추가. `retrieve → 조회` 등록. 새로운 메소드 접두어는 필요 시 목록에 추가. |

---

### 54. 메소드 네이밍 규칙 추가 (create ~ export)

| 질의 | 메소드 네이밍 규칙 추가 — create, update, delete, save, export |
|------|-----------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 메소드 네이밍 규칙 테이블에 추가: `create → 단건등록`, `update → 단건수정`, `delete → 삭제`, `save → 등록/수정/삭제가 혼합`, `export → 파일내보내기`. |

---

### 55. 메시지 코드 관리 규칙 추가

| 질의 | 메시지 코드는 biz-{업무코드}.properties 파일로 관리 |
|------|------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 설정 섹션에 메시지 코드 관리 규칙 추가. `biz-{업무코드}.properties` 형태로 업무별 메시지 파일 관리 (예: `biz-acct.properties`, `biz-cusp.properties`). |

---

### 56. 메시지 코드 작성 규칙 상세 추가

| 질의 | 메시지는 key=value 형태, key는 [시스템코드].[업무코드].[일련번호], value 치환은 {n} 구조로 0부터 시작 |
|------|--------------------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 설정 섹션에 메시지 작성 규칙 상세 추가. key 형식: `biz.{업무코드}.{일련번호}` (예: `biz.acct.001`). value 치환: `{0}`부터 시작 (예: `{0}님의 계정이 생성되었습니다.`). |

---

### 57. 업무코드 추가 (공통)

| 질의 | 업무코드에 공통, COMM, common 추가 |
|------|----------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 업무코드 목록에 `공통 / COMM / comm / Common` 추가. |

---

### 58. 코딩 규칙 추가

| 질의 | 코딩 규칙 등록 — 인코딩, 주석, 중복 금지, 민감정보 하드코딩 금지, 보안 주의 |
|------|------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md`에 코딩 규칙 섹션 추가. UTF-8 인코딩, 모든 코드에 상세 주석 기술, 소스코드 중복 금지, 민감정보 하드코딩 금지, 기능/성능/보안 주의 명시. |

---

### 59. Lombok 어노테이션 사용 규칙 추가

| 질의 | @AllArgsConstructor, @RequiredArgsConstructor 사용 금지. @Getter, @Setter, @ToString은 VO 클래스에만 사용 |
|------|--------------------------------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙에 Lombok 어노테이션 사용 규칙 추가. `@AllArgsConstructor`, `@RequiredArgsConstructor` 금지. `@Getter`, `@Setter`, `@ToString`은 VO 클래스에만 허용. |

---

### 60. @Slf4j 로그 규칙 추가

| 질의 | 로그 생성을 위해 Class 파일에 @Slf4j를 등록한다 |
|------|---------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙에 `@Slf4j` 등록 규칙 추가. 모든 Class 파일에 로그 생성을 위해 `@Slf4j` 어노테이션을 사용한다. |

---

### 61. @ToString exclude 규칙 추가

| 질의 | VO 객체에 @ToString 작성 시 불필요한 필드 제외를 위해 exclude 포함, 제외 컬럼은 수동 지정 |
|------|----------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙에 `@ToString(exclude = {...})` 규칙 추가. VO 객체에 `@ToString` 작성 시 `exclude`를 포함하여 불필요한 필드를 제외할 수 있도록 하며, 제외 컬럼은 수동으로 지정. |

---

### 62. @ToString includeFieldNames 규칙 추가

| 질의 | @ToString에 필드명을 포함한다 |
|------|---------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙 업데이트. `@ToString(includeFieldNames = true)` 명시하여 필드명 포함을 기본으로 설정. |

---

### 63. @ToString callSuper 규칙 추가

| 질의 | @ToString에 기본적으로 callSuper는 true로 설정한다 |
|------|----------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙 업데이트. `@ToString(includeFieldNames = true, callSuper = true)` 명시하여 부모 클래스 정보도 포함하도록 설정. |

---

### 64. VO 클래스 @EqualsAndHashCode 규칙 추가

| 질의 | VO에 @EqualsAndHashCode를 넣어준다 |
|------|----------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙 업데이트. VO 클래스 허용 어노테이션에 `@EqualsAndHashCode` 추가. |

---

### 65. Lombok 어노테이션 사용 금지 추가

| 질의 | @Data, @Value, @Cleanup, @SneakyThrows, @Synchronized 사용 금지 |
|------|--------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙에 `@Data`, `@Value`, `@Cleanup`, `@SneakyThrows`, `@Synchronized` 사용 금지 추가. |

---

### 66. 업무코드 추가 (게시판)

| 질의 | 업무코드에 게시판, BORD, board 추가 |
|------|----------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 업무코드 목록에 `게시판 / BORD / board / Board` 추가. |

---

### 67. 파일명/변수명 네이밍 규칙 추가

| 질의 | 파일명은 업무코드를 사용하되, 변수명은 Full Name을 원칙으로 한다 |
|------|--------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 네이밍 규칙 업데이트. 파일명(클래스명)은 업무코드 사용 (예: `AcctController.java`, `BordService.java`). 변수명/메소드명/필드명은 Full Name 원칙. |

---

### 68. steering 규칙 기반 전체 소스 변경 검토 (확인 대기)

| 질의 | steering에 등록되어 있는 규칙으로 ExPjt 전체를 변경 요청 |
|------|---------------------------------------------------|
| 결과 | 변경 필요 항목 분석 완료. 열려 있는 파일(`Board.java`, `BoardControllerTest.java`)은 바로 수정 가능. 열려 있지 않은 파일(`BoardController.java`, `BoardService.java`, `BoardRepository.java`, `HelloWorldController.java`, `HelloWorldService.java`, `MailController.java`, `MailService.java`, `MailRequest.java`, `FileUploadController.java`, `FileUploadService.java`, `UploadFile.java`, `WebConfig.java`, 테스트 파일들)은 파일 변경 규칙에 따라 사용자 확인 대기 중. 주요 변경 내용: `@Slf4j` 추가, VO에 `@ToString`/`@EqualsAndHashCode` 적용, 메소드명 규칙 적용(read→retrieve 등), 주석 상세화. |

---

### 69. steering 규칙 기반 전체 소스 일괄 수정 (완료)

| 질의 | steering에 등록된 규칙으로 ExPjt 전체 소스를 일괄 변경 |
|------|--------------------------------------------------|
| 결과 | 전체 Java 소스 및 테스트 파일 일괄 수정 완료. 주요 변경: (1) `@RequiredArgsConstructor` → 생성자 주입으로 변경, (2) VO 클래스에 `@ToString(includeFieldNames=true, callSuper=true)`, `@EqualsAndHashCode` 추가, (3) 모든 Class에 `@Slf4j` 추가 및 로그 출력, (4) 메소드명 규칙 적용 (`read`→`retrieveAll`, `readPage`→`retrievePage`, `findById`→`retrieveById`), (5) 모든 파일에 상세 Javadoc 주석 추가, (6) 테스트 파일도 메소드명 변경에 맞춰 업데이트. 전체 28개 테스트 통과. |

---

### 70. 패키지 구조 업무코드 변경 검토 (확인 대기)

| 질의 | Java 패키지 구조가 업무코드로 변경되지 않았으므로 변경 요청 |
|------|-----------------------------------------------------|
| 결과 | 변경 대상 분석 완료. `board` 패키지는 업무코드와 일치하여 변경 불필요. `common` → `comm`으로 변경 필요. `HelloWorldController/Service` → `main` 패키지로 이동 필요. `mail` 패키지는 업무코드 목록에 없어 신규 등록 여부 사용자 확인 대기 중. |

---

### 71. 패키지 구조 업무코드 기준 변경 (완료)

| 질의 | 패키지 구조를 업무코드로 변경, 메일 업무코드 추가(MAIL/mail/Mail Send), 게시판 패키지명 bord로 변경 |
|------|----------------------------------------------------------------------------------|
| 결과 | steering에 메일 업무코드 `메일 / MAIL / mail / Mail Send` 추가, 게시판 패키지명 `board` → `bord` 변경. 패키지 구조 일괄 변경: `board` → `bord`, `common` → `comm`, `HelloWorld*` → `main` 패키지로 이동, `mail` 유지. 모든 패키지 선언 및 import 수정. 전체 28개 테스트 통과. |

---

### 72. 이동 후 빈 폴더 삭제

| 질의 | 이동되어서 파일이 없는 폴더 삭제 요청 |
|------|----------------------------------|
| 결과 | 빈 폴더 4개 삭제 완료: `src/main/java/com/medialog/biz/board`, `src/main/java/com/medialog/biz/common`, `src/test/java/com/medialog/biz/board`, `src/test/java/com/medialog/biz/common`. |

---

### 73. 서버 재시작

| 질의 | 서버 실행 요청 |
|------|--------------|
| 결과 | 기존 포트 8080 사용 중인 프로세스 종료 후 `gradlew.bat bootRun` 재시작. Tomcat 포트 8080 정상 기동 확인. BizApplication 약 3.6초 내 시작 완료. |

---

### 74. 실시간 로그 확인

| 질의 | 서버 실시간 로그 확인 요청 |
|------|------------------------|
| 결과 | 서버 정상 동작 확인. JPA EntityManagerFactory 초기화 완료, CORS 설정 적용(localhost:3000), H2 콘솔 활성화(`/h2-console`, `jdbc:h2:mem:biz`), Tomcat 포트 8080 기동, BizApplication 3.6초 내 시작 완료. 에러/경고 없음. |

---

### 75. 실시간 로그 grep 확인

| 질의 | 실시간 로그를 grep 해서 확인 요청 |
|------|-------------------------------|
| 결과 | 서버 로그 필터링 확인. DispatcherServlet 초기화 완료(4ms), 게시글 목록 조회 요청(page:0, size:10) 수신, Hibernate SELECT 쿼리 정상 실행. WARN 1건 — PageImpl JSON 직렬화 안정성 경고(Spring Data PagedModel 사용 권장). 에러 없음, 서버 정상 동작 중. |

---

### 76. 실시간 로그 확인 방법 안내

| 질의 | ExPjt의 실시간 로그를 보려면 어떻게 해야 하는지 |
|------|-------------------------------------------|
| 결과 | 3가지 방법 안내. (1) 터미널에서 `.\gradlew.bat bootRun` 직접 실행 — 콘솔에 실시간 출력, (2) `application.yml`에 `logging.file.name: logs/biz.log` 설정 후 `Get-Content logs/biz.log -Wait`로 tail, (3) Kiro 채팅에서 "실시간 로그 보여줘" 요청. 가장 실용적인 방법은 1번(터미널 직접 실행), 운영 환경에서는 2번(파일 로깅) 권장. |

---

### 77. 파일 로깅 설정 추가

| 질의 | 실시간 로그를 파일로 출력하도록 설정 (2번 방법) |
|------|------------------------------------------|
| 결과 | `application.yml`에 `logging.file.name: logs/biz.log` 추가. 서버 재시작 후 `logs/biz.log` 파일에 로그 출력. PowerShell에서 `Get-Content logs/biz.log -Wait`로 실시간 확인 가능. |

---

### 78. 서버 재시작 및 로그 파일 확인

| 질의 | 서버 재시작 및 터미널에서 실시간 로그 확인 방법 요청 |
|------|----------------------------------------------|
| 결과 | 서버 재시작 완료, `logs/biz.log` 파일 정상 생성 확인. 터미널에서 `Get-Content logs/biz.log -Wait` 명령어로 실시간 로그 확인 가능. |

---

### 79. 로그 한글 깨짐 해결

| 질의 | 로그에 한글이 깨지는 문제 해결 요청 |
|------|-------------------------------|
| 결과 | `build.gradle`에 UTF-8 인코딩 설정 추가. `bootRun { jvmArgs = ['-Dfile.encoding=UTF-8', '-Dconsole.encoding=UTF-8'] }`, `tasks.withType(JavaCompile) { options.encoding = 'UTF-8' }`. 서버 재시작 후 한글 로그 정상 출력. |

---

### 80. 서버 재시작 (UTF-8 인코딩 적용)

| 질의 | 서버 재시작 및 터미널 실시간 로그 확인 요청 |
|------|---------------------------------------|
| 결과 | `build.gradle` UTF-8 설정 적용 후 서버 재시작 완료. Tomcat 포트 8080 정상 기동. 터미널에서 `Get-Content logs/biz.log -Wait -Encoding UTF8` 명령어로 한글 포함 실시간 로그 확인 가능. |

---

### 81. MailForm.jsx 현대카드 안내 메일 스타일로 교체

| 질의 | MailForm.jsx를 첨부 이미지(현대카드 안내 메일) 디자인으로 교체 |
|------|------------------------------------------------------|
| 결과 | `MailForm.jsx`를 현대카드 안내 메일 스타일 HTML 템플릿으로 교체. 안내 제목, 안내 내용, 종료 일자, 대상 카드, 대상 서비스 입력 필드 추가. 미리보기 기능 포함. `MailService.java`의 `setText` 두 번째 파라미터를 `true`로 변경하여 HTML 메일 발송 지원. |

---

### 82. MailForm 현대카드 → 미디어로그 명칭 변경

| 질의 | MailForm 현대카드 명칭을 미디어로그로 변경 |
|------|--------------------------------------|
| 결과 | `MailForm.jsx` HTML 템플릿에서 `Hyundai Card` → `Medialog`, `현대카드 안내` → `미디어로그 안내`로 변경. |

---

### 83. MailForm URL 안내

| 질의 | MailForm을 볼 수 있는 URL 요청 |
|------|----------------------------|
| 결과 | `http://localhost:3000/mail` — App.jsx에서 `/mail` 라우트로 MailForm 컴포넌트 매핑 확인. 프론트엔드 개발 서버(`npm run dev`) 실행 필요. |

---

### 84. JavaDoc Hook @author에 Kiro 로그인 계정 적용

| 질의 | Hook JavaDoc 자동 생성의 @author 뒤에 Kiro 로그인 계정이 들어갈 수 있게 수정 |
|------|----------------------------------------------------------------------|
| 결과 | `.kiro/hooks/java-javadoc-gen.kiro.hook` 프롬프트 수정. `@author Unknown` → `@author {현재 Kiro 로그인 계정 또는 시스템 사용자명}`으로 변경. Hook 실행 시 현재 작업 중인 사용자의 계정명을 자동 적용. |

---

### 85. steering @author 규칙 수정 확인

| 질의 | steering도 수정이 필요하면 수정 요청 |
|------|-------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md`의 Javadoc 규칙을 `@author {현재 Kiro 로그인 계정}`으로 업데이트 완료 확인. Hook과 steering 모두 동일한 규칙 적용. |

---

### 86. JavaDoc 자동 생성 Hook 샘플 확인

| 질의 | JavaDoc 자동 생성 Hook 결과를 샘플로 확인 요청 |
|------|----------------------------------------|
| 결과 | Hook 동작 샘플 확인. 클래스 레벨: `@ai-generated`, `@generator Kiro`, `@author {Kiro 로그인 계정}` 포함 Javadoc 자동 생성. 메소드 레벨: 파라미터(`@param`), 반환값(`@return`), 설명 포함 Javadoc 자동 생성. 기존 Javadoc이 있으면 수정하지 않음. Java 파일 저장 시 자동 실행. |

---

### 87. JavaDoc Hook에 자동 생성 라인수 추가

| 질의 | JavaDoc 자동 생성 Hook에 Kiro가 자동 생성한 라인수를 포함하도록 변경, steering에도 추가 |
|------|-------------------------------------------------------------------------|
| 결과 | Hook 프롬프트에 `@lines {Kiro가 자동 생성한 총 라인수}` 추가. steering 규칙도 `@lines` 포함하도록 업데이트. 샘플: `@ai-generated`, `@generator Kiro`, `@author {계정}`, `@lines 58`. |

---

### 88. JavaDoc @line 형식 변경

| 질의 | `@lines 58` 형식을 `@line Kiro Edit Line : 라인수, Total Code Line : 전체코드수` 형식으로 Hook과 steering 변경 |
|------|-----------------------------------------------------------------------------------------------|
| 결과 | Hook 프롬프트와 steering 규칙 모두 변경 완료. 샘플: `@line Kiro Edit Line : 45, Total Code Line : 58`. |

---

### 89. Java 코드 포맷 검사 Hook 생성

| 질의 | Java 코드 포맷 검사 Hook 생성 요청 |
|------|----------------------------------|
| 결과 | `java-code-format` Hook 생성. Java 파일(`**/*.java`) 저장 시 프로젝트 코딩 규칙 자동 검사: 금지 어노테이션 사용 여부(`@AllArgsConstructor`, `@Data` 등), VO 전용 어노테이션 적절 사용, `@Slf4j` 등록 여부, Javadoc 존재 여부, 메소드 네이밍 규칙(retrieve/create/update/delete/save/export), 패키지 구조(`com.medialog.biz.{업무코드}`), 주석 충실도, 민감 정보 하드코딩 여부. 위반 시 라인과 수정 방법 안내, 통과 시 "코드 포맷 검사 통과" 메시지 표시. |

---

### 90. 코딩 규칙 추가 (와일드카드 임포트 금지, 클래스명 파스칼표기법)

| 질의 | 와일드카드 임포트 사용 금지, 클래스명은 파스칼표기법 + 명사/명사구 규칙 추가 |
|------|----------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙에 2개 항목 추가. (1) 와일드카드 임포트(`import xxx.*`) 사용 금지, (2) 클래스명은 파스칼표기법(PascalCase) 사용 및 명사 또는 명사구 이용. |

---

### 91. 코딩 규칙 추가 (와일드카드 임포트 금지, 클래스명 파스칼표기법)

| 질의 | 코딩 규칙 Steering에 와일드카드 임포트 사용 금지, 클래스명은 파스칼표기법 + 명사/명사구 규칙 추가 |
|------|-------------------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 코딩 규칙에 2개 항목 추가. (1) 와일드카드 임포트(`import xxx.*`) 사용 금지, (2) 클래스명은 파스칼표기법(PascalCase) 사용 및 명사 또는 명사구 이용. |

---

### 92. Steering 파일 타입별 분리 (Java / XML·설정)

| 질의 | Steering을 Java 파일과 XML 파일을 분리해서 적용할 수 있도록 분리 요청 |
|------|-----------------------------------------------------------|
| 결과 | 기존 `expjt-rules.md`를 3개 파일로 분리. (1) `expjt-rules.md` — 공통 규칙(항상 적용): 프로젝트 개요, React, 빌드/실행, 언어, 파일 변경, Git 규칙. (2) `expjt-java-rules.md` — Java 전용 규칙(`**/*.java` fileMatch 적용): 패키지 구조, 업무코드, 메소드 네이밍, Javadoc, 코딩 규칙, Lombok 제한, 네이밍/약어 매핑. (3) `expjt-xml-rules.md` — XML/설정 전용 규칙(`**/*.{xml,yml,yaml,html,properties}` fileMatch 적용): 설정 파일 분리, 메시지 코드, HTML 템플릿 규칙. `fileMatch` inclusion으로 해당 파일 타입을 에디터에서 열었을 때만 규칙이 컨텍스트에 포함됨. |

---

### 93. 업무코드 목록 공통 Steering으로 이동

| 질의 | 업무코드 참조는 공통 Steering에 넣어달라 |
|------|--------------------------------------|
| 결과 | 업무코드 목록을 `expjt-rules.md`(공통 steering)로 이동. `expjt-java-rules.md`와 `expjt-xml-rules.md`에서 업무코드 목록 제거하고 "공통 steering 참조"로 변경. 파일 타입에 관계없이 업무코드가 항상 컨텍스트에 포함되도록 개선. |

---

### 94. 메소드 네이밍 규칙 추가 (list, listForPage)

| 질의 | Java 메소드 네이밍 규칙에 list(목록), listForPage(목록-페이지) 추가 |
|------|-------------------------------------------------------------|
| 결과 | `.kiro/steering/expjt-java-rules.md` 메소드 네이밍 규칙 테이블에 `list → 목록`, `listForPage → 목록-페이지` 추가. |

---

### 95. 업무코드 추가 (회원)

| 질의 | Steering 업무구분코드에 회원, MEMB, memb, Member 추가 |
|------|--------------------------------------------------|
| 결과 | `.kiro/steering/expjt-rules.md` 업무코드 목록에 `회원 / MEMB / memb / Member` 추가. |

---

### 96. 회원 가입 3단계 페이지 구현

| 질의 | 업무구분 회원(MEMB)으로 회원 가입 페이지 생성 — Step 01 회원약관동의, Step 02 회원실명확인, Step 03 회원정보입력 |
|------|----------------------------------------------------------------------------------------------|
| 결과 | 백엔드: `com.medialog.biz.memb` 패키지에 `Member.java`(엔티티), `MemberRepository.java`, `MemberService.java`(이메일 중복확인, 실명인증, 회원등록), `MemberController.java`(REST API — `/api/member/check-email`, `/api/member/verify-identity`, `/api/member/register`) 생성. 프론트엔드: `MemberRegister.jsx` 3단계 스텝 폼 생성 — Step 01 이용약관/개인정보 동의 체크박스, Step 02 이름/생년월일 입력 후 실명인증 API 호출, Step 03 이메일/전화번호/비밀번호 입력 후 가입완료. `/member/register` 라우트 추가. 테스트: `MemberServiceTest.java`(6개), `MemberControllerTest.java`(5개) 생성. 기존 `Board.java`, `UploadFile.java`, `MailRequest.java`의 클래스 선언 누락도 함께 수정. 전체 39개 테스트 통과. |

---

### 97. 서버 실행

| 질의 | 서버 실행 요청 |
|------|--------------|
| 결과 | `gradlew.bat bootRun` 실행. Tomcat 포트 8080 정상 기동, BizApplication 약 5초 내 시작 완료. H2 콘솔(`/h2-console`, `jdbc:h2:mem:biz`) 활성화 확인. |

---

### 98. 서버 실행 확인

| 질의 | 서버 실행 요청 |
|------|--------------|
| 결과 | 기존 `gradlew.bat bootRun` 프로세스가 이미 실행 중(포트 8080) 확인. 재시작 불필요. |

---

### 99. 프론트엔드 서버 실행 및 백엔드 로그 모니터링

| 질의 | 프론트엔드 서버 실행 및 터미널에서 서버 로그 확인 요청 |
|------|--------------------------------------------------|
| 결과 | 백엔드 로그 tail(`Get-Content logs/biz.log -Wait -Encoding UTF8`) 정상 시작. 프론트엔드 `npm run dev`는 Kiro 내부 터미널에서 `spawn EPERM` 권한 오류 발생 — esbuild 프로세스 생성 권한 문제. 외부 터미널에서 `cd frontend; npm run dev` 직접 실행 필요. 백엔드 서버는 포트 8080 정상 동작 중. |

---

### 100. 프론트엔드 서버 실행 오류 해결 방법 안내

| 질의 | 외부 터미널에서도 프론트엔드 서버 실행이 안 되는 문제 해결 방법 요청 |
|------|-----------------------------------------------------------|
| 결과 | `spawn EPERM` 에러 해결 방법 4가지 안내. (1) `node_modules` 삭제 후 `npm install` 재설치 — 가장 흔한 원인(node_modules 손상). (2) `npm rebuild esbuild`로 esbuild만 재빌드. (3) 관리자 권한으로 CMD 실행 후 `npm run dev`. (4) Windows Defender/기업 보안 프로그램이 `esbuild.exe` 실행 차단 시 예외 목록 추가. |

---

### 101. 회원가입 화면 너비 80% + 가운데 정렬

| 질의 | Step 01 회원약관동의 화면을 전체 화면의 80%로 하고 가운데 정렬 요청 |
|------|-----------------------------------------------------------|
| 결과 | `MemberRegister.jsx` 컨테이너를 `container-narrow` 클래스에서 인라인 스타일 `width: 80%; margin: 0 auto`로 변경. 모든 스텝(약관동의, 실명확인, 정보입력)에 동일 적용. |

---

### 102. 약관동의 LayerPopup을 alert 형태로 변경

| 질의 | 약관동의 LayerPopup을 alert 형태로 변경, 확인 클릭 시 팝업 사라지게 요청 |
|------|----------------------------------------------------------------|
| 결과 | `MemberRegister.jsx`의 LayerPopup에 `confirmOnly` prop 추가하여 확인 버튼만 표시(alert 형태). `onConfirm`에 `closePopup` 연결하여 확인 클릭 시 팝업 닫힘. |

---

### 103. Step 01 버튼 가운데 정렬 + 취소 시 체크박스 해제

| 질의 | 다음/취소 버튼 가운데 정렬, 취소 클릭 시 체크박스 해제 요청 |
|------|-----------------------------------------------------|
| 결과 | `MemberRegister.jsx` Step 01 버튼 그룹에 `display: flex; justifyContent: center` 적용하여 가운데 정렬. 취소 클릭 시 `termsAgreement`, `privacyAgreement` 모두 `false`로 초기화 후 목록 페이지로 이동. |

---

### 104. Step 01 취소 버튼 페이지 이동 제거

| 질의 | Step 01 취소 버튼 클릭 시 게시판 리스트 이동 삭제, 체크박스만 해제 요청 |
|------|--------------------------------------------------------------|
| 결과 | `MemberRegister.jsx` Step 01 취소 버튼에서 `navigate('/board/list')` 제거. 취소 클릭 시 `termsAgreement`, `privacyAgreement` 체크박스만 해제되고 현재 페이지 유지. |

---

### 105. Step 02 이름/생년월일 입력 필드 간격 확대

| 질의 | Step 02 회원실명확인의 이름 input, 생년월일 label, 생년월일 input 간격 넓히기 요청 |
|------|-------------------------------------------------------------------------|
| 결과 | `MemberRegister.jsx` Step 02에서 이름/생년월일 입력 영역을 각각 `div`로 감싸고 `marginBottom: 20px` 적용하여 필드 간 간격 확대. |

---

### 106. 회원 리스트 페이지 생성 + 가입 완료 후 이동

| 질의 | 회원 리스트 페이지 생성, Step 03 가입 완료 후 회원 리스트로 이동 요청 |
|------|--------------------------------------------------------------|
| 결과 | 백엔드: `MemberRepository`에 `findByDelYn` 추가, `MemberService.list()` 메소드 추가, `MemberController`에 `GET /api/member/list` API 추가. 프론트엔드: `MemberList.jsx` 생성(테이블 형태 회원 목록 + 회원가입 버튼), `/member/list` 라우트 추가. `MemberRegister.jsx` 가입 완료 후 `/member/list`로 이동하도록 변경. 전체 11개 회원 테스트 통과. `http://localhost:3000/member/list`에서 확인 가능. |

---

### 107. Step 02 가운데 정렬 + label/input 간격 조정

| 질의 | Step 02 회원실명확인 가운데 정렬, 이름 label과 input 사이 간격 5px 요청 |
|------|----------------------------------------------------------------|
| 결과 | `MemberRegister.jsx` Step 02 컨테이너에 `display: flex; flexDirection: column; alignItems: center` 적용하여 가운데 정렬. label에 `marginBottom: 5px; display: block` 적용하여 label과 input 간격 5px로 조정. |

---

### 108. Step 02 label과 input 한 라인 배치

| 질의 | Step 02 박스 타이틀과 입력 값을 한 라인으로 배치 요청 |
|------|----------------------------------------------|
| 결과 | `MemberRegister.jsx` Step 02 이름/생년월일 영역에 `display: flex; alignItems: center; gap: 10px` 적용. label은 `minWidth: 70px`로 고정, input은 `flex: 1`로 나머지 공간 채움. label과 input이 한 라인에 나란히 표시. |

---

### 109. Step 02 실명확인 타이틀 좌측 정렬

| 질의 | 실명확인 타이틀 좌측 정렬 요청 |
|------|--------------------------|
| 결과 | `MemberRegister.jsx` Step 02 실명확인 `h2`에 `alignSelf: flex-start` 적용하여 좌측 정렬. |

---

### 110. Step 03 입력 필드 한 라인 배치

| 질의 | Step 03 회원정보입력 입력값을 하나의 라인으로 배치 요청 |
|------|----------------------------------------------|
| 결과 | `MemberRegister.jsx` Step 03 모든 입력 필드(이름, 생년월일, 이메일, 전화번호, 비밀번호, 비밀번호 확인)에 `display: flex; alignItems: center; gap: 10px` 적용. label은 `minWidth: 100px` 고정, input은 `flex: 1`로 나머지 공간 채움. label과 input이 한 라인에 나란히 표시. |

---

### 111. Step 03 가입완료/이전 버튼 가운데 정렬

| 질의 | 가입완료/이전 버튼 가운데 정렬 요청 |
|------|------------------------------|
| 결과 | `MemberRegister.jsx` Step 03 버튼 그룹에 `display: flex; justifyContent: center; gap: 8px` 적용하여 가운데 정렬. |

---

### 112. Step 03 이메일 형식 검증 추가

| 질의 | 이메일 형식 체크 요청 |
|------|-------------------|
| 결과 | `MemberRegister.jsx` Step 03 회원가입 완료 시 이메일 정규식(`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) 검증 추가. 형식이 맞지 않으면 '올바른 이메일 형식을 입력해주세요.' LayerPopup 표시. |

---

### 113. 브라우저 뒤로가기 시 이전 스텝 이동

| 질의 | Step 02에서 history back 시 Step 01로, Step 03에서 history back 시 Step 02로 이동 요청 |
|------|-------------------------------------------------------------------------------|
| 결과 | `MemberRegister.jsx`에 `useEffect` + `popstate` 이벤트 리스너 추가. 스텝 변경 시 `history.pushState`로 히스토리 상태 추가. 브라우저 뒤로가기 시 `currentStep`을 1단계 감소하여 이전 스텝으로 이동. Step 02 → Step 01, Step 03 → Step 02. |

---

### 114. 회원 리스트 빈 화면 해결

| 질의 | `http://localhost:3000/member/list` 빈 화면 문제 해결 요청 |
|------|-------------------------------------------------------|
| 결과 | 원인: 서버가 이전 코드로 실행 중이어서 `GET /api/member/list` API가 404 반환. 서버 재시작(`gradlew.bat bootRun`)으로 새 API 반영. 재시작 후 API 정상 응답(회원 2건 조회) 확인. 브라우저 새로고침으로 회원 목록 정상 표시. |

---

### 115. 로그인 페이지 구현

| 질의 | 이메일/비밀번호 로그인 페이지 생성 — 아이디 자동저장, 회원가입, 비밀번호찾기 포함 |
|------|------------------------------------------------------------------|
| 결과 | 백엔드: `com.medialog.biz.lgin` 패키지에 `LoginController.java`(`POST /api/login`), `LoginService.java`(이메일/비밀번호 인증) 생성. 프론트엔드: `Login.jsx` 생성 — 이메일/비밀번호 입력, 아이디 자동저장(localStorage), 회원가입 링크(`/member/register`), 비밀번호찾기(준비 중 안내), Enter 키 로그인 지원. `/login` 라우트 추가. 테스트: `LoginServiceTest.java`(4개), `LoginControllerTest.java`(2개) 생성. 전체 6개 로그인 테스트 통과. |

---

### 116. 메일 페이지를 로그인 페이지로 교체

| 질의 | `/mail` 페이지를 로그인 페이지로 변경 요청 |
|------|--------------------------------------|
| 결과 | `App.jsx`에서 `/mail` 라우트의 컴포넌트를 `MailForm` → `Login`으로 교체. `http://localhost:3000/mail` 접속 시 로그인 페이지 표시. `/login` 경로로도 동일 접근 가능. |

---

### 117. 기본 진입 페이지를 로그인으로 변경

| 질의 | 기본 진입 페이지(`/`)를 로그인 페이지로 변경 요청 |
|------|-------------------------------------------|
| 결과 | `App.jsx`에서 `/` 경로의 리다이렉트 대상을 `/board/list` → `/login`으로 변경. `http://localhost:3000/` 접속 시 로그인 페이지로 이동. |

---

### 118. 로그인 완료 후 게시판 리스트 이동 확인

| 질의 | 로그인 완료 후 게시판 리스트 화면으로 이동 요청 |
|------|----------------------------------------|
| 결과 | 확인 결과 이미 구현 완료 상태. `Login.jsx`에서 로그인 성공 시 환영 메시지 표시 후 1.5초 뒤 `/board/list`(게시판 리스트)로 자동 이동. 추가 변경 불필요. |

---

### 119. 로그인 버튼 무반응 해결

| 질의 | Login.jsx에서 로그인 클릭 시 반응이 없는 문제 해결 요청 |
|------|----------------------------------------------|
| 결과 | 원인: 백엔드 서버가 로그인 API(`POST /api/login`) 추가 전 코드로 실행 중이어서 404 반환. 서버 재시작으로 해결. 재시작 후 API 정상 동작 확인. H2 인메모리 DB 특성상 서버 재시작 시 데이터 초기화되므로 회원가입 후 로그인 필요. |

---

### 120. 회원목록에 로그인 버튼 추가

| 질의 | 회원목록 페이지에 회원가입 버튼 우측에 로그인 버튼 추가, 로그인 페이지 링크 요청 |
|------|------------------------------------------------------------------|
| 결과 | `MemberList.jsx` 하단 버튼 그룹에 로그인 버튼 추가. `navigate('/login')`으로 로그인 페이지 이동. 회원가입/로그인 버튼 가운데 정렬(`gap: 8px`). |

---

### 121. 게시판 화면 중앙 정렬

| 질의 | BoardEdit, BoardList, BoardWrite 화면 정렬을 중앙 정렬 요청 |
|------|------------------------------------------------------|
| 결과 | `frontend/src/common.css`의 `.container-narrow`와 `.container-wide`에 `margin: 0 auto` 추가. 세 화면 모두 중앙 정렬 적용. |

---

### 122. 게시판 화면 크기 80%로 변경

| 질의 | 각 화면 전체 크기를 화면 크기의 80%로 변경 요청 |
|------|----------------------------------------|
| 결과 | `frontend/src/common.css`의 `.container-narrow`와 `.container-wide`를 `width: 80%; max-width: 80%; margin: 0 auto`로 변경. 기존 `max-width: 600px/800px` 고정값 제거. |

---

### 123. 게시판 목록 내용 글자수 제한

| 질의 | BoardList 내용을 한글 50자/영문 100자 제한, 초과 시 `...` 표시 요청 |
|------|-----------------------------------------------------------|
| 결과 | `BoardList.jsx`에 `truncateText` 함수 추가. 한글 2바이트/영문 1바이트 기준 최대 100바이트까지 표시, 초과 시 `...` 붙임. description 컬럼에 적용. |

---

### 124. 게시판 목록 제목 컬럼 너비 40%

| 질의 | 제목 컬럼 크기를 리스트 사이즈의 40%로 변경 요청 |
|------|----------------------------------------|
| 결과 | `BoardList.jsx` 제목 `th`에 `style={{ width: '40%' }}` 적용. |

---

### 125. 게시판 목록 타이틀 중앙 정렬

| 질의 | 리스트 타이틀(thead) 중앙 정렬 요청 |
|------|-------------------------------|
| 결과 | `frontend/src/common.css`의 `th`에 `text-align: center` 추가. 모든 테이블 헤더가 중앙 정렬. |

---

### 126. 게시판 목록 번호 컬럼 중앙 정렬

| 질의 | 번호 컬럼 값 중앙 정렬 요청 |
|------|------------------------|
| 결과 | `BoardList.jsx` 번호 `td`에 `style={{ textAlign: 'center' }}` 적용. |

---

### 127. 게시판 페이징 항상 표시

| 질의 | 게시판 리스트 하단 페이징을 항상 보이도록 변경 요청 |
|------|------------------------------------------|
| 결과 | `BoardList.jsx`에서 페이징 표시 조건을 `totalPages > 1` → `totalPages >= 1`로 변경. 1페이지뿐이어도 페이징 영역이 항상 표시됨. 기존에 이미 페이징(이전/다음 + 페이지 번호) 구현 완료 상태였으나 데이터 10건 이하 시 미표시되던 문제 해결. |

---

### 128. 게시판 목록 제목 컬럼 너비 30%로 변경

| 질의 | BoardList 제목 컬럼 크기를 30%로 변경 요청 |
|------|--------------------------------------|
| 결과 | `BoardList.jsx` 제목 `th`의 `width`를 `40%` → `30%`로 변경. |

---

### 129. 게시판 목록 첨부파일 컬럼 분리

| 질의 | BoardList에 첨부파일 컬럼을 별도로 추가 요청 |
|------|--------------------------------------|
| 결과 | `BoardList.jsx` 테이블에 '첨부' 컬럼 추가(제목과 내용 사이). 기존 제목 셀에 포함되던 FileIcon을 별도 컬럼으로 분리하여 중앙 정렬 표시. 빈 목록 colspan 4 → 5로 변경. |

---

### 130. 첨부파일 컬럼 제목 앞으로 이동

| 질의 | 첨부파일 컬럼을 제목 앞으로 이동 요청 |
|------|-------------------------------|
| 결과 | `BoardList.jsx` 테이블 헤더/바디에서 첨부 컬럼을 번호와 제목 사이로 이동. 순서: 번호 → 첨부 → 제목 → 내용 → 등록일. |

---

### 131. 첨부파일 아이콘 클릭 시 다운로드

| 질의 | 첨부파일 아이콘 클릭 시 다운로드 처리 요청 |
|------|----------------------------------|
| 결과 | `BoardList.jsx` 첨부파일 아이콘을 `<a>` 태그로 감싸서 `/api/upload/download?filePath=` API 호출. 클릭 시 파일 다운로드. 마우스 오버 시 원본 파일명 툴팁 표시. |

---

### 132. 모든 페이지 우측 상단 로그인 버튼 추가

| 질의 | 모든 페이지 우측 상단에 로그인 버튼 추가 요청 |
|------|--------------------------------------|
| 결과 | `App.jsx`에 `TopHeader` 공통 컴포넌트 추가. 우측 상단에 로그인 버튼 표시, 클릭 시 `/login`으로 이동. 로그인 페이지(`/login`)에서는 버튼 미표시. `useLocation`으로 현재 경로 판별. |

---

### 133. 상단 로그인 버튼 영역 80% 너비 적용

| 질의 | 로그인 버튼 영역을 전체 화면의 80%로 변경 요청 |
|------|--------------------------------------|
| 결과 | `App.jsx` TopHeader에 `width: 80%; margin: 0 auto` 적용. 로그인 버튼이 80% 영역 내 우측 정렬. |

---

### 134. JSESSIONID 기반 로그인 세션 관리 구현

| 질의 | JSESSIONID 토큰을 이용한 로그인 여부 확인 프로그램 작성 요청 |
|------|--------------------------------------------------|
| 결과 | 백엔드: `LoginController`에 HttpSession 기반 세션 관리 추가. `POST /api/login` — 로그인 성공 시 세션에 회원 정보 저장(JSESSIONID 쿠키 자동 발급). `GET /api/login/check` — 세션 기반 로그인 상태 확인(loggedIn, memberName, email 반환). `POST /api/login/logout` — 세션 무효화(로그아웃). 프론트엔드: `App.jsx` TopHeader가 페이지 이동 시마다 `/api/login/check`로 로그인 상태 확인. 로그인 시 `{회원명}님` + 로그아웃 버튼, 비로그인 시 로그인 버튼 표시. `Login.jsx` API 호출에 `credentials: 'include'` 추가하여 JSESSIONID 쿠키 전달. |

---

### 135. 비로그인 시 로그인 페이지 리다이렉트

| 질의 | Login, Member 페이지 외 나머지 페이지에서 비로그인 시 로그인 페이지로 이동 처리 요청 |
|------|------------------------------------------------------------------|
| 결과 | `App.jsx`에 `ProtectedRoute` 인증 가드 컴포넌트 추가. `/api/login/check`로 세션 확인 후 비로그인 시 `/login`으로 리다이렉트. Board 관련 페이지(`/board/list`, `/board/write`, `/board/edit/:idx`)에 적용. `/login`, `/member/register`, `/member/list`는 로그인 없이 접근 가능. |

---

### 136. 로그인 후 게시판 이동 불가 해결

| 질의 | 로그인 완료 후 게시판 페이지로 이동되지 않는 문제 해결 요청 |
|------|--------------------------------------------------|
| 결과 | 원인: 백엔드 서버가 세션 관리 API(`/api/login/check`, `/api/login/logout`) 추가 전 코드로 실행 중. 서버 재시작으로 해결. H2 인메모리 DB 특성상 서버 재시작 시 데이터 초기화되므로 회원가입 → 로그인 → 게시판 순서로 진행 필요. |

---

### 137. 서버 시작 시 초기 회원 데이터 삽입

| 질의 | 서버 시작 시 회원 정보를 자동으로 넣고 싶다 |
|------|----------------------------------|
| 결과 | `src/main/resources/data.sql` 생성하여 초기 회원 2명 INSERT. `application.yml`에 `defer-datasource-initialization: true` 추가하여 JPA 테이블 생성 후 `data.sql` 실행되도록 설정. 초기 계정: `admin@medialog.co.kr` / `admin123` (관리자), `test@medialog.co.kr` / `test123` (테스트). 서버 재시작 후 바로 로그인 가능. |

---

### 138. 서버 재시작 후 data.sql 실행 확인

| 질의 | 서버 시작 후 data.sql 실행 확인 요청 |
|------|-------------------------------|
| 결과 | 서버 재시작 후 `data.sql` 정상 실행 확인. 초기 회원 2명(관리자 `admin@medialog.co.kr`/`admin123`, 테스트 `test@medialog.co.kr`/`test123`) 자동 등록. `/api/member/list` API로 데이터 조회 확인 완료. 서버 시작 후 바로 로그인 가능. |

---

### 139. 게시판 목록 내용 제거 + 작성자/읽음 컬럼 추가 + 제목 60%

| 질의 | BoardList에서 내용 컬럼 제거, 작성자/읽음 컬럼 추가, 제목 60% 변경 요청 |
|------|-----------------------------------------------------------|
| 결과 | 백엔드: `Board.java`에 `authorName`(작성자), `viewCount`(조회수) 필드 추가. `BoardController` 상세 조회 시 `viewCount` 1 증가. 게시글 등록 시 세션의 로그인 사용자명을 `authorName`에 설정. 프론트엔드: `BoardList.jsx`에서 내용 컬럼 제거, 작성자/읽음 컬럼 추가(중앙 정렬). 제목 컬럼 너비 60%. 컬럼 순서: 번호 → 첨부 → 제목 → 작성자 → 읽음 → 등록일. |

---

### 140. 서버 재시작

| 질의 | 서버 재시작 요청 |
|------|--------------|
| 결과 | 기존 서버 프로세스 종료 후 `gradlew.bat bootRun` 재시작. Tomcat 포트 8080 정상 기동, BizApplication 약 5.6초 내 시작 완료. |

---

### 141. 게시글 등록/수정 시 로딩바 추가

| 질의 | BoardWrite, BoardEdit에 등록/수정 버튼 클릭 시 로딩바 표시, 완료 시 사라지게 요청 |
|------|-------------------------------------------------------------------------|
| 결과 | `frontend/src/components/LoadingBar.jsx` 공통 로딩바 컴포넌트 생성(오버레이 + 스피너 + 메시지). `BoardWrite.jsx`에 `loading` 상태 추가, 등록 시 "등록 중..." 로딩바 표시. `BoardEdit.jsx`에 `loading` 상태 추가, 수정 시 "수정 중..." 로딩바 표시. try/finally로 성공/실패 모두 로딩바 해제. |

---

### 142. BoardEdit 수정 버튼 클릭 시 로딩바 동작 확인

| 질의 | BoardEdit에서 수정 버튼 클릭 시 공통 로딩바 표시 요청 |
|------|----------------------------------------------|
| 결과 | 확인 결과 이미 구현 완료 상태. `handleSubmit` → `doSave` → `setLoading(true)` → API 호출 → 완료 후 `setLoading(false)` 순서로 동작. 수정 버튼 클릭 시 "수정 중..." 로딩바 표시, 완료 후 자동 해제. 변경 없을 때 confirm 팝업 후 doSave 실행 시에도 로딩바 정상 동작. 추가 변경 불필요. |

---

### 143. 비밀번호 찾기 기능 구현

| 질의 | 로그인 페이지 비밀번호찾기를 레이어 팝업으로 구현 — 이메일 입력 후 임시비밀번호 메일 발송, 미존재 시 안내 메시지 |
|------|------------------------------------------------------------------------------------------|
| 결과 | 백엔드: `LoginService`에 `retrievePassword` 메소드 추가 — 이메일 존재 시 임시비밀번호 6자리(영문+숫자) 생성, DB 저장, MailService로 메일 발송. 미존재 시 "회원 정보가 존재하지 않습니다." 반환. `LoginController`에 `POST /api/login/retrieve-password` API 추가. 프론트엔드: `Login.jsx`에 비밀번호 찾기 레이어 팝업 추가 — 이메일 입력 + 확인/취소 버튼. 확인 클릭 시 API 호출 후 결과 메시지 표시. |

---

### 144. 서버 재시작

| 질의 | 서버 재시작 요청 |
|------|--------------|
| 결과 | 기존 서버 프로세스 종료 후 `gradlew.bat bootRun` 재시작. Tomcat 포트 8080 정상 기동, BizApplication 약 5.2초 내 시작 완료. |

---

### 145. 개발 가이드 DOCX 문서 생성

| 질의 | Steering, Hook 기반 개발 가이드를 DOCX 파일로 생성 요청 |
|------|--------------------------------------------------|
| 결과 | `power-document-suite` Power 활용하여 `generate-guide.js` 스크립트 작성. docx 라이브러리로 `ExPjt_개발가이드.docx` 생성. 7개 챕터 포함: (1) 프로젝트 설명 — Kiro Hook/Steering/Power 가이드 목적, (2) 프로젝트 개요 — Spring Boot 3.4.4, React, H2, JPA 구성, (3) 개발 환경 — 빌드/실행 명령어, 프로젝트 구조, 설정 파일 분리, (4) 업무 규칙 — 업무코드 14개, 계층 구조, 엔티티/메시지 규칙, (5) 주요 Naming Rule — 메소드 접두어, 파일명/변수명 규칙, 약어 매핑 12개, (6) 주의 사항 — 코딩 규칙, Lombok 제한, Javadoc/Git/파일 변경 규칙, (7) 공통모듈(comm) — FileUpload, UploadFile, WebConfig, 프론트엔드 공통 컴포넌트. |

---

### 146. BoardEdit 로딩 텍스트 제거 + 버튼 중앙 정렬

| 질의 | BoardEdit 화면 이동 시 "로딩중..." 제거, 수정/취소/삭제 버튼 중앙 정렬 요청 |
|------|----------------------------------------------------------------|
| 결과 | `BoardEdit.jsx`에서 데이터 로딩 중 표시되던 `{msg.loading}` 텍스트 제거(빈 컨테이너만 표시). 하단 버튼 그룹에 `display: flex; justifyContent: center; gap: 8px` 적용하여 중앙 정렬. |

---

### 147. BoardEdit 취소 버튼 메일 발송 확인

| 질의 | BoardEdit에서 취소 버튼 클릭 시 메일 발송 제외 요청 |
|------|----------------------------------------------|
| 결과 | 확인 결과 취소 버튼은 `navigate('/board/list')`로 목록 이동만 수행하며 메일 발송과 무관. 메일 발송은 `BoardService.save()`에서 게시글 저장(등록/수정) 시에만 실행됨. 수정 시 메일 발송 제외 여부 사용자 확인 대기 중. |

---

### 148. 수정 화면 취소/수정 시 메일 발송 동작 확인

| 질의 | 수정 화면에서 취소 시 메일 발송 제외, 수정 버튼 클릭 시 메일 발송 요청 |
|------|-----------------------------------------------------------|
| 결과 | 확인 결과 이미 요청대로 동작 중. 취소 버튼은 `navigate('/board/list')`로 목록 이동만 수행(메일 발송 없음). 수정 버튼 클릭 시 `BoardService.save()`에서 메일 발송. 추가 변경 불필요. |

---

### 149. GitHub 업로드 방법 안내

| 질의 | 현재 프로젝트를 GitHub에 올리는 방법 요청 |
|------|--------------------------------------|
| 결과 | GitHub 업로드 순서 안내. (1) GitHub에서 새 리포지토리 생성(README 초기화 없이). (2) 터미널에서 `git init` → `git add .` → `git commit` → `git remote add origin` → `git push -u origin main`. 주의사항: `application.yml`에 Gmail 앱 비밀번호 하드코딩되어 있으므로 push 전 환경변수 변경 또는 `.gitignore` 추가 권장. `node_modules/`, `build/`, `.gradle/`, `logs/` 폴더 `.gitignore` 확인 필요. Git 규칙에 따라 commit/push는 수작업 진행. |

---

### 150. 메일 비밀번호 환경변수 전환

| 질의 | application.yml의 메일 password를 환경변수로 변경 요청 |
|------|------------------------------------------------|
| 결과 | `application.yml`의 `spring.mail.password`를 `"trlcmevaaaqorbnd"` → `${MAIL_PASSWORD:}`로 변경. 실행 시 환경변수 `MAIL_PASSWORD` 설정 필요. PowerShell: `$env:MAIL_PASSWORD="값"` 후 `gradlew.bat bootRun`. |

---

### 151. GitHub push 오류 해결 안내

| 질의 | `error: failed to push some refs to 'https://github.com/sinhuiyo@medialog.co.kr/ExPjt.git'` 해결 방법 요청 |
|------|------------------------------------------------------------------------------------------------------|
| 결과 | 원인: remote URL에 이메일 주소가 포함되어 잘못된 형식. GitHub URL은 `https://github.com/{사용자명}/{리포지토리}.git` 형태여야 함. 해결: `git remote remove origin` → `git remote add origin https://github.com/{GitHub사용자명}/ExPjt.git` → `git push -u origin main`. README 포함 생성 시 `git pull origin main --allow-unrelated-histories` 먼저 실행 필요. |

---

### 152. GitHub pull 시 remote ref 오류 해결 안내

| 질의 | `fatal: couldn't find remote ref main` 해결 방법 요청 |
|------|--------------------------------------------------|
| 결과 | 원인: 원격 저장소에 `main` 브랜치가 없음. 해결: `git branch`로 로컬 브랜치명 확인 후, `git branch -M main` → `git push -u origin main`으로 push. 또는 로컬이 `master`면 `git push -u origin master`. `git pull`에서 발생한 경우 빈 리포지토리라면 pull 없이 바로 push 가능. |

---

### 153. GitHub push 실패 해결 안내

| 질의 | `error: failed to push some refs to 'https://github.com/Leesinhui-medialog/ExPjt'` 해결 방법 요청 |
|------|-------------------------------------------------------------------------------------------|
| 결과 | 원인: GitHub 리포지토리 생성 시 README 포함으로 원격에 이미 커밋 존재하여 로컬과 충돌. 해결 방법 1: `git pull origin main --allow-unrelated-histories` → `git push -u origin main`. 방법 2: `git push -u origin main --force`(원격 README 덮어씀). 방법 1 권장, 충돌 시 파일 수정 후 `git add .` → `git commit` → `git push`. |

---

### 154. GitHub remote ref 오류 재발 해결 안내

| 질의 | `fatal: couldn't find remote ref main` 재발 해결 방법 요청 |
|------|------------------------------------------------------|
| 결과 | 해결 순서 안내. (1) `git ls-remote --heads origin`으로 원격 브랜치 확인. (2-A) 원격에 master 있으면 `git pull origin master --allow-unrelated-histories` → `git push -u origin master`. (2-B) 원격에 브랜치 없으면(빈 리포지토리) `git branch -M main` → `git push -u origin main`. (2-C) 안 되면 `git remote -v`로 URL 확인. |

---

### 155. GitHub push 명령어 재정리

| 질의 | GitHub push 명령어가 맞지 않아 재안내 요청 |
|------|--------------------------------------|
| 결과 | CMD(명령 프롬프트)에서 실행하는 전체 순서 재정리. `cd C:\workspace\ExPjt` → `git init` → `git add .` → `git commit -m "ExPjt 초기 커밋"` → `git remote add origin https://github.com/Leesinhui-medialog/ExPjt.git` → `git branch -M main` → `git push -u origin main`. remote 중복 시 `git remote remove origin` 후 재설정. README 포함 생성 시 `git push -u origin main --force`. PowerShell보다 CMD 사용 권장. |

---

### 156. GitHub push 강제 실행 안내

| 질의 | `error: failed to push some refs` 재발 해결 요청 |
|------|---------------------------------------------|
| 결과 | `git push -u origin main --force` 강제 push 안내. GitHub 기존 README 등을 로컬 내용으로 덮어쓰기. |

---

### 157. GitHub push 실패 원인 분석 및 .gitignore 수정

| 질의 | `error: failed to push some refs` 재발 — 원인 분석 및 해결 요청 |
|------|-----------------------------------------------------------|
| 결과 | 원인: `git add`는 완료했으나 `git commit` 미실행 상태. `node_modules/`, `logs/` 등이 `.gitignore`에 누락되어 수천 개 파일이 스테이징에 포함됨. `.gitignore`에 `node_modules/`, `frontend/node_modules/`, `logs/`, `upload/`, `*.docx`, `generate-guide.js`, `package.json`, `package-lock.json` 추가. 해결 순서: `git rm -r --cached node_modules` → `git rm -r --cached frontend/node_modules` → `git rm -r --cached logs` → `git add .` → `git commit` → `git push -u origin main --force`. |

---

### 158. Git Author identity 설정

| 질의 | `Author identity unknown` 오류 해결 요청 |
|------|--------------------------------------|
| 결과 | Git 사용자 정보 미설정 상태. `git config user.email "sinhuiyo@medialog.co.kr"`, `git config user.name "Leesinhui-medialog"` 설정 후 `git commit` → `git push -u origin main --force` 실행 안내. |

---

### 159. web-calendar-dday spec 삭제

| 질의 | specs의 web-calendar-dday 삭제 요청 |
|------|----------------------------------|
| 결과 | `.kiro/specs/web-calendar-dday/` 하위 파일 4개 삭제 완료 (design.md, .config.kiro, tasks.md, requirements.md). |

---

### 160. web-calendar-dday 폴더 삭제

| 질의 | web-calendar-dday 빈 폴더 삭제 요청 |
|------|----------------------------------|
| 결과 | `.kiro/specs/web-calendar-dday/` 폴더 삭제 완료. |

---

### 161. Git push 안내

| 질의 | 변경 내역을 Git에 push 요청 |
|------|------------------------|
| 결과 | Git 규칙에 따라 수작업 진행 안내. `git add .` → `git commit -m "변경 내역 반영"` → `git push -u origin main`. 초기 push 미완료 시 `--force` 옵션 추가. |

---

### 162. Git commit 시 특정 단어 포함 라인 추출 방법 안내

| 질의 | commit 할 때 특정 단어가 포함된 라인 추출 가능 여부 |
|------|-------------------------------------------|
| 결과 | 가능. `git diff --cached -U0 | findstr "검색할단어"` 명령어로 스테이징된 변경 내용 중 특정 단어 포함 라인 추출. 예: `findstr "password"`, `findstr "TODO"`. Hook으로 자동화하여 커밋 전 민감 정보(password, secret, key 등) 경고도 가능. |

---

### 163. Kiro 생성 코드 리포트 Hook 생성

| 질의 | git commit 시 파일명, @author, @line Kiro Edit Line, 날짜를 추출하여 kiro-generated.md 생성하는 Hook 요청 |
|------|----------------------------------------------------------------------------------------------|
| 결과 | `kiro-generated-report` Hook 생성(userTriggered). 실행 시 프로젝트 내 모든 Java 파일에서 `@author`, `@line Kiro Edit Line` 정보를 추출하여 `kiro-generated.md` 파일 생성. 요약(총 파일 수, Kiro 생성 라인 합계, 전체 코드 라인 합계) + 파일별 상세 테이블(파일명, 작성자, Edit Line, Total Line, 날짜) 포함. Explorer Agent Hooks에서 수동 실행. |

---

### 164. Kiro 생성 코드 리포트 Hook 중복 파일 처리 추가

| 질의 | kiro-generated.md에 동일 파일명 존재 시 라인 삭제 후 새로 등록 요청 |
|------|----------------------------------------------------------|
| 결과 | `kiro-generated-report` Hook 프롬프트 수정. 기존 `kiro-generated.md` 파일이 있으면 먼저 읽어서 동일 파일명 라인 삭제 후 새 정보로 교체. 새 파일은 테이블에 추가. 요약 정보(총 파일 수, Kiro 생성 라인 합계, 전체 코드 라인 합계)도 최신 값으로 갱신. 생성일은 현재 날짜로 업데이트. |

---

### 165. 서버 재시작

| 질의 | 서버 실행 요청 |
|------|--------------|
| 결과 | 기존 서버 프로세스 종료 후 `gradlew.bat bootRun` 재시작. Tomcat 포트 8080 정상 기동, BizApplication 약 5.6초 내 시작 완료. |

---

### 166. 프론트엔드 서버 실행 안내

| 질의 | 프론트엔드 실행 요청 |
|------|-----------------|
| 결과 | Kiro 내부 터미널에서 `spawn EPERM` 권한 오류로 실행 불가. 외부 터미널에서 `cd C:\workspace\ExPjt\frontend` → `npm run dev` 직접 실행 안내. |

---

### 167. BoardWrite 등록/취소 버튼 중앙 정렬

| 질의 | BoardWrite 파일의 등록/취소 버튼 중앙 정렬 요청 |
|------|----------------------------------------|
| 결과 | `BoardWrite.jsx` 버튼 그룹에 `display: flex; justifyContent: center; gap: 8px` 적용하여 중앙 정렬. |

---

### 168. Kiro 생성 코드 리포트 Hook 합산 기능 추가

| 질의 | kiro-generated.md 하단에 Kiro Edit Line 합산값, Total Code Line 합산값 추가/업데이트 요청 |
|------|-----------------------------------------------------------------------------|
| 결과 | `kiro-generated-report` Hook 프롬프트 수정. 파일 목록 테이블의 Kiro Edit Line 숫자 합산 → `Kiro Total Edit Line : {합산값}`, Total Code Line 숫자 합산 → `File Total Line : {합산값}`을 파일 하단에 표시. 해당 문구 미존재 시 새로 추가, 존재 시 숫자만 업데이트. 요약 섹션 제거하고 하단 합산으로 대체. |

---

### 169. 로그인 사용자명 드롭다운 메뉴 추가

| 질의 | 로그인 후 사용자이름 부분에 드롭다운 메뉴(개인정보 변경, 비밀번호 변경) 추가 요청 |
|------|------------------------------------------------------------------|
| 결과 | `App.jsx` TopHeader에 드롭다운 메뉴 구현. 사용자명 클릭 시 `▾` 표시와 함께 드롭다운 표시. 메뉴 항목: 개인정보 변경, 비밀번호 변경(현재 준비 중 alert). 외부 클릭 시 자동 닫힘(`document.addEventListener` 활용). |

---

### 170. 개인정보 변경 페이지 구현 및 드롭다운 연결

| 질의 | App.jsx 개인정보 변경 클릭 시 사용자 정보 변경 화면 연결 요청 |
|------|--------------------------------------------------|
| 결과 | 프론트엔드: `MemberEdit.jsx` 생성 — 로그인 사용자의 이메일(읽기전용), 이름, 생년월일(읽기전용), 전화번호 표시/수정. 저장 시 `PUT /api/member/update-profile` API 호출. 백엔드: `MemberController`에 `GET /api/member/detail`(이메일로 회원 조회), `PUT /api/member/update-profile`(이름/전화번호 수정) API 추가. `MemberService`에 `retrieveByEmail`, `updateProfile` 메소드 추가. `App.jsx`: 드롭다운 "개인정보 변경" 클릭 시 `/member/edit`로 이동, `ProtectedRoute` 적용. |

---

### 171. 비밀번호 변경 페이지 구현 및 드롭다운 연결

| 질의 | App.jsx 비밀번호 변경 클릭 시 비밀번호 변경 화면 연결 요청 |
|------|--------------------------------------------------|
| 결과 | 프론트엔드: `PasswordChange.jsx` 생성 — 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인 입력. 현재/새 비밀번호 동일 여부, 확인 일치 여부 검증. `PUT /api/member/change-password` API 호출. 백엔드: `MemberController`에 `PUT /api/member/change-password` API 추가. `MemberService`에 `changePassword` 메소드 추가 — 현재 비밀번호 일치 확인 후 새 비밀번호로 변경. `App.jsx`: 드롭다운 "비밀번호 변경" 클릭 시 `/member/password`로 이동, `ProtectedRoute` 적용. |

---

### 172. 개인정보 변경 전 비밀번호 확인 레이어 추가

| 질의 | 개인정보 변경 클릭 시 비밀번호 확인 confirm 레이어 화면 추가, 확인 후 개인정보 변경 이동 요청 |
|------|-------------------------------------------------------------------------|
| 결과 | `App.jsx` TopHeader에 비밀번호 확인 레이어 팝업 추가. 드롭다운 "개인정보 변경" 클릭 → 비밀번호 입력 팝업 표시 → `POST /api/login` API로 비밀번호 검증 → 일치 시 `/member/edit`로 이동, 불일치 시 "비밀번호가 일치하지 않습니다." 안내. Enter 키 확인 지원. |

---

### 173. MemberEdit 로그인 정보 기반 데이터 채움 확인 + 서버 재시작

| 질의 | MemberEdit.jsx에 이름, 생년월일을 로그인 정보 기준으로 채워 넣기 요청 + 서버 재시작 |
|------|-------------------------------------------------------------------------|
| 결과 | 확인 결과 이미 구현 완료 상태. `/api/login/check`로 이메일 조회 → `/api/member/detail`로 회원 상세(이름, 생년월일, 전화번호) 조회하여 자동 채움. 서버 재시작하여 새 API 반영. Tomcat 포트 8080 정상 기동, BizApplication 약 4.3초 내 시작 완료. |

---

### 174. MemberEdit 생년월일 변경 가능 + 달력 선택

| 질의 | MemberEdit.jsx 생년월일을 변경 가능하게 하고 달력으로 선택 가능하게 요청 |
|------|----------------------------------------------------------|
| 결과 | `MemberEdit.jsx` 생년월일 input을 `disabled` 제거 + `type="date"` 적용하여 달력 선택 가능. 저장 시 `birthDate`도 함께 전송. 백엔드: `MemberController.updateProfile`에 `birthDate` 파라미터 추가. `MemberService.updateProfile`에 `member.setBirthDate(birthDate)` 추가하여 DB 저장. |

---

### 175. Kiro 생성 코드 리포트 Hook 실행 및 commit 방법 안내

| 질의 | kiro-generated-report Hook이 실행되도록 commit 진행 방법 요청 |
|------|------------------------------------------------------|
| 결과 | `userTriggered` Hook은 git commit과 자동 연동 안 됨. 실행 순서: (1) Explorer "Agent Hooks" 섹션에서 "Kiro 생성 코드 리포트" ▶ 실행 버튼 클릭 → `kiro-generated.md` 자동 생성. (2) 터미널에서 `git add .` → `git commit` → `git push origin main`. Hook 실행 → commit → push 순서로 수동 진행. |

---

### 176. Git commit/push 안내

| 질의 | git add, commit, push 실행 요청 |
|------|------------------------------|
| 결과 | Git 규칙에 따라 수작업 진행 안내. `git add .` → `git commit -m "개인정보 변경 / 비밀번호 변경 처리"` → `git push origin main` 터미널에서 직접 실행. |

---

### 177. 새 터미널 생성 방법 안내

| 질의 | 새 터미널 생성 요청 |
|------|-----------------|
| 결과 | Kiro에서 새 터미널 열기: 키보드 단축키 `Ctrl+\`` 또는 상단 메뉴 Terminal → New Terminal 선택. |

---

### 178. kiro-generated.md 파일 확인

| 질의 | kiro-generated.md 파일 열기 요청 |
|------|------------------------------|
| 결과 | 파일 미존재(ENOENT). "Kiro 생성 코드 리포트" Hook이 아직 실행되지 않은 상태. Explorer Agent Hooks에서 ▶ 실행 버튼 클릭하여 Hook 먼저 실행 필요. |

---

### 179. Kiro 생성 코드 리포트 생성

| 질의 | 프로젝트의 모든 Java 파일에서 @author, @line Kiro Edit Line 정보를 추출하여 kiro-generated.md 파일 생성 요청 |
|------|----------------------------------------------------------------------------------------------|
| 결과 | 전체 35개 Java 파일(src/main 21개, src/test 14개)에서 `@author`, `@line Kiro Edit Line`, `Total Code Line`, 마지막 수정 날짜를 추출. `kiro-generated.md` 파일 생성하여 파일별 상세 테이블 + 하단 합산값(Kiro Total Edit Line: 2,629 / File Total Line: 2,629) 표기. 동일 파일명 존재 시 삭제 후 새로 등록하는 규칙 적용. |

---

### 180. Steering 파일명 한글로 변경

| 질의 | expjt-java-rules → Java개발규칙, expjt-rules → 공통개발규칙, expjt-xml-rules → Xml개발규칙으로 이름 변경 요청 |
|------|----------------------------------------------------------------------------------------------|
| 결과 | `.kiro/steering/` 하위 Steering 파일 3개 이름 변경 완료. `expjt-rules.md` → `공통개발규칙.md`, `expjt-java-rules.md` → `Java개발규칙.md`, `expjt-xml-rules.md` → `Xml개발규칙.md`. 파일 내용 및 fileMatch 설정은 기존과 동일하게 유지. |

---

### 181. @author Unknown → sinhuiyo 일괄 변경

| 질의 | @author Unknown으로 되어 있는 부분을 Kiro 로그인 계정(sinhuiyo)으로 변경 요청 |
|------|------------------------------------------------------------------|
| 결과 | 전체 Java 파일 중 `@author Unknown`이었던 22개 파일을 `@author sinhuiyo`로 일괄 변경. 변경 대상: `BizApplication.java`, `Board.java`, `BoardController.java`, `BoardRepository.java`, `BoardService.java`, `FileUploadController.java`, `FileUploadService.java`, `UploadFile.java`, `UploadFileRepository.java`, `WebConfig.java`, `MailController.java`, `MailRequest.java`, `MailService.java`, `HelloWorldController.java`, `HelloWorldService.java`, `BizApplicationTests.java`, `BoardControllerTest.java`, `BoardRepositoryTest.java`, `BoardServiceTest.java`, `FileUploadServiceTest.java`, `UploadFileRepositoryTest.java`, `HelloWorldControllerTest.java`, `HelloWorldServiceTest.java`, `MailControllerTest.java`, `MailServiceTest.java`. `kiro-generated.md`도 동일하게 Unknown → sinhuiyo로 업데이트. |

---

### 182. Kiro 생성 코드 리포트 Hook에 설명 컬럼 추가

| 질의 | Kiro 생성 코드 리포트 Hook에서 파일명 다음에 설명도 넣어 달라 |
|------|--------------------------------------------------|
| 결과 | `kiro-generated-report.kiro.hook` 프롬프트 수정. 테이블에 "설명" 컬럼 추가(파일명과 작성자 사이). 각 Java 파일의 클래스 Javadoc 첫 번째 설명 줄(예: `게시판 REST 컨트롤러.`, `회원 서비스.`)을 추출하여 표시. Javadoc이 없으면 빈 값. 다음 Hook 실행 시 반영. |

---

### 183. 서버 재시작

| 질의 | 서버 재시작 요청 |
|------|-----------------|
| 결과 | 기존 포트 8080 사용 중인 프로세스(PID 22604) 종료 후 `gradlew.bat bootRun` 재시작. Tomcat 포트 8080 정상 기동 확인. BizApplication 약 3.7초 내 시작 완료. H2 콘솔(`/h2-console`) 활성화. |

---

### 184. 브라우저 탭 제목 한글화

| 질의 | 브라우저 탭에 보여지는 명칭을 Board는 게시판, Member는 회원, Login은 로그인으로 변경 요청 |
|------|----------------------------------------------------------------------------|
| 결과 | `frontend/index.html`의 기본 title을 "ExPjt"로 변경. `App.jsx`에 `PageTitle` 컴포넌트 추가하여 라우트 변경 시 `document.title`을 동적으로 설정. `/login` → 로그인, `/board/list` → 게시판 - 목록, `/board/write` → 게시판 - 글쓰기, `/board/edit` → 게시판 - 수정, `/member/register` → 회원 - 가입, `/member/list` → 회원 - 목록, `/member/edit` → 회원 - 개인정보 변경, `/member/password` → 회원 - 비밀번호 변경. |

---

### 185. 서버 재시작

| 질의 | 서버 재시작 요청 |
|------|-----------------|
| 결과 | 기존 포트 8080 사용 중인 프로세스(PID 20860) 종료 후 `gradlew.bat bootRun` 재시작. Tomcat 포트 8080 정상 기동 확인. BizApplication 약 3.9초 내 시작 완료. |

---

### 186. 공통 좌측 메뉴(LeftMenu) 추가

| 질의 | 첨부 이미지 형태의 공통 left 메뉴 추가 — 상단에 이름과 아이디, 메뉴로 관리자메인/환경설정/회원관리/게시판관리 구성 요청 |
|------|--------------------------------------------------------------------------------------------------------|
| 결과 | `frontend/src/components/LeftMenu.jsx` 공통 컴포넌트 생성. 다크 테마(#2c2c2c) 좌측 사이드바, 상단에 로그인 사용자 이름/이메일 표시, NAVIGATION 라벨 아래 4개 메뉴 구성: 관리자 메인(🏠 → 게시판 목록), 환경설정(⚙️ → 개인정보 변경/비밀번호 변경), 회원관리(👤 → 회원 목록/회원 가입), 게시판관리(📋 → 게시판 목록/게시글 작성). 하위 메뉴는 아코디언(접기/펼치기) 방식. `App.jsx` 레이아웃 변경 — 로그인/회원가입/회원목록 페이지는 좌측 메뉴 없이 표시, 나머지 페이지는 좌측 메뉴 + 상단 헤더(로그아웃 버튼) + 우측 콘텐츠 레이아웃. 기존 상단 드롭다운 메뉴 제거. `common.css` body margin/padding 초기화, container 클래스 여백 조정. |

---

### 187. 상단 그라데이션 띠 추가

| 질의 | 상단에 이미지 형태의 띠 추가 요청 |
|------|-------------------------------|
| 결과 | `App.jsx`의 `MainLayout`에 상단 4px 그라데이션 띠 추가. 핑크(#e91e63) → 퍼플(#9c27b0) → 인디고(#3f51b5) → 네이비(#1a237e) `linear-gradient` 적용. 좌측 메뉴와 상단 헤더 위에 전체 너비로 표시. |

---

### 188. 회원 목록 페이지 좌측 메뉴 적용

| 질의 | MemberList.jsx도 left 메뉴가 나올 수 있도록 변경 요청 |
|------|------------------------------------------------|
| 결과 | `App.jsx`에서 `/member/list` 라우트를 `MainLayout`(좌측 메뉴 + 상단 헤더) 안으로 이동. `noLayoutPaths`에서 `/member/list` 제거. `ProtectedRoute` 적용하여 로그인 필수. |

---

### 189. 좌측 메뉴 포함 페이지 좌우 5% 여백 적용

| 질의 | left 메뉴에 포함되어 있는 화면들은 좌우 5%만 남기고 화면을 채워 달라 |
|------|----------------------------------------------------------|
| 결과 | `common.css`의 `.container-narrow`, `.container-wide` 클래스를 `margin: 20px 5%`로 변경. `MemberList.jsx`, `MemberEdit.jsx`, `PasswordChange.jsx`, `MemberRegister.jsx`의 인라인 스타일을 `width: '80%', margin: '0 auto'`에서 `margin: '20px 5%'`로 통일. |

---

### 190. 좌측 메뉴 포함 페이지 좌우 2% 여백 변경

| 질의 | left 메뉴에 포함되어 있는 화면들은 좌우 2%만 남기고 화면을 채워 달라 |
|------|----------------------------------------------------------|
| 결과 | `common.css`의 `.container-narrow`, `.container-wide` 클래스를 `margin: 20px 2%`, `width: 96%`로 변경. `MemberList.jsx`, `MemberEdit.jsx`, `PasswordChange.jsx`, `MemberRegister.jsx`의 인라인 스타일을 `margin: '20px 2%'`로 통일. |

---

### 191. 회원 목록 테이블 컬럼 중앙 정렬

| 질의 | MemberList.jsx의 컬럼들을 모두 중앙 정렬 요청 |
|------|----------------------------------------|
| 결과 | `MemberList.jsx`의 모든 td 컬럼(번호, 이름, 이메일, 전화번호, 생년월일, 등록일)에 `textAlign: 'center'` 적용. |

---

### 192. 좌측 메뉴 폰트 크기 확대

| 질의 | LeftMenu.jsx의 폰트를 좀 더 크게, 하위 메뉴 폰트도 키워 달라 |
|------|------------------------------------------------------|
| 결과 | `LeftMenu.jsx` 스타일 전체 폰트 크기 확대. 사이드바 기본 14px → 16px, 사용자명 15px → 17px, 이메일 12px → 13px, NAVIGATION 라벨 12px → 13px, 메뉴 아이콘 16px → 20px, 화살표 10px → 12px, 하위 메뉴 13px → 15px. |

---

### 193. 좌측 메뉴 배경색 검정 + 글자색 흰색 변경

| 질의 | LeftMenu.jsx의 배경색을 완전 검정색, 글자는 완전 흰색으로 변경 요청 |
|------|--------------------------------------------------------|
| 결과 | `LeftMenu.jsx` 스타일 전면 변경. 사이드바 배경 #2c2c2c → #000, 사용자 영역 #333 → #111, 하위 메뉴 배경 #353535 → #111, 구분선 #444 → #222, 메뉴 테두리 #3a3a3a → #222. 글자색 #ddd/#bbb → #fff, 이메일 #aaa → #ddd, 화살표 #888 → #ccc. 활성 메뉴/하위 메뉴 활성 배경 #1a1a1a로 통일. |

---

### 194. 좌측 메뉴 폰트 크기 한 단계 확대

| 질의 | LeftMenu.jsx의 글자 크기를 모두 한 단계 위로 올려 달라 |
|------|----------------------------------------------|
| 결과 | `LeftMenu.jsx` 스타일 폰트 크기 전체 2px씩 확대. 사이드바 기본 16→18px, 사용자명 17→19px, 이메일 13→15px, NAVIGATION 라벨 13→15px, 메뉴 아이콘 20→22px, 화살표 12→14px, 하위 메뉴 15→17px. |

---

### 195. ExPjt_개발가이드.docx에 Git Repository 정보 추가

| 질의 | git Repository 정보를 ExPjt_개발가이드.docx에 추가, 계정은 sinhuiyo@medialog.co.kr, 비밀번호는 앞자리 4자리+자리수(*) 표시 요청 |
|------|----------------------------------------------------------------------------------------------------------|
| 결과 | `generate-guide.js`에 "8. Git Repository 정보" 섹션 추가. 8.1 저장소 정보(Repository URL: https://github.com/Leesinhui-medialog/ExPjt.git, 플랫폼: GitHub, 브랜치: master), 8.2 계정 정보(이메일: sinhuiyo@medialog.co.kr, 비밀번호: sinh**************), 8.3 Git 명령어(clone/add/commit/push). DOCX 재생성 완료. |

---

### 196. Kiro 생성 코드 리포트 생성 (전체 재스캔)

| 질의 | 프로젝트의 모든 Java 파일에서 @author, @line Kiro Edit Line 정보를 추출하여 kiro-generated.md 파일 생성 요청. 기존 파일 존재 시 동일 파일명 삭제 후 새로 등록, Kiro Edit Line과 Total Code Line 합산값 하단 표시, 값이 다른 파일은 붉은색 진하게 표시 |
|------|----------------------------------------------------------------------------------------------|
| 결과 | 전체 37개 Java 파일(src/main 22개, src/test 15개)에서 `@author`, `@line Kiro Edit Line`, `Total Code Line`, 클래스 설명, 마지막 수정 날짜를 추출. `kiro-generated.md` 파일 생성. Kiro Total Edit Line: 2,823 / File Total Line: 2,827. `Board.java`(60 vs 64)는 값이 달라 붉은색 진하게 표시. |

---

### 197. kiro-generated.md 표 깨짐 수정

| 질의 | kiro-generated.md 표가 깨지는 문제 확인 및 수정 요청 |
|------|----------------------------------------------|
| 결과 | 원인: `fsWrite`와 `fsAppend`로 나눠 작성하면서 테이블 행 사이에 빈 줄이 자동 삽입되어 마크다운 테이블이 두 개로 분리됨. `fsWrite` 한 번으로 전체 파일을 작성하여 빈 줄 없이 연속된 하나의 테이블로 수정 완료. |

---

### 198. kiro-generated-state.md 작성자별 원형 그래프 추가

| 질의 | kiro-generated-state.md에서 Kiro Edit Line, Total Code Line 전체에 대한 사용자별 비율을 원형 그래프로 표시 요청 |
|------|----------------------------------------------------------------------------------------------|
| 결과 | `kiro-generated-state.md` 하단에 Mermaid `pie` 차트 2개 추가. (1) Kiro Edit Line 작성자별 비율 — sinhuiyo 2,519(89.2%), ssarkia 304(10.8%). (2) Total Code Line 작성자별 비율 — sinhuiyo 2,432(86.0%), ssarkia 395(14.0%). GitHub, GitLab 등 Mermaid 지원 마크다운 뷰어에서 원형 그래프로 렌더링. |

---

### 89. 메일 비밀번호 환경 변수 설정 및 steering 추가

| 질의 | 서버 실행 시 메일 비밀번호를 환경 변수에 넣어서 실행할 수 있도록 steering 변경 |
|------|------------------------------------------------------------------|
| 결과 | `공통개발규칙.md`에 환경 변수 섹션 추가. `MAIL_PASSWORD` 환경 변수로 Gmail 앱 비밀번호 주입. `application.yml`에서 `${MAIL_PASSWORD:}`로 참조. 실행 명령: `$env:MAIL_PASSWORD="앱비밀번호"; .\gradlew.bat bootRun`. |

---

### 90. 메일 비밀번호 환경 변수 값 등록

| 질의 | 메일 비밀번호를 환경 변수 실행 예시에 등록 |
|------|-------------------------------------|
| 결과 | `공통개발규칙.md` steering의 실행 명령어 예시에 Gmail 앱 비밀번호 반영. 소스코드 하드코딩 없이 환경 변수로 주입: `$env:MAIL_PASSWORD="snegircweywlzror"; .\gradlew.bat bootRun`. |

---

### 91. 게시글 상세 보기 화면 생성

| 질의 | Board 상세 보기 화면 생성, BoardList에서 제목 클릭 시 상세 보기 연결, 수정/취소 버튼 포함 |
|------|---------------------------------------------------------------------------|
| 결과 | `BoardDetail.jsx` 생성 — 제목, 첨부파일(다운로드), 내용, 작성자, 작성일, 조회수 표시. 수정/취소 버튼 포함. `BoardList.jsx`에서 제목 클릭 시 `/board/detail/{idx}`로 이동. `App.jsx`에 `/board/detail/:idx` 라우트 및 PAGE_TITLES 추가. |

---

### 92. 서버 시작 (메일 비밀번호 환경 변수 포함)

| 질의 | 서버 시작 요청 |
|------|--------------|
| 결과 | `$env:MAIL_PASSWORD="snegircweywlzror"; .\gradlew.bat bootRun`으로 서버 시작. Gradle Daemon 새로 시작 후 Tomcat 포트 8080 정상 기동. 에러 없음. |

---

### 93. 프론트엔드 서버 실행

| 질의 | 프론트엔드 서버 실행 요청 |
|------|----------------------|
| 결과 | PowerShell 실행 정책 문제로 `cmd /c "npm run dev"`로 실행. Vite 개발 서버 `http://localhost:3000/` 정상 기동. |

---

### 94. 메일 발송 테스트 (실패 — SSL 인증서 문제)

| 질의 | 메일 발송 테스트 요청 |
|------|-------------------|
| 결과 | `/api/mail/send` API 호출 시 400 에러 발생. 서버 로그 확인 결과 `SSLHandshakeException: PKIX path building failed` — Java가 Gmail SMTP 서버의 SSL 인증서를 신뢰하지 못함. 회사 네트워크 SSL 검사(프록시) 가능성. 해결 방안: (1) `build.gradle` bootRun JVM 옵션에 SSL 검증 우회 추가 (개발 환경 한정), (2) 회사 프록시 CA 인증서를 Java truststore에 등록. 사용자 확인 대기 중. |

---

### 95. SSL 인증서 우회 설정 및 메일 발송 성공

| 질의 | SSL 인증서 문제 해결 후 메일 발송 테스트 |
|------|-------------------------------------|
| 결과 | `build.gradle` bootRun JVM 옵션에 SSL trust 설정 추가. `application.yml`에 `mail.smtp.ssl.trust: smtp.gmail.com` 추가. 서버 재시작 후 메일 발송 성공 — `sinhuiyo@gmail.com` → `sinhuiyo@medialog.co.kr` 발송 확인. `result: ok`. |

---

### 96. 메일 발송 한글 깨짐 확인

| 질의 | 메일 발송 시 한글이 깨지는 문제 확인 요청 |
|------|-------------------------------------|
| 결과 | UTF-8 인코딩 명시하여 메일 발송 재테스트 — 발송 성공(`result: ok`). PowerShell 콘솔 응답 메시지는 콘솔 인코딩 문제로 깨져 보이나, 실제 수신 메일의 한글 깨짐 여부는 사용자 확인 대기 중. MailService에서 `MimeMessageHelper(message, true, "UTF-8")` 설정 확인 완료. |

---

### 97. 게시글 수정일(modDate) 추가

| 질의 | BoardEdit 수정 시 modDate에 수정일 설정, 최초 등록 시 regDate와 동일, BoardDetail에 수정일 표시 |
|------|---------------------------------------------------------------------------------|
| 결과 | `BoardService.save()`에서 신규 등록 시 `modDate = regDate`, 수정 시 `modDate = 오늘 날짜`로 설정. `BoardDetail.jsx`에 수정일 표시 필드 추가. Board 엔티티에는 이미 `modDate` 필드 존재. |

---

### 98. BoardService 리팩토링 방안 검토

| 질의 | BoardService를 리팩토링하고 싶어 방법 요청 |
|------|--------------------------------------|
| 결과 | 4가지 개선 포인트 분석. (1) `save()`의 메일 발송 로직 분리 → `BoardMailNotificationService` 생성 (단일 책임 원칙), (2) `save()` → `create()`/`update()` 분리 (steering 메소드 네이밍 규칙 부합), (3) 날짜 설정 로직 private 메소드 추출, (4) `softDelete()`의 파일 삭제 private 메소드 추출. 우선순위: 1번(메일 분리) > 2번(create/update 분리). 사용자 범위 선택 대기 중. |

---

### 99. BoardService 메일 발송 로직 분리 (리팩토링)

| 질의 | BoardService에서 메일 발송 로직 분리 |
|------|--------------------------------|
| 결과 | `BoardMailNotificationService` 생성 — 게시글 등록/수정 알림 메일 발송 전담. `BoardService`에서 메일 관련 `@Value` 5개 및 `MailService` 의존성 제거, `BoardMailNotificationService.sendNotification()` 호출로 대체. 단일 책임 원칙 적용. `BoardServiceTest` 수정 필요 — 사용자 확인 대기 중. |

---

### 99. BoardService 메일 발송 로직 분리 (리팩토링)

| 질의 | BoardService에서 메일 발송 로직 분리 |
|------|--------------------------------|
| 결과 | `BoardMailNotificationService` 생성 — 게시글 등록/수정 시 메일 알림 전담. `BoardService`에서 메일 관련 `@Value` 5개 제거, `MailService` 의존성 제거, `BoardMailNotificationService`로 위임. `BoardServiceTest`도 `MailService` Mock → `BoardMailNotificationService` Mock으로 변경. 단일 책임 원칙 적용 완료. |

---

### 100. git commit/push 명령어 안내

| 질의 | git commit push 명령어 정리 요청 |
|------|------------------------------|
| 결과 | steering 규칙에 따라 git 명령어 직접 실행하지 않고 안내. `git status` → `git add .` → `git commit -m "메시지"` → `git push origin main` 순서 안내. 수작업으로 진행. |

---

### 101. Java 변경 시 JUnit 자동 테스트 Hook 등록

| 질의 | 신규 메소드 생성이나 소스 변경 시 JUnit 테스트 진행하는 Hook 생성 요청 |
|------|----------------------------------------------------------|
| 결과 | `java-auto-test` Hook 생성. `src/main/java/**/*.java` 파일 저장 시 대응 JUnit 테스트 자동 실행. 테스트 파일 없으면 생성 후 실행. 60초 타임아웃 설정. 실행 명령: `.\gradlew.bat test --tests "{테스트클래스}"`. |

---

### 102. BoardMailNotificationService → 공통 MailNotificationService로 리팩토링

| 질의 | BoardMailNotificationService를 메일 패키지로 이동하고 공통 모듈로 변경, 비밀번호 찾기에도 적용 |
|------|----------------------------------------------------------------------------|
| 결과 | `MailNotificationService` 생성 (`com.medialog.biz.mail` 패키지) — 기본 수신자/지정 수신자 메일 발송 메소드 제공. `BoardMailNotificationService` 삭제. `BoardService`에서 `MailNotificationService` 사용으로 변경. `LoginService`의 비밀번호 찾기 메일도 `MailNotificationService` 사용으로 변경. `BoardServiceTest`, `LoginServiceTest` 모두 수정 완료. |

---

### 103. 서버 재시작

| 질의 | 서버 재시작 요청 |
|------|--------------|
| 결과 | 기존 포트 8080 사용 중인 프로세스(PID 17896) 종료 후 `gradlew.bat bootRun` 재시작. Tomcat 포트 8080 정상 기동, BizApplication 약 6초 내 시작 완료. |

---

## 현재 프로젝트 구조

```
src/main/java/com/medialog/biz/
├── BizApplication.java
├── HelloWorldService.java
├── HelloWorldController.java
├── board/
│   ├── Board.java (idx, title, description, regDate, filePath, originalFileName, delYn)
│   ├── BoardRepository.java
│   ├── BoardService.java
│   └── BoardController.java
└── common/
    ├── UploadFile.java
    ├── UploadFileRepository.java
    ├── FileUploadService.java
    └── FileUploadController.java

src/main/resources/
├── application.yml
└── templates/board/
    ├── list.html
    ├── write.html
    └── edit.html

src/test/java/com/medialog/biz/
├── BizApplicationTests.java
├── HelloWorldServiceTest.java
├── HelloWorldControllerTest.java
├── board/
│   ├── BoardRepositoryTest.java
│   ├── BoardServiceTest.java
│   └── BoardControllerTest.java
└── common/
    ├── FileUploadServiceTest.java
    └── UploadFileRepositoryTest.java

.kiro/steering/
├── java-javadoc.md
└── java-junit-test.md
```

## 테스트 현황

- 전체 테스트: 23개
- 통과: 23개
- 실패: 0개

---

### 104. change.md → Kiro_Change_sinhuiyo.md 파일 생성 및 change log Hook 변경

| 질의 | change.md 파일을 Kiro_Change_Kiro로그인Id.md 파일로 만들어 주고, 변경된 파일로 change log가 쌓일 수 있도록 change log hook을 변경 요청 |
|------|----------------------------------------------------------------------------------------------------------|
| 결과 | `change.md` → `Kiro_Change_sinhuiyo.md`로 복사 생성. `.kiro/hooks/change-log.kiro.hook` 수정 — 기존 `change.md` 대상에서 `Kiro_Change_{현재 Kiro 로그인 계정}.md` 파일로 변경. 파일 미존재 시 새로 생성, 기존 파일 존재 시 마지막 번호 다음으로 이어서 추가. |
