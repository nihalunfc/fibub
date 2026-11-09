// Downloads for the shift scheduler: an editable Excel workbook (a sheet per department, coloured cells, frozen
// names and days), an editable Word document and a PDF (both landscape A4, a page per department) and a PNG image.
// Each takes "sheets": a heading and the table model from roster.ts. Only the PNG needs the DOM.
import type { TableModel, Cell } from './roster';

export type Sheet = { name: string; heading: string; table: TableModel };

const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
/** 'RRGGBB' from '#rgb' or '#rrggbb' (grey when it can't be read). */
const hex = (c: string) => { let h = c.replace('#', '').trim(); if (/^[0-9a-f]{3}$/i.test(h)) h = [...h].map((x) => x + x).join(''); return /^[0-9a-f]{6}$/i.test(h) ? h.toUpperCase() : 'E5E5E5'; };
const isNum = (s: string) => /^-?\d+(\.\d+)?$/.test(s) && !/^0\d/.test(s);

/** Longest text in each column, in characters (at least 3), used to size columns. */
export function colChars(t: TableModel) {
  return t.head.map((h, j) => Math.max(3, h.text.length, ...t.rows.map((r) => (r[j]?.text ?? '').length)));
}

// ---------- Excel ----------
const colName = (i: number) => { let s = ''; for (i++; i; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s; return s; };
/** Sheet names: at most 31 characters, none of []:*?/\ and all different. */
export function sheetNames(names: string[]) {
  const used = new Set<string>();
  return names.map((n) => {
    const base = (n.replace(/[[\]:*?/\\]/g, ' ').trim() || 'Schedule').slice(0, 31);
    let s = base;
    for (let i = 2; used.has(s.toLowerCase()); i++) s = `${base.slice(0, 31 - String(i).length - 1)} ${i}`;
    used.add(s.toLowerCase());
    return s;
  });
}

export async function rosterXlsx(sheets: Sheet[], title: string): Promise<Uint8Array> {
  const { zipSync, strToU8 } = await import('fflate');
  // Styles: fonts 0 normal, 1 bold, 2 bold large; fills 0 none, 1 gray125 (required), then one per colour.
  const fills: string[] = [], xfs: string[] = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'];
  const xfKey = new Map<string, number>();
  const style = (font: number, fill: string | undefined, border: boolean, align?: string) => {
    let fi = 0;
    if (fill) { let k = fills.indexOf(hex(fill)); if (k < 0) { fills.push(hex(fill)); k = fills.length - 1; } fi = k + 2; }
    const key = `${font}|${fi}|${border}|${align ?? ''}`;
    let x = xfKey.get(key);
    if (x === undefined) {
      const al = align === 'c' ? 'center' : align === 'r' ? 'right' : 'left';
      xfs.push(`<xf numFmtId="0" fontId="${font}" fillId="${fi}" borderId="${border ? 1 : 0}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="${al}" vertical="center"/></xf>`);
      x = xfs.length - 1; xfKey.set(key, x);
    }
    return x;
  };
  const names = sheetNames(sheets.map((s) => s.name));
  const files: Record<string, Uint8Array> = {};
  sheets.forEach((sh, si) => {
    const t = sh.table, rows: string[] = [];
    const cell = (ref: string, c: Cell, head = false) => {
      const s = style(head || c.bold ? 1 : 0, c.fill, true, c.align);
      if (c.text === '') return `<c r="${ref}" s="${s}"/>`;
      return isNum(c.text) && !head ? `<c r="${ref}" s="${s}"><v>${c.text}</v></c>` : `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${esc(c.text)}</t></is></c>`;
    };
    rows.push(`<row r="1"><c r="A1" s="${style(2, undefined, false)}" t="inlineStr"><is><t xml:space="preserve">${esc(title)}</t></is></c></row>`);
    rows.push(`<row r="2"><c r="A2" t="inlineStr"><is><t xml:space="preserve">${esc(sh.heading)}</t></is></c></row>`);
    rows.push(`<row r="4">${t.head.map((c, j) => cell(`${colName(j)}4`, c, true)).join('')}</row>`);
    t.rows.forEach((r, i) => rows.push(`<row r="${i + 5}">${r.map((c, j) => cell(`${colName(j)}${i + 5}`, c)).join('')}</row>`));
    const cols = colChars(t).map((w, j) => `<col min="${j + 1}" max="${j + 1}" width="${Math.min(40, w + 3)}" customWidth="1"/>`).join('');
    files[`xl/worksheets/sheet${si + 1}.xml`] = strToU8(`${XML}<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane xSplit="1" ySplit="4" topLeftCell="B5" activePane="bottomRight" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="16"/><cols>${cols}</cols><sheetData>${rows.join('')}</sheetData><pageSetup orientation="landscape" paperSize="9" fitToWidth="1" fitToHeight="0"/></worksheet>`);
  });
  const stylesXml = `${XML}<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="14"/><name val="Calibri"/></font></fonts><fills count="${fills.length + 2}"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>${fills.map((f) => `<fill><patternFill patternType="solid"><fgColor rgb="FF${f}"/><bgColor indexed="64"/></patternFill></fill>`).join('')}</fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFBFBFBF"/></left><right style="thin"><color rgb="FFBFBFBF"/></right><top style="thin"><color rgb="FFBFBFBF"/></top><bottom style="thin"><color rgb="FFBFBFBF"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const sheetList = names.map((n, i) => `<sheet name="${esc(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('');
  return zipSync({
    '[Content_Types].xml': strToU8(`${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`),
    '_rels/.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    'xl/workbook.xml': strToU8(`${XML}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheetList}</sheets></workbook>`),
    'xl/_rels/workbook.xml.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    'xl/styles.xml': strToU8(stylesXml),
    ...files,
  }, { level: 6 });
}

// ---------- Word ----------
export async function rosterDocx(sheets: Sheet[], title: string): Promise<Uint8Array> {
  const { zipSync, strToU8 } = await import('fflate');
  const TW = 15398; // landscape A4 text width in twentieths of a point (1.27 cm margins)
  const run = (t: string, b = false, sz?: number) => `<w:r>${b || sz ? `<w:rPr>${b ? '<w:b/>' : ''}${sz ? `<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>` : ''}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
  let body = '';
  sheets.forEach((sh, si) => {
    const t = sh.table, chars = colChars(t), sum = chars.reduce((a, b) => a + b, 0);
    const widths = chars.map((c) => Math.floor((TW * c) / sum));
    const sz = t.head.length > 14 ? 13 : t.head.length > 10 ? 16 : 19;
    const cell = (c: Cell, w: number, head: boolean) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${c.fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${hex(c.fill)}"/>` : ''}<w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="${c.align === 'c' ? 'center' : c.align === 'r' ? 'right' : 'left'}"/></w:pPr>${c.text ? run(c.text, head || !!c.bold, sz) : ''}</w:p></w:tc>`;
    if (si) body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    body += `<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr>${run(title)}</w:p><w:p><w:pPr><w:pStyle w:val="Subtitle"/></w:pPr>${run(sh.heading)}</w:p>`;
    body += `<w:tbl><w:tblPr><w:tblStyle w:val="Grid"/><w:tblW w:w="${TW}" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`
      + `<w:tr><w:trPr><w:tblHeader/></w:trPr>${t.head.map((c, j) => cell(c, widths[j], true)).join('')}</w:tr>`
      + t.rows.map((r) => `<w:tr><w:trPr><w:cantSplit/></w:trPr>${r.map((c, j) => cell(c, widths[j], false)).join('')}</w:tr>`).join('') + '</w:tbl>';
  });
  body += `<w:p><w:pPr><w:pStyle w:val="Note"/></w:pPr>${run('Made with fibub.com: free tools that run in your browser.')}</w:p>`;
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  const document = `${XML}<w:document ${NS}><w:body>${body}<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="400" w:footer="400" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const styles = `${XML}<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri" w:eastAsia="Calibri"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="60"/></w:pPr></w:pPrDefault></w:docDefaults>`
    + '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="140"/></w:pPr><w:rPr><w:color w:val="555555"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Note"><w:name w:val="Note"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="120"/></w:pPr><w:rPr><w:color w:val="555555"/><w:sz w:val="16"/></w:rPr></w:style>'
    + '<w:style w:type="table" w:styleId="Grid"><w:name w:val="Table Grid"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:color="BFBFBF"/><w:left w:val="single" w:sz="4" w:color="BFBFBF"/><w:bottom w:val="single" w:sz="4" w:color="BFBFBF"/><w:right w:val="single" w:sz="4" w:color="BFBFBF"/><w:insideH w:val="single" w:sz="4" w:color="BFBFBF"/><w:insideV w:val="single" w:sz="4" w:color="BFBFBF"/></w:tblBorders><w:tblCellMar><w:top w:w="30" w:type="dxa"/><w:left w:w="50" w:type="dxa"/><w:bottom w:w="30" w:type="dxa"/><w:right w:w="50" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>';
  return zipSync({
    '[Content_Types].xml': strToU8(`${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`),
    '_rels/.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`),
    'word/_rels/document.xml.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    'word/document.xml': strToU8(document),
    'word/styles.xml': strToU8(styles),
  }, { level: 6 });
}

// ---------- PDF ----------
export async function rosterPdf(sheets: Sheet[], title: string): Promise<{ bytes: Uint8Array; lost: string[] }> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const { pdfSafe } = await import('./resume/pdf.ts');
  const doc = await PDFDocument.create();
  doc.setTitle(title); doc.setCreator('fibub.com');
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [W, H] = [841.89, 595.28], M = 28, IW = W - 2 * M;
  const lost = new Set<string>();
  const safe = (s: string) => { const r = pdfSafe(s); r.lost.forEach((c) => lost.add(c)); return r.text; };
  const col = (c: string) => { const h = hex(c); return rgb(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255); };
  const ink = rgb(0.05, 0.05, 0.05), muted = rgb(0.36, 0.36, 0.36), line = rgb(0.75, 0.75, 0.75), headFill = rgb(0.94, 0.94, 0.94);
  for (const sh of sheets) {
    const t = sh.table;
    // Natural widths at 9 pt, then a font size that makes the table fit the page width (not below 5 pt).
    const nat = t.head.map((h, j) => Math.max(bold.widthOfTextAtSize(safe(h.text), 9), ...t.rows.map((r) => (r[j]?.bold ? bold : reg).widthOfTextAtSize(safe(r[j]?.text ?? ''), 9)), 14) + 8);
    // k shrinks (or slightly grows) everything to the page width; text that still doesn't fit at 5 pt is cut with …
    const total = nat.reduce((a, b) => a + b, 0), k = Math.min(1.25, IW / total), size = Math.max(5, 9 * k);
    const ws = nat.map((w) => w * k);
    const rh = Math.max(11, size * 1.9);
    let page = doc.addPage([W, H]), y = H - M;
    const header = (first: boolean) => {
      if (first) {
        page.drawText(safe(title), { x: M, y: y - 16, size: 16, font: bold, color: ink }); y -= 22;
        page.drawText(safe(sh.heading), { x: M, y: y - 10, size: 10, font: reg, color: muted }); y -= 18;
      } else { page.drawText(safe(`${title}: ${sh.heading} (continued)`), { x: M, y: y - 9, size: 9, font: reg, color: muted }); y -= 15; }
      row(t.head, true);
    };
    const fit = (s: string, f: typeof reg, w: number) => {
      let x = safe(s);
      if (f.widthOfTextAtSize(x, size) <= w) return x;
      while (x.length > 1 && f.widthOfTextAtSize(`${x}…`, size) > w) x = x.slice(0, -1);
      return `${x}…`;
    };
    const row = (cells: Cell[], head: boolean) => {
      let x = M;
      cells.forEach((c, j) => {
        const w = ws[j];
        if (head) page.drawRectangle({ x, y: y - rh, width: w, height: rh, color: headFill });
        else if (c.fill) page.drawRectangle({ x, y: y - rh, width: w, height: rh, color: col(c.fill) });
        page.drawRectangle({ x, y: y - rh, width: w, height: rh, borderColor: line, borderWidth: 0.5 });
        const f = head || c.bold ? bold : reg, s = fit(c.text, f, w - 4), sw = f.widthOfTextAtSize(s, size);
        const tx = c.align === 'c' ? x + (w - sw) / 2 : c.align === 'r' ? x + w - 3 - sw : x + 3;
        if (s) page.drawText(s, { x: tx, y: y - rh / 2 - size * 0.35, size, font: f, color: c.text === 'off' ? muted : ink });
        x += w;
      });
      y -= rh;
    };
    header(true);
    for (const r of t.rows) {
      if (y - rh < M + 14) { page = doc.addPage([W, H]); y = H - M; header(false); }
      row(r, false);
    }
    page.drawText('Made with fibub.com', { x: M, y: M - 4, size: 7, font: reg, color: muted });
  }
  return { bytes: await doc.save(), lost: [...lost] };
}

// ---------- Image ----------
/** Size in CSS pixels of the PNG for these sheets, stacked one under another. */
export function drawSheets(ctx: CanvasRenderingContext2D | null, sheets: Sheet[], title: string, scale = 1) {
  const F = 'Arial, Helvetica, sans-serif', fs = 14, rh = 28, pad = 24;
  const meas = document.createElement('canvas').getContext('2d')!;
  const tw = (s: string, b = false) => { meas.font = `${b ? 'bold ' : ''}${fs}px ${F}`; return meas.measureText(s).width; };
  const layouts = sheets.map((sh) => ({ sh, ws: sh.table.head.map((h, j) => Math.ceil(Math.max(tw(h.text, true), ...sh.table.rows.map((r) => tw(r[j]?.text ?? '', !!r[j]?.bold)), 18) + 16)) }));
  const W = Math.max(...layouts.map((l) => l.ws.reduce((a, b) => a + b, 0)), tw(title, true) * 1.6) + pad * 2;
  const H = pad + 34 + layouts.reduce((a, l) => a + 30 + rh * (l.sh.table.rows.length + 1) + 22, 0) + 18;
  if (!ctx) return { w: W, h: H };
  ctx.save(); ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0a0a0a'; ctx.font = `bold 24px ${F}`; ctx.fillText(title, pad, pad + 14);
  let y = pad + 34;
  for (const { sh, ws } of layouts) {
    ctx.fillStyle = '#5c5c5c'; ctx.font = `15px ${F}`; ctx.fillText(sh.heading, pad, y + 14); y += 30;
    const rowDraw = (cells: Cell[], head: boolean) => {
      let x = pad;
      cells.forEach((c, j) => {
        const w = ws[j];
        ctx.fillStyle = head ? '#f0f0f0' : c.fill ?? '#ffffff'; ctx.fillRect(x, y, w, rh);
        ctx.strokeStyle = '#bfbfbf'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w, rh);
        ctx.font = `${head || c.bold ? 'bold ' : ''}${fs}px ${F}`; ctx.fillStyle = c.text === 'off' ? '#8a8a8a' : '#0a0a0a';
        const m = ctx.measureText(c.text).width;
        ctx.fillText(c.text, c.align === 'c' ? x + (w - m) / 2 : c.align === 'r' ? x + w - 8 - m : x + 8, y + rh / 2 + 1);
        x += w;
      });
      y += rh;
    };
    rowDraw(sh.table.head, true);
    for (const r of sh.table.rows) rowDraw(r, false);
    y += 22;
  }
  ctx.fillStyle = '#8a8a8a'; ctx.font = `12px ${F}`; ctx.fillText('Made with fibub.com', pad, H - 14);
  ctx.restore();
  return { w: W, h: H };
}
export async function rosterPng(sheets: Sheet[], title: string): Promise<Blob> {
  const size = drawSheets(null, sheets, title);
  const scale = Math.min(2, Math.sqrt(30e6 / (size.w * size.h)), 16000 / size.h, 16000 / size.w);
  const c = document.createElement('canvas');
  c.width = Math.round(size.w * scale); c.height = Math.round(size.h * scale);
  drawSheets(c.getContext('2d')!, sheets, title, scale);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Could not make the image'))), 'image/png'));
}
