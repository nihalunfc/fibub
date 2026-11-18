// #T1043 Phase checker
export const path = '/everyday/stereo-phase-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/stereo-phase-checker/`); await page.waitForTimeout(300);
  const R = '.sp ';
  // 4 s stereo: 200 Hz + 3 kHz, the same in both channels except 2-3 s, where the right channel is flipped.
  const load = (kind) => page.evaluate((kind) => {
    const rate = 48000, n = rate * 4, b = new ArrayBuffer(44 + n * 4), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) {
      const t = i / rate, q = Math.round((0.3 * Math.sin(2 * Math.PI * 200 * t) + 0.15 * Math.sin(2 * Math.PI * 3000 * t)) * 32767);
      const flip = kind === 'all' || (i >= 2 * rate && i < 3 * rate);
      v.setInt16(44 + i * 4, q, true); v.setInt16(46 + i * 4, flip ? -q : q, true);
    }
    const dt = new DataTransfer(); dt.items.add(new File([b], kind + '.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.sp .sp-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, kind);
  await load('part');
  await page.waitForSelector(R + '.sp-res:not([hidden])', { timeout: 20000 });
  // 3 s at +1 and 1 s at -1 with equal power: (3 - 1) / 4 = +0.50. Side is 1/4 of the time, mid 3/4: 10 log(1/3) = -4.8 dB.
  check((await page.textContent(R + '.sp-c')) === '+0.50', `stereo-phase-checker: correlation +0.50 (${await page.textContent(R + '.sp-c')})`);
  check((await page.textContent(R + '.sp-sm')) === '−4.8 dB' && (await page.textContent(R + '.sp-bal')).startsWith('centred'), 'stereo-phase-checker: side vs mid -4.8 dB, balance centred');
  const flags = await page.textContent(R + '.sp-flags');
  check(flags.includes('0:02.0 to 0:03.0') && flags.includes('lowest −1.00'), `stereo-phase-checker: flags 2-3 s at -1 (${flags})`);
  const bands = await page.textContent(R + '.sp-bands');
  check(bands.includes('Low (under 250 Hz)+0.50') && bands.includes('Mid (250 Hz to 4 kHz)+0.50'), `stereo-phase-checker: per band +0.50 (${bands})`);
  await page.click(R + '.sp-mode[data-mode=side]');
  check((await page.getAttribute(R + '.sp-mode[data-mode=side]', 'aria-pressed')) === 'true' && (await page.getAttribute(R + '.sp-mode[data-mode=stereo]', 'aria-pressed')) === 'false', 'stereo-phase-checker: Side only button switches');
  await load('all');
  await page.waitForFunction(() => document.querySelector('.sp .sp-c').textContent === '−1.00', null, { timeout: 20000 });
  check((await page.textContent(R + '.sp-ml')) === 'silent in mono' && (await page.textContent(R + '.sp-out')).startsWith('Out of phase'), 'stereo-phase-checker: a flipped channel is silent in mono');
};
