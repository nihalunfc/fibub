// Small fixtures for the Office-file checks: DOCX/XLSX/PPTX zips, a JPEG with GPS, a PNG with text.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { zipSync, strToU8, unzipSync, strFromU8 } = require('fflate');
const CT = '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/docProps/core.xml" ContentType="x"/><Override PartName="/docProps/custom.xml" ContentType="y"/></Types>';
const RELS = '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="r1" Type="t/core" Target="docProps/core.xml"/><Relationship Id="r2" Type="t/custom" Target="docProps/custom.xml"/></Relationships>';
export const CORE = '<?xml version="1.0"?><cp:coreProperties xmlns:cp="c" xmlns:dc="d" xmlns:dcterms="t"><dc:creator>Jane Doe</dc:creator><cp:lastModifiedBy>Raj Patel</cp:lastModifiedBy><cp:revision>7</cp:revision><dcterms:created>2026-01-02T10:00:00Z</dcterms:created></cp:coreProperties>';
export const APP = '<?xml version="1.0"?><Properties><Company>Acme Corp</Company><TotalTime>321</TotalTime></Properties>';
const base = { '[Content_Types].xml': strToU8(CT), '_rels/.rels': strToU8(RELS), 'docProps/core.xml': strToU8(CORE), 'docProps/app.xml': strToU8(APP), 'docProps/custom.xml': strToU8('<Properties><property name="a"/></Properties>') };
export const zip = (extra) => Buffer.from(zipSync({ ...base, ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, strToU8(v)])) }));
export const W = (body) => `<?xml version="1.0"?><w:document xmlns:w="w"><w:body>${body}</w:body></w:document>`;
export const makeDocx = (body = '<w:p><w:r><w:t>Hello</w:t></w:r></w:p>', extra = {}) => zip({ 'word/document.xml': W(body), ...extra });
export const makeXlsx = (wb, sheet = '<worksheet><sheetData/></worksheet>', extra = {}) => zip({ 'xl/workbook.xml': wb, 'xl/worksheets/sheet1.xml': sheet, ...extra });
export const makePptx = (extra = {}) => zip({ 'ppt/presentation.xml': '<p:presentation/>', 'ppt/slides/slide1.xml': '<p:sld><a:t>Hi</a:t></p:sld>', ...extra });
export const files = (buf) => unzipSync(new Uint8Array(buf));
export const textOf = (buf, p) => { const f = files(buf)[p]; return f ? strFromU8(f) : null; };

function rat(v) { const b = Buffer.alloc(8); b.writeUInt32BE(v, 0); b.writeUInt32BE(1, 4); return b; }
/** JPEG with Make=TestCam, GPS 43 39 12 N, 79 23 0 W (big-endian EXIF). */
export function makeJpeg(orientation = 1) {
  const t = Buffer.alloc(200); let o = 0;
  t.write('MM'); t.writeUInt16BE(42, 2); t.writeUInt32BE(8, 4);
  o = 8; t.writeUInt16BE(3, o); o += 2;
  const ent = (tag, type, n, val) => { t.writeUInt16BE(tag, o); t.writeUInt16BE(type, o + 2); t.writeUInt32BE(n, o + 4); if (type === 3) t.writeUInt16BE(val, o + 8); else t.writeUInt32BE(val, o + 8); o += 12; };
  ent(0x010f, 2, 8, 50); ent(0x0112, 3, 1, orientation); ent(0x8825, 4, 1, 60);
  t.writeUInt32BE(0, o); o += 4;
  t.write('TestCam\0', 50);
  let g = 60; t.writeUInt16BE(4, g); g += 2;
  const ge = (tag, type, n, val, ascii) => { t.writeUInt16BE(tag, g); t.writeUInt16BE(type, g + 2); t.writeUInt32BE(n, g + 4); if (ascii) t.write(ascii, g + 8); else t.writeUInt32BE(val, g + 8); g += 12; };
  ge(1, 2, 2, 0, 'N\0'); ge(2, 5, 3, 120); ge(3, 2, 2, 0, 'W\0'); ge(4, 5, 3, 150);
  t.writeUInt32BE(0, g);
  [43, 39, 12].forEach((v, i) => rat(v).copy(t, 120 + i * 8));
  [79, 23, 0].forEach((v, i) => rat(v).copy(t, 150 + i * 8));
  const exif = Buffer.concat([Buffer.from('Exif\0\0'), t]);
  const app1 = Buffer.concat([Buffer.from([0xff, 0xe1, (exif.length + 2) >> 8, (exif.length + 2) & 255]), exif]);
  const app0 = Buffer.from([0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0]);
  const sos = Buffer.from([0xff, 0xda, 0, 4, 1, 0, 1, 2, 3, 4, 0xff, 0xd9]);
  return Buffer.concat([Buffer.from([0xff, 0xd8]), app0, app1, sos]);
}
function chunk(type, data) { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(type, 4); data.copy(b, 8); return b; }
export function makePng() {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(1, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = 0;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('tEXt', Buffer.from('Author\0Jane Doe')), chunk('IDAT', Buffer.from([8, 0x1d, 1, 1, 0, 0xfe, 0xff, 0, 0, 0, 1, 0, 1])), chunk('IEND', Buffer.alloc(0))]);
}
export const upload = (name, buffer, mimeType = 'application/octet-stream') => ({ name, mimeType, buffer });
