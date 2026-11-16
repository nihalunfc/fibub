// #L375 Measure and mark (steps, tape reader, 3-4-5 checker, quiz). Maths: src/lib/home/measure.ts
import { toFraction, formatInches, readLength, squareCheck, metricWork, inchWork } from '../../src/lib/home/measure.ts';
export const path = '/learn/measure-and-mark/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 5 6/16 = 5 3/8 = 5.375; 12/16 = 3/4; 600-800-1000 is 3-4-5 times 200.
  const f = toFraction(5.375);
  check(f.w === 5 && f.n === 3 && f.d === 8 && formatInches(0.75) === '3/4' && formatInches(12) === '12', 'measure-and-mark: inch fractions reduce (5 3/8, 3/4, 12)');
  check(readLength('5 3/8') === 5.375 && readLength('5-3/8"') === 5.375 && readLength('5½') === 5.5 && readLength('3/8') === 0.375 && Number.isNaN(readLength('abc')), 'measure-and-mark: reads typed fractions');
  const s = squareCheck(600, 800, 1004);
  check(s.want === 1000 && s.off === 4 && Math.abs(s.angle - 90.48) < 0.01 && squareCheck(3, 4, 5).angle === 90, 'measure-and-mark: 3-4-5 diagonal 1000 and angle 90.48° for a 1004 diagonal');
  check(metricWork(127).endsWith('120 + 7 = 127 mm.') && inchWork(5.375).includes('6/16 = 3/8'), 'measure-and-mark: worked readings (127 mm, 5 3/8 in)');

  await page.goto(`${BASE}/learn/measure-and-mark/`); await page.waitForTimeout(300);
  const R = '.mam';
  check((await page.locator(`${R} .sk-step`).count()) === 8, 'measure-and-mark: 8 steps');
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 8 steps done', 'measure-and-mark: ticks count');
  // Tape reader, metric: type the right reading.
  { const r = await page.getAttribute(`${R} .mam-svg`, 'data-reading'); await page.fill(`${R} .mam-in`, r); await page.click(`${R} .mam-check`);
    check((await page.textContent(`${R} .mam-out`)).startsWith('Right.'), `measure-and-mark: tape reader accepts ${r} mm`); }
  await page.click(`${R} .mam-new`); await page.fill(`${R} .mam-in`, '99999'); await page.click(`${R} .mam-check`);
  check((await page.textContent(`${R} .mam-out`)).startsWith('Not quite'), 'measure-and-mark: tape reader rejects a wrong reading');
  // Imperial: answer as a fraction.
  await page.click(`${R} .mam-units button[data-u=in]`);
  { const r = +(await page.getAttribute(`${R} .mam-svg`, 'data-reading')); await page.fill(`${R} .mam-in`, formatInches(r)); await page.click(`${R} .mam-check`);
    check((await page.textContent(`${R} .mam-out`)).startsWith('Right.'), `measure-and-mark: inch reader accepts ${formatInches(r)} in`); }
  check((await page.textContent(`${R} .mam-score`)) === '2 of 3 right first time.', 'measure-and-mark: score counts first answers');
  // 3-4-5 checker: default 300, 400, 503 is open; 500 is square.
  check((await page.textContent(`${R} .mam-sqout`)).includes('more than 90°'), 'measure-and-mark: 503 diagonal reads as open');
  await page.fill(`${R} .mam-d`, '500');
  check((await page.textContent(`${R} .mam-sqout`)).startsWith('Square.'), 'measure-and-mark: 300-400-500 is square');
  check((await page.locator(`${R} .lq-item`).count()) === 5, 'measure-and-mark: quiz has 5 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', 'measure-and-mark: quiz accepts the right answer'); }
};
