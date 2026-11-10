// #1391 Fluid mosaic membrane
export const path = '/learn/cell-membrane/';
export default async ({ page, check, BASE }) => {
  const R = '.cmb ', t = (s) => page.textContent(R + s);
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(200); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(800);
  check((await t('.cm-eq')) === 'At the start, rate = P × (C_out − C_in) = 0.5 × (30 − 6) = 12 particles per second inward.', `membrane: oxygen formula (${await t('.cm-eq')})`);
  check((await t('.cm-big')).startsWith('Net movement: into the cell'), 'membrane: oxygen goes in');
  check((await t('.cm-count')).match(/Outside: (\d+)\s+Inside: (\d+)/).slice(1).reduce((a, b) => a + +b, 0) === 36, 'membrane: 36 particles in all');
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (Math.abs(d[i] - d[i + 2]) > 40 || d[i] < 150) n++; return n; });
  check((await inked('.cm-cv')) > 300 && (await inked('.cm-gr')) > 100, 'membrane: membrane and graph drawn');
  check((await t('.cm-geq')) === 'With 30 outside: simple 0.5 × 30 = 15 per second; facilitated 10 × 30/(8 + 30) = 7.89 per second.', `membrane: graph text (${await t('.cm-geq')})`);
  await page.waitForTimeout(2500);
  const c2 = (await t('.cm-count')).match(/Outside: (\d+)\s+Inside: (\d+)/).slice(1).map(Number);
  check(c2[1] > 6 && c2[0] + c2[1] === 36, `membrane: oxygen moved in over time (${c2})`);
  await tap('.cm-sub button[data-s=glucose]');
  check((await t('.cm-eq')).includes('= 7.89 − 4.29 = 3.61 per second inward'), `membrane: glucose formula (${await t('.cm-eq')})`);
  check((await t('.cm-route')).startsWith('Facilitated diffusion: glucose goes only through carrier proteins'), 'membrane: glucose route');
  await slide('.cm-o', 60);
  check((await t('.cm-ov')) === '40', 'membrane: slider capped at 40');
  await tap('.cm-sub button[data-s=na]');
  check(await page.isVisible(R + '.cm-pump'), 'membrane: pump switch shown for sodium');
  await slide('.cm-o', 10); await slide('.cm-i', 30);
  let m = null;
  for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); m = (await t('.cm-count')).match(/Na⁺ pumped out: (\d+), ATP used: ([\d.]+)/); if (m && +m[1] >= 3) break; }
  check(m && +m[1] > 0 && Math.abs(+m[2] - +m[1] / 3) < 0.01, `membrane: pump moves Na⁺ and counts ATP (${m && m[0]})`);
  check((await t('.cm-big')).includes('against the gradient'), 'membrane: pump works against the gradient');
  await tap('[data-level="9"]');
  check(!(await page.isVisible(R + '.cm-gr')), 'membrane: Class 9 hides the graph');
  await tap('.cm-sub button[data-s=water]');
  check((await t('.cm-route')).includes('aquaporins'), 'membrane: water via aquaporins');
  await tap('.cm-play'); await tap('.cm-reset');
  check((await t('.cm-count')) === 'Outside: 10   Inside: 30', `membrane: start again (${await t('.cm-count')})`);
  await tap('.cm-play');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, `membrane: five questions at Class 11 (${items.length})`);
  { const a = +(await items[0].getAttribute('data-ans')); await (await items[0].$$('.lq-choice'))[a].click(); }
  for (const i of [1, 2, 3, 4]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'membrane: all answered right');
};
