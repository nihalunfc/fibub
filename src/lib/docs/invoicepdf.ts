// Draws an invoice, quote, receipt or rent receipt as a text PDF (selectable, standard fonts) with pdf-lib.
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { pdfSafe } from '../resume/pdf';
import { calc, docTitle, fmt, rentReceipts, type Inv } from './invoice';

const fmtDate = (iso: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso); if (!m) return iso; return `${+m[3]} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[2] - 1]} ${m[1]}`; };
export { fmtDate };

function dataUrlBytes(u: string): { bytes: Uint8Array; png: boolean } | null {
  const m = /^data:image\/(png|jpeg|jpg);base64,(.+)$/.exec(u);
  if (!m) return null;
  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes, png: m[1] === 'png' };
}

export async function invoicePdf(inv: Inv): Promise<{ bytes: Uint8Array; lost: string[] }> {
  const doc = await PDFDocument.create();
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [W, H] = inv.cur === 'USD' || inv.cur === 'CAD' ? [612, 792] : [595.28, 841.89];
  const M = 50, width = W - M * 2;
  const ink = rgb(0.07, 0.09, 0.15), muted = rgb(0.35, 0.38, 0.45), line = rgb(0.8, 0.82, 0.86);
  const lost = new Set<string>();
  const safe = (s: string) => { const x = pdfSafe(s); x.lost.forEach((c) => lost.add(c)); return x.text; };
  let page: PDFPage = doc.addPage([W, H]);
  let y = H - M;
  const need = (h: number) => { if (y - h < M) { page = doc.addPage([W, H]); y = H - M; } };
  const wrap = (text: string, font: PDFFont, size: number, w: number) => {
    const out: string[] = [];
    for (const para of text.split(/\r?\n/)) {
      let ln = '';
      for (const word of para.split(/\s+/).filter(Boolean)) {
        const t = ln ? `${ln} ${word}` : word;
        if (font.widthOfTextAtSize(t, size) <= w || !ln) ln = t; else { out.push(ln); ln = word; }
      }
      out.push(ln);
    }
    return out;
  };
  const text = (s: string, x: number, size = 10, font = reg, color = ink, align: 'l' | 'r' = 'l') => {
    const t = safe(s);
    page.drawText(t, { x: align === 'r' ? x - font.widthOfTextAtSize(t, size) : x, y: y - size, size, font, color });
  };
  const para = (s: string, x: number, w: number, size = 10, font = reg, color = ink) => {
    for (const l of wrap(safe(s), font, size, w)) { need(size * 1.35); page.drawText(l, { x, y: y - size, size, font, color }); y -= size * 1.35; }
  };
  const rule = () => { need(8); page.drawLine({ start: { x: M, y: y - 3 }, end: { x: W - M, y: y - 3 }, thickness: 0.6, color: line }); y -= 8; };

  const title = docTitle(inv).toUpperCase();

  if (inv.mode === 'rent') {
    const rs = rentReceipts(inv);
    const per = 3, blockH = (H - M * 2) / per;
    rs.forEach((r, i) => {
      if (i % per === 0 && i > 0) { page = doc.addPage([W, H]); }
      const top = H - M - (i % per) * blockH;
      y = top;
      text('RENT RECEIPT', M, 15, bold);
      text(`Month: ${r.month}`, W - M, 11, bold, ink, 'r');
      y -= 24;
      text(`Date: ${fmtDate(inv.date)}`, M, 10, reg, muted);
      text(`Receipt no. ${inv.number}-${String(i + 1).padStart(2, '0')}`, W - M, 10, reg, muted, 'r');
      y -= 22;
      para(r.sentence, M, width, 11);
      y -= 4;
      para(`Landlord: ${inv.seller.name || '__________'}${inv.seller.addr ? ', ' + inv.seller.addr.replace(/\s*\n\s*/g, ', ') : ''}`, M, width, 10, reg, muted);
      if (inv.seller.taxId.trim()) para(`Landlord PAN: ${inv.seller.taxId.trim().toUpperCase()}`, M, width, 10, reg, muted);
      y -= 14;
      text('Signature of landlord', W - M, 10, reg, muted, 'r');
      y = top - blockH + 10;
      if (i % per !== per - 1 && i < rs.length - 1) { page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: line }); }
    });
    if (!rs.length) { text('Enter a monthly rent to make receipts.', M, 11); }
    doc.setTitle('Rent receipts');
    return { bytes: await doc.save(), lost: [...lost] };
  }

  const c = calc(inv);
  // Header: logo and seller on the left, title and numbers on the right.
  const top = y;
  let leftBottom = y;
  const img = inv.logo ? dataUrlBytes(inv.logo) : null;
  if (img) {
    try {
      const pic = img.png ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes);
      const s = Math.min(150 / pic.width, 60 / pic.height, 1);
      page.drawImage(pic, { x: M, y: y - pic.height * s, width: pic.width * s, height: pic.height * s });
      y -= pic.height * s + 8;
    } catch { /* a broken picture is skipped */ }
  }
  if (inv.seller.name.trim()) { text(inv.seller.name.trim(), M, 13, bold); y -= 18; }
  const sellerLines = [inv.seller.addr, inv.seller.taxId && `${inv.taxMode === 'india' ? 'GSTIN' : 'Tax no.'}: ${inv.seller.taxId.trim()}`, inv.seller.contact].filter(Boolean) as string[];
  for (const s of sellerLines) para(s, M, width * 0.55, 9.5, reg, muted);
  leftBottom = y;
  y = top;
  text(title, W - M, 22, bold, ink, 'r'); y -= 30;
  const meta: [string, string][] = [[inv.mode === 'quote' ? 'Quote no.' : inv.mode === 'receipt' ? 'Receipt no.' : 'Invoice no.', inv.number], ['Date', fmtDate(inv.date)]];
  if (inv.due && inv.mode !== 'receipt') meta.push([inv.mode === 'quote' ? 'Valid until' : 'Due date', fmtDate(inv.due)]);
  if (inv.po) meta.push(['PO / reference', inv.po]);
  if (inv.mode === 'receipt' && inv.pay) meta.push(['Paid by', inv.pay]);
  for (const [k, v] of meta) { text(v, W - M, 10, bold, ink, 'r'); text(k, W - M - 150, 10, reg, muted, 'r'); y -= 14; }
  y = Math.min(y, leftBottom) - 10;
  rule();
  y -= 4;
  if (inv.buyer.name.trim() || inv.buyer.addr.trim()) {
    text(inv.mode === 'quote' ? 'PREPARED FOR' : inv.mode === 'receipt' ? 'RECEIVED FROM' : 'BILL TO', M, 8.5, bold, muted); y -= 13;
    if (inv.buyer.name.trim()) { text(inv.buyer.name.trim(), M, 11, bold); y -= 15; }
    for (const s of [inv.buyer.addr, inv.buyer.taxId && `${inv.taxMode === 'india' ? 'GSTIN' : 'Tax no.'}: ${inv.buyer.taxId.trim()}`, inv.buyer.contact].filter(Boolean) as string[]) para(s, M, width * 0.6, 9.5, reg, muted);
    y -= 8;
  }

  // Table
  const hsn = c.hasHsn && inv.taxMode === 'india';
  const showTax = inv.taxMode !== 'none';
  const colAmt = W - M, colRate = colAmt - 80, colQty = colRate - 70, colTax = colQty - 52, colHsn = (showTax ? colTax : colQty) - 52;
  const descW = (hsn ? colHsn : showTax ? colTax : colQty) - M - 14;
  need(30);
  page.drawRectangle({ x: M, y: y - 18, width, height: 18, color: rgb(0.94, 0.95, 0.97) });
  y -= 3;
  text('Description', M + 4, 9, bold);
  if (hsn) text('HSN/SAC', colHsn, 9, bold, ink, 'r');
  if (showTax) text('Tax %', colTax, 9, bold, ink, 'r');
  text('Qty', colQty, 9, bold, ink, 'r'); text('Rate', colRate, 9, bold, ink, 'r'); text('Amount', colAmt - 4, 9, bold, ink, 'r');
  y -= 20;
  for (const l of c.lines) {
    const ls = wrap(safe(l.desc || '-'), reg, 10, descW);
    need(ls.length * 13 + 8);
    const rowTop = y;
    for (const t of ls) { page.drawText(t, { x: M + 4, y: y - 10, size: 10, font: reg, color: ink }); y -= 13; }
    const bottom = y;
    y = rowTop;
    if (hsn) text(l.hsn, colHsn, 10, reg, ink, 'r');
    if (showTax) text(String(+l.taxRate.toFixed(3)), colTax, 10, reg, ink, 'r');
    text(String(+l.qty.toFixed(4)), colQty, 10, reg, ink, 'r');
    text(fmt(Math.round(l.rate * 100), inv.cur), colRate, 10, reg, ink, 'r');
    text(fmt(l.amount, inv.cur), colAmt - 4, 10, reg, ink, 'r');
    y = bottom - 3;
    rule();
  }
  // Totals
  need(100);
  const row = (k: string, v: string, strong = false) => { need(18); text(k, colRate - 20, strong ? 11 : 10, strong ? bold : reg, strong ? ink : muted, 'r'); text(v, colAmt - 4, strong ? 11 : 10, strong ? bold : reg, ink, 'r'); y -= strong ? 19 : 15; };
  y -= 4;
  row('Subtotal', fmt(c.subtotal, inv.cur));
  if (c.discount) row(`Discount${inv.discKind === 'pct' ? ` (${inv.disc}%)` : ''}`, '-' + fmt(c.discount, inv.cur));
  for (const t of c.taxes) row(t.label, fmt(t.cents, inv.cur));
  if (c.round) row('Round off', fmt(c.round, inv.cur));
  page.drawLine({ start: { x: colRate - 110, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.8, color: ink });
  y -= 4;
  row(inv.mode === 'receipt' ? 'Total paid' : 'Total', fmt(c.total, inv.cur), true);
  y -= 6;
  if (c.words) { para(`Amount in words: ${c.words}`, M, width, 10, bold); y -= 4; }
  if (inv.bank.trim()) { y -= 6; text('PAYMENT DETAILS', M, 8.5, bold, muted); y -= 13; para(inv.bank.trim(), M, width, 9.5); }
  if (inv.notes.trim()) { y -= 6; text('NOTES', M, 8.5, bold, muted); y -= 13; para(inv.notes.trim(), M, width, 9.5); }
  doc.setTitle(`${docTitle(inv)} ${inv.number}`.trim());
  return { bytes: await doc.save(), lost: [...lost] };
}
