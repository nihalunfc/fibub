// #1764 Letter builder
import { files, textOf } from '../lib/officekit.mjs';
import { text as pdfText, saved } from '../lib/pdfkit.mjs';
export const path = '/documents/letter-builder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/letter-builder/`); await page.waitForTimeout(400);
  const prev = () => page.textContent('.lb .lb-prev');
  check((await prev()).includes('Dear Sir or Madam,'), 'letters: formal greeting by default');
  await page.fill('.lb [data-k=name]', 'Priya Sharma'); await page.fill('.lb [data-k=toName]', 'Alex Chen'); await page.waitForTimeout(100);
  check((await prev()).includes('Dear Alex Chen,') && (await prev()).includes('Priya Sharma'), 'letters: recipient name becomes the greeting');
  await page.check('.lb input[value=resignation]'); await page.waitForTimeout(100);
  check((await prev()).includes('formal notice that I am resigning') && (await prev()).includes('Sincerely,'), 'letters: resignation template swaps in');
  await page.fill('.lb [data-k=body]', 'I resign from my job as analyst, last day 5 December.'); await page.waitForTimeout(100);
  check((await page.textContent('.lb .lb-count')).includes('Nothing left in brackets') === false, 'letters: bracket count mentions the subject spot');
  await page.fill('.lb [data-k=subject]', 'Resignation: Analyst'); await page.waitForTimeout(100);
  check((await page.textContent('.lb .lb-count')).includes('Nothing left in brackets'), 'letters: no brackets left');
  const dx = await saved(page, () => page.click('.lb .lb-docx'));
  const doc = textOf(dx.buf, 'word/document.xml');
  check(dx.name.endsWith('.docx') && doc && doc.includes('Priya Sharma') && doc.includes('I resign from my job'), 'letters: Word file opens and holds the name and body');
  const pd = await saved(page, () => page.click('.lb .lb-pdf'));
  const t = (await pdfText(pd.buf)).join(' ');
  check(pd.buf.subarray(0, 4).toString() === '%PDF' && t.includes('Priya Sharma') && t.includes('Dear Alex Chen'), 'letters: PDF has the text');
  const tx = await saved(page, () => page.click('.lb .lb-txt'));
  check(tx.buf.toString('utf8').includes('Re: Resignation: Analyst'), 'letters: text file has the subject line');
};
