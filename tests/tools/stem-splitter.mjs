// #T1014 Stem splitter
export const path = '/everyday/stem-splitter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/stem-splitter/`); await page.waitForTimeout(300);
  const R = '.ss ';
  // 3 s stereo 44.1 kHz: 660 Hz at 0.3 in both channels (centre) + 523.25 Hz at 0.3 in the left only.
  // Energy: centre tone 2 × 0.045, side tone 0.045 → vocals 67 %, instrumental 33 %.
  const load = (kind) => page.evaluate((kind) => {
    const rate = 44100, n = rate * 3, ch = 2, b = new ArrayBuffer(44 + n * 2 * ch), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2 * ch, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2 * ch, true); v.setUint16(32, 2 * ch, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2 * ch, true);
    for (let i = 0; i < n; i++) {
      let L, Rr;
      if (kind === 'tones') { const c = 0.3 * Math.sin((2 * Math.PI * 660 * i) / rate), l = 0.3 * Math.sin((2 * Math.PI * 523.25 * i) / rate); L = c + l; Rr = c; }
      else { const t = i % 11025, c = t < 30 ? (t % 2 ? -1 : 1) * 0.8 * Math.exp(-t / 6) : 0; L = Rr = c; } // a click every 0.25 s
      v.setInt16(44 + i * 4, Math.round(L * 32767), true); v.setInt16(46 + i * 4, Math.round(Rr * 32767), true);
    }
    const dt = new DataTransfer(); dt.items.add(new File([b], kind + '.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.ss .ss-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, kind);
  await load('tones');
  await page.waitForSelector(R + '.ss-go:not([disabled])', { timeout: 20000 });
  check((await page.textContent(R + '.ss-name')).includes('3.0 s, stereo'), 'stem-splitter: reads the stereo file');
  await page.click(R + '.ss-go');
  await page.waitForSelector(R + '.ss-res:not([hidden])', { timeout: 60000 });
  const sum = await page.textContent(R + '.ss-sum');
  check(/Vocals: 67 %.*Instrumental: 33 %/.test(sum), `stem-splitter: centred tone → vocals 67 %, side tone → instrumental 33 % (${sum})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ss-stem:nth-child(2) .ss-save')]);
  const f = OUT + 'ss.wav'; await d.saveAs(f); const b = readFileSync(f);
  // Instrumental left channel should be the 523 Hz tone (peak ≈ 0.3), right channel near silent.
  let pl = 0, pr = 0; for (let i = 44 + 4 * 22050; i < b.length - 4 * 22050; i += 4) { pl = Math.max(pl, Math.abs(b.readInt16LE(i))); pr = Math.max(pr, Math.abs(b.readInt16LE(i + 2))); }
  check(d.suggestedFilename() === 'tones-instrumental.wav' && Math.abs(pl / 32767 - 0.3) < 0.03 && pr / 32767 < 0.03, `stem-splitter: instrumental WAV is the left-only tone (L ${(pl / 32767).toFixed(3)}, R ${(pr / 32767).toFixed(3)})`);
  // Drums mode on clicks: nearly all goes to drums.
  await load('clicks');
  await page.waitForSelector(R + '.ss-go:not([disabled])', { timeout: 20000 });
  await page.check(R + 'input[value=drums]'); await page.click(R + '.ss-go');
  await page.waitForSelector(R + '.ss-res:not([hidden])', { timeout: 60000 });
  const s2 = await page.textContent(R + '.ss-sum'), m = s2.match(/Drums: (\d+) %/);
  check(m && +m[1] >= 90, `stem-splitter: clicks go to the drums stem (${s2})`);
  check((await page.locator(R + '.ss-solo').count()) === 2 && (await page.locator(R + '.ss-mute').count()) === 2, 'stem-splitter: solo and mute for each stem');
};
