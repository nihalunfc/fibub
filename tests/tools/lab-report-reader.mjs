// #T900 Lab report reader
export const path = '/documents/lab-report-reader/';
const SAMPLE = `Haemoglobin 13.5 g/dL 13.0 - 17.0
Total Cholesterol 210 mg/dL < 200
Potassium 3.2 mmol/L 3.5-5.0
HDL Cholesterol 45 mg/dL >40
Platelets 250 x10^9/L 150-400
TSH 2.1 mIU/L 0.4–4.0
Glucose 5.4 mmol/L (3.9-5.6)
Vitamin B12 450 pg/mL 200 - 900
Page 1 of 1
Patient: Example Person`;
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.fill('.lrr-paste', SAMPLE); await page.click('.lrr-read');
  const n = (await page.$$('.lrr-body tr')).length;
  check(n === 8, `lab-report-reader: 8 lines give 8 rows (${n})`);
  const mark = (i) => page.textContent(`.lrr-body tr:nth-child(${i}) .lrr-mark`);
  check((await mark(2)).includes('above'), 'lab-report-reader: 210 with < 200 is marked above the printed range');
  check((await mark(3)).includes('below'), 'lab-report-reader: 3.2 with 3.5-5.0 is marked below the printed range');
  check((await mark(1)).trim() === '', 'lab-report-reader: a value inside the range has no mark');
  check((await page.textContent('.lrr-body tr:nth-child(1) .lrr-meas')).includes('oxygen'), 'lab-report-reader: Haemoglobin shows what it measures');
  await page.fill('.lrr-body tr:nth-child(1) [data-k=test]', 'Hemoglobin');
  check((await page.$$('.lrr-body tr:nth-child(1) .lrr-meas')).length === 1, 'lab-report-reader: Hemoglobin spelling also shows what it measures');
  const bg = await page.$eval('.lrr-body tr:nth-child(3)', (el) => { const s = getComputedStyle(el.querySelector('.lrr-mark')); const t = getComputedStyle(el.firstElementChild); return [s.color, t.borderLeftColor, getComputedStyle(el).backgroundColor]; });
  const red = (c) => { const m = c.match(/\d+/g)?.map(Number) || []; return m[0] > 150 && m[1] < 90 && m[2] < 90; };
  check(!bg.some(red), `lab-report-reader: no red colour on flagged rows (${bg.join(' ')})`);
  await page.fill('.lrr-body tr:nth-child(3) [data-k=value]', '4.0');
  check((await mark(3)).trim() === '', 'lab-report-reader: editing the result updates the mark');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.lrr-trk')]);
  check(dl.suggestedFilename().endsWith('.csv'), 'lab-report-reader: tracker CSV downloads');
};
