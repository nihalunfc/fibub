// Cover letter: the fields, example phrasing for the three paragraphs (written by hand, no AI), and the
// plain text, Word and PDF versions. One column, standard fonts, no tables or pictures, so ATS software reads it.
import { zipSync, strToU8 } from 'fflate';

export type Letter = {
  name: string; address: string; email: string; phone: string; date: string;
  manager: string; company: string; companyAddress: string; role: string; source: string;
  p1: string; p2: string; p3: string; closing: string; paper: 'letter' | 'a4'; serif: boolean;
};
export const emptyLetter = (): Letter => ({
  name: '', address: '', email: '', phone: '', date: new Date().toISOString().slice(0, 10),
  manager: '', company: '', companyAddress: '', role: '', source: '', p1: '', p2: '', p3: '', closing: 'Sincerely', paper: 'letter', serif: false,
});

export type Block = { t: 'line' | 'para'; text: string; bold?: boolean } | { t: 'gap' };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function longDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${MONTHS[+m[2] - 1]} ${+m[3]}, ${m[1]}` : iso;
}

const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

export function blocks(l: Letter): Block[] {
  const b: Block[] = [];
  if (l.name.trim()) b.push({ t: 'line', text: l.name.trim(), bold: true });
  for (const x of lines(l.address)) b.push({ t: 'line', text: x });
  const contact = [l.email.trim(), l.phone.trim()].filter(Boolean).join(' | ');
  if (contact) b.push({ t: 'line', text: contact });
  b.push({ t: 'gap' });
  if (l.date) { b.push({ t: 'line', text: longDate(l.date) }); b.push({ t: 'gap' }); }
  const to = [l.manager.trim(), l.company.trim(), ...lines(l.companyAddress)].filter(Boolean);
  if (to.length) { for (const x of to) b.push({ t: 'line', text: x }); b.push({ t: 'gap' }); }
  if (l.role.trim()) { b.push({ t: 'line', text: `Re: ${l.role.trim()}`, bold: true }); b.push({ t: 'gap' }); }
  b.push({ t: 'line', text: `Dear ${l.manager.trim() || 'Hiring Manager'},` });
  b.push({ t: 'gap' });
  for (const p of [l.p1, l.p2, l.p3]) for (const para of p.split(/\n\s*\n/).map((x) => x.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean)) { b.push({ t: 'para', text: para }); b.push({ t: 'gap' }); }
  b.push({ t: 'line', text: `${l.closing.trim() || 'Sincerely'},` });
  b.push({ t: 'gap' }); b.push({ t: 'gap' });
  if (l.name.trim()) b.push({ t: 'line', text: l.name.trim() });
  return b;
}

export function plainText(l: Letter): string {
  return blocks(l).map((x) => (x.t === 'gap' ? '' : x.text)).join('\n').trim() + '\n';
}

export const wordCount = (l: Letter) => [l.p1, l.p2, l.p3].join(' ').split(/\s+/).filter(Boolean).length;

/** Example phrasing for each paragraph. {role}, {company} and {source} are filled from the form. */
export const HELPERS: { key: 'p1' | 'p2' | 'p3'; title: string; hint: string; options: string[] }[] = [
  { key: 'p1', title: 'Opening: say what you are applying for', hint: 'Name the job and company, and one reason you are a fit.', options: [
    'I am writing to apply for the {role} position at {company}, which I found on {source}. With my background in [your field], I believe I can contribute quickly.',
    'I was excited to see the {role} opening at {company}. My [number] years of experience in [skill or area] match what you are looking for.',
    '{person} at [name] suggested I apply for the {role} role at {company}. I would welcome the chance to bring my experience in [area] to your team.',
  ] },
  { key: 'p2', title: 'Middle: show what you have done', hint: 'Pick one or two results that match the job ad. Use numbers where you can.', options: [
    'In my current role at [employer], I [what you did], which [result, for example "cut processing time by 30%"]. I would bring the same approach to {company}.',
    'The job ad asks for [requirement]. At [employer] I [example that proves it], and I also [second example].',
    'I am especially drawn to {company} because [a specific thing you admire: a product, value or project]. My experience with [skill] would help with [a goal of the team].',
  ] },
  { key: 'p3', title: 'Closing: ask for a conversation', hint: 'Thank them, say you attached your resume, and suggest a next step.', options: [
    'Thank you for your time. My resume is attached, and I would welcome the chance to talk about how I can help {company}. I can be reached at the email or phone above.',
    'I would be glad to discuss the {role} role in an interview. Thank you for considering my application.',
    'Thank you for reading. I look forward to hearing from you and am happy to share work samples or references on request.',
  ] },
];
export function fillHelper(s: string, l: Letter): string {
  return s.replace(/\{role\}/g, l.role.trim() || '[job title]').replace(/\{company\}/g, l.company.trim() || '[company]').replace(/\{source\}/g, l.source.trim() || '[where you saw the job]').replace(/\{person\}/g, '[Name]');
}

export const EXAMPLE: Partial<Letter> = {
  name: 'Priya Sharma', address: '12 Maple Street\nToronto, ON M5V 2T6', email: 'priya.sharma@example.com', phone: '416-555-0123',
  manager: 'Alex Chen', company: 'Northwind Retail', companyAddress: '200 King Street West\nToronto, ON', role: 'Operations Analyst', source: 'your careers page',
  p1: 'I am writing to apply for the Operations Analyst position at Northwind Retail, which I found on your careers page. With four years of experience in supply chain reporting, I believe I can contribute quickly.',
  p2: 'In my current role at Harbour Logistics, I built weekly dashboards that cut stock-out reports by 30%. I would bring the same approach to Northwind Retail.',
  p3: 'Thank you for your time. My resume is attached, and I would welcome the chance to talk about how I can help Northwind Retail.',
};

// ---------- Word ----------
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';

export function letterDocx(l: Letter): Uint8Array {
  const font = l.serif ? 'Times New Roman' : 'Calibri', size = l.serif ? 24 : 22;
  const page = l.paper === 'a4' ? { w: 11906, h: 16838 } : { w: 12240, h: 15840 };
  const body = blocks(l).map((x) => {
    if (x.t === 'gap') return '<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>';
    return `<w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r>${x.bold ? '<w:rPr><w:b/></w:rPr>' : ''}<w:t xml:space="preserve">${esc(x.text)}</w:t></w:r></w:p>`;
  }).join('');
  const title = l.name.trim() ? `${l.name.trim()} - Cover letter` : 'Cover letter';
  return zipSync({
    '[Content_Types].xml': strToU8(`${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`),
    '_rels/.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`),
    'word/_rels/document.xml.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    'word/document.xml': strToU8(`${XML}<w:document ${NS}><w:body>${body}<w:sectPr><w:pgSz w:w="${page.w}" w:h="${page.h}"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`),
    'word/styles.xml': strToU8(`${XML}<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}" w:eastAsia="${font}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style></w:styles>`),
    'docProps/core.xml': strToU8(`${XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(title)}</dc:title><dc:creator>${esc(l.name.trim())}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 10)}T00:00:00Z</dcterms:created></cp:coreProperties>`),
  }, { level: 6 });
}

// ---------- PDF ----------
export async function letterPdf(l: Letter): Promise<{ bytes: Uint8Array; lost: string[]; pages: number }> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const { pdfSafe } = await import('../resume/pdf');
  const doc = await PDFDocument.create();
  const reg = await doc.embedFont(l.serif ? StandardFonts.TimesRoman : StandardFonts.Helvetica);
  const bold = await doc.embedFont(l.serif ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold);
  const [W, H] = l.paper === 'a4' ? [595.28, 841.89] : [612, 792];
  const M = 72, size = l.serif ? 12 : 11, lh = size * 1.35;
  const lost = new Set<string>();
  let page = doc.addPage([W, H]);
  let y = H - M;
  for (const x of blocks(l)) {
    if (x.t === 'gap') { y -= lh * 0.8; continue; }
    const font = x.bold ? bold : reg;
    const t = pdfSafe(x.text); t.lost.forEach((c) => lost.add(c));
    let ln = '';
    const out: string[] = [];
    for (const w of t.text.split(/\s+/).filter(Boolean)) {
      const tryIt = ln ? `${ln} ${w}` : w;
      if (font.widthOfTextAtSize(tryIt, size) <= W - M * 2 || !ln) ln = tryIt; else { out.push(ln); ln = w; }
    }
    if (ln) out.push(ln);
    for (const s of out) {
      if (y - lh < M) { page = doc.addPage([W, H]); y = H - M; }
      page.drawText(s, { x: M, y: y - size, size, font, color: rgb(0.07, 0.09, 0.15) });
      y -= lh;
    }
  }
  doc.setTitle(l.name.trim() ? `${l.name.trim()} - Cover letter` : 'Cover letter');
  return { bytes: await doc.save(), lost: [...lost], pages: doc.getPageCount() };
}
