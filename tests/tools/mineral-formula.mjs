// #872 mineral formula calculator
export const path = '/science/mineral-formula/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.mnf ';
  await page.goto(`${BASE}/science/mineral-formula/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.mnf-big'), tab = () => page.textContent(R + '.mnf-table'), wait = () => page.waitForTimeout(200);
  const row = (name) => page.evaluate((n) => { const tr = [...document.querySelectorAll('.mnf .mnf-table tbody tr')].find((t) => t.cells[0].textContent === n); return tr ? [...tr.cells].slice(1).map((c) => c.textContent) : null; }, name);
  check((await big()) === '3 analyses on 6 oxygens · Cpx-1: Wo44 En46 Fs10', `mineral: example headline (${await big()})`);
  check(JSON.stringify(await row('Fe³⁺')) === '["0.055","0.024","0.032"]' && JSON.stringify(await row('Si')) === '["1.897","1.962","1.938"]', 'mineral: Droop Fe³⁺ and Si match numpy');
  check(JSON.stringify(await row('Cations')) === '["4.000","4.000","4.000"]' && JSON.stringify(await row('Charge')) === '["12.000","12.000","12.000"]', 'mineral: cation and charge sums');
  check(JSON.stringify(await row('Wo (mol %)')) === '["43.7","42.8","2.3"]' && (await row('FeO recalculated (wt%)'))[0] === '4.23' && (await row('Fe2O3 recalculated (wt%)'))[0] === '1.97', 'mineral: end-members and recalculated iron');
  check(await page.isVisible(R + '.mnf-fig'), 'mineral: pyroxene ternary drawn');
  // CSV and PDF.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mnf-csv')]); const f = OUT + 'mnf.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0].startsWith('sample,SiO2_wt') && rows[0].includes('Fe3_apfu') && rows[0].includes(',Wo,En,Fs,') && rows[1].startsWith('Cpx-1,51.5'), `mineral: CSV (${rows[0].slice(0, 40)})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'mineral-formulae.pdf', 'mineral: PDF report'); }
  // All iron as Fe²⁺: cations on 6 O, sum 4.018 (pyrolite).
  await page.selectOption(R + '.mnf-fe', 'fe2'); await wait();
  check((await row('Cations'))[0] === '4.018' && (await row('Fe³⁺')) === null && (await row('Fe²⁺'))[0] === '0.186', 'mineral: all Fe²⁺ on 6 oxygens matches pyrolite');
  check((await page.textContent(R + '.mnf-notes')).includes('more than 1.5 %') === false, 'mineral: no cation-sum warning within 1.5 %');
  await page.selectOption(R + '.mnf-fe', 'droop');
  // Mineral presets switch the example while it is untouched.
  await page.selectOption(R + '.mnf-min', 'olivine'); await wait();
  check((await page.inputValue(R + '.mnf-o')) === '4' && (await page.inputValue(R + '.mnf-t')) === '3' && (await page.inputValue(R + '.mnf-fe')) === 'fe2' && (await big()) === '2 analyses on 4 oxygens · Ol-1: Fo88 Fa11 Tep0', `mineral: olivine preset (${await big()})`);
  check(await page.isHidden(R + '.mnf-fig'), 'mineral: no ternary for olivine');
  await page.selectOption(R + '.mnf-min', 'feldspar'); await wait();
  check((await big()).includes('Pl-1: An51 Ab47 Or2') && await page.isVisible(R + '.mnf-fig'), 'mineral: feldspar preset and An-Ab-Or ternary');
  await page.selectOption(R + '.mnf-min', 'garnet'); await wait();
  check((await big()).includes('Grt-core: Alm67 Prp20 Sps5 Grs8') && (await page.textContent(R + '.mnf-notes')).includes('no Fe³⁺ is needed'), 'mineral: garnet preset, Droop finds no Fe³⁺');
  await page.selectOption(R + '.mnf-min', 'spinel'); await wait();
  check((await tab()).includes('Cr# = 100 Cr/(Cr + Al)') && (await row('Cr# = 100 Cr/(Cr + Al)'))[0] === '31.2', 'mineral: spinel Cr#');
  await page.selectOption(R + '.mnf-min', 'amphibole'); await wait();
  check((await page.inputValue(R + '.mnf-o')) === '23' && (await page.inputValue(R + '.mnf-t')) === '' && (await page.textContent(R + '.mnf-notes')).includes('hydrous'), 'mineral: amphibole on 23 O with the hydrous total note');
  await page.selectOption(R + '.mnf-fe', 'droop'); await wait();
  check((await page.textContent(R + '.mnf-err')).includes('ideal number of cations'), 'mineral: Droop without a cation total message');
  await page.selectOption(R + '.mnf-min', 'pyroxene'); await wait();
  // Feldspar analysis forced through Droop: capped.
  await page.selectOption(R + '.mnf-min', 'feldspar'); await page.selectOption(R + '.mnf-fe', 'droop'); await wait();
  check((await page.textContent(R + '.mnf-notes')).includes('more Fe³⁺ than there is iron'), 'mineral: capped charge balance warning');
  // Typed basis: custom oxygens.
  await page.selectOption(R + '.mnf-min', 'pyroxene'); await page.fill(R + '.mnf-o', '12'); await page.fill(R + '.mnf-t', '8'); await wait();
  check((await row('Cations'))[0] === '8.000' && (await row('Fe³⁺'))[0] === '0.109', 'mineral: doubled basis doubles the formula');
  await page.fill(R + '.mnf-o', '0'); await wait();
  check((await page.textContent(R + '.mnf-err')).includes('number of oxygens'), 'mineral: zero oxygens message');
  await page.fill(R + '.mnf-o', '6'); await page.fill(R + '.mnf-t', '4');
  // Analysed Fe2O3 and FeO, transposed layout, aliases and ignored columns.
  await page.selectOption(R + '.mnf-fe', 'analysed');
  await page.fill(R + '.mnf-data', 'Oxide\tA\tB\nSiO2\t50\t52\nFe2O3\t5\t0\nFeO\t5\t10\nMgO\t15\t15\nCaO\t22\t22\nTotal\t97\t99'); await wait();
  check((await row('Fe³⁺'))[0] !== '0' && (await row('Fe³⁺'))[1] === '0' && (await page.textContent(R + '.mnf-notes')).includes('Ignored columns: Total'), 'mineral: analysed Fe2O3, oxides down the side, Total ignored');
  await page.selectOption(R + '.mnf-fe', 'droop');
  await page.fill(R + '.mnf-data', 'Name,SiO2,MgO,FeO*\nA,40,48,n.d.'); await wait();
  check((await page.textContent(R + '.mnf-notes')).includes('FeO* read as total iron') && (await big()).startsWith('1 analysis'), 'mineral: FeO* alias and n.d.');
  // Bad input.
  await page.fill(R + '.mnf-data', 'Name,SiO2,MgO\nA,40,x'); await wait();
  check((await page.textContent(R + '.mnf-err')).includes('"x" under MgO'), 'mineral: bad value message');
  await page.fill(R + '.mnf-data', 'Name,Foo,Bar\nA,1,2'); await wait();
  check((await page.textContent(R + '.mnf-err')).includes('No oxide names'), 'mineral: no oxides message');
  await page.fill(R + '.mnf-data', 'Name,SiO2,MgO,SiO2\nA,1,2,3'); await wait();
  check((await page.textContent(R + '.mnf-err')).includes('twice'), 'mineral: duplicate oxide message');
  // Open a file.
  writeFileSync(OUT + 'mnf.csv', 'Sample,SiO2,MgO,FeO\nFo100,' + [42.7, 57.3, 0].join(',') + '\nFo90,40.8,49.4,9.8');
  await page.selectOption(R + '.mnf-min', 'olivine'); await page.setInputFiles(R + '.dfb-in', OUT + 'mnf.csv'); await page.waitForTimeout(400);
  check((await big()).startsWith('2 analyses on 4 oxygens · Fo100: Fo100') && (await page.textContent(R + '.dfb-note')).includes('Opened mnf.csv'), `mineral: opened CSV (${await big()})`);
  await page.click(R + '.mnf-ex'); await wait();
  check((await big()).includes('Ol-1'), 'mineral: example for this mineral');
};
