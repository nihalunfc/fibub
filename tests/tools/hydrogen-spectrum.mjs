// #1068 hydrogen-spectrum
export const path = '/learn/hydrogen-spectrum/';
export default async ({ page, check, BASE }) => {
  const R = '.hys ';
  const t = (s) => page.textContent(R + s);
  const pick = async (sel, v) => { await page.selectOption(R + sel, v); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  check((await t('.hy-big')) === 'Gives out a photon of 656.5 nm (red)', 'hyd: 3 → 2 is H-alpha, 656.5 nm red');
  { const e = await t('.hy-eq'); check(e.includes('1.0968 × 10⁷ × (1/2² − 1/3²) = 1.5233 × 10⁶ m⁻¹, so λ = 656.47 nm') && e.includes('= −1.511 − (−3.400) = 1.889 eV'), 'hyd: Rydberg working and energy difference (Python)'); }
  { const f = await t('.hy-facts'); check(f.includes('Balmer') && f.includes('4.567 × 10¹⁴ Hz') && f.includes('3.026 × 10⁻¹⁹ J') && f.includes('visible'), 'hyd: Balmer, frequency, energy in J'); }
  check((await t('.hy-sh')) === 'The Balmer series (jumps down to n = 2)' && (await t('.hy-sp-note')).includes('364.7 nm'), 'hyd: Balmer series limit 364.7 nm');
  await pick('.hy-from', '4'); await pick('.hy-to', '1');
  check((await t('.hy-big')) === 'Gives out a photon of 97.25 nm (ultraviolet)' && (await t('.hy-facts')).includes('Lyman'), 'hyd: 4 → 1 Lyman 97.25 nm');
  await pick('.hy-to', '3');
  check((await t('.hy-big')) === 'Gives out a photon of 1876 nm (infrared)' && (await t('.hy-facts')).includes('Paschen'), 'hyd: 4 → 3 Paschen 1876 nm');
  await pick('.hy-from', '2'); await pick('.hy-to', '5');
  check((await t('.hy-big')).startsWith('Takes in a photon of 434') && (await t('.hy-big')).includes('blue'), 'hyd: absorption 2 → 5 at 434 nm');
  await pick('.hy-from', '∞'); await pick('.hy-to', '2');
  check((await t('.hy-big')) === 'Gives out a photon of 364.7 nm (ultraviolet)', 'hyd: series limit');
  await pick('.hy-from', '2');
  check((await t('.hy-big')) === 'Choose two different levels', 'hyd: same level message');
  await pick('.hy-from', '3');
  await page.click(R + '[data-level="12"]'); await page.waitForTimeout(150);
  { const f = await t('.hy-facts'); check(f.includes('0.2117 nm') && f.includes('1094 km/s') && f.includes('3.400 eV'), 'hyd: Class 12 radius 0.2117 nm, 1094 km/s, 3.4 eV'); }
  await page.click(R + '[data-level="11"]'); await page.waitForTimeout(150);
  check(!(await t('.hy-facts')).includes('Orbit radius'), 'hyd: Class 11 hides orbits');
  // Tap two levels on the diagram: the level nearest the bottom is n = 1, so tap n = 2 then n = 1.
  const box = await page.$eval(R + '.hy-cv', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
  const yOf = (n) => 16 + 276 * Math.sqrt(1 / (n * n));
  await page.mouse.click(box.x + box.w / 2, box.y + yOf(2)); await page.waitForTimeout(100);
  await page.mouse.click(box.x + box.w / 2, box.y + yOf(1)); await page.waitForTimeout(150);
  check((await t('.hy-big')) === 'Gives out a photon of 121.6 nm (ultraviolet)', 'hyd: tapping 2 then 1 gives Lyman alpha 121.6 nm');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'hyd: five questions');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  check((await t('.lq-score')).startsWith('4 of 5'), 'hyd: four numeric answers accepted');
};
