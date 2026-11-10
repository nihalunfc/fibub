// Certificates: three plain layouts, one page per name, drawn with pdf-lib (landscape).
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type PDFImage } from 'pdf-lib';
import { parseCsvLine } from './labels';

export type Cert = {
  layout: 'classic' | 'modern' | 'simple'; size: 'a4' | 'letter'; title: string; intro: string; text: string; date: string; sign1: string; sign2: string; colour: string; logo?: Uint8Array; logoType?: 'png' | 'jpg';
};
export const COLOURS: Record<string, [number, number, number]> = { navy: [0.12, 0.2, 0.45], green: [0.1, 0.4, 0.28], maroon: [0.5, 0.12, 0.17], black: [0.1, 0.1, 0.1] };

/** Names from typed lines or CSV: the first column of each row; a heading row called Name/Names is skipped. */
export function parseNames(text: string): string[] {
  const rows = text.replace(/\r\n?/g, '\n').split('\n').map((l) => parseCsvLine(l)[0]?.trim() ?? '').filter(Boolean);
  if (rows.length && /^names?$/i.test(rows[0])) rows.shift();
  return rows;
}
export const dateText = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};
const safe = (f: PDFFont, s: string, lost: Set<string>) => { let o = ''; for (const ch of s) { try { f.encodeText(ch); o += ch; } catch { lost.add(ch); o += '?'; } } return o; };
function wrap(f: PDFFont, text: string, size: number, maxW: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    let cur = '';
    for (const w of para.split(/\s+/).filter(Boolean)) {
      const t = cur ? cur + ' ' + w : w;
      if (f.widthOfTextAtSize(t, size) <= maxW || !cur) cur = t; else { out.push(cur); cur = w; }
    }
    out.push(cur);
  }
  return out;
}

export async function certificatePdf(c: Cert, names: string[]) {
  const doc = await PDFDocument.create();
  const serif = await doc.embedFont(StandardFonts.TimesRoman), serifI = await doc.embedFont(StandardFonts.TimesRomanItalic), serifB = await doc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await doc.embedFont(StandardFonts.Helvetica), sansB = await doc.embedFont(StandardFonts.HelveticaBold);
  let logo: PDFImage | undefined;
  if (c.logo) { try { logo = c.logoType === 'png' ? await doc.embedPng(c.logo) : await doc.embedJpg(c.logo); } catch { /* ignore a bad logo */ } }
  const lost = new Set<string>();
  const [W, H] = c.size === 'letter' ? [792, 612] : [841.89, 595.28];
  const col = rgb(...(COLOURS[c.colour] ?? COLOURS.navy)), grey = rgb(0.35, 0.35, 0.35);
  const centre = (p: PDFPage, t: string, y: number, size: number, f: PDFFont, color = rgb(0.1, 0.1, 0.1)) => {
    const s = safe(f, t, lost); p.drawText(s, { x: (W - f.widthOfTextAtSize(s, size)) / 2, y, size, font: f, color });
  };
  for (const name of names.length ? names : ['']) {
    const p = doc.addPage([W, H]);
    if (c.layout === 'classic') {
      p.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: col, borderWidth: 4 });
      p.drawRectangle({ x: 34, y: 34, width: W - 68, height: H - 68, borderColor: col, borderWidth: 1 });
    } else if (c.layout === 'modern') {
      p.drawRectangle({ x: 0, y: H - 70, width: W, height: 70, color: col });
      p.drawRectangle({ x: 0, y: 0, width: W, height: 18, color: col });
    } else {
      p.drawLine({ start: { x: 80, y: H - 70 }, end: { x: W - 80, y: H - 70 }, thickness: 1, color: col });
      p.drawLine({ start: { x: 80, y: 70 }, end: { x: W - 80, y: 70 }, thickness: 1, color: col });
    }
    let top = H - (c.layout === 'modern' ? 105 : 95);
    if (logo) {
      const sc = Math.min(70 / logo.width, 70 / logo.height), w = logo.width * sc, h = logo.height * sc;
      p.drawImage(logo, { x: (W - w) / 2, y: c.layout === 'modern' ? H - 70 + (70 - h) / 2 : top - h + 10, width: w, height: h });
      if (c.layout !== 'modern') top -= h + 4;
    }
    const tf = c.layout === 'simple' ? sansB : serifB;
    let ts = 40; const title = safe(tf, c.title, lost);
    while (ts > 16 && tf.widthOfTextAtSize(title, ts) > W - 160) ts -= 2;
    centre(p, c.title, top - ts, ts, tf, col);
    centre(p, c.intro, top - ts - 38, 16, c.layout === 'simple' ? sans : serifI, grey);
    const nf = c.layout === 'simple' ? sans : serifI, nm = safe(nf, name, lost);
    let ns = 44; while (ns > 14 && nf.widthOfTextAtSize(nm, ns) > W - 200) ns -= 2;
    const ny = top - ts - 38 - 20 - ns;
    centre(p, name, ny, ns, nf);
    p.drawLine({ start: { x: W / 2 - 170, y: ny - 8 }, end: { x: W / 2 + 170, y: ny - 8 }, thickness: 0.7, color: col });
    const bf = c.layout === 'simple' ? sans : serif;
    wrap(bf, safe(bf, c.text, lost), 15, W - 220).forEach((ln, i) => centre(p, ln, ny - 40 - i * 21, 15, bf, grey));
    const ly = 105, line = (cx: number, label: string, above: string) => {
      p.drawLine({ start: { x: cx - 100, y: ly }, end: { x: cx + 100, y: ly }, thickness: 0.8, color: rgb(0.2, 0.2, 0.2) });
      const s = safe(sans, label, lost); p.drawText(s, { x: cx - sans.widthOfTextAtSize(s, 11) / 2, y: ly - 15, size: 11, font: sans, color: grey });
      if (above) { const a = safe(serif, above, lost); p.drawText(a, { x: cx - serif.widthOfTextAtSize(a, 14) / 2, y: ly + 6, size: 14, font: serif, color: rgb(0.1, 0.1, 0.1) }); }
    };
    const hasS2 = !!c.sign2.trim();
    line(hasS2 ? W * 0.25 : W * 0.3, 'Date', dateText(c.date));
    line(hasS2 ? W * 0.5 : W * 0.7, c.sign1 || 'Signature', '');
    if (hasS2) line(W * 0.75, c.sign2, '');
  }
  return { bytes: await doc.save(), pages: names.length || 1, lost: [...lost] };
}
