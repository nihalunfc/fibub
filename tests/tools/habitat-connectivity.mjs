// #511 habitat connectivity
export const path = '/science/habitat-connectivity/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.hcn ';
  const t = (s) => page.textContent(R + s);
  const wait = () => page.waitForTimeout(500);
  await page.goto(`${BASE}/science/habitat-connectivity/`); await page.waitForTimeout(800);
  check((await t('.hc-big')) === '8 patches, 3 links, 5 components; IIC 0.00939, PC 0.0152', 'habitat: example indices');
  { const f = await t('.hc-facts'); check(f.includes('Habitat312 ha20.3 % of 1536 ha') && f.includes('IIC0.009389') && f.includes('PC0.01522'), 'habitat: example facts'); }
  { const tb = await t('.hc-tab'); check(tb.startsWith('PatchArea (ha)LinksComponentNearest (cost)dPC (%)dIIC (%)5681') && tb.includes('42.9540.21') && tb.includes('4.330.37'), 'habitat: patch table with dPC and dIIC (networkx values)'); }
  check((await t('.hc-path')).startsWith('Patch 5 to patch 6: least cost 3262.7 over 7 cells, linked'), 'habitat: least-cost path');
  // Path pickers.
  await page.selectOption(R + '.hc-a', '0'); await page.selectOption(R + '.hc-b', '4'); await wait();
  check((await t('.hc-path')).startsWith('Patch 1 to patch 5: least cost 12695') && (await t('.hc-path')).includes('not linked'), 'habitat: path between chosen patches (skimage distance)');
  // Tap two patches on the map: patch 7 then patch 8 (cell centres from the example layout).
  const tapCell = async (x, y) => { await page.locator(R + '.hc-map').scrollIntoViewIfNeeded(); const bb = await page.locator(R + '.hc-map').boundingBox(); await page.mouse.click(bb.x + (x + 0.5) / 48 * bb.width, bb.y + (y + 0.5) / 32 * bb.height); };
  await tapCell(33, 22); await page.waitForTimeout(150); await tapCell(42, 27); await wait();
  check((await t('.hc-path')).startsWith('Patch 7 to patch 8:') && (await t('.hc-path')).includes('linked'), `habitat: tap two patches (${await t('.hc-path')})`);
  // Threshold, probability and minimum patch.
  await page.fill(R + '.hc-thr', '9000'); await wait();
  check((await t('.hc-big')).startsWith('8 patches') && (await t('.hc-big')).includes('2 components'), 'habitat: longer dispersal merges components');
  await page.fill(R + '.hc-thr', '5000'); await page.fill(R + '.hc-p', '0.2'); await wait();
  check((await t('.hc-big')).includes('IIC 0.00939') && !(await t('.hc-big')).includes('PC 0.0152'), 'habitat: p changes PC only');
  await page.fill(R + '.hc-p', '1.5'); await wait();
  check((await t('.hc-err')).includes('between 0 and 1'), 'habitat: bad probability message');
  await page.fill(R + '.hc-p', '0.5'); await page.fill(R + '.hc-min', '10'); await wait();
  check((await t('.hc-big')).startsWith('7 patches'), 'habitat: smallest patch leaves out the 9-cell patch');
  await page.fill(R + '.hc-min', '1'); await page.fill(R + '.hc-al', '10'); await wait();
  check((await t('.hc-err')).includes('at least the habitat area'), 'habitat: landscape area too small');
  await page.fill(R + '.hc-al', ''); await wait();
  // Paint: join patches 5 and 6 with a forest corridor.
  await page.selectOption(R + '.hc-tap', 'paint'); await page.selectOption(R + '.hc-brush', '0'); await page.selectOption(R + '.hc-size', '3'); await wait();
  for (const x of [10, 11, 12, 13]) await tapCell(x, 21);
  await wait();
  check((await t('.hc-big')).startsWith('7 patches'), `habitat: painting a corridor joins two patches (${await t('.hc-big')})`);
  // Classes: resistance change and bad rows.
  await page.click(R + '.hc-ex'); await wait();
  const cls = await page.inputValue(R + '.hc-cls');
  await page.fill(R + '.hc-cls', cls.replace('3, Farmland, no, 10,', '3, Farmland, no, 2,')); await wait();
  check((await t('.hc-big')) === '8 patches, 5 links, 4 components; IIC 0.00972, PC 0.0211', `habitat: easier farmland adds links (${await t('.hc-big')})`);
  await page.fill(R + '.hc-cls', cls.replace('3, Farmland, no, 10,', '3, Farmland, maybe, 10,')); await wait();
  check((await t('.hc-err')).includes('habitat is yes or no'), 'habitat: bad class row message');
  await page.fill(R + '.hc-cls', cls); await wait();
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hc-csv')]); const f = OUT + 'hc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0].startsWith('patch,area_ha') && rows[5].startsWith('5,68,'), 'habitat: patches CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hc-dcsv')]); const f = OUT + 'hcd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 29 && rows[1].startsWith('1,2,1348.528137,yes,'), 'habitat: distances CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hc-gcsv')]); const f = OUT + 'hcg.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 32 && rows[0].split(',').length === 48, 'habitat: map CSV');
    // ...and open it again.
    await page.setInputFiles(R + '.hc-file', f); await wait();
    check((await t('.hc-big')) === '8 patches, 3 links, 5 components; IIC 0.00939, PC 0.0152', 'habitat: map CSV opens to the same result'); }
  // An ASCII grid: two forest blocks 3 cells apart across farmland (50 m cells).
  { const f = OUT + 'two.asc'; const rows = []; for (let y = 0; y < 6; y++) rows.push(Array.from({ length: 10 }, (_, x) => (x < 3 || x > 5 ? 1 : 3)).join(' '));
    writeFileSync(f, `ncols 10\nnrows 6\nxllcorner 0\nyllcorner 0\ncellsize 50\n${rows.join('\n')}\n`);
    await page.setInputFiles(R + '.hc-file', f); await wait();
    // Straight across: 4 steps of 50 m: (1+10)/2 + 10 + 10 + (10+1)/2 = 31 × 50 = 1550.
    check((await t('.hc-big')).startsWith('2 patches, 1 link') && (await t('.hc-path')).includes('least cost 1550 over 5 cells') && (await page.inputValue(R + '.hc-cell')) === '50', `habitat: ASCII grid by hand (${await t('.hc-path')})`); }
  // A PNG in the class colours.
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 12; c.height = 8; const x = c.getContext('2d'); x.fillStyle = '#f1e3a6'; x.fillRect(0, 0, 12, 8); x.fillStyle = '#2f7d32'; x.fillRect(0, 0, 3, 3); x.fillRect(8, 5, 4, 3); x.fillRect(5, 0, 2, 2); return c.toDataURL('image/png').split(',')[1]; });
    const f = OUT + 'map.png'; writeFileSync(f, Buffer.from(b64, 'base64')); await page.setInputFiles(R + '.hc-file', f); await wait();
    check((await t('.hc-big')).startsWith('3 patches') && (await page.inputValue(R + '.hc-w')) === '12', 'habitat: PNG map by colour'); }
  { const f = OUT + 'badcode.csv'; writeFileSync(f, '1,1,9\n1,3,3'); await page.setInputFiles(R + '.hc-file', f); await wait(); check((await t('.hc-ferr')).includes('code 9'), 'habitat: unknown class code message'); }
  // Blank map.
  await page.selectOption(R + '.hc-brush', '2'); await page.click(R + '.hc-new'); await wait();
  check((await t('.hc-err')).includes('0 habitat patches') && (await page.inputValue(R + '.hc-tap')) === 'paint', 'habitat: blank map asks for patches');
  await page.click(R + '.hc-ex'); await page.selectOption(R + '.hc-tap', 'pick'); await wait();
  check((await t('.hc-big')).startsWith('8 patches'), 'habitat: example restored');
};
