// #1446 Meselson-Stahl experiment
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/meselson-stahl/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/meselson-stahl/`); await page.waitForSelector('.ms .ms-tubes rect.band');
  const big = () => page.textContent('.ms .ms-big'), sub = () => page.textContent('.ms .ms-sub'), mols = () => page.locator('.ms .ms-mols line.st').count();
  check((await big()) === '100 % hybrid (¹⁵N/¹⁴N)' && (await mols()) === 4, 'meselson: semi generation 1');
  await page.click('.ms .ms-m [data-m="conservative"]');
  check((await big()) === '50 % heavy (¹⁵N/¹⁵N), 50 % light (¹⁴N/¹⁴N)' && (await page.locator('.ms .ms-tubes rect.band').count()) === 2, 'meselson: conservative generation 1');
  await page.click('.ms .ms-real');
  check((await sub()).includes('ruled out') && (await page.locator('.ms .ms-tubes rect.band.real').count()) === 1, 'meselson: real result rules out conservative');
  await page.click('.ms .ms-m [data-m="dispersive"]'); check((await sub()).includes('matches'), 'meselson: dispersive matches at generation 1');
  await page.locator('.ms .ms-g').fill('2');
  check((await big()) === '100 % 25 % ¹⁵N' && (await sub()).includes('ruled out'), 'meselson: dispersive ruled out at generation 2 ' + (await big()));
  await page.click('.ms .ms-m [data-m="semi"]');
  check((await big()) === '50 % hybrid (¹⁵N/¹⁴N), 50 % light (¹⁴N/¹⁴N)' && (await sub()).includes('matches') && (await mols()) === 8, 'meselson: semi generation 2');
  await page.locator('.ms .ms-g').fill('3'); check((await big()).startsWith('25 % hybrid') && (await mols()) === 16, 'meselson: generation 3');
  await page.locator('.ms .ms-g').fill('1'); await page.click('.ms .ms-heat');
  check((await big()) === '50 % heavy strand, 50 % light strand', 'meselson: heated strands');
  await page.click('.ms .ms-m [data-m="conservative"]'); check((await sub()).includes('matches'), 'meselson: heated conservative looks the same');
  await page.click('.ms .ms-heat'); await page.locator('.ms .ms-g').fill('0'); check((await page.textContent('.ms .ms-og')) === 'start (all ¹⁵N)' && (await big()) === '100 % heavy (¹⁵N/¹⁵N)', 'meselson: start');
  await quiz(page, check, '.ms', 'meselson');
};
