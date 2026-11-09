// #932 Lens ray tracer
export const path = '/science/lens-ray-tracer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.lrt ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.lr-big'), facts = () => page.textContent(R + '.lr-facts');
  check((await big()) === 'f = 100 mm, f/5; RMS spot 141 µm at 5°', `rays: example plano-convex (${await big()})`);
  { const f = await facts(); check(f.includes('back focal length 96.70 mm') && f.includes('on axis 63.8 µm RMS') && f.includes('3.58 µm') && f.includes('−1.10 mm at the rim') && f.includes('8.748 mm real') && f.includes('distortion −0.0071 %'), `rays: example facts ${f}`); }
  for (const c of ['.lr-lay', '.lr-spot', '.lr-lsa', '.lr-fan']) check(await page.isVisible(R + c), `rays: figure ${c} shown`);
  await page.selectOption(R + '.lr-pre', 'cp'); await page.waitForTimeout(300);
  check((await facts()).includes('−4.38 mm at the rim') && (await big()).startsWith('f = 100 mm'), 'rays: flipped lens has 4× the spherical aberration');
  await page.selectOption(R + '.lr-pre', 'bc'); await page.waitForTimeout(300);
  check((await big()).startsWith('f = 58.39 mm'), `rays: thick biconvex lensmaker focal length (${await big()})`);
  await page.selectOption(R + '.lr-obj', 'fin'); await page.waitForTimeout(300);
  check(await page.isEnabled(R + '.lr-od') && (await facts()).includes('69.46 mm after the last surface') && (await facts()).includes('magnification'), 'rays: finite object at 300 mm');
  await page.fill(R + '.lr-od', '30'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.lr-err')).includes('virtual') && await page.isHidden(R + '.lr-out'), 'rays: object inside the focal length gives a virtual-image message');
  await page.selectOption(R + '.lr-obj', 'inf'); await page.selectOption(R + '.lr-pre', 'pc'); await page.waitForTimeout(300);
  const parRms = (await big()).match(/RMS spot (.+) at/)[1];
  await page.selectOption(R + '.lr-ip', 'best'); await page.waitForTimeout(400);
  check((await big()) === 'f = 100 mm, f/5; RMS spot 37 µm at 5°' && parRms === '141 µm', `rays: best focus shrinks the spot (${await big()})`);
  await page.selectOption(R + '.lr-ip', 'par'); await page.fill(R + '.lr-fa', '0'); await page.fill(R + '.lr-epd', '5'); await page.waitForTimeout(300);
  check((await facts()).includes('0 (on axis)') && (await facts()).includes('close to diffraction-limited'), 'rays: f/20 on axis is diffraction-limited');
  await page.fill(R + '.lr-sh', '1'); await page.waitForTimeout(300);
  check(!(await facts()).includes('close to diffraction-limited'), 'rays: 1 mm defocus blurs the spot');
  await page.fill(R + '.lr-sh', '0'); await page.fill(R + '.lr-epd', '20'); await page.fill(R + '.lr-fa', '5');
  await page.fill(R + '.lr-s', '51.7 5 1.517 7\ninf 95 1 12.5'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.lr-pre')) === 'custom' && (await facts()).includes('Rays lost'), 'rays: custom surfaces with a small semi-diameter clip rays');
  await page.selectOption(R + '.lr-pre', 'two'); await page.waitForTimeout(300);
  check((await big()).startsWith('f = 105.6 mm'), `rays: two separated lenses (${await big()})`);
  await page.fill(R + '.lr-s', '50 5'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.lr-err')).includes('refractive index'), 'rays: missing index message');
  await page.fill(R + '.lr-s', 'inf 5 1.5\ninf 5 1'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.lr-err')).includes('afocal'), 'rays: flat plate has no focal length message');
  await page.selectOption(R + '.lr-pre', 'pc'); await page.fill(R + '.lr-epd', '0'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.lr-err')).includes('pupil diameter'), 'rays: bad pupil message');
  await page.fill(R + '.lr-epd', '20'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.lr-out'), 'rays: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lr-csv')]); const f = OUT + 'spot.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 332 && rows[0] === 'x_mm,y_mm', `rays: spot CSV (${rows.length})`); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl [data-f=${fmt}]`)]); check(d.suggestedFilename().endsWith('.' + fmt), `rays: ${fmt} download`); }
};
