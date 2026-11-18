// #T1028 Crate tagger
export const path = '/everyday/crate-tagger/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/crate-tagger/`); await page.waitForTimeout(300);
  const R = '.ct ';
  const names = () => page.$$eval(R + '.ct-list li button', (l) => l.map((b) => b.firstChild.textContent).join(' | '));
  // Track analyser style CSV with a quoted name that contains a comma.
  await page.setInputFiles(R + '.ct-file', { name: 'tracks.csv', mimeType: 'text/csv', buffer: Buffer.from('file,bpm,key\n"b, side.wav",128.0,8A\na.wav,124.0,9A\nc.mp3,130.0,3B\n') });
  await page.waitForTimeout(300);
  check((await names()) === 'b, side | a | c' && (await page.textContent(R + '.ct-status')).includes('3 new tracks'), `crate-tagger: CSV import (${await names()})`);
  // M3U8 with an EXTINF title, plus a repeat that keeps its tags.
  await page.click(R + '.ct-list li:nth-child(1) button'); await page.keyboard.press('6'); await page.keyboard.press('4');
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('6'); await page.keyboard.press(']'); await page.keyboard.press(']');
  await page.setInputFiles(R + '.ct-file', { name: 'p.m3u8', mimeType: 'audio/x-mpegurl', buffer: Buffer.from('#EXTM3U\n#EXTINF:-1,Night Bus\nC:\\music\\night.mp3\na.wav\n') });
  await page.waitForTimeout(300);
  check((await names()) === 'b, side | a | c | Night Bus' && (await page.textContent(R + '.ct-status')).includes('1 new track, 1 already'), `crate-tagger: M3U8 import (${await names()})`);
  // Filters: peak (key 6) is on tracks 1 and 2; dark (key 4) on track 1 only.
  const chip = (t) => R + `.ct-fchips button:has-text("#${t}")`;
  await page.click(chip('peak')); check((await names()) === 'b, side | a', `crate-tagger: peak filter (${await names()})`);
  await page.click(chip('dark')); check((await names()) === 'b, side', `crate-tagger: AND filter (${await names()})`);
  await page.selectOption(R + '.ct-mode', 'or'); check((await names()) === 'b, side | a', `crate-tagger: OR filter (${await names()})`);
  await page.selectOption(R + '.ct-mode', 'and'); await page.click(chip('dark'));
  await page.selectOption(R + '.ct-min', '2'); check((await names()) === 'a', `crate-tagger: stars filter (${await names()})`);
  await page.selectOption(R + '.ct-min', '0');
  // Exports of the peak list: comment lines and M3U8.
  check((await page.inputValue(R + '.ct-comm')) === 'b, side: #peak #dark\na: #peak', `crate-tagger: comment lines (${await page.inputValue(R + '.ct-comm')})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ct-m3u')]); const f = OUT + 'ct.m3u8'; await d.saveAs(f);
  check(readFileSync(f, 'utf8') === '#EXTM3U\n#EXTINF:-1,b, side\nb, side.wav\n#EXTINF:-1,a\na.wav\n', `crate-tagger: M3U8 export (${JSON.stringify(readFileSync(f, 'utf8'))})`);
  // Nothing is kept unless the box is ticked.
  const kept = await page.evaluate(() => localStorage.getItem('fibub-crate-tagger-v1'));
  check(kept === null && !(await page.isChecked(R + '.ct-remember')), 'crate-tagger: nothing stored by default');
};
