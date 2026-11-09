// #423 rhythm and tempo detector
import { wav } from './harmonics-analyser.mjs';
export const path = '/science/tempo-detector/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.tpd ', big = () => page.textContent(R + '.td-big'), facts = () => page.textContent(R + '.td-facts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(1200);
  check((await big()) === 'Tempo 104.0 BPM', 'tempo: example 104 BPM');
  { const f = await facts(); check(f.includes('Beats placed28') && f.includes('Mean beat-to-beat577 ms') && f.includes('Spread of beat gaps6 ms') && f.includes('Onsets found55'), `tempo: example beats and onsets (${f.slice(0, 160)})`); }
  { const t = await page.textContent(R + '.td-tab'); check(t.includes('69.3') && t.includes('2/3') && t.includes('In use') && await page.isVisible(R + '.td-fig') && await page.isVisible(R + '.td-fig2'), 'tempo: candidates table and charts'); }
  await page.selectOption(R + '.td-thr', '0.2'); await page.waitForTimeout(400);
  check(Number((await facts()).match(/Onsets found(\d+)/)[1]) <= 55, 'tempo: low sensitivity');
  await page.selectOption(R + '.td-thr', '0.1');
  await page.fill(R + '.td-max', '220'); await page.waitForTimeout(700);
  check((await big()) === 'Tempo 207.9 BPM' && (await page.textContent(R + '.td-tab')).includes('half'), 'tempo: wider range picks the eighth-note pulse');
  await page.locator(R + '.td-tab button:not([disabled])').first().scrollIntoViewIfNeeded(); await page.click(R + '.td-tab tr:nth-child(3) button'); await page.waitForTimeout(400);
  check((await big()) === 'Tempo 104.0 BPM (your choice)' && (await facts()).includes('Beats placed28'), 'tempo: Use another candidate');
  await page.fill(R + '.td-max', '50'); await page.waitForTimeout(700);
  check((await page.textContent(R + '.td-err')).includes('tempo range') && await page.isHidden(R + '.td-out'), 'tempo: bad range message');
  await page.fill(R + '.td-max', '200'); await page.fill(R + '.td-t0', '14'); await page.waitForTimeout(700);
  check((await page.textContent(R + '.td-err')).includes('give at least 4 beats'), 'tempo: section too short');
  await page.fill(R + '.td-t0', '4'); await page.fill(R + '.td-len', '8'); await page.waitForTimeout(700);
  { const f = await facts(); check((await big()) === 'Tempo 104.0 BPM' && f.includes('8.0 s from 4.0 s'), 'tempo: a section of the sound'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.td-bcsv')]); const f = OUT + 'beats.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); const t1 = Number(rows[1].split(',')[1]); check(rows[0] === 'beat,time_s' && rows.length >= 13 && t1 >= 4 && Math.abs(((t1 - 0.25) / (60 / 104)) - Math.round((t1 - 0.25) / (60 / 104))) < 0.03, 'tempo: beat CSV in file time, on the clicks'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.td-ocsv')]); const f = OUT + 'onsets.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'time_s,strength' && rows.length > 20, 'tempo: onset CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'tempo: Word report'); }
  // A WAV click track at 132 BPM (decaying 1 kHz bursts) made by the test.
  const fs = 22050, secs = 12, P = 60 / 132, N = fs * secs, sig = new Float64Array(N);
  for (let t = 0.3; t < secs - 0.1; t += P) { const s = Math.round(t * fs); for (let i = 0; i < 600 && s + i < N; i++) sig[s + i] += Math.exp(-i / 90) * Math.sin(2 * Math.PI * 1000 * i / fs); }
  const parts = []; // write the samples directly
  const b = wav(fs, secs, parts); for (let i = 0; i < N; i++) b.writeInt16LE(Math.round(20000 * sig[i]), 44 + 2 * i);
  writeFileSync(OUT + 'click132.wav', b);
  await page.setInputFiles(R + '.td-file', OUT + 'click132.wav'); await page.waitForTimeout(1500);
  check((await page.textContent(R + '.td-info')).startsWith('click132.wav: 12.0 s') && /^Tempo 13[12]\.\d BPM$/.test(await big()) && Math.abs(Number((await big()).match(/[\d.]+/)[0]) - 132) < 0.3, `tempo: WAV click track at 132 BPM (${await big()})`);
  writeFileSync(OUT + 'quiet.wav', wav(22050, 6, []));
  await page.setInputFiles(R + '.td-file', OUT + 'quiet.wav'); await page.waitForTimeout(1200);
  check((await page.textContent(R + '.td-err')).includes('No steady pulse'), 'tempo: silent file message');
  writeFileSync(OUT + 'bad.mp3', Buffer.from('nope'));
  await page.setInputFiles(R + '.td-file', OUT + 'bad.mp3'); await page.waitForTimeout(1000);
  check((await page.textContent(R + '.td-err')).includes('could not be decoded'), 'tempo: undecodable file message');
  await page.click(R + '.td-ex'); await page.waitForTimeout(800);
  check((await big()) === 'Tempo 104.0 BPM', 'tempo: example button');
};
