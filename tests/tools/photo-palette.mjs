// #T859 Photo palette
export const path = '/everyday/photo-palette/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/photo-palette/`); await page.waitForTimeout(500);
  const n = () => page.locator('.pp .pp-list li').count();
  check((await n()) === 6, `palette: example gives 6 colours (${await n()})`);
  await page.selectOption('.pp [data-k="count"]', '8'); await page.waitForTimeout(300);
  check((await n()) === 8, `palette: count 8 gives 8 swatches (${await n()})`);
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 100; c.height = 60; const x = c.getContext('2d'); x.fillStyle = '#ff0000'; x.fillRect(0, 0, 50, 60); x.fillStyle = '#0000ff'; x.fillRect(50, 0, 50, 60); return c.toDataURL('image/png').split(',')[1]; });
  await page.setInputFiles('.pp [data-k="file"]', { name: 'halves.png', mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') });
  await page.waitForTimeout(500);
  const sw = await page.$$eval('.pp .pp-list li', (ls) => ls.map((l) => [l.dataset.hex, +l.dataset.share]));
  const hexes = sw.slice(0, 2).map((s) => s[0]).sort();
  check(hexes[0] === '#0000ff' && hexes[1] === '#ff0000', `palette: red and blue are the top 2 (${JSON.stringify(sw)})`);
  check(sw.slice(0, 2).every((s) => Math.abs(s[1] - 0.5) < 0.03), 'palette: each about 50%');
  check((await page.inputValue('.pp .pp-css')).includes('--colour-1: #'), 'palette: CSS variables written');
};
