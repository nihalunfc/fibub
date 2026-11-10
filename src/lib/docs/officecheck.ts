// Reads and cleans the hidden information in files: Office (ZIP), PDF, JPEG and PNG.
// Nothing here touches the DOM. Heavy libraries load with import() so pages stay light.
import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';

export type Kind = 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'jpg' | 'png';
export interface MetaItem { label: string; value: string; risk?: boolean }
export interface Finding { level: 'green' | 'amber' | 'red'; title: string; detail: string }

const startsWith = (b: Uint8Array, ...s: number[]) => s.every((v, i) => b[i] === v);

export function detectKind(bytes: Uint8Array): Kind | null {
  if (startsWith(bytes, 0x25, 0x50, 0x44, 0x46)) return 'pdf';
  if (startsWith(bytes, 0xff, 0xd8, 0xff)) return 'jpg';
  if (startsWith(bytes, 0x89, 0x50, 0x4e, 0x47)) return 'png';
  if (startsWith(bytes, 0x50, 0x4b)) {
    try {
      const names = Object.keys(unzipSync(bytes, { filter: (f) => /^(word|xl|ppt)\/[^/]*\.xml$/.test(f.name) && /^(word\/document|xl\/workbook|ppt\/presentation)\.xml$/.test(f.name) }));
      if (names.includes('word/document.xml')) return 'docx';
      if (names.includes('xl/workbook.xml')) return 'xlsx';
      if (names.includes('ppt/presentation.xml')) return 'pptx';
    } catch { /* not a zip */ }
  }
  return null;
}

export const KIND_NAMES: Record<Kind, string> = { docx: 'Word', xlsx: 'Excel', pptx: 'PowerPoint', pdf: 'PDF', jpg: 'JPEG photo', png: 'PNG picture' };
export const OFFICE = (k: Kind) => k === 'docx' || k === 'xlsx' || k === 'pptx';

type Files = Record<string, Uint8Array>;
const text = (f: Files, p: string) => (f[p] ? strFromU8(f[p]) : '');
const names = (f: Files, re: RegExp) => Object.keys(f).filter((n) => re.test(n));
const count = (s: string, re: RegExp) => (s.match(re) || []).length;
const xmlDecode = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? xmlDecode(m[1]).trim() : '';
}

// ---------------------------------------------------------------- Office metadata
const CORE: [string, string][] = [['dc:creator', 'Author'], ['cp:lastModifiedBy', 'Last modified by'], ['dc:title', 'Title'], ['dc:subject', 'Subject'], ['cp:keywords', 'Keywords'], ['dc:description', 'Comments'], ['cp:category', 'Category'], ['cp:revision', 'Revision count'], ['dcterms:created', 'Created'], ['dcterms:modified', 'Last saved'], ['cp:lastPrinted', 'Last printed']];
const APP: [string, string][] = [['Company', 'Company'], ['Manager', 'Manager'], ['TotalTime', 'Total editing time (minutes)'], ['Application', 'Made with'], ['AppVersion', 'App version'], ['Template', 'Template'], ['HyperlinkBase', 'Link base']];
const PERSONAL = new Set(['Author', 'Last modified by', 'Company', 'Manager']);

function officeMeta(f: Files): MetaItem[] {
  const out: MetaItem[] = [], core = text(f, 'docProps/core.xml'), app = text(f, 'docProps/app.xml');
  for (const [t, label] of CORE) { const v = tag(core, t); if (v) out.push({ label, value: v, risk: PERSONAL.has(label) }); }
  for (const [t, label] of APP) { const v = tag(app, t); if (v && v !== '0') out.push({ label, value: v, risk: PERSONAL.has(label) }); }
  if (f['docProps/custom.xml']) {
    const n = count(text(f, 'docProps/custom.xml'), /<property\s/g);
    out.push({ label: 'Custom properties', value: `${n} stored` });
  }
  if (names(f, /^docProps\/thumbnail\./).length) out.push({ label: 'Preview picture', value: 'A small picture of the first page is stored' });
  if (f['word/people.xml']) out.push({ label: 'Reviewer names', value: 'A list of people who edited is stored', risk: true });
  return out;
}

// ---------------------------------------------------------------- PDF
async function pdfLib() { return import('pdf-lib'); }

async function pdfMeta(bytes: Uint8Array): Promise<MetaItem[]> {
  const L = await pdfLib(), doc = await L.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  const out: MetaItem[] = [];
  const info = doc.context.lookupMaybe(doc.context.trailerInfo.Info, L.PDFDict);
  if (info) {
    const labels: Record<string, string> = { Title: 'Title', Author: 'Author', Subject: 'Subject', Keywords: 'Keywords', Creator: 'Made with', Producer: 'PDF software', CreationDate: 'Created', ModDate: 'Last saved' };
    for (const k of info.keys()) {
      const key = k.decodeText(), v = info.lookup(k);
      const s = v instanceof L.PDFString || v instanceof L.PDFHexString ? v.decodeText() : String(v);
      if (s.trim()) out.push({ label: labels[key] || key, value: key.endsWith('Date') ? pdfDate(s) : s, risk: key === 'Author' });
    }
  }
  const xmp = doc.catalog.lookupMaybe(L.PDFName.of('Metadata'), L.PDFRawStream);
  if (xmp) {
    out.push({ label: 'XMP block', value: 'Extra descriptive data is stored (it often repeats the author and dates)' });
    try {
      const raw = (await import('pdf-lib')).decodePDFRawStream(xmp).decode();
      const m = strFromU8(raw);
      const who = [...m.matchAll(/<dc:creator>[\s\S]*?<rdf:li[^>]*>([^<]*)</g)].map((x) => x[1].trim()).filter(Boolean);
      if (who.length) out.push({ label: 'XMP author', value: who.join(', '), risk: true });
    } catch { /* leave the generic line */ }
  }
  return out;
}
function pdfDate(s: string) {
  const m = s.match(/D:(\d{4})(\d\d)?(\d\d)?(\d\d)?(\d\d)?/);
  return m ? `${m[1]}-${m[2] || '01'}-${m[3] || '01'}${m[4] ? ` ${m[4]}:${m[5] || '00'}` : ''}` : s;
}

async function pdfClean(bytes: Uint8Array): Promise<Uint8Array> {
  const L = await pdfLib(), doc = await L.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  const info = doc.context.lookupMaybe(doc.context.trailerInfo.Info, L.PDFDict);
  if (info) for (const k of [...info.keys()]) info.delete(k);
  doc.catalog.delete(L.PDFName.of('Metadata'));
  doc.catalog.delete(L.PDFName.of('PieceInfo'));
  for (const p of doc.getPages()) { p.node.delete(L.PDFName.of('Metadata')); p.node.delete(L.PDFName.of('PieceInfo')); }
  return doc.save({ useObjectStreams: false });
}

// ---------------------------------------------------------------- JPEG
interface Exif { make?: string; model?: string; software?: string; date?: string; lat?: number; lon?: number; orientation?: number; other?: number }

function readExif(b: Uint8Array, start: number, end: number): Exif | null {
  // start points at "Exif\0\0"
  const t = start + 6;
  if (end - t < 8) return null;
  const le = b[t] === 0x49, dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const u16 = (o: number) => dv.getUint16(o, le), u32 = (o: number) => dv.getUint32(o, le);
  const sizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1 };
  const str = (o: number, n: number) => { let s = ''; for (let i = 0; i < n && b[o + i]; i++) s += String.fromCharCode(b[o + i]); return s.trim(); };
  const ifd = (off: number) => {
    const res: Record<number, { type: number; n: number; at: number }> = {};
    let o = t + off; if (o + 2 > end) return res;
    const cnt = u16(o); o += 2;
    for (let i = 0; i < cnt && o + 12 <= end; i++, o += 12) {
      const type = u16(o + 2), n = u32(o + 4), size = (sizes[type] || 1) * n;
      res[u16(o)] = { type, n, at: size <= 4 ? o + 8 : t + u32(o + 8) };
    }
    return res;
  };
  const rat = (at: number) => { const d = u32(at + 4); return d ? u32(at) / d : 0; };
  try {
    const i0 = ifd(u32(t + 4)), e: Exif = {};
    if (i0[0x010f]) e.make = str(i0[0x010f].at, i0[0x010f].n);
    if (i0[0x0110]) e.model = str(i0[0x0110].at, i0[0x0110].n);
    if (i0[0x0131]) e.software = str(i0[0x0131].at, i0[0x0131].n);
    if (i0[0x0132]) e.date = str(i0[0x0132].at, i0[0x0132].n);
    if (i0[0x0112]) e.orientation = u16(i0[0x0112].at);
    if (i0[0x8769]) {
      const sub = ifd(u32(i0[0x8769].at));
      if (sub[0x9003]) e.date = str(sub[0x9003].at, sub[0x9003].n);
    }
    if (i0[0x8825]) {
      const g = ifd(u32(i0[0x8825].at));
      if (g[2] && g[4]) {
        const dms = (a: number) => rat(a) + rat(a + 8) / 60 + rat(a + 16) / 3600;
        let lat = dms(g[2].at), lon = dms(g[4].at);
        if (g[1] && String.fromCharCode(b[g[1].at]) === 'S') lat = -lat;
        if (g[3] && String.fromCharCode(b[g[3].at]) === 'W') lon = -lon;
        e.lat = lat; e.lon = lon;
      }
    }
    return e;
  } catch { return null; }
}

interface Seg { marker: number; start: number; end: number }
function jpegSegments(b: Uint8Array): { segs: Seg[]; scan: number } {
  const segs: Seg[] = []; let p = 2;
  while (p + 4 <= b.length && b[p] === 0xff) {
    const m = b[p + 1];
    if (m === 0xff) { p++; continue; }
    if (m === 0xda || m === 0xd9) break;
    if ((m >= 0xd0 && m <= 0xd7) || m === 0x01) { p += 2; continue; }
    const len = (b[p + 2] << 8) | b[p + 3];
    segs.push({ marker: m, start: p, end: Math.min(b.length, p + 2 + len) });
    p += 2 + len;
  }
  return { segs, scan: p };
}
const isExif = (b: Uint8Array, s: Seg) => s.marker === 0xe1 && b[s.start + 4] === 0x45 && b[s.start + 5] === 0x78;
const isXmp = (b: Uint8Array, s: Seg) => s.marker === 0xe1 && !isExif(b, s);

function jpegMeta(b: Uint8Array): MetaItem[] {
  const { segs } = jpegSegments(b), out: MetaItem[] = [];
  for (const s of segs) {
    if (isExif(b, s)) {
      const e = readExif(b, s.start + 4, s.end);
      if (!e) { out.push({ label: 'EXIF block', value: 'Present (could not be read)' }); continue; }
      if (e.lat !== undefined && e.lon !== undefined) out.push({ label: 'GPS location', value: `${e.lat.toFixed(5)}, ${e.lon.toFixed(5)}`, risk: true });
      if (e.make || e.model) out.push({ label: 'Camera', value: [e.make, e.model].filter(Boolean).join(' '), risk: true });
      if (e.date) out.push({ label: 'Date taken', value: e.date, risk: true });
      if (e.software) out.push({ label: 'Software', value: e.software });
      out.push({ label: 'EXIF block', value: 'Present' });
    } else if (isXmp(b, s)) out.push({ label: 'XMP block', value: 'Extra descriptive data is stored' });
    else if (s.marker === 0xed) out.push({ label: 'IPTC block', value: 'Caption, credit or keywords may be stored' });
    else if (s.marker === 0xfe) out.push({ label: 'Comment', value: strFromU8(b.subarray(s.start + 4, s.end)).slice(0, 120) });
  }
  return out;
}

function orientationExif(o: number): Uint8Array {
  // Smallest valid EXIF holding only the orientation, so the picture still shows the right way up.
  const t = [0x45, 0x78, 0x69, 0x66, 0, 0, 0x4d, 0x4d, 0, 0x2a, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, o, 0, 0, 0, 0, 0, 0];
  const len = t.length + 2;
  return Uint8Array.from([0xff, 0xe1, len >> 8, len & 255, ...t]);
}

function jpegClean(b: Uint8Array): Uint8Array {
  const { segs, scan } = jpegSegments(b), parts: Uint8Array[] = [b.subarray(0, 2)];
  let orient = 1;
  for (const s of segs) {
    if (isExif(b, s)) { const e = readExif(b, s.start + 4, s.end); if (e?.orientation) orient = e.orientation; }
    if (isExif(b, s) || isXmp(b, s) || s.marker === 0xed || s.marker === 0xfe) continue;
    parts.push(b.subarray(s.start, s.end));
  }
  if (orient > 1 && orient <= 8) parts.splice(1, 0, orientationExif(orient));
  parts.push(b.subarray(scan));
  return concat(parts);
}

// ---------------------------------------------------------------- PNG
const PNG_META = new Set(['tEXt', 'zTXt', 'iTXt', 'eXIf', 'tIME']);
function pngChunks(b: Uint8Array) {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength), out: { type: string; start: number; end: number }[] = [];
  let p = 8;
  while (p + 12 <= b.length) {
    const len = dv.getUint32(p), type = String.fromCharCode(b[p + 4], b[p + 5], b[p + 6], b[p + 7]);
    out.push({ type, start: p, end: Math.min(b.length, p + 12 + len) });
    p += 12 + len;
  }
  return out;
}
function pngMeta(b: Uint8Array): MetaItem[] {
  const out: MetaItem[] = [];
  for (const c of pngChunks(b)) {
    if (c.type === 'tEXt') { const s = strFromU8(b.subarray(c.start + 8, c.end - 4)).split('\0'); out.push({ label: `Text: ${s[0]}`, value: (s[1] || '').slice(0, 120), risk: /author|artist|copyright|location|gps/i.test(s[0]) }); }
    else if (c.type === 'iTXt' || c.type === 'zTXt') out.push({ label: 'Text block', value: strFromU8(b.subarray(c.start + 8, c.start + 28)).split('\0')[0] });
    else if (c.type === 'eXIf') out.push({ label: 'EXIF block', value: 'Present (camera, date or location may be stored)', risk: true });
    else if (c.type === 'tIME') out.push({ label: 'Last changed', value: 'A modification time is stored' });
  }
  return out;
}
function pngClean(b: Uint8Array): Uint8Array {
  return concat([b.subarray(0, 8), ...pngChunks(b).filter((c) => !PNG_META.has(c.type)).map((c) => b.subarray(c.start, c.end))]);
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

// ---------------------------------------------------------------- Office cleaning
function dropPart(f: Files, path: string) {
  delete f[path];
  const ct = text(f, '[Content_Types].xml');
  if (ct) f['[Content_Types].xml'] = strToU8(ct.replace(new RegExp(`<Override[^>]*PartName="/${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*/>`, 'g'), ''));
  const base = path.split('/').pop()!;
  for (const r of names(f, /\.rels$/)) {
    const x = text(f, r), y = x.replace(new RegExp(`<Relationship\\b[^>]*Target="[^"]*${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*/>`, 'g'), '');
    if (x !== y) f[r] = strToU8(y);
  }
}
function blank(xml: string, tags: string[]): string {
  let s = xml;
  for (const t of tags) s = s.replace(new RegExp(`<${t}(\\s[^>]*)?>[\\s\\S]*?</${t}>`, 'g'), '').replace(new RegExp(`<${t}(\\s[^>]*)?/>`, 'g'), '');
  return s;
}
function officeClean(bytes: Uint8Array): Uint8Array {
  const f = unzipSync(bytes);
  if (f['docProps/core.xml']) f['docProps/core.xml'] = strToU8(blank(text(f, 'docProps/core.xml'), CORE.map((c) => c[0])));
  if (f['docProps/app.xml']) f['docProps/app.xml'] = strToU8(blank(text(f, 'docProps/app.xml'), APP.map((c) => c[0]).concat(['TitlesOfParts', 'HeadingPairs', 'Words', 'Characters', 'CharactersWithSpaces', 'Lines', 'Paragraphs', 'Pages'])));
  for (const p of ['docProps/custom.xml', 'word/people.xml', ...names(f, /^docProps\/thumbnail\./)]) if (f[p]) dropPart(f, p);
  // Keep [Content_Types].xml first, as Office expects.
  const ordered: Files = {};
  if (f['[Content_Types].xml']) ordered['[Content_Types].xml'] = f['[Content_Types].xml'];
  for (const k of Object.keys(f)) ordered[k] = f[k];
  return zipSync(ordered, { level: 6 });
}

// ---------------------------------------------------------------- public API
export async function readMetadata(kind: Kind, bytes: Uint8Array): Promise<MetaItem[]> {
  if (OFFICE(kind)) return officeMeta(unzipSync(bytes));
  if (kind === 'pdf') return pdfMeta(bytes);
  if (kind === 'jpg') return jpegMeta(bytes);
  return pngMeta(bytes);
}
export async function cleanFile(kind: Kind, bytes: Uint8Array): Promise<Uint8Array> {
  if (OFFICE(kind)) return officeClean(bytes);
  if (kind === 'pdf') return pdfClean(bytes);
  if (kind === 'jpg') return jpegClean(bytes);
  return pngClean(bytes);
}

// ---------------------------------------------------------------- pre-send checks
const fmtSize = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

function officeFindings(kind: Kind, f: Files): Finding[] {
  const out: Finding[] = [], add = (level: Finding['level'], title: string, detail: string) => out.push({ level, title, detail });
  const all = (re: RegExp) => names(f, re).map((n) => text(f, n)).join('\n');
  const rels = names(f, /\.rels$/).map((n) => text(f, n)).join('\n');

  // comments
  let comments = 0;
  if (kind === 'docx') comments = count(text(f, 'word/comments.xml'), /<w:comment\s/g);
  if (kind === 'xlsx') comments = count(all(/^xl\/comments\d*\.xml$/), /<comment\s/g) + count(all(/^xl\/threadedComments\//), /<threadedComment\s/g);
  if (kind === 'pptx') comments = count(all(/^ppt\/comments\//), /<p:cm\s|<p188:cm\s|<p:cm>/g) + count(all(/^ppt\/comments\/modernComment/), /<p188:cm\s/g);
  comments ? add('red', 'Comments', `${plural(comments, 'comment')} found. Readers can see them and who wrote them.`) : add('green', 'Comments', 'None found.');

  if (kind === 'docx') {
    const xml = all(/^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/);
    const tr = count(xml, /<w:(ins|del|moveFrom|moveTo)\s/g) + count(xml, /<w:(rPrChange|pPrChange)\s/g);
    tr ? add('red', 'Tracked changes', `${plural(tr, 'tracked change')} still in the file. Accept or reject them in Word before sending.`) : add('green', 'Tracked changes', 'None found.');
    const hid = count(xml, /<w:vanish(?:\s*\/>|\s+w:val="(?:1|true|on)"\s*\/>)/g);
    hid ? add('red', 'Hidden text', `${plural(hid, 'hidden run')} of text is set to "hidden" and is still in the file.`) : add('green', 'Hidden text', 'None found.');
    const wh = count(xml, /<w:color\s+w:val="(?:FFFFFF|ffffff)"/g);
    wh ? add('amber', 'White text', `${plural(wh, 'white text run')}. Fine on dark shading, but it can hide words on white paper.`) : add('green', 'White text', 'None found.');
    if (f['word/vbaProject.bin']) add('red', 'Macros', 'The file contains macros.');
  }
  if (kind === 'xlsx') {
    const wb = text(f, 'xl/workbook.xml'), sheets = [...wb.matchAll(/<sheet\s[^>]*>/g)].map((m) => m[0]);
    const vh = sheets.filter((s) => /state="veryHidden"/.test(s)), hh = sheets.filter((s) => /state="hidden"/.test(s));
    const nm = (s: string) => xmlDecode((s.match(/name="([^"]*)"/) || [])[1] || '?');
    vh.length ? add('red', 'Very hidden sheets', `${plural(vh.length, 'sheet')} cannot be unhidden from Excel's menu: ${vh.map(nm).join(', ')}.`) : add('green', 'Very hidden sheets', 'None found.');
    hh.length ? add('red', 'Hidden sheets', `${plural(hh.length, 'hidden sheet')}: ${hh.map(nm).join(', ')}.`) : add('green', 'Hidden sheets', 'None found.');
    const sx = all(/^xl\/worksheets\/[^/]+\.xml$/);
    const rows = count(sx, /<row\s[^>]*hidden="(?:1|true)"/g), cols = count(sx, /<col\s[^>]*hidden="(?:1|true)"/g);
    rows ? add('amber', 'Hidden rows', `${plural(rows, 'hidden row')}.`) : add('green', 'Hidden rows', 'None found.');
    cols ? add('amber', 'Hidden columns', `${plural(cols, 'hidden column group')}.`) : add('green', 'Hidden columns', 'None found.');
    if (/<font>(?:(?!<\/font>)[\s\S])*?<color\s+rgb="FFFFFFFF"/.test(text(f, 'xl/styles.xml'))) add('amber', 'White text', 'A white font style exists. Check that no cell hides numbers in white on white.');
    else add('green', 'White text', 'No white font styles found.');
    if (f['xl/vbaProject.bin']) add('red', 'Macros', 'The file contains macros.');
  }
  if (kind === 'pptx') {
    const notes = names(f, /^ppt\/notesSlides\/notesSlide\d+\.xml$/).filter((n) => [...text(f, n).matchAll(/<a:t>([^<]*)<\/a:t>/g)].some((m) => m[1].trim() && !/^\d+$/.test(m[1].trim()))).length;
    notes ? add('red', 'Speaker notes', `${plural(notes, 'slide')} with speaker notes. Anyone with the file can read them.`) : add('green', 'Speaker notes', 'None found.');
    const hs = names(f, /^ppt\/slides\/slide\d+\.xml$/).filter((n) => /<p:sld\s[^>]*show="0"/.test(text(f, n))).length;
    hs ? add('red', 'Hidden slides', `${plural(hs, 'hidden slide')} will still be in the file.`) : add('green', 'Hidden slides', 'None found.');
    const sx = all(/^ppt\/(slides|notesSlides)\/[^/]+\.xml$/);
    const wh = count(sx, /<a:rPr\b(?:(?!<\/a:rPr>)[\s\S])*?<a:srgbClr val="FFFFFF"/g);
    wh ? add('amber', 'White text', `${plural(wh, 'white text run')}. Fine on dark slides, but it can hide words on white ones.`) : add('green', 'White text', 'None found.');
    if (f['ppt/vbaProject.bin']) add('red', 'Macros', 'The file contains macros.');
  }

  const emb = names(f, /\/embeddings\//);
  emb.length ? add('red', 'Embedded files', `${plural(emb.length, 'embedded file')} inside (${emb.map((n) => n.split('/').pop()).slice(0, 4).join(', ')}).`) : add('green', 'Embedded files', 'None found.');

  const ext = [...rels.matchAll(/<Relationship\b[^>]*>/g)].map((m) => m[0]).filter((r) => /TargetMode="External"/.test(r));
  const web = ext.filter((r) => /\/hyperlink"/.test(r)).length, other = ext.length - web;
  const xl = names(f, /^xl\/externalLinks\/[^/]+\.xml$/).length;
  other + xl ? add('amber', 'Links to other files', `${plural(other + xl, 'link')} point to outside files or locations. They can show file paths from your computer.`) : add('green', 'Links to other files', 'None found.');
  web ? add('green', 'Web links', `${plural(web, 'web link')}. Check they go where you expect.`) : null;

  const meta = officeMeta(f), who = meta.filter((m) => m.risk);
  who.length ? add('amber', 'Document properties', `Contains ${who.map((m) => `${m.label.toLowerCase()} "${m.value}"`).join(', ')}. Clear it with the metadata cleaner.`) : add('green', 'Document properties', 'No names or company stored.');
  return out;
}

async function pdfFindings(bytes: Uint8Array): Promise<Finding[]> {
  const L = await pdfLib(), out: Finding[] = [], add = (level: Finding['level'], title: string, detail: string) => out.push({ level, title, detail });
  const doc = await L.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  const dicts = (o: any) => (o instanceof L.PDFDict ? o : o instanceof L.PDFRawStream ? o.dict : null);
  const sub = new Map<string, number>(); let embedded = 0, js = 0, uri = 0;
  for (const [, o] of doc.context.enumerateIndirectObjects()) {
    const d = dicts(o); if (!d) continue;
    const st = d.get(L.PDFName.of('Subtype'))?.toString(), ty = d.get(L.PDFName.of('Type'))?.toString();
    if (st) sub.set(st, (sub.get(st) || 0) + 1);
    if (ty === '/EmbeddedFile') embedded++;
    if (d.get(L.PDFName.of('JS')) || d.get(L.PDFName.of('S'))?.toString() === '/JavaScript') js++;
    if (d.get(L.PDFName.of('S'))?.toString() === '/URI') uri++;
  }
  const notes = ['/Text', '/Highlight', '/FreeText', '/Underline', '/StrikeOut', '/Squiggly', '/Caret', '/Ink', '/Stamp'].reduce((n, k) => n + (sub.get(k) || 0), 0);
  notes ? add('red', 'Comments and markup', `${plural(notes, 'comment or markup mark')} on the pages.`) : add('green', 'Comments and markup', 'None found.');
  embedded ? add('red', 'Embedded files', `${plural(embedded, 'file')} attached inside the PDF.`) : add('green', 'Embedded files', 'None found.');
  js ? add('red', 'Scripts', 'The PDF contains JavaScript.') : add('green', 'Scripts', 'None found.');
  const ocp = doc.catalog.lookupMaybe(L.PDFName.of('OCProperties'), L.PDFDict), offArr = ocp?.get(L.PDFName.of('D')) && doc.context.lookupMaybe(ocp.get(L.PDFName.of('D')), L.PDFDict)?.lookupMaybe(L.PDFName.of('OFF'), L.PDFArray);
  offArr && offArr.size() ? add('red', 'Hidden layers', `${plural(offArr.size(), 'layer')} switched off. The content is still in the file.`) : add('green', 'Hidden layers', 'None found.');
  uri ? add('green', 'Web links', `${plural(uri, 'web link')}. Check they go where you expect.`) : null;
  const meta = await pdfMeta(bytes), who = meta.filter((m) => m.risk);
  who.length ? add('amber', 'Document properties', `Contains ${who.map((m) => `${m.label.toLowerCase()} "${m.value}"`).join(', ')}. Clear it with the metadata cleaner.`) : add('green', 'Document properties', 'No author stored.');
  if (doc.isEncrypted) add('amber', 'Password', 'The PDF is protected. Some checks may be incomplete.');
  return out;
}

export async function sendFindings(kind: Kind, bytes: Uint8Array, limitBytes: number | null): Promise<Finding[]> {
  if (kind === 'jpg' || kind === 'png') {
    const m = await readMetadata(kind, bytes), r = m.filter((x) => x.risk);
    return finishSize([r.length ? { level: 'amber', title: 'Picture details', detail: `Hidden details found: ${r.map((x) => x.label).join(', ')}.` } : { level: 'green', title: 'Picture details', detail: 'No location, camera or author found.' }], bytes, limitBytes);
  }
  const list = OFFICE(kind) ? officeFindings(kind, unzipSync(bytes)) : await pdfFindings(bytes);
  return finishSize(list, bytes, limitBytes);
}
function finishSize(list: Finding[], bytes: Uint8Array, limit: number | null): Finding[] {
  if (limit == null) list.push({ level: 'green', title: 'File size', detail: `${fmtSize(bytes.length)}. No limit set.` });
  else if (bytes.length > limit) list.push({ level: 'red', title: 'File size', detail: `${fmtSize(bytes.length)} is over your limit of ${fmtSize(limit)}.` });
  else list.push({ level: 'green', title: 'File size', detail: `${fmtSize(bytes.length)} is within your limit of ${fmtSize(limit)}.` });
  return list;
}
