// #1430 p-n junction and diode curve
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/pn-junction/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/pn-junction/`); await page.waitForSelector('.pn .pn-iv polyline');
  const big = () => page.textContent('.pn .pn-big'), facts = () => page.textContent('.pn .pn-facts');
  check((await big()) === 'I = 0 A' && (await facts()).includes('0.70 V') && (await facts()).includes('0.50 µm'), 'pn: no bias ' + (await big()));
  await page.click('.pn .pn-quick [data-v="0.7"]');
  check((await big()) === 'I = 5.75 mA' && (await facts()).includes('4.5 Ω') && (await page.textContent('.pn .pn-j')).includes('current 5.75 mA'), 'pn: silicon at 0.7 V ' + (await facts()));
  check((await page.textContent('.pn .pn-j .bt-l')) === '+', 'pn: forward bias battery + on the p side');
  await page.click('.pn .pn-quick [data-v="-5"]');
  check((await big()) === 'I = −10 fA' && (await facts()).includes('5.70 V') && (await facts()).includes('1.43 µm') && (await page.textContent('.pn .pn-j .bt-l')) === '−', 'pn: reverse bias ' + (await facts()));
  await page.click('.pn .pn-d [data-d="ge"]'); await page.click('.pn .pn-quick [data-v="0.3"]');
  check((await big()) === 'I = 1.1 mA', 'pn: germanium at 0.3 V ' + (await big()));
  await page.click('.pn .pn-d [data-d="zener"]'); await page.locator('.pn .pn-v').fill('-6');
  check((await big()) === 'I = −180 mA' && (await page.textContent('.pn .pn-sub')).includes('Zener breakdown') && (await page.textContent('.pn .pn-eq')).includes('breakdown current'), 'pn: Zener breakdown at −6 V');
  const zbig = () => page.textContent('.pn .pn-zbig'), zf = () => page.textContent('.pn .pn-zfacts');
  check((await zbig()) === 'Vout = 5.10 V (regulated)' && (await zf()).includes('31.4 mA') && (await zf()).includes('26.3 mA'), 'pn: regulator worked example ' + (await zf()));
  await page.locator('.pn .pn-vin').fill('6');
  check((await zbig()) === 'Vout = 4.92 V (not regulating)' && (await page.textContent('.pn .pn-zeq')).includes('not in breakdown'), 'pn: regulator drops out ' + (await zbig()));
  await page.locator('.pn .pn-vin').fill('12'); await page.locator('.pn .pn-rload').fill('5000'); check((await page.textContent('.pn .pn-orl')) === '5000 Ω' && (await zf()).includes('1.0 mA'), 'pn: load slider');
  await quiz(page, check, '.pn', 'pn');
};
