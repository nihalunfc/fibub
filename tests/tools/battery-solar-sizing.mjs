// #627 battery runtime and solar sizing
export const path = '/science/battery-solar-sizing/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/battery-solar-sizing/`); await page.waitForTimeout(600);
  const br = () => page.textContent('.bss .br-big'), so = () => page.textContent('.bss .so-big');
  const brf = () => page.textContent('.bss .br-facts'), sof = () => page.textContent('.bss .so-facts');
  check((await br()) === 'About 8 h 49 min (9 h 00 min without Peukert)', `battery-solar-sizing: example runtime (${await br()})`);
  { const f = await brf(); check(f.includes('1200 Wh') && f.includes('5.56 A') && f.includes('0.0556 C'), 'battery-solar-sizing: energy, current, C-rate'); }
  check(await page.isVisible('.bss .br-fig'), 'battery-solar-sizing: runtime chart');
  await page.fill('.bss .br-k', '1'); await page.waitForTimeout(100);
  check((await br()) === 'About 9 h 00 min (9 h 00 min without Peukert)', 'battery-solar-sizing: k = 1 removes the Peukert effect');
  await page.selectOption('.bss .br-cu', 'Wh'); await page.fill('.bss .br-cap', '600'); await page.waitForTimeout(100);
  check((await br()).startsWith('About 4 h 30 min'), 'battery-solar-sizing: capacity in Wh');
  await page.selectOption('.bss .br-lu', 'A'); await page.fill('.bss .br-load', '5'); await page.waitForTimeout(100);
  check(await page.isHidden('.bss .br-eff') && (await br()).startsWith('About 5 h 00 min'), 'battery-solar-sizing: load in amps');
  await page.fill('.bss .br-dod', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.bss .br-err')).includes('depth of discharge'), 'battery-solar-sizing: bad depth of discharge');
  await page.fill('.bss .br-dod', '50');
  // Solar.
  check((await so()) === '2 × 400 W panels, 6 × 12 V 100 Ah batteries', `battery-solar-sizing: example solar (${await so()})`);
  { const f = await sof(); check(f.includes('1230 Wh/day') && f.includes('450 W') && f.includes('5467 Wh, 228 Ah at 24 V') && f.includes('2 in series × 3 in parallel') && f.includes('41.7 A') && f.includes('2430 Wh/day'), 'battery-solar-sizing: sizing facts'); }
  check((await page.textContent('.bss .so-tab')).includes('Fridge (average draw)') && (await page.textContent('.bss .so-tab')).includes('49 %'), 'battery-solar-sizing: appliance table');
  await page.selectOption('.bss .so-vs', '12'); await page.waitForTimeout(100);
  check((await so()) === '2 × 400 W panels, 5 × 12 V 100 Ah batteries' && (await sof()).includes('83.3 A'), 'battery-solar-sizing: 12 V system');
  await page.fill('.bss .so-psh', '3'); await page.waitForTimeout(100);
  check((await so()).startsWith('2 × 400 W') && (await sof()).includes('675 W'), 'battery-solar-sizing: fewer sun hours need more array');
  await page.fill('.bss .so-pw', '300'); await page.waitForTimeout(100);
  check((await so()).startsWith('3 × 300 W'), 'battery-solar-sizing: panel size');
  await page.selectOption('.bss .so-vs', '48'); await page.fill('.bss .so-bv', '10'); await page.waitForTimeout(100);
  check((await sof()).includes('is not a whole number'), 'battery-solar-sizing: battery voltage mismatch warned');
  await page.fill('.bss .so-bv', '12');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bss .so-csv')]); const f = OUT + 'so.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('appliance,watts,hours_per_day,quantity,wh_per_day') && t.includes('LED lights,10,5,4,200') && t.includes('daily_load_wh,1230'), 'battery-solar-sizing: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bss .dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'battery-solar-sizing: Word report'); }
  await page.fill('.bss .so-data', 'Heater\t2000\t30\t1'); await page.waitForTimeout(150);
  check((await page.textContent('.bss .so-err')).includes('hours 0 to 24'), 'battery-solar-sizing: hours over 24 refused');
  await page.fill('.bss .so-data', 'Lamp\t20'); await page.waitForTimeout(150);
  check((await page.textContent('.bss .so-err')).includes('at least watts and hours'), 'battery-solar-sizing: row without hours');
  await page.fill('.bss .so-data', '100\t3'); await page.waitForTimeout(150);
  check((await sof()).includes('300 Wh/day'), 'battery-solar-sizing: row without a name');
};
