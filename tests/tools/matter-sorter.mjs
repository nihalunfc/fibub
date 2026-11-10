// #1220 matter sorter
export const path = '/learn/matter-sorter/';
export default async ({ page, check, BASE }) => {
  const R = '.msr ', t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForTimeout(700);
  check((await page.$$(R + '.msr-chip')).length === 9 && (await page.$$(R + '.msr-bin')).length === 3 && (await t('.msr-score')) === '0 of 9 sorted', 'matter: 9 things, 3 bins');
  // use all things so we know what is there
  await page.click(R + '.msr-all'); await page.waitForTimeout(100);
  check((await page.$$(R + '.msr-chip')).length === 32, 'matter: all 32 things');
  // tap-tap: air into Compound (wrong), then Mixture (right)
  await page.click(R + '.msr-chip[data-id="air"]');
  check((await t('.msr-h')).includes('Air') && (await t('.msr-key')).includes('nitrogen N₂ + oxygen O₂ + argon Ar + carbon dioxide CO₂'), 'matter: tapping air shows its particles');
  await page.click(R + '.msr-bin[data-bin="compound"]');
  check((await t('.msr-fb')).startsWith('Not compound') && (await t('.msr-score')).includes('1 try missed'), 'matter: wrong bin counted');
  await page.click(R + '.msr-bin[data-bin="mixture"]');
  check((await t('.msr-fb')) === 'Right: Air → Mixture.' && (await t('.msr-why')).includes('Air is a mixture: it has 4 kinds of particle'), 'matter: air is a mixture with explanation');
  check((await t('.msr-score')).startsWith('1 of 32 sorted'), 'matter: score');
  const inked = await page.$eval(R + '.msr-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 300, `matter: coloured particles drawn (${inked})`);
  // drag pure water to Compound
  const drag = async (id, bin) => {
    const a = await page.$eval(R + `.msr-chip[data-id="${id}"]`, (e) => { e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    const b = await page.$eval(R + `.msr-bin[data-bin="${bin}"]`, (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height - 12 }; });
    await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(a.x + 20, a.y + 20, { steps: 3 }); await page.mouse.move(b.x, b.y, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
  };
  await drag('water', 'compound');
  check((await t('.msr-fb')) === 'Right: Pure (distilled) water → Compound.' && (await t('.msr-bin[data-bin="compound"]')).includes('✓ Pure (distilled) water'), 'matter: drag water into Compound');
  await drag('oxygen', 'element');
  check((await t('.msr-why')).includes('Oxygen gas is an element') && (await t('.msr-why')).includes('(O)'), 'matter: oxygen gas is an element');
  await drag('fes', 'compound');
  check((await t('.msr-why')).includes('2 kinds of atom joined'), 'matter: iron sulphide is a compound');
  // Class 9: four bins
  await page.click(R + '[data-level="9"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.msr-bin')).length === 4 && (await page.$$(R + '.msr-chip')).length === 9, 'matter: Class 9 has 4 bins and a fresh set');
  await page.click(R + '.msr-all'); await page.waitForTimeout(100);
  await page.click(R + '.msr-chip[data-id="muddy"]'); await page.click(R + '.msr-bin[data-bin="mix-same"]');
  check((await t('.msr-fb')).startsWith('Not mixture, same all through'), 'matter: muddy water is not homogeneous');
  await page.click(R + '.msr-bin[data-bin="mix-diff"]');
  check((await t('.msr-why')).includes('heterogeneous mixture'), 'matter: muddy water heterogeneous');
  await page.click(R + '.msr-chip[data-id="brass"]'); await page.click(R + '.msr-bin[data-bin="mix-same"]');
  check((await t('.msr-why')).includes('homogeneous mixture'), 'matter: brass homogeneous');
  check((await page.$$(R + '.lq-item')).length >= 4, 'matter: questions');
  const first = await page.$(R + '.lq-item');
  const ans = Number(await first.getAttribute('data-ans'));
  await (await first.$$('.lq-choice'))[ans].click();
  check((await (await first.$('.lq-fb')).textContent()) === 'Right.', 'matter: quiz answer');
  await page.click(R + '[data-level="8"]'); await page.waitForTimeout(100);
};
