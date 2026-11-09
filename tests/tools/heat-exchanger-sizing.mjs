// #647 heat exchanger sizing
export const path = '/science/heat-exchanger-sizing/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/heat-exchanger-sizing/`); await page.waitForTimeout(500);
  const R = '.hxs', t = (c) => page.textContent(`${R} ${c}`);
  check((await t('.hx-big')) === 'Area 12.77 m² for 252 kW', `hx: example sizing (${await t('.hx-big')})`);
  { const f = await t('.hx-facts'); check(f.includes('60.19 °C') && f.includes('Cr = Cmin / Cmax = 0.67') && f.includes('Effectiveness ε0.6') && f.includes('NTU1.521') && f.includes('49.24 K') && f.includes('F = 0.8013') && f.includes('for counterflow it would be 10.24 m²'), 'hx: example facts (ε, NTU, LMTD, F)'); }
  check((await t('.hx-warn')).includes('Temperature cross') && await page.isVisible(`${R} .hx-fig`) && await page.isHidden(`${R} .hx-tfig`), 'hx: cross warning, ε-NTU chart');
  await page.selectOption(`${R} .hx-cfg`, 'counter'); await page.waitForTimeout(100);
  check((await t('.hx-big')) === 'Area 10.24 m² for 252 kW' && await page.isVisible(`${R} .hx-tfig`), 'hx: counterflow area and profile');
  await page.selectOption(`${R} .hx-cfg`, 'parallel'); await page.waitForTimeout(100);
  check((await t('.hx-err')).includes('cannot reach this duty') && await page.isHidden(`${R} .hx-out`), 'hx: parallel flow cannot do it');
  await page.selectOption(`${R} .hx-cfg`, 'cross-unmixed'); await page.waitForTimeout(100);
  check((await t('.hx-big')) === 'Area 11.42 m² for 252 kW' && (await t('.hx-facts')).includes('from ε-NTU'), 'hx: crossflow unmixed');
  await page.selectOption(`${R} .hx-cfg`, 'shell'); await page.fill(`${R} .hx-sh`, '2'); await page.waitForTimeout(100);
  { const a = +(await t('.hx-big')).match(/Area ([\d.]+)/)[1]; check(a > 10.24 && a < 12.77, `hx: two shell passes between one shell and counterflow (${a})`); }
  await page.fill(`${R} .hx-sh`, '1'); await page.selectOption(`${R} .hx-mode`, 'rate'); await page.waitForTimeout(100);
  check((await t('.hx-big')) === '278.3 kW: hot leaves at 53.75 °C, cold at 64.38 °C', `hx: rating with 20 m² (${await t('.hx-big')})`);
  await page.selectOption(`${R} .hx-mode`, 'size'); await page.selectOption(`${R} .hx-which`, 'c'); await page.fill(`${R} .hx-to`, '50'); await page.waitForTimeout(100);
  check((await t('.hx-facts')).includes('188.1 kW') && (await t('.hx-big')).startsWith('Area '), 'hx: sizing from the cold outlet');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=png]`)]); check((await d.suggestedFilename()) === 'heat-exchanger.png', 'hx: image report'); }
  await page.fill(`${R} .hx-to`, '130'); await page.waitForTimeout(100);
  check((await t('.hx-err')).includes('between the two inlet'), 'hx: outlet out of range');
  await page.fill(`${R} .hx-tci`, '150'); await page.waitForTimeout(100);
  check((await t('.hx-err')).includes('hotter than the cold inlet'), 'hx: inlets reversed');
};
