// #T1021 Mix recorder
export const path = '/everyday/mix-recorder/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/mix-recorder/`); await page.waitForTimeout(300);
  const R = '.mr ';
  check(await page.isEnabled(R + '.mr-start') && await page.isDisabled(R + '.mr-new'), 'mix-recorder: record button ready, New track waits for a recording');
  // Tracklist mode with a 5 s WAV made here.
  await page.check(R + 'input[name=mr-mode][value=list]');
  await page.evaluate(() => {
    const rate = 8000, n = rate * 5, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(0.2 * Math.sin((2 * Math.PI * 440 * i) / rate) * 32767), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'friday-mix.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.mr .mr-in'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => !document.querySelector('.mr .mr-new').disabled);
  await page.fill(R + '.mr-label', 'Kai & Lu – Night Drive');
  await page.click(R + '.mr-new'); // at 0 s, the player has not started
  await page.click(R + '.mr-more summary');
  await page.fill(R + '.mr-label', 'Ona - Static'); await page.fill(R + '.mr-at', '3:32.4'); await page.click(R + '.mr-add');
  await page.fill(R + '.mr-label', ''); await page.fill(R + '.mr-at', '1:10'); await page.click(R + '.mr-add');
  const txt = await page.textContent(R + '.mr-text');
  check(txt === '00:00 Kai & Lu – Night Drive\n01:10 Track 2\n03:32 Ona – Static\n', `mix-recorder: tracklist sorted with timestamps (${JSON.stringify(txt)})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mr-cue')]);
  const f = OUT + 'mr.cue'; await d.saveAs(f); const cue = readFileSync(f, 'utf8');
  check(d.suggestedFilename() === 'friday-mix.cue' && cue.includes('FILE "friday-mix.wav" WAVE') && cue.includes('TRACK 03 AUDIO\r\n    TITLE "Static"\r\n    PERFORMER "Ona"\r\n    INDEX 01 03:32:30'), 'mix-recorder: CUE sheet INDEX 01 03:32:30 for 3:32.4');
  // Remove the middle mark, then the CSV has two rows.
  await page.click(R + '.mr-list li:nth-child(2) button');
  const [d2] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mr-csv')]);
  const f2 = OUT + 'mr.csv'; await d2.saveAs(f2); const csv = readFileSync(f2, 'utf8').trim().split('\r\n');
  check(csv.length === 3 && csv[1].startsWith('1,00:00:00,0.00,Kai & Lu,Night Drive,212.40') && csv[2].startsWith('2,00:03:32,212.40,Ona,Static'), `mix-recorder: CSV after removing a mark (${csv.join(' | ')})`);
};
