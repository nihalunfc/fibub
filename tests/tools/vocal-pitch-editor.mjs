// #T1019 Pitch editor
import { yin } from '../../src/lib/audio/pitch.ts';
export const path = '/everyday/vocal-pitch-editor/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/vocal-pitch-editor/`); await page.waitForTimeout(300);
  const R = '.pe ';
  // 1.5 s at 44.1 kHz: A3 sung 30 cents sharp (0.6 s), a gap, C#4 sung 40 cents flat (0.6 s), a gap. A vowel-like tone with 8 harmonics.
  await page.evaluate(() => {
    const rate = 44100, segs = [[220 * 2 ** (30 / 1200), 0.6], [0, 0.15], [277.18 * 2 ** (-40 / 1200), 0.6], [0, 0.15]];
    const n = Math.round(1.5 * rate), x = new Float32Array(n); let o = 0, ph = 0;
    for (const [f, d] of segs) { const L = Math.round(d * rate); for (let i = 0; i < L; i++) if (f) { ph += 2 * Math.PI * f / rate; let v = 0; for (let h = 1; h <= 8; h++) v += Math.sin(h * ph) / h; x[o + i] = 0.25 * v * Math.min(1, i / (0.02 * rate), (L - i) / (0.02 * rate)); } o += L; }
    const b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (q, t) => { for (let i = 0; i < 4; i++) v.setUint8(q + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, x[i])) * 32767), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'take.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.pe .pe-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.pe-res:not([hidden])', { timeout: 60000 });
  await page.selectOption(R + '.pe-tonic', '9'); await page.selectOption(R + '.pe-scale', 'major');
  const notes = () => page.getAttribute(R + '.pe-roll', 'data-notes').then(JSON.parse);
  let N = await notes();
  check(N.length === 2 && Math.abs(N[0].midi - 57.3) < 0.05 && Math.abs(N[1].midi - 60.6) < 0.05 && N[0].target === 57 && N[1].target === 61,
    `vocal-pitch-editor: 2 notes, A3 +30 and C#4 −40 cents, snap to A3 and C#4 in A major (${JSON.stringify(N)})`);
  // Save and measure: 220.0 and 277.18 Hz, same length.
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pe-save')]); const f = OUT + 'pe.wav'; await d.saveAs(f);
  const buf = readFileSync(f), n = buf.readUInt32LE(40) / 2, y = new Float32Array(n); for (let i = 0; i < n; i++) y[i] = buf.readInt16LE(44 + 2 * i) / 32768;
  const P = (t) => yin(y.subarray(Math.round(t * 44100), Math.round(t * 44100) + 4096), 44100, 60, 1000).hz;
  const p1 = P(0.3), p2 = P(1.05);
  check(d.suggestedFilename() === 'take-tuned.wav' && n === Math.round(1.5 * 44100) && Math.abs(p1 - 220) < 1 && Math.abs(p2 - 277.18) < 1.5,
    `vocal-pitch-editor: corrected file measures 220 and 277.2 Hz, same length (${p1.toFixed(2)}, ${p2.toFixed(2)} Hz; ${n} samples)`);
  // Strength 50%: the second note moves about +20 cents.
  await page.fill(R + '.pe-str', '50'); await page.dispatchEvent(R + '.pe-str', 'input');
  N = await notes();
  check(Math.abs(N[1].shift - 20) <= 3 && Math.abs(N[0].shift + 15) <= 3, `vocal-pitch-editor: 50% strength moves about −15 and +20 cents (${N[0].shift}, ${N[1].shift})`);
  // Select the first note with the keyboard and move it up a semitone by hand.
  await page.focus(R + '.pe-roll'); await page.keyboard.press('ArrowRight'); await page.click(R + '.pe-up');
  N = await notes();
  const sel = await page.textContent(R + '.pe-sel');
  check(N[0].target === 58 && Math.abs(N[0].shift - 70) <= 3 && sel.includes('goes to A#3') && sel.includes('by hand'), `vocal-pitch-editor: ▲ moves note 1 to A#3 (+70 cents) at full strength (${sel})`);
};
