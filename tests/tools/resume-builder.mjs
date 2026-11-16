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
  // extra fields some regions expect: off by default, in the preview and files only when ticked
  check(!(await page.textContent('.rb-doc')).includes('Nationality'), 'resume: extra fields are off by default');
  await page.check('[data-p="extraOn"]'); await page.waitForTimeout(200);
  await page.fill('[data-p="nationality"]', 'Canadian'); await page.fill('[data-p="notice"]', '1 month'); await page.fill('[data-p="licence"]', 'Class 5'); await page.waitForTimeout(400);
  const ptxt = await page.textContent('.rb-doc');
  check(ptxt.includes('Nationality: Canadian') && ptxt.includes('Notice period: 1 month') && ptxt.includes('Driving licence: Class 5'), 'resume: ticked extra fields show in the preview');
  const [dx2] = await Promise.all([page.waitForEvent('download'), page.click('.rb-docx')]);
  const zip = fs.readFileSync(await dx2.path());
  check(zip.subarray(0, 2).toString() === 'PK', 'resume: Word file made with extra fields');
  await page.uncheck('[data-p="extraOn"]'); await page.waitForTimeout(400);
  check(!(await page.textContent('.rb-doc')).includes('Nationality'), 'resume: unticking the box removes the extra fields from the resume');
};
