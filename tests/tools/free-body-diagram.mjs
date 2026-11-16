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

  // ---- Solve my numbers ----
  await page.goto(`${BASE}/learn/free-body-diagram/`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) await page.fill(`.ps-host [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await psPre('Atwood 5 kg and 3 kg'); check((await psAns()).includes('Acceleration 2.45 m/s² (mass 1 goes down), tension 36.8 N'), 'free-body-diagram: example Atwood 5 kg and 3 kg: Acceleration 2.45 m/s² (mass 1 goes down), tension');
  await psPre('Lift going up at 2 m/s²'); check((await psAns()).includes('The scales read 708 N'), 'free-body-diagram: example Lift going up at 2 m/s²: The scales read 708 N');
  await psPre('Lift in free fall'); check((await psAns()).includes('The scales read 0 N'), 'free-body-diagram: example Lift in free fall: The scales read 0 N');
  await psPre('Table and hanging mass'); check((await psAns()).includes('Acceleration 1.96 m/s², tension 15.7 N'), 'free-body-diagram: example Table and hanging mass: Acceleration 1.96 m/s², tension 15.7 N');
  await psPre('Two blocks, 30 N'); check((await psAns()).includes('Acceleration 5 m/s²; block 1 pushes block 2 with 10 N'), 'free-body-diagram: example Two blocks, 30 N: Acceleration 5 m/s²; block 1 pushes block 2 with 1');
  await psPre('Rope at 30°'); check((await psAns()).includes('Normal force 92.6 N; it accelerates at 2.07 m/s²'), 'free-body-diagram: example Rope at 30°: Normal force 92.6 N; it accelerates at 2.07 m/s²');
  await psSet('atwood', {'atwood-m1': '2000', 'atwood-m2': '3'}); check((await psAns()).includes('Acceleration'), 'free-body-diagram: atwood Acceleration');
  await page.click('.ps-host .ps-pre button'); await page.waitForTimeout(80);
  check((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), 'free-body-diagram: working shown, no NaN');
};
