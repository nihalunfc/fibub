// #966 superconductor calculator
export const path = '/science/superconductor-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.scc ';
  const big = () => page.textContent(R + '.sc-big'), facts = () => page.textContent(R + '.sc-facts'), err = () => page.textContent(R + '.sc-err');
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(350); };
  await page.goto(`${BASE}/science/superconductor-calculator/`); await page.waitForTimeout(800);
  check((await big()) === 'Type II (κ = 1.14): Δ₀ = 1.4 meV, B_c2(0) ≈ 0.269 T', 'sc: example result');
  { const f = await facts(); check(f.includes('676.3 GHz') && f.includes('1.359 meV') && f.includes('Δ(T)/Δ₀ = 0.9715') && f.includes('40.9 nm at 4.2 K') && f.includes('0.166 T at 0 K') && f.includes('13.7 mT') && f.includes('17.1 T'), 'sc: gap, λ(T) and fields'); }
  check(await page.isVisible(R + '.sc-gfig') && await page.isVisible(R + '.sc-bfig'), 'sc: figures');
  await set('.sc-t', '10'); { const f = await facts(); check(f.includes('0 (normal state)'), 'sc: above Tc is normal'); }
  await set('.sc-t', '4.2'); await set('.sc-r', '4.3'); check((await big()).includes('Δ₀ = 1.7 meV'), 'sc: strong-coupling gap ratio');
  await set('.sc-r', '3.528'); await set('.sc-xi', '100'); check((await big()).startsWith('Type I (κ = 0.4)') && !(await facts()).includes('Lower critical'), 'sc: type I');
  await set('.sc-xi', '35');
  await page.selectOption(R + '.sc-mode', 'mat'); await page.waitForTimeout(350);
  check((await big()).startsWith('Type I (κ = 0.355)') && (await facts()).includes('London λ_L = 53.1 nm, BCS ξ₀ = 150 nm') && await page.isHidden(R + '.sc-lam'), 'sc: estimate from the electrons (clean)');
  await set('.sc-l', '10'); check((await big()).startsWith('Type II'), 'sc: short mean free path makes it type II');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-csv')]); const f = OUT + 'sc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 102 && rows[0].startsWith('T (K),gap (meV)') && rows[101].endsWith(',0,0,0'), 'sc: temperature CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'sc.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'sc: PDF report'); }
  await set('.sc-l', '-3'); check((await err()).includes('mean free path'), 'sc: bad mean free path message');
  await set('.sc-l', ''); await set('.sc-n', '0'); check((await err()).includes('electron density') && await page.isHidden(R + '.sc-out'), 'sc: bad density message');
  await set('.sc-n', '1'); await set('.sc-vf', 'x'); check((await err()).includes('Fermi velocity'), 'sc: bad Fermi velocity message');
  await set('.sc-vf', '1'); await page.selectOption(R + '.sc-mode', 'len'); await page.waitForTimeout(300);
  await set('.sc-tc', '0'); check((await err()).includes('critical temperature'), 'sc: bad Tc message');
  await set('.sc-tc', '9.2'); await set('.sc-r', '1'); check((await err()).includes('gap ratio'), 'sc: bad gap ratio message');
  await set('.sc-r', '3.528'); await set('.sc-lam', '0'); check((await err()).includes('penetration depth'), 'sc: bad λ message');
  await set('.sc-lam', '40'); check((await big()).startsWith('Type II (κ = 1.14)'), 'sc: back to the example');
};
