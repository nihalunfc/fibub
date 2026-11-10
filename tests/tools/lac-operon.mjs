// #1447 lac operon switch
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/lac-operon/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/lac-operon/`); await page.waitForSelector('.lo .lo-svg rect.gene');
  const big = () => page.textContent('.lo .lo-big'), on = () => page.locator('.lo .lo-svg rect.gene.on').count(), facts = () => page.textContent('.lo .lo-facts');
  check((await big()) === 'Genes switched off' && (await on()) === 0 && (await page.locator('.lo .lo-svg .blk').count()) === 2 && (await page.isHidden('.lo .lo-glu')), 'lac: no lactose, off');
  await page.click('.lo .lo-lac');
  check((await big()) === 'Genes switched on' && (await on()) === 3 && (await page.textContent('.lo .lo-svg')).includes('allolactose') && (await page.textContent('.lo .lo-lac')) === 'Lactose: present', 'lac: lactose switches on');
  await page.click('.lo .lo-lac'); await page.click('.lo .lo-mut [data-m="i-"]');
  check((await big()) === 'Genes switched on' && (await page.textContent('.lo .lo-svg')).includes('no repressor'), 'lac: i- always on');
  await page.click('.lo .lo-mut [data-m="oc"]'); check((await big()) === 'Genes switched on' && (await page.textContent('.lo .lo-sub')).includes('cannot grip'), 'lac: Oc always on');
  await page.click('.lo .lo-mut [data-m="none"]'); await page.click('.lo .lo-lev [data-l="cap"]');
  check(await page.isVisible('.lo .lo-glu'), 'lac: glucose button with CAP');
  await page.click('.lo .lo-lac'); check((await big()) === 'Genes switched on strongly' && (await page.locator('.lo .lo-svg circle.cap').count()) === 1, 'lac: lactose, no glucose, CAP on');
  await page.click('.lo .lo-glu'); check((await big()) === 'Genes on, but only weakly' && (await page.locator('.lo .lo-svg circle.cap').count()) === 0, 'lac: glucose keeps it weak');
  check((await facts()).includes('116 min') && (await facts()).includes('176 min') && (await facts()).includes('1.55 at 169 min'), 'lac: diauxie time course with CAP ' + (await facts()));
  await page.click('.lo .lo-lev [data-l="basic"]'); check((await facts()).includes('68 min') && (await facts()).includes('1.68'), 'lac: time course without CAP ' + (await facts()));
  await page.locator('.lo .lo-l0').fill('0'); check((await facts()).includes('none given') && (await page.textContent('.lo .lo-ol0')) === '0 mM', 'lac: no lactose given');
  check((await page.locator('.lo .lo-plot polyline').count()) === 3, 'lac: three curves');
  await quiz(page, check, '.lo', 'lac');
};
