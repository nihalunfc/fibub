// #1431 Rectifier lab
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/rectifier-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rectifier-lab/`); await page.waitForSelector('.rl .rl-w polyline.vout');
  const big = () => page.textContent('.rl .rl-big'), sub = () => page.textContent('.rl .rl-sub'), facts = () => page.textContent('.rl .rl-facts'), on = () => page.locator('.rl .dio.on').evaluateAll((g) => g.map((x) => x.dataset.name).join());
  check((await big()) === 'DC output 6.29 V' && (await facts()).includes('10.60 V') && (await facts()).includes('0.572') && (await page.textContent('.rl .rl-eq')).includes('6.75 V'), 'rect: bridge without capacitor ' + (await big()));
  check((await on()) === 'D1,D3', 'rect: bridge positive half D1 and D3');
  await page.click('.rl .rl-h [data-h="neg"]'); check((await on()) === 'D2,D4', 'rect: bridge negative half D2 and D4');
  await page.click('.rl .rl-c [data-c="1000"]');
  check((await big()) === 'DC output 10.55 V' && (await sub()).startsWith('Ripple 0.10 V peak to peak at 100 Hz') && (await page.textContent('.rl .rl-eq')).includes('= 0.11 V'), 'rect: 1000 µF smoothing ' + (await sub()));
  await page.locator('.rl .rl-r').fill('200'); check((await sub()).startsWith('Ripple 0.47 V'), 'rect: heavier load more ripple ' + (await sub()));
  await page.locator('.rl .rl-r').fill('1000');
  await page.click('.rl .rl-m [data-m="half"]');
  check((await sub()).startsWith('Ripple 0.22 V peak to peak at 50 Hz') && (await on()) === '' && (await page.textContent('.rl .rl-cond')).includes('no current'), 'rect: half-wave negative half blocked ' + (await sub()));
  await page.click('.rl .rl-h [data-h="pos"]'); check((await on()) === 'D', 'rect: half-wave positive half');
  await page.click('.rl .rl-c [data-c="0"]'); check((await big()) === 'DC output 3.48 V', 'rect: half-wave no capacitor ' + (await big()));
  await page.click('.rl .rl-m [data-m="full"]');
  check((await big()) === 'DC output 6.95 V' && (await on()) === 'D1', 'rect: full-wave centre tap');
  await page.locator('.rl .rl-vp').fill('20'); check((await page.textContent('.rl .rl-ovp')) === '20 V' && (await facts()).includes('19.30 V'), 'rect: Vp slider');
  await quiz(page, check, '.rl', 'rect');
};
