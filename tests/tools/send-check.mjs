// #1715 Pre-send check
import { createRequire } from 'node:module';
import { makeDocx, makeXlsx, makePptx, upload } from '../lib/officekit.mjs';
import { makePdf } from '../lib/pdfkit.mjs';
const require = createRequire(import.meta.url);
const { PDFDocument, PDFName } = require('pdf-lib');
export const path = '/documents/send-check/';
export default async ({ page, check, BASE }) => {
  const go = async () => { await page.goto(`${BASE}${path}`); await page.waitForTimeout(300); };
  const items = async () => Object.fromEntries(await page.$$eval('.sc-item', (l) => l.map((e) => [e.querySelector('b').textContent.replace(/^(Fix|Check|OK) · /, ''), e.className.split(' ')[1] + '|' + e.querySelector(':scope > span').textContent])));
  await go();
  const dirty = makeDocx('<w:p><w:ins w:id="1"><w:r><w:t>new</w:t></w:r></w:ins><w:del w:id="2"/><w:r><w:rPr><w:vanish/><w:color w:val="FFFFFF"/></w:rPr><w:t>secret</w:t></w:r></w:p>', { 'word/comments.xml': '<w:comments><w:comment w:id="0"/><w:comment w:id="1"/></w:comments>', 'word/embeddings/oleObject1.bin': 'x' });
  await page.setInputFiles('.sc-file', upload('d.docx', dirty)); await page.waitForSelector('.sc-item');
  let r = await items();
  check(r['Comments'].startsWith('red') && r['Comments'].includes('2 comments'), 'send-check: docx comments counted (2)');
  check(r['Tracked changes'].startsWith('red') && r['Tracked changes'].includes('2'), 'send-check: tracked changes found');
  check(r['Hidden text'].startsWith('red') && r['White text'].startsWith('amber'), 'send-check: hidden and white text');
  check(r['Embedded files'].startsWith('red') && r['Document properties'].startsWith('amber'), 'send-check: embedded file and author in properties');
  await page.setInputFiles('.sc-file', upload('c.docx', makeDocx()));
  await page.waitForFunction(() => document.querySelector('.sc-msg').textContent.includes('c.docx'));
  r = await items();
  check(r['Comments'].startsWith('green') && r['Tracked changes'].startsWith('green'), 'send-check: clean docx is green');
  // xlsx
  const wb = '<workbook><sheets><sheet name="Main" sheetId="1"/><sheet name="Costs" sheetId="2" state="veryHidden"/><sheet name="Old" sheetId="3" state="hidden"/></sheets></workbook>';
  await page.setInputFiles('.sc-file', upload('x.xlsx', makeXlsx(wb, '<worksheet><cols><col min="2" max="2" hidden="1"/></cols><sheetData><row r="3" hidden="1"/></sheetData></worksheet>')));
  await page.waitForFunction(() => document.querySelector('.sc-msg').textContent.includes('x.xlsx'));
  r = await items();
  check(r['Very hidden sheets'].startsWith('red') && r['Very hidden sheets'].includes('Costs'), 'send-check: very hidden sheet named');
  check(r['Hidden sheets'].includes('Old') && r['Hidden rows'].startsWith('amber') && r['Hidden columns'].startsWith('amber'), 'send-check: hidden sheet, row and column');
  // pptx
  await page.setInputFiles('.sc-file', upload('p.pptx', makePptx({ 'ppt/notesSlides/notesSlide1.xml': '<p:notes><a:t>Do not show the price</a:t></p:notes>', 'ppt/slides/slide2.xml': '<p:sld show="0"><a:t>x</a:t></p:sld>' })));
  await page.waitForFunction(() => document.querySelector('.sc-msg').textContent.includes('p.pptx'));
  r = await items();
  check(r['Speaker notes'].startsWith('red') && r['Hidden slides'].startsWith('red'), 'send-check: speaker notes and hidden slide');
  // pdf
  const d = await PDFDocument.load(await makePdf(1)); d.setAuthor('Pat Writer');
  const ctx = d.context, annot = ctx.obj({ Type: 'Annot', Subtype: 'Text', Rect: [10, 10, 20, 20], Contents: 'note' });
  d.getPage(0).node.set(PDFName.of('Annots'), ctx.obj([ctx.register(annot)]));
  await page.setInputFiles('.sc-file', upload('a.pdf', Buffer.from(await d.save())));
  await page.waitForFunction(() => document.querySelector('.sc-msg').textContent.includes('a.pdf'));
  r = await items();
  check(r['Comments and markup'].startsWith('red') && r['Document properties'].includes('Pat Writer'), 'send-check: pdf comment and author');
  // size limit
  await page.fill('.sc-limit', '0.0001');
  await page.waitForTimeout(300);
  r = await items();
  check(r['File size'].startsWith('red') && await page.isVisible('.sc-more'), 'send-check: size over limit is red and links to compress');
  await page.selectOption('.sc-unit', '1024'); await page.fill('.sc-limit', '500'); await page.waitForTimeout(300);
  check((await items())['File size'].startsWith('green'), 'send-check: size within limit is green');
};
