// #588 network metrics
export const path = '/science/network-metrics/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const vp0 = page.viewportSize();
  await page.goto(`${BASE}/science/network-metrics/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.nmx .nm-big'), facts = () => page.textContent('.nmx .nm-facts');
  check((await big()) === '34 nodes, 83 links: 3 communities (modularity 0.494)', 'network: example summary');
  { const f = await facts(); check(['Density0.148', 'Components1 (largest 34)', 'Diameter5', 'Average path length2.537', 'Average clustering0.2391', 'Transitivity0.1886', 'Degree assortativity0.137', 'Modularity0.4936'].every((s) => f.includes(s)), 'network: example measures as networkx'); }
  check((await page.textContent('.nmx .nm-tab tr:nth-child(2)')).startsWith('B17') && (await page.textContent('.nmx .nm-tab tr:nth-child(2)')).includes('0.039413'), 'network: B1 has the highest PageRank 0.039413');
  { const t = await page.textContent('.nmx .nm-ctab'); check(t.includes('A1, A2') && (await page.$$('.nmx .nm-ctab tr')).length === 4, 'network: three communities listed'); }
  check(await page.isVisible('.nmx .nm-net') && await page.isVisible('.nmx .nm-deg'), 'network: drawing and degree plot shown');
  await page.selectOption('.nmx .nm-dd', 'c'); await page.waitForTimeout(150);
  check((await page.getAttribute('.nmx .nm-deg', 'aria-label')).includes('Degree distribution'), 'network: cumulative plot');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.nmx .nm-csv')]); const f = OUT + 'nodes.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 35 && r[0] === 'Node,Degree,Clustering,PageRank,Community,Component' && r[1] === 'B1,7,0.09524,0.039413,3,1', 'network: nodes CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.nmx .nm-dcsv')]); const f = OUT + 'deg.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 7 && r[1] === '2,1,0.0294118,1', 'network: degree distribution CSV'); }
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.nmx .dl button[data-f=${f}]`)]); check(d.suggestedFilename() === `network-metrics.${f}`, `network: report download ${f}`); }
  await page.fill('.nmx .nm-alpha', '0.5'); await page.waitForTimeout(600);
  check((await page.textContent('.nmx .nm-fnote')).includes('damping 0.5') && !(await page.textContent('.nmx .nm-tab tr:nth-child(2)')).includes('0.039413'), 'network: damping changes PageRank');
  await page.fill('.nmx .nm-alpha', '1.5'); await page.waitForTimeout(600);
  check((await page.textContent('.nmx .nm-err')).includes('between 0 and 1') && await page.isHidden('.nmx .nm-out'), 'network: bad damping message');
  await page.fill('.nmx .nm-alpha', '0.85');
  // A directed network with weights, as a file.
  writeFileSync(OUT + 'net.csv', 'source,target,weight\nv0,v7,1\nv1,v7,1\nv9,v6,1\nv8,v3,1\nv7,v9,1\nv2,v8,1\nv0,v6,1\nv4,v1,1\nv9,v4,1\nv8,v5,1\nv4,v2,1\nv2,v4,1\nv6,v1,1\nv7,v5,1\nv7,v2,1\n');
  await page.check('.nmx .nm-dir');
  await page.setInputFiles('.nmx .dfb-in', OUT + 'net.csv'); await page.waitForTimeout(800);
  { const f = await facts(); check((await big()).startsWith('10 nodes, 15 links') && f.includes('Strong components5 (largest 6)') && f.includes('Weak components1 (largest 10)') && f.includes('Degree assortativity−0.232') && f.includes('Density0.1667'), 'network: directed file: strong components and assortativity as networkx'); }
  check((await page.textContent('.nmx .nm-tab')).includes('In') && (await page.textContent('.nmx .nm-tab tr:nth-child(2)')).startsWith('v7') && (await page.textContent('.nmx .nm-tab tr:nth-child(2)')).includes('0.16573'), 'network: directed PageRank top v7 0.16573 (networkx)');
  await page.fill('.nmx .nm-in', 'a b 2\nb c 1\nc a 1\nx y\nq'); await page.uncheck('.nmx .nm-dir'); await page.waitForTimeout(600);
  check((await facts()).includes('Components3 (largest 3)') && (await page.textContent('.nmx .nm-fnote')).includes('Weights are used'), 'network: pieces and weights');
  await page.uncheck('.nmx .nm-w'); await page.waitForTimeout(300);
  check((await page.textContent('.nmx .nm-fnote')).includes('Weights are ignored'), 'network: weights switched off');
  await page.fill('.nmx .nm-in', 'a b 1\nb c z'); await page.waitForTimeout(700);
  check((await page.textContent('.nmx .nm-err')).startsWith('Line 2:') && await page.isHidden('.nmx .nm-out'), 'network: bad line message');
  await page.fill('.nmx .nm-in', 'solo'); await page.waitForTimeout(700);
  check((await page.textContent('.nmx .nm-err')).includes('at least one link'), 'network: needs a link');
  await page.click('.nmx .nm-ex'); await page.waitForTimeout(500);
  check((await big()).startsWith('34 nodes'), 'network: example again');
  await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(300);
  await page.locator('.nmx .nm-facts').scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + 'network-375.png' });
  await page.locator('.nmx .nm-net').scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + 'network-375b.png' });
  await page.setViewportSize(vp0);
};
