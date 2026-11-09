// #974 Optical tweezers calibration
export const path = '/science/optical-tweezers/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/optical-tweezers/`); await page.waitForTimeout(1200);
  const big = () => page.textContent('.otc .ot-big'), facts = () => page.textContent('.otc .ot-facts');
  check((await big()) === 'Trap stiffness 0.0200 ± 0.00038 pN/nm (corner frequency 380 Hz)', 'tweezers: example stiffness');
  { const t = await facts(); check(t.includes('380 ± 7.2 Hz') && t.includes('0.02003 pN/nm') && t.includes('0.01999 pN/nm') && t.includes('0.4916 µm²/s') && t.includes('0.4907 µm²/s') && t.includes('205.9 nm²') && t.includes('1.28') && t.includes('8.388 × 10⁻⁹ N·s/m'), 'tweezers: example facts'); }
  check(await page.isVisible('.otc .ot-fig1') && await page.isVisible('.otc .ot-fig2') && (await page.textContent('.otc .ot-parse')).startsWith('32,768 samples'), 'tweezers: charts and parse note');
  await page.selectOption('.otc .ot-m', 'plain'); await page.waitForTimeout(300);
  check((await big()).includes('467 Hz') && (await facts()).includes('3.67'), 'tweezers: plain Lorentzian is biased');
  await page.selectOption('.otc .ot-m', 'aliased'); await page.fill('.otc .ot-h', '1'); await page.waitForTimeout(300);
  check((await facts()).includes("Faxén") && (await big()).startsWith('Trap stiffness 0.0278'), 'tweezers: Faxén correction raises the drag');
  await page.fill('.otc .ot-h', ''); await page.selectOption('.otc .ot-L', '4096'); await page.selectOption('.otc .ot-b', '1'); await page.waitForTimeout(300);
  check((await facts()).includes('8 segments of 4096') && (await big()).startsWith('Trap stiffness 0.0199 ± 0.00038 pN/nm (corner frequency 377.2 Hz)'), 'tweezers: other segment length and no blocking');
  await page.selectOption('.otc .ot-L', '1024'); await page.selectOption('.otc .ot-b', '4'); await page.waitForTimeout(300);
  // The same record in volts (50 nm per volt), with a time column: β should come back near 50 nm/V.
  await page.evaluate(() => { const ta = document.querySelector('.otc .ot-in'); const v = ta.value.trim().split('\n').slice(1).map(Number); ta.value = 'time,x_V\n' + v.map((x, i) => `${(i / 10000).toFixed(6)},${(x / 50).toFixed(6)}`).join('\n'); ta.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.selectOption('.otc .ot-u', 'V'); await page.waitForTimeout(800);
  { const t = await facts(); const beta = +t.match(/sensitivity β([\d.]+) ±/)[1]; check((await page.inputValue('.otc .ot-fs')) === '10000' && beta > 45 && beta < 55 && t.includes('V²/s'), `tweezers: volts with a time column, β ${beta} nm/V`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.otc .ot-csv')]); const f = OUT + 'tw.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'frequency_Hz,psd_V2_per_Hz,fit,in_fit' && r.length === 128, 'tweezers: spectrum CSV'); }
  await page.selectOption('.otc .ot-u', 'nm'); await page.fill('.otc .ot-f2', '6000'); await page.waitForTimeout(300);
  check((await page.textContent('.otc .ot-err')).includes('half the sample rate') && await page.isHidden('.otc .ot-out'), 'tweezers: fit range above Nyquist message');
  await page.fill('.otc .ot-f2', '4000'); await page.fill('.otc .ot-d', '0'); await page.waitForTimeout(300);
  check((await page.textContent('.otc .ot-err')).includes('bead diameter'), 'tweezers: bad diameter message');
  await page.fill('.otc .ot-d', '1'); await page.fill('.otc .ot-in', '1\n2\n3'); await page.waitForTimeout(600);
  check((await page.textContent('.otc .ot-err')).includes('at least two segments'), 'tweezers: record too short message');
  writeFileSync(OUT + 'tw-in.csv', 'x_nm\n' + Array.from({ length: 4096 }, (_, i) => Math.sin(i * 0.7) * 10 + Math.cos(i * 0.31) * 7).join('\n'));
  await page.setInputFiles('.otc .dfb-in', OUT + 'tw-in.csv'); await page.waitForTimeout(800);
  check((await page.textContent('.otc .dfb-note')).includes('4,097 rows') && (await page.textContent('.otc .ot-parse')).startsWith('4,096 samples'), 'tweezers: open a file');
  await page.click('.otc .ot-ex'); await page.waitForTimeout(800);
  check((await big()) === 'Trap stiffness 0.0200 ± 0.00038 pN/nm (corner frequency 380 Hz)', 'tweezers: example button restores the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.otc .dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'tweezers-calibration.png', 'tweezers: image report'); }
};
