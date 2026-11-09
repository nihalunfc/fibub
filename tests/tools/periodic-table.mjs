// #835 periodic table
export const path = '/science/periodic-table/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ptab';
  await page.goto(`${BASE}/science/periodic-table/`); await page.waitForTimeout(500);
  const facts = () => page.textContent(`${R} .pt-facts`), cfg = () => page.textContent(`${R} .pt-cfg`);
  check((await page.locator(`${R} .pt-el`).count()) === 118, 'ptable: 118 cells');
  check((await page.textContent(`${R} .pt-name`)) === 'Iron' && (await page.getAttribute(`${R} .pt-el[data-z="26"]`, 'aria-selected')) === 'true', 'ptable: iron selected at start');
  { const f = await facts(); check(f.includes('Atomic number26') && f.includes('55.845 g/mol') && f.includes('Group8') && f.includes('Period4') && f.includes('Blockd') && f.includes('1.83') && f.includes('7.9 eV (762 kJ/mol)') && f.includes('+2, +3') && f.includes('Unpaired electrons (atom)4'), `ptable: iron facts (${f})`); }
  check((await cfg()) === 'Full1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²Noble-gas notation[Ar] 3d⁶ 4s²', `ptable: iron configuration (${await cfg()})`);
  check((await page.textContent(`${R} .pt-ion`)) === 'Fe²⁺: [Ar] 3d⁶ (24 electrons)', 'ptable: Fe2+');
  await page.click(`${R} .pt-order [data-o="fill"]`); await page.waitForTimeout(50);
  check((await cfg()).includes('[Ar] 4s² 3d⁶') && (await cfg()).includes('3p⁶ 4s² 3d⁶'), 'ptable: filling order');
  await page.click(`${R} .pt-order [data-o="shell"]`);
  // Tap chromium: exception text
  await page.locator(`${R} .pt-el[data-z="24"]`).scrollIntoViewIfNeeded(); await page.click(`${R} .pt-el[data-z="24"]`); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-exc`)).includes('the rule alone would give [Ar] 3d⁴ 4s²') && (await cfg()).includes('[Ar] 3d⁵ 4s¹'), 'ptable: chromium exception');
  // Find box
  await page.fill(`${R} .pt-find`, 'cesium'); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .pt-name`)) === 'Caesium' && (await facts()).includes('0.79'), 'ptable: find by US name');
  await page.fill(`${R} .pt-find`, '43'); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .pt-tw`)) === '[97]' && (await facts()).includes('[97] (mass number of the longest-lived isotope)') && (await page.textContent(`${R} .pt-iso`)).includes('None stable'), 'ptable: technetium radioactive');
  await page.fill(`${R} .pt-find`, 'Xx'); await page.waitForTimeout(80);
  check(!(await page.isHidden(`${R} .pt-ferr`)) && (await page.textContent(`${R} .pt-ferr`)).includes('No element "Xx"'), 'ptable: unknown element message');
  await page.fill(`${R} .pt-find`, 'Eu'); await page.waitForTimeout(80);
  await page.fill(`${R} .pt-q`, '3'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-ion`)) === 'Eu³⁺: [Xe] 4f⁶ (60 electrons)' && (await facts()).includes('none (f block, lanthanoid)'), 'ptable: Eu3+ and f block');
  await page.fill(`${R} .pt-find`, 'O'); await page.fill(`${R} .pt-q`, '-2'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-ion`)) === 'O²⁻: [Ne] (10 electrons)', 'ptable: oxide');
  await page.fill(`${R} .pt-q`, '9'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-ion`)) === 'O has only 8 electrons.', 'ptable: too many removed');
  await page.fill(`${R} .pt-q`, '7'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-ion`)).includes('noble-gas core'), 'ptable: into the core warning');
  await page.fill(`${R} .pt-q`, '2');
  await page.fill(`${R} .pt-find`, 'Ds'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-exc`)).startsWith('Predicted from the Aufbau rule') && (await facts()).includes('no measured value'), 'ptable: superheavy predicted');
  await page.fill(`${R} .pt-find`, 'Lu'); await page.waitForTimeout(50);
  check((await facts()).includes('Group3') && (await page.textContent(`${R} .pt-sub`)).startsWith('Lanthanoid, d block'), 'ptable: lutetium in group 3');
  // Previous/next
  await page.click(`${R} .pt-next`); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-name`)) === 'Hafnium', 'ptable: next');
  await page.fill(`${R} .pt-find`, '1'); await page.waitForTimeout(50);
  check(await page.isDisabled(`${R} .pt-prev`), 'ptable: previous disabled at hydrogen');
  // Colouring
  const bg = (z) => page.$eval(`${R} .pt-el[data-z="${z}"]`, (b) => getComputedStyle(b).backgroundColor);
  check((await bg(3)) !== (await bg(9)) && (await page.textContent(`${R} .pt-legend`)).includes('alkali metal'), 'ptable: coloured by category');
  await page.selectOption(`${R} .pt-prop`, 'en'); await page.waitForTimeout(80);
  { const lg = await page.textContent(`${R} .pt-legend`); check(lg.includes('0.7') && lg.includes('3.98') && lg.includes('Faded: no value (18 elements)') && (await page.getAttribute(`${R} .pt-el[data-z="10"]`, 'class')).includes('dim') && (await page.inputValue(`${R} .pt-chartp`)) === 'en', `ptable: coloured by electronegativity (${lg})`); }
  const c1 = await bg(55), c2 = await bg(9);
  check(c1 !== c2, 'ptable: Cs and F differ in colour');
  await page.selectOption(`${R} .pt-prop`, 'block'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-legend`)).includes('f block'), 'ptable: block legend');
  // Chart
  await page.fill(`${R} .pt-find`, 'Fe'); await page.selectOption(`${R} .pt-chartp`, 'ie'); await page.waitForTimeout(150);
  check((await page.getAttribute(`${R} .pt-fig`, 'aria-label')).includes('First ionisation energy against atomic number, Iron marked at 7.9') && (await page.textContent(`${R} .pt-chelp`)).includes('Iron (red point): 7.9 eV'), 'ptable: trend chart');
  { const px = await page.$eval(`${R} .pt-fig`, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 || d[i + 2] < 200) n++; return n; }); check(px > 2000, `ptable: chart drawn (${px})`); }
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .pt-csv`)]); const f = OUT + 'pt.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').split('\n');
    check(t.length === 120 && t[0].startsWith('Z,symbol,name,atomic_weight') && t[26].startsWith('26,Fe,Iron,55.845,no,8,4,d,transition metal,1s2 2s2 2p6 3s2 3p6 3d6 4s2,[Ar] 3d6 4s2,no,4,2 3,1.83,7.9'), 'ptable: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .pt-card [data-f="pdf"]`)]); const f = OUT + 'pt.pdf'; await d.saveAs(f); check(d.suggestedFilename() === 'element-26-Fe.pdf' && readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'ptable: PDF card'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .pt-card [data-f="docx"]`)]); check(d.suggestedFilename() === 'element-26-Fe.docx', 'ptable: Word card'); }
  // Keyboard
  await page.focus(`${R} .pt-el[data-z="26"]`); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .pt-name`)) === 'Cobalt', 'ptable: arrow key');
};
