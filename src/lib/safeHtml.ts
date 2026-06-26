import DOMPurify from 'dompurify';

export function safeHtml(val: any, fallback: string = ''): string {
  if (!val) return fallback;
  
  let rawStr = '';
  if (typeof val === 'string') {
    rawStr = val;
  } else if (typeof val === 'object' && 'stringValue' in val) {
    rawStr = val.stringValue || fallback;
  } else {
    rawStr = String(val);
  }

  try {
    // DOMPurify is fully compatible with both browser and node contexts
    return DOMPurify.sanitize(rawStr);
  } catch (err) {
    console.warn("DOMPurify sanitization fallback:", err);
    return rawStr;
  }
}
