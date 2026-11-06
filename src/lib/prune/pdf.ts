// PDF to clean Markdown: text by line, headings from font size, headers and footers removed.
import { loadPdfJs } from '../compress/pdf';
import { repeatedLines, shape, tidy, type PruneOptions } from './clean';

interface Line { text: string; size: number; y: number }

export async function pdfToMarkdown(data: Uint8Array, o: PruneOptions, onPage: (d: number, t: number) => void) {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: data.slice(), isEvalSupported: false }).promise;
  const pages: Line[][] = [];
  let raw = '';
  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const tc = await page.getTextContent();
      const lines: Line[] = [];
      for (const it of tc.items as any[]) {
        if (!('str' in it)) continue;
        const y = Math.round(it.transform[5]);
        const size = Math.round(Math.hypot(it.transform[2], it.transform[3]) * 10) / 10;
        const last = lines[lines.length - 1];
        if (last && Math.abs(last.y - y) <= Math.max(2, size * 0.3)) {
          last.text += (last.text.endsWith(' ') || it.str.startsWith(' ') || !it.str ? '' : ' ') + it.str;
          last.size = Math.max(last.size, size);
        } else if (it.str.trim()) lines.push({ text: it.str, size, y });
        if (it.hasEOL && last) last.text = last.text.trimEnd();
      }
      raw += lines.map((l) => l.text).join('\n') + '\n\n';
      pages.push(lines.map((l) => ({ ...l, text: l.text.replace(/\s+/g, ' ').trim() })).filter((l) => l.text));
      page.cleanup();
      onPage(p, doc.numPages);
    }
  } finally { await doc.destroy(); }

  const repeated = o.headers ? repeatedLines(pages.map((ls) => ls.map((l) => l.text))) : new Set<string>();
  // Body text size = the most common size; clearly bigger lines become headings.
  const counts = new Map<number, number>();
  for (const l of pages.flat()) counts.set(l.size, (counts.get(l.size) ?? 0) + l.text.length);
  const body = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 10;
  const bigger = [...new Set(pages.flat().map((l) => l.size))].filter((s) => s >= body * 1.18).sort((a, b) => b - a);

  const md: string[] = [];
  let para = '';
  const flush = () => { if (para) { md.push(para); para = ''; } };
  for (const lines of pages) {
    for (const [i, l] of lines.entries()) {
      // Only lines at the top or bottom of a page can be a running header or footer.
      if ((i < 3 || i >= lines.length - 3) && repeated.has(shape(l.text))) continue;
      const level = bigger.indexOf(l.size);
      if (level !== -1 && l.text.length < 120) { flush(); md.push(`${'#'.repeat(Math.min(level + 1, 4))} ${l.text}`); continue; }
      if (/^[•●▪◦‣∙·\-–*]\s+/.test(l.text)) { flush(); md.push(l.text.replace(/^[•●▪◦‣∙·\-–*]\s+/, '- ')); continue; }
      if (/^\d{1,3}[.)]\s+\S/.test(l.text) && !para) { md.push(l.text); continue; }
      if (para.endsWith('-') && /^[a-z]/.test(l.text)) para = para.slice(0, -1) + l.text; // hy-phenation
      else para = para ? `${para} ${l.text}` : l.text;
      if (/[.!?:;"”)]$/.test(l.text) && l.text.length < 60) flush(); // short line ending a sentence
    }
    flush();
  }
  return { raw, markdown: tidy(md.join('\n\n'), o), pages: pages.length, removedRepeats: repeated.size };
}
