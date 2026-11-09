// #925 hydrogen orbital viewer
export const path = '/science/hydrogen-orbitals/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/hydrogen-orbitals/`); await page.waitForTimeout(1500);
  const facts = () => page.textContent('.hyo .hy-facts');
  check((await page.textContent('.hyo .hy-name')) === '3d z²' && (await page.textContent('.hyo .hy-big')) === 'E = −1.51174 eV', 'hydrogen: 3d z² example');
  { const f = await facts(); check(f.includes('10.5 a₀') && f.includes('Most probable radius9 a₀') && f.includes('15.798 a₀') && f.includes('Radial nodes0') && f.includes('Angular nodes2'), 'hydrogen: example facts'); }
  check(await page.isVisible('.hyo .hy-slice') && await page.isVisible('.hyo .hy-cloud') && await page.isVisible('.hyo .hy-rad') && (await page.textContent('.hyo .hy-leg')).includes('ψ negative'), 'hydrogen: three pictures and a sign legend');
  await page.selectOption('.hyo .hy-n', '4'); await page.waitForTimeout(300); await page.selectOption('.hyo .hy-l', '0'); await page.waitForTimeout(600);
  check((await page.textContent('.hyo .hy-name')) === '4s' && (await facts()).includes('spheres at r = 1.872, 6.611, 15.52 a₀'), 'hydrogen: 4s nodes');
  await page.selectOption('.hyo .hy-n', '2'); await page.waitForTimeout(300); await page.selectOption('.hyo .hy-l', '1'); await page.waitForTimeout(300);
  check((await page.$$eval('.hyo .hy-m option', (o) => o.map((x) => x.textContent))).join('|') === '-1 (2p y)|0 (2p z)|1 (2p x)', 'hydrogen: real m names');
  await page.selectOption('.hyo .hy-plane', 'xy'); await page.waitForTimeout(500);
  check((await page.textContent('.hyo .hy-leg')).includes('node'), 'hydrogen: 2p z in the xy plane is a node');
  await page.selectOption('.hyo .hy-m', '1'); await page.waitForTimeout(500);
  check((await page.textContent('.hyo .hy-name')) === '2p x' && !(await page.textContent('.hyo .hy-leg')).includes('node'), 'hydrogen: 2p x');
  await page.selectOption('.hyo .hy-kind', 'complex'); await page.waitForTimeout(500);
  check((await page.textContent('.hyo .hy-name')) === '2p, m = 1' && (await page.textContent('.hyo .hy-leg')).includes('complex'), 'hydrogen: complex orbital');
  await page.fill('.hyo .hy-z', '2'); await page.waitForTimeout(700);
  check((await page.textContent('.hyo .hy-big')) === 'E = −13.6057 eV' && (await page.textContent('.hyo .hy-name')).includes('Z = 2') && (await facts()).includes('2.5 a₀'), 'hydrogen: He⁺ n = 2');
  await page.fill('.hyo .hy-L', '5'); await page.waitForTimeout(700);
  check((await page.textContent('.hyo .hy-cloud')) !== null && await page.isVisible('.hyo .hy-cloud'), 'hydrogen: picture size');
  await page.selectOption('.hyo .hy-dots', '10000'); await page.waitForTimeout(800);
  check((await page.textContent('.hyo .hy-note')).includes('10,000 random positions'), 'hydrogen: 10,000 dots');
  await page.fill('.hyo .hy-az', '90'); await page.dispatchEvent('.hyo .hy-az', 'input'); await page.fill('.hyo .hy-el', '-45'); await page.dispatchEvent('.hyo .hy-el', 'input'); await page.waitForTimeout(200);
  check(await page.isVisible('.hyo .hy-cloud'), 'hydrogen: turn and tilt');
  await page.selectOption('.hyo .hy-n', '7'); await page.waitForTimeout(300); await page.selectOption('.hyo .hy-l', '6'); await page.waitForTimeout(300); await page.fill('.hyo .hy-z', '1'); await page.fill('.hyo .hy-L', ''); await page.waitForTimeout(1200);
  { const nm = await page.textContent('.hyo .hy-name'), f = await facts(); check(nm === '7i, m = 1' && f.includes('Most probable radius49 a₀'), `hydrogen: 7i peak at 49 a₀ (${nm}; ${f.slice(0, 120)})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hyo .hy-csv')]); const f = OUT + 'hy.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 402 && r[0] === 'r_a0,R,r2R2', 'hydrogen: radial CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hyo .dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'hydrogen: Word report'); }
  await page.fill('.hyo .hy-z', '0'); await page.waitForTimeout(600);
  check((await page.textContent('.hyo .hy-err')).includes('nuclear charge') && await page.isHidden('.hyo .hy-out'), 'hydrogen: bad Z message');
  await page.fill('.hyo .hy-z', '1'); await page.fill('.hyo .hy-L', '-3'); await page.waitForTimeout(600);
  check((await page.textContent('.hyo .hy-err')).includes('half-width'), 'hydrogen: bad size message');
};
