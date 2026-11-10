// Builds the claim packet PDF: cover + summary table, then every receipt (PDF pages copied, images placed on pages).
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { claimTotals, type Receipt } from './medical';

export interface PacketFile { name: string; bytes: Uint8Array; kind: 'pdf' | 'png' | 'jpg' }
export interface Cover { member: string; policy: string; insurer: string; currency: (n: number) => string }
const W = 595, H = 842, M = 48;
/** Helvetica draws Latin letters only; anything else becomes a question mark rather than failing. */
const safe = (s: string) => s.replace(/[^\x20-\x7e -ÿ]/g, '?');

function cut(font: PDFFont, text: string, size: number, width: number) {
  text = safe(text);
  if (font.widthOfTextAtSize(text, size) <= width) return text;
  while (text.length > 1 && font.widthOfTextAtSize(text + '...', size) > width) text = text.slice(0, -1);
  return text + '...';
}

export async function buildPacket(receipts: Receipt[], files: (PacketFile | null)[], cover: Cover): Promise<{ bytes: Uint8Array; pages: number; front: number }> {
  const doc = await PDFDocument.create();
  const f = await doc.embedFont(StandardFonts.Helvetica), fb = await doc.embedFont(StandardFonts.HelveticaBold);
  const t = claimTotals(receipts), money = cover.currency;
  const ink = rgb(0.05, 0.05, 0.05), grey = rgb(0.35, 0.35, 0.35);
  const txt = (p: PDFPage, s: string, x: number, y: number, size = 11, bold = false, right = false) => {
    s = safe(s); const font = bold ? fb : f;
    p.drawText(s, { x: right ? x - font.widthOfTextAtSize(s, size) : x, y, size, font, color: ink });
  };
  // Cover
  let p = doc.addPage([W, H]); let y = H - M - 10;
  txt(p, 'Health insurance claim packet', M, y, 22, true); y -= 34;
  const rows: [string, string][] = [['Plan member', cover.member], ['Plan or policy number', cover.policy], ['Insurer', cover.insurer], ['Claim period', t.from ? `${t.from} to ${t.to}` : ''], ['Receipts', String(receipts.length)], ['Total paid', money(t.paid)], ['Already claimed', money(t.claimed)], ['Amount to claim', money(t.toClaim)]];
  for (const [k, v] of rows) { txt(p, k, M, y, 11, true); txt(p, v || '-', M + 170, y, 11); y -= 20; }
  y -= 14;
  p.drawText('Made on the owner\'s own device with fibub. Nothing was sent anywhere. Upload this file to your insurer\'s own site or app.', { x: M, y, size: 9, font: f, color: grey, maxWidth: W - 2 * M });
  // Summary pages
  const cols = [M, 190, 330, 400, 470, W - M];
  const head = (pg: PDFPage, yy: number) => { ['Patient', 'Service', 'Receipts', 'Paid', 'Claimed'].forEach((h, i) => txt(pg, h, i < 3 ? cols[i] : cols[i + 1], yy, 10, true, i >= 3)); pg.drawLine({ start: { x: M, y: yy - 4 }, end: { x: W - M, y: yy - 4 }, thickness: 0.7, color: grey }); };
  p = doc.addPage([W, H]); y = H - M - 10;
  txt(p, 'Summary by patient and service', M, y, 16, true); y -= 28; head(p, y); y -= 20;
  const line = (cells: string[], bold = false) => {
    if (y < M + 30) { p = doc.addPage([W, H]); y = H - M - 10; head(p, y); y -= 20; }
    txt(p, cut(bold ? fb : f, cells[0], 10, 135), cols[0], y, 10, bold);
    txt(p, cut(bold ? fb : f, cells[1], 10, 135), cols[1], y, 10, bold);
    txt(p, cells[2], cols[3] - 20, y, 10, bold, true); txt(p, cells[3], cols[4], y, 10, bold, true); txt(p, cells[4], cols[5], y, 10, bold, true);
    y -= 16;
  };
  for (const g of t.groups) line([g.patient, g.service, String(g.n), money(g.paid), money(g.claimed)]);
  line(['Total', '', String(receipts.length), money(t.paid), money(t.claimed)], true);
  y -= 14;
  if (y < M + 40 + receipts.length * 14) { p = doc.addPage([W, H]); y = H - M - 10; }
  txt(p, 'Receipts, in the order they follow', M, y, 12, true); y -= 18;
  receipts.forEach((r, i) => {
    if (y < M + 20) { p = doc.addPage([W, H]); y = H - M - 10; }
    txt(p, cut(f, `${i + 1}. ${r.date || 'no date'}  ${r.provider || '-'}  ${r.patient || '-'}  ${r.service || '-'}`, 9, W - 2 * M - 80), M, y, 9);
    txt(p, money(r.paid), W - M, y, 9, false, true); y -= 14;
  });
  const front = doc.getPageCount();
  // Receipts
  for (let i = 0; i < files.length; i++) {
    const file = files[i]; if (!file) continue;
    if (file.kind === 'pdf') {
      const src = await PDFDocument.load(file.bytes, { ignoreEncryption: true });
      for (const cp of await doc.copyPages(src, src.getPageIndices())) doc.addPage(cp);
    } else {
      const img = file.kind === 'png' ? await doc.embedPng(file.bytes) : await doc.embedJpg(file.bytes);
      const pg = doc.addPage([W, H]); txt(pg, cut(f, `Receipt ${i + 1}: ${file.name}`, 9, W - 2 * M), M, H - M + 10, 9);
      const s = Math.min((W - 2 * M) / img.width, (H - 2 * M - 20) / img.height, 4);
      pg.drawImage(img, { x: M, y: H - M - 10 - img.height * s, width: img.width * s, height: img.height * s });
    }
  }
  const bytes = await doc.save({ useObjectStreams: false });
  return { bytes, pages: doc.getPageCount(), front };
}
