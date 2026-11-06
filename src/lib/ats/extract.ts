// Reads a resume the way an applicant tracking system (ATS) does: as plain text, plus the
// layout features that commonly confuse ATS parsers.
import { unzipSync, strFromU8 } from 'fflate';

export interface Extracted {
  text: string;
  kind: 'PDF' | 'Word' | 'Text';
  pages?: number;
  columns?: boolean;     // two-column layout detected (PDF)
  tables?: number;       // Word tables
  textBoxes?: number;    // Word text boxes
  images?: number;       // pictures (Word)
  headerFooterText?: string; // text that sits in Word headers/footers (often skipped by ATS)
  oddChars: number;      // icon-font and emoji characters
}

const ODD = /[\u{E000}-\u{F8FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

export async function extract(file: File): Promise<Extracted> {
  const e = file.name.toLowerCase().split('.').pop();
  const data = new Uint8Array(await file.arrayBuffer());
  if (e === 'pdf') return pdf(data);
  if (e === 'docx') return docx(data);
  if (e === 'doc') throw new Error('OLD_DOC');
  const text = new TextDecoder().decode(data);
  return { text, kind: 'Text', oddChars: (text.match(ODD) ?? []).length };
}

async function pdf(data: Uint8Array): Promise<Extracted> {
  const { loadPdfJs } = await import('../compress/pdf');
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: data.slice(), isEvalSupported: false }).promise;
  let text = '', split = 0, total = 0;
  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const width = page.getViewport({ scale: 1 }).width;
      const tc = await page.getTextContent();
      // Group text pieces into lines by their vertical position.
      const rows = new Map<number, { x: number; w: number; s: string }[]>();
      for (const it of tc.items as any[]) {
        if (!it.str?.trim()) continue;
        const y = Math.round(it.transform[5] / 3);
        (rows.get(y) ?? rows.set(y, []).get(y)!).push({ x: it.transform[4], w: it.width, s: it.str });
      }
      const ys = [...rows.keys()].sort((a, b) => b - a);
      for (const y of ys) {
        const items = rows.get(y)!.sort((a, b) => a.x - b.x);
        total++;
        // A wide gap in the middle of a line suggests two columns side by side.
        for (let i = 1; i < items.length; i++) {
          const gap = items[i].x - (items[i - 1].x + items[i - 1].w);
          if (gap > width * 0.12 && items[i].x > width * 0.3 && items[i].x < width * 0.75) { split++; break; }
        }
        text += items.map((i) => i.s).join(' ').replace(/\s+/g, ' ').trim() + '\n';
      }
      text += '\n';
      page.cleanup();
    }
    return { text, kind: 'PDF', pages: doc.numPages, columns: total > 10 && split / total > 0.25, oddChars: (text.match(ODD) ?? []).length };
  } finally { await doc.destroy(); }
}

function docx(data: Uint8Array): Extracted {
  const files = unzipSync(data);
  const xml = (p: string) => (files[p] ? strFromU8(files[p]) : '');
  const body = xml('word/document.xml');
  if (!body) throw new Error('NOT_DOCX');
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const doc = new DOMParser().parseFromString(body, 'application/xml');
  const paras = Array.from(doc.getElementsByTagNameNS(W, 'p')).map((p) =>
    Array.from(p.getElementsByTagNameNS(W, 't')).map((t) => t.textContent).join(''));
  const text = paras.join('\n');
  const hf = Object.keys(files).filter((k) => /^word\/(header|footer)\d*\.xml$/.test(k))
    .map((k) => xml(k).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).join(' ').trim();
  return {
    text, kind: 'Word',
    tables: doc.getElementsByTagNameNS(W, 'tbl').length,
    textBoxes: (body.match(/<w:txbxContent/g) ?? []).length,
    images: (body.match(/<w:drawing|<w:pict/g) ?? []).length,
    headerFooterText: hf,
    oddChars: (text.match(ODD) ?? []).length,
  };
}
