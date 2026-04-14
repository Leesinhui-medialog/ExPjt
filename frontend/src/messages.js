/**
 * 프론트엔드 한글 메시지 설정 파일.
 * 모든 UI 텍스트를 이곳에서 관리한다.
 */
const messages = {
  // 공통
  confirm: '확인',
  cancel: '취소',

  // 게시판 목록
  boardListTitle: '게시판 목록',
  boardWrite: '글쓰기',
  colNo: '번호',
  colTitle: '제목',
  colContent: '내용',
  colDate: '등록일',
  emptyList: '등록된 게시글이 없습니다.',
  pagePrev: '« 이전',
  pageNext: '다음 »',

  // 게시글 작성
  boardWriteTitle: '게시글 작성',
  labelTitle: '제목',
  labelFile: '첨부파일',
  labelContent: '내용',
  placeholderTitle: '제목을 입력하세요',
  placeholderContent: '내용을 입력하세요',
  btnSubmit: '등록',
  btnCancel: '취소',

  // 게시글 수정
  boardEditTitle: '게시글 수정',
  noChangeConfirm: '변경 내용이 없습니다. 그래도 저장하시겠습니까?',
  deleteConfirm: '정말 삭제하시겠습니까?',
  fileNotFound: '첨부파일을 찾을 수 없습니다.',
  fileNone: '첨부파일 없음',
  fileReplaceHint: '새 파일을 선택하면 기존 파일이 교체됩니다.',
  btnEdit: '수정',
  btnDelete: '삭제',
  loading: '로딩 중...',

  // 폼메일
  mailFormTitle: '폼메일 발송',
  labelMailTitle: '타이틀',
  labelSubject: '제목',
  labelSender: '발신자',
  labelReceiver: '수신자',
  placeholderMailTitle: '메일 타이틀 (예: 문의)',
  placeholderSubject: '메일 제목',
  placeholderSender: '발신자 이메일',
  placeholderReceiver: '수신자 이메일',
  placeholderMailContent: '메일 내용을 입력하세요',
  allFieldsRequired: '모든 항목을 입력해주세요.',
  mailSentOk: '메일이 발송되었습니다.',
  mailSendFailPrefix: '발송 실패: ',
  mailSendError: '발송 중 오류가 발생했습니다.',
  btnSend: '발송',
  btnSending: '발송 중...',

  // 파일 아이콘
  tooltipImage: '이미지',
  tooltipFile: '파일',
};

export default messages;
