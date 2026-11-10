// #1429 Energy bands
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/energy-bands/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/energy-bands/`); await page.waitForSelector('.eb .eb-svg rect');
  const facts = () => page.textContent('.eb .eb-facts'), big = () => page.textContent('.eb .eb-big');
  check((await big()) === 'Semiconductor: Eg = 1.12 eV' && (await facts()).includes('9.78 × 10⁹ cm⁻³'), 'bands: silicon at 300 K ' + (await facts()));
  const dots300 = await page.locator('.eb .eb-svg circle.el').count();
  await page.locator('.eb .eb-t').fill('400');
  check((await page.textContent('.eb .eb-sub')).includes('346 times more') && (await page.locator('.eb .eb-svg circle.el').count()) > dots300, 'bands: warming adds electrons');
  await page.locator('.eb .eb-t').fill('300');
  await page.click('.eb .eb-type [data-d="n"]');
  check((await facts()).includes('1.00 × 10¹⁶ cm⁻³') && (await facts()).includes('9.57 × 10³ cm⁻³') && (await page.locator('.eb .eb-svg .lv').count()) === 1, 'bands: n-type worked example ' + (await facts()));
  await page.click('.eb .eb-type [data-d="p"]');
  check((await page.textContent('.eb .eb-eq')).includes('nₑ = nᵢ² / nₕ') && (await page.textContent('.eb .eb-svg')).includes('acceptor'), 'bands: p-type');
  await page.locator('.eb .eb-n').fill('14'); check((await page.textContent('.eb .eb-on')).startsWith('1.00 × 10¹⁴'), 'bands: dopant slider');
  await page.click('.eb .eb-mat [data-m="diamond"]');
  check((await big()) === 'Insulator: Eg = 5.5 eV' && (await page.locator('.eb .eb-svg circle.el').count()) === 0 && (await page.isHidden('.eb .eb-dope')), 'bands: diamond insulator, no doping control');
  await page.click('.eb .eb-mat [data-m="cu"]');
  check((await big()).startsWith('Conductor') && (await page.locator('.eb .eb-svg circle.el').count()) === 30, 'bands: copper overlapping bands');
  await page.click('.eb .eb-mat [data-m="ge"]'); check((await big()) === 'Semiconductor: Eg = 0.66 eV', 'bands: germanium');
  const lam = () => page.textContent('.eb .eb-lam');
  check((await lam()) === 'λ = 653 nm' && (await page.locator('.eb .eb-dome').getAttribute('data-colour')) === 'red', 'bands: LED red at 1.90 eV');
  await page.locator('.eb .eb-led').fill('2.7'); check((await lam()) === 'λ = 459 nm' && (await page.textContent('.eb .eb-col')).startsWith('Blue'), 'bands: LED blue');
  await page.locator('.eb .eb-led').fill('1.12'); check((await page.textContent('.eb .eb-col')).startsWith('Infrared'), 'bands: silicon gap is infrared');
  await quiz(page, check, '.eb', 'bands');
};
