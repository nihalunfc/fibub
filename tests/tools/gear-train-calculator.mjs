// #643 gear train, planetary set and belt drive
export const path = '/science/gear-train-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/gear-train-calculator/`); await page.waitForTimeout(500);
  const R = '.gtc', t = (c) => page.textContent(`${R} ${c}`);
  check((await t('.gt-big')) === 'Output 160 rpm same way as the input, 172.9 N·m', `gear: example train (${await t('.gt-big')})`);
  { const f = await t('.gt-facts'); check(f.includes('9 : 1') && f.includes('96.04 %') && f.includes('in 3.016 kW, out 2.896 kW') && f.includes('72, 80 mm'), 'gear: ratio, efficiency, power, centre distances'); }
  check((await page.$$(`${R} .gt-tab tbody tr`)).length === 3 && (await t('.gt-tab')).includes('480reversed'), 'gear: shaft table');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .gt-csv`)]); const f = OUT + 'gear.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0] === 'shaft,speed_rpm,direction,torque_Nm,power_kW' && rows[3].startsWith('2,160,same as input,172.872'), 'gear: shafts CSV'); }
  await page.click(`${R} .gt-add`); await page.selectOption(`${R} .gt-row:nth-child(3) .gt-k`, 'internal'); await page.waitForTimeout(100);
  check((await t('.gt-big')).startsWith('Output 80 rpm same way'), 'gear: internal mesh added keeps direction');
  await page.click(`${R} .gt-row:nth-child(3) .gt-del`); await page.fill(`${R} .gt-row:nth-child(2) .gt-a`, '54'); await page.fill(`${R} .gt-row:nth-child(2) .gt-b`, '18'); await page.waitForTimeout(100);
  check((await t('.gt-big')).startsWith('Output 1440 rpm same way') && (await t('.gt-facts')).includes('1 : 1'), `gear: second stage undoes the first (${await t('.gt-big')})`);
  await page.fill(`${R} .gt-row:nth-child(2) .gt-a`, '2.5'); await page.waitForTimeout(100);
  check((await t('.gt-err')).includes('whole numbers') && await page.isHidden(`${R} .gt-out`), 'gear: fractional teeth message');
  // Planetary.
  check((await t('.pl-big')) === 'Carrier speed 375 rpm' && (await t('.pl-facts')).includes('4 : 1') && (await t('.pl-facts')).includes('−750 rpm') && (await t('.pl-facts')).includes('ring 30, carrier −40 N·m') && (await t('.pl-facts')).includes('3 equally spaced planets fit'), 'gear: planetary example');
  await page.fill(`${R} .pl-wr`, ''); await page.fill(`${R} .pl-wc`, '0'); await page.waitForTimeout(100);
  check((await t('.pl-big')) === 'Ring speed −500 rpm' && (await t('.pl-facts')).includes('−3 : 1'), `gear: carrier held (${await t('.pl-big')})`);
  await page.fill(`${R} .pl-np`, '5'); await page.waitForTimeout(100);
  check((await t('.pl-facts')).includes('5 planets cannot be equally spaced'), 'gear: assembly check');
  await page.fill(`${R} .pl-ws`, ''); await page.waitForTimeout(100);
  check((await t('.pl-err')).includes('exactly two'), 'gear: planetary needs two speeds');
  check(await page.isVisible(`${R} .bd-fig`), 'gear: belt drawing');
  check((await t('.bd-big')) === 'Belt length 1648.4 mm' && (await t('.bd-facts')).includes('156.9° small, 203.1° large') && (await t('.bd-facts')).includes('480 rpm') && (await t('.bd-facts')).includes('7.54 m/s'), `gear: belt example (${await t('.bd-big')})`);
  await page.selectOption(`${R} .bd-x`, 'crossed'); await page.waitForTimeout(100);
  check((await t('.bd-big')) === 'Belt length 1709.4 mm' && (await t('.bd-facts')).includes('227.2° on both'), 'gear: crossed belt');
  await page.selectOption(`${R} .bd-mode`, 'C'); await page.fill(`${R} .bd-l`, '1709.44'); await page.waitForTimeout(100);
  check((await t('.bd-big')) === 'Centre distance 500 mm', `gear: centre from length (${await t('.bd-big')})`);
  await page.fill(`${R} .bd-l`, '500'); await page.waitForTimeout(100);
  check((await t('.bd-err')).includes('too short'), 'gear: belt too short');
  await page.selectOption(`${R} .bd-mode`, 'L'); await page.fill(`${R} .bd-c`, '150'); await page.waitForTimeout(100);
  check((await t('.bd-err')).includes('overlap'), 'gear: pulleys overlap');
  await page.fill(`${R} .gt-row:nth-child(2) .gt-a`, '20'); await page.fill(`${R} .bd-c`, '500'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=png]`)]); check((await d.suggestedFilename()) === 'gear-train.png', 'gear: image report'); }
};
