// #T1023 Key finder
import { wavFiles, A_MINOR } from '../music-wav.mjs';
export const path = '/everyday/bpm-key-finder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/bpm-key-finder/`); await page.waitForTimeout(300);
  const R = '.kf ';
  // A minor chords (8 × 2 s) with a click on every beat at 120 BPM.
  await wavFiles(page, [{ name: 'am-120.wav', kind: 'chords', midis: A_MINOR, secs: 2, bpm: 120 }], R + '.kf-file');
  await page.waitForSelector(R + '.kf-res:not([hidden])', { timeout: 60000 });
  const bpm = +(await page.textContent(R + '.kf-bpm'));
  check(Math.abs(bpm - 120) <= 0.5, `bpm-key-finder: 120 BPM (${bpm})`);
  const key = await page.textContent(R + '.kf-key');
  check(key === '8A · A minor', `bpm-key-finder: key 8A · A minor (${key}; ${await page.textContent(R + '.kf-keyinfo')})`);
  const beats = +(await page.getAttribute(R + '.kf-wave', 'data-beats'));
  check(beats >= 31 && beats <= 33, `bpm-key-finder: 32 beat lines in 16 s (${beats})`);
  await page.click(R + '.kf-dbl');
  check((await page.textContent(R + '.kf-bpm')) === '240.0' && +(await page.getAttribute(R + '.kf-wave', 'data-beats')) >= 63, 'bpm-key-finder: double gives 240.0 and twice the lines');
  await page.click(R + '.kf-half');
  const codes = await page.$$eval(R + '.kf-compat li', (l) => l.map((x) => x.dataset.code));
  check(codes.slice(0, 4).join() === '8A,7A,8B,9A' && codes.includes('10A'), `bpm-key-finder: compatible keys start 8A, 7A, 8B, 9A (${codes.join(' ')})`);
  await page.selectOption(R + '.kf-not', 'openkey');
  check((await page.textContent(R + '.kf-key')) === '1m · A minor', 'bpm-key-finder: Open Key shows 1m');
  for (let i = 0; i < 6; i++) { await page.click(R + '.kf-tap'); if (i < 5) await page.waitForTimeout(500); }
  const tap = await page.textContent(R + '.kf-tapout');
  const t = +(tap.match(/tapped ([\d.]+)/)?.[1] || 0);
  check(Math.abs(t - 120) < 8, `bpm-key-finder: tapping every 0.5 s reads about 120 (${tap})`);
};
