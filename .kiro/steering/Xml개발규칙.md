---
inclusion: fileMatch
fileMatchPattern: "**/*.{xml,yml,yaml,html,properties}"
---

# ExPjt XML/설정 파일 규칙

XML, YML, HTML, Properties 파일을 편집할 때 적용되는 규칙입니다.

## 설정 파일 규칙
- 앱 고유 설정은 `application-app.yml`에 분리 관리
- 공통 Spring/서버 설정은 `application.yml`에 유지
- 파일 인코딩은 UTF-8을 사용한다
- 소스코드에 민감한 정보를 하드코딩하지 않는다

## 메시지 코드 규칙
- 메시지 코드는 `biz-{업무코드}.properties` 파일로 관리 (업무코드 목록은 공통 steering 참조)
- 예: `biz-acct.properties`, `biz-cusp.properties`
- 메시지는 `key=value` 형태로 작성
- key 형식: `[시스템코드].[업무코드].[일련번호]` (예: `biz.acct.001`)
- value에 치환이 필요한 부분은 `{n}` 구조로 명시하며, 0부터 시작 (예: `{0}님의 계정이 생성되었습니다.`)

## HTML 템플릿 규칙
- Thymeleaf 템플릿은 `src/main/resources/templates/` 하위에 위치
- 공통 컴포넌트는 `templates/common/` 폴더에 fragment로 관리
- 공통 CSS는 `static/css/common.css`에서 관리
