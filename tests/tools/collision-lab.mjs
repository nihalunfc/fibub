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

  // ---- Solve my numbers ----
  await page.goto(`${BASE}/learn/collision-lab/`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) await page.fill(`.ps-host [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await psPre('Equal masses, elastic'); check((await psAns()).includes('body 1 moves at 0 m/s and body 2 at 3 m/s'), 'collision-lab: example Equal masses, elastic: body 1 moves at 0 m/s and body 2 at 3 m/s');
  await psPre('Head-on, e = 0.5'); check((await psAns()).includes('body 1 moves at 1 m/s and body 2 at 4 m/s. Kinetic energy lost: 9 J'), 'collision-lab: example Head-on, e = 0.5: body 1 moves at 1 m/s and body 2 at 4 m/s. Kinetic');
  await psPre('Cars stick'); check((await psAns()).includes('They move together at 9 m/s. Kinetic energy lost: 54000 J (40 %)'), 'collision-lab: example Cars stick: They move together at 9 m/s. Kinetic energy lost: ');
  await psPre('Find e'); check((await psAns()).includes('e = 0.5'), 'collision-lab: example Find e: e = 0.5');
  await psPre('Bouncing ball'); check((await psAns()).includes('e = 0.8; after bounce 3 the ball rises to 0.524 m'), 'collision-lab: example Bouncing ball: e = 0.8; after bounce 3 the ball rises to 0.524 m');
  await psSet('e', {'e-v2': '8'}); check((await psAns()).includes('outside 0 to 1'), 'collision-lab: e outside 0 to 1');
  await psSet('bounce', {'bounce-h2': '3'}); check((await psAns()).includes('cannot be higher'), 'collision-lab: bounce cannot be higher');
  await page.click('.ps-host .ps-pre button'); await page.waitForTimeout(80);
  check((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), 'collision-lab: working shown, no NaN');
};
