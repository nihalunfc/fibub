// #586 vehicle routing for small instances
export const path = '/science/vehicle-routing/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/vehicle-routing/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.vrx .vr-big'), facts = () => page.textContent('.vrx .vr-facts'), tab = () => page.textContent('.vrx .vr-tab');
  check((await big()) === 'Shortest possible: 3 routes, total distance 404.12', 'vrp: example optimum 404.12 (scipy MILP)');
  check((await tab()).includes('Depot → Shop 8 → Shop 9 → Shop 1 → Shop 2 → Depot') && (await tab()).includes('14 of 15') && (await tab()).includes('161.1'), 'vrp: route table');
  check((await facts()).includes('Exact optimum404.12 (heuristic found it)') && (await facts()).includes('3 of 3 used') && (await facts()).includes('at least 3 needed'), 'vrp: facts compare savings, improvement and exact');
  check(await page.isVisible('.vrx .vr-map') && (await page.textContent('.vrx .vr-leg')).includes('Route 3'), 'vrp: map and legend');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.vrx .vr-csv')]); const f = OUT + 'routes.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'route,order,stop,x,y,demand,load_so_far,leg_distance,distance_so_far' && r.length === 1 + 3 * 2 + 10 && r[1].startsWith('1,0,Depot,50,50,0'), 'vrp: stops CSV'); }
  for (const x of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.vrx .dl button[data-f=${x}]`)]); check(d.suggestedFilename() === `vehicle-routes.${x}`, `vrp: report download ${x}`); }
  await page.fill('.vrx .vr-k', '2'); await page.waitForTimeout(700);
  check((await page.textContent('.vrx .vr-err')).includes('No plan fits in 2 vehicles') && await page.isHidden('.vrx .vr-out'), 'vrp: too few vehicles explained');
  await page.fill('.vrx .vr-k', ''); await page.fill('.vrx .vr-cap', '40'); await page.waitForTimeout(700);
  check((await big()).startsWith('Shortest possible: 1 route') && (await facts()).includes('1 used'), 'vrp: one big vehicle = a single tour');
  await page.fill('.vrx .vr-cap', '5'); await page.waitForTimeout(700);
  check((await page.textContent('.vrx .vr-err')).includes('Shop 5 needs 6, more than one vehicle carries (5)'), 'vrp: demand above capacity');
  await page.fill('.vrx .vr-cap', '15'); await page.fill('.vrx .vr-k', '3');
  // 14 customers: heuristic only.
  const many = ['name,x,y,demand', 'D,0,0,0', ...Array.from({ length: 14 }, (_, i) => `P${i + 1},${Math.round(40 * Math.cos(i))},${Math.round(40 * Math.sin(i * 1.3))},${1 + (i % 4)}`)].join('\n');
  await page.fill('.vrx .vr-xy', many); await page.waitForTimeout(800);
  check((await big()).startsWith('Good plan:') && (await facts()).includes('not run (over 12 customers)'), 'vrp: over 12 customers uses the heuristic');
  check(await page.isVisible('.vrx .vr-warn') === ((await page.$$('.vrx .vr-tab tr')).length - 2 > 3), 'vrp: warns only if it needs more vehicles than available');
  await page.fill('.vrx .vr-xy', 'Depot,0,0\nA,1,x,2'); await page.waitForTimeout(700);
  check((await page.textContent('.vrx .vr-err')).includes('Line 2: x and y must be numbers'), 'vrp: bad coordinate message');
  // Distance table.
  await page.click('.vrx .vr-kind button[data-k=dm]'); await page.waitForTimeout(700);
  check((await big()).startsWith('Shortest possible: 3 routes') && (await page.textContent('.vrx .vr-mnote')).includes('multidimensional scaling'), 'vrp: example as a distance table');
  await page.fill('.vrx .vr-dm', '0 4 6\n4 0 3\n6 5 0'); await page.fill('.vrx .vr-dem', '2, 2'); await page.fill('.vrx .vr-cap', '10'); await page.waitForTimeout(800);
  check((await big()) === 'Shortest possible: 1 route, total distance 14' && (await page.textContent('.vrx .vr-note')).includes('not symmetric'), 'vrp: asymmetric table averaged (3 and 5 become 4: 4 + 4 + 6 = 14)');
  await page.fill('.vrx .vr-dem', '2'); await page.waitForTimeout(700);
  check((await page.textContent('.vrx .vr-err')).includes('Give 2 demands'), 'vrp: demand count message');
  writeFileSync(OUT + 'dist.csv', ',Depot,A,B\nDepot,0,5,5\nA,5,0,8\nB,5,8,0\n');
  await page.fill('.vrx .vr-dem', '3, 3');
  await page.setInputFiles('.vrx .vr-dmw .dfb-in', OUT + 'dist.csv'); await page.waitForTimeout(800);
  check((await big()) === 'Shortest possible: 1 route, total distance 18' && /Depot → (A → B|B → A) → Depot/.test(await tab()), 'vrp: distance table from a file with names');
  await page.click('.vrx .vr-kind button[data-k=xy]'); await page.click('.vrx .vr-ex'); await page.waitForTimeout(600);
  await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(400);
  await page.locator('.vrx .vr-map').scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + 'vrp-375.png' });
  await page.setViewportSize({ width: 1280, height: 800 });
};
