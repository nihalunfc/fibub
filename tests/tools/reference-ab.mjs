// #T1044 A/B compare
export const path = '/everyday/reference-ab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/reference-ab/`); await page.waitForTimeout(300);
  const R = '.ra ';
  // Stereo 1 kHz sines, the same in both channels, 5 s at 48 kHz. Amplitude 0.1 (-20 dBFS) in two channels:
  // -23.0 + 3.0 = -20.0 LUFS; amplitude 0.316 (-10 dBFS): -10.0 LUFS. A sine's crest factor is 3.0 dB.
  const load = (sel, name, amp) => page.evaluate(([sel, name, amp]) => {
    const rate = 48000, n = rate * 5, b = new ArrayBuffer(44 + n * 4), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) { const q = Math.round(amp * Math.sin((2 * Math.PI * 1000 * i) / rate) * 32767); v.setInt16(44 + i * 4, q, true); v.setInt16(46 + i * 4, q, true); }
    const dt = new DataTransfer(); dt.items.add(new File([b], name, { type: 'audio/wav' }));
    const inp = document.querySelector(sel); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, [sel, name, amp]);
  await load('.ra .ra-mixfile', 'mix.wav', 0.1);
  await page.waitForFunction(() => document.querySelector('.ra .ra-status').textContent.startsWith('Now add'), null, { timeout: 20000 });
  await load('.ra .ra-reffile', 'loud.wav', 0.31623);
  await page.waitForFunction(() => document.querySelectorAll('.ra .ra-table tbody tr').length === 2, null, { timeout: 20000 });
  const rows = await page.$$eval(R + '.ra-table tbody tr', (trs) => trs.map((tr) => [...tr.children].map((td) => td.textContent)));
  check(rows[0].join('|') === 'Your mix: mix|−20.0 LUFS|0.0 dB|0.0 LU|−20.0 dBTP|+1.00|3.0 dB', `reference-ab: mix row (${rows[0].join('|')})`);
  check(rows[1][1] === '−10.0 LUFS' && rows[1][2] === '−10.0 dB', `reference-ab: reference matched down by 10.0 dB (${rows[1].join('|')})`);
  await page.uncheck(R + '.ra-match');
  check((await page.$$eval(R + '.ra-table tbody tr td:nth-child(3)', (t) => t.map((x) => x.textContent))).every((v) => v === '0.0 dB'), 'reference-ab: unmatched plays both as they are');
  await page.check(R + '.ra-match');
  await page.keyboard.press('2');
  check((await page.$$eval(R + '.ra-pick button', (b) => b.map((x) => x.getAttribute('aria-pressed')))).join() === 'false,true', 'reference-ab: key 2 picks the reference');
  await page.click(R + '.ra-blind');
  const blindRows = await page.$$eval(R + '.ra-table tbody tr td:first-child', (t) => t.map((x) => x.textContent));
  const labels = await page.$$eval(R + '.ra-pick button', (b) => b.map((x) => x.textContent));
  check(blindRows.join() === 'Track 1,Track 2' && labels.join() === '1,2', `reference-ab: blind test hides the names (${blindRows}, ${labels})`);
  await page.click(R + '.ra-reveal');
  check((await page.textContent(R + '.ra-blindnote')).startsWith('Revealed:') && (await page.textContent(R + '.ra-blindnote')).includes('your mix'), 'reference-ab: Reveal says which was which');
};
