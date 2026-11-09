// #665 reactor design
export const path = '/science/reactor-design/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.rds ';
  await page.goto(`${BASE}/science/reactor-design/`); await page.waitForTimeout(700);
  check((await page.textContent(R + '.rd-big')) === 'For 80 % conversion: PFR 136.4 L, CSTR 682.1 L', 'reactor: example sizes');
  { const t = await page.textContent(R + '.rd-tab'); check(t.includes('230.72 L in all') && t.includes('13.641 min') && t.includes('68.21'), 'reactor: table with series, batch and space time'); }
  { const t = await page.textContent(R + '.rd-facts'); check(t.includes('0.29323') && t.includes('5 × the volume'), 'reactor: k at 60 °C and the PFR/CSTR ratio'); }
  check(await page.isVisible(R + '.rd-lev') && await page.isVisible(R + '.rd-prof'), 'reactor: Levenspiel and profile charts');
  await page.selectOption(R + '.rd-mode', 'conv'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.rd-big')) === 'In 200 L: PFR 85.43 %, CSTR 66.36 % conversion', 'reactor: conversion from size');
  check((await page.textContent(R + '.rd-tab')).includes('0.74569'), 'reactor: batch conversion in 10 min');
  await page.selectOption(R + '.rd-mode', 'size');
  await page.selectOption(R + '.rd-kind', 'reversible'); await page.fill(R + '.rd-k', '0.3'); await page.fill(R + '.rd-ea', '0'); await page.fill(R + '.rd-x', '0.75'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.rd-facts')).includes('Equilibrium conversion0.8') && (await page.textContent(R + '.rd-tab')).includes('121.59 L in all'), 'reactor: reversible first order');
  await page.fill(R + '.rd-x', '0.85'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-err')).includes('below the equilibrium conversion') && await page.isHidden(R + '.rd-out'), 'reactor: beyond equilibrium message');
  await page.fill(R + '.rd-x', '0.8');
  await page.selectOption(R + '.rd-kind', 'mm'); await page.fill(R + '.rd-k', '0.8'); await page.fill(R + '.rd-ca0', '2'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.rd-tab')).includes('5'), 'reactor: saturating rate law');
  await page.selectOption(R + '.rd-kind', 'power'); await page.fill(R + '.rd-n', '1'); await page.fill(R + '.rd-k', '0.2'); await page.fill(R + '.rd-eps', '0.5'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.rd-big')) === 'For 80 % conversion: PFR 100.7 L, CSTR 280 L', 'reactor: first order gas with ε = 0.5');
  check((await page.textContent(R + '.rd-k') ?? '') === '' && (await page.textContent('.rds .rd-ku')) === '1/min', 'reactor: k units follow the order');
  await page.selectOption(R + '.rd-tu', 'h'); await page.waitForTimeout(100);
  check((await page.textContent('.rds .rd-ku')) === '1/h', 'reactor: time unit');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rd-csv')]); const f = OUT + 'lev.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 122 && rows[0] === 'X,rate_mol_per_L_h,FA0_over_rate_L', 'reactor: Levenspiel CSV'); }
  await page.fill(R + '.rd-n', '9'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-rerr')).includes('order from 0 to 5'), 'reactor: bad order message');
  await page.fill(R + '.rd-n', '1');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'reactor-design.pdf', 'reactor: PDF report'); }
};
