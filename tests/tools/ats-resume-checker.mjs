// #T7 ATS resume checker: "Fix it for me" hands a badly laid-out resume to the ATS resume builder (#T12),
// which opens with the visitor's own words in its boxes, a before/after score and downloads.
import { writeFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { zipSync, unzipSync, strToU8, strFromU8 } = require('fflate');
const { PDFDocument, StandardFonts } = require('pdf-lib');

export const path = '/documents/ats-resume-checker/';
export default async ({ page, check, BASE, OUT }) => {
  const x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  const p = (t) => `<w:p><w:r><w:t xml:space="preserve">${t.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</w:t></w:r></w:p>`;
  // Contact details in the page header, the body in a two-cell layout table, creative headings.
  const left = ['KEY STRENGTHS', 'SQL', 'Power BI', 'Excel', 'Python', 'Forecasting'];
  const right = ['Profile', 'Retail analyst who turns sales data into weekly reports that store managers use.',
    'Where I have worked', 'Sales Analyst | Maple Foods Inc. | Mar 2022 – Present', '• Built a weekly sales dashboard for 25 stores', '• Cut stock-out reports from 2 days to 3 hours', '• Automated the monthly margin report in Excel and SQL, saving 6 hours a month', '• Presented sales trends to the regional team every Monday morning',
    'Reporting Clerk', 'Lakeside Grocers, Hamilton, ON', '2019 – 2022', '• Prepared daily sales summaries for 6 managers', '• Reconciled supplier invoices against deliveries and flagged 40 errors a quarter',
    'Studies', 'Diploma in Business Analytics, Niagara College, 2019'];
  const docx = zipSync({
    '[Content_Types].xml': strToU8(x + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/></Types>'),
    'word/document.xml': strToU8(x + `<w:document ${NS}><w:body><w:tbl><w:tr><w:tc>${left.map(p).join('')}</w:tc><w:tc>${right.map(p).join('')}</w:tc></w:tr></w:tbl><w:sectPr><w:headerReference w:type="default" r:id="rId1"/></w:sectPr></w:body></w:document>`),
    'word/header1.xml': strToU8(x + `<w:hdr ${NS}>${p('Dana Brooks')}${p('dana.brooks@example.com | 905 555 0142 | St. Catharines, ON')}</w:hdr>`),
  });
  writeFileSync(OUT + 'fix-me.docx', docx);

  await page.goto(BASE + path);
  await page.setInputFiles('.ats-input', OUT + 'fix-me.docx');
  await page.waitForSelector('.ats-result:not([hidden])', { timeout: 60000 });
  const before = +(await page.textContent('.ats-score'));
  check(await page.isVisible('.ats-fixbtn'), `fix: "Fix it for me" shows under the score (${before})`);
  await Promise.all([page.waitForURL(/resume-builder\/$/, { timeout: 30000 }), page.click('.ats-fixbtn')]);
  await page.waitForSelector('.rb-import:not([hidden])', { timeout: 10000 });
  await page.waitForTimeout(400);
  const v = (k) => page.inputValue(`[data-p="${k}"]`);
  check((await v('name')) === 'Dana Brooks' && (await v('email')) === 'dana.brooks@example.com' && (await v('phone')) === '905 555 0142' && (await v('location')) === 'St. Catharines, ON', 'fix: contact details from the page header land in their boxes');
  check((await v('skills')) === 'SQL, Power BI, Excel, Python, Forecasting', `fix: skills -> ${await v('skills')}`);
  check(/^Retail analyst who turns/.test(await v('summary')), 'fix: "Profile" becomes the summary');
  check((await v('experience.0.title')) === 'Sales Analyst' && (await v('experience.0.company')) === 'Maple Foods Inc.' && (await v('experience.0.start')) === '2022-03' && await page.isChecked('[data-p="experience.0.current"]'), 'fix: first job title, employer and dates');
  check((await v('experience.1.company')) === 'Lakeside Grocers' && (await v('experience.1.location')) === 'Hamilton, ON' && (await v('experience.1.start')) === '2019' && (await page.getAttribute('[data-p="experience.1.start"]', 'type')) === 'text', 'fix: a year-only date stays a year, in a text box');
  check((await v('education.0.school')) === 'Niagara College', `fix: education -> ${await v('education.0.degree')} / ${await v('education.0.school')}`);
  const after = +(await page.textContent('.rb-imp-a'));
  check((await page.textContent('.rb-imp-b')) === String(before) && after > before && after >= 75, `fix: banner shows the score going up ${before} -> ${after}`);
  const changes = await page.textContent('.rb-imp-list');
  check(/page header/.test(changes) && /table/.test(changes) && /"Where I have worked" → Experience/.test(changes), `fix: lists what was fixed -> ${changes}`);
  check(!(await page.evaluate(() => sessionStorage.getItem('fibub-resume-import'))) && !/from=/.test(page.url()), 'fix: the hand-over copy is deleted once read');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.rb-imp-docx')]);
  await dl.saveAs(OUT + 'fixed.docx');
  const xml = strFromU8(unzipSync(readFileSync(OUT + 'fixed.docx'))['word/document.xml']);
  check(dl.suggestedFilename() === 'Dana-Brooks-Resume.docx' && !/<w:tbl/.test(xml) && /Maple Foods Inc\./.test(xml), 'fix: Word download from the banner, with no tables');

  // A two-column PDF: the fix reads the left column, then the right, instead of mixing them.
  const doc = await PDFDocument.create(), font = await doc.embedFont(StandardFonts.Helvetica), pg = doc.addPage([612, 792]);
  pg.drawText('Ravi Menon', { x: 230, y: 750, size: 18, font });
  pg.drawText('ravi.menon@example.com | +1 289 555 0110', { x: 190, y: 728, size: 10, font });
  const L = ['SKILLS', 'Excel', 'SQL', 'Tableau', 'Inventory control', 'Forecasting', 'Scheduling', 'EDUCATION', 'BCom, Example University', '2016 - 2019', 'LANGUAGES', 'English', 'Hindi', 'Malayalam'];
  const Rt = ['EXPERIENCE', 'Inventory Planner, Harbour Stores', 'Apr 2021 - Present', '- Planned stock for 40 stores with a weekly forecast', '- Reduced overstock by 12% in one year',
    'Stock Clerk, Harbour Stores', 'Jun 2019 - Mar 2021', '- Counted and logged 2,000 items a week', '- Trained 4 new clerks on the scanners', 'PROJECTS', 'Shelf gap tracker', '- Logged empty shelves by aisle in Excel'];
  for (let i = 0; i < Math.max(L.length, Rt.length); i++) {
    if (L[i]) pg.drawText(L[i], { x: 40, y: 690 - i * 22, size: 10, font });
    if (Rt[i]) pg.drawText(Rt[i], { x: 250, y: 690 - i * 22, size: 10, font });
  }
  writeFileSync(OUT + 'fix-2col.pdf', await doc.save());
  await page.goto(BASE + path);
  await page.setInputFiles('.ats-input', OUT + 'fix-2col.pdf');
  await page.waitForSelector('.ats-result:not([hidden])', { timeout: 60000 });
  await Promise.all([page.waitForURL(/resume-builder\/$/, { timeout: 30000 }), page.click('.ats-fixbtn')]);
  await page.waitForSelector('.rb-import:not([hidden])', { timeout: 10000 });
  check((await v('skills')) === 'Excel, SQL, Tableau, Inventory control, Forecasting, Scheduling', `fix 2-col: skills from the left column -> ${await v('skills')}`);
  check((await v('experience.0.title')) === 'Inventory Planner' && (await v('experience.1.title')) === 'Stock Clerk' && (await v('experience.1.bullets')).split('\n').length === 2, 'fix 2-col: jobs from the right column, not mixed with skills');
  check(/Hindi/.test(await page.inputValue('[data-p="extras.0.body"]')), 'fix 2-col: Languages kept as an extra section');
  check(/two columns into one/.test(await page.textContent('.rb-imp-list')), 'fix 2-col: column fix listed');
};
