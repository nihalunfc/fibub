// #1401 Electric dipole in a field
export const path = '/learn/dipole-torque/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/dipole-torque/`); await page.waitForTimeout(700);
  const R = '.dpt ', txt = (s) => page.textContent(R + s);
  const set = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.dpt-big')) === 'τ = 0.001 N m, U = −0.00173 J', `dipole: example (${await txt('.dpt-big')})`);
  check((await txt('.dpt-formula')).startsWith('p = q d = 2 × 10⁻⁶ × 0.02 = 4 × 10⁻⁸ C m.'), `dipole: formula (${await txt('.dpt-formula')})`);
  const f = await txt('.dpt-facts');
  check(f.includes('Force on each charge0.1 N') && f.includes('Largest torque0.002 N m') && f.includes('2.68 × 10⁻⁴ J'), `dipole: facts (${f})`);
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60 || Math.abs(d[i + 2] - d[2]) > 60) n++; return n; });
  check((await inked('.dpt-fig')) > 1000 && (await inked('.dpt-graph')) > 500, 'dipole: drawings');
  await set('.dpt-t', 90); await page.waitForTimeout(80);
  check((await txt('.dpt-big')) === 'τ = 0.002 N m, U = 0 J', `dipole: 90° (${await txt('.dpt-big')})`);
  await set('.dpt-t', 180); await page.waitForTimeout(80);
  check((await txt('.dpt-facts')).includes('Balanceunstable') && (await txt('.dpt-big')).includes('U = 0.002 J'), `dipole: 180° (${await txt('.dpt-big')})`);
  await set('.dpt-q', 4); await set('.dpt-d', 5); await set('.dpt-e', 10); await set('.dpt-t', 30); await page.waitForTimeout(80);
  check((await txt('.dpt-big')) === 'τ = 0.01 N m, U = −0.0173 J' && (await txt('.dpt-ev')) === '1 × 10⁵ N/C', `dipole: sliders (${await txt('.dpt-big')})`);
  // Drag the dipole to point straight up (90°).
  const fig = await page.$(R + '.dpt-fig'); await fig.scrollIntoViewIfNeeded();
  const b = await fig.boundingBox(), sx = b.width / 360;
  await page.mouse.move(b.x + 180 * sx + 60 * sx, b.y + 115 * sx - 2); await page.mouse.down(); await page.mouse.move(b.x + 180 * sx + 1, b.y + 115 * sx - 60 * sx, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(80);
  const t = +(await txt('.dpt-tv')).replace('°', '');
  check(t >= 88 && t <= 92, `dipole: drag turns it (${t}°)`);
  await page.click(R + '.dpt-go'); await page.waitForTimeout(1200);
  const t2 = +(await txt('.dpt-tv')).replace('°', '');
  await page.click(R + '.dpt-stop');
  check(t2 !== t, `dipole: let go swings (${t}° → ${t2}°)`);
  check((await page.$$(R + '.eq-q')).length === 4, 'dipole: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [qc, d] = q1.match(/±(\d+) µC, (\d+) cm/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', `${qc * d} × 10^-8`); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'dipole: answer typed as a × 10^n accepted');
};
