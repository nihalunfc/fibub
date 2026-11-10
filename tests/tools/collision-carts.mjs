// #1257 Collision carts
export const path = '/learn/collision-carts/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/collision-carts/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.cc .cc-facts'), eq = () => page.textContent('.cc .cc-eq'), pill = () => page.textContent('.cc .cc-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  check((await pill()) === 'Press Run' && (await facts()).includes('A after0 m/s') && (await facts()).includes('B after2 m/s') && (await facts()).includes('Kinetic energy after2 J'), 'collision-carts: equal bouncy carts swap velocities');
  check(await page.$eval('.cc .cc-scene', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 300; }), 'collision-carts: scene drawn');
  await page.click('.cc .cc-go'); await page.waitForTimeout(1500);
  check((await pill()).startsWith('Bounced'), `collision-carts: run, they bounce (${await pill()})`);
  await page.click('.cc .cc-type [data-t="0"]'); await page.waitForTimeout(100);
  { const f = await facts(); check(f.includes('A after1 m/s') && f.includes('Kinetic energy after1 J') && f.includes('1 J to heat and sound') && (await eq()).includes('= 2 ÷ 2 = 1 m/s'), 'collision-carts: sticky: 1 m/s, 1 J lost'); }
  await setR('.cc .cc-u1', 1); await setR('.cc .cc-u2', 2);
  check((await pill()) === 'These carts never meet', 'collision-carts: never meet message');
  await setR('.cc .cc-u1', 2); await setR('.cc .cc-u2', -2);
  check((await facts()).includes('Momentum before0 kg m/s') && (await facts()).includes('A after0 m/s'), 'collision-carts: head-on equal sticky: both stop');
  await page.click('.cc .cc-level [data-l="11"]'); await page.waitForTimeout(100);
  check(!(await page.isHidden('.cc .cc-e-row')) && (await facts()).includes('Impulse on B') && (await eq()).includes('Restitution'), 'collision-carts: Class 11 e slider and impulse');
  await setR('.cc .cc-e', 0.5); await setR('.cc .cc-u2', 0);
  check((await facts()).includes('A after0.5 m/s') && (await facts()).includes('B after1.5 m/s'), 'collision-carts: e = 0.5, 1 kg at 2 m/s on 1 kg: 0.5 and 1.5 m/s');
  check((await page.$$('.cc .sq-q')).length === 5, 'collision-carts: Class 11 five questions');
  await page.click('.cc .cc-level [data-l="9"]'); await page.waitForTimeout(100);
  await page.click('.cc .cc-mode [data-m="recoil"]'); await page.waitForTimeout(100);
  { const f = await facts(); check(f.includes('Recoil velocity of the cannon−2 m/s') && f.includes('Total after0 kg m/s') && (await pill()) === 'Press Fire', `collision-carts: cannon recoil −2 m/s (${f})`); }
  await page.click('.cc .cc-fire'); await page.waitForTimeout(400);
  check((await pill()) === 'The cannon recoils at 2 m/s', 'collision-carts: fire');
  await page.selectOption('.cc .cc-pre', 'boat'); await page.waitForTimeout(100);
  check((await facts()).includes('Recoil velocity of the boat−1.33 m/s'), 'collision-carts: 40 kg person jumps at 2 m/s from 60 kg boat: −1.33 m/s');
  const ans = await page.$eval('.cc .sq-q', (e) => e.dataset.ans);
  await page.fill('.cc .sq-q .sq-in', ans); await page.press('.cc .sq-q .sq-in', 'Enter');
  check((await page.textContent('.cc .sq-q .sq-res')) === 'Right!', 'collision-carts: quiz answer with Enter');
};
