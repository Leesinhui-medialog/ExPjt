const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  Header, Footer, PageNumber, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerShading = { fill: "2E75B6", type: ShadingType.CLEAR };
const altShading = { fill: "F2F7FB", type: ShadingType.CLEAR };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

/** 테이블 헤더 셀 생성 */
function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA }, shading: headerShading, margins: cellMargins,
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "맑은 고딕", size: 20 })] })]
  });
}

/** 테이블 일반 셀 생성 */
function cell(text, width, shading, align) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA }, shading: shading || undefined, margins: cellMargins,
    children: [new Paragraph({ alignment: align || AlignmentType.LEFT, children: [new TextRun({ text, font: "맑은 고딕", size: 20 })] })]
  });
}

/** 제목 Paragraph */
function heading(text, level) {
  return new Paragraph({ heading: level, spacing: { before: 300, after: 150 }, children: [new TextRun({ text, font: "맑은 고딕" })] });
}

/** 본문 Paragraph */
function para(text, opts) {
  return new Paragraph({ spacing: { after: 100 }, ...opts, children: [new TextRun({ text, font: "맑은 고딕", size: 22, ...opts })] });
}

/** 불릿 항목 */
function bullet(text, ref, level) {
  return new Paragraph({ numbering: { reference: ref, level: level || 0 }, spacing: { after: 60 },
    children: [new TextRun({ text, font: "맑은 고딕", size: 22 })] });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "맑은 고딕", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "맑은 고딕", color: "2E75B6" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "맑은 고딕", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "맑은 고딕", color: "404040" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: "bullet", text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: "bullet", text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } }
      ]},
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "ExPjt 개발 가이드", font: "맑은 고딕", size: 16, color: "999999", italics: true })] })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "- ", font: "맑은 고딕", size: 16, color: "999999" }),
          new TextRun({ children: [PageNumber.CURRENT], font: "맑은 고딕", size: 16, color: "999999" }),
          new TextRun({ text: " -", font: "맑은 고딕", size: 16, color: "999999" })] })] })
    },
    children: [
      // ===== 표지 =====
      new Paragraph({ spacing: { before: 3000 } }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "ExPjt 개발 가이드", font: "맑은 고딕", size: 56, bold: true, color: "2E75B6" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
        children: [new TextRun({ text: "Spring Boot + React 기반 샘플 애플리케이션", font: "맑은 고딕", size: 28, color: "666666" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
        children: [new TextRun({ text: "미디어로그", font: "맑은 고딕", size: 24, color: "999999" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "작성일: 2026-04-14", font: "맑은 고딕", size: 22, color: "999999" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "버전: 1.0", font: "맑은 고딕", size: 22, color: "999999" })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 1. 프로젝트 설명 =====
      heading("1. 프로젝트 설명", HeadingLevel.HEADING_1),
      para("미디어로그에서 필요로 하는 Kiro의 Hook, Steering, Power 기능에 대한 가이드를 만드는 프로젝트입니다."),
      para("Spring Boot + React 기반 샘플 애플리케이션을 구축하면서 각 기능의 활용법을 실습하고 문서화합니다."),
      new Paragraph({ spacing: { after: 60 } }),
      bullet("Steering: 프로젝트별 코딩 규칙, 네이밍 규칙, 설정 규칙을 정의하여 일관된 코드 품질 유지", "bullets"),
      bullet("Hook: 파일 저장/생성 시 자동으로 코드 품질 검사, Javadoc 생성, 테스트 생성 등을 수행", "bullets"),
      bullet("Power: 외부 도구(Figma, 문서 생성 등)와 연동하여 개발 생산성 향상", "bullets"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 2. 프로젝트 개요 =====
      heading("2. 프로젝트 개요", HeadingLevel.HEADING_1),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2800, 6706],
        rows: [
          new TableRow({ children: [headerCell("항목", 2800), headerCell("내용", 6706)] }),
          new TableRow({ children: [cell("프레임워크", 2800, altShading), cell("Spring Boot 3.4.4 + Java 17 + Gradle", 6706, altShading)] }),
          new TableRow({ children: [cell("프론트엔드", 2800), cell("React (Vite)", 6706)] }),
          new TableRow({ children: [cell("데이터베이스", 2800, altShading), cell("H2 인메모리 (개발), JPA/Hibernate", 6706, altShading)] }),
          new TableRow({ children: [cell("패키지", 2800), cell("com.medialog.biz", 6706)] }),
          new TableRow({ children: [cell("빌드 도구", 2800, altShading), cell("Gradle Wrapper", 6706, altShading)] }),
          new TableRow({ children: [cell("테스트", 2800), cell("JUnit 5 + Mockito", 6706)] }),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 3. 개발 환경 =====
      heading("3. 개발 환경", HeadingLevel.HEADING_1),
      heading("3.1 빌드/실행 명령어", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2800, 6706],
        rows: [
          new TableRow({ children: [headerCell("구분", 2800), headerCell("명령어", 6706)] }),
          new TableRow({ children: [cell("백엔드 실행", 2800, altShading), cell(".\\gradlew.bat bootRun", 6706, altShading)] }),
          new TableRow({ children: [cell("프론트엔드 실행", 2800), cell("npm run dev (frontend 폴더)", 6706)] }),
          new TableRow({ children: [cell("테스트 실행", 2800, altShading), cell(".\\gradlew.bat test", 6706, altShading)] }),
        ]
      }),
      heading("3.2 프로젝트 구조", HeadingLevel.HEADING_2),
      bullet("백엔드: src/main/java/com/medialog/biz/{업무코드}/", "bullets"),
      bullet("프론트엔드: frontend/src/pages/ (페이지), frontend/src/components/ (공통)", "bullets"),
      bullet("설정: application.yml (공통), application-app.yml (앱 고유)", "bullets"),
      bullet("Steering: .kiro/steering/ (프로젝트 규칙)", "bullets"),
      bullet("Hook: .kiro/hooks/ (자동화 규칙)", "bullets"),
      heading("3.3 설정 파일 분리", HeadingLevel.HEADING_2),
      bullet("application.yml: 공통 Spring/서버 설정 (DB, JPA, 메일, 서버 포트)", "bullets"),
      bullet("application-app.yml: 앱 고유 설정 (업로드 경로, 메시지 등)", "bullets"),
      bullet("data.sql: 서버 시작 시 초기 데이터 삽입 (H2 인메모리)", "bullets"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 4. 업무 규칙 =====
      heading("4. 업무 규칙", HeadingLevel.HEADING_1),
      heading("4.1 업무코드 목록", HeadingLevel.HEADING_2),
      para("패키지 구조는 com.medialog.biz.{업무코드} 형태로 업무코드 기준으로 작성합니다."),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [1800, 1400, 1400, 4906],
        rows: [
          new TableRow({ children: [headerCell("업무코드 구분", 1800), headerCell("업무코드", 1400), headerCell("패키지명", 1400), headerCell("설명", 4906)] }),
          new TableRow({ children: [cell("계정", 1800, altShading), cell("ACCT", 1400, altShading, AlignmentType.CENTER), cell("acct", 1400, altShading, AlignmentType.CENTER), cell("Account", 4906, altShading)] }),
          new TableRow({ children: [cell("고객지원", 1800), cell("CUSP", 1400, undefined, AlignmentType.CENTER), cell("cusp", 1400, undefined, AlignmentType.CENTER), cell("Customer Support", 4906)] }),
          new TableRow({ children: [cell("권한", 1800, altShading), cell("AUTH", 1400, altShading, AlignmentType.CENTER), cell("auth", 1400, altShading, AlignmentType.CENTER), cell("Authority", 4906, altShading)] }),
          new TableRow({ children: [cell("로그인", 1800), cell("LGIN", 1400, undefined, AlignmentType.CENTER), cell("lgin", 1400, undefined, AlignmentType.CENTER), cell("Login", 4906)] }),
          new TableRow({ children: [cell("메인", 1800, altShading), cell("MAIN", 1400, altShading, AlignmentType.CENTER), cell("main", 1400, altShading, AlignmentType.CENTER), cell("Main", 4906, altShading)] }),
          new TableRow({ children: [cell("개통", 1800), cell("OPEN", 1400, undefined, AlignmentType.CENTER), cell("open", 1400, undefined, AlignmentType.CENTER), cell("Opening", 4906)] }),
          new TableRow({ children: [cell("요금제", 1800, altShading), cell("PRPL", 1400, altShading, AlignmentType.CENTER), cell("prpl", 1400, altShading, AlignmentType.CENTER), cell("Price Plan", 4906, altShading)] }),
          new TableRow({ children: [cell("유심구매", 1800), cell("USBY", 1400, undefined, AlignmentType.CENTER), cell("usby", 1400, undefined, AlignmentType.CENTER), cell("USIM Buy", 4906)] }),
          new TableRow({ children: [cell("컨텐츠", 1800, altShading), cell("CNTN", 1400, altShading, AlignmentType.CENTER), cell("cntn", 1400, altShading, AlignmentType.CENTER), cell("Contents", 4906, altShading)] }),
          new TableRow({ children: [cell("통계", 1800), cell("STAT", 1400, undefined, AlignmentType.CENTER), cell("stat", 1400, undefined, AlignmentType.CENTER), cell("Statistics", 4906)] }),
          new TableRow({ children: [cell("공통", 1800, altShading), cell("COMM", 1400, altShading, AlignmentType.CENTER), cell("comm", 1400, altShading, AlignmentType.CENTER), cell("Common", 4906, altShading)] }),
          new TableRow({ children: [cell("게시판", 1800), cell("BORD", 1400, undefined, AlignmentType.CENTER), cell("bord", 1400, undefined, AlignmentType.CENTER), cell("Board", 4906)] }),
          new TableRow({ children: [cell("메일", 1800, altShading), cell("MAIL", 1400, altShading, AlignmentType.CENTER), cell("mail", 1400, altShading, AlignmentType.CENTER), cell("Mail Send", 4906, altShading)] }),
          new TableRow({ children: [cell("회원", 1800), cell("MEMB", 1400, undefined, AlignmentType.CENTER), cell("memb", 1400, undefined, AlignmentType.CENTER), cell("Member", 4906)] }),
        ]
      }),
      heading("4.2 계층 구조", HeadingLevel.HEADING_2),
      bullet("Controller → Service → Repository 계층 구조 준수", "bullets"),
      bullet("REST API 경로: /api/{도메인}/{액션} 형식", "bullets"),
      heading("4.3 엔티티 규칙", HeadingLevel.HEADING_2),
      bullet("소프트 삭제 방식 사용 (delYn 필드, \"Y\"/\"N\")", "bullets"),
      bullet("새 Java 파일 생성 시 대응하는 JUnit 테스트 파일도 함께 생성", "bullets"),
      heading("4.4 메시지 코드 규칙", HeadingLevel.HEADING_2),
      bullet("메시지 코드는 biz-{업무코드}.properties 파일로 관리", "bullets"),
      bullet("key 형식: [시스템코드].[업무코드].[일련번호] (예: biz.acct.001)", "bullets"),
      bullet("value 치환: {0}부터 시작 (예: {0}님의 계정이 생성되었습니다.)", "bullets"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 5. 주요 Naming Rule =====
      heading("5. 주요 Naming Rule", HeadingLevel.HEADING_1),
      heading("5.1 메소드 네이밍 규칙", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2800, 6706],
        rows: [
          new TableRow({ children: [headerCell("메소드 접두어", 2800), headerCell("설명", 6706)] }),
          new TableRow({ children: [cell("retrieve", 2800, altShading, AlignmentType.CENTER), cell("조회", 6706, altShading)] }),
          new TableRow({ children: [cell("list", 2800, undefined, AlignmentType.CENTER), cell("목록", 6706)] }),
          new TableRow({ children: [cell("listForPage", 2800, altShading, AlignmentType.CENTER), cell("목록-페이지", 6706, altShading)] }),
          new TableRow({ children: [cell("create", 2800, undefined, AlignmentType.CENTER), cell("단건등록", 6706)] }),
          new TableRow({ children: [cell("update", 2800, altShading, AlignmentType.CENTER), cell("단건수정", 6706, altShading)] }),
          new TableRow({ children: [cell("delete", 2800, undefined, AlignmentType.CENTER), cell("삭제", 6706)] }),
          new TableRow({ children: [cell("save", 2800, altShading, AlignmentType.CENTER), cell("등록/수정/삭제가 혼합", 6706, altShading)] }),
          new TableRow({ children: [cell("export", 2800, undefined, AlignmentType.CENTER), cell("파일내보내기", 6706)] }),
        ]
      }),
      heading("5.2 파일명/변수명 규칙", HeadingLevel.HEADING_2),
      bullet("파일명(클래스명)은 업무코드를 사용한다 (예: AcctController.java, BordService.java)", "bullets"),
      bullet("변수명, 메소드명, 필드명 등은 Full Name을 원칙으로 한다", "bullets"),
      bullet("약어를 사용하지 않고 Full Name으로 작성한다", "bullets"),
      bullet("클래스명은 파스칼표기법(PascalCase)을 사용하며, 명사 또는 명사구를 이용한다", "bullets"),
      heading("5.3 약어 → Full Name 매핑", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [3000, 6506],
        rows: [
          new TableRow({ children: [headerCell("약어", 3000), headerCell("Full Name", 6506)] }),
          new TableRow({ children: [cell("custId", 3000, altShading), cell("customerId", 6506, altShading)] }),
          new TableRow({ children: [cell("custNm", 3000), cell("customerName", 6506)] }),
          new TableRow({ children: [cell("addr", 3000, altShading), cell("address", 6506, altShading)] }),
          new TableRow({ children: [cell("dabvAddr", 3000), cell("dongAboveAddress", 6506)] }),
          new TableRow({ children: [cell("billAcntId", 3000, altShading), cell("billingAccountId", 6506, altShading)] }),
          new TableRow({ children: [cell("entrId", 3000), cell("entryId", 6506)] }),
          new TableRow({ children: [cell("prodCd", 3000, altShading), cell("productCode", 6506, altShading)] }),
          new TableRow({ children: [cell("prodNm", 3000), cell("productName", 6506)] }),
          new TableRow({ children: [cell("tlno", 3000, altShading), cell("telephoneNumber", 6506, altShading)] }),
          new TableRow({ children: [cell("stusCd", 3000), cell("statusCode", 6506)] }),
          new TableRow({ children: [cell("svcCd", 3000, altShading), cell("serviceCode", 6506, altShading)] }),
          new TableRow({ children: [cell("trmMdlCd", 3000), cell("terminalModelCode", 6506)] }),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 6. 주의 사항 =====
      heading("6. 주의 사항", HeadingLevel.HEADING_1),
      heading("6.1 코딩 규칙", HeadingLevel.HEADING_2),
      bullet("파일 인코딩은 UTF-8을 사용한다", "bullets"),
      bullet("주석은 모든 코드에 상세히 기술하는 것을 원칙으로 한다", "bullets"),
      bullet("소스코드는 불필요한 내용을 제외하고 원칙적으로 중복을 금지한다", "bullets"),
      bullet("소스코드에 민감한 정보를 하드코딩하지 않는다", "bullets"),
      bullet("기능과 성능은 물론 보안에 각별히 주의한다", "bullets"),
      bullet("와일드카드 임포트(import xxx.*)는 사용하지 않는다", "bullets"),
      heading("6.2 Lombok 어노테이션 규칙", HeadingLevel.HEADING_2),
      para("사용 금지 어노테이션:", { bold: true }),
      bullet("@AllArgsConstructor, @RequiredArgsConstructor", "bullets"),
      bullet("@Data, @Value, @Cleanup, @SneakyThrows, @Synchronized", "bullets"),
      para("VO 클래스에만 허용:", { bold: true }),
      bullet("@Getter, @Setter, @ToString, @EqualsAndHashCode", "bullets"),
      bullet("@ToString(includeFieldNames = true, callSuper = true) 작성", "bullets"),
      bullet("exclude를 사용하여 불필요한 필드 제외 (제외 컬럼은 수동 지정)", "bullets"),
      para("필수 어노테이션:", { bold: true }),
      bullet("모든 Class 파일에 @Slf4j를 등록한다", "bullets"),
      heading("6.3 Javadoc 규칙", HeadingLevel.HEADING_2),
      bullet("새 Java 파일 생성 시 Javadoc 포함", "bullets"),
      bullet("@ai-generated", "bullets", 1),
      bullet("@generator Kiro", "bullets", 1),
      bullet("@author {현재 Kiro 로그인 계정}", "bullets", 1),
      bullet("@line Kiro Edit Line : {생성/수정 라인수}, Total Code Line : {전체 코드 라인수}", "bullets", 1),
      heading("6.4 Git 규칙", HeadingLevel.HEADING_2),
      bullet("git commit, git push는 명령어로 자동 실행하지 않고 반드시 수작업으로 진행한다", "bullets"),
      heading("6.5 파일 변경 규칙", HeadingLevel.HEADING_2),
      bullet("현재 에디터에 열려져 있지 않은 소스 파일을 변경할 때는 반드시 사용자에게 문의 후 진행한다", "bullets"),
      bullet("열려 있는 파일만 바로 수정 가능", "bullets"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 7. 공통모듈(comm) 설명 =====
      heading("7. 공통모듈(comm) 설명", HeadingLevel.HEADING_1),
      para("공통 패키지(com.medialog.biz.comm)는 프로젝트 전반에서 재사용되는 기능을 제공합니다."),
      heading("7.1 파일 업로드 (FileUploadService)", HeadingLevel.HEADING_2),
      bullet("파일 업로드 처리 및 물리 파일 관리", "bullets"),
      bullet("업로드 경로: application-app.yml의 app.upload.root 설정", "bullets"),
      bullet("하위 폴더 지정 가능 (예: board, member)", "bullets"),
      bullet("UUID 기반 저장 파일명 생성으로 파일명 충돌 방지", "bullets"),
      heading("7.2 파일 업로드 컨트롤러 (FileUploadController)", HeadingLevel.HEADING_2),
      bullet("POST /api/upload — 파일 업로드 API", "bullets"),
      bullet("GET /api/upload/download — 파일 다운로드 API", "bullets"),
      heading("7.3 업로드 파일 엔티티 (UploadFile)", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2800, 6706],
        rows: [
          new TableRow({ children: [headerCell("필드", 2800), headerCell("설명", 6706)] }),
          new TableRow({ children: [cell("id", 2800, altShading), cell("업로드 파일 고유 번호 (자동 증가)", 6706, altShading)] }),
          new TableRow({ children: [cell("originalName", 2800), cell("원본 파일명", 6706)] }),
          new TableRow({ children: [cell("storedName", 2800, altShading), cell("저장된 파일명 (UUID + 원본명)", 6706, altShading)] }),
          new TableRow({ children: [cell("filePath", 2800), cell("파일 저장 경로 (상대 경로)", 6706)] }),
          new TableRow({ children: [cell("subFolder", 2800, altShading), cell("하위 폴더명", 6706, altShading)] }),
          new TableRow({ children: [cell("fileSize", 2800), cell("파일 크기 (바이트)", 6706)] }),
          new TableRow({ children: [cell("contentType", 2800, altShading), cell("파일 MIME 타입", 6706, altShading)] }),
          new TableRow({ children: [cell("regDate", 2800), cell("등록일 (yyyy-MM-dd)", 6706)] }),
        ]
      }),
      heading("7.4 CORS 설정 (WebConfig)", HeadingLevel.HEADING_2),
      bullet("프론트엔드(localhost:3000)에서 백엔드(localhost:8080) API 호출 허용", "bullets"),
      bullet("GET, POST, PUT, DELETE 메소드 허용", "bullets"),
      heading("7.5 공통 프론트엔드 컴포넌트", HeadingLevel.HEADING_2),
      bullet("LayerPopup: alert/confirm 대체 레이어 팝업 (confirmOnly 옵션)", "bullets"),
      bullet("FileIcon: 파일 확장자별 아이콘 표시 (Word, Excel, PPT, PDF, 이미지, 기타)", "bullets"),
      bullet("LoadingBar: 오버레이 + 스피너 로딩 표시", "bullets"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("ExPjt_개발가이드.docx", buffer);
  console.log("ExPjt_개발가이드.docx 생성 완료");
});
