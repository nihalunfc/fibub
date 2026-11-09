// #345 membrane potential (Nernst and GHK)
export const path = '/science/membrane-potential/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.mbp ';
  const t = (s) => page.textContent(R + s);
  const ion = (id, c) => `${R}tr[data-ion=${id}] ${c}`;
  await page.goto(`${BASE}/science/membrane-potential/`); await page.waitForTimeout(500);
  check((await t('.mb-big')) === 'Membrane potential (GHK) = −64.9 mV', 'membrane: example GHK voltage');
  { const s = await t('.mb-tab'); check(s.includes('−89.1 mV') && s.includes('+66.6 mV') && s.includes('−64.1 mV') && s.includes('+132.3 mV') && s.includes('+24.1 mV') && s.includes('−131.5 mV'), 'membrane: Nernst potentials and driving forces'); }
  check(await page.isVisible(R + '.mb-fig') && (await page.textContent('main')).includes('not for clinical use'), 'membrane: I–V plot and study note');
  await page.selectOption(R + '.mb-pre', 'peak'); await page.waitForTimeout(150);
  check((await t('.mb-big')).endsWith('+51.1 mV') && (await t('.mb-facts')).includes('Na⁺ dominates'), 'membrane: spike peak permeabilities');
  await page.selectOption(R + '.mb-pre', 'rest'); await page.fill(R + '.mb-T', '25'); await page.waitForTimeout(150);
  check((await t('.mb-big')).endsWith('−62.4 mV') && (await t('.mb-facts')).includes('25.69 mV'), 'membrane: temperature');
  await page.fill(R + '.mb-T', '37'); await page.fill(ion('Ca', '.mb-p'), '0.1'); await page.waitForTimeout(150);
  check((await t('.mb-facts')).includes('−63.8 mV'), 'membrane: zero-current potential with Ca²⁺');
  await page.fill(ion('Ca', '.mb-p'), '0'); await page.fill(ion('K', '.mb-o'), '50'); await page.waitForTimeout(150);
  check((await t('.mb-big')).includes('−'), 'membrane: raised outside K⁺ still computes');
  check(Number((await t('.mb-big')).match(/([\d.]+) mV/)[1]) > 29 && Number((await t('.mb-big')).match(/([\d.]+) mV/)[1]) < 31, 'membrane: outside K⁺ 50 mM depolarises to about −30 mV');
  await page.fill(ion('K', '.mb-o'), '5');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mb-csv')]); const f = OUT + 'ghk.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 92 && r[0] === 'V (mV),I K (uA/cm2),I Na (uA/cm2),I Cl (uA/cm2),I total (uA/cm2)' && r[11].startsWith('-100,-0.62111,-2.67563,-1.22989'), 'membrane: I–V CSV matches the reference currents'); }
  await page.fill(ion('Na', '.mb-i'), '0'); await page.waitForTimeout(150);
  check((await t('.mb-err')).includes('Na⁺ concentrations') && await page.isHidden(R + '.mb-out'), 'membrane: zero concentration message');
  await page.fill(ion('Na', '.mb-i'), '12'); await page.fill(R + '.mb-T', 'hot'); await page.waitForTimeout(150);
  check((await t('.mb-err')).includes('temperature'), 'membrane: bad temperature message');
};
