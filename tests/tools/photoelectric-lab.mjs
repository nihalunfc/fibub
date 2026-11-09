// #1067 photoelectric-lab
export const path = '/learn/photoelectric-lab/';
export default async ({ page, check, BASE }) => {
  const R = '.pel ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.pe-eq'), f = await t('.pe-facts');
    check(e.includes('hf = 2.895 eV') && e.includes('K_max = hf − φ = 2.895 − 2.1 = 0.7950 eV, so the stopping potential V₀ = 0.7950 V'), 'photo: caesium at 7e14 Hz: K_max 0.795 eV, V0 0.795 V (Python)');
    check(f.includes('5.078 × 10¹⁴ Hz') && f.includes('590 nm') && f.includes('528.8 km/s'), 'photo: threshold 5.078e14 Hz, 590 nm, 528.8 km/s');
    check((await t('.pe-fv')).includes('428 nm, violet') && (await t('.pe-big')).startsWith('Current 58.3'), 'photo: 428 nm violet, current 58.3'); }
  await slide('.pe-V', -0.5);
  check((await t('.pe-big')).startsWith('Current 18.9'), 'photo: −0.5 V lets 18.9 through (teaching model)');
  await slide('.pe-V', -0.8);
  check((await t('.pe-big')) === 'Current 0: the voltage stops every electron', 'photo: −0.8 V stops all');
  await slide('.pe-I', 100);
  check((await t('.pe-big')) === 'Current 0: the voltage stops every electron', 'photo: brighter light, same stopping voltage');
  await slide('.pe-V', 1); await slide('.pe-f', 4.5);
  check((await t('.pe-big')) === 'No electrons come out' && (await t('.pe-eq')).includes('below zero'), 'photo: below threshold, no electrons even at 100%');
  await slide('.pe-I', 0); await slide('.pe-f', 7);
  check((await t('.pe-big')) === 'No light, no current', 'photo: no light');
  await slide('.pe-I', 60);
  await page.click(R + '.pe-keep'); await page.click(R + '.pe-clear');
  // Fit h from potassium
  await page.selectOption(R + '.pe-metal', 'k'); await page.waitForTimeout(150);
  for (const f of [6, 8, 10, 12]) { await slide('.pe-f', f); await page.click(R + '.pe-rec'); }
  { const fit = await t('.pe-fit'); check(fit.includes('4 points') && fit.includes('h = slope × e = 6.626 × 10⁻³⁴ J s') && fit.includes('φ = 2.30 eV') && fit.includes('slope = h/e = 4.136 × 10⁻¹⁵ V s'), 'photo: fitted h = 6.626e-34 J s and φ = 2.3 eV'); }
  await page.selectOption(R + '.pe-metal', 'zn'); await page.waitForTimeout(150);
  await slide('.pe-f', 7);
  check((await t('.pe-fit')) === 'No points yet.' && (await t('.pe-big')) === 'No electrons come out', 'photo: zinc needs ultraviolet');
  await slide('.pe-f', 12);
  check((await t('.pe-fv')).includes('ultraviolet') && (await t('.pe-big')).startsWith('Current'), 'photo: zinc in ultraviolet');
  await page.click(R + '.pe-clr');
  const inked = await page.$eval(R + '.pe-iv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 140 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 300, `photo: I–V graph drawn (${inked})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'photo: five questions');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  check((await t('.lq-score')).startsWith('4 of 5'), 'photo: four numeric answers accepted');
  const ch = await items[4].$$('.lq-choice'); await ch[2].click();
  check((await (await items[4].$('.lq-fb')).textContent()) === 'Right.', 'photo: brighter red light still no electrons');
};
