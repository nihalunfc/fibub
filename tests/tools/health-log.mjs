// #T905 Health log
import { readFileSync } from 'node:fs';
export const path = '/documents/health-log/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/health-log/`); await page.waitForTimeout(500);
  check((await page.textContent('.hl .hl-note')).includes('not medical advice'), 'health log: banner at the top');
  check(await page.isHidden('.hl .hl-out'), 'health log: nothing shown before the first entry');
  const add = async (when, f) => {
    await page.fill('.hl .hl-when', when);
    for (const [k, v] of Object.entries(f)) await page.fill(`.hl .hl-f[data-k=${k}]`, v);
    await page.click('.hl .hl-add'); await page.waitForTimeout(80);
  };
  await add('2026-11-02T08:00', { sys: '120', dia: '78', pulse: '60' });
  await add('2026-11-03T08:00', { sys: '130', dia: '80' });
  await add('2026-11-04T08:00', { sys: '140', dia: '82' });
  check((await page.$$('.hl .hl-table tbody tr')).length === 3, 'health log: 3 BP entries make 3 table rows');
  { const w = await page.textContent('.hl .hl-weeks'); check((await page.$$('.hl .hl-weeks tbody tr')).length === 1 && w.includes('2026-11-02') && w.includes('130') && w.includes('80'), `health log: weekly averages 130 and 80 (${w.replace(/\s+/g, ' ').slice(0, 80)})`); }
  { const s = await page.textContent('.hl .hl-stats'); check(s.includes('Systolic') && s.includes('120') && s.includes('140'), 'health log: lowest and highest shown'); }
  check(await page.evaluate(() => { const c = document.querySelector('.hl .hl-card canvas'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 4; i < d.length; i += 4) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) return true; return false; }), 'health log: chart draws');
  check((await page.textContent('.hl .hl-charts')).includes('Your own target line') && !(await page.textContent('.hl .hl-out')).match(/normal|high blood|stage|hypertension/i), 'health log: own target box, no guideline categories');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => k.startsWith('fibub-healthlog')))), 'health log: nothing saved until ticked');
  await page.fill('.hl .hl-from', '2026-11-03'); await page.waitForTimeout(80);
  check((await page.$$('.hl .hl-table tbody tr')).length === 2, 'health log: date range limits the table');
  await page.click('.hl .hl-allr');
  let dl = page.waitForEvent('download'); await page.click('.hl .hl-csv');
  const d = await dl, csv = readFileSync(await d.path(), 'utf8');
  check(d.suggestedFilename() === 'health-log-bp.csv' && csv.startsWith('Date,Time,Systolic (top) (mmHg)') && csv.trim().split(/\r?\n/).length === 4, 'health log: CSV download');
  await page.setInputFiles('.hl .hl-import', await d.path()); await page.waitForTimeout(300);
  check((await page.$$('.hl .hl-table tbody tr')).length === 6 && (await page.textContent('.hl .hl-imsg')).startsWith('Added 3'), 'health log: own CSV imported back');
  dl = page.waitForEvent('download'); await page.click('.hl .hl-dl button[data-f=pdf]');
  check((await dl).suggestedFilename() === 'health-log-bp.pdf', 'health log: PDF summary downloads');
  await page.click('.hl .hl-tab[data-p=glucose]'); await page.waitForTimeout(100);
  await add('2026-11-02T07:00', { value: '99' });
  check((await page.textContent('.hl .hl-table tbody')).includes('99'), 'health log: glucose in mg/dL');
  await page.selectOption('.hl .hl-unit', 'mmol/L'); await page.waitForTimeout(100);
  check((await page.textContent('.hl .hl-table tbody')).includes('5.5') && (await page.textContent('.hl .hl-stats')).includes('mmol/L'), 'health log: unit switch converts 99 mg/dL to 5.5 mmol/L');
  await page.selectOption('.hl .hl-unit', 'mg/dL'); await page.waitForTimeout(100);
  check((await page.textContent('.hl .hl-table tbody')).includes('99'), 'health log: and back to 99');
  await page.fill('.hl .hl-f[data-k=value]', '99999'); await page.click('.hl .hl-add');
  check((await page.textContent('.hl .hl-msg')).includes('typing slip'), 'health log: impossible value refused');
  await page.check('.hl .hl-remember'); await page.waitForTimeout(80);
  check(await page.evaluate(() => !!localStorage.getItem('fibub-healthlog-v1')), 'health log: saved once ticked');
  await page.click('.hl .hl-clear'); await page.waitForTimeout(80);
  check(await page.evaluate(() => !localStorage.getItem('fibub-healthlog-v1')) && await page.isHidden('.hl .hl-out'), 'health log: Clear removes everything');
};
