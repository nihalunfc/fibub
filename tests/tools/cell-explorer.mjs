// #1123 Cell explorer
export const path = '/learn/cell-explorer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.cex ';
  await page.goto(`${BASE}/learn/cell-explorer/`); await page.waitForTimeout(600);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const name = () => page.textContent(R + '.cex-name');
  check((await name()) === 'Nothing picked yet' && await page.isVisible(R + '.cex-svg[data-k=plant]') && await page.isHidden(R + '.cex-svg[data-k=animal]'), 'cells: starts on the plant cell');
  // Tap the nucleus and a chloroplast in the drawing
  await tap('.cex-svg[data-k=plant] [data-o=nucleus] .nuc');
  check((await name()) === 'Nucleus' && (await page.textContent(R + '.cex-job')).includes('control centre') && (await page.textContent(R + '.cex-where')).includes('plant cells, animal cells'), 'cells: tap the nucleus');
  check(await page.$eval(R + '.cex-svg[data-k=plant] [data-o=nucleus]', (g) => g.classList.contains('on')), 'cells: picked part lights up');
  await tap('.cex-svg[data-k=plant] [data-o=chloro] .chl');
  check((await name()) === 'Chloroplast' && (await page.textContent(R + '.cex-more')) === '', 'cells: chloroplast, Class 9 short text');
  // Zoom
  await tap('.cex-zoom');
  const vb = await page.getAttribute(R + '.cex-svg[data-k=plant]', 'viewBox');
  check(vb !== '0 0 400 280' && (await page.textContent(R + '.cex-zoom')) === 'Zoom out' && (await page.textContent(R + '.cex-bart')) === '2 µm', `cells: zoom in (${vb})`);
  await tap('.cex-zoom');
  check((await page.getAttribute(R + '.cex-svg[data-k=plant]', 'viewBox')) === '0 0 400 280', 'cells: zoom out');
  // Animal cell: chloroplast is not there, pick is cleared
  await tap('.cex-kind button[data-v=animal]');
  check(await page.isVisible(R + '.cex-svg[data-k=animal]') && (await name()) === 'Nothing picked yet', 'cells: animal cell, chloroplast cleared');
  await tap('.cex-svg[data-k=animal] [data-o=lyso] .lys');
  check((await name()) === 'Lysosome', 'cells: lysosome');
  check(await page.isHidden(R + '.cex-svg[data-k=animal] [data-o=centriole]'), 'cells: centrioles hidden at Class 9');
  // Class 11
  await tap('.cex-level button[data-v="11"]');
  check(await page.isVisible(R + '.cex-svg[data-k=animal] [data-o=centriole]') && (await page.textContent(R + '.cex-more')).includes('suicide bags'), 'cells: Class 11 adds parts and detail');
  await tap('.cex-svg[data-k=animal] [data-o=centriole] .hitf');
  check((await name()) === 'Centrioles', 'cells: centrioles');
  // Bacterium
  await tap('.cex-kind button[data-v=bacterium]');
  await tap('.cex-svg[data-k=bacterium] [data-o=nucleoid] .dna');
  check((await name()) === 'Nucleoid' && (await page.textContent(R + '.cex-more')).includes('prokaryotes'), 'cells: bacterium nucleoid');
  check((await page.textContent(R + '.cex-bart')) === '0.5 µm', 'cells: bacterium scale bar');
  // Compare table: 20 rows at Class 11, tap a row switches cell
  const rows = await page.$$eval(R + '.cex-tab tbody tr', (t) => t.length);
  check(rows === 20, `cells: compare table rows (${rows})`);
  await tap('.cex-tab tbody tr[data-o=chloro]');
  check((await name()) === 'Chloroplast' && await page.isVisible(R + '.cex-svg[data-k=plant]'), 'cells: table row jumps to the plant cell');
  { const t = await page.textContent(R + '.cex-tab tr[data-o=wall]'); check(t === 'Cell wall✓–✓', `cells: wall row (${t})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cex-csv')]); const f = OUT + 'cells.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0] === 'part,plant,animal,bacterium,job' && l.length === 21 && l.some((x) => x.startsWith('Chloroplast,yes,no,no,')), 'cells: CSV'); }
  await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'cells.png'; await d.saveAs(f); const b = readFileSync(f); check(b.subarray(1, 4).toString() === 'PNG' && b.length > 20000, `cells: image report (${b.length} bytes)`); }
  // Magnification
  check(/magnified about ×\d+ on your screen/.test(await page.textContent(R + '.cex-mag')) && /= ×\d+$/.test(await page.textContent(R + '.cex-formula')), 'cells: screen magnification');
  check((await page.textContent(R + '.cex-micro')).includes('10 × 40 = ×400') && (await page.textContent(R + '.cex-micro')).includes('20.0 mm'), 'cells: microscope sum');
  await page.fill(R + '.cex-obj', '0'); await page.waitForTimeout(200);
  check(await page.isVisible(R + '.cex-err'), 'cells: bad lens message');
  await page.fill(R + '.cex-obj', '100'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.cex-micro')).includes('×1000') && await page.isHidden(R + '.cex-err'), 'cells: oil immersion objective');
  // Check yourself
  for (const lv of ['11', '9']) {
    await tap(`.cex-level button[data-v="${lv}"]`);
    const n = await page.$$eval(R + '.cex-qs li', (l) => l.length);
    await tap('.cex-check');
    check((await page.textContent(R + '.cex-score')) === `0 of ${n} right.`, `cells: Class ${lv} blanks wrong`);
    await page.$$eval(R + '.cex-qs li', (lis) => lis.forEach((li) => { li.querySelector('.cex-ans').value = li.dataset.a; }));
    await tap('.cex-check');
    check((await page.textContent(R + '.cex-score')) === `${n} of ${n} right.` && n === (lv === '11' ? 5 : 4), `cells: Class ${lv} quiz (${n})`);
  }
};
