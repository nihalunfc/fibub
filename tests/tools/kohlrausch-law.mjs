// #1433 Molar conductivity and Kohlrausch's law
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/kohlrausch-law/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/kohlrausch-law/`); await page.waitForSelector('.kl .kl-svg polyline.cv');
  const big = () => page.textContent('.kl .kl-big'), facts = () => page.textContent('.kl .kl-facts'), eq = () => page.textContent('.kl .kl-eq');
  check((await big()) === 'Λm = 140.5 S cm² mol⁻¹' && (await facts()).includes('0.001405 S cm⁻¹') && (await page.textContent('.kl .kl-svg')).includes('Λ°m ≈ 150') && (await page.locator('.kl .kl-svg .fit').count()) === 1, 'kohl: KCl worked example ' + (await facts()));
  check((await page.locator('.kl .kl-svg circle.pt').count()) === 6 && (await page.locator('.kl .kl-svg .ghost').count()) === 1, 'kohl: points and comparison curve');
  await page.selectOption('.kl .kl-e', 'hac');
  check((await big()) === 'Λm = 16.24 S cm² mol⁻¹' && (await facts()).includes('0.0415') && (await page.locator('.kl .kl-svg .fit').count()) === 0 && (await page.textContent('.kl .kl-sub')).includes('cannot be extended'), 'kohl: ethanoic acid ' + (await facts()));
  await page.locator('.kl .kl-c').fill('-4');
  check((await page.textContent('.kl .kl-oc')) === '1 × 10⁻⁴ mol/L' && (await big()) === 'Λm = 134.4 S cm² mol⁻¹' && (await facts()).includes('0.3437'), 'kohl: dilute acid ' + (await big()));
  await page.selectOption('.kl .kl-e', 'mgcl2'); await page.locator('.kl .kl-c').fill('-2');
  check((await big()) === 'Λm = 238 S cm² mol⁻¹' && (await eq()).includes('258 − 200'), 'kohl: MgCl2 2:1 electrolyte');
  check((await page.textContent('.kl .kl-ibig')) === 'Λ°m = 258 S cm² mol⁻¹' && (await page.textContent('.kl .kl-ieq')).includes('1 Mg²⁺ and 2 Cl⁻'), 'kohl: ion card MgCl2');
  await page.selectOption('.kl .kl-cat', 'Na+'); await page.selectOption('.kl .kl-an', 'SO42-');
  check((await page.textContent('.kl .kl-ibig')) === 'Λ°m = 260 S cm² mol⁻¹' && (await page.textContent('.kl .kl-ieq')).includes('2 Na⁺ and 1 SO₄²⁻'), 'kohl: Na2SO4');
  check((await page.textContent('.kl .kl-weq')).includes('= 426 + 91 − 126 = 391'), 'kohl: weak acid from three strong ' + (await page.textContent('.kl .kl-weq')));
  await page.click('.kl .kl-w [data-w="nh4oh"]'); check((await page.textContent('.kl .kl-weq')).includes('= 150 + 249 − 126 = 273'), 'kohl: NH4OH ' + (await page.textContent('.kl .kl-weq')));
  await quiz(page, check, '.kl', 'kohl');
};
