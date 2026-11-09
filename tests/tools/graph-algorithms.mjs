// #556 graph editor with algorithms
export const path = '/science/graph-algorithms/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const vp0 = page.viewportSize();
  await page.goto(`${BASE}/science/graph-algorithms/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.gra .ga-big'), tab = () => page.textContent('.gra .ga-tab');
  const alg = async (v) => { await page.selectOption('.gra .ga-alg', v); await page.waitForTimeout(150); };
  check((await big()) === 'Shortest path A → G: 22 (A → D → F → G)', 'graph: example road network, Dijkstra A to G');
  check((await tab()).includes('A → D → F') && (await page.textContent('.gra .ga-facts')).includes('7 nodes, 11 edges, undirected, weighted'), 'graph: distance table and graph facts');
  await page.selectOption('.gra .ga-t', 'C'); await page.waitForTimeout(150);
  check((await big()).startsWith('Shortest path A → C: 15'), 'graph: another end node');
  await alg('bellman'); check((await big()).startsWith('Shortest path A → C: 15') && (await page.textContent('.gra .ga-facts')).includes('Bellman-Ford'), 'graph: Bellman-Ford agrees');
  await alg('bfs'); check((await big()) === 'Breadth-first order from A: A, B, D, C, E, F, G' && await page.isHidden('.gra .ga-tl'), 'graph: BFS order (networkx) and no end picker');
  await alg('dfs'); check((await big()) === 'Depth-first order from A: A, B, C, E, D, F, G' && (await tab()).includes('Finished'), 'graph: DFS preorder (networkx)');
  await alg('kruskal'); check((await big()) === 'Minimum spanning tree: total weight 39 (6 edges)' && await page.isHidden('.gra .ga-sl'), 'graph: Kruskal MST 39');
  await alg('prim'); check((await big()) === 'Minimum spanning tree: total weight 39 (6 edges)', 'graph: Prim MST 39');
  await alg('flow'); await page.selectOption('.gra .ga-s', 'A'); await page.selectOption('.gra .ga-t', 'G'); await page.waitForTimeout(150);
  check((await big()) === 'Maximum flow A → G: 12' && (await page.textContent('.gra .ga-facts')).includes('Minimum cut capacity12'), 'graph: undirected max flow 12 = min cut');
  await alg('largest'); check((await big()).startsWith('3 colours') && (await page.textContent('.gra .ga-leg')).includes('Colour 3'), 'graph: greedy colouring 3 colours with legend');
  await alg('dsatur'); check((await big()).startsWith('3 colours') && (await page.textContent('.gra .ga-facts')).includes('DSatur'), 'graph: DSatur 3 colours');
  await alg('central'); check((await big()) === 'Most central by betweenness: E (0.2333)' && await page.isVisible('.gra .ga-ml'), 'graph: betweenness E 0.2333');
  await page.selectOption('.gra .ga-m', 'clo'); await page.waitForTimeout(150); check((await big()) === 'Most central by closeness: E (0.1053)', 'graph: closeness E 0.1053');
  await page.selectOption('.gra .ga-m', 'deg'); await page.waitForTimeout(150); check((await big()) === 'Most central by degree: E (0.8333)', 'graph: degree E 0.8333');
  await alg('topo'); check((await page.textContent('.gra .ga-aerr')).includes('needs a directed graph') && await page.isHidden('.gra .ga-big'), 'graph: topological order needs a directed graph');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gra .ga-txt')]); const f = OUT + 'graph.txt'; await d.saveAs(f); check(readFileSync(f, 'utf8').startsWith('A B 7\nA D 5'), 'graph: edge list download'); }

  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.gra .dl button[data-f=${f}]`)]); check(d.suggestedFilename() === `graph-topo.${f}`, `graph: report download ${f}`); }
  await page.selectOption('.gra .ga-ex', 'flow'); await page.waitForTimeout(400);
  check((await big()) === 'Maximum flow S → T: 19' && (await page.textContent('.gra .ga-facts')).includes('Source sideS, C'), 'graph: pipe example: max flow 19, source side S, C (networkx)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gra .ga-csv')]); const f = OUT + 'flow.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 10 && rows[0] === 'Edge,Capacity,Flow,In the minimum cut' && rows.filter((r) => r.endsWith(',yes')).length >= 1, 'graph: flow table CSV'); }
  await page.selectOption('.gra .ga-ex', 'dag'); await page.waitForTimeout(400);
  check((await big()) === 'Topological order: Plan → Design → Budget → Build → Test → Docs → Release', 'graph: task plan topological order');
  await page.fill('.gra .ga-in', 'a b\nb c\nc a\nc d'); await page.waitForTimeout(600);
  check((await page.textContent('.gra .ga-aerr')).startsWith('No topological order: the graph has a cycle') && (await page.textContent('.gra .ga-leg')).includes('Cycle'), 'graph: a cycle blocks the order');
  await alg('bellman'); await page.fill('.gra .ga-in', 's a 4\na b -6\nb a 1\nb t 2'); await page.waitForTimeout(600);
  check((await page.textContent('.gra .ga-aerr')).includes('negative cycle'), 'graph: Bellman-Ford reports the negative cycle');
  await alg('dijkstra'); check((await page.textContent('.gra .ga-aerr')).includes('Use Bellman-Ford'), 'graph: Dijkstra refuses negative weights');
  await page.fill('.gra .ga-in', 'A B 1\nA C x'); await page.waitForTimeout(600);
  check((await page.textContent('.gra .ga-err')).startsWith('Line 2: "x" is not a number') && await page.isHidden('.gra .ga-out'), 'graph: bad weight message');
  await page.fill('.gra .ga-in', 'A B 2\nB B 1\nA B 3'); await page.waitForTimeout(600);
  check((await page.textContent('.gra .ga-note')).includes('loop') && (await page.textContent('.gra .ga-note')).includes('repeated edge'), 'graph: notes on loops and repeats');

  // Drawing: start empty, add three nodes, join two of them, then delete one.
  await page.selectOption('.gra .ga-ex', 'empty'); await page.waitForTimeout(300);
  const cv = page.locator('.gra .ga-cv'); await cv.scrollIntoViewIfNeeded();
  const bb = await cv.boundingBox(), at = (fx, fy) => [bb.x + fx * bb.width, bb.y + fy * bb.height];
  await page.click('.gra .ga-mode button[data-m=node]');
  for (const [fx, fy] of [[0.2, 0.3], [0.7, 0.3], [0.45, 0.8]]) { await cv.scrollIntoViewIfNeeded(); await page.mouse.click(...at(fx, fy)); await page.waitForTimeout(100); }
  check((await page.inputValue('.gra .ga-in')) === 'A\nB\nC', 'graph: three nodes added by tapping');
  await page.click('.gra .ga-mode button[data-m=edge]'); await page.fill('.gra .ga-w', '4');
  await cv.scrollIntoViewIfNeeded(); await page.mouse.click(...at(0.2, 0.3)); await page.mouse.click(...at(0.7, 0.3)); await page.waitForTimeout(500);
  await page.mouse.click(...at(0.7, 0.3)); await page.mouse.click(...at(0.45, 0.8)); await page.waitForTimeout(500);
  check((await page.inputValue('.gra .ga-in')).replace(/\s+/g, ' ').trim() === 'A B C A B 4 B C 4', 'graph: two edges drawn with weight 4');
  await alg('dijkstra'); await page.selectOption('.gra .ga-s', 'A'); await page.selectOption('.gra .ga-t', 'C'); await page.waitForTimeout(200);
  check((await big()) === 'Shortest path A → C: 8 (A → B → C)', 'graph: drawn graph is solved');
  await page.click('.gra .ga-mode button[data-m=del]'); await cv.scrollIntoViewIfNeeded(); await page.mouse.click(...at(0.45, 0.3)); await page.waitForTimeout(500);
  check((await page.inputValue('.gra .ga-in')) === 'B C 4\nA', 'graph: edge deleted by tapping it');
  await page.click('.gra .ga-mode button[data-m=move]'); await cv.scrollIntoViewIfNeeded();
  await page.mouse.move(...at(0.45, 0.8)); await page.mouse.down(); await page.mouse.move(...at(0.8, 0.85), { steps: 4 }); await page.mouse.up();
  check((await big()) === 'C cannot be reached from A', 'graph: dragging a node keeps the graph; unreachable end reported');
  await page.check('.gra .ga-dir'); await page.waitForTimeout(300);
  check((await page.textContent('.gra .ga-facts')).includes('directed, weighted'), 'graph: directed switch');
  await page.selectOption('.gra .ga-ex', 'road'); await page.waitForTimeout(400);
  await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(300);
  await page.locator('.gra .ga-cv').scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + 'graph-375.png' });
  await page.setViewportSize(vp0);
};
