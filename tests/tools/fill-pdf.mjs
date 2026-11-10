// #1705 Fill PDF
import { createRequire } from 'node:module';
export const path = '/documents/fill-pdf/';
const require = createRequire(import.meta.url);
export default async ({ page, check, BASE }) => {
  const { PDFDocument, StandardFonts } = require('pdf-lib');
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const make = async (withFields) => {
    const doc = await PDFDocument.create(); const f = await doc.embedFont(StandardFonts.Helvetica);
    const p = doc.addPage([400, 500]); p.drawText('Tenancy form', { x: 50, y: 450, size: 18, font: f });
    if (withFields) {
      const form = doc.getForm();
      form.createTextField('full_name').addToPage(p, { x: 50, y: 400, width: 200, height: 22 });
      form.createCheckBox('smoker').addToPage(p, { x: 50, y: 360, width: 18, height: 18 });
      const dd = form.createDropdown('term'); dd.addOptions(['6 months', '12 months']); dd.addToPage(p, { x: 50, y: 320, width: 150, height: 22 });
      const rg = form.createRadioGroup('pay'); rg.addOptionToPage('Monthly', p, { x: 50, y: 280, width: 16, height: 16 }); rg.addOptionToPage('Weekly', p, { x: 120, y: 280, width: 16, height: 16 });
    }
    return Buffer.from(await doc.save());
  };
  const read = (dl) => new Promise((res, rej) => { const c = []; dl.createReadStream().then((s) => { s.on('data', (d) => c.push(d)); s.on('end', () => res(Buffer.concat(c))); s.on('error', rej); }); });
  const field = (n) => page.locator('.fp-field').filter({ hasText: n });
  await page.goto(`${BASE}/documents/fill-pdf/`); await page.waitForTimeout(400);
  await page.setInputFiles('.fp .fp-file', { name: 'form.pdf', mimeType: 'application/pdf', buffer: await make(true) });
  await page.waitForSelector('.fp .pv-page[data-drawn="1"]', { timeout: 15000 });
  check((await page.textContent('.fp-found')).startsWith('Found 4 form fields') && (await page.locator('.fp-field').count()) === 4, 'fill-pdf: lists 4 fields');
  await field('full_name').locator('input').fill('Asha Rao');
  await field('smoker').locator('input').check();
  await field('term').locator('select').selectOption('12 months');
  await field('pay').locator('input[value="Weekly"]').check();
  // Type anywhere: a tick mark and some text.
  await page.fill('.fp-text', 'Signed in ink');
  await page.click('.fp-add[data-k="text"]');
  await page.locator('.fp .pv-layer').first().click({ position: { x: 100, y: 330 } });
  await page.click('.fp-add[data-k="tick"]');
  await page.locator('.fp .pv-layer').first().click({ position: { x: 300, y: 330 } });
  check((await page.locator('.fp .pv-item').count()) === 2, 'fill-pdf: text and tick placed');
  let [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fp-save')]);
  let out = await read(dl);
  const o = await PDFDocument.load(out), form = o.getForm();
  check(form.getTextField('full_name').getText() === 'Asha Rao' && form.getCheckBox('smoker').isChecked() && form.getDropdown('term').getSelected()[0] === '12 months' && form.getRadioGroup('pay').getSelected() === 'Weekly', 'fill-pdf: values read back from the saved file');
  const txt = async (b) => (await (await pdfjs.getDocument({ data: new Uint8Array(b) }).promise).getPage(1).then((p) => p.getTextContent())).items.map((i) => i.str).join(' ');
  check((await txt(out)).includes('Signed in ink'), 'fill-pdf: typed-anywhere text is in the page');
  // Flatten.
  await page.check('.fp-flat');
  [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fp-save')]);
  out = await read(dl);
  const fl = await PDFDocument.load(out);
  check(fl.getForm().getFields().length === 0 && (await txt(out)).includes('Asha Rao'), 'fill-pdf: flattened, no fields left, value kept as text');
  // A PDF without fields.
  await page.click('.fp-other');
  await page.setInputFiles('.fp .fp-file', { name: 'plain.pdf', mimeType: 'application/pdf', buffer: await make(false) });
  await page.waitForSelector('.fp .pv-page[data-drawn="1"]', { timeout: 15000 });
  check((await page.textContent('.fp-found')).includes('no form fields') && (await page.locator('.fp-form').isHidden()), 'fill-pdf: no-fields PDF offers type anywhere');
  await page.setInputFiles('.fp .fp-file', { name: 'bad.pdf', mimeType: 'application/pdf', buffer: Buffer.from('not a pdf') });
  await page.waitForTimeout(800);
  check(!(await page.locator('.fp-err').isHidden()), 'fill-pdf: a broken file gives a plain message');
};
