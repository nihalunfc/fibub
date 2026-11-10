// #1448 Geological time
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/geological-time/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/geological-time/`); await page.waitForSelector('.gt .gt-svg rect.sp');
  const big = () => page.textContent('.gt .gt-big'), sub = () => page.textContent('.gt .gt-sub'), facts = () => page.textContent('.gt .gt-facts');
  check((await big()) === 'First dinosaurs: 233 million years ago' && (await sub()).includes('13 December at 06:25') && (await sub()).includes('18.7 days'), 'geo: default dinosaurs ' + (await sub()));
  check((await facts()).includes('Mesozoic') && (await facts()).includes('Triassic') && (await facts()).includes('94.9 %'), 'geo: default place ' + (await facts()));
  check((await page.locator('.gt .gt-svg rect.sp').count()) === 19 && (await page.locator('.gt .gt-svg text.ev').count()) === 18, 'geo: spans and events drawn');
  await page.click('.gt .gt-svg rect.hit[data-ma="3700"]');
  check((await big()).startsWith('Earliest signs of life') && (await facts()).includes('Archean') && (await facts()).includes('before the eras') && (await sub()).includes('9 March'), 'geo: tap 3700 ' + (await big()));
  await page.click('.gt .gt-svg rect.hit[data-ma="0.3"]');
  check((await sub()).includes('31 December at 23:25') && (await sub()).includes('35 minutes') && (await facts()).includes('Quaternary'), 'geo: humans on calendar ' + (await sub()));
  await page.click('.gt .gt-sq [data-q="day"]'); check((await sub()).includes('23:59:54') && (await sub()).includes('5.7 seconds'), 'geo: one-day clock ' + (await sub()));
  await page.click('.gt .gt-sc [data-s="log"]'); check((await page.getAttribute('.gt .gt-svg', 'aria-label')).includes('log scale'), 'geo: log scale');
  await page.$eval('.gt .gt-a', (s) => { s.value = '1.82'; s.dispatchEvent(new Event('input', { bubbles: true })); }); check((await big()) === 'Dinosaurs (except birds) die out: 66 million years ago' && (await facts()).includes('Cretaceous'), 'geo: slider to 66 ' + (await big()));
  await quiz(page, check, '.gt', 'geo');
};
