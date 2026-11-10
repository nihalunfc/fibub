// #1333 free-body diagram builder
export const path = '/learn/free-body-diagram/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/free-body-diagram/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.fb .fb-facts'), res = () => page.textContent('.fb .fb-res');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('Acceleration3.84 m/s²') && f.includes('Normal force N34 N') && f.includes('Friction6.8 N'), 'free-body-diagram: example pull 30 N at 30°: N 34 N, a 3.84 m/s²'); }
  const tick = async (vals) => { for (const v of vals) await page.check(`.fb .fb-checks input[value="${v}"]`); await page.waitForTimeout(80); };
  await tick(['weight', 'normal', 'applied', 'motion']); await page.click('.fb .fb-check'); await page.waitForTimeout(100);
  { const r = await res(); check(r.includes('Missing: friction') && r.includes('Not a force: "force of motion"'), `free-body-diagram: check finds missing friction and a fake force (${r})`); }
  await page.uncheck('.fb .fb-checks input[value="motion"]'); await tick(['friction']); await page.click('.fb .fb-check'); await page.waitForTimeout(100);
  check((await res()).startsWith('Right! 4 forces'), 'free-body-diagram: four forces on the box is right');
  const ink = (sel) => page.$eval(sel, (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[i + 2]) > 60) n++; return n; });
  check((await ink('.fb .fb-fbd')) > 100, 'free-body-diagram: diagram drawn');
  await page.selectOption('.fb .fb-set', 'atwood'); await page.waitForTimeout(100);
  check(await page.isVisible('.fb .fb-body button') && (await page.$$('.fb .fb-body button')).length === 2, 'free-body-diagram: Atwood has two bodies');
  check(!(await page.isVisible('.fb .fb-F')) && !(await page.isVisible('.fb .fb-mu')), 'free-body-diagram: only mass sliders for Atwood');
  await setR('.fb .fb-m1', 3); await setR('.fb .fb-m2', 5);
  { const f = await facts(); check(f.includes('Acceleration2.45 m/s²') && f.includes('Tension T36.75 N'), 'free-body-diagram: Atwood 3 and 5 kg: 2.45 m/s², 36.75 N'); }
  await page.click('.fb .fb-show'); await page.waitForTimeout(100);
  check(await page.isChecked('.fb .fb-checks input[value="tension"]') && !(await page.isChecked('.fb .fb-checks input[value="normal"]')), 'free-body-diagram: show answer ticks weight and tension');
  await page.selectOption('.fb .fb-set', 'lift'); await setR('.fb .fb-m1', 20); await setR('.fb .fb-la', 2);
  check((await facts()).includes('Scale push N236 N'), 'free-body-diagram: lift 20 kg at +2: N = 236 N');
  await setR('.fb .fb-la', -9.8);
  check((await page.textContent('.fb .fb-pill')).includes('Free fall'), 'free-body-diagram: free fall');
  await page.selectOption('.fb .fb-set', 'push2'); await setR('.fb .fb-m1', 2); await setR('.fb .fb-m2', 3); await setR('.fb .fb-F', 20);
  check((await facts()).includes('Push between the blocks12 N'), 'free-body-diagram: push 20 N on 2 + 3 kg: 12 N between');
  await page.click('.fb .fb-body button:nth-child(2)'); await tick(['weight', 'normal', 'contact']); await page.click('.fb .fb-check'); await page.waitForTimeout(100);
  check((await res()).startsWith('Right! 3 forces'), 'free-body-diagram: block B has three forces');
  await page.selectOption('.fb .fb-set', 'table'); await setR('.fb .fb-m1', 4); await setR('.fb .fb-m2', 2); await setR('.fb .fb-mu', 0.25);
  check((await facts()).includes('Acceleration1.63 m/s²') && (await facts()).includes('Tension T16.33 N'), 'free-body-diagram: table and pulley');
  await page.selectOption('.fb .fb-set', 'slope'); await setR('.fb .fb-m1', 2); await setR('.fb .fb-a', 30); await setR('.fb .fb-mu', 0.2);
  check((await facts()).includes('Acceleration3.2 m/s²'), 'free-body-diagram: slope 30° μ 0.2: 3.2 m/s²');
  check((await page.$$('.fb .sq-q')).length === 4, 'free-body-diagram: four questions');
  const ans = await page.$eval('.fb .sq-q', (e) => e.dataset.ans);
  await page.fill('.fb .sq-q .sq-in', ans); await page.click('.fb .sq-q .sq-check');
  check((await page.textContent('.fb .sq-q .sq-res')) === 'Right!', 'free-body-diagram: quiz');
};
