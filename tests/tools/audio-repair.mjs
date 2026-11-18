// #T1020 Audio repair
export const path = '/everyday/audio-repair/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/audio-repair/`); await page.waitForTimeout(300);
  const R = '.ar ';
  // 4 s mono 44.1 kHz: hiss (±0.02) + 50 Hz hum (0.1) + 150 Hz (0.05) all through; a 1 kHz tone at 0.3 from 1 s; 3 clicks.
  const rate = 44100, n = rate * 4;
  let seed = 3; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
  const hiss = Array.from({ length: n }, () => rnd() * 0.02);
  const hum = (i) => 0.1 * Math.sin((2 * Math.PI * 50 * i) / rate) + 0.05 * Math.sin((2 * Math.PI * 150 * i) / rate + 1);
  const tone = (i) => (i >= rate ? 0.3 * Math.sin((2 * Math.PI * 1000 * i) / rate) : 0);
  const x = Array.from({ length: n }, (_, i) => hiss[i] + hum(i) + tone(i));
  for (const t of [1.5, 2.2, 3.1]) x[Math.round(t * rate)] += 0.6;
  await page.evaluate(({ x, rate }) => {
    const n = x.length, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(x[i] * 32767), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'take.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.ar .ar-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, { x, rate });
  await page.waitForSelector(R + '.ar-go:not([disabled])', { timeout: 20000 });
  const selText = await page.textContent(R + '.ar-sel'), m = selText.match(/Noise sample: ([\d.]+) s to ([\d.]+) s/);
  check(m && +m[2] <= 1.0, `audio-repair: picks the quiet first second as the noise sample (${selText.slice(0, 50)})`);
  await page.check(R + '.ar-clicks');
  await page.click(R + '.ar-go');
  await page.waitForSelector(R + '.ar-res:not([hidden])', { timeout: 60000 });
  const sum = await page.textContent(R + '.ar-sum');
  check(sum.includes('Hum found at 50 Hz') && sum.includes('3 clicks repaired'), `audio-repair: finds 50 Hz hum and 3 clicks (${sum})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ar-save')]);
  const f = OUT + 'ar.wav'; await d.saveAs(f); const b = readFileSync(f);
  const y = []; for (let i = 44; i + 1 < b.length; i += 2) y.push(b.readInt16LE(i) / 32767);
  const pow = (sig, fr, a, z) => { let re = 0, im = 0; for (let i = a; i < z; i++) { re += sig[i] * Math.cos((2 * Math.PI * fr * i) / rate); im += sig[i] * Math.sin((2 * Math.PI * fr * i) / rate); } return (re * re + im * im) / ((z - a) * (z - a)); };
  const a = Math.round(1.5 * rate), z = Math.round(3.5 * rate), db = (p, q) => 10 * Math.log10(p / q);
  const humDrop = db(pow(x, 50, a, z), pow(y, 50, a, z)), toneChange = Math.abs(db(pow(y, 1000, a, z), pow(x, 1000, a, z)));
  let e0 = 0, e1 = 0; for (let i = 4096; i < rate - 4096; i++) { const h = x[i] - hum(i); e0 += h * h; e1 += y[i] * y[i]; }
  const hissDrop = db(e0, e1);
  check(d.suggestedFilename() === 'take-repaired.wav' && humDrop > 30, `audio-repair: 50 Hz hum down ${humDrop.toFixed(1)} dB (> 30)`);
  check(hissDrop > 10 && toneChange < 1, `audio-repair: hiss down ${hissDrop.toFixed(1)} dB (> 10), 1 kHz tone changes ${toneChange.toFixed(2)} dB (< 1)`);
};
