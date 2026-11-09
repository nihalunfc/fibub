// #648 2D truss and frame solver (maths checked against NumPy and the method of joints in tests/sci-tools/truss-solver.mjs)
export const path = '/science/truss-solver/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.tfs ';
  await page.goto(`${BASE}/science/truss-solver/`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.tf-big')) === 'Largest force 42.43 kN compression in member g', `truss: example (${await page.textContent(R + '.tf-big')})`);
  { const f = await page.textContent(R + '.tf-facts'); check(f.includes('1.951 mm at node 3') && f.includes('uy −1.899 mm') && f.includes('1: Ry 30') && f.includes('5: Ry 30') && f.includes('0 kN left over'), `truss: facts (${f})`); }
  { const t = await page.textContent(R + '.tf-mtab'); check((await page.$$(R + '.tf-mtab tbody tr')).length === 13 && t.includes('−40') && t.includes('14.142') && t.includes('zero'), `truss: member table`); }
  check(await page.isVisible(R + '.tf-fig') && (await page.getAttribute(R + '.tf-fig', 'aria-label')).includes('200 times'), `truss: drawing with automatic scale (${await page.getAttribute(R + '.tf-fig', 'aria-label')})`);
  await page.fill(R + '.tf-scale', '100'); await page.waitForTimeout(150);
  check((await page.getAttribute(R + '.tf-fig', 'aria-label')).includes('100 times'), 'truss: own deflection scale');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tf-mcsv')]); const f = OUT + 'tm.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 14 && rows[7].startsWith('g,1,6,4.242641,-42.426407'), `truss: member CSV (${rows[7]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tf-ncsv')]); const f = OUT + 'tn.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[3].startsWith('3,6,0,') && rows[3].includes('-1.8985281'), `truss: node CSV (${rows[3]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'truss-frame.pdf', 'truss: PDF report'); }
  // Frame example.
  await page.selectOption(R + '.tf-ex', 'frame'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.tf-mode')) === 'frame' && (await page.textContent(R + '.tf-big')) === 'Largest moment 34.44 kN·m in member b', `truss: portal frame (${await page.textContent(R + '.tf-big')})`);
  { const f = await page.textContent(R + '.tf-facts'); check(f.includes('6.457 mm at node 2') && f.includes('M 6.872') && f.includes('M 29.15'), `truss: frame facts (${f})`); }
  check((await page.textContent(R + '.tf-mtab')).includes('10.47') && (await page.textContent(R + '.tf-ntab')).includes('rz mrad'), 'truss: frame end moments and rotations');
  // Mechanism.
  await page.fill(R + '.tf-sup', '1, roller\n4, roller'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tf-err')).includes('mechanism') && await page.isHidden(R + '.tf-out'), 'truss: mechanism explained');
  await page.fill(R + '.tf-sup', '1, hinge'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tf-err')).includes('not one of pin'), 'truss: bad support type');
  await page.fill(R + '.tf-sup', '1, fixed\n4, fixed'); await page.fill(R + '.tf-loads', '9, 10, 0'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tf-err')).includes('node 9'), 'truss: unknown load node');
  await page.fill(R + '.tf-loads', ''); await page.waitForTimeout(200);
  check(await page.isVisible(R + '.tf-out'), 'truss: beam load alone still solves');
  // Open a nodes file: a simple cantilever truss.
  await page.selectOption(R + '.tf-mode', 'truss');
  await page.fill(R + '.tf-mem', 'a,1,2,200,10\nb,2,3,200,10\nc,1,3,200,10');
  await page.fill(R + '.tf-sup', '1, pin\n2, roller-y'); await page.fill(R + '.tf-loads', '3, 0, -10');
  writeFileSync(OUT + 'nodes.csv', 'Node,x,y\n1,0,0\n2,0,2\n3,4,0\n');
  await page.locator(R + '.dfb-in').first().setInputFiles(OUT + 'nodes.csv');
  await page.waitForTimeout(400);
  check((await page.textContent(R + '.tf-big')).startsWith('Largest force 22.36 kN tension in member b'), `truss: nodes from a file (${await page.textContent(R + '.tf-big')})`);
};
