import React from 'react';
import msg from '../messages';

export default function LayerPopup({ message, onConfirm, onCancel, confirmOnly }) {
  if (!message) return null;
  return (
    <div style={{ position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.4)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ background:'#fff',borderRadius:8,padding:'28px 32px 20px',minWidth:300,maxWidth:440,boxShadow:'0 4px 20px rgba(0,0,0,0.15)',textAlign:'center' }}>
        <p style={{ fontSize:'0.95rem',color:'#222',margin:'0 0 20px',lineHeight:1.5 }}>{message}</p>
        <div style={{ display:'flex',gap:8,justifyContent:'center' }}>
          <button onClick={onConfirm} className="btn-submit">{msg.confirm}</button>
          {!confirmOnly && <button onClick={onCancel} className="btn-cancel">{msg.cancel}</button>}
        </div>
      </div>
    </div>
  );
}
