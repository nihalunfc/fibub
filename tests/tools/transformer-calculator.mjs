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

  // "Solve my numbers" card helpers
  const sv = (ns, root = '') => ({
    ans: () => page.textContent(`${root}[data-k="${ns}-answer"]`),
    work: () => page.textContent(`${root}[data-k="${ns}-working"]`),
    find: (v) => page.selectOption(`${root}[data-k="${ns}-find"]`, v),
    ex: (i) => page.selectOption(`${root}[data-k="${ns}-example"]`, String(i)),
    ch: (k, v) => page.selectOption(`${root}[data-k="${ns}-${k}"]`, v),
    set: async (k, v, u) => { await page.fill(`${root}[data-k="${ns}-${k}"]`, v); if (u) await page.selectOption(`${root}[data-k="${ns}-${k}-unit"]`, u); },
    clear: () => page.click(`${root}.sv-clear`),
  });
  {
    const t = sv('tr', '.tfm-solve '), l = sv('ln', '.tfm-lsolve ');
    await page.$$eval('.tool-ui details, .tfm details', (d) => d.forEach((x) => { x.open = true; }));
    check((await t.ans()) === 'The secondary needs 100 turns.', `transformer solve: Ns (${await t.ans()})`);
    check((await t.work()).includes('Ns = Np × Vs / Vp = 2000 × 12 ÷ 240 = 100') && (await t.work()).includes('step-down'), 'transformer solve: working and step-down');
    await t.ex(1); check((await t.ans()) === 'The secondary voltage is 23 V.', `transformer solve: Vs (${await t.ans()})`);
    await t.ex(2); check((await t.ans()) === 'The secondary voltage is 220 V.' && (await t.work()).includes('step-up'), `transformer solve: step-up (${await t.ans()})`);
    await t.ex(3); check((await t.ans()) === 'The primary current is 290 mA.' && (await t.work()).includes('Power in = 60 W ÷ 0.9 = 66.7 W'), `transformer solve: Ip with efficiency (${await t.ans()})`);
    await t.ex(4); check((await t.ans()).includes('use about 1533'), `transformer solve: whole turns (${await t.ans()})`);
    // Units: 0.23 kV
    await t.clear(); await t.find('Vs'); await t.set('Vp', '0.23', 'kV'); await t.set('Np', '500'); await t.set('Ns', '50');
    check((await t.ans()) === 'The secondary voltage is 23 V.', `transformer solve: kV accepted (${await t.ans()})`);
    // Secondary current from Ip, ideal: 230 V, 12 V, 0.5 A -> Is = 230*0.5/12 = 9.58 A
    await t.find('Is'); await t.set('Vp', '230', 'V'); await t.set('Vs', '12'); await t.set('Ip', '0.5', 'A');
    check((await t.ans()) === 'The secondary current is 9.58 A.', `transformer solve: Is ideal (${await t.ans()})`);
    await t.set('eff', '150'); check((await t.ans()).includes('Efficiency must be above 0%'), 'transformer solve: efficiency over 100%');
    await t.find('Vs'); await t.set('Np', '0'); check((await t.ans()).includes('primary turns must be above zero'), `transformer solve: zero turns (${await t.ans()})`);
    await t.clear(); check((await t.ans()).startsWith('Fill in'), 'transformer solve: blank asks for numbers');
    // Power line
    check((await l.ans()).includes('4.13 MW') && (await l.ans()).includes('41.3%'), `line: 10 MW at 11 kV (${await l.ans()})`);
    await l.ex(1); check((await l.ans()).includes('10.3 kW') && (await l.ans()).includes('0.103%'), `line: 220 kV (${await l.ans()})`);
    await l.ex(2); check((await l.ans()).includes('28.3 kV'), `line: voltage for 2% (${await l.ans()})`);
    await l.find('loss'); await l.clear(); await l.set('P', '10', 'MW'); await l.set('V', '230', 'V'); await l.set('R', '5');
    check((await l.ans()).includes('cannot be done'), `line: impossible case (${await l.ans()})`);
    check(!/NaN|Infinity/.test(await page.textContent('.tfm-solve')) && !/NaN|Infinity/.test(await page.textContent('.tfm-lsolve')), 'transformer solve: never NaN or Infinity');
  }
};
