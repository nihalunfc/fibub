// #T977 Add audio
export const path = '/everyday/add-audio-to-video/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/add-audio-to-video/`); await page.waitForTimeout(300);
  const R = '.aav ';
  await page.setInputFiles(R + '.aav-vfile', new URL('../fixtures/clip-h264.mp4', import.meta.url).pathname);
  await page.evaluate(() => {
    const wav = (rate, secs, hz, amp = 0.5) => {
      const n = Math.round(rate * secs), b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
      const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
      s(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); s(8, "WAVE"); s(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
      v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, "data"); v.setUint32(40, n * 2, true);
      for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(amp * 32767 * (hz ? Math.sin(2 * Math.PI * hz * i / rate) : 1)), true);
      return b;
    };
    const dt = new DataTransfer(); dt.items.add(new File([wav(48000, 1, 440, 0.5)], 'tone.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.aav .aav-afile'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => document.querySelector('.aav-plan').textContent.includes('the sound is'), null, { timeout: 15000 });
  await page.fill(R + '.aav-at', '0.5'); await page.fill(R + '.aav-fo', '0');
  check((await page.textContent(R + '.aav-plan')).includes('It ends 0.5 s before the video does, then silence'), `add-audio: plan (${await page.textContent(R + '.aav-plan')})`);
  await page.click(R + '.aav-go');
  await page.waitForFunction(() => !document.querySelector('.aav-out').hidden || !document.querySelector('.aav-err').hidden, null, { timeout: 60000 });
  check(/Done in/.test(await page.textContent(R + '.aav-res')), `add-audio: made (${await page.textContent(R + '.aav-res')}${await page.textContent(R + '.aav-err')})`);
  // Decode the new file's sound: silent before 0.5 s, a 440 Hz tone (mean level 0.318) from 0.5 s to 1.5 s, silent after.
  const lv = await page.evaluate(async () => {
    const buf = await (await fetch(document.querySelector('.aav-result').src)).arrayBuffer();
    const a = await new OfflineAudioContext(1, 1, 48000).decodeAudioData(buf), c = a.getChannelData(0), r = a.sampleRate;
    const avg = (t0, t1) => { let s = 0; for (let i = Math.round(t0 * r); i < Math.round(t1 * r); i++) s += Math.abs(c[i]); return s / ((t1 - t0) * r); };
    return [avg(0.1, 0.4), avg(0.7, 1.3), avg(1.6, 1.9), a.duration].map((x) => +x.toFixed(3));
  }).catch((e) => String(e));
  check(Array.isArray(lv) && lv[0] < 0.02 && Math.abs(lv[1] - 0.318) < 0.04 && lv[2] < 0.02, `add-audio: sound placed from 0.5 s to 1.5 s (${lv})`);
};
