-- 서버 시작 시 초기 회원 데이터 삽입
INSERT INTO member (member_name, birth_date, email, telephone_number, password, terms_agreement, privacy_agreement, identity_verified, registration_date, del_yn)
VALUES ('관리자', '1990-01-01', 'admin@medialog.co.kr', '010-1111-2222', 'admin123', 'Y', 'Y', 'Y', '2026-04-14', 'N');

INSERT INTO member (member_name, birth_date, email, telephone_number, password, terms_agreement, privacy_agreement, identity_verified, registration_date, del_yn)
VALUES ('테스트', '1995-06-15', 'test@medialog.co.kr', '010-1111-1111', 'test123', 'Y', 'Y', 'Y', '2026-04-14', 'N');

INSERT INTO member (member_name, birth_date, email, telephone_number, password, terms_agreement, privacy_agreement, identity_verified, registration_date, del_yn)
VALUES ('이신희', '1990-01-01', 'sinhuiyo@medialog.co.kr', '010-9004-2413', 'Welcome1!!', 'Y', 'Y', 'Y', '2026-04-14', 'N');
