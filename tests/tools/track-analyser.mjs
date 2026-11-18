// #T1013 Track analyser
import { wavFiles, A_MINOR, C_MAJOR } from '../music-wav.mjs';
export const path = '/everyday/track-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/track-analyser/`); await page.waitForTimeout(300);
  const R = '.ta ';
  await wavFiles(page, [
    { name: 'clicks-128.wav', kind: 'clicks', bpm: 128, secs: 20 },
    { name: 'a-minor.wav', kind: 'chords', midis: A_MINOR, secs: 2 },
    { name: 'c-major.wav', kind: 'chords', midis: C_MAJOR, secs: 0.5 },
  ], R + '.ta-files');
  await page.waitForFunction(() => /3 tracks analysed/.test(document.querySelector('.ta .ta-status')?.textContent || ''), null, { timeout: 60000 });
  const rows = await page.$$eval(R + 'tbody tr', (trs) => trs.map((tr) => [...tr.children].map((td) => td.textContent)));
  const by = (n) => rows.find((r) => r[0] === n) || [];
  check(Math.abs(+by('clicks-128')[1] - 128) <= 0.5 && by('clicks-128')[5] === '0:20', `track-analyser: click track 128 BPM, 0:20 (${by('clicks-128').join(' | ')})`);
  check(by('a-minor')[2] === '8A' && by('a-minor')[3] === '8A' && by('c-major')[3] === '8B', `track-analyser: A minor 8A, C major 8B (${by('a-minor')[3]}, ${by('c-major')[3]})`);
  await page.selectOption(R + '.ta-not', 'musical');
  check((await page.$$eval(R + 'tbody tr td:nth-child(3)', (t) => t.map((x) => x.textContent))).includes('Am'), 'track-analyser: musical notation shows Am');
  await page.click(R + 'th button[data-sort="bpm"]'); await page.click(R + 'th button[data-sort="bpm"]');
  const first = await page.textContent(R + 'tbody tr td');
  check(first === 'clicks-128', `track-analyser: BPM sorted high to low puts the click track first (${first})`);
  const am = await page.$eval(R + '.ta-with', (s) => [...s.options].find((o) => o.text.startsWith('a-minor')).value);
  await page.selectOption(R + '.ta-with', am);
  const names = await page.$$eval(R + 'tbody tr', (trs) => trs.map((tr) => tr.children[0].textContent + ':' + tr.children[7].textContent));
  check(names.includes('a-minor:This track') && names.includes('c-major:Relative major'), `track-analyser: mixes with A minor lists C major as relative (${names.join(', ')})`);
  await page.selectOption(R + '.ta-with', '');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ta-m3u')]); const f = OUT + 'ta.m3u8'; await d.saveAs(f);
  const m3u = readFileSync(f, 'utf8').trim().split('\n');
  check(m3u[0] === '#EXTM3U' && m3u[1] === '#EXTINF:20,clicks-128' && m3u[2] === 'clicks-128.wav' && m3u.length === 7, `track-analyser: M3U8 in sorted order (${m3u.slice(0, 3).join(' / ')})`);
};
