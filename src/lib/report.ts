// One report, three downloads. A tool describes its result as sections (text, key facts, a table,
// a picture) and this file turns them into an image (PNG), a PDF or a Word file, in the browser.
// Several tools' sections can be joined into one file (see the observing session page).
export type Figure = { w: number; h: number; alt: string; draw: (ctx: CanvasRenderingContext2D, w: number, h: number, pal: Palette) => void };
export type Section = {
  title: string;
  text?: string[];
  facts?: [string, string][];
  table?: { head: string[]; rows: string[][]; align?: ('l' | 'r')[] };
  figure?: Figure;
  note?: string;
};
export type Palette = { bg: string; ink: string; muted: string; line: string; grid: string; accent: string; accent2: string; good: string; warn: string; bad: string; night: string; twilight: string; day: string; red: boolean };
export const LIGHT: Palette = { bg: '#ffffff', ink: '#121826', muted: '#5d6577', line: '#cfd5e1', grid: '#e9ecf3', accent: '#0b7fa6', accent2: '#d97706', good: '#137a3e', warn: '#9a5b00', bad: '#b42323', night: '#1d2742', twilight: '#5a6a92', day: '#e8eefb', red: false };
export const DARK: Palette = { bg: '#151b27', ink: '#e9edf5', muted: '#a0a9ba', line: '#3a4458', grid: '#262e3d', accent: '#5cc8f0', accent2: '#f5a83a', good: '#6fe39b', warn: '#f3b65c', bad: '#f59a9a', night: '#0a0f1c', twilight: '#2b3a5c', day: '#2a3550', red: false };
export const RED: Palette = { bg: '#000000', ink: '#a30000', muted: '#6e0000', line: '#3a0000', grid: '#1c0000', accent: '#a30000', accent2: '#7a0000', good: '#a30000', warn: '#a30000', bad: '#c00000', night: '#080000', twilight: '#140000', day: '#240000', red: true };
/** The palette matching the page right now: red night mode, dark or light. */
export function pagePalette(): Palette {
  if (document.documentElement.classList.contains('red-mode')) return RED;
  return matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

/** Draw a figure into a canvas on the page, sharp on high-density screens. */
export function paint(canvas: HTMLCanvasElement, fig: Figure, pal = pagePalette()) {
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  canvas.width = Math.round(fig.w * dpr); canvas.height = Math.round(fig.h * dpr);
  canvas.style.aspectRatio = `${fig.w} / ${fig.h}`;
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, fig.w, fig.h);
  fig.draw(ctx, fig.w, fig.h, pal);
  canvas.setAttribute('aria-label', fig.alt);
}
function figurePng(fig: Figure, scale = 2): { canvas: HTMLCanvasElement; bytes: Promise<Uint8Array> } {
  const c = document.createElement('canvas');
  c.width = fig.w * scale; c.height = fig.h * scale;
  const ctx = c.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.fillStyle = LIGHT.bg; ctx.fillRect(0, 0, fig.w, fig.h);
  fig.draw(ctx, fig.w, fig.h, LIGHT);
  return { canvas: c, bytes: new Promise((res) => c.toBlob(async (b) => res(new Uint8Array(await b!.arrayBuffer())), 'image/png')) };
}

export function save(data: Uint8Array | Blob, name: string, type: string) {
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
export const fileSafe = (s: string) => s.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60) || 'fibub';

// ---------- PNG ----------
export async function toPng(title: string, sections: Section[], subtitle = ''): Promise<Blob> {
  const W = 1240, M = 56, IW = W - M * 2;
  const font = (size: number, weight = 400) => `${weight} ${size}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  const figs = sections.map((s) => (s.figure ? figurePng(s.figure).canvas : null));
  const run = (ctx: CanvasRenderingContext2D, draw: boolean) => {
    let y = M;
    const text = (t: string, size: number, weight: number, color: string, x = M, w = IW, lh = 1.4) => {
      ctx.font = font(size, weight); ctx.fillStyle = color; ctx.textBaseline = 'top';
      for (const line of wrap(ctx, t, w)) { if (draw) ctx.fillText(line, x, y); y += size * lh; }
    };
    text(title, 34, 700, LIGHT.ink);
    if (subtitle) { y += 4; text(subtitle, 17, 400, LIGHT.muted); }
    y += 12;
    sections.forEach((s, i) => {
      y += 18;
      if (draw) { ctx.fillStyle = LIGHT.line; ctx.fillRect(M, y - 10, IW, 1); }
      text(s.title, 24, 700, LIGHT.ink); y += 6;
      for (const t of s.text ?? []) { text(t, 17, 400, LIGHT.ink); y += 6; }
      if (s.facts?.length) {
        const cols = 3, cw = IW / cols;
        for (let r = 0; r < s.facts.length; r += cols) {
          const y0 = y; let maxY = y;
          s.facts.slice(r, r + cols).forEach(([k, v], j) => {
            y = y0;
            text(k, 14, 400, LIGHT.muted, M + j * cw, cw - 16);
            text(v, 19, 700, LIGHT.ink, M + j * cw, cw - 16);
            maxY = Math.max(maxY, y);
          });
          y = maxY + 10;
        }
      }
      const f = figs[i];
      if (f) {
        const fw = Math.min(IW, s.figure!.w * 1.25), h = (fw * f.height) / f.width;
        if (draw) ctx.drawImage(f, M, y, fw, h);
        y += h + 10;
      }
      if (s.table) {
        ctx.font = font(15);
        const widths = colWidths(s.table, (t) => ctx.measureText(t).width, IW);
        const row = (cells: string[], bold: boolean) => {
          ctx.font = font(15, bold ? 700 : 400);
          const lines = cells.map((c, j) => wrap(ctx, c, widths[j] - 12));
          const h = Math.max(...lines.map((l) => l.length)) * 21 + 10;
          if (draw) {
            let x = M;
            lines.forEach((ls, j) => {
              ls.forEach((l, k) => {
                ctx.fillStyle = bold ? LIGHT.muted : LIGHT.ink;
                const right = s.table!.align?.[j] === 'r';
                ctx.textAlign = right ? 'right' : 'left';
                ctx.fillText(l, right ? x + widths[j] - 8 : x + 4, y + 6 + k * 21);
              });
              x += widths[j];
            });
            ctx.textAlign = 'left';
            ctx.fillStyle = LIGHT.grid; ctx.fillRect(M, y + h - 1, IW, 1);
          }
          y += h;
        };
        row(s.table.head, true);
        for (const r of s.table.rows) row(r, false);
        y += 8;
      }
      if (s.note) { text(s.note, 14, 400, LIGHT.muted); }
    });
    y += 20;
    text('Made with fibub.com: free tools that run in your browser.', 14, 400, LIGHT.muted);
    return y + M - 20;
  };
  const probe = document.createElement('canvas').getContext('2d')!;
  const H = Math.ceil(run(probe, false));
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  run(ctx, true);
  return new Promise((res) => c.toBlob((b) => res(b!), 'image/png'));
}

function wrap(ctx: { measureText(t: string): { width: number } }, text: string, w: number): string[] {
  const out: string[] = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const t = line ? line + ' ' + word : word;
      if (ctx.measureText(t).width <= w || !line) line = t; else { out.push(line); line = word; }
      while (ctx.measureText(line).width > w && line.length > 1) {
        let k = line.length - 1;
        while (k > 1 && ctx.measureText(line.slice(0, k)).width > w) k--;
        out.push(line.slice(0, k)); line = line.slice(k);
      }
    }
    out.push(line);
  }
  return out;
}
/** Column widths in proportion to each column's longest cell, capped so no column hogs the row. */
function colWidths(t: { head: string[]; rows: string[][] }, measure: (s: string) => number, total: number) {
  const n = t.head.length;
  const want = t.head.map((h, j) => Math.max(measure(h), ...t.rows.map((r) => measure(r[j] ?? ''))) + 14);
  const cap = total * (n <= 2 ? 0.7 : 0.45);
  const capped = want.map((w) => Math.min(Math.max(w, 40), cap));
  const sum = capped.reduce((a, b) => a + b, 0);
  return capped.map((w) => (w / sum) * total);
}

// ---------- PDF ----------
export async function toPdf(title: string, sections: Section[], subtitle = ''): Promise<{ bytes: Uint8Array; lost: string[] }> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const { pdfSafe } = await import('./resume/pdf');
  const doc = await PDFDocument.create();
  doc.setTitle(title); doc.setCreator('fibub.com');
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [W, H] = [595.28, 841.89], M = 46, IW = W - M * 2;
  const ink = rgb(0.07, 0.09, 0.15), muted = rgb(0.36, 0.4, 0.47), line = rgb(0.85, 0.87, 0.91);
  const lost = new Set<string>();
  const safe = (s: string) => { const r = pdfSafe(s); r.lost.forEach((c) => lost.add(c)); return r.text; };
  let page = doc.addPage([W, H]), y = H - M;
  const need = (h: number) => { if (y - h < M) { page = doc.addPage([W, H]); y = H - M; } };
  const measurer = (f: typeof reg, size: number) => ({ measureText: (t: string) => ({ width: f.widthOfTextAtSize(t, size) }) });
  const text = (t: string, size: number, f = reg, color = ink, x = M, w = IW) => {
    for (const l of wrap(measurer(f, size), safe(t), w)) { need(size * 1.35); page.drawText(l, { x, y: y - size, size, font: f, color }); y -= size * 1.35; }
  };
  text(title, 20, bold);
  if (subtitle) { y -= 2; text(subtitle, 10.5, reg, muted); }
  const figW = (f: Figure) => Math.min(IW, f.w * 0.6);
  for (const s of sections) {
    y -= 14;
    need(40 + (s.figure ? (figW(s.figure) * s.figure.h) / s.figure.w : s.table ? 50 : 20));
    page.drawLine({ start: { x: M, y: y + 6 }, end: { x: W - M, y: y + 6 }, thickness: 0.6, color: line });
    text(s.title, 14, bold); y -= 3;
    for (const t of s.text ?? []) { text(t, 10.5); y -= 3; }
    if (s.facts?.length) {
      const cols = 3, cw = IW / cols;
      for (let r = 0; r < s.facts.length; r += cols) {
        need(32);
        const y0 = y; let minY = y;
        s.facts.slice(r, r + cols).forEach(([k, v], j) => {
          y = y0;
          text(k, 8.5, reg, muted, M + j * cw, cw - 10);
          text(v, 11, bold, ink, M + j * cw, cw - 10);
          minY = Math.min(minY, y);
        });
        y = minY - 5;
      }
    }
    if (s.figure) {
      const img = await doc.embedPng(await figurePng(s.figure).bytes);
      const fw = figW(s.figure), h = (fw * s.figure.h) / s.figure.w;
      need(h + 6);
      page.drawImage(img, { x: M, y: y - h, width: fw, height: h });
      y -= h + 8;
    }
    if (s.table) {
      const size = 8.5;
      const widths = colWidths(s.table, (t) => reg.widthOfTextAtSize(safe(t), size), IW);
      const row = (cells: string[], head: boolean) => {
        const f = head ? bold : reg;
        const lines = cells.map((c, j) => wrap(measurer(f, size), safe(c ?? ''), widths[j] - 8));
        const h = Math.max(...lines.map((l) => l.length)) * size * 1.3 + 6;
        need(h);
        let x = M;
        lines.forEach((ls, j) => {
          ls.forEach((l, k) => {
            const right = s.table!.align?.[j] === 'r';
            const tx = right ? x + widths[j] - 4 - f.widthOfTextAtSize(l, size) : x + 2;
            page.drawText(l, { x: tx, y: y - 3 - size - k * size * 1.3, size, font: f, color: head ? muted : ink });
          });
          x += widths[j];
        });
        y -= h;
        page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.4, color: line });
      };
      row(s.table.head, true);
      for (const r of s.table.rows) row(r, false);
      y -= 6;
    }
    if (s.note) text(s.note, 8.5, reg, muted);
  }
  y -= 10;
  text('Made with fibub.com: free tools that run in your browser.', 8, reg, muted);
  return { bytes: await doc.save(), lost: [...lost] };
}

// ---------- Word ----------
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
const run = (t: string, props = '') => `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
const para = (t: string, props = '', style = '') => `<w:p>${style || props ? `<w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ''}${props}</w:pPr>` : ''}${String(t).split('\n').map((l, i) => (i ? '<w:r><w:br/></w:r>' : '') + run(l)).join('')}</w:p>`;

export async function toDocx(title: string, sections: Section[], subtitle = ''): Promise<Uint8Array> {
  const { zipSync, strToU8 } = await import('fflate');
  const TW = 9746; // A4 text width in twentieths of a point (2 cm margins).
  const media: Record<string, Uint8Array> = {};
  const rels: string[] = [];
  let body = para(title, '', 'Title') + (subtitle ? para(subtitle, '', 'Subtitle') : '');
  let n = 0;
  const table = (head: string[], rows: string[][], widths: number[], align?: ('l' | 'r')[]) => {
    const cell = (t: string, w: number, j: number, b: boolean) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:spacing w:after="0"/>${align?.[j] === 'r' ? '<w:jc w:val="right"/>' : ''}</w:pPr>${run(t ?? '', b ? '<w:b/>' : '')}</w:p></w:tc>`;
    return `<w:tbl><w:tblPr><w:tblStyle w:val="Grid"/><w:tblW w:w="${TW}" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`
      + `<w:tr><w:trPr><w:tblHeader/></w:trPr>${head.map((h, j) => cell(h, widths[j], j, true)).join('')}</w:tr>`
      + rows.map((r) => `<w:tr><w:trPr><w:cantSplit/></w:trPr>${head.map((_, j) => cell(r[j] ?? '', widths[j], j, false)).join('')}</w:tr>`).join('') + '</w:tbl>' + para('');
  };
  for (const s of sections) {
    body += para(s.title, '', 'Heading1');
    for (const t of s.text ?? []) body += para(t);
    if (s.facts?.length) body += table(['', ''], s.facts.map(([k, v]) => [k, v]), [Math.round(TW * 0.4), Math.round(TW * 0.6)]).replace(/<w:tr><w:trPr><w:tblHeader\/><\/w:trPr>.*?<\/w:tr>/, '');
    if (s.figure) {
      n++;
      const bytes = await figurePng(s.figure).bytes;
      media[`word/media/fig${n}.png`] = bytes;
      rels.push(`<Relationship Id="rFig${n}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/fig${n}.png"/>`);
      const cx = Math.round(Math.min(TW, s.figure.w * 12) * 635), cy = Math.round((cx * s.figure.h) / s.figure.w);
      body += `<w:p><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${n}" name="Figure ${n}" descr="${esc(s.figure.alt)}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${n}" name="fig${n}.png" descr="${esc(s.figure.alt)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rFig${n}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
    }
    if (s.table) {
      const w = colWidths(s.table, (t) => t.length * 110, TW).map(Math.round);
      body += table(s.table.head, s.table.rows, w, s.table.align);
    }
    if (s.note) body += para(s.note, '', 'Note');
  }
  body += para('Made with fibub.com: free tools that run in your browser.', '', 'Note');
  const document = `${XML}<w:document ${NS}><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="540" w:footer="540" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const styles = `${XML}<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri" w:eastAsia="Calibri"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:color w:val="121826"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:qFormat/><w:rPr><w:color w:val="5D6577"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="280" w:after="80"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Note"><w:name w:val="Note"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="5D6577"/><w:sz w:val="17"/></w:rPr></w:style>
<w:style w:type="table" w:styleId="Grid"><w:name w:val="Table Grid"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:color="CFD5E1"/><w:bottom w:val="single" w:sz="4" w:color="CFD5E1"/><w:insideH w:val="single" w:sz="4" w:color="E4E7EF"/></w:tblBorders><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
</w:styles>`;
  return zipSync({
    '[Content_Types].xml': strToU8(`${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`),
    '_rels/.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`),
    'word/_rels/document.xml.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>${rels.join('')}</Relationships>`),
    'word/document.xml': strToU8(document),
    'word/styles.xml': strToU8(styles),
    'docProps/core.xml': strToU8(`${XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(title)}</dc:title><dc:creator>fibub.com</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 10)}T00:00:00Z</dcterms:created></cp:coreProperties>`),
    ...media,
  }, { level: 6 });
}

/** Wire a row of download buttons ([data-f=png|pdf|docx]) to a report. */
export function wireDownloads(root: HTMLElement, get: () => { title: string; subtitle?: string; sections: Section[]; file: string }) {
  root.addEventListener('click', async (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-f]');
    if (!b) return;
    const r = get();
    if (!r.sections.length) return;
    const old = b.textContent; b.disabled = true; b.textContent = 'Making…';
    try {
      if (b.dataset.f === 'png') save(await toPng(r.title, r.sections, r.subtitle), `${r.file}.png`, 'image/png');
      if (b.dataset.f === 'pdf') save((await toPdf(r.title, r.sections, r.subtitle)).bytes, `${r.file}.pdf`, 'application/pdf');
      if (b.dataset.f === 'docx') save(await toDocx(r.title, r.sections, r.subtitle), `${r.file}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } finally { b.disabled = false; b.textContent = old; }
  });
}
