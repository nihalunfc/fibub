// #987 gene network viewer
export const path = '/science/gene-network-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.gnv ';
  const t = (s) => page.textContent(R + s);
  const pick = async (sel, v) => { await page.selectOption(R + sel, v); await page.waitForTimeout(300); };
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(500); };
  const pixels = () => page.$eval(R + '.gn-fig', (c) => c.toDataURL());
  await page.goto(`${BASE}/science/gene-network-viewer/`); await page.waitForTimeout(800);
  check((await t('.gn-big')) === '13 genes, 17 interactions', 'network: example read');
  { const f = await t('.gn-facts'); check(f.includes('13 activating, 4 repressing') && f.includes('0.109') && f.includes('largest has 9 genes; 1 gene with no links') && f.includes('2 coherent, 2 incoherent') && f.includes('2 self, 1 two-gene'), 'network: facts (density 0.109, 3 parts, 4 FFLs = NetworkX)'); }
  { const r = await page.$$eval(R + '.gn-dtab tbody tr', (x) => x.map((y) => [...y.cells].map((c) => c.textContent).join('|'))); check(r[0] === 'MasterA|1|5|4|1|' && r[1] === 'TF3|2|2|1|1|−' && r[2] === 'TF4|2|2|2|0|+', 'network: degree table, hub first, autoregulation signs'); }
  { const r = await page.$$eval(R + '.gn-ftab tbody tr', (x) => x.map((y) => [...y.cells].map((c) => c.textContent).join('|'))); check(r.length === 4 && r[0] === 'MasterA|TF1|GeneX|+ + +|coherent C1' && r[2] === 'MasterA|TF2|GeneY|+ − +|incoherent I1' && r[3] === 'MasterA|TF2|GeneZ|+ + −|incoherent', 'network: feed-forward loop table'); }
  check(await page.isVisible(R + '.gn-fig'), 'network: drawing');
  const p0 = await pixels();
  await pick('.gn-hl', 'ffl'); const p1 = await pixels();
  await pick('.gn-hl', 'fb'); const p2 = await pixels();
  check(p1 !== p0 && p2 !== p1, 'network: highlight loops and feedback');
  await pick('.gn-hl', 'none');
  check((await pixels()) === p0, 'network: same seed, same drawing');
  await pick('.gn-size', 'same'); const p3 = await pixels();
  await page.uncheck(R + '.gn-lab'); await page.waitForTimeout(300); const p4 = await pixels();
  await pick('.gn-lay', 'circle'); const p5 = await pixels();
  check(p3 !== p0 && p4 !== p3 && p5 !== p4, 'network: node size, names and circle layout change the drawing');
  await page.click(R + '.gn-shuffle'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.gn-lay')) === 'force' && (await pixels()) !== p5, 'network: new layout');
  await page.check(R + '.gn-lab'); await pick('.gn-size', 'degree');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gn-dcsv')]); const f = OUT + 'gd.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 14 && r[0] === 'gene,in_degree,out_degree,activates,represses,self_regulation' && r[1] === 'MasterA,1,5,4,1,', 'network: degrees CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gn-fcsv')]); const f = OUT + 'gm.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 8 && r[1] === 'feed-forward loop,MasterA,TF1,GeneX,1,1,1,coherent C1' && r.includes('two-gene feedback,TF4,TF5,,1,-1,,negative') && r.includes('autoregulation,TF3,,,-1,,,negative'), 'network: motifs CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `gene-network.${fmt}`, `network: ${fmt} download`); }
  // GraphML file with names and signs in data keys.
  writeFileSync(OUT + 'n.graphml', `<?xml version="1.0"?><graphml xmlns="http://graphml.graphdrawing.org/xmlns"><key id="d0" for="node" attr.name="name" attr.type="string"/><key id="d1" for="edge" attr.name="interaction" attr.type="string"/><graph edgedefault="directed"><node id="n0"><data key="d0">LacI</data></node><node id="n1"><data key="d0">LacZ</data></node><node id="n2"><data key="d0">CRP</data></node><edge source="n0" target="n1"><data key="d1">represses</data></edge><edge source="n2" target="n0"><data key="d1">activates</data></edge><edge source="n2" target="n1"><data key="d1">activates</data></edge></graph></graphml>`);
  await page.setInputFiles(R + '.gn-file', OUT + 'n.graphml'); await page.waitForTimeout(800);
  check((await t('.gn-big')) === '3 genes, 3 interactions' && (await page.$$eval(R + '.gn-ftab tbody tr', (x) => x.map((y) => y.textContent).join())).includes('CRPLacILacZ+ − +incoherent I1'), 'network: GraphML file opened, I1 loop found');
  await set('.gn-data', 'A activates B\nA activates B\nB binds C');
  check((await t('.gn-facts')).includes('1 repeated line left out') && (await t('.gn-facts')).includes('1 other') && (await t('.gn-fsum')).includes('No feed-forward loops'), 'network: duplicates, unsigned edges, no loops');
  await set('.gn-data', 'A B');
  check((await t('.gn-err')).includes('source interaction target') && await page.isHidden(R + '.gn-out'), 'network: two-word line message');
  await set('.gn-data', '# nothing');
  check((await t('.gn-err')).includes('no interactions'), 'network: empty message');
  await set('.gn-data', '<graphml><edge target="x"/></graphml>');
  check((await t('.gn-err')).includes('no source'), 'network: bad GraphML message');
};
