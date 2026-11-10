// #1417 Transformer calculator
export const path = '/learn/transformer-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/transformer-calculator/`); await page.waitForTimeout(700);
  const R = '.tfm ', txt = (s) => page.textContent(R + s);
  const set = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.tfm-big')) === 'V_s = 11.5 V (step-down)', `transformer: example (${await txt('.tfm-big')})`);
  check((await txt('.tfm-text')).includes('I_s = V_s / R = 1.15 A') && (await txt('.tfm-text')).includes('P_in = 14.7 W') && (await txt('.tfm-text')).includes('I_p = P_in / V_p = 63.9 mA'), `transformer: working (${await txt('.tfm-text')})`);
  check((await txt('.tfm-facts')).includes('Lost in the transformer1.47 W'), 'transformer: loss');
  const rows = await page.$$eval(R + '.tfm-table tbody tr', (t) => t.map((r) => [...r.children].map((c) => c.textContent).join('|')));
  check(rows[0] === '230 V|43.5 kA|impossible|more than all of it' && rows[1] === '11 kV|909 A|4.13 MW|41.3%' && rows[4] === '220 kV|45.5 A|10.3 kW|0.103%' && rows[5] === '400 kV|25 A|3.13 kW|0.0313%', `transformer: line table (${rows.join(' / ')})`);
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60 || Math.abs(d[i + 2] - d[2]) > 60) n++; return n; });
  check((await inked('.tfm-fig')) > 1000 && (await inked('.tfm-bars')) > 1000, 'transformer: drawings');
  await set('.tfm-np', 100); await set('.tfm-ns', 2000); await set('.tfm-e', 100); await set('.tfm-r', 100); await page.waitForTimeout(80);
  check((await txt('.tfm-big')) === 'V_s = 4.6 kV (step-up)' && (await txt('.tfm-text')).includes('I_s = V_s / R = 46 A'), `transformer: step-up (${await txt('.tfm-big')})`);
  await set('.tfm-ns', 100); await page.waitForTimeout(80);
  check((await txt('.tfm-big')) === 'V_s = 230 V (one-to-one)', 'transformer: one-to-one');
  await set('.tfm-p', 1); await set('.tfm-lr', 10); await page.waitForTimeout(80);
  check((await txt('.tfm-ltext')).includes('from 90.9 A to 4.55 A') && (await txt('.tfm-pv')) === '1 MW', `transformer: line sliders (${await txt('.tfm-ltext')})`);
  check((await page.$$(R + '.eq-q')).length === 4, 'transformer: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [np, ns, vp] = q1.match(/has (\d+) turns on its primary and (\d+) on its secondary\. The primary is on (\d+) V/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((vp * ns) / np)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'transformer: right answer accepted');
};
