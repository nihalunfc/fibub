// #1714 Cover letter
export const path = '/documents/cover-letter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/cover-letter/`); await page.waitForTimeout(500);
  const prev = () => page.textContent('.cl .cl-prev');
  await page.fill('.cl [data-k=name]', 'Priya Sharma'); await page.fill('.cl [data-k=role]', 'Analyst'); await page.fill('.cl [data-k=company]', 'Northwind'); await page.fill('.cl [data-k=source]', 'LinkedIn'); await page.waitForTimeout(100);
  check((await prev()).includes('Dear Hiring Manager,') && (await prev()).includes('Re: Analyst'), 'cover: default greeting and subject line');
  await page.fill('.cl [data-k=manager]', 'Alex Chen');
  await page.click('.cl [data-p=p1] summary'); await page.click('.cl [data-h="p1:0"]'); await page.waitForTimeout(100);
  check((await prev()).includes('Dear Alex Chen,') && (await prev()).includes('apply for the Analyst position at Northwind, which I found on LinkedIn'), 'cover: phrasing filled from the form');
  check((await page.textContent('.cl .cl-count')).includes('words'), 'cover: word count');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.cl .cl-pdf')]);
  const fs = await import('node:fs');
  check(fs.readFileSync(await pdf.path()).subarray(0, 4).toString() === '%PDF', 'cover: PDF');
  const [dx] = await Promise.all([page.waitForEvent('download'), page.click('.cl .cl-docx')]);
  check(fs.readFileSync(await dx.path()).subarray(0, 2).toString() === 'PK' && dx.suggestedFilename().endsWith('.docx'), 'cover: Word file');
  const [tx] = await Promise.all([page.waitForEvent('download'), page.click('.cl .cl-txt')]);
  check(fs.readFileSync(await tx.path(), 'utf8').startsWith('Priya Sharma\n'), 'cover: text file');
  check(!(await page.evaluate(() => localStorage.getItem('fibub-coverletter-v1'))), 'cover: nothing stored unless ticked');
  await page.check('.cl .cl-remember'); await page.waitForTimeout(100);
  check((await page.evaluate(() => localStorage.getItem('fibub-coverletter-v1'))).includes('Priya'), 'cover: kept when ticked');
  await page.click('.cl .cl-clear');
  check(!(await page.evaluate(() => localStorage.getItem('fibub-coverletter-v1'))), 'cover: clear');
};
