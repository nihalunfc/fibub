// #1070 binding-energy
export const path = '/learn/binding-energy/';
export default async ({ page, check, BASE }) => {
  const R = '.bne ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  const fill = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(500);
  check((await t('.be-eq')).includes('B = 882 (volume) − 260.5 (surface) − 120.8 (Coulomb) − 6.77 (asymmetry) + 1.49 (pairing) = 495.4 MeV, so B/A = 8.846 MeV') && (await t('.be-Av')) === '56 (Z = 26, N = 30)', 'bind: liquid drop for iron-56 (Python)');
  check((await t('.be-big')) === 'Helium-4: 28.296 MeV, 7.074 MeV per nucleon' && (await t('.be-meq')).includes('= 0.030377 u'), 'bind: helium-4 28.296 MeV (Python)');
  await slide('.be-A', 200);
  check((await t('.be-Av')) === '200 (Z = 80, N = 120)' && (await t('.be-eq')).includes('B/A = 7.920 MeV'), 'bind: A = 200 on the model');
  await page.selectOption(R + '.be-nuc', 'fe56'); await page.waitForTimeout(150);
  check((await t('.be-big')) === 'Iron-56: 492.26 MeV, 8.790 MeV per nucleon', 'bind: iron-56 8.790 MeV per nucleon');
  await page.selectOption(R + '.be-nuc', 'own'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.be-M') && (await t('.be-big')) === 'Z = 2, A = 4: 28.296 MeV, 7.074 MeV per nucleon', 'bind: own nucleus starts as helium-4');
  await fill('.be-M', '7');
  check((await t('.be-err')).includes('close to A'), 'bind: mass far from A');
  await fill('.be-M', '4.002603'); await fill('.be-Z', '5');
  check((await t('.be-err')).includes('1 ≤ Z < A'), 'bind: Z must be below A');
  await fill('.be-Z', '2');
  await page.click(R + '[data-r="fission"]'); await page.waitForTimeout(150);
  { const f = await t('.be-rf'); check(f.includes('173.3 MeV') && f.includes('0.734 MeV') && f.includes('7.1 × 10¹³ J') && await page.isVisible(R + '.be-react'), 'bind: fission 173.3 MeV, 7.1e13 J/kg (Python)'); }
  await page.click(R + '[data-r="fusion"]'); await page.waitForTimeout(150);
  { const f = await t('.be-rf'); check(f.includes('17.59 MeV') && f.includes('3.52 MeV') && f.includes('3.4 × 10¹⁴ J'), 'bind: fusion 17.59 MeV, 3.4e14 J/kg'); }
  await page.click(R + '[data-r="none"]'); await page.waitForTimeout(150);
  check(await page.isHidden(R + '.be-react'), 'bind: hide reaction');
  const inked = await page.$eval(R + '.be-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 140 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 300, `bind: curve drawn (${inked})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'bind: five questions');
  for (const i of [0, 1, 2]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  for (const i of [3, 4]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'bind: all five answered right');
};
