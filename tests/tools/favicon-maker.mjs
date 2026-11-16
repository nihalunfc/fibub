// #T858 Favicon maker
import { readFileSync } from 'node:fs';
export const path = '/everyday/favicon-maker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/favicon-maker/`); await page.waitForTimeout(400);
  check((await page.locator('.fm .fm-prev canvas').count()) === 6, 'favicon: letter mode makes 6 previews');
  const lit = await page.evaluate(() => { const c = document.querySelector('.fm canvas[data-size="32"]'); const d = c.getContext('2d').getImageData(0, 0, 32, 32).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] > 200 && d[i + 2] > 200) n++; return n; });
  check(lit > 20, `favicon: the white letter is drawn (${lit} px)`);
  let [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fm .fm-ico')]);
  const b = readFileSync(await dl.path());
  check(dl.suggestedFilename() === 'favicon.ico' && b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0 && b.readUInt16LE(4) === 3, `favicon: ico starts 00 00 01 00 with 3 images (${[...b.subarray(0, 6)].join(' ')})`);
  check(b.readUInt32LE(6 + 12) === 54 && b.subarray(54, 58).toString('latin1') === '\x89PNG', 'favicon: first ico entry points at a PNG');
  [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fm .fm-zip')]);
  const z = readFileSync(await dl.path());
  check(dl.suggestedFilename() === 'favicons.zip' && z.readUInt32LE(0) === 0x04034b50, 'favicon: zip download fires');
  await page.selectOption('.fm [data-k="shape"]', 'circle'); await page.waitForTimeout(100);
  const corner = await page.evaluate(() => document.querySelector('.fm canvas[data-size="48"]').getContext('2d').getImageData(0, 0, 1, 1).data[3]);
  check(corner === 0, 'favicon: circle leaves the corner transparent');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const mf = await page.inputValue('.fm .fm-manifest');
  check(mf.includes('192x192') && mf.includes('512x512'), 'favicon-maker: webmanifest snippet shown');
  check((await page.$$('.fm .fm-tab img')).length === 2, 'favicon-maker: light and dark tab previews');
};
