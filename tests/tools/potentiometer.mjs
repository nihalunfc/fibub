// #1412 Potentiometer virtual practical
export const path = '/learn/potentiometer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/potentiometer/`); await page.waitForTimeout(600);
  const R = '.ptm ', txt = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.ptm-big')).includes('to the left (jockey not far enough)') && (await txt('.ptm-note')).includes('4.35 mV per cm'), `pot: start (${await txt('.ptm-big')})`);
  const inked = () => page.$eval(R + '.ptm-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked()) > 600, 'pot: circuit drawn');
  await page.click(R + '.ptm-rec'); check(!(await page.isHidden(R + '.ptm-rerr')), 'pot: cannot record off balance');
  await setR('.ptm-j', 340); await page.click(R + '.ptm-nudge button[data-d="1"]');
  for (let i = 0; i < 4; i++) await page.click(R + '.ptm-nudge button[data-d="1"]');
  check((await txt('.ptm-jv')) === '345.0 cm' && (await txt('.ptm-big')) === 'Galvanometer at zero: balanced!', `pot: cell 1 balances at 345 cm (${await txt('.ptm-big')})`);
  await page.click(R + '.ptm-rec'); check((await txt('.ptm-tab')).includes('345.0'), 'pot: l₁ recorded');
  await setR('.ptm-j', 380); check((await txt('.ptm-big')).includes('right (jockey too far)'), 'pot: too far');
  // Cell 2: read its true emf, then balance it.
  await page.click(R + '.ptm-cell button[data-v="2"]');
  await page.click(R + '.ptm-reveal'); const E2 = Number((await txt('.ptm-true')).match(/([\d.]+) V/)[1]);
  const l2 = Math.round((E2 / 0.0043478260869565) * 10) / 10;
  await setR('.ptm-j', l2); check((await txt('.ptm-big')) === 'Galvanometer at zero: balanced!', `pot: cell 2 balances (${E2} V at ${l2} cm)`);
  await page.click(R + '.ptm-rec');
  const res = await txt('.ptm-res'), got = Number(res.match(/= ([\d.]+) V$/)[1]);
  check(Math.abs(got - E2) < 0.01, `pot: emf of cell 2 found (${res})`);
  // No balance with a big rheostat.
  await setR('.ptm-h', 8); check((await txt('.ptm-note')).startsWith('No balance point'), 'pot: no balance point message');
  await setR('.ptm-h', 0.5);
  // Internal resistance.
  await page.click(R + '.ptm-mode button[data-v=ir]'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ptm-k2') && await page.isHidden(R + '.ptm-cell'), 'pot: internal resistance controls');
  const tv = await txt('.ptm-true'), [E, r] = tv.match(/emf ([\d.]+) V, internal resistance ([\d.]+)/).slice(1).map(Number);
  await setR('.ptm-j', Math.round((E / 0.0043478260869565) * 10) / 10); await page.click(R + '.ptm-rec');
  await page.click(R + '.ptm-k2'); check((await txt('.ptm-k2')) === 'Open key K₂', 'pot: K₂ closed');
  await setR('.ptm-j', Math.round(((E * 5) / (5 + r) / 0.0043478260869565) * 10) / 10);
  check((await txt('.ptm-big')) === 'Galvanometer at zero: balanced!', 'pot: balanced with K₂ closed');
  await page.click(R + '.ptm-rec');
  const ir = await txt('.ptm-res'), rr = Number(ir.match(/= ([\d.]+) Ω$/)[1]);
  check(Math.abs(rr - r) < 0.03, `pot: internal resistance found (${ir}, true ${r})`);
  await page.click(R + '.ptm-new'); check((await txt('.ptm-tab')).includes('–') && await page.isHidden(R + '.ptm-true'), 'pot: new cells clear the table');
  check((await page.$$(R + '.eq-q')).length === 3, 'pot: three practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [e1, a, b] = q1.match(/emf ([\d.]+) V balances at (\d+) cm.*?at (\d+) cm/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((e1 * b) / a)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'pot: right answer accepted');
};
