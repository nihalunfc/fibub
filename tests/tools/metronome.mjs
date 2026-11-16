// #T961 Metronome
export const path = '/everyday/metronome/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/metronome/`); await page.waitForTimeout(300);
  const R = '.mt ';
  check((await page.textContent(R + '.mt-name')) === 'Andante' && (await page.$$(R + '.mt-dots span')).length === 4, 'metronome: 100 BPM Andante, 4 beats');
  await page.fill(R + '.mt-bpm-n', '120'); await page.dispatchEvent(R + '.mt-bpm-n', 'change');
  check((await page.textContent(R + '.mt-bpm-out')) === '120' && (await page.textContent(R + '.mt-name')) === 'Allegro', 'metronome: typed BPM');
  await page.click(R + '.mt-up');
  check((await page.inputValue(R + '.mt-bpm')) === '121', 'metronome: +1 button');
  await page.click(R + '.mt-go'); await page.waitForTimeout(1200);
  check((await page.textContent(R + '.mt-go')) === 'Stop' && (await page.$$(R + '.mt-dots span.on')).length === 1, 'metronome: runs and lights a beat');
  await page.click(R + '.mt-go');
  await page.selectOption(R + '.mt-beats', '3'); await page.fill(R + '.mt-bpm-n', '100'); await page.dispatchEvent(R + '.mt-bpm-n', 'change'); await page.fill(R + '.mt-bars', '2');
  check((await page.textContent(R + '.mt-len')).startsWith('2 bars of 3 at 100 BPM = 3.6 s'), `metronome: track length (${await page.textContent(R + '.mt-len')})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mt-save')]); const f = OUT + 'mt.wav'; await d.saveAs(f); const b = readFileSync(f);
  check(d.suggestedFilename() === 'click-100bpm-3beats-2bars.wav' && b.readUInt32LE(40) === 3.6 * 48000 * 2, `metronome: click track WAV is 3.6 s (${b.readUInt32LE(40)})`);
};
