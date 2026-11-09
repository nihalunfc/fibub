// #669 propeller and rotor thrust
export const path = '/science/propeller-thrust/';
export default async ({ page, check, OUT, readFileSync, BASE }) => {
  await page.goto(`${BASE}/science/propeller-thrust/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent(`.prt ${c}`);
  check((await t('.pt-big')) === 'Static thrust 8.473 N (864 g, 1.9 lbf) per rotor', `prop: momentum example (${await t('.pt-big')})`);
  { const f = await t('.pt-facts'); check(f.includes('8.261 m/s') && f.includes('ideal 70 W') && f.includes('8.64 g/W'), 'prop: induced velocity, ideal power, power loading'); }
  await page.selectOption('.prt .pt-mode', 'P'); await page.fill('.prt .pt-n', '4'); await page.selectOption('.prt .pt-tu', 'g'); await page.fill('.prt .pt-T', '864.0108'); await page.waitForTimeout(150);
  check((await t('.pt-big')) === 'Shaft power 100 W per rotor' && (await t('.pt-facts')).includes('400 W in all') && await page.isHidden('.prt .pt-P'), 'prop: power from thrust, four rotors');
  await page.selectOption('.prt .pt-mode', 'FM'); await page.fill('.prt .pt-P', '120'); await page.waitForTimeout(150);
  check((await t('.pt-big')) === 'Figure of merit 0.583', `prop: figure of merit from a test (${await t('.pt-big')})`);
  await page.fill('.prt .pt-V', '10'); await page.waitForTimeout(150);
  check((await t('.pt-facts')).includes('ideal efficiency'), 'prop: axial speed adds the ideal efficiency');
  await page.fill('.prt .pt-fm', '2'); await page.selectOption('.prt .pt-mode', 'T'); await page.waitForTimeout(150);
  check((await t('.pt-err')).includes('figure of merit') && await page.isHidden('.prt .pt-out'), 'prop: bad FM message');
  await page.fill('.prt .pt-fm', '0.7'); await page.fill('.prt .pt-V', '0'); await page.waitForTimeout(150);
  check((await t('.pb-big')) === 'Thrust 8.52 N (868.7 g, 1.92 lbf), power 96.04 W', `prop: BEM example static (${await t('.pb-big')})`);
  { const f = await t('.pb-facts'); check(f.includes('0.735') && f.includes('0.09399') && f.includes('14 of 40') && f.includes('106.4 m/s'), 'prop: BEM FM, CT, stalled rings, tip speed'); }
  await page.fill('.prt .pb-V', '10'); await page.waitForTimeout(300);
  check((await t('.pb-big')) === 'Thrust 5.28 N (538.5 g, 1.19 lbf), power 87.14 W' && (await t('.pb-facts')).includes('60.6 %') && (await t('.pb-facts')).includes('0.295'), `prop: BEM at 10 m/s (${await t('.pb-big')})`);
  await page.uncheck('.prt .pb-tip'); await page.waitForTimeout(300);
  check(!(await t('.pb-big')).startsWith('Thrust 5.28'), 'prop: tip loss switch changes the result');
  await page.check('.prt .pb-tip');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.prt .pb-csv')]); const f = OUT + 'pst.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 41 && r[0].startsWith('r_m,chord_m'), 'prop: stations CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.prt .pb-jcsv')]); const f = OUT + 'psw.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length > 10 && r[0] === 'airspeed_m_s,J,thrust_N,power_W,CT,CP,efficiency' && r[1].startsWith('0.000,0.0000,8.5'), 'prop: speed sweep CSV'); }
  await page.selectOption('.prt .pt-lu', 'in'); await page.waitForTimeout(300);
  check((await page.inputValue('.prt .pb-D')) === '10' && (await page.inputValue('.prt .pb-p')) === '5' && (await t('.pb-big')).startsWith('Thrust 5.28'), `prop: inches give the same answer (${await page.inputValue('.prt .pb-D')} ${await page.inputValue('.prt .pb-p')} ${await t('.pb-big')})`);
  await page.fill('.prt .pb-hub', '20'); await page.waitForTimeout(200);
  check((await t('.pb-err')).includes('hub diameter') && await page.isHidden('.prt .pb-out'), 'prop: hub too big message');
  await page.fill('.prt .pb-hub', '1.181');
  await page.fill('.prt .pb-cla', '50'); await page.waitForTimeout(200);
  check((await t('.pb-err')).includes('aerofoil'), 'prop: bad aerofoil message');
  await page.fill('.prt .pb-cla', '5.7'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.prt .dl button[data-f="png"]')]); check((await d.suggestedFilename()).endsWith('.png'), 'prop: image report'); }
};
