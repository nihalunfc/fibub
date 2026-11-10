// #1400 Gauss's law
export const path = '/learn/gauss-law/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/gauss-law/`); await page.waitForTimeout(700);
  const R = '.gsl ', txt = (s) => page.textContent(R + s);
  check((await txt('.gsl-big')) === 'q inside = +1 µC, so Φ = q/ε₀ = 1.13 × 10⁵ N m²/C', `gauss: example flux (${await txt('.gsl-big')})`);
  check((await txt('.gsl-lines')).startsWith('Inside: A, B. Field lines going out: 9, coming in: 5, net 4 = 4 lines per µC × 1 µC.'), `gauss: line count (${await txt('.gsl-lines')})`);
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60 || Math.abs(d[i + 2] - d[2]) > 60) n++; return n; });
  check((await inked('.gsl-fig')) > 1500 && (await inked('.gsl-sfig')) > 800, 'gauss: both figures drawn');
  const fig = await page.$(R + '.gsl-fig'); await fig.scrollIntoViewIfNeeded();
  const box = await fig.boundingBox(), at = (x, y) => [box.x + ((x * 10) / 360) * box.width, box.y + ((280 - y * 10) / 280) * box.height];
  // Drag C (+1 µC) inside the circle.
  await page.mouse.move(...at(28, 20)); await page.mouse.down(); await page.mouse.move(...at(20, 16), { steps: 5 }); await page.mouse.move(...at(14, 13), { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
  check((await txt('.gsl-big')).startsWith('q inside = +2 µC') && (await txt('.gsl-lines')).includes('net 8') && (await txt('.gsl-name')) === 'C', `gauss: dragging a charge in (${await txt('.gsl-big')})`);
  // Drag the surface away from all charges.
  await page.mouse.move(...at(13, 9)); await page.mouse.down(); await page.mouse.move(...at(20, 4), { steps: 5 }); await page.mouse.move(...at(29, 2), { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
  check((await txt('.gsl-big')) === 'q inside = 0 µC, so Φ = q/ε₀ = 0 N m²/C' && (await txt('.gsl-lines')).startsWith('Inside: no charge.'), `gauss: moving the surface (${await txt('.gsl-big')}; ${await txt('.gsl-lines')})`);
  await page.click(R + '.gsl-shape button[data-v=square]');
  await page.$eval(R + '.gsl-r', (e) => { e.value = '12.5'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.gsl-rv')) === '12.5 cm half-width' && (await txt('.gsl-lines')).includes('net 0 = 4 lines per µC × 0 µC'), `gauss: square and size (${await txt('.gsl-lines')})`);
  await page.$eval(R + '.gsl-q', (e) => { e.value = '-3'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.gsl-qv')) === '−3 µC' && (await txt('.gsl-name')) === 'C' && (await txt('.gsl-big')).startsWith('q inside = 0 µC'), `gauss: charge slider, charge outside adds nothing (${await txt('.gsl-big')})`);
  check((await txt('.gsl-sbig')) === 'E = 1.8 × 10⁵ N/C' && (await txt('.gsl-sform')).includes('E = λ/(2πε₀ r)'), `gauss: wire (${await txt('.gsl-sbig')})`);
  await page.$eval(R + '.gsl-d', (e) => { e.value = '40'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.gsl-sbig')) === 'E = 8.99 × 10⁴ N/C', `gauss: wire at twice the distance (${await txt('.gsl-sbig')})`);
  await page.click(R + '.gsl-sym button[data-v=sheet]'); await page.waitForTimeout(100);
  check((await txt('.gsl-sbig')) === 'E = 1.13 × 10⁵ N/C' && (await txt('.gsl-av')) === '2 µC/m²', `gauss: sheet (${await txt('.gsl-sbig')})`);
  await page.click(R + '.gsl-sym button[data-v=shell]');
  await page.$eval(R + '.gsl-d', (e) => { e.value = '20'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.gsl-sbig')) === 'E = 4.49 × 10⁵ N/C', `gauss: shell outside (${await txt('.gsl-sbig')})`);
  await page.$eval(R + '.gsl-d', (e) => { e.value = '6'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.gsl-sbig')) === 'E = 0 N/C' && (await txt('.gsl-sform')).includes('encloses no charge'), `gauss: shell inside (${await txt('.gsl-sbig')})`);
  check((await page.$$(R + '.eq-q')).length === 5, 'gauss: five practice questions');
  const q2 = await page.textContent(R + '.eq-q:nth-child(2) p'), [lam, r] = q2.match(/carries (\d+) µC per metre\. What is the field (\d+) cm/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(2) .eq-in', String((lam * 1e-6) / (2 * Math.PI * 8.8541878188e-12 * r / 100))); await page.click(R + '.eq-q:nth-child(2) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(2) .eq-res')).startsWith('Right'), 'gauss: right answer accepted');
};
