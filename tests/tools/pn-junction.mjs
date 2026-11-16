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

  // ---- Solve my numbers (pn-junction) ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${k}"]`, v); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
  { // new block: no clashes with the checks above
  await psPre("LED on 5"); check((await psAns()).includes("Use a resistor of 300 Ω"), "pn-junction: example LED on 5");
  await psPre("5.1 V Zener"); check((await psAns()).includes("The output stays at 5.1 V. The Zener carries 26.3 mA and the load 5.1 mA"), "pn-junction: example 5.1 V Zener");
  await psPre("Overloaded"); check((await psAns()).includes("The Zener is not conducting"), "pn-junction: example Overloaded");
  await psPre("Thermal voltage"); check((await psAns()).includes("25.9 mV at 300 K"), "pn-junction: example Thermal voltage");
  await psPre("Silicon diode"); check((await psAns()).includes("5.75 mA"), "pn-junction: example Silicon diode");
  await psSet("rd", {"rd-I": "5", "rd-eta": "1", "rd-T": "300"});
  check((await psAns()).includes("5.17 Ω"), "pn-junction: typed numbers rd 5.17 Ω");
  await psSet("series", {"series-Vs": "1", "series-Vf": "2"}); check((await psAns()).includes("must be bigger than the diode voltage"), "pn-junction: friendly message: must be bigger than the diode voltage");
  await psSet("diode", {"diode-V": "900"}); check((await psAns()).includes("too large"), "pn-junction: friendly message: too large");
  await psPre("LED on 5"); { const w = await psWork(); check(w.includes("R = V ÷ I = 3 ÷ 0.01 = 300 Ω") && w.length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "pn-junction: working shown, no NaN"); }
  }
};
