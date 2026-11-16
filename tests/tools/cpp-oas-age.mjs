// #1739 CPP start age
import { ageYM, monthAtAge, totalsAt, CPP_MAX_65 } from '../../src/lib/money/cpp-oas-age.ts';
export const path = '/money/cpp-oas-age/';
export default async ({ page, check, BASE }) => {
  check(ageYM(64, 6, 60) === 64.5 && ageYM(70, 5, 60) === 70 && monthAtAge('1962-05-20', 65) === '2027-06' && monthAtAge('', 65) === null && totalsAt(1000, 65, [70])[0].total === 60000 && CPP_MAX_65 === 1507.65, 'cpp-oas-age: month, birth-date and total maths');
  await page.goto(`${BASE}/money/cpp-oas-age/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.co [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const t = async (c) => (await page.textContent(`.co ${c}`)).trim();
  await set('cpp', '1000');
  await page.selectOption('.co [data-k="cage"]', '70'); await page.waitForTimeout(80);
  check((await t('.co-s-cpp')).includes('1,420.00'), 'cpp-oas-age: CPP at 70 = 142% of 65');
  check((await t('.co-line')).includes('81.9'), 'cpp-oas-age: break-even 65 vs 70 at 81.9');
  await page.selectOption('.co [data-k="cage"]', '60'); await page.waitForTimeout(80);
  check((await t('.co-s-cpp')).includes('640.00'), 'cpp-oas-age: CPP at 60 = 64%');
  await page.selectOption('.co [data-k="oage"]', '70'); await page.waitForTimeout(80);
  check((await t('.co-oas')).includes('136%'), 'cpp-oas-age: OAS at 70 = 136%');
  await page.selectOption('.co [data-k="oage"]', '65'); await set('inc', '120000');
  check((await t('.co-s-claw')).includes('3,702'), 'cpp-oas-age: clawback on 120,000 = 3,702');
  await set('cpp', '0');
  check(await page.isVisible('.co .co-err'), 'cpp-oas-age: empty CPP shows a message');
  // new options
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await set('cpp', '1000'); await set('inc', '60000');
  await page.selectOption('.co [data-k="cage"]', '64'); await page.selectOption('.co [data-k="cmo"]', '6'); await page.waitForTimeout(80);
  check((await t('.co-s-cpp')).includes('964.00'), 'cpp-oas-age: 64 years 6 months = 96.4% (' + (await t('.co-s-cpp')) + ')');
  await page.click('.co .co-max'); await page.waitForTimeout(80);
  check((await page.inputValue('.co [data-k="cpp"]')).includes('1507.65'), 'cpp-oas-age: maximum quick fill');
  await page.fill('.co [data-k="dob"]', '1962-05-20'); await page.waitForTimeout(80);
  check((await t('.co-dates')).includes('earliest months'), 'cpp-oas-age: birth date shows start months');
  check((await t('.co-tt')).includes('$') && (await t('.co-tt')).includes('By') === false, 'cpp-oas-age: total-by-age table has rows');
  check(!(await page.textContent('.co')).includes('NaN'), 'cpp-oas-age: no NaN');
};
