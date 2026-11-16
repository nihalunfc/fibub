// #T12 ATS resume builder: look options (header alignment, compact text) reach the preview, PDF and Word file.
export const path = '/documents/resume-builder/';
export default async ({ page, check, BASE }) => {
  await page.goto(BASE + path); await page.waitForTimeout(500);
  await page.click('.rb-example'); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check(!(await page.evaluate(() => document.querySelector('.rb-doc').classList.contains('left'))), 'resume: centred header by default');
  await page.check('input[name=rb-header][value=left]'); await page.waitForTimeout(400);
  check(await page.evaluate(() => document.querySelector('.rb-doc').classList.contains('left')), 'resume: left header applies to preview');
  await page.check('input[name=rb-density][value=compact]'); await page.waitForTimeout(400);
  check(await page.evaluate(() => document.querySelector('.rb-doc').classList.contains('compact')), 'resume: compact applies to preview');
  const [dx] = await Promise.all([page.waitForEvent('download'), page.click('.rb-docx')]);
  const fs = await import('node:fs');
  check(fs.readFileSync(await dx.path()).subarray(0, 2).toString() === 'PK', 'resume: Word file with look options');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.rb-pdf')]);
  check(fs.readFileSync(await pdf.path()).subarray(0, 4).toString() === '%PDF', 'resume: PDF with look options');
  check(!(await page.evaluate(() => !!document.querySelector('[data-kit]'))), 'resume: no data-kit on a personal-data tool');
};
