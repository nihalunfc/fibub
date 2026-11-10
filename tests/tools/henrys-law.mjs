// #1435 Henry's law: soda bottles and divers
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/henrys-law/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/henrys-law/`); await page.waitForSelector('.hl .hl-bottle circle');
  const big = () => page.textContent('.hl .hl-big'), facts = () => page.textContent('.hl .hl-facts');
  check((await big()) === '3.6 g of CO₂ per litre' && (await facts()).includes('1.7 kbar') && (await facts()).includes('81.8 mmol/L') && (await page.textContent('.hl .hl-eq')).includes('2.5 bar / 1700 bar'), 'henry: soda worked example ' + (await facts()));
  const closed = await page.locator('.hl .hl-bottle circle.bub').count();
  await page.click('.hl .hl-open');
  check((await page.textContent('.hl .hl-sub')).includes('about 2026 mL') && (await page.locator('.hl .hl-bottle .cap').count()) === 0 && (await page.locator('.hl .hl-bottle circle.bub').count()) < closed && (await page.locator('.hl .hl-bottle circle.esc').count()) > 0, 'henry: opening the bottle ' + (await page.textContent('.hl .hl-sub')));
  await page.click('.hl .hl-open'); check((await page.textContent('.hl .hl-open')) === 'Open the bottle' && (await big()) === '3.6 g of CO₂ per litre', 'henry: close again');
  await page.locator('.hl .hl-t').fill('5'); check((await big()) === '6.43 g of CO₂ per litre', 'henry: cold soda holds more ' + (await big()));
  await page.locator('.hl .hl-t').fill('35'); check((await big()) === '2.77 g of CO₂ per litre', 'henry: warm soda holds less');
  await page.locator('.hl .hl-t').fill('25'); await page.locator('.hl .hl-p').fill('5'); check((await big()) === '7.21 g of CO₂ per litre', 'henry: double pressure doubles gas ' + (await big()));
  const cmp = await page.locator('.hl .hl-cmp tbody tr').allTextContents();
  check(cmp.length === 3 && cmp[0].includes('32.7') && cmp[1].includes('1.59') && cmp[2].includes('0.73'), 'henry: gas table ' + cmp.join('|'));
  check((await page.textContent('.hl .hl-pbig')) === '4 × the nitrogen at sea level' && (await page.textContent('.hl .hl-bars')).includes('1.93 mmol/L'), 'henry: diver at 30 m');
  await page.locator('.hl .hl-h').fill('0'); check((await page.textContent('.hl .hl-pbig')) === '1 × the nitrogen at sea level', 'henry: diver at surface');
  await page.click('.hl .hl-who [data-w="climb"]');
  check((await page.textContent('.hl .hl-oh')) === '5000 m up' && (await page.textContent('.hl .hl-pbig')) === '0.535 × the oxygen at sea level' && (await page.textContent('.hl .hl-psub')).includes('altitude sickness'), 'henry: climber at 5000 m');
  await quiz(page, check, '.hl', 'henry');
};
