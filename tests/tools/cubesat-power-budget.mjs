// #510 CubeSat power budget
export const path = '/science/cubesat-power-budget/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.csp ';
  const t = (s) => page.textContent(R + s);
  const wait = () => page.waitForTimeout(450);
  await page.goto(`${BASE}/science/cubesat-power-budget/`); await page.waitForTimeout(700);
  check((await t('.cp-big')) === 'Nominal: power positive, +13.05 Wh per orbit, deepest DoD 8.3 %', 'cubesat: example verdict');
  { const f = await t('.cp-facts'); check(f.includes('Orbit period94.6 min') && f.includes('Eclipse35.0 min37.0 % of the orbit; none above β 68.0°') && f.includes('10.97 W17.41 W') && f.includes('Array derating80.9 %'), 'cubesat: example facts'); }
  { const m = await t('.cp-modes'); check(m.includes('Nominal2.704.26+13.058.3100.0OK') && m.includes('Payload8.2012.93+4.3725.1100.0DoD over the limit') && m.includes('Safe1.582.49+14.814.8'), 'cubesat: every operating mode'); }
  check((await t('.cp-pans')).includes('Body +X+X3408.90') && await page.isVisible(R + '.cp-fig1') && await page.isVisible(R + '.cp-fig2'), 'cubesat: panel table and charts');
  check(await page.isHidden(R + '.cp-face'), 'cubesat: face picker hidden unless Sun pointing');
  // Operating mode picker.
  await page.selectOption(R + '.cp-mode', 'Payload'); await wait();
  check((await t('.cp-big')) === 'Payload: dod over the limit, +4.37 Wh per orbit, deepest DoD 25.1 %', 'cubesat: payload mode over the DoD limit');
  await page.fill(R + '.cp-cap', '30'); await wait();
  check((await t('.cp-big')).startsWith('Payload: power positive') && (await t('.cp-big')).endsWith('16.8 %'), `cubesat: bigger battery (${await t('.cp-big')})`);
  // Beta angle: no eclipse above beta*.
  await page.fill(R + '.cp-b', '75'); await wait();
  check((await t('.cp-facts')).includes('Eclipse0.0 minnone: |β| is above 68.0°') && (await t('.cp-big')).endsWith('deepest DoD 0.0 %'), 'cubesat: no shadow above beta*');
  await page.fill(R + '.cp-b', '0'); await wait();
  check((await t('.cp-facts')).includes('Eclipse35.8 min'), 'cubesat: longest shadow at beta 0');
  // Attitudes.
  await page.selectOption(R + '.cp-att', 'sun'); await wait();
  check(await page.isVisible(R + '.cp-face') && (await t('.cp-facts')).includes('17.81 W average in sunlight'), 'cubesat: Sun pointing -Z: both wings square to the Sun');
  await page.selectOption(R + '.cp-face', '+X'); await wait();
  check((await t('.cp-facts')).includes('8.91 W average in sunlight'), `cubesat: Sun pointing +X: one body panel (${await t('.cp-facts')})`);
  await page.selectOption(R + '.cp-att', 'tumble'); await wait();
  check((await t('.cp-facts')).includes('13.36 W average in sunlight'), 'cubesat: tumbling: a quarter of every panel');
  await page.selectOption(R + '.cp-att', 'nadir'); await page.fill(R + '.cp-b', '20'); await page.fill(R + '.cp-cap', '20');
  // Derating inputs.
  await page.fill(R + '.cp-yr', '0'); await page.fill(R + '.cp-t', '28'); await page.fill(R + '.cp-ot', '100'); await wait();
  check((await t('.cp-facts')).includes('Array derating100.0 %') && (await t('.cp-pans')).includes('11.01'), 'cubesat: no derating gives the bare cell power');
  await page.fill(R + '.cp-yr', '2'); await page.fill(R + '.cp-t', '50'); await page.fill(R + '.cp-ot', '90'); await wait();
  // Too much load: battery runs flat.
  await page.fill(R + '.cp-ld', 'Load, Power (W), Hungry\nHeater, 30, 100'); await wait();
  check((await t('.cp-big')).startsWith('Hungry: battery runs flat'), 'cubesat: battery runs flat');
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cp-csv')]); const f = OUT + 'cp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'time_min,generation_W,load_W,battery_pct' && rows.length === 3 * 1440 + 2 && rows[1] === '0,,30,100', 'cubesat: simulation CSV'); }
  // Bad inputs.
  await page.fill(R + '.cp-ld', 'Load, Power (W), M\nX, 1, 150'); await wait();
  check((await t('.cp-err')).includes('must be 0 to 100 %'), 'cubesat: bad duty cycle message');
  await page.fill(R + '.cp-pan', 'Panel, Face, Area\nOdd, +W, 100'); await wait();
  check((await t('.cp-err')).includes('the face must be'), 'cubesat: bad face message');
  await page.fill(R + '.cp-h', '50'); await wait();
  check((await t('.cp-err')).includes('altitude from 150'), 'cubesat: bad altitude message');
};
