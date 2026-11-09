// #409 Range chart and diversity through time
export const path = '/science/range-chart-plotter/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  const P = '.rcp ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await page.textContent(P + '.rc-big')) === '24 taxa in 6 bins: diversity peaks at 11 taxa in 90–80 and 80–70', 'ranges: example summary');
  { const t = await page.textContent(P + '.rc-tab'); check(t.includes('100–9010090921335350.6930.2880.0690.029') && t.includes('70–60706093600393––––'), `ranges: example table rows`); }
  check(await page.isVisible(P + '.rc-rfig') && await page.isVisible(P + '.rc-dfig') && await page.isVisible(P + '.rc-pfig') && (await page.textContent(P + '.rc-pnote')).includes('2 bins have no range-through'), 'ranges: three figures and rate note');
  await page.fill(P + '.rc-w', '20'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.rc-big')).startsWith('24 taxa in 3 bins'), 'ranges: 20 Myr bins');
  await page.selectOption(P + '.rc-bins', 'edges'); await page.waitForTimeout(300);
  check(await page.isVisible(P + '.rc-edges') && await page.isHidden(P + '.rc-w') && (await page.textContent(P + '.rc-big')).startsWith('24 taxa in 5 bins'), 'ranges: own boundaries');
  await page.fill(P + '.rc-names', 'Early, Middle, Late, Last, Final'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.rc-tab')).includes('Middle100'), 'ranges: bin names');
  await page.fill(P + '.rc-edges', '100, 90, 80'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.rc-err')).includes('outside the bins') && await page.isHidden(P + '.rc-out'), 'ranges: taxa outside the bins message');
  await page.fill(P + '.rc-edges', '120, 100, 110'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.rc-err')).includes('must get younger'), 'ranges: boundaries out of order message');
  await page.fill(P + '.rc-edges', '120, 100, 90, 80, 66, 60'); await page.fill(P + '.rc-names', ''); await page.waitForTimeout(500);
  await page.selectOption(P + '.rc-sort', 'last'); await page.selectOption(P + '.rc-sort', 'input'); await page.waitForTimeout(100);
  for (const [btn, name, test] of [['.rc-csv', 'bins.csv', (r) => r.length === 6 && r[0].startsWith('bin,base_ma,top_ma,taxa,FL,bL,Ft,bt') && r[1].startsWith('120–100,120,100,')],
    ['.rc-tcsv', 'taxa.csv', (r) => r.length === 25 && r[1] === 'Taxon A,118,96,120–100,100–90,2']]) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + btn)]); const f = OUT + name; await d.saveAs(f);
    check(test(readFileSync(f, 'utf8').trim().split('\n')), `ranges: ${name} download`);
  }
  // Numbered and named bins.
  await page.selectOption(P + '.rc-mode', 'bins');
  await page.fill(P + '.rc-names', 'Early\nMiddle\nLate');
  await page.fill(P + '.rc-in', 'taxon,first,last\nx,Early,Late\ny,2,3\nz,Middle\nw,1,2\n'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.rc-big')) === '4 taxa in 3 bins: diversity peaks at 4 taxa in Middle' && await page.isHidden(P + '.rc-w') && (await page.textContent(P + '.rc-pnote')).includes('per bin'), 'ranges: named bins');
  check((await page.textContent(P + '.rc-tab')).includes('Middle411112220.6930.693') && !(await page.textContent(P + '.rc-tab')).includes('p / Myr'), 'ranges: named bin counts');
  await page.fill(P + '.rc-in', 'taxon,first,last\nx,3,2\n'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.rc-err')).includes('Bin 1 is the oldest'), 'ranges: bins in the wrong order message');
  await page.selectOption(P + '.rc-mode', 'ages');
  await page.fill(P + '.rc-in', 'taxon,first,last\nx,50,60\n'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.rc-err')).includes('younger than the last'), 'ranges: ages the wrong way round message');
  await page.fill(P + '.rc-in', 'taxon,first,last\nx,5x,60\n'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.rc-err')).includes('not an age'), 'ranges: not an age message');
  // Open a file.
  const { writeFileSync } = await import('node:fs');
  writeFileSync(OUT + 'taxa.csv', 'taxon,first,last\na,30,10\nb,25,5\nc,12,12\n');
  await page.selectOption(P + '.rc-bins', 'equal'); await page.fill(P + '.rc-w', '10'); await page.fill(P + '.rc-names', '');
  await page.setInputFiles(P + '.dfb-in', OUT + 'taxa.csv'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.rc-big')).startsWith('3 taxa in 3 bins'), 'ranges: opened a CSV file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=png]')]); const f = OUT + 'rc.png'; await d.saveAs(f); check(readFileSync(f).slice(1, 4).toString() === 'PNG', 'ranges: image report'); }
};
