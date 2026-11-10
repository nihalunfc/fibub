// #1407 Kirchhoff's rules solver
export const path = '/learn/kirchhoff-solver/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/kirchhoff-solver/`); await page.waitForTimeout(600);
  const R = '.kch ', txt = (s) => page.textContent(R + s);
  const big = await txt('.kch-big');
  check(big === '5 equations, 5 unknowns: I₁ = 0.818 A, I₂ = 0.0909 A, I₃ = −0.818 A, I₄ = 0.727 A, I₅ = 0.0909 A', `kirchhoff: example (${big})`);
  const eqs = await txt('.kch-eqs');
  check(eqs.includes('Loop A → B → D → A (through I₁, I₃, I₄): 2 I₁ + 6 I₄ = 6') && eqs.includes('Junction B (out − in): −I₁ + I₂ + I₄ = 0'), `kirchhoff: equations (${eqs})`);
  const tab = await txt('.kch-tab');
  check(tab.includes('charging') && tab.includes('D → A') && tab.includes('4.36 V'), `kirchhoff: table (${tab})`);
  check((await txt('.kch-join')).includes('D, E, F (called D)'), 'kirchhoff: wire-joined junctions named');
  const inked = () => page.$eval(R + '.kch-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked()) > 800, 'kirchhoff: picture drawn');
  // Tap the middle resistor (side B–E) on the canvas and change it.
  await page.$eval(R + '.kch-fig', (e) => e.scrollIntoView({ block: 'center' }));
  const box = await page.$eval(R + '.kch-fig', (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
  const k = box.w / 340;
  await page.mouse.click(box.x + 170 * k, box.y + 110 * k); await page.waitForTimeout(100);
  check((await page.$eval(R + '.kch-edge', (e) => e.value)) === 'v01', 'kirchhoff: tapping picks a side');
  await page.fill(R + '.kch-r', '18'); await page.waitForTimeout(100);
  check((await txt('.kch-big')).includes('I₄ = 0.276 A'), `kirchhoff: bigger middle resistor (${await txt('.kch-big')})`);
  await page.fill(R + '.kch-r', '0'); await page.waitForTimeout(100);
  check((await txt('.kch-verr')).includes('resistance above 0'), 'kirchhoff: bad resistance message');
  await page.fill(R + '.kch-r', '6');
  await page.click(R + '.kch-kind button[data-v=wire]'); await page.waitForTimeout(100);
  check((await txt('.kch-big')).startsWith('4 equations') && (await page.isHidden(R + '.kch-vals')), `kirchhoff: wire in the middle (${await txt('.kch-big')})`);
  await page.click(R + '.kch-kind button[data-v=empty]'); await page.waitForTimeout(100);
  check((await txt('.kch-big')).includes('I₁ = 0.333 A'), `kirchhoff: middle removed (${await txt('.kch-big')})`);
  // A cell: pick the left side, turn it round.
  await page.selectOption(R + '.kch-edge', 'v00');
  check((await txt('.kch-pol')) === '+ end at A' && await page.isVisible(R + '.kch-el'), 'kirchhoff: cell panel');
  await page.click(R + '.kch-flip'); await page.waitForTimeout(100);
  check((await txt('.kch-pol')) === '+ end at D' && (await txt('.kch-big')).includes('I₁ = −1.67 A'), `kirchhoff: cell turned round (${await txt('.kch-big')})`);
  await page.fill(R + '.kch-e', 'x'); await page.waitForTimeout(100);
  check((await txt('.kch-verr')).includes('emf'), 'kirchhoff: bad emf message');
  // Presets.
  await page.selectOption(R + '.kch-preset', 'parallelcells'); await page.waitForTimeout(100);
  check((await txt('.kch-big')).includes('I₃ = 2 A') && (await txt('.kch-big')).includes('I₂ = 0 A'), `kirchhoff: cells in parallel (${await txt('.kch-big')})`);
  await page.selectOption(R + '.kch-preset', 'series'); check((await txt('.kch-big')).includes('I₁ = 1.20 A'), 'kirchhoff: series preset');
  await page.selectOption(R + '.kch-preset', 'ladder'); check((await txt('.kch-big')).includes('I₁ = 2.27 A'), 'kirchhoff: ladder preset');
  await page.selectOption(R + '.kch-preset', 'blank'); await page.waitForTimeout(100);
  check((await txt('.kch-err')).includes('Add at least one'), 'kirchhoff: blank grid message');
  // A short circuit.
  await page.selectOption(R + '.kch-edge', 'v00'); await page.click(R + '.kch-kind button[data-v=cell]');
  for (const id of ['h00', 'v01', 'h10']) { await page.selectOption(R + '.kch-edge', id); await page.click(R + '.kch-kind button[data-v=wire]'); }
  await page.waitForTimeout(100);
  check((await txt('.kch-err')).includes('short circuit'), `kirchhoff: short circuit caught (${await txt('.kch-err')})`);
  check((await page.$$(R + '.eq-q')).length === 4, 'kirchhoff: four practice questions');
  const q2 = await page.textContent(R + '.eq-q:nth-child(2) p'), [a, b] = q2.match(/([\d.]+) A flows in.*?([\d.]+) A flows out/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(2) .eq-in', String(a - b)); await page.click(R + '.eq-q:nth-child(2) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(2) .eq-res')).startsWith('Right'), 'kirchhoff: right answer accepted');
};
