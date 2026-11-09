// #649 concrete mix calculator (maths checked against SciPy in tests/sci-tools/concrete-mix-design.mjs)
export const path = '/science/concrete-mix-design/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.cmx ';
  await page.goto(`${BASE}/science/concrete-mix-design/`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.cm-big')) === '1 : 2.06 : 2.40 by mass, 400 kg cement per m³', `concrete: example ratio (${await page.textContent(R + '.cm-big')})`);
  { const f = await page.textContent(R + '.cm-facts'); check(f.includes('36.6 MPa') && f.includes('4.9 %') && f.includes('2365 kg/m³') && f.includes('0.4 bags'), `concrete: facts (${f})`); }
  { const t = await page.textContent(R + '.cm-tab'); check(t.includes('825') && t.includes('970') && t.includes('858') && t.includes('7.523') && t.includes('42.89') && t.includes('48.48'), `concrete: batch table (${t})`); }
  check(await page.isVisible(R + '.cm-vol') && await page.isVisible(R + '.cm-dist'), 'concrete: volume and strength figures');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cm-csv')]); const f = OUT + 'concrete.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0].startsWith('material,') && rows[1].startsWith('Cement,126.98,400,400,20'), `concrete: CSV (${rows[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'concrete-mix.pdf', 'concrete: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'concrete-mix.docx', 'concrete: Word report'); }
  // Dry stone soaks water up: more water is added.
  await page.fill(R + '.cm-cam', '0.2'); await page.fill(R + '.cm-caa', '1.2'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.cm-facts')).includes('coarse −9.6'), 'concrete: dry coarse aggregate absorbs water');
  await page.fill(R + '.cm-bv', '6'); await page.fill(R + '.cm-bag', '25'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.cm-facts')).includes('96 bags'), 'concrete: truck of 6 m³ in 25 kg bags');
  await page.fill(R + '.cm-k', '2.33'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.cm-facts')).includes('39.32 MPa'), 'concrete: other k');
  await page.fill(R + '.cm-s', '0'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.cm-dist') && (await page.textContent(R + '.cm-facts')).includes('30 MPa'), 'concrete: no spread hides the curve');
  await page.fill(R + '.cm-caf', '0.95'); await page.fill(R + '.cm-car', '1800'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.cm-err')).includes('no room for sand') && await page.isHidden(R + '.cm-out'), 'concrete: too much stone explained');
  await page.fill(R + '.cm-caf', '0.6'); await page.fill(R + '.cm-car', '1600'); await page.fill(R + '.cm-wc', 'abc'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.cm-err')).includes('water / cement ratio'), 'concrete: bad w/c message');
  await page.fill(R + '.cm-wc', '0.45'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.cm-out'), 'concrete: recovers');
};
