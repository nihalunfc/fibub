// #660 pipe network pressure drop
export const path = '/science/pipe-network-solver/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.pns ';
  await page.goto(`${BASE}/science/pipe-network-solver/`); await page.waitForTimeout(600);
  check((await page.textContent(R + '.pn-sbig')) === 'Head loss 3.385 m, pressure drop 82.09 kPa', 'pipenet: example single pipe');
  { const t = await page.textContent(R + '.pn-sfacts'); check(t.includes('1.41 m/s') && t.includes('turbulent') && t.includes('0.01781') && t.includes('Swamee-Jain'), 'pipenet: single pipe facts'); }
  check(await page.isVisible(R + '.pn-sfig'), 'pipenet: system curve drawn');
  check((await page.textContent(R + '.pn-big')) === 'R supplies 66.27 L/s, T takes in 6.265 L/s', 'pipenet: example network');
  { const t = await page.textContent(R + '.pn-ptab'); check(t.includes('R → J1') && t.includes('66.27') && t.includes('6.27'), 'pipenet: pipe table'); }
  { const t = await page.textContent(R + '.pn-ntab'); check(t.includes('58.706') && t.includes('38.706') && t.includes('R (fixed)'), 'pipenet: node table'); }
  { const t = await page.textContent(R + '.pn-facts'); check(t.includes('8 iterations') && t.includes('3 loops'), 'pipenet: Newton facts'); }
  check(await page.isVisible(R + '.pn-fig'), 'pipenet: network sketch drawn');
  await page.selectOption(R + '.pn-meth', 'cross'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pn-big')) === 'R supplies 66.27 L/s, T takes in 6.265 L/s' && (await page.textContent(R + '.pn-facts')).includes('Hardy Cross'), 'pipenet: Hardy Cross gives the same answer');
  await page.selectOption(R + '.pn-fm', 'swamee'); await page.waitForTimeout(100);
  { const t = await page.textContent(R + '.pn-sbig'); check(t.startsWith('Head loss 3.3') && t !== 'Head loss 3.385 m, pressure drop 82.09 kPa', `pipenet: Swamee-Jain option (${t})`); }
  await page.selectOption(R + '.pn-fm', 'colebrook');
  await page.selectOption(R + '.pn-mode', 'q'); await page.fill(R + '.pn-h', '3.385431571'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pn-sbig')) === 'Flow 25 L/s for 3.385 m of head', 'pipenet: flow from head');
  await page.selectOption(R + '.pn-mode', 'h');
  await page.selectOption(R + '.pn-epick', '0.25'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.pn-e')) === '0.25' && !(await page.textContent(R + '.pn-sbig')).startsWith('Head loss 3.385'), 'pipenet: roughness picker fills ε');
  await page.fill(R + '.pn-q', '0.01'); await page.fill(R + '.pn-D', '50'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pn-sfacts')).includes('laminar'), 'pipenet: laminar flow named');
  await page.fill(R + '.pn-q', '25'); await page.fill(R + '.pn-D', '150'); await page.fill(R + '.pn-e', '0.05');
  await page.selectOption(R + '.pn-fluid', 'own'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pn-fluidnote')).includes('870 kg/m³') && (await page.textContent(R + '.pn-sfacts')).includes('615'), 'pipenet: own liquid (oil, Re about 6150)');
  await page.fill(R + '.pn-mu', ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pn-ferr')).includes('density and viscosity') && await page.isHidden(R + '.pn-out'), 'pipenet: missing viscosity message');
  await page.selectOption(R + '.pn-fluid', 'water'); await page.fill(R + '.pn-t', '20'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pn-pcsv')]); const f = OUT + 'pn-p.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0].startsWith('pipe,from,to') && rows[1].startsWith('P1,R,J1,500,300'), 'pipenet: pipes CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pn-ncsv')]); const f = OUT + 'pn-n.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8 && rows[1].startsWith('R,50,0,yes,60'), 'pipenet: nodes CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'pipe-network.pdf', 'pipenet: PDF report'); }
  // Two reservoirs and one pipe typed in, without coordinates.
  await page.fill(R + '.pn-nodes', 'A, 0, 0, 30\nB, 0, 0, 10'); await page.fill(R + '.pn-pipes', 'X, A, B, 1000, 200, 0.1, 1'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.pn-big')).startsWith('A supplies') && await page.isHidden(R + '.pn-fig'), 'pipenet: typed network without a sketch');
  await page.fill(R + '.pn-pipes', 'X, A, C, 1000, 200, 0.1, 1'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.pn-err')).includes('not in the node list') && await page.isHidden(R + '.pn-out'), 'pipenet: unknown node message');
  await page.fill(R + '.pn-nodes', 'A, 0, 5\nB, 0, 0'); await page.fill(R + '.pn-pipes', 'X, A, B, 1000, 200, 0.1, 1'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.pn-err')).includes('at least one reservoir'), 'pipenet: no reservoir message');
  writeFileSync(OUT + 'pn-nodes.csv', 'Node,Level,Demand,Head\nS,0,0,40\nN1,0,5,\n');
  await page.setInputFiles(R + '.dfb-in >> nth=0', OUT + 'pn-nodes.csv'); await page.fill(R + '.pn-pipes', 'X, S, N1, 100, 100, 0.05, 0'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.pn-big')) === 'S supplies 5 L/s', 'pipenet: nodes opened from a file');
};
