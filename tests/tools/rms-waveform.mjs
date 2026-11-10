// #1416 RMS from a waveform
export const path = '/learn/rms-waveform/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rms-waveform/`); await page.waitForTimeout(700);
  const R = '.rms ', txt = (s) => page.textContent(R + s);
  check((await txt('.rms-big')) === 'V_rms = V₀/√2 = 230 V', `rms: example (${await txt('.rms-big')})`);
  check((await txt('.rms-text')).includes('Mean of v² = 5.28 × 10⁴ V²') && (await txt('.rms-text')).includes('Exact: V₀/√2 = 230 V'), `rms: working (${await txt('.rms-text')})`);
  const f = await txt('.rms-facts');
  check(f.includes('Mean over a cycle0 V') && f.includes('Mean of the size |v|207 V') && f.includes('Power in 100 Ω528 W'), `rms: facts (${f})`);
  const inked = () => page.$eval(R + '.rms-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60 || Math.abs(d[i + 2] - d[2]) > 60) n++; return n; });
  check((await inked()) > 1500, 'rms: graph drawn');
  for (const [w, want] of [['square', 'V₀ = 325 V'], ['triangle', 'V₀/√3 = 188 V'], ['saw', 'V₀/√3 = 188 V'], ['half', 'V₀/2 = 163 V'], ['full', 'V₀/√2 = 230 V']]) {
    await page.click(R + `.rms-wave button[data-v=${w}]`); await page.waitForTimeout(60);
    check((await txt('.rms-big')) === `V_rms = ${want}`, `rms: ${w} (${await txt('.rms-big')})`);
  }
  await page.$eval(R + '.rms-p', (e) => { e.value = '100'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(60);
  check((await txt('.rms-big')) === 'V_rms = V₀/√2 = 70.7 V' && (await txt('.rms-facts')).includes('Mean over a cycle63.7 V'), `rms: peak slider (${await txt('.rms-big')})`);
  await page.click(R + '.rms-mains'); await page.waitForTimeout(60);
  check((await txt('.rms-big')) === 'V_rms = V₀/√2 = 230 V' && (await txt('.rms-pv')) === '325 V', 'rms: mains button');
  check((await page.$$(R + '.eq-q')).length === 4, 'rms: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), v = Number(q1.match(/supply is (\d+) V rms/)[1]);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String(v * Math.SQRT2)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'rms: right answer accepted');
};
