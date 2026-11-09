// #347 Hodgkin-Huxley simulator
export const path = '/science/hodgkin-huxley-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.hhs ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/hodgkin-huxley-simulator/`); await page.waitForTimeout(800);
  check((await t('.hh-big')) === '3 spikes, first at 6.901 ms, peak 40.3 mV', 'hh: example step');
  { const f = await t('.hh-facts'); check(f.includes('6.901, 21.82, 36.47 ms') && f.includes('67.6 Hz'), 'hh: spike times and rate'); }
  check(await page.isVisible(R + '.hh-v') && await page.isVisible(R + '.hh-g') && (await page.textContent('main')).includes('not for clinical use'), 'hh: plots and study note');
  await page.fill(R + '.hh-T', '16.3'); await page.waitForTimeout(600);
  check((await t('.hh-big')).startsWith('7 spikes, first at 6.531 ms'), 'hh: temperature 16.3 °C');
  await page.fill(R + '.hh-T', '6.3');
  await page.click(R + '.hh-kind [data-k=train]'); await page.waitForTimeout(600);
  check((await t('.hh-big')).startsWith('3 spikes, first at 6.578 ms') && (await t('.hh-facts')).includes('26.50, 46.50'), 'hh: pulse train');
  await page.fill(R + '.hh-freq', '2000'); await page.waitForTimeout(600);
  check((await t('.hh-err')).includes('frequency'), 'hh: bad frequency message');
  await page.fill(R + '.hh-freq', '50');
  await page.click(R + '.hh-kind [data-k=step]'); await page.waitForTimeout(400);
  await page.click(R + '.hh-more summary'); await page.fill(R + '.hh-gna', '0'); await page.waitForTimeout(600);
  check((await t('.hh-big')).startsWith('No spike'), 'hh: sodium block (TTX)');
  await page.fill(R + '.hh-gna', '120'); await page.fill(R + '.hh-amp', '-10'); await page.fill(R + '.hh-end', '80'); await page.waitForTimeout(600);
  check((await t('.hh-big')).startsWith('1 spike, first at 50.73 ms'), 'hh: anode break spike after a hyperpolarising step');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hh-csv')]); const f = OUT + 'hh.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 't (ms),V (mV),m,h,n,I (uA/cm2)' && r.length > 2000 && r[1].startsWith('0,-65,'), 'hh: traces CSV'); }
  await page.fill(R + '.hh-amp', '10'); await page.fill(R + '.hh-end', '60');
  await page.locator(R + '.hh-thr').scrollIntoViewIfNeeded(); await page.click(R + '.hh-thr'); await page.waitForTimeout(1500);
  check((await t('.hh-thrv')) === 'Threshold for a 1 ms pulse: 6.911 µA/cm² (6.911 nC/cm²)', 'hh: threshold');
  await page.fill(R + '.hh-fmax', '20'); await page.fill(R + '.hh-fn', '3'); await page.click(R + '.hh-fi'); await page.waitForTimeout(2500);
  { const s = await t('.hh-ftab'); check(s.includes('70') && s.includes('87.5') && await page.isVisible(R + '.hh-fig'), 'hh: f–I curve 70 and 87.5 Hz'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hh-fcsv')]); const f = OUT + 'hhfi.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').trim() === 'I (uA/cm2),rate (Hz)\n0,0\n10,70\n20,87.5', 'hh: f–I CSV'); }
  await page.fill(R + '.hh-fn', '1'); await page.click(R + '.hh-fi'); await page.waitForTimeout(200);
  check((await t('.hh-ferr')).includes('number of points'), 'hh: bad points message');
};
