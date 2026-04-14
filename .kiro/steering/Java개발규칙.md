---
inclusion: fileMatch
fileMatchPattern: "**/*.java"
---

# ExPjt Java 코딩 규칙

Java 파일(`*.java`)을 편집할 때 적용되는 규칙입니다.

## 패키지 구조
- 패키지 구조: `com.medialog.biz.{업무코드}` — 업무코드 기준으로 작성 (업무코드 목록은 공통 steering 참조)

## 계층 구조
- Controller → Service → Repository 계층 구조 준수
- REST API 경로: `/api/{도메인}/{액션}` 형식

## 메소드 네이밍 규칙
| 메소드 접두어 | 설명 |
|-------------|------|
| retrieve | 조회 |
| list | 목록 |
| listForPage | 목록-페이지 |
| create | 단건등록 |
| update | 단건수정 |
| delete | 삭제 |
| save | 등록/수정/삭제가 혼합 |
| export | 파일내보내기 |

## Javadoc 규칙
- 새 Java 파일 생성 시 Javadoc 포함 (`@ai-generated`, `@generator Kiro`, `@author {현재 Kiro 로그인 계정}`, `@line Kiro Edit Line : {Kiro 생성/수정 라인수}, Total Code Line : {전체 코드 라인수}`)
- 새 Java 파일 생성 시 대응하는 JUnit 테스트 파일도 함께 생성

## 엔티티 규칙
- 소프트 삭제 방식 사용 (`delYn` 필드, "Y"/"N")

## 코딩 규칙
- 파일 인코딩은 UTF-8을 사용한다
- 주석은 모든 코드에 상세히 기술하는 것을 원칙으로 한다
- 소스코드는 불필요한 내용을 제외하고 원칙적으로 중복을 금지한다
- 소스코드에 민감한 정보를 하드코딩하지 않는다
- 기능과 성능은 물론 보안에 각별히 주의한다
- `@AllArgsConstructor`, `@RequiredArgsConstructor` 사용을 금지한다
- `@Data`, `@Value`, `@Cleanup`, `@SneakyThrows`, `@Synchronized` 사용을 금지한다
- `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`는 VO 클래스에만 사용한다
- VO 객체에 `@ToString(includeFieldNames = true, callSuper = true)` 작성하여 필드명과 부모 클래스 정보를 포함하고, `exclude`를 사용하여 불필요한 필드를 제외할 수 있도록 한다 (제외 컬럼은 수동으로 지정)
- 로그 생성을 위해 Class 파일에 `@Slf4j`를 등록한다
- 와일드카드 임포트(`import xxx.*`)는 사용하지 않는다
- 클래스명은 파스칼표기법(PascalCase)을 사용하며, 명사 또는 명사구를 이용한다

## 네이밍 규칙
- 파일명(클래스명)은 업무코드를 사용한다 (예: `AcctController.java`, `BordService.java`)
- 변수명, 메소드명, 필드명 등은 Full Name을 원칙으로 한다
- 약어를 사용하지 않고 Full Name으로 작성한다
- 새로운 약어 → Full Name 매핑은 필요할 때마다 아래 목록에 추가한다

### 약어 → Full Name 매핑
| 약어 | Full Name |
|------|-----------|
| custId | customerId |
| custNm | customerName |
| addr | address |
| dabvAddr | dongAboveAddress |
| billAcntId | billingAccountId |
| entrId | entryId |
| prodCd | productCode |
| prodNm | productName |
| tlno | telephoneNumber |
| stusCd | statusCode |
| svcCd | serviceCode |
| trmMdlCd | terminalModelCode |
