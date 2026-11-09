// #940 audio spectrum analyser: an audio file made here, and a fake microphone (an oscillator stream).
export const path = '/science/audio-spectrum-analyser/';
const wav = (rate, secs, parts) => {
  const n = Math.round(rate * secs), b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) { const v = parts.reduce((s, [a, f]) => s + a * Math.sin(2 * Math.PI * f * i / rate), 0); b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 32767))), 44 + i * 2); }
  return b;
};
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.asa ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/audio-spectrum-analyser/`); await page.waitForTimeout(500);
  check(await page.isHidden(R + '.as-out') && await page.isVisible(R + '.as-mic'), 'spectrum: waits for sound');
  await page.click(R + '.as-demo'); await page.waitForTimeout(600);
  check((await t('.as-big')) === 'Peak 999.9 Hz (B5 +21 cents), −6.0 dBFS' && (await t('.as-facts')).includes('Test sound (made up)') && (await t('.as-facts')).includes('42 frames averaged') && (await t('.as-facts')).includes('−9.0 dBFS') && (await t('.as-pk')).includes('3.1499 kHz−25.8G7'), 'spectrum: test sound worked example (999.9 Hz, −6.0 dBFS, 3.1499 kHz)');
  writeFileSync(OUT + 'tones.wav', wav(44100, 2, [[0.5, 1000], [0.05, 3150]]));
  await page.setInputFiles(R + '.as-file', OUT + 'tones.wav'); await page.waitForTimeout(1500);
  { const b = await t('.as-big'), f = Number(b.match(/Peak ([\d.]+) Hz/)?.[1]), l = Number(b.match(/, (−?[\d.]+) dBFS/)?.[1].replace('−', '-'));
    check(Math.abs(f - 1000) < 0.5 && Math.abs(l + 6.02) < 1.5 && b.includes('(B5 +21 cents)'), `spectrum: WAV file peak 1000 Hz, about −6 dBFS, B5 +21 cents (${b})`); }
  { const tb = await t('.as-pk'); const rows = await page.$$eval(R + '.as-pk tbody tr', (r) => r.map((x) => x.textContent)); check(rows.length >= 2 && /^23\.1[45]\d* kHz/.test(rows[1]) && rows[1].includes('G7'), `spectrum: second peak 3.15 kHz G7 (${rows[1]})`); void tb; }
  { const f = await t('.as-facts'); check(f.includes('tones.wav') && f.includes('2 s analysed at 44100') && f.includes('10.8 Hz') && f.includes('42 frames averaged') && f.includes('22.05 kHz'), 'spectrum: file facts (44.1 kHz kept, 10.8 Hz resolution, 42 frames)'); }
  { const f = await t('.as-facts'); const m = f.match(/Overall level(−?[\d.]+) dBFS/); check(m && Math.abs(Number(m[1].replace('−', '-')) - (10 * Math.log10((0.25 + 0.0025) / 2))) < 0.05, `spectrum: overall RMS level (${m?.[1]})`); }
  check((await t('.as-status')).includes('mono') && await page.isVisible(R + '.as-spec') && await page.isVisible(R + '.as-sg'), 'spectrum: status, spectrum and spectrogram');
  await page.selectOption(R + '.as-n', '16384'); await page.waitForTimeout(500);
  check((await t('.as-facts')).includes('2.69 Hz') && Math.abs(Number((await t('.as-big')).match(/Peak ([\d.]+) Hz/)[1]) - 1000) < 0.1, 'spectrum: 16384-point FFT, finer peak');
  await page.selectOption(R + '.as-w', 'blackman'); await page.selectOption(R + '.as-ax', 'lin'); await page.selectOption(R + '.as-floor', '-60'); await page.waitForTimeout(500);
  check((await t('.as-facts')).includes('Blackman window') && (await t('.as-big')).startsWith('Peak 1000'), 'spectrum: Blackman window, linear axis, −60 floor');
  await page.fill(R + '.as-a4', '432'); await page.waitForTimeout(300);
  check((await t('.as-big')).includes('C6 −47 cents'), 'spectrum: A4 = 432 Hz tuning: 1 kHz is C6 −47 cents');
  await page.fill(R + '.as-a4', '440'); await page.selectOption(R + '.as-n', '4096'); await page.selectOption(R + '.as-w', 'hann'); await page.selectOption(R + '.as-ax', 'log'); await page.selectOption(R + '.as-floor', '-100'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.as-csv')]); const f = OUT + 'spec.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 2050 && rows[0] === 'frequency_hz,level_dbfs' && rows[2].startsWith('10.7666,'), 'spectrum: CSV of 2049 bins'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `audio-spectrum.${fmt}`, `spectrum: ${fmt} download`); }
  // Not audio.
  writeFileSync(OUT + 'not-audio.wav', Buffer.from('this is not sound at all, just some text pretending to be a wave file'));
  await page.setInputFiles(R + '.as-file', OUT + 'not-audio.wav'); await page.waitForTimeout(800);
  check((await t('.as-err')).startsWith('Could not read not-audio.wav as sound'), 'spectrum: not-audio file message');
  // Microphone blocked by the site's permissions policy, then refused, then a fake microphone playing 440 Hz.
  await page.evaluate(() => { Object.defineProperty(document, 'permissionsPolicy', { configurable: true, value: { allowsFeature: () => false } }); });
  await page.click(R + '.as-mic'); await page.waitForTimeout(200);
  check((await t('.as-err')).includes('switched off for this site'), 'spectrum: microphone blocked message');
  await page.evaluate(() => { Object.defineProperty(document, 'permissionsPolicy', { configurable: true, value: { allowsFeature: () => true } }); navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('no', 'NotAllowedError'); }; });
  await page.click(R + '.as-mic'); await page.waitForTimeout(200);
  check((await t('.as-err')).startsWith('Microphone permission was refused'), 'spectrum: permission refused message');
  await page.evaluate(() => { navigator.mediaDevices.getUserMedia = async () => { const c = new AudioContext(); const o = c.createOscillator(), g = c.createGain(), d = c.createMediaStreamDestination(); o.frequency.value = 440; g.gain.value = 0.25; o.connect(g).connect(d); o.start(); await c.resume(); return d.stream; }; });
  await page.click(R + '.as-mic'); await page.waitForTimeout(2500);
  { const b = await t('.as-big'), f = Number(b.match(/Peak ([\d.]+) Hz/)?.[1]); check(Math.abs(f - 440) < 1 && b.includes('A4') && (await t('.as-facts')).includes('microphone') && await page.isVisible(R + '.as-stop'), `spectrum: live microphone finds 440 Hz A4 (${b})`); }
  await page.check(R + '.as-hold'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.as-csv')]); const f = OUT + 'live.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').split('\n')[0] === 'frequency_hz,level_dbfs,peak_hold_dbfs', 'spectrum: live CSV with peak hold'); }
  await page.click(R + '.as-freeze'); await page.waitForTimeout(200);
  { const a = await t('.as-facts'); await page.waitForTimeout(400); check(a.includes('(frozen)') && (await t('.as-freeze')) === 'Resume', 'spectrum: freeze holds the picture'); }
  await page.click(R + '.as-freeze');
  await page.click(R + '.as-stop'); await page.waitForTimeout(200);
  check((await t('.as-status')) === 'Microphone off.' && await page.isVisible(R + '.as-mic') && await page.isHidden(R + '.as-stop'), 'spectrum: stop switches the microphone off');
};
