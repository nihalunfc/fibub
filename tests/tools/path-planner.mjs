// #640 path planning visualiser
export const path = '/science/path-planner/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/path-planner/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.ppv .pp-big'), facts = () => page.textContent('.ppv .pp-facts');
  check((await big()) === 'A*: length 26.73 cells, 97 cells expanded', `path-planner: example A* (${await big()})`);
  check((await facts()).includes('A* 97, Dijkstra 330') && await page.isVisible('.ppv .pp-map'), 'path-planner: expanded counts and map');
  await page.selectOption('.ppv .pp-alg', 'dijkstra'); await page.waitForTimeout(100);
  check((await big()) === 'Dijkstra: length 26.73 cells, 330 cells expanded', 'path-planner: Dijkstra same length');
  await page.selectOption('.ppv .pp-conn', '4'); await page.waitForTimeout(100);
  check((await big()).startsWith('Dijkstra: length 32.00 cells'), 'path-planner: 4 directions');
  await page.selectOption('.ppv .pp-alg', 'rrt'); await page.waitForTimeout(200);
  check((await big()) === 'RRT: length 24.59 cells, 80 tree nodes' && (await facts()).includes('30.16 cells') && await page.isHidden('.ppv .pp-conn'), `path-planner: RRT with shortcuts (${await big()})`);
  await page.uncheck('.ppv .pp-smooth'); await page.waitForTimeout(150);
  check((await big()) === 'RRT: length 30.16 cells, 80 tree nodes', 'path-planner: RRT without shortcuts');
  await page.fill('.ppv .pp-seed', '2'); await page.waitForTimeout(150);
  check((await big()).startsWith('RRT: length') && (await big()) !== 'RRT: length 30.16 cells, 80 tree nodes', 'path-planner: another seed');
  await page.fill('.ppv .pp-iters', '3'); await page.waitForTimeout(150);
  check((await big()).startsWith('No path after 3 iterations'), 'path-planner: RRT gives up');
  await page.fill('.ppv .pp-step', '0'); await page.waitForTimeout(150);
  check((await big()).startsWith('Check the RRT settings'), 'path-planner: bad RRT settings');
  await page.fill('.ppv .pp-step', '1.5'); await page.fill('.ppv .pp-iters', '3000'); await page.fill('.ppv .pp-seed', '1'); await page.check('.ppv .pp-smooth');
  await page.selectOption('.ppv .pp-alg', 'astar'); await page.selectOption('.ppv .pp-conn', '8'); await page.waitForTimeout(150);
  // Draw a wall cell on the straight route and see the path change.
  const map = page.locator('.ppv .pp-map'); await map.scrollIntoViewIfNeeded();
  const at = async (x, y) => { const b = await map.boundingBox(); await page.mouse.click(b.x + (x + 0.5) * b.width / 24, b.y + (y + 0.5) * b.height / 16); await page.waitForTimeout(120); };
  const open = async () => +(await page.evaluate(() => [...document.querySelectorAll('.ppv .pp-facts div')].find((d) => d.querySelector('dt').textContent === 'Open cells').querySelector('dd').childNodes[0].textContent));
  const before = await open(); await at(3, 2);
  check((await open()) === before - 1, 'path-planner: tap adds a wall');
  await page.click('.ppv .pp-tools [data-t=erase]'); await map.scrollIntoViewIfNeeded(); await at(3, 2);
  check((await big()) === 'A*: length 26.73 cells, 97 cells expanded', 'path-planner: erase restores the map');
  // Move the goal next to the start.
  await page.click('.ppv .pp-tools [data-t=goal]'); await map.scrollIntoViewIfNeeded(); await at(5, 1);
  check((await big()).startsWith('A*: length 3.00 cells'), `path-planner: move the goal (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ppv .pp-csv')]); const f = OUT + 'pp.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 5 && r[0] === 'step,x_cells,y_cells,distance_so_far' && r[4] === '3,5.5,1.5,3', 'path-planner: path CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ppv .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'path-planner: image report'); }
  // Wall the goal in.
  await page.click('.ppv .pp-tools [data-t=wall]'); await map.scrollIntoViewIfNeeded();
  for (const [x, y] of [[4, 0], [5, 0], [6, 0], [4, 1], [6, 1], [4, 2], [5, 2], [6, 2]]) await at(x, y);
  check((await big()).startsWith('No path: the goal cannot be reached'), 'path-planner: blocked goal');
  await page.click('.ppv .pp-clear'); await page.waitForTimeout(100);
  check((await big()).startsWith('A*: length 3.00 cells'), 'path-planner: clear walls');
  await page.fill('.ppv .pp-dens', '30'); await page.click('.ppv .pp-random'); await page.waitForTimeout(150);
  check((await facts()).includes('24 × 16 map') || (await big()).startsWith('No path'), 'path-planner: random walls');
  await page.selectOption('.ppv .pp-size', '32x22'); await page.waitForTimeout(150);
  check((await facts()).includes('32 × 22 map') || (await big()).startsWith('No path'), 'path-planner: bigger map');
  await page.click('.ppv .pp-example'); await page.waitForTimeout(150);
  check((await big()) === 'A*: length 26.73 cells, 97 cells expanded', 'path-planner: example map again');
};
