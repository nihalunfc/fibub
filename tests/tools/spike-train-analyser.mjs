// #348 Spike train analyser
export const path = '/science/spike-train-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const P = '.sk ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  const facts = () => page.textContent(P + '.sk-facts');
  { const f = await facts(); check(f.includes('Trains20') && f.includes('Spikes in window508') && f.includes('12.70 ± 2.48 spikes/s') && f.includes('Fano factor (counts)0.971') && f.includes('(pooled)1.63') && f.includes('ISIs under 2 ms0 of 488'), `spikes: example summary (${f})`); }
  check((await page.textContent(P + '.sk-tab tbody tr')) === 'Trial 12512.5077.841.48', 'spikes: trial 1 row');
  check(await page.isVisible(P + '.sk-ras') && await page.isVisible(P + '.sk-psth') && await page.isVisible(P + '.sk-isi') && await page.isVisible(P + '.sk-acg'), 'spikes: four figures');
  // Window to the response.
  await page.fill(P + '.sk-t0', '0.5'); await page.fill(P + '.sk-t1', '1'); await page.waitForTimeout(500);
  { const f = await facts(); check(f.includes('36.80') && f.includes('Fano factor (counts)0.677') && f.includes('(pooled)0.863'), `spikes: response window 0.5–1 s (${f})`); }
  // PSTH CSV with 25 ms bins over 0.5–1 s.
  await page.fill(P + '.sk-pb', '25'); await page.waitForTimeout(500);
  { await page.locator(P + '.sk-pcsv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.sk-pcsv')]); const f = OUT + 'psth.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); const sum = r.slice(1).reduce((s, l) => s + Number(l.split(',')[2]), 0); check(r.length === 21 && r[0] === 'bin_start_s,bin_end_s,spikes,rate_per_s' && r[1].startsWith('0.5,0.525,') && sum === 368, `spikes: PSTH CSV, 20 bins, 368 spikes (${sum})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.sk-csv')]); const f = OUT + 'trains.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 21 && r[0] === 'train,spikes,rate_per_s,mean_isi_ms,cv_isi' && r[1].startsWith('Trial 1,'), 'spikes: trains CSV'); }
  { await page.locator(P + '.dl [data-f=png]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=png]')]); const f = OUT + 'sk.png'; await d.saveAs(f); check(readFileSync(f).length > 30000, 'spikes: PNG report'); }
  // Other options.
  for (const [c, v] of [['.sk-ib', '5'], ['.sk-im', '200'], ['.sk-ab', '1'], ['.sk-al', '20'], ['.sk-stim', '']]) await page.fill(P + c, v);
  await page.fill(P + '.sk-rf', '20'); await page.waitForTimeout(500);
  check(/ISIs under 20 ms[1-9]\d* of 3\d\d/.test(await facts()), 'spikes: refractory 20 ms flags intervals');
  // Layouts and ms.
  await page.fill(P + '.sk-in', 'unit,time\nA,10\nA,30\nB,15\nA,70\nB,45'); await page.selectOption(P + '.sk-lay', 'pairs'); await page.selectOption(P + '.sk-unit', 'ms'); await page.waitForTimeout(500);
  { const f = await facts(); check(f.includes('Trains2') && f.includes('Spikes in window5') && (await page.inputValue(P + '.sk-t1')) === '0.1' && (await page.textContent(P + '.sk-tab')).includes('A330'), `spikes: two-column layout in ms (${f})`); }
  await page.fill(P + '.sk-in', 'c1\tc2\n0.1\t0.2\n0.3\t\n0.6\t'); await page.selectOption(P + '.sk-lay', 'columns'); await page.selectOption(P + '.sk-unit', 's'); await page.waitForTimeout(500);
  check((await facts()).includes('Trains2') && (await page.textContent(P + '.sk-tab')).includes('c13'), 'spikes: column layout');
  await page.selectOption(P + '.sk-lay', 'lines'); await page.fill(P + '.sk-in', '0.1 0.2 0.35 0.5'); await page.waitForTimeout(500);
  check((await facts()).includes('needs 2+ trains'), 'spikes: one train, no Fano factor');
  // Bad input.
  await page.fill(P + '.sk-in', '0.1 0.2 abc'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.sk-err')).includes('"abc" is not a number') && await page.isHidden(P + '.sk-out'), 'spikes: bad number message');
  await page.fill(P + '.sk-in', '0.1 0.2 0.3'); await page.waitForTimeout(400); await page.fill(P + '.sk-t1', '-1'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.sk-err')).includes('window must end after'), 'spikes: bad window message');
  await page.fill(P + '.sk-t1', '1'); await page.fill(P + '.sk-pb', '0'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.sk-err')).includes('positive numbers'), 'spikes: bad bin message');
  // File upload.
  writeFileSync(OUT + 'spikes.csv', 'trial,time\n1,0.1\n1,0.2\n2,0.15\n2,0.4\n3,0.3');
  await page.fill(P + '.sk-pb', '50'); await page.selectOption(P + '.sk-lay', 'pairs'); await page.setInputFiles(P + '.dfb-in', OUT + 'spikes.csv'); await page.waitForTimeout(700);
  check((await facts()).includes('Trains3') && (await page.textContent(P + '.sk-tab')).includes('Train 1'), 'spikes: CSV file opened');
};
