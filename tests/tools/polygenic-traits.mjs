// #1445 Polygenic traits
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/polygenic-traits/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/polygenic-traits/`); await page.waitForSelector('.pg .pg-svg rect.bar');
  const big = () => page.textContent('.pg .pg-big'), facts = () => page.textContent('.pg .pg-facts');
  check((await big()) === '7 height classes' && (await facts()).includes('1 : 6 : 15 : 20 : 15 : 6 : 1') && (await facts()).includes('1 in 64') && (await facts()).includes('115 cm') && (await facts()).includes('6.12 cm'), 'polygenic: 3 genes worked example ' + (await facts()));
  check((await page.textContent('.pg .pg-eq')).includes('20 / 64 = 0.3125') && (await page.textContent('.pg .pg-sub')).startsWith('AaBbCc × AaBbCc'), 'polygenic: formula and parents');
  check((await page.locator('.pg .pg-svg rect.bar').count()) === 7, 'polygenic: 7 bars');
  await page.click('.pg .pg-n [data-n="1"]'); check((await big()) === '3 height classes' && (await facts()).includes('1 : 2 : 1'), 'polygenic: one gene 1:2:1');
  await page.click('.pg .pg-n [data-n="6"]'); check((await big()) === '13 height classes' && (await facts()).includes('1 in 4096') && (await page.locator('.pg .pg-svg rect.bar').count()) === 13, 'polygenic: six genes');
  await page.locator('.pg .pg-s').fill('3'); check((await page.locator('.pg .pg-svg polyline.smooth').count()) === 1 && (await page.textContent('.pg .pg-os')) === '±3 cm', 'polygenic: environment smooths');
  await page.click('.pg .pg-grow');
  const counts = (await facts()).match(/Your 1000 children([\d ·]+)/)[1].split('·').map((x) => Number(x.trim()));
  check((await page.locator('.pg .pg-svg circle.pt').count()) === 13 && counts.reduce((a, b) => a + b, 0) === 1000 && counts[6] > counts[0], 'polygenic: grow 1000 children ' + counts.join(','));
  await page.click('.pg .pg-clear'); check((await page.locator('.pg .pg-svg circle.pt').count()) === 0 && (await page.isHidden('.pg .pg-clear')), 'polygenic: clear');
  await quiz(page, check, '.pg', 'polygenic');
};
