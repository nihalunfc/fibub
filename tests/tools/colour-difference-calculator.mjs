// #418 colour difference (ΔE) calculator
export const path = '/science/colour-difference-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.cdc ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.cd-big')) === 'ΔE00 = 2.07', 'colour: example pair ΔE00 2.07');
  { const f = await page.textContent(R + '.cd-facts'); check(f.includes('ΔE942.19') && f.includes('ΔE*ab (1976)3.98') && f.includes('ΔL* lightness+1.90') && f.includes('ΔC* chroma−3.41') && f.includes('lighter, less saturated, hue towards yellow'), 'colour: ΔE94, ΔE76, components and words'); }
  check(await page.$eval(R + '.cd-swa', (e) => getComputedStyle(e).backgroundColor) === 'rgb(176, 58, 65)', 'colour: before swatch #b03a41');
  check((await page.textContent(R + '.cd-sbig')) === '6 samples: mean ΔE00 1.80, largest 3.53 (Green wool leaf); 3 at or over 2', 'colour: example survey summary');
  { const t = await page.textContent(R + '.cd-tab'); check(t.includes('Yellow silk thread') && t.includes('7.58') && t.includes('2.20') && t.includes('about the same') && await page.isVisible(R + '.cd-fig'), 'colour: survey table and chart'); }
  // Parametric factors and ΔE94 weights.
  await page.fill(R + '.cd-kl', '2'); await page.waitForTimeout(400);
  const kl2 = await page.textContent(R + '.cd-big');
  await page.fill(R + '.cd-kl', '1.5'); await page.fill(R + '.cd-kc', '0.8'); await page.fill(R + '.cd-kh', '1.2'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.cd-big')) === 'ΔE00 = 1.77' && kl2 !== 'ΔE00 = 2.07', 'colour: kL 1.5, kC 0.8, kH 1.2 gives 1.77 (colour-science)');
  await page.selectOption(R + '.cd-app', 'textiles'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.cd-facts')).includes('ΔE941.41textiles weights'), 'colour: ΔE94 textiles 1.41');
  await page.fill(R + '.cd-kc', '0'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.cd-err')).includes('kL, kC and kH must be numbers above 0') && await page.isHidden(R + '.cd-out'), 'colour: bad k message');
  await page.fill(R + '.cd-kl', '1'); await page.fill(R + '.cd-kc', '1'); await page.fill(R + '.cd-kh', '1'); await page.selectOption(R + '.cd-app', 'graphic'); await page.waitForTimeout(400);
  // Switching units keeps the colours.
  await page.selectOption(R + '.cd-space', 'lch'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.cd-a2')) === '53.33' && (await page.textContent(R + '.cd-big')) === 'ΔE00 = 2.07' && (await page.textContent(R + '.cd-n3')) === 'h (°)', 'colour: switch to LCh converts and keeps ΔE');
  await page.selectOption(R + '.cd-space', 'srgb'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.cd-ahex')) === '#b03a41' && (await page.inputValue(R + '.cd-a1')) === '176' && await page.isVisible(R + '.cd-ahex'), 'colour: switch to sRGB fills RGB and hex');
  await page.fill(R + '.cd-ahex', '#808080'); await page.fill(R + '.cd-bhex', '#7f7f7f'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.cd-b1')) === '127' && (await page.textContent(R + '.cd-big')).startsWith('ΔE00 = 0.3'), 'colour: hex input, two greys one step apart');
  await page.fill(R + '.cd-a1', '300'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.cd-err')).includes('sRGB values run from 0 to 255'), 'colour: sRGB range message');
  await page.selectOption(R + '.cd-space', 'xyz'); await page.fill(R + '.cd-a1', '41.24'); await page.fill(R + '.cd-a2', '21.26'); await page.fill(R + '.cd-a3', '1.93');
  await page.fill(R + '.cd-b1', '41.24'); await page.fill(R + '.cd-b2', '21.26'); await page.fill(R + '.cd-b3', '1.93'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.cd-big')) === 'ΔE00 = 0.00' && (await page.textContent(R + '.cd-facts')).includes('53.23, 80.11, 67.22'), 'colour: XYZ of sRGB red gives Lab 53.23, 80.11, 67.22');
  await page.selectOption(R + '.cd-white', 'D50'); await page.waitForTimeout(300);
  check(!(await page.textContent(R + '.cd-facts')).includes('53.23, 80.11, 67.22') && (await page.inputValue(R + '.cd-a1')) === '41.24', 'colour: D50 white reinterprets XYZ, values kept');
  await page.fill(R + '.cd-b2', 'abc'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.cd-err')).includes('the after colour needs three numbers'), 'colour: bad number message');
  // Survey: back to Lab, sorting, flag level, CSV, bad rows, hex survey.
  await page.selectOption(R + '.cd-space', 'lab'); await page.selectOption(R + '.cd-white', 'D65');
  await page.click(R + '.cd-ex'); await page.waitForTimeout(300);
  await page.selectOption(R + '.cd-sort', 'e00'); await page.waitForTimeout(200);
  check((await page.$eval(R + '.cd-tab tr:nth-child(2) td', (e) => e.textContent)) === 'Green wool leaf', 'colour: sort by largest ΔE00');
  await page.fill(R + '.cd-thr', '1'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.cd-sbig')).endsWith('5 at or over 1'), 'colour: flag level 1');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cd-csv')]); const f = OUT + 'cdiff.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('sample,before L*') && rows[1].startsWith('Red silk band,42.100') && rows[1].includes(',2.075,'), 'colour: survey CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'colour: PDF report'); }
  await page.fill(R + '.cd-in', 'A\t50\t0\t0\t51\t0\t0\nB\t50\t1'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.cd-serr')).includes('Line 2') && (await page.textContent(R + '.cd-sbig')).startsWith('1 sample: mean ΔE00 1.00'), 'colour: bad survey row message, good rows kept');
  await page.fill(R + '.cd-in', 'nothing here'); await page.waitForTimeout(400);
  check(await page.isHidden(R + '.cd-sout') && (await page.textContent(R + '.cd-serr')).length > 10, 'colour: survey with no rows');
  writeFileSync(OUT + 'survey.csv', 'Object,Before,After\nPoster red,#c0392b,#c5534a\nPoster blue,#2e86c1,#4b93c4\n');
  await page.selectOption(R + '.cd-space', 'srgb');
  await page.setInputFiles(R + '.dfb-in', OUT + 'survey.csv'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.cd-sbig')).startsWith('2 samples:') && (await page.textContent(R + '.cd-tab')).includes('Poster blue'), 'colour: open a CSV of hex pairs');
};
