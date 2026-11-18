// #T1024 Mix planner
export const path = '/everyday/harmonic-mixing/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/harmonic-mixing/`); await page.waitForTimeout(300);
  const R = '.mp ';
  const order = () => page.$$eval(R + '.mp-list li .t', (l) => l.map((x) => x.textContent).join(' > '));
  // The example list, steady: start 8A, 10A (+2 energy boost, +4 BPM), 9A, 9B, 8B, then 3B (+7, up a semitone) last.
  check((await order()) === 'Opening Pad > Warehouse > Night Bus > Low Sun > Sunrise > Deep Roller', `harmonic-mixing: steady order (${await order()})`);
  check((await page.textContent(R + '.mp-sum')).startsWith('6 tracks, 5 mixes: 3 perfect, 0 good, 1 energy boost, 1 mood change, 0 risky'), `harmonic-mixing: summary (${await page.textContent(R + '.mp-sum')})`);
  check((await page.textContent(R + '.mp-path')) === 'Path round the wheel: 8A → 10A → 9A → 9B → 8B → 3B', 'harmonic-mixing: wheel path');
  await page.click(R + '.mp-more summary');
  await page.check(R + '.mp-shift');
  check((await order()) === 'Opening Pad > Sunrise > Deep Roller > Low Sun > Night Bus > Warehouse' && (await page.textContent(R + '.mp-list li:nth-child(3) .m')).includes('3B → 8B (−1 semitone)'), `harmonic-mixing: key shift moves 3B down to 8B (${await order()})`);
  await page.uncheck(R + '.mp-shift');
  await page.selectOption(R + '.mp-shape', 'build');
  check((await order()) === 'Opening Pad > Sunrise > Low Sun > Night Bus > Warehouse > Deep Roller', `harmonic-mixing: build up (${await order()})`);
  await page.selectOption(R + '.mp-not', 'musical');
  check((await page.textContent(R + '.mp-path')).startsWith('Path round the wheel: Am → C → G → Em → Bm'), `harmonic-mixing: musical names (${await page.textContent(R + '.mp-path')})`);
  // Track analyser CSV with a header row and a quoted file name.
  await page.fill(R + '.mp-in', 'file,bpm,key,camelot,open_key,energy\n"b, side.wav",128.0,Am,8A,1m,7\na.wav,127.0,C,8B,1d,5\nc.wav,,C,8B,1d,3');
  await page.waitForTimeout(500);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mp-m3u')]); const f = OUT + 'mp.m3u8'; await d.saveAs(f);
  const m = readFileSync(f, 'utf8');
  check(m === '#EXTM3U\n#EXTINF:-1,b, side\nb, side.wav\n#EXTINF:-1,a\na.wav\n' && (await page.textContent(R + '.mp-sum')).includes('1 line without a BPM left out'), `harmonic-mixing: CSV import and M3U8 (${JSON.stringify(m)})`);
};
