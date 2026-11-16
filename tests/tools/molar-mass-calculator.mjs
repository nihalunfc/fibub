// #T78 molar mass calculator
export const path = '/science/molar-mass-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.mmc ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/molar-mass-calculator/`); await page.waitForTimeout(500);
  check((await t('.mmc-big')).includes('249.68 g/mol'), 'molar mass: example result');
  check((await t('.mmc-work')) === '63.546 (Cu) + 10 × 1.008 (H) + 9 × 15.999 (O) + 32.06 (S) = 249.677 g/mol', 'molar mass: working line');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await t('.mmc-weigh')) === 'Weigh 6.242 g for 250 mL of 0.1000 mol/L.', 'molar mass: weigh out for a solution');
  await page.fill(R + '.mmc-p', '50'); await page.waitForTimeout(100);
  check((await t('.mmc-weigh')).startsWith('Weigh 12.48 g'), 'molar mass: purity');
  await page.fill(R + '.mmc-p', '0'); await page.waitForTimeout(100);
  check((await t('.mmc-weigh')).includes('Purity'), 'molar mass: bad purity message');
  await page.fill(R + '.mmc-p', '100'); await page.selectOption(R + '.mmc-cu', '0.001'); await page.fill(R + '.mmc-c', '10'); await page.selectOption(R + '.mmc-vu', '1'); await page.fill(R + '.mmc-v', '1'); await page.waitForTimeout(100);
  check((await t('.mmc-weigh')).startsWith('Weigh 2.497 g for 1 L of 10 mmol/L'), 'molar mass: mM and litres');
  const rows = (await t('.mmc-ltab')).replace(/\s+/g, ' ');
  check(rows.includes('58.440') && rows.includes('121.136') && rows.includes('180.156') && rows.includes('147.008'), 'molar mass: formula list');
  await page.fill(R + '.mmc-list', 'Xx1\nH2O'); await page.waitForTimeout(100);
  check((await t('.mmc-ltab')).includes('not readable') && (await t('.mmc-ltab')).includes('18.015'), 'molar mass: list shows unreadable formula');
  await page.fill(R + '.mmc-in', 'Zz'); await page.waitForTimeout(100);
  check(!(await t('.mmc-big')).includes('NaN'), 'molar mass: bad formula never NaN');
};
