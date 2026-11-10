// #1275 Nitrogen cycle game
import { STORES, shortest, shortestLoop } from '../../src/lib/sci/nitrogen-cycle.ts';
export const path = '/learn/nitrogen-cycle/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/nitrogen-cycle/`); await page.waitForSelector('.nc .nc-fig .nc-atom');
  const R = '.nc ', txt = (s) => page.textContent(R + s);
  const press = (id) => page.click(`${R}.nc-btns button[data-id="${id}"]`);
  check((await txt('.nc-ask')).includes('Get it to Animals') && (await txt('.nc-ask')).includes('Fewest steps: 3'), 'nitrogen: first challenge air to animals');
  check((await page.$$(R + '.nc-fig path.nc-arr')).length === 11 && (await page.$$(R + '.nc-list li')).length === 11, 'nitrogen: eleven arrows and descriptions');
  await press('eat'); check((await txt('.nc-out')).startsWith('That process does not start here.') && (await txt('.nc-out')).includes('Nitrogen fixation, Lightning, Fertiliser factory'), 'nitrogen: wrong process explained');
  await press('light'); check((await txt('.nc-out')).startsWith('Lightning.') && (await page.$$(R + '.nc-arr.on')).length === 1, 'nitrogen: lightning moves the atom');
  await press('assimN'); await press('eat');
  check((await txt('.nc-out')).startsWith('Made it in 3 steps!') && (await txt('.nc-out')).includes('fewest possible') && (await page.$$(R + '.nc-path li')).length === 3, 'nitrogen: air to animals in 3');
  // Level switch.
  await page.click(R + '.nc-lvl button[data-l="11"]');
  check((await txt('.nc-list')).includes('Nitrosomonas') && (await txt('.nc-fig')).includes('NH₃ / NH₄⁺'), 'nitrogen: Class 11 detail');
  // A new challenge: solve it by the fewest path read from the hint, using the list of moves.
  for (let round = 0; round < 3; round++) {
    await page.click(R + '.nc-new');
    const ask = await txt('.nc-ask'), best = Number(/Fewest steps: (\d+)/.exec(ask)[1]);
    const name = (n) => Object.keys(STORES).find((k) => STORES[k].name === n);
    const from = name(/atom is in (.+?)\. /.exec(ask)[1]), to = /back again/.test(ask) ? from : name(/Get it to (.+?) \(green/.exec(ask)[1]);
    for (const id of from === to ? shortestLoop(from) : shortest(from, to)) await press(id);
    check((await txt('.nc-out')).startsWith(`Made it in ${best} step`) && (await txt('.nc-out')).includes('fewest possible'), `nitrogen: new challenge solved (${ask})`);
  }
  // Name the arrow.
  await page.click(R + '.nc-mode button[data-m="name"]');
  check((await page.$$(R + '.nc-btns button')).length === 4 && (await page.$$(R + '.nc-arr.on')).length === 1, 'nitrogen: name mode shows four choices and one lit arrow');
  const lit = /Arrow (\d+) is lit up/.exec(await txt('.nc-ask'))[1];
  const names = await page.$$eval(R + '.nc-list li b', (b) => b.map((x) => x.textContent.replace(/ \(people\)/, '').replace(/: $/, '')));
  await page.click(`${R}.nc-btns button:text-is("${names[Number(lit) - 1]}")`);
  check((await txt('.nc-out')).startsWith('Right!') && (await txt('.nc-out')).includes('1 of 1 right'), `nitrogen: named arrow ${lit}`);
  await page.click(R + '.nc-new'); check((await page.$$(R + '.nc-btns button')).length === 4, 'nitrogen: next arrow');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'nitrogen: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const qt = await txt(`.sm-q:nth-child(${i}) .sm-qt`), wk = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    let ans;
    if (i < 4) { const nm = wk.split(':')[0]; ans = /\((\d)\) (.+?)(?=\s+\(\d\) |\s*$)/g; let m; while ((m = ans.exec(qt))) if (m[2].trim() === nm) { ans = m[1]; break; } }
    else ans = /\((\d+) steps\)/.exec(wk)[1];
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, String(ans)); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `nitrogen: quiz ${i} (${qt} | ${wk})`);
  }
};
