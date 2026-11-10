// #1434 Coordination compound namer
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/complex-namer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/complex-namer/`); await page.waitForSelector('.cx .cx-lig');
  const formula = () => page.textContent('.cx .cx-formula'), name = () => page.textContent('.cx .cx-name'), facts = () => page.textContent('.cx .cx-facts');
  check((await formula()) === '[CoCl(NH₃)₅]Cl₂' && (await name()) === 'pentaamminechloridocobalt(III) chloride' && (await page.textContent('.cx .cx-werner')).includes('2 mol of AgCl') && (await facts()).includes('octahedral'), 'complex: start example ' + (await formula()));
  const pre = (label) => page.locator('.cx .cx-pre button', { hasText: label }).first().click();
  await pre('CoCl₃·6NH₃'); check((await page.textContent('.cx .cx-werner')).includes('3 mol of AgCl') && (await facts()).includes('4'), 'complex: Werner 6NH3');
  await pre('K₃[Fe(CN)₆]'); check((await name()) === 'potassium hexacyanidoferrate(III)' && (await page.textContent('.cx .cx-eq')).includes('= −3'), 'complex: ferricyanide');
  await page.click('.cx .cx-ox [data-o="2"]'); check((await formula()) === 'K₄[Fe(CN)₆]' && (await name()).endsWith('ferrate(II)'), 'complex: oxidation state switch');
  await pre('[Ni(CO)₄]'); check((await name()) === 'tetracarbonylnickel(0)' && (await page.isHidden('.cx .cx-cwrap')) && (await page.textContent('.cx .cx-werner')).includes('no free ions'), 'complex: neutral Ni(CO)4');
  await pre('[Co(en)₃]Cl₃'); check((await name()) === 'tris(ethane-1,2-diamine)cobalt(III) chloride' && (await page.locator('.cx .cx-lig[data-l="NH3"] .cx-plus').isDisabled()), 'complex: en, plus disabled at 6');
  await pre('[Cu(NH₃)₄]SO₄'); check((await formula()) === '[Cu(NH₃)₄]SO₄' && (await facts()).includes('tetrahedral or square planar'), 'complex: copper sulfate complex');
  // build by hand: Co(III) + 6 NH3 with sulfate
  await pre('CoCl₃·6NH₃'); await page.click('.cx .cx-ctr [data-c="SO4"]');
  check((await formula()) === '[Co(NH₃)₆]₂(SO₄)₃' && (await name()) === 'hexaamminecobalt(III) sulfate' && (await facts()).includes('2 complex + 3 counter'), 'complex: sulfate counter ion');
  await page.click('.cx .cx-lig[data-l="NH3"] .cx-minus'); await page.click('.cx .cx-lig[data-l="H2O"] .cx-plus');
  check((await formula()) === '[Co(H₂O)(NH₃)₅]₂(SO₄)₃' && (await name()) === 'pentaammineaquacobalt(III) sulfate', 'complex: aqua added ' + (await name()));
  await page.selectOption('.cx .cx-m', 'Ag'); await page.click('.cx .cx-lig[data-l="H2O"] .cx-minus'); for (let i = 0; i < 3; i++) await page.click('.cx .cx-lig[data-l="NH3"] .cx-minus');
  check((await formula()).startsWith('[Ag(NH₃)₂]') && (await name()).startsWith('diamminesilver(I)') && (await facts()).includes('linear'), 'complex: silver diammine ' + (await formula()));
  await page.click('.cx .cx-lig[data-l="NH3"] .cx-minus');
  check((await page.textContent('.cx .cx-err')).includes('unusual'), 'complex: CN 1 is flagged');
  await page.click('.cx .cx-lig[data-l="NH3"] .cx-minus');
  check((await page.textContent('.cx .cx-err')).includes('Add at least one ligand') && (await formula()) === '', 'complex: no ligands message');
  await quiz(page, check, '.cx', 'complex');
};
