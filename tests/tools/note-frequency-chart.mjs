// #T1038 Note chart
export const path = '/everyday/note-frequency-chart/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/note-frequency-chart/`); await page.waitForTimeout(300);
  const R = '.nfc ';
  const row = (m) => page.$$eval(`${R}tr[data-midi="${m}"] td`, (l) => l.map((x) => x.textContent.replace(/​/g, '')));
  let a = await row(69), c4 = await row(60);
  check(a[1] === '69' && a[2] === '440.00' && a[5] === '49', `note-frequency-chart: A4 = MIDI 69, 440.00 Hz, key 49 (${a})`);
  check(c4[0] === 'C4' && c4[2] === '261.63' && c4[3] === '3.822' && c4[4] === '1.311' && c4[5] === '40', `note-frequency-chart: C4 row (${c4})`);
  await page.fill(R + '.nfc-q', '261.6 Hz');
  const t = await page.textContent(R + '.nfc-res');
  check(t.includes('C4') && t.includes('0.2 cents flat'), `note-frequency-chart: 261.6 Hz search (${t})`);
  await page.fill(R + '.nfc-q', 'A4');
  check((await page.textContent(R + '.nfc-res')).includes('MIDI 69, 440.00 Hz'), 'note-frequency-chart: A4 search');
  await page.fill(R + '.nfc-q', '60');
  check((await page.textContent(R + '.nfc-res')).startsWith('C4: MIDI 60'), 'note-frequency-chart: MIDI 60 search');
  await page.fill(R + '.nfc-a4', '442');
  check((await row(60))[2] === '262.81', `note-frequency-chart: A4 = 442 gives C4 262.81 (${(await row(60))[2]})`);
  await page.fill(R + '.nfc-a4', '440');
  await page.selectOption(R + '.nfc-conv', 'midi');
  check((await row(60))[0] === 'C3', 'note-frequency-chart: MIDI convention names middle C as C3');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.nfc-csv')]); const f = OUT + 'nfc.csv'; await d.saveAs(f);
  const lines = readFileSync(f, 'utf8').trim().split(/\r?\n/);
  check(lines.length === 129 && lines[61].startsWith('60,C3,C3,C3=60,261.6256'), `note-frequency-chart: CSV (${lines.length} lines; ${lines[61]})`);
};
