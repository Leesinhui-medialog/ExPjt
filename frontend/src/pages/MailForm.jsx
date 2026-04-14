import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayerPopup from '../components/LayerPopup';
import msg from '../messages';

/**
 * 메일 폼 페이지.
 * 현대카드 안내 메일 스타일의 HTML 메일 템플릿을 미리보기하고 발송한다.
 */
export default function MailForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    subject: '',
    sender: '',
    receiver: '',
    /* 안내 메일 본문 필드 */
    noticeTitle: '',
    noticeBody: '',
    endDate: '',
    targetCard: '',
    targetService: '',
  });
  const [popup, setPopup] = useState(null);
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** HTML 메일 본문 생성 */
  const buildHtmlContent = () => {
    return `
<div style="max-width:640px;margin:0 auto;font-family:'Malgun Gothic','맑은 고딕',sans-serif;">
  <div style="background:#1a1a1a;padding:20px 30px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <div style="color:#fff;font-size:12px;border:1px solid #fff;display:inline-block;padding:2px 8px;">Medialog</div>
      <div style="color:#fff;font-size:18px;font-weight:bold;margin-top:8px;">미디어로그 안내</div>
    </div>
    <div style="color:#fff;text-align:right;font-size:14px;border:1px solid #666;padding:6px 12px;border-radius:4px;">
      <div style="font-size:11px;">12</div>
      <div style="font-weight:bold;">2025</div>
    </div>
  </div>
  <div style="padding:40px 30px;border-bottom:1px solid #eee;">
    <h1 style="font-size:24px;font-weight:bold;color:#222;margin:0 0 30px 0;">${form.noticeTitle}</h1>
    <div style="background:#f8f8f8;padding:30px;border-radius:4px;color:#444;font-size:14px;line-height:1.8;">
      <p style="margin:0 0 20px 0;">${form.noticeBody}</p>
      <p style="margin:0 0 5px 0;"><strong>종료 일자</strong></p>
      <p style="margin:0 0 20px 0;">${form.endDate}</p>
      <p style="margin:0 0 5px 0;"><strong>대상 카드</strong></p>
      <p style="margin:0 0 20px 0;">${form.targetCard}</p>
      <p style="margin:0 0 5px 0;"><strong>대상 서비스</strong></p>
      <p style="margin:0;">${form.targetService}</p>
    </div>
  </div>
  <div style="padding:20px 30px;color:#999;font-size:11px;line-height:1.6;">
    <p>본 메일은 발신전용 메일이므로 회신이 되지 않습니다.</p>
    <p>문의사항은 <strong>홈페이지 고객센터</strong> 또는 ARS 고객센터 1577-6000을 이용하시기 바랍니다.</p>
  </div>
</div>`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.sender || !form.receiver || !form.noticeTitle) {
      setPopup({ message: msg.allFieldsRequired, onConfirm: () => setPopup(null), confirmOnly: true });
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          subject: form.subject,
          sender: form.sender,
          receiver: form.receiver,
          content: buildHtmlContent(),
        }),
      });
      const data = await res.json();
      if (data.result === 'ok') {
        setPopup({
          message: msg.mailSentOk,
          onConfirm: () => { setPopup(null); },
          confirmOnly: true,
        });
      } else {
        setPopup({ message: msg.mailSendFailPrefix + data.message, onConfirm: () => setPopup(null), confirmOnly: true });
      }
    } catch (err) {
      setPopup({ message: msg.mailSendError, onConfirm: () => setPopup(null), confirmOnly: true });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-narrow">
      <h1>{msg.mailFormTitle}</h1>
      <form onSubmit={handleSubmit}>
        {/* 메일 기본 정보 */}
        <label htmlFor="title">{msg.labelMailTitle}</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} placeholder={msg.placeholderMailTitle} required />

        <label htmlFor="subject">{msg.labelSubject}</label>
        <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder={msg.placeholderSubject} required />

        <label htmlFor="sender">{msg.labelSender}</label>
        <input id="sender" name="sender" type="email" value={form.sender} onChange={handleChange} placeholder={msg.placeholderSender} required />

        <label htmlFor="receiver">{msg.labelReceiver}</label>
        <input id="receiver" name="receiver" type="email" value={form.receiver} onChange={handleChange} placeholder={msg.placeholderReceiver} required />

        {/* 안내 메일 본문 */}
        <hr style={{ margin: '20px 0' }} />
        <h3 style={{ margin: '0 0 16px 0' }}>안내 메일 본문</h3>

        <label htmlFor="noticeTitle">안내 제목</label>
        <input id="noticeTitle" name="noticeTitle" value={form.noticeTitle} onChange={handleChange} placeholder="예: M포인트 아시아나항공 마일리지 전환 서비스 종료 안내" required />

        <label htmlFor="noticeBody">안내 내용</label>
        <textarea id="noticeBody" name="noticeBody" value={form.noticeBody} onChange={handleChange} placeholder="예: 2026년 6월 1일부터 M포인트 아시아나항공 마일리지 전환 서비스가 종료되어 안내 드리니 이용에 참고해 주시기 바랍니다." />

        <label htmlFor="endDate">종료 일자</label>
        <input id="endDate" name="endDate" value={form.endDate} onChange={handleChange} placeholder="예: 2026. 6. 1(월)" />

        <label htmlFor="targetCard">대상 카드</label>
        <input id="targetCard" name="targetCard" value={form.targetCard} onChange={handleChange} placeholder="예: M포인트 적립 및 사용 가능한 모든 현대카드" />

        <label htmlFor="targetService">대상 서비스</label>
        <input id="targetService" name="targetService" value={form.targetService} onChange={handleChange} placeholder="예: M포인트 아시아나항공 마일리지 전환 서비스" />

        <div className="btn-group" style={{ marginTop: '16px' }}>
          <button type="button" className="btn-submit" style={{ background: '#666' }} onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? '미리보기 닫기' : '미리보기'}
          </button>
          <button type="submit" className="btn-submit" disabled={sending}>{sending ? msg.btnSending : msg.btnSend}</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/board/list')}>{msg.btnCancel}</button>
        </div>
      </form>

      {/* 미리보기 영역 */}
      {showPreview && (
        <div style={{ marginTop: '24px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ background: '#f0f0f0', padding: '8px 16px', fontWeight: 'bold', fontSize: '14px' }}>메일 미리보기</div>
          <div dangerouslySetInnerHTML={{ __html: buildHtmlContent() }} />
        </div>
      )}

      {popup && <LayerPopup {...popup} />}
    </div>
  );
}
