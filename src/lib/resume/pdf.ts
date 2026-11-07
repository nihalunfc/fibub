// Text-based PDF (selectable text, one column, standard fonts) that ATS software reads cleanly.
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import type { Block, Resume } from './model';

// Characters the built-in PDF fonts can draw (Windows-1252). Anything else is swapped or reported.
const CP1252 = new Set([...'€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ'].map((c) => c.codePointAt(0)!));
const SWAP: Record<string, string> = { '‐': '-', '‑': '-', '‒': '-', '−': '-', ' ': ' ', ' ': ' ', ' ': ' ', '→': '->', '′': "'", '″': '"', '×': 'x', '≈': '~', '·': '·', '✓': '-', '★': '*', '●': '•', '▪': '•', '◦': '•' };
export function pdfSafe(s: string): { text: string; lost: string[] } {
  const lost: string[] = [];
  let text = '';
  for (const ch of s.normalize('NFC')) {
    const c = ch.codePointAt(0)!;
    if ((c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) || CP1252.has(c)) text += ch;
    else if (SWAP[ch]) text += SWAP[ch];
    else { const plain = ch.normalize('NFD').replace(/[̀-ͯ]/g, ''); if (plain !== ch && [...plain].every((p) => p.charCodeAt(0) < 0x7f)) text += plain; else lost.push(ch); }
  }
  return { text, lost };
}

const PAPER = { letter: [612, 792], a4: [595.28, 841.89] } as const;

export async function resumePdf(r: Resume, b: Block[]): Promise<{ bytes: Uint8Array; lost: string[] }> {
  const doc = await PDFDocument.create();
  const serif = r.style === 'serif';
  const F = {
    reg: await doc.embedFont(serif ? StandardFonts.TimesRoman : StandardFonts.Helvetica),
    bold: await doc.embedFont(serif ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold),
    ital: await doc.embedFont(serif ? StandardFonts.TimesRomanItalic : StandardFonts.HelveticaOblique),
  };
  const [W, H] = PAPER[r.paper];
  const M = 54, width = W - M * 2;
  const base = serif ? 11 : 10.5, lh = 1.32;
  const ink = rgb(0.07, 0.09, 0.15), muted = rgb(0.3, 0.33, 0.4);
  const lost = new Set<string>();
  const safe = (s: string) => { const x = pdfSafe(s); x.lost.forEach((c) => lost.add(c)); return x.text; };

  let page: PDFPage = doc.addPage([W, H]);
  let y = H - M;
  const need = (h: number) => { if (y - h < M) { page = doc.addPage([W, H]); y = H - M; } };
  const wrap = (text: string, font: PDFFont, size: number, w: number) => {
    const out: string[] = [];
    let line = '';
    for (const word of text.split(/\s+/)) {
      const t = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(t, size) <= w || !line) line = t; else { out.push(line); line = word; }
    }
    if (line) out.push(line);
    return out;
  };
  const write = (text: string, font: PDFFont, size: number, opts: { x?: number; w?: number; color?: any; center?: boolean } = {}) => {
    const x0 = opts.x ?? M, w = opts.w ?? width;
    for (const l of wrap(safe(text), font, size, w)) {
      need(size * lh);
      const x = opts.center ? M + (width - font.widthOfTextAtSize(l, size)) / 2 : x0;
      page.drawText(l, { x, y: y - size, size, font, color: opts.color ?? ink });
      y -= size * lh;
    }
  };

  for (let i = 0; i < b.length; i++) {
    const k = b[i];
    if (k.t === 'name') { write(k.text, F.bold, 20, { center: true }); y -= 2; }
    else if (k.t === 'headline') write(k.text, F.reg, base + 1, { center: true, color: muted });
    else if (k.t === 'contact') { write(k.text, F.reg, base - 1, { center: true, color: muted }); y -= 2; }
    else if (k.t === 'heading') {
      // Keep a heading with at least two lines of what follows it.
      need(base * lh * 3 + 14);
      y -= 8;
      page.drawText(safe(k.text.toUpperCase()), { x: M, y: y - (base + 0.5), size: base + 0.5, font: F.bold, color: ink });
      y -= (base + 0.5) * lh + 1;
      page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.7, color: muted });
      y -= 5;
    } else if (k.t === 'entry') {
      const right = safe(k.right);
      const rw = right ? F.reg.widthOfTextAtSize(right, base) : 0;
      const leftLines = wrap(safe(k.left), F.bold, base, width - rw - 12);
      need(base * lh * (leftLines.length + 1));
      y -= 3;
      leftLines.forEach((l, n) => {
        page.drawText(l, { x: M, y: y - base, size: base, font: F.bold, color: ink });
        if (n === 0 && right) page.drawText(right, { x: W - M - rw, y: y - base, size: base, font: F.reg, color: ink });
        y -= base * lh;
      });
    } else if (k.t === 'sub') write(k.text, F.ital, base - 0.5, { color: muted });
    else if (k.t === 'para') { write(k.text, F.reg, base); y -= 1.5; }
    else if (k.t === 'bullet') {
      const ind = 12;
      const ls = wrap(safe(k.text), F.reg, base, width - ind);
      ls.forEach((l, n) => {
        need(base * lh);
        if (n === 0) page.drawText('•', { x: M + 2, y: y - base, size: base, font: F.reg, color: ink });
        page.drawText(l, { x: M + ind, y: y - base, size: base, font: F.reg, color: ink });
        y -= base * lh;
      });
      y -= 1;
    }
  }
  doc.setTitle(r.name.trim() ? `${r.name.trim()} - Resume` : 'Resume');
  doc.setAuthor(r.name.trim());
  doc.setCreator('fibub.com'); doc.setProducer('fibub.com');
  return { bytes: await doc.save(), lost: [...lost] };
}
