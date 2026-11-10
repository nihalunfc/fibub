// #1335 collision lab
export const path = '/learn/collision-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/collision-lab/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.cl .cl-facts'), pill = () => page.textContent('.cl .cl-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('Velocity of 1 after1.33 m/s') && f.includes('Velocity of 2 after5.33 m/s') && f.includes('Momentum after8 kg m/s') && f.includes('Kinetic energy after16 J'), 'collision-lab: example 2 kg at 4 m/s on 1 kg: 1.33 and 5.33 m/s, 16 J kept'); }
  check((await pill()).startsWith('Elastic'), 'collision-lab: elastic message');
  const ink = () => page.$eval('.cl .cl-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[i + 2]) > 60) n++; return n; });
  check((await ink()) > 300, 'collision-lab: trolleys drawn');
  await page.click('.cl .cl-go'); await page.waitForTimeout(300);
  check(await page.isDisabled('.cl .cl-go'), 'collision-lab: play runs');
  await page.waitForTimeout(4200);
  check(await page.isEnabled('.cl .cl-go'), 'collision-lab: play ends');
  await page.click('.cl .cl-e0'); await page.waitForTimeout(100);
  { const f = await facts(); check(f.includes('Velocity of 1 after2.67 m/s') && f.includes('Velocity of 2 after2.67 m/s') && (await pill()).includes('33.3%'), 'collision-lab: stick together: 2.67 m/s, 33.3% lost'); }
  await page.click('.cl .cl-e1'); await setR('.cl .cl-m2', 2);
  check((await facts()).includes('Velocity of 1 after0 m/s') && (await facts()).includes('Velocity of 2 after4 m/s'), 'collision-lab: equal masses swap speeds');
  await setR('.cl .cl-u1', -2);
  check((await page.textContent('.cl .cl-msg')).includes('never meet') && (await pill()) === 'No collision', 'collision-lab: moving apart, no collision');
  await setR('.cl .cl-u1', 4);
  await page.click('.cl .cl-mode [data-v="2d"]'); await page.waitForTimeout(150);
  check(await page.isVisible('.cl .cl-off') && !(await page.isVisible('.cl .cl-u2')), 'collision-lab: 2D controls');
  { const f = await facts(); check(f.includes('Angle between their paths90°') && f.includes('at 60°') && f.includes('at −30°') && f.includes('Momentum after (x, y)(8, 0)'), 'collision-lab: equal balls half off-centre: 60° and −30°, 90° apart, momentum (8, 0)'); }
  await setR('.cl .cl-e', 0.5);
  check(!(await facts()).includes('paths90°'), 'collision-lab: not 90° when e < 1');
  await page.click('.cl .cl-go'); await page.waitForTimeout(4500);
  check((await ink()) > 300, 'collision-lab: balls drawn after play');
  check((await page.$$('.cl .sq-q')).length === 4, 'collision-lab: four questions');
  const ans = await page.$eval('.cl .sq-q', (e) => e.dataset.ans);
  await page.fill('.cl .sq-q .sq-in', ans); await page.click('.cl .sq-q .sq-check');
  check((await page.textContent('.cl .sq-q .sq-res')) === 'Right!', 'collision-lab: quiz');
};
