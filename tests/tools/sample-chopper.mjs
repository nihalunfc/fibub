// #T1022 Sample chopper
import { unzipSync } from 'fflate';
export const path = '/everyday/sample-chopper/';
const HITS = [0.1, 0.45, 0.8, 1.3, 1.55, 2.2, 2.9];
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/sample-chopper/`); await page.waitForTimeout(300);
  const R = '.sc ';
  // 3.5 s, 44.1 kHz mono: seven 80 ms decaying 800 Hz hits at known times.
  await page.evaluate((T) => {
    const rate = 44100, n = Math.round(rate * 3.5), x = new Float32Array(n);
    for (const t of T) { const a = Math.round(t * rate); for (let i = 0; i < 0.08 * rate; i++) x[a + i] += 0.6 * Math.sin(2 * Math.PI * 800 * i / rate) * Math.exp(-i / rate / 0.02); }
    const b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, x[i])) * 32767), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'clicks.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.sc .sc-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, HITS);
  await page.waitForSelector(R + '.sc-res:not([hidden])', { timeout: 60000 });
  const starts = JSON.parse(await page.getAttribute(R + '.sc-wave', 'data-starts'));
  const err = starts.length === HITS.length ? Math.max(...starts.map((t, i) => Math.abs(t - HITS[i]))) : 1;
  check(err <= 0.01, `sample-chopper: 7 hits give slice starts within 10 ms (${starts.join(', ')}; worst ${(err * 1000).toFixed(1)} ms)`);
  check((await page.textContent(R + '.sc-count')) === '7 slices' && (await page.$$(R + '.sc-pad:not([disabled])')).length === 7, 'sample-chopper: 7 slices on 7 pads');
  // ZIP of every slice.
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-zip')]); const f = OUT + 'sc.zip'; await d.saveAs(f);
  const z = unzipSync(new Uint8Array(readFileSync(f))), names = Object.keys(z).sort();
  const w2 = z['clicks_02.wav'], len2 = w2 ? new DataView(w2.buffer, w2.byteOffset).getUint32(40, true) / 2 / 44100 : 0;
  check(d.suggestedFilename() === 'clicks_slices.zip' && names.length === 7 && names[0] === 'clicks_01.wav' && names[6] === 'clicks_07.wav' && Math.abs(len2 - 0.35) < 0.01,
    `sample-chopper: ZIP has clicks_01.wav to clicks_07.wav, slice 2 is 0.35 s (${names.join(' ')}; ${len2.toFixed(3)} s)`);
  // MIDI: 7 notes from C1 (24).
  await page.click(R + '.sc-more summary');
  const [dm] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-midi')]); const fm = OUT + 'sc.mid'; await dm.saveAs(fm);
  const m = readFileSync(fm), ons = []; for (let i = 0; i + 2 < m.length; i++) if (m[i] === 0x90) ons.push(m[i + 1]);
  check(m.toString('latin1', 0, 4) === 'MThd' && ons.length === 7 && ons[0] === 24 && ons[6] === 30, `sample-chopper: MIDI file with notes 24 to 30 (${ons.join(',')})`);
  // Beat grid at 120 BPM, one slice per beat, from 0: 7 slices 0.5 s apart.
  await page.selectOption(R + '.sc-mode', 'grid');
  await page.fill(R + '.sc-off', '0'); await page.dispatchEvent(R + '.sc-off', 'change');
  await page.fill(R + '.sc-bpm', '120'); await page.dispatchEvent(R + '.sc-bpm', 'change');
  const g = JSON.parse(await page.getAttribute(R + '.sc-wave', 'data-starts'));
  check(g.length === 7 && g[1] === 0.5 && g[6] === 3, `sample-chopper: 120 BPM grid gives 7 slices (${g.join(', ')})`);
  // Joined WAV of slices 1 2 1: 1.5 s.
  await page.fill(R + '.sc-order', '1 2 1');
  const [dj] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-join')]); const fj = OUT + 'sc-j.wav'; await dj.saveAs(fj);
  const j = readFileSync(fj);
  check(Math.abs(j.readUInt32LE(40) / 2 / 44100 - 1.5) < 0.001, `sample-chopper: joined 1 2 1 is 1.5 s (${(j.readUInt32LE(40) / 2 / 44100).toFixed(3)})`);
};
