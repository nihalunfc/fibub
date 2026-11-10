// #1420 Charging capacitor and displacement current
export const path = '/learn/displacement-current/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/displacement-current/`); await page.waitForTimeout(700);
  const R = '.dsc ', txt = (s) => page.textContent(R + s);
  const f = await txt('.dsc-facts');
  check(f.includes('278 pF') && f.includes('2.78 ms') && f.includes('63.2% full') && f.includes('4.41 × 10⁻¹³ T'), `displacement: facts (${f})`);
  check((await txt('.dsc-big')) === 'I = 441 nA in the wire, I_d = 441 nA in the gap', `displacement: big (${await txt('.dsc-big')})`);
  check((await txt('.dsc-text')).includes('conduction current') && (await txt('.dsc-text')).includes('1.77 × 10⁻¹² T'), `displacement: flat text (${await txt('.dsc-text')})`);
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 40 || Math.abs(d[i + 1] - d[1]) > 40) n++; return n; });
  check((await inked('.dsc-fig')) > 1500 && (await inked('.dsc-graph')) > 800, 'displacement: figure and graph drawn');
  await page.click(R + '.dsc-surf button[data-v="bag"]'); await page.waitForTimeout(60);
  check((await txt('.dsc-text')).includes('displacement current') && (await txt('.dsc-text')).includes('1.59 × 10⁶ V/m'), `displacement: bag surface (${await txt('.dsc-text')})`);
  await page.$eval(R + '.dsc-t', (e) => { e.value = '500'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(60);
  check((await txt('.dsc-facts')).includes('99.3% full'), `displacement: nearly full at 5τ (${await txt('.dsc-facts')})`);
  await page.$eval(R + '.dsc-l', (e) => { e.value = '20'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(60);
  check((await txt('.dsc-facts')).includes('µ₀ I_d / (2πr)'), 'displacement: loop outside the plates');
  check((await page.$$(R + '.eq-q')).length === 4, 'displacement: four practice questions');
  const q4 = await page.textContent(R + '.eq-q:nth-child(4) p'), m = q4.match(/A (\d+) nF capacitor charges through (\d+) MΩ/);
  await page.fill(R + '.eq-q:nth-child(4) .eq-in', String(Number(m[1]) * Number(m[2]) * 1e-3)); await page.click(R + '.eq-q:nth-child(4) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(4) .eq-res')).startsWith('Right'), 'displacement: right answer accepted');
};
