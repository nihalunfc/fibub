// #1105 Newman projection spinner
export const path = '/learn/conformation-spinner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/conformation-spinner/`); await page.waitForTimeout(1200);
  const t = (s) => page.textContent('.cfs ' + s);
  check((await t('.cf-big')) === 'Butane at 60°: gauche (staggered)', 'conf: butane gauche to start');
  check((await t('.cf-formula')) === 'E = 9.77 + 2.27 cos φ − 0.27 cos 2φ + 7.23 cos 3φ = 3.8 kJ/mol at φ = 60°', 'conf: formula with live numbers');
  check((await t('.cf-facts')).includes('about 70 %'), 'conf: anti share');
  const nwImg = () => page.$eval('.cfs .cf-newman', (c) => c.toDataURL()), grImg = () => page.$eval('.cfs .cf-graph', (c) => c.toDataURL());
  const n0 = await nwImg(), g0 = await grImg();
  await page.click('.cfs .cf-p60'); await page.waitForTimeout(100);
  check((await t('.cf-big')) === 'Butane at 120°: eclipsed' && (await t('.cf-facts')).includes('16.0 kJ/mol') && (await nwImg()) !== n0 && (await grImg()) !== g0, 'conf: +60 gives eclipsed, pictures change');
  await page.click('.cfs .cf-p60'); await page.waitForTimeout(100);
  check((await t('.cf-big')) === 'Butane at 180°: anti (staggered)' && (await t('.cf-facts')).includes('0.0 kJ/mol'), 'conf: anti');
  await page.click('.cfs .cf-m60'); await page.click('.cfs .cf-m60'); await page.click('.cfs .cf-m60'); await page.waitForTimeout(100);
  check((await t('.cf-big')) === 'Butane at 0°: fully eclipsed (syn)' && (await t('.cf-facts')).includes('19.0 kJ/mol'), 'conf: fully eclipsed');
  await page.$eval('.cfs .cf-phi', (e) => { e.value = '45'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await t('.cf-big')) === 'Butane at 45°: skew (in between)', 'conf: slider');
  // Drag on the Newman projection: pointer straight below the centre → 180°.
  await page.$eval('.cfs .cf-newman', (c) => c.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  const b = await (await page.$('.cfs .cf-newman')).boundingBox();
  await page.mouse.move(b.x + b.width / 2 + 60, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 + 80, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(100);
  check((await t('.cf-big')) === 'Butane at 180°: anti (staggered)', `conf: drag round the circle (${await t('.cf-big')})`);
  // Tap on the graph near 300°.
  const g = await (await page.$('.cfs .cf-graph')).boundingBox();
  await page.$eval('.cfs .cf-graph', (c) => c.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  const g2 = await (await page.$('.cfs .cf-graph')).boundingBox();
  await page.mouse.click(g2.x + ((44 + (300 / 360) * 464) / 520) * g2.width, g2.y + g2.height / 2); await page.waitForTimeout(100);
  check(g.width > 200 && (await t('.cf-big')) === 'Butane at 300°: gauche (staggered)', `conf: tap the graph (${await t('.cf-big')})`);
  await page.click('.cfs .cf-mol button[data-m="ethane"]'); await page.waitForTimeout(100);
  check((await t('.cf-big')) === 'Ethane at 300°: staggered' && (await t('.cf-formula')) === 'E = ½ × 12.5 × (1 + cos 3φ) = ½ × 12.5 × (1 + cos (3 × 300°)) = 0.0 kJ/mol' && !(await t('.cf-facts')).includes('anti at 25'), 'conf: ethane');
  await page.click('.cfs .cf-p60'); await page.waitForTimeout(100);
  check((await t('.cf-big')) === 'Ethane at 0°: eclipsed' && (await t('.cf-facts')).includes('12.5 kJ/mol'), 'conf: ethane eclipsed');
  await page.click('.cfs .cf-spin'); await page.waitForTimeout(500); await page.click('.cfs .cf-spin');
  const after = await t('.cf-big');
  check(after !== 'Ethane at 0°: eclipsed' && (await t('.cf-spin')) === 'Spin', 'conf: spin and stop');
  // Check yourself: choose the first option everywhere, then read the right answers.
  const sels = await page.$$('.cfs .cf-qa');
  check(sels.length === 4 && (await page.$$('.cfs .cf-q1 canvas')).length === 4, 'conf: 4 questions with pictures');
  for (const s of sels) await s.selectOption({ index: 1 });
  await page.click('.cfs .cf-check');
  const right = await page.$$eval('.cfs .cf-q1', (qs) => qs.map((d) => { const a = d.querySelector('.cf-ans').textContent; return a.startsWith('✓') ? d.querySelector('select').value : a.match(/It is (.+?)\. The dihedral/)[1]; }));
  for (let i = 0; i < 4; i++) await sels[i].selectOption(right[i]);
  await page.click('.cfs .cf-check');
  check((await t('.cf-score')) === '4 of 4 right' && (await t('.cf-qs')).includes('The dihedral angle is'), 'conf: quiz all right with angle shown');
  await page.click('.cfs .cf-new');
  check((await t('.cf-score')) === '', 'conf: new questions');
};
