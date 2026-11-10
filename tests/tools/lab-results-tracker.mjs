// #T901 Lab results tracker
import { saved } from '../lib/pdfkit.mjs';
export const path = '/documents/lab-results-tracker/';
const CSV = `date,test,value,unit,low,high,lab
2025-01-10,Haemoglobin,13.1,g/dL,13.0,17.0,City Lab
2025-04-12,Haemoglobin,12.8,g/dL,13.0,17.0,City Lab
2025-08-09,Haemoglobin,13.6,g/dL,13.0,17.0,City Lab
2026-01-15,Haemoglobin,13.9,g/dL,13.0,17.0,North Lab
2025-01-10,Potassium,4.1,mmol/L,3.5,5.0,City Lab
2025-04-12,Potassium,3.9,mmol/L,3.5,5.0,City Lab
2025-08-09,Potassium,4.4,mmol/L,3.5,5.0,City Lab
2026-01-15,Potassium,4.0,mmol/L,3.5,5.0,North Lab
2025-01-10,Glucose,5.2,mmol/L,3.9,5.6,City Lab
2025-04-12,Glucose,5.5,mmol/L,3.9,5.6,City Lab
2025-08-09,Glucose,5.1,mmol/L,3.9,5.6,City Lab
2026-01-15,Glucose,5.3,mmol/L,3.9,5.6,North Lab
`;
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check(await page.evaluate(() => localStorage.length === 0), 'lab-results-tracker: nothing in localStorage at the start');
  await page.setInputFiles('.lrt-file', [{ name: 'results.csv', mimeType: 'text/csv', buffer: Buffer.from(CSV) }]);
  await page.waitForSelector('.lrt-res:not([hidden])', { timeout: 8000 });
  const opts = await page.$$eval('.lrt-pick option', (o) => o.length);
  check(opts === 3, `lab-results-tracker: test picker has 3 tests (${opts})`);
  check((await page.$$('.lrt-body tr')).length === 4, 'lab-results-tracker: table shows 4 dates for the picked test');
  const drawn = await page.$eval('.lrt-chart', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 120) n++; return n; });
  check(drawn > 200, `lab-results-tracker: chart canvas draws (${drawn} dark pixels)`);
  check(await page.evaluate(() => localStorage.length === 0), 'lab-results-tracker: still nothing in localStorage after importing');
  const p = await saved(page, () => page.click('.lrt-dl [data-f=pdf]'));
  check(p.name.endsWith('.pdf') && p.buf.length > 800, `lab-results-tracker: PDF for the doctor downloads (${p.name})`);
  await page.check('.lrt-save');
  check(await page.evaluate(() => !!localStorage.getItem('fibub-labresults-v1')), 'lab-results-tracker: ticking the box keeps results');
  await page.click('.lrt-clear');
  check(await page.evaluate(() => !localStorage.getItem('fibub-labresults-v1')), 'lab-results-tracker: Clear removes the kept copy');
};
