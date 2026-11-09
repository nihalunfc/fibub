// #408 Landmark digitiser and Procrustes analysis
export const path = '/science/procrustes-morphometrics/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  const P = '.pcm ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await page.textContent(P + '.pm-big')) === '12 specimens, 7 landmarks: PC1 holds 76.5 % of the shape variation', 'procrustes: example loads with PC1 76.5 %');
  { const f = await page.textContent(P + '.pm-facts'); check(f.includes('285.17') && f.includes('207.2 to 376.1') && f.includes('0.007497') && f.includes('GPA iterations3') && f.includes('TPS'), 'procrustes: facts (centroid sizes, variance, iterations)'); }
  { const t = await page.textContent(P + '.pm-tab'); check(t.includes('A-01A269.670.10100.0890') && t.includes('A-04A244.000.0750') && t.includes('B-05B306.200.0982-0.0904'), 'procrustes: specimen table with groups, sizes, distances, scores'); }
  check((await page.textContent(P + '.pm-etab')).includes('PC10.00624476.576.5PC20.00061017.584.0') && await page.isVisible(P + '.pm-sfig') && await page.isVisible(P + '.pm-pfig'), 'procrustes: eigenvalue table and both figures');
  await page.selectOption(P + '.pm-show', '0'); await page.waitForTimeout(100);
  check((await page.textContent(P + '.pm-snote')).includes('along PC1'), 'procrustes: PC1 shape change view');
  await page.selectOption(P + '.pm-py', '2'); await page.waitForTimeout(100);
  check((await page.locator(P + '.pm-pfig').getAttribute('aria-label')).includes('PC1 and PC3'), 'procrustes: choose PCs for the scores plot');
  await page.uncheck(P + '.pm-tan'); await page.waitForTimeout(150);
  check((await page.textContent(P + '.pm-big')).includes('76.5 %') && (await page.textContent(P + '.pm-facts')).includes('Components with variance11'), 'procrustes: without tangent projection');
  await page.check(P + '.pm-tan'); await page.uncheck(P + '.pm-grp'); await page.waitForTimeout(150);
  check(!(await page.textContent(P + '.pm-tab')).includes('Group'), 'procrustes: groups off');
  await page.check(P + '.pm-grp'); await page.waitForTimeout(150);
  for (const [btn, name, test] of [['.pm-csv', 'al.csv', (r) => r.length === 14 && r[0].startsWith('specimen,group,centroid_size,procrustes_distance,x1,y1') && r[1].startsWith('A-01,A,269.67') && r[13].startsWith('mean shape')],
    ['.pm-scsv', 'sc.csv', (r) => r.length === 15 && r[0] === 'specimen,group,' + Array.from({ length: 10 }, (_, j) => `PC${j + 1}`).join(',') && r[14].startsWith('percent,,76.50')],
    ['.pm-dcsv', 'd.csv', (r) => r.length === 13 && r[1].split(',')[7].startsWith('0.151850')]]) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + btn)]); const f = OUT + name; await d.saveAs(f);
    check(test(readFileSync(f, 'utf8').trim().split('\n')), `procrustes: ${name} download`);
  }
  // A table instead of TPS, and bad input.
  await page.fill(P + '.pm-in', 'name,x1,y1,x2,y2,x3,y3\nP1,0,0,4,0,1,3\nP2,0,0,4,0,1,3.5\nP3,0,0,4.2,0,1,3\n'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.pm-big')).startsWith('3 specimens, 3 landmarks') && (await page.textContent(P + '.pm-facts')).includes('table'), 'procrustes: wide table input');
  await page.fill(P + '.pm-in', 'P1,0,0,4,0,1\nP2,0,0,4,0,1,3\n'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.pm-err')).includes('even number') && await page.isHidden(P + '.pm-out'), 'procrustes: odd number of values message');
  await page.fill(P + '.pm-in', 'LM=3\n0 0\n1 0\n0 1\nID=a\nLM=4\n0 0\n1 0\n0 1\n1 1\nID=b\nLM=3\n0 0\n2 0\n0 1\nID=c\n'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.pm-err')).includes('b has 4 landmarks but a has 3'), 'procrustes: different landmark counts message');
  await page.fill(P + '.pm-in', 'LM=3\n0 0\n1 0\n0 1\nID=a\n'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.pm-err')).includes('at least 3'), 'procrustes: too few specimens message');
  // Digitise three made-up photos with 3 landmarks each.
  await page.fill(P + '.pm-in', ''); await page.waitForTimeout(400);
  const files = [];
  for (let k = 0; k < 3; k++) {
    const b64 = await page.evaluate((k) => { const c = document.createElement('canvas'); c.width = 400; c.height = 300; const x = c.getContext('2d'); x.fillStyle = '#eee'; x.fillRect(0, 0, 400, 300); x.fillStyle = '#333'; x.beginPath(); x.moveTo(100, 75); x.lineTo(300 + k * 10, 75); x.lineTo(100, 225); x.fill(); return c.toDataURL('image/png').split(',')[1]; }, k);
    const f = OUT + `spec${k + 1}.png`; writeFileSync(f, Buffer.from(b64, 'base64')); files.push(f);
  }
  await page.fill(P + '.pm-n', '3'); await page.fill(P + '.pm-scale', '0.1');
  await page.setInputFiles(P + '.pm-pfile', files); await page.waitForTimeout(500);
  check((await page.textContent(P + '.pm-pstat')).includes('Photo 1 of 3 (spec1.png): tap landmark 1 of 3'), 'procrustes: digitiser opens the first photo');
  for (let k = 0; k < 3; k++) {
    const c = page.locator(P + '.pm-photo'); await c.scrollIntoViewIfNeeded(); await page.waitForTimeout(100);
    const bb = await c.boundingBox();
    if (k === 0) { await page.mouse.click(bb.x + bb.width * 0.5, bb.y + bb.height * 0.5); await page.waitForTimeout(50); await page.click(P + '.pm-undo'); await c.scrollIntoViewIfNeeded(); }
    const b2 = await c.boundingBox();
    for (const [fx, fy] of [[0.25, 0.25], [(300 + k * 10) / 400, 0.25], [0.25, 0.75]]) { await page.mouse.click(b2.x + b2.width * fx, b2.y + b2.height * fy); await page.waitForTimeout(80); }
    await page.waitForTimeout(400);
  }
  const txt = await page.inputValue(P + '.pm-in');
  { const first = txt.split('\n').slice(0, 7); const [x1, y1] = first[1].split(' ').map(Number); check(first[0] === 'LM=3' && Math.abs(x1 - 100) < 2 && Math.abs(y1 - 225) < 2 && first[4] === 'IMAGE=spec1.png' && first[5] === 'ID=spec1' && first[6] === 'SCALE=0.1', `procrustes: tapped landmarks become TPS, y upwards (${first.join(' | ')})`); }
  check((txt.match(/LM=3/g) || []).length === 3 && (await page.textContent(P + '.pm-pstat')).includes('Done: 3 photos') && (await page.textContent(P + '.pm-big')).startsWith('3 specimens, 3 landmarks'), 'procrustes: three photos digitised and analysed');
  check((await page.textContent(P + '.pm-facts')).includes('SCALE= applied to 3'), 'procrustes: scale applied');
  await page.click(P + '.pm-ex'); await page.waitForTimeout(300);
  check((await page.textContent(P + '.pm-big')).includes('76.5 %'), 'procrustes: example button');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=pdf]')]); const f = OUT + 'pcm.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 5).toString() === '%PDF-', 'procrustes: PDF report'); }
};
