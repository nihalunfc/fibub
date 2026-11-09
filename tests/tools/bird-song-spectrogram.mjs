// #318 Bird song spectrogram
import { encodeWav16 } from '../../src/lib/sci/spectro.ts';
export const path = '/science/bird-song-spectrogram/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const P = '.bs ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  const facts = () => page.textContent(P + '.bs-facts'), rows = () => page.$$eval(P + '.bs-notes tbody tr', (r) => r.length);
  { const r = await page.textContent(P + '.bs-res'); check((await page.textContent(P + '.bs-info')).includes('Made-up example') && r.includes('frequency step 43.07 Hz, time step 5.8'), `spectrogram: example loaded, resolution line (${r})`); }
  check((await facts()).includes('Notes10') && (await rows()) === 10, `spectrogram: 10 notes in the example (${await facts()})`);
  { const t = await page.textContent(P + '.bs-notes'); check(t.includes('163') && t.includes('46.4') && t.includes('4.005'), 'spectrogram: note lengths 163 and 46.4 ms, trill at 4.005 kHz'); }
  // Typed selection: only the first whistle.
  await page.fill(P + '.bs-s0', '0.15'); await page.fill(P + '.bs-s1', '0.4'); await page.fill(P + '.bs-sf0', '2'); await page.fill(P + '.bs-sf1', '7'); await page.waitForTimeout(500);
  { const f = await facts(); check(f.includes('Notes1') && /Peak frequency[345]\.\d+ kHz/.test(f), `spectrogram: one whistle selected (${f})`); }
  // Bandwidth level changes the bandwidth.
  const bw1 = await facts(); await page.fill(P + '.bs-bw', '3'); await page.waitForTimeout(500);
  check((await facts()).includes('Bandwidth (−3 dB)') && (await facts()) !== bw1, 'spectrogram: bandwidth level option');
  // Note options on everything.
  await page.click(P + '.bs-all'); await page.waitForTimeout(400);
  await page.fill(P + '.bs-mn', '100'); await page.waitForTimeout(500);
  check((await rows()) === 4, 'spectrogram: shortest note 100 ms drops the trill');
  await page.fill(P + '.bs-mn', '10'); await page.fill(P + '.bs-mg', '40'); await page.waitForTimeout(500);
  check((await rows()) === 5, 'spectrogram: joining gaps under 40 ms merges the trill');
  await page.fill(P + '.bs-mg', '10'); await page.fill(P + '.bs-nt', '3'); await page.waitForTimeout(500);
  check((await facts()).includes('Notes'), 'spectrogram: note threshold option');
  await page.fill(P + '.bs-nt', '20'); await page.waitForTimeout(400);
  // FFT size 256: sharper timing.
  await page.selectOption(P + '.bs-nfft', '256'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.bs-res')).includes('frequency step 86.13 Hz') && (await rows()) === 10, 'spectrogram: FFT 256');
  { const t = await page.$$eval(P + '.bs-notes tbody tr td:nth-child(4)', (c) => c.map((x) => Number(x.textContent))); check(t[0] < 163 && t[0] >= 150, `spectrogram: FFT 256 whistle closer to 150 ms (${t[0]})`); }
  await page.selectOption(P + '.bs-win', 'blackman'); await page.selectOption(P + '.bs-ov', '0.5'); await page.waitForTimeout(500);
  { const r = await page.textContent(P + '.bs-res'); check(r.includes('time step 5.8') && (await rows()) >= 9, `spectrogram: Blackman window, 50 % overlap (${r}; ${await rows()} notes)`); }
  await page.selectOption(P + '.bs-win', 'hamming'); await page.selectOption(P + '.bs-ov', '0'); await page.waitForTimeout(400);
  await page.selectOption(P + '.bs-win', 'rect'); await page.selectOption(P + '.bs-ov', '0.875'); await page.waitForTimeout(400);
  check(await page.isVisible(P + '.bs-fig') && (await page.textContent(P + '.bs-res')).includes('time step 1.45 ms'), 'spectrogram: Hamming, rectangular, 87.5 % overlap');
  await page.selectOption(P + '.bs-nfft', '512'); await page.selectOption(P + '.bs-win', 'hann'); await page.selectOption(P + '.bs-ov', '0.75');
  await page.selectOption(P + '.bs-cmap', 'colour'); await page.waitForTimeout(400);
  { const px = await page.evaluate(() => { const c = document.querySelector('.bs .bs-fig'); const d = c.getContext('2d').getImageData(c.width / 2, c.height / 2, 1, 1).data; return [...d]; }); check(px[0] !== px[1] || px[1] !== px[2], `spectrogram: colour map draws colours (${px})`); }
  await page.locator(P + '.bs-dr').fill('30'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.bs-drv')).startsWith('30 dB'), 'spectrogram: contrast slider');
  // Frequency range and view.
  await page.fill(P + '.bs-f0', '2'); await page.fill(P + '.bs-f1', '6'); await page.fill(P + '.bs-v0', '1.2'); await page.waitForTimeout(600);
  { const v = [await page.inputValue(P + '.bs-s0'), await page.inputValue(P + '.bs-sf0'), await page.inputValue(P + '.bs-sf1')].map(Number); check(v[0] > 1.19 && v[0] < 1.22 && v[1] >= 2 && v[1] < 2.05 && v[2] <= 6 && v[2] > 5.95 && (await rows()) === 6, `spectrogram: view 1.2–2 s and 2–6 kHz (${v}, ${await rows()} notes)`); }
  // Drag a box on the picture.
  await page.locator(P + '.bs-fig').scrollIntoViewIfNeeded();
  { const b = await page.locator(P + '.bs-fig').boundingBox(); await page.mouse.move(b.x + b.width * 0.15, b.y + b.height * 0.1); await page.mouse.down(); await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.7, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(400);
    const s0 = Number(await page.inputValue(P + '.bs-s0')), s1 = Number(await page.inputValue(P + '.bs-s1')); check(s0 > 1.2 && s1 < 1.7 && s1 > s0 && (await rows()) >= 2 && (await rows()) < 6, `spectrogram: drag selects part of the trill (${s0}–${s1})`); }
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.bs-csv')]); const f = OUT + 'bs-notes.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'note,start_s,end_s,duration_ms,peak_kHz,start_kHz,end_kHz' && r.length >= 3 && Math.abs(Number(r[1].split(',')[4]) - 4) < 0.05, 'spectrogram: notes CSV'); }
  { await page.locator(P + '.dl [data-f=png]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=png]')]); const f = OUT + 'bs.png'; await d.saveAs(f); const b = readFileSync(f); check(b.length > 20000 && b[1] === 0x50 && d.suggestedFilename().endsWith('-spectrogram.png'), 'spectrogram: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=pdf]')]); const f = OUT + 'bs.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'spectrogram: PDF report'); }
  // Bad inputs.
  await page.fill(P + '.bs-sf1', '1'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.bs-serr')).includes('low frequency below the high'), 'spectrogram: bad selection message');
  await page.fill(P + '.bs-v1', '1.0'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.bs-err')).includes('"Show to" must be later') && await page.isHidden(P + '.bs-out'), 'spectrogram: bad view message');
  writeFileSync(OUT + 'notwav.wav', 'ID3 this is an mp3');
  await page.setInputFiles(P + '.bs-file', OUT + 'notwav.wav'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.bs-err')).includes('not a WAV file'), 'spectrogram: non-WAV file message');
  // A real WAV: 1 s of a 3 kHz tone at 16 kHz, notes 0.2–0.5 s.
  const fs = 16000, x = Array.from({ length: fs }, (_, i) => (i >= 3200 && i < 8000 ? 0.5 * Math.sin(2 * Math.PI * 3000 * i / fs) : 0));
  writeFileSync(OUT + 'tone.wav', encodeWav16(x, fs));
  await page.setInputFiles(P + '.bs-file', OUT + 'tone.wav'); await page.waitForTimeout(800);
  { const f = await facts(); check((await page.textContent(P + '.bs-info')).includes('tone.wav: mono, 16-bit PCM, 1 s at 16,000') && /Peak frequency(2\.99\d|3|3\.00\d) kHz/.test(f) && f.includes('Notes1'), `spectrogram: opened WAV, 3 kHz tone found (${f})`); }
  { const t = await page.$$eval(P + '.bs-notes tbody tr td', (c) => c.map((x) => x.textContent)); check(Math.abs(Number(t[1]) - 0.2) < 0.03 && Math.abs(Number(t[3]) - 300) < 35, `spectrogram: tone note 0.2 s, 300 ms (${t})`); }
};
