// #681 EMG envelope and fatigue analyser
export const path = '/science/emg-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/emg-analyser/`); await page.waitForTimeout(1500);
  const big = () => page.textContent('.emga .em-big'), facts = () => page.textContent('.emga .em-facts'), err = () => page.textContent('.emga .em-err');
  const wait = () => page.waitForTimeout(700);
  const EX = '5 bursts · median frequency −1.42 Hz/s (−58.9 % per minute)';
  check((await big()) === EX, 'emg: example bursts and median frequency slope');
  { const f = await facts(); check(f.includes('35 of 63') && f.includes('144.5 → 106.2 Hz') && f.includes('R² = 0.704') && f.includes('slope −1.239') && f.includes('Threshold0.0115 mV'), 'emg: example facts'); }
  { const t = await page.textContent('.emga .em-tab'); check(t.includes('1.982') && t.includes('25.978') && t.includes('30.018') && (await page.$$('.emga .em-tab tr')).length === 6, 'emg: burst table'); }
  check(await page.isVisible('.emga .em-sig') && await page.isVisible('.emga .em-fat'), 'emg: both figures shown');
  // Low-pass envelope.
  await page.selectOption('.emga .em-env', 'lp'); await wait();
  check((await page.textContent('.emga .em-epl')) === 'Low-pass cut-off (Hz)' && (await page.inputValue('.emga .em-ep')) === '6' && (await big()).startsWith('5 bursts'), 'emg: low-pass envelope also finds 5 bursts');
  await page.selectOption('.emga .em-env', 'rms'); await wait();
  // All windows, other segment, step.
  await page.click('.emga .em-act'); await wait();
  check((await facts()).includes('63 of 63') && (await big()) !== EX, 'emg: all windows used');
  await page.click('.emga .em-act'); await page.selectOption('.emga .em-seg', '512'); await page.fill('.emga .em-step', '0.25'); await wait();
  check((await facts()).includes('Windows used') && (await big()).startsWith('5 bursts · median frequency −'), 'emg: 512 segment and 0.25 s step still show a falling median frequency');
  await page.selectOption('.emga .em-seg', '256'); await page.fill('.emga .em-step', '0.5'); await page.fill('.emga .em-k', '1000'); await wait();
  check((await big()) === '0 bursts · median frequency trend needs 3 or more windows' && (await facts()).includes('none above the threshold'), 'emg: a threshold above every burst finds none and says so');
  await page.fill('.emga .em-k', '3'); await page.selectOption('.emga .em-notch', '50'); await wait();
  check((await big()).startsWith('5 bursts'), 'emg: 50 Hz notch on');
  await page.selectOption('.emga .em-notch', '0'); await wait();
  check((await big()) === EX, 'emg: back to the example result');
  // CSV downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.emga .em-bcsv')]); const f = OUT + 'emg-b.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0].startsWith('#,Onset (s),Offset (s)') && rows[1].startsWith('1,1.982,6.022'), 'emg: bursts CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.emga .em-wcsv')]); const f = OUT + 'emg-w.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 64 && rows[0].startsWith('window centre (s),mean frequency') && rows.filter((r) => r.endsWith(',yes,yes')).length === 35, 'emg: windows CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.emga .dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'emg-analysis.pdf', 'emg: report PDF download'); }
  // A time column at 2000 Hz (each sample repeated), opened as a file: same bursts.
  { const vals = (await page.inputValue('.emga .em-data')).trim().split('\n').slice(1);
    writeFileSync(OUT + 'emg-time.csv', 'time,ch1\n' + vals.flatMap((v, i) => [`${(i / 1000).toFixed(4)},${v}`, `${(i / 1000 + 0.0005).toFixed(4)},${v}`]).join('\n')); }
  await page.selectOption('.emga .em-fmt', 'tv'); await page.setInputFiles('.emga .dfb-in', OUT + 'emg-time.csv'); await page.waitForTimeout(2500);
  check((await facts()).includes('64,000 samples at 2000 Hz (from the time column)') && (await big()).startsWith('5 bursts'), 'emg: time column, opened as a file');
  // Bad input.
  await page.selectOption('.emga .em-fmt', 'v'); await page.click('.emga .em-ex'); await wait();
  await page.fill('.emga .em-lp', '600'); await wait();
  check((await err()).includes('below half the sample rate') && await page.isHidden('.emga .em-out'), 'emg: low-pass above Nyquist');
  await page.fill('.emga .em-lp', '450'); await page.fill('.emga .em-b0', '5'); await page.fill('.emga .em-b1', '2'); await wait();
  check((await err()).includes('rest stretch'), 'emg: rest stretch backwards');
  await page.fill('.emga .em-b0', '0'); await page.fill('.emga .em-b1', '1.5'); await page.fill('.emga .em-win', '0.1'); await wait();
  check((await err()).includes('at least 256 samples'), 'emg: window shorter than a segment');
  await page.fill('.emga .em-win', '1'); await page.fill('.emga .em-fs', ''); await wait();
  check((await err()).includes('Give the sample rate'), 'emg: missing sample rate');
  await page.fill('.emga .em-fs', '1000'); await page.fill('.emga .em-data', '1\n2\n3'); await wait();
  check((await err()).includes('at least 1 second'), 'emg: too short');
  await page.click('.emga .em-ex'); await wait();
  check((await big()) === EX, 'emg: example button restores the example');
};
