// src/components/Chatbot/linkify.ts

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function linkifyText(text: string): string {
  if (!text) return '';

  // First escape any HTML so it's safe
  const safe = escapeHtml(text);

  // Match any http/https URL (allow dots, slashes, etc.)
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return safe
  .replace(urlRegex, url => {
    const match = url.match(/^(.*?)([.,!?)]*)$/);
    const cleanUrl = match ? match[1] : url;
    const trailing = match ? match[2] : '';
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${cleanUrl}</a>${trailing}`;
  })
  .replace(/\n/g, "<br>");

}
