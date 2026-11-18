// #T1025 Tempo matcher
export const path = '/everyday/bpm-shifter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/bpm-shifter/`); await page.waitForTimeout(300);
  const R = '.bs ';
  const res = () => page.textContent(R + '.bs-res');
  // 124 -> 128: 128/124 - 1 = +3.23%, 12*log2(128/124) = +0.55 semitones; fits every range from 6% up.
  check((await res()).includes('+3.23%') && (await res()).includes('+0.55 semitones') && (await res()).includes('±6%, ±8%, ±10%, ±16%, ±50%'), `bpm-shifter: 124 to 128 (${await res()})`);
  // 8A pitched up one semitone is 3A (A minor to B-flat minor); 100 -> 106 BPM is about +1 semitone (12*log2(1.06) = 1.01).
  await page.fill(R + '.bs-a', '100'); await page.fill(R + '.bs-b', '106'); await page.fill(R + '.bs-ka', '8A'); await page.fill(R + '.bs-kb', '3A');
  check((await res()).includes('3A (B♭m)') && (await res()).includes('Still compatible'), `bpm-shifter: 8A +1 semitone = 3A (${await res()})`);
  await page.fill(R + '.bs-kb', '8B');
  check((await res()).includes('Not compatible'), 'bpm-shifter: 3A against 8B flagged');
  // 87 against 174: A as double time is the exact match.
  await page.fill(R + '.bs-a', '87'); await page.fill(R + '.bs-b', '174');
  const o = await page.textContent(R + '.bs-opts');
  check(o.includes('A as double time (x2): 174.0 BPM') && /double time[^]*Best[^]*Fader 0\.00%/.test(o), `bpm-shifter: 87 and 174 (${o})`);
  // Fader table: 124 BPM at +8% is 133.92.
  await page.click(R + '.bs-more summary'); await page.waitForTimeout(100);
  const t = await page.textContent(R + '.bs-table');
  check(t.includes('+8.0%133.92') && t.includes('−8.0%114.08'), `bpm-shifter: table (${t.slice(0, 120)})`);
  // Tap tempo: two quick taps give some BPM; stability shown after 3.
  for (let i = 0; i < 3; i++) { await page.click(R + '.bs-tap'); await page.waitForTimeout(500); }
  const tp = await page.textContent(R + '.bs-tapout');
  check(/BPM from 3 taps, stability/.test(tp), `bpm-shifter: tap tempo (${tp})`);
};
