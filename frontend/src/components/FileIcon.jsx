import React from 'react';
import msg from '../messages';

export default function FileIcon({ filePath }) {
  if (!filePath) return null;
  const fp = filePath.toLowerCase();
  if (fp.endsWith('.doc') || fp.endsWith('.docx')) return <span title="Word">📝</span>;
  if (fp.endsWith('.xls') || fp.endsWith('.xlsx')) return <span title="Excel">📊</span>;
  if (fp.endsWith('.ppt') || fp.endsWith('.pptx')) return <span title="PowerPoint">📙</span>;
  if (fp.endsWith('.pdf')) return <span title="PDF">📕</span>;
  if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fp)) return <span title={msg.tooltipImage}>🖼️</span>;
  return <span title={msg.tooltipFile}>📎</span>;
}
