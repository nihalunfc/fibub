// #624 PCB trace width and impedance
export const path = '/science/pcb-trace-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.pcbt ';
  await page.goto(`${BASE}/science/pcb-trace-calculator/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(R + c);
  check((await t('.pc-big1')) === 'At least 0.786 mm wide (31 mil)', `pcb: example width (${await t('.pc-big1')})`);
  { const f = await t('.pc-facts1'); check(f.includes('42.39 mil²') && f.includes('33.4 mΩ') && f.includes('66.7 mV, 133 mW') && f.includes('2.05 mm'), 'pcb: cross-section, resistance, drop and inner-layer width'); }
  check(await page.isVisible(R + '.pc-fig1') && await page.isVisible(R + '.pc-fig2'), 'pcb: both charts');
  check((await t('.pc-big2')) === 'Z0 = 51.2 Ω' && (await t('.pc-facts2')).includes('3.05') && (await t('.pc-facts2')).includes('5.83 ps/mm'), `pcb: example microstrip (${await t('.pc-big2')})`);
  await page.selectOption(R + '.pc-mode', 'w'); await page.waitForTimeout(100);
  check((await t('.pc-big2')) === 'W = 0.366 mm (14.4 mil) for 50 Ω', `pcb: width for 50 Ω (${await t('.pc-big2')})`);
  await page.selectOption(R + '.pc-line', 'sl'); await page.fill(R + '.pc-h', '0.5'); await page.waitForTimeout(100);
  check((await t('.pc-big2')).startsWith('W = ') && (await t('.pc-facts2')).includes('all inside the board'), 'pcb: stripline width for 50 Ω');
  await page.selectOption(R + '.pc-mode', 'z'); await page.fill(R + '.pc-w', '0.2'); await page.waitForTimeout(100);
  check((await t('.pc-big2')) === 'Z0 = 47.4 Ω', `pcb: stripline Z0 (${await t('.pc-big2')})`);
  await page.selectOption(R + '.pc-layer', 'inner'); await page.waitForTimeout(100);
  check((await t('.pc-big1')).startsWith('At least 2.05 mm'), 'pcb: inner layer');
  await page.selectOption(R + '.pc-u', 'mil'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.pc-len')) === '1969' && (await t('.pc-big1')).includes('mil wide') && (await t('.pc-big2')) === 'Z0 = 47.4 Ω', 'pcb: switch to mils converts the inputs');
  await page.fill(R + '.pc-i', '50'); await page.waitForTimeout(100);
  check((await t('.pc-facts1')).includes('Outside the chart'), 'pcb: outside the IPC chart warning');
  await page.fill(R + '.pc-i', '0'); await page.waitForTimeout(100);
  check((await t('.pc-err1')).includes('current'), 'pcb: bad current message');
  await page.fill(R + '.pc-er', '0.5'); await page.waitForTimeout(100);
  check((await t('.pc-err2')).includes('εr'), 'pcb: bad εr message');
  await page.fill(R + '.pc-er', '4.2'); await page.selectOption(R + '.pc-mode', 'w'); await page.fill(R + '.pc-z', '500'); await page.waitForTimeout(100);
  check((await t('.pc-err2')).includes('No width'), 'pcb: unreachable impedance message');
  await page.fill(R + '.pc-i', '2'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'pcb: image download'); }
};
