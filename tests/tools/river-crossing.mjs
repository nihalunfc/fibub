// #1337 river crossing
export const path = '/learn/river-crossing/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/river-crossing/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.rc .rc-facts'), pill = () => page.textContent('.rc .rc-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check((await pill()) === 'Lands 75 m downstream after 25 s' && f.includes('Speed over the ground5 m/s') && f.includes('36.9° downstream') && f.includes('point 48.6° upstream'), 'river-crossing: example: 25 s, 75 m drift, 5 m/s, opposite at 48.6°'); }
  const ink = () => page.$eval('.rc .rc-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[i + 2]) > 60) n++; return n; });
  check((await ink()) > 200, 'river-crossing: river and arrows drawn');
  await page.click('.rc .rc-opp'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Lands straight opposite after 37.8 s') && (await page.textContent('.rc .rc-tv')) === '48.6° upstream', `river-crossing: land opposite: 48.6° upstream, 37.8 s (${await pill()})`);
  await page.click('.rc .rc-go'); await page.waitForTimeout(300);
  check(await page.isDisabled('.rc .rc-go'), 'river-crossing: crossing animates');
  await page.waitForTimeout(4000);
  await page.click('.rc .rc-fast'); await setR('.rc .rc-r', 0);
  check((await pill()).startsWith('Lands straight opposite after 25 s'), 'river-crossing: no current, same 25 s');
  await setR('.rc .rc-r', 5); await setR('.rc .rc-b', 2);
  check((await page.textContent('.rc .rc-opp')) === 'Drift as little as possible' && (await facts()).includes('Least drift'), 'river-crossing: river faster than the boat');
  await page.click('.rc .rc-opp'); await page.waitForTimeout(100);
  check((await page.textContent('.rc .rc-tv')) === '23.6° upstream', `river-crossing: least drift heading asin(2/5) = 23.6° (${await page.textContent('.rc .rc-tv')})`);
  await setR('.rc .rc-t', -30);
  check((await page.textContent('.rc .rc-tv')) === '30° downstream', 'river-crossing: aim downstream');
  check((await page.$$('.rc .sq-q')).length === 4, 'river-crossing: four questions');
  const ans = await page.$eval('.rc .sq-q', (e) => e.dataset.ans);
  await page.fill('.rc .sq-q .sq-in', ans); await page.click('.rc .sq-q .sq-check');
  check((await page.textContent('.rc .sq-q .sq-res')) === 'Right!', 'river-crossing: quiz');
};
