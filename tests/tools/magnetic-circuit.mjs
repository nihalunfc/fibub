// #914 magnetic circuit solver
export const path = '/science/magnetic-circuit/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/magnetic-circuit/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.mgc ' + c), set = async (c, v) => { await page.fill('.mgc ' + c, v); await page.waitForTimeout(250); };
  check((await t('.mc-big')) === 'Φ = 437.1 µWb, B = 1.093 T in the gap', 'magcircuit: example ring with a gap');
  { const f = await t('.mc-facts'); check(f.includes('2.288 MA-t/Wb') && f.includes('109.3 mH') && f.includes('218.5 mJ') && f.includes('87 % of it is in the gaps') && f.includes('190 N'), 'magcircuit: reluctance, L, energy, gap share and pull'); }
  check((await t('.mc-tab')).includes('869.6') && (await t('.mc-tab')).includes('130.4') && (await t('.mc-warn')).includes('below 1.50 T') && await page.isVisible('.mgc .mc-fig'), 'magcircuit: MMF per segment, no saturation');
  await set('.mc-tgt', '0.8');
  check((await t('.mc-facts')).includes('732.1 A-t') && (await t('.mc-facts')).includes('1.464 A with 500 turns'), 'magcircuit: current for a target gap field');
  await page.check('.mgc .mc-fr'); await page.waitForTimeout(250);
  check((await t('.mc-big')) === 'Φ = 475.5 µWb, B = 1.078 T in the gap' && (await t('.mc-tab')).includes('441'), 'magcircuit: fringing');
  await page.uncheck('.mgc .mc-fr'); await set('.mc-I', '3');
  check((await t('.mc-warn')).includes('Above the 1.50 T saturation value'), 'magcircuit: saturation warning');
  await set('.mc-sat', '2');
  check((await t('.mc-warn')).includes('below 2'), 'magcircuit: saturation value');
  await set('.mc-I', '2'); await set('.mc-sat', '1.5');
  await page.selectOption('.mgc .mc-pre', 'ring'); await page.waitForTimeout(300);
  check((await t('.mc-big')).startsWith('Φ = ') && (await t('.mc-big')).endsWith('T in the core') && (await t('.mc-warn')).includes('Above') && (await t('.mc-facts')).includes('no gap'), 'magcircuit: ring with no gap saturates');
  await page.selectOption('.mgc .mc-pre', 'three'); await page.waitForTimeout(300);
  check((await t('.mc-big')) === 'Φ = 474.9 µWb, B = 0.5937 T in the gap' && (await t('.mc-facts')).includes('118.7 mH') && (await t('.mc-facts')).includes('Flux in Return A237.5 µWb50 % of the coil flux'), 'magcircuit: three-leg core (SymPy)');
  await set('.mc-b', '');
  check((await t('.mc-facts')).includes('Flux in Return A') && !(await t('.mc-facts')).includes('Return B'), 'magcircuit: one return leg');
  await set('.mc-N', '1000');
  check((await t('.mc-facts')).includes('2000 A-t'), 'magcircuit: turns');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mgc .mc-csv')]); const f = OUT + 'mc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 4 && r[0].startsWith('leg,segment'), 'magcircuit: segments CSV'); }
  for (const x of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.mgc .dl [data-f=${x}]`)]); check(d.suggestedFilename() === `magnetic-circuit.${x}`, `magcircuit: ${x} report`); }
  await set('.mc-c', 'iron 100 400 2000'); check((await t('.mc-err')).includes('Coil leg, line 1: start with') && await page.isHidden('.mgc .mc-out'), 'magcircuit: bad segment kind message');
  await set('.mc-c', 'core 100 400'); check((await t('.mc-err')).includes('μr'), 'magcircuit: missing μr message');
  await set('.mc-c', ''); check((await t('.mc-err')).includes('at least one segment'), 'magcircuit: empty coil leg message');
  await set('.mc-c', 'core 100 400 2000'); await set('.mc-a', 'gap 0 400'); check((await t('.mc-err')).includes('Return leg A'), 'magcircuit: bad return leg message');
  await set('.mc-a', 'core 200 400 2000'); await set('.mc-I', '0'); check((await t('.mc-err')).includes('current'), 'magcircuit: zero current message');
  await set('.mc-I', '1'); await set('.mc-tgt', '-1'); check((await t('.mc-err')).includes('target B'), 'magcircuit: bad target message');
};
