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
  // New options: current for a width, custom copper, temperature-rise table, working line, CSV.
  await page.selectOption(R + '.pc-u', 'mm'); await page.selectOption(R + '.pc-layer', 'outer'); await page.fill(R + '.pc-dt', '10');
  await page.selectOption(R + '.pc-find', 'i'); await page.fill(R + '.pc-wd', '0.8'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.pc-iw') && (await t('.pc-big1')) === 'Up to 2.03 A for a 10 °C rise', `pcb: current for a 0.8 mm trace (${await t('.pc-big1')})`);
  check((await t('.pc-work')).includes('43.14 mil²') && (await t('.pc-facts1')).includes('1.01 A'), 'pcb: working line and inner-layer current');
  { const tb = await t('.pc-tab'); check(tb.includes('2.75') && tb.includes('1.37') && tb.includes('Outer layer (A)'), 'pcb: temperature-rise table (current)'); }
  await page.fill(R + '.pc-wd', '0'); await page.waitForTimeout(100);
  check((await t('.pc-err1')).includes('width'), 'pcb: bad width message');
  await page.fill(R + '.pc-wd', '0.8');
  await page.selectOption(R + '.pc-find', 'w'); await page.selectOption(R + '.pc-oz', 'custom'); await page.fill(R + '.pc-cu', '70'); await page.waitForTimeout(100);
  check((await t('.pc-big1')) === 'At least 0.391 mm wide (15.4 mil)', `pcb: custom 70 µm copper (${await t('.pc-big1')})`);
  { const tb = await t('.pc-tab'); check(tb.includes('Outer width (mm)') && tb.includes('0.391'), 'pcb: temperature-rise table (width)'); }
  await page.fill(R + '.pc-cu', '0'); await page.waitForTimeout(100);
  check((await t('.pc-err1')).includes('thickness'), 'pcb: bad copper thickness message');
  await page.selectOption(R + '.pc-oz', '1'); await page.waitForTimeout(100);
  await page.evaluate(() => { document.querySelector('.pc-more').open = true; });
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pc-csv')]); check((await d.suggestedFilename()) === 'pcb-trace-table.csv', 'pcb: table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'pcb: image download'); }
};
