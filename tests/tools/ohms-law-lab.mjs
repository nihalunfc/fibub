// #1041 Ohm's law lab
export const path = '/learn/ohms-law-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ohms-law-lab/`); await page.waitForTimeout(600);
  const R = '.ohl ';
  const txt = (s) => page.textContent(R + s);
  const setRange = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.ohl-read')).includes('Ammeter0.600 A') && (await txt('.ohl-read')).includes('Voltmeter6.0 V'), `ohm: 10 Ω at 6 V reads 0.600 A (${await txt('.ohl-read')})`);
  check((await txt('.ohl-formula')) === 'R = V / I = 6.0 V ÷ 0.600 A = 10 Ω', `ohm: formula with live numbers (${await txt('.ohl-formula')})`);
  check((await txt('.ohl-fit')).startsWith('No readings yet'), 'ohm: no readings at first');
  // The circuit picture is drawn (not blank).
  const inked = () => page.$eval(R + '.ohl-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 128) n++; return n; });
  check((await inked()) > 500, 'ohm: circuit picture drawn');
  // Slider by keyboard: one step is 0.5 V.
  await page.focus(R + '.ohl-v'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
  check((await txt('.ohl-vv')) === '6.5 V' && (await txt('.ohl-read')).includes('Ammeter0.650 A'), 'ohm: arrow key moves the voltage slider');
  await page.click(R + '.ohl-auto'); await page.waitForTimeout(150);
  check((await page.$$(R + '.ohl-tab tr')).length === 7, 'ohm: take 6 readings fills the table');
  check((await txt('.ohl-fit')).startsWith('Slope of the best line = resistance = 10 Ω'), `ohm: slope is the resistance (${await txt('.ohl-fit')})`);
  check((await txt('.ohl-vv')) === '6.5 V', 'ohm: voltage slider kept after auto readings');
  await page.click(R + '.ohl-rec'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ohl-tab tr')).length === 8 && (await txt('.ohl-tab')).includes('6.50.65010'), 'ohm: record adds a row');
  await page.click(R + '.ohl-clear'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ohl-tab tr')).length === 0, 'ohm: clear empties the table');
  await setRange('.ohl-r', 20); await setRange('.ohl-v', 12); await page.waitForTimeout(100);
  check((await txt('.ohl-rv')) === '20 Ω' && (await txt('.ohl-read')).includes('Ammeter0.600 A'), 'ohm: resistance slider');
  await setRange('.ohl-v', 0); await page.waitForTimeout(100);
  check((await txt('.ohl-formula')).startsWith('At 0 V no current'), 'ohm: no current at 0 V');
  // Bulb
  await page.click(R + '.ohl-part [data-v=bulb]'); await setRange('.ohl-v', 6); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ohl-bulbnote') && (await txt('.ohl-read')).includes('Ammeter0.500 A') && (await txt('.ohl-read')).includes('12 Ω'), 'ohm: bulb 0.50 A at 6 V');
  await page.click(R + '.ohl-auto'); await page.waitForTimeout(150);
  check((await txt('.ohl-fit')).startsWith('The points bend: V/I goes from 6.1'), `ohm: bulb curve detected (${await txt('.ohl-fit')})`);
  // Wire: nichrome, 0.3 mm, 1 m.
  await page.click(R + '.ohl-part [data-v=wire]'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ohl-wonly') && await page.isHidden(R + '.ohl-ronly') && (await page.$$(R + '.ohl-tab tr')).length === 0, 'ohm: wire settings shown, readings cleared');
  check((await txt('.ohl-wireformula')).includes('= 15.6 Ω') && (await txt('.ohl-read')).includes('Ammeter0.386 A'), `ohm: nichrome wire R = ρL/A (${await txt('.ohl-wireformula')})`);
  await setRange('.ohl-l', 2); await page.waitForTimeout(100);
  check((await txt('.ohl-lv')) === '2.00 m' && (await txt('.ohl-wireformula')).includes('= 31.1 Ω') && (await txt('.ohl-read')).includes('Ammeter0.193 A'), 'ohm: double length doubles R');
  await page.selectOption(R + '.ohl-d', '0.2'); await page.waitForTimeout(100);
  check((await txt('.ohl-wireformula')).includes('= 70 Ω'), `ohm: thinner wire (${await txt('.ohl-wireformula')})`);
  await page.click(R + '.ohl-auto'); await page.waitForTimeout(150);
  check((await txt('.ohl-fit')).includes('resistance = 70'), `ohm: wire slope (${await txt('.ohl-fit')})`);
  check(await page.isHidden(R + '.ohl-more'), 'ohm: Class 12 facts hidden at Class 10');
  await page.selectOption(R + '.ohl-mat', 'copper'); await page.selectOption(R + '.ohl-d', '1'); await setRange('.ohl-l', 1); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ohl-warn') && (await txt('.ohl-warn')).includes('short circuit'), 'ohm: copper wire warns of a huge current');
  await page.click(R + '.ohl-level [data-v="12"]'); await page.waitForTimeout(100);
  const more = await txt('.ohl-more');
  check(more.includes('Current density') && more.includes('Conductivity') && more.includes('Drift speed'), `ohm: Class 12 facts for copper (${more.slice(0, 120)})`);
  await page.selectOption(R + '.ohl-mat', 'nichrome'); await page.waitForTimeout(100);
  check(!(await txt('.ohl-more')).includes('Drift speed') && (await txt('.ohl-more')).includes('Power'), 'ohm: drift speed only for copper');
  await page.click(R + '.ohl-part [data-v=bulb]'); await page.waitForTimeout(100);
  check((await txt('.ohl-more')).includes('2 Ω cold'), 'ohm: Class 12 bulb facts');
  await page.click(R + '.ohl-level [data-v="10"]'); await page.click(R + '.ohl-part [data-v=resistor]');
  // Check yourself: four questions; answer the first one right and the second one wrong.
  check((await page.$$(R + '.eq-q')).length === 4, 'ohm: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p');
  const [, r1, v1] = q1.match(/A ([\d.]+) Ω resistor .* a ([\d.]+) V battery/);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String(+(v1 / r1).toFixed(3))); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right') && await page.isVisible(R + '.eq-q:nth-child(1) .eq-work p'), 'ohm: right answer accepted and working shown');
  await page.fill(R + '.eq-q:nth-child(2) .eq-in', '99999'); await page.press(R + '.eq-q:nth-child(2) .eq-in', 'Enter');
  check((await page.textContent(R + '.eq-q:nth-child(2) .eq-res')).startsWith('Not quite'), 'ohm: wrong answer flagged');
  await page.click(R + '.eq-q:nth-child(3) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(3) .eq-res')) === 'Type a number first.', 'ohm: empty answer message');
  let changed = false;
  for (let k = 0; k < 5 && !changed; k++) { await page.click(R + '.eq-new'); changed = (await page.textContent(R + '.eq-list')) !== q1 && (await page.textContent(R + '.eq-q:nth-child(1) .eq-res')) === ''; }
  check(changed, 'ohm: new questions');
};
