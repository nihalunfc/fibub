// #T1016 Library cleaner
export const path = '/everyday/music-library-cleaner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/music-library-cleaner/`); await page.waitForTimeout(300);
  const R = '.mlc ';
  // Three MP3s, 40 frames each (MPEG-1 layer III): 320 kbps 44.1 kHz (1044-byte frames), 128 kbps 44.1 kHz (417), 128 kbps 32 kHz (576).
  await page.evaluate(() => {
    const mk = (b2, len, n = 40) => { const b = new Uint8Array(len * n); for (let f = 0; f < n; f++) { b.set([0xff, 0xfb, b2, 0x40], f * len); for (let i = 4; i < len; i++) b[f * len + i] = (i * 13 + f) & 255; } return b; };
    const dt = new DataTransfer();
    dt.items.add(new File([mk(0xe0, 1044)], 'Artist - Song (Original Mix).mp3'));
    dt.items.add(new File([mk(0x90, 417)], 'artist - song.mp3'));
    dt.items.add(new File([mk(0x98, 576)], 'Other - Thing.mp3'));
    const inp = document.querySelector('.mlc .mlc-filein'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.mlc-res:not([hidden])', { timeout: 20000 });
  const sum = await page.textContent(R + '.mlc-sum');
  check(sum.includes('All files: 3') && sum.includes('Duplicates: 2') && sum.includes('Low bitrate: 2') && sum.includes('Unusual sample rate: 1'), `music-library-cleaner: summary (${sum})`);
  const rm = await page.inputValue(R + '.mlc-remove');
  check(rm === 'artist - song.mp3', `music-library-cleaner: keeps the 320 kbps copy, lists the 128 kbps one (${rm})`);
  // 40 frames x 1152 samples / 44100 Hz = 1.04 s; at 128 kbps: 40 x 417 x 8 / 128000 = 1.0425 s.
  await page.click(R + '.mlc-sum button[data-f=rate]');
  const rows = await page.$$eval(R + '.mlc-table tbody tr', (t) => t.map((r) => r.textContent));
  check(rows.length === 1 && rows[0].includes('Other - Thing.mp3') && rows[0].includes('32,000 Hz'), `music-library-cleaner: filter by sample rate (${rows.join(' / ')})`);
  await page.selectOption(R + '.mlc-thr', '128');
  const sum2 = await page.textContent(R + '.mlc-sum');
  check(!sum2.includes('Low bitrate'), `music-library-cleaner: threshold 128 kbps clears the low-bitrate flags (${sum2})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mlc-csv')]);
  check(d.suggestedFilename() === 'music-library-report.csv', 'music-library-cleaner: CSV report downloads');
};
