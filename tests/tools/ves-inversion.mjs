// #883 resistivity sounding (VES) inversion
export const path = '/science/ves-inversion/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/ves-inversion/`); await page.waitForTimeout(700);
  const R = '.ves ', wait = () => page.waitForTimeout(450);
  check((await page.textContent(R + '.vs-big')) === '3 layers: 119, 22.6, 379 Ω·m; interfaces at 3.13, 13.6 m', 'ves: example inversion');
  { const f = await page.textContent(R + '.vs-facts'); check(f.includes('1.76 % RMS') && f.includes('0.491 S'), 'ves: misfit and conductance'); }
  { const t = await page.textContent(R + '.vs-ltab'); check(t.includes('118.6') && t.includes('×/÷ 1.08') && t.includes('13.64') && t.includes('half-space'), 'ves: layer table with error factors'); }
  { const t = await page.textContent(R + '.vs-tab'); check(t.includes('2.356') && t.includes('117.6') && t.includes('28270'), 'ves: K and apparent resistivity per reading'); }
  check(await page.isVisible(R + '.vs-fig') && await page.isVisible(R + '.vs-col2'), 'ves: sounding curve and model column');
  await page.selectOption(R + '.vs-n', '2'); await wait();
  { const b = await page.textContent(R + '.vs-big'); const rms = parseFloat((await page.textContent(R + '.vs-facts')).match(/([\d.]+) % RMS/)[1]); check(b.startsWith('2 layers:') && rms > 5, `ves: two layers fit worse (${b}, ${rms} %)`); }
  await page.selectOption(R + '.vs-n', '3');
  await page.fill(R + '.vs-r0', '120, 25, 400'); await page.fill(R + '.vs-h0', '3, 12'); await page.check(R + '.vs-fix'); await wait();
  { const f = await page.textContent(R + '.vs-facts'); check((await page.textContent(R + '.vs-big')) === '3 layers: 120, 25, 400 Ω·m; interfaces at 3, 15 m' && f.includes('forward model only'), 'ves: forward model of the true layers'); }
  await page.uncheck(R + '.vs-fix'); await wait();
  check((await page.textContent(R + '.vs-big')).startsWith('3 layers: 119, 22.6, 379'), 'ves: inversion from a typed starting model');
  await page.fill(R + '.vs-h0', '3'); await wait();
  check((await page.textContent(R + '.vs-err')).includes('give 3 starting resistivities and 2 thicknesses'), 'ves: bad starting model');
  await page.fill(R + '.vs-r0', ''); await page.fill(R + '.vs-h0', ''); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vs-csv')]); const f = OUT + 'ves.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 17 && rows[0] === 'spacing_m,mn2_m,k_m,rhoa_ohm_m,model_rhoa_ohm_m,misfit_pct' && rows[1].startsWith('1,0.5,2.356'), 'ves: CSV'); }
  // Wenner, apparent resistivities: a made-up two-layer sounding (from the exact image series: 100 over 10 ohm·m, h 5 m).
  await page.selectOption(R + '.vs-arr', 'wenner'); await page.selectOption(R + '.vs-col', 'rhoa'); await page.selectOption(R + '.vs-n', '2');
  const img = (a) => { const k = (10 - 100) / 110, P = (r) => { let t = 1; for (let n = 1; n < 400; n++) t += 2 * k ** n * r / Math.hypot(r, 10 * n); return 100 * t; }; return 2 * P(a) - P(2 * a); };
  await page.fill(R + '.vs-data', [1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 70, 100].map((a) => `${a}\t${img(a).toFixed(4)}`).join('\n')); await wait();
  { const b = await page.textContent(R + '.vs-big'); check(b === '2 layers: 100, 10 Ω·m; interfaces at 5 m' && (await page.textContent(R + '.vs-colh')).includes('spacing a'), `ves: Wenner two-layer recovered (${b})`); }
  await page.selectOption(R + '.vs-col', 'field'); await wait();
  check((await page.textContent(R + '.vs-err')).includes('Found 2 columns'), 'ves: Wenner field readings need 3 columns');
  await page.fill(R + '.vs-data', '1\t5\t0\n2\t3\t100\n3\t2\t100'); await wait();
  check((await page.textContent(R + '.vs-err')).includes('Row 1') && await page.isHidden(R + '.vs-out'), 'ves: zero current refused');
  await page.selectOption(R + '.vs-arr', 'schlumberger'); await page.fill(R + '.vs-data', '1\t2\t10\t100\n2\t0.5\t5\t100\n4\t0.5\t2\t100\n8\t0.5\t1\t100'); await wait();
  check((await page.textContent(R + '.vs-err')).includes('MN/2 must be above zero and smaller than AB/2'), 'ves: MN/2 larger than AB/2 refused');
};
