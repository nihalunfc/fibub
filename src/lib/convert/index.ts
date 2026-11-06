// File converter: only conversions that work fully in the browser.
import { parseCsv, toCsv, tableToJson, jsonToTable, tableToXlsx, xlsxToTables } from './table';
import { zipAsync } from '../compress/zipper';
import { DEFAULTS } from '../prune/clean';

export type Kind = 'image' | 'pdf' | 'docx' | 'csv' | 'xlsx' | 'json';
export interface Target { id: string; label: string; ext: string }

export function kindOf(f: File): Kind | null {
  const e = f.name.toLowerCase().split('.').pop() ?? '';
  if (/^(jpe?g|png|webp|avif|gif|bmp)$/.test(e) || /^image\/(jpeg|png|webp|avif|gif|bmp)$/.test(f.type)) return 'image';
  if (e === 'pdf') return 'pdf';
  if (e === 'docx') return 'docx';
  if (e === 'csv' || e === 'tsv') return 'csv';
  if (e === 'xlsx') return 'xlsx';
  if (e === 'json') return 'json';
  return null;
}

export function targetsFor(kind: Kind, imageFormats: string[]): Target[] {
  switch (kind) {
    case 'image': return [
      ...imageFormats.map((m) => ({ id: m, label: m.split('/')[1].toUpperCase().replace('JPEG', 'JPG'), ext: m === 'image/jpeg' ? 'jpg' : m.split('/')[1] })),
      { id: 'pdf', label: 'PDF', ext: 'pdf' }];
    case 'pdf': return [{ id: 'image/jpeg', label: 'JPG', ext: 'jpg' }, { id: 'image/png', label: 'PNG', ext: 'png' }, { id: 'md', label: 'Markdown', ext: 'md' }, { id: 'txt', label: 'Text', ext: 'txt' }];
    case 'docx': return [{ id: 'html', label: 'Web page (HTML)', ext: 'html' }, { id: 'md', label: 'Markdown', ext: 'md' }, { id: 'txt', label: 'Text', ext: 'txt' }];
    case 'csv': return [{ id: 'xlsx', label: 'Excel', ext: 'xlsx' }, { id: 'json', label: 'JSON', ext: 'json' }];
    case 'xlsx': return [{ id: 'csv', label: 'CSV', ext: 'csv' }, { id: 'json', label: 'JSON', ext: 'json' }];
    case 'json': return [{ id: 'csv', label: 'CSV', ext: 'csv' }, { id: 'xlsx', label: 'Excel', ext: 'xlsx' }];
  }
}

export interface Converted { name: string; blob: Blob; note: string }
type Progress = (label: string) => void;
const base = (n: string) => n.replace(/\.[^.]+$/, '');
const text = (f: File) => f.text();
const MIME: Record<string, string> = { csv: 'text/csv', json: 'application/json', md: 'text/markdown', txt: 'text/plain', html: 'text/html', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', pdf: 'application/pdf', zip: 'application/zip' };

async function bitmap(f: File) {
  try { return await createImageBitmap(f); } catch { throw new Error('IMAGE_DECODE'); }
}
function canvasBlob(c: HTMLCanvasElement, mime: string, q = 0.92) {
  return new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('ENCODE'))), mime, q));
}
async function drawImage(f: File, mime: string) {
  const bmp = await bitmap(f);
  const c = document.createElement('canvas');
  c.width = bmp.width; c.height = bmp.height;
  const ctx = c.getContext('2d')!;
  if (mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); } // JPG has no transparency
  ctx.drawImage(bmp, 0, 0); bmp.close();
  const b = await canvasBlob(c, mime);
  c.width = c.height = 0;
  return b;
}
async function many(files: { name: string; data: Uint8Array }[], zipName: string, mime: string): Promise<{ name: string; blob: Blob }> {
  if (files.length === 1) return { name: files[0].name, blob: new Blob([files[0].data as Uint8Array<ArrayBuffer>], { type: mime }) };
  const z = await zipAsync(Object.fromEntries(files.map((f) => [f.name, f.data])), { level: 0 });
  return { name: zipName, blob: new Blob([z as Uint8Array<ArrayBuffer>], { type: MIME.zip }) };
}

function mdToHtml(md: string, title: string) {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const out: string[] = [];
  let list = false;
  for (const block of md.split(/\n{2,}/)) {
    const b = block.trim();
    if (!b) continue;
    const h = b.match(/^(#{1,4})\s+(.*)$/);
    if (b.startsWith('- ')) { if (!list) { out.push('<ul>'); list = true; } out.push(`<li>${inline(b.slice(2))}</li>`); continue; }
    if (list) { out.push('</ul>'); list = false; }
    out.push(h ? `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>` : `<p>${inline(b).replace(/\n/g, '<br>')}</p>`);
  }
  if (list) out.push('</ul>');
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title></head><body>\n${out.join('\n')}\n</body></html>\n`;
}

export async function convert(files: File[], target: Target, onProgress: Progress): Promise<Converted> {
  const kind = kindOf(files[0])!;
  const name = base(files[0].name);
  const blobOf = (s: string | Uint8Array, ext: string) => new Blob([s as any], { type: MIME[ext] });

  if (kind === 'image' && target.id === 'pdf') {
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    for (const [i, f] of files.entries()) {
      onProgress(`Adding picture ${i + 1} of ${files.length}…`);
      const isPng = f.type === 'image/png' || /\.png$/i.test(f.name);
      const isJpg = f.type === 'image/jpeg' || /\.jpe?g$/i.test(f.name);
      const bytes = isPng || isJpg ? new Uint8Array(await f.arrayBuffer()) : new Uint8Array(await (await drawImage(f, 'image/jpeg')).arrayBuffer());
      const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const w = img.width * 0.75, h = img.height * 0.75; // 96 pixels per inch -> points
      doc.addPage([w, h]).drawImage(img, { x: 0, y: 0, width: w, height: h });
    }
    const out = await doc.save();
    return { name: `${files.length > 1 ? 'pictures' : name}.pdf`, blob: blobOf(out, 'pdf'), note: `${files.length} picture${files.length === 1 ? '' : 's'}, one per page.` };
  }
  if (kind === 'image') {
    const outs = [];
    for (const [i, f] of files.entries()) {
      onProgress(`Converting picture ${i + 1} of ${files.length}…`);
      outs.push({ name: `${base(f.name)}.${target.ext}`, data: new Uint8Array(await (await drawImage(f, target.id)).arrayBuffer()) });
    }
    const r = await many(outs, `pictures-${target.ext}.zip`, target.id);
    return { ...r, note: files.length > 1 ? `${files.length} pictures in one ZIP.` : '' };
  }
  if (kind === 'pdf' && target.id.startsWith('image/')) {
    const { loadPdfJs } = await import('../compress/pdf');
    const pdfjs = await loadPdfJs();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await files[0].arrayBuffer()), isEvalSupported: false }).promise;
    const outs = [];
    const c = document.createElement('canvas'), ctx = c.getContext('2d', { alpha: false })!;
    try {
      for (let p = 1; p <= doc.numPages; p++) {
        onProgress(`Drawing page ${p} of ${doc.numPages}…`);
        const page = await doc.getPage(p);
        let scale = 150 / 72;
        const vp0 = page.getViewport({ scale });
        if (vp0.width * vp0.height > 16e6) scale *= Math.sqrt(16e6 / (vp0.width * vp0.height));
        const vp = page.getViewport({ scale });
        c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        outs.push({ name: `${name}-page-${String(p).padStart(String(doc.numPages).length, '0')}.${target.ext}`, data: new Uint8Array(await (await canvasBlob(c, target.id, 0.9)).arrayBuffer()) });
        page.cleanup();
      }
    } finally { c.width = c.height = 0; await doc.destroy(); }
    const r = await many(outs, `${name}-${target.ext}.zip`, target.id);
    return { ...r, note: `${outs.length} page${outs.length === 1 ? '' : 's'} at 150 DPI${outs.length > 1 ? ', in one ZIP' : ''}.` };
  }
  if (kind === 'pdf') {
    const { pdfToMarkdown } = await import('../prune/pdf');
    const o = { ...DEFAULTS, headers: false, pageNumbers: false, boilerplate: false };
    const r = await pdfToMarkdown(new Uint8Array(await files[0].arrayBuffer()), o, (d, t) => onProgress(`Reading page ${d} of ${t}…`));
    if (!r.markdown.trim()) throw new Error('NO_TEXT');
    const body = target.id === 'md' ? r.markdown : r.markdown.replace(/^#{1,4}\s+/gm, '').replace(/^- /gm, '• ');
    return { name: `${name}.${target.ext}`, blob: blobOf(body, target.ext), note: 'Text only: pictures and layout are not kept.' };
  }
  if (kind === 'docx') {
    const { docxToMarkdown } = await import('../prune/docs');
    const md = docxToMarkdown(new Uint8Array(await files[0].arrayBuffer()), { ...DEFAULTS, boilerplate: false }).markdown;
    const body = target.id === 'html' ? mdToHtml(md, name) : target.id === 'md' ? md : md.replace(/\*\*/g, '').replace(/^#{1,4}\s+/gm, '').replace(/^- /gm, '• ');
    return { name: `${name}.${target.ext}`, blob: blobOf(body, target.ext), note: 'Text, headings, lists and bold are kept; pictures and page layout are not.' };
  }
  // Tables
  let tables: { name: string; table: string[][] }[];
  if (kind === 'csv') tables = [{ name, table: parseCsv(await text(files[0])) }];
  else if (kind === 'json') { try { tables = [{ name, table: jsonToTable(await text(files[0])) }]; } catch { throw new Error('BAD_JSON'); } }
  else tables = xlsxToTables(new Uint8Array(await files[0].arrayBuffer())).filter((t) => t.table.length);
  if (!tables.length || !tables[0].table.length) throw new Error('EMPTY');
  const rows = tables.reduce((n, t) => n + t.table.length, 0);
  if (target.id === 'xlsx') return { name: `${name}.xlsx`, blob: blobOf(tableToXlsx(tables[0].table, name), 'xlsx'), note: `${rows.toLocaleString('en')} rows.` };
  const outs = tables.map((t) => ({ name: `${tables.length > 1 ? `${name}-${t.name}` : name}.${target.ext}`, data: new TextEncoder().encode(target.id === 'csv' ? '﻿' + toCsv(t.table) : tableToJson(t.table)) }));
  const r = await many(outs, `${name}-${target.ext}.zip`, MIME[target.ext]);
  return { ...r, note: `${rows.toLocaleString('en')} rows${tables.length > 1 ? `, ${tables.length} sheets in one ZIP` : ''}.` };
}
