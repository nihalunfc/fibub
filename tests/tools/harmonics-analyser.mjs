// #422 instrument harmonics analyser
export const path = '/science/harmonics-analyser/';
// A 16-bit mono WAV of n f0 √(1 + B n²) partials with amplitude a(n), written by the test.
export const wav = (fs, secs, parts, gain = 0.3) => {
  const N = Math.round(fs * secs), b = Buffer.alloc(44 + 2 * N);
  b.write('RIFF', 0); b.writeUInt32LE(36 + 2 * N, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(fs, 24); b.writeUInt32LE(2 * fs, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(2 * N, 40);
  for (let i = 0; i < N; i++) { let v = 0; for (const [f, a] of parts) v += a * Math.sin(2 * Math.PI * f * i / fs); b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(32767 * gain * v))), 44 + 2 * i); }
  return b;
};
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.hma ', big = () => page.textContent(R + '.hm-big'), facts = () => page.textContent(R + '.hm-facts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(900);
  check((await big()) === 'Fundamental 109.99 Hz (A2 −0.1 ¢)' && await page.isHidden(R + '.hm-err'), 'harmonics: example fundamental, no clipping warning');
  { const f = await facts(); check(f.includes('Inharmonicity B3.01e−4') && f.includes('Harmonics found16 of 16') && f.includes('Frames averaged4') && f.includes('2.69 Hz per bin'), `harmonics: example B, harmonics, frames (${f.slice(0, 200)})`); }
  { const t = await page.textContent(R + '.hm-tab'); check(t.includes('888.42') && t.includes('+16.6') && t.includes('+64.2') && t.includes('−28.6') && await page.isVisible(R + '.hm-fig') && await page.isVisible(R + '.hm-fig2'), 'harmonics: table and both charts'); }
  // Settings.
  await page.selectOption(R + '.hm-win', 'blackman'); await page.waitForTimeout(300);
  check(/^Fundamental (109.9\d|110.0\d) Hz \(A2/.test(await big()), 'harmonics: Blackman window');
  await page.selectOption(R + '.hm-n', '4096'); await page.waitForTimeout(300);
  check((await facts()).includes('10.8 Hz per bin') && (await facts()).includes('Frames averaged20'), 'harmonics: shorter FFT, more frames');
  await page.selectOption(R + '.hm-n', '16384'); await page.selectOption(R + '.hm-win', 'hann');
  await page.fill(R + '.hm-h', '30'); await page.waitForTimeout(500);
  check((await facts()).includes('of 30'), 'harmonics: 30 harmonics');
  await page.fill(R + '.hm-f0', '55'); await page.waitForTimeout(500);
  check((await facts()).includes('fitted near the value you typed') && (await page.textContent(R + '.hm-tab')).includes('not found'), 'harmonics: typed fundamental (an octave low) leaves odd numbers empty');
  await page.fill(R + '.hm-f0', ''); await page.fill(R + '.hm-h', '0'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hm-err')).includes('whole number from 1 to 60') && await page.isHidden(R + '.hm-out'), 'harmonics: bad settings message');
  await page.fill(R + '.hm-h', '16'); await page.fill(R + '.hm-t0', '9'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hm-err')).includes('the start must be from 0 to 2.00 s'), 'harmonics: start past the end');
  await page.fill(R + '.hm-t0', '0.1'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hm-csv')]); const f = OUT + 'harm.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 17 && rows[0].startsWith('n,n_times_f0_hz') && rows[8].startsWith('8,879.93'), 'harmonics: harmonics CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hm-scsv')]); const f = OUT + 'spec.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').trim().split('\n').length === 8194, 'harmonics: spectrum CSV, 8193 bins'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'harmonics: PDF'); }
  // A WAV file: G3 196 Hz, B = 0.0002, 12 partials of 1/n, at 48 kHz.
  const parts = Array.from({ length: 12 }, (_, i) => [(i + 1) * 196 * Math.sqrt(1 + 0.0002 * (i + 1) ** 2), 0.5 / (i + 1)]);
  writeFileSync(OUT + 'g3.wav', wav(48000, 1.5, parts));
  await page.setInputFiles(R + '.hm-file', OUT + 'g3.wav'); await page.waitForTimeout(1500);
  check((await page.textContent(R + '.hm-info')).startsWith('g3.wav: 1.50 s at'), 'harmonics: WAV file decoded');
  { const b = await big(), f0 = Number(b.match(/Fundamental ([\d.]+)/)[1]), B = Number((await facts()).match(/Inharmonicity B([\d.]+)e−4/)[1]); check(Math.abs(f0 - 196) < 0.1 && Math.abs(B - 2) < 0.1 && b.includes('G3'), `harmonics: WAV f0 196 Hz and B 2e-4 recovered (${b}, B ${B}e-4)`); }
  writeFileSync(OUT + 'loud.wav', wav(44100, 1, [[440, 1]], 2));
  await page.setInputFiles(R + '.hm-file', OUT + 'loud.wav'); await page.waitForTimeout(1200);
  check((await page.textContent(R + '.hm-err')).includes('may be clipped') && (await big()).includes('440.0'), 'harmonics: clipped file warning');
  writeFileSync(OUT + 'silent.wav', wav(44100, 1, []));
  await page.setInputFiles(R + '.hm-file', OUT + 'silent.wav'); await page.waitForTimeout(1200);
  check((await page.textContent(R + '.hm-err')).includes('silent'), 'harmonics: silent file message');
  writeFileSync(OUT + 'junk.wav', Buffer.from('not audio at all'));
  await page.setInputFiles(R + '.hm-file', OUT + 'junk.wav'); await page.waitForTimeout(1200);
  check((await page.textContent(R + '.hm-err')).includes('could not be decoded'), 'harmonics: undecodable file message');
  await page.click(R + '.hm-rec'); await page.waitForTimeout(800);
  check((await page.textContent(R + '.hm-err')).includes('microphone is not available'), 'harmonics: microphone blocked message');
  await page.click(R + '.hm-ex'); await page.waitForTimeout(500);
  check((await big()) === 'Fundamental 109.99 Hz (A2 −0.1 ¢)', 'harmonics: example button');
};
