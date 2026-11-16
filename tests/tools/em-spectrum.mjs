// #1419 Electromagnetic spectrum explorer
export const path = '/learn/em-spectrum/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/em-spectrum/`); await page.waitForTimeout(700);
  const R = '.ems ', txt = (s) => page.textContent(R + s);
  check((await txt('.ems-name')) === 'Visible light' && (await txt('.ems-lv')) === '525 nm' && !(await page.$eval(R + '.ems-sw', (e) => e.hidden)), `spectrum: example (${await txt('.ems-lv')})`);
  const f = await txt('.ems-facts');
  check(f.includes('Frequency f = c/λ571 THz') && f.includes('3.78 × 10⁻¹⁹ J') && f.includes('In electronvolts2.36 eV'), `spectrum: facts (${f})`);
  const inked = () => page.$eval(R + '.ems-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 40 || Math.abs(d[i + 1] - d[1]) > 40) n++; return n; });
  check((await inked()) > 2000, 'spectrum: strip drawn');
  await page.selectOption(R + '.ems-ex', { label: 'FM radio (100 MHz)' }); await page.waitForTimeout(60);
  check((await txt('.ems-name')) === 'Radio waves' && (await txt('.ems-lv')) === '3 m' && (await txt('.ems-uses')).startsWith('FM radio (100 MHz). ') && (await txt('.ems-facts')).includes('4.13 × 10⁻⁷ eV') && (await page.$eval(R + '.ems-sw', (e) => e.hidden)), `spectrum: FM radio (${await txt('.ems-facts')})`);
  await page.selectOption(R + '.ems-ex', { label: 'Germ-killing UV lamp' }); await page.waitForTimeout(60);
  check((await txt('.ems-name')) === 'Ultraviolet' && (await txt('.ems-facts')).includes('4.88 eV'), 'spectrum: UV lamp');
  await page.selectOption(R + '.ems-ex', { label: 'Microwave oven (2.45 GHz)' }); await page.waitForTimeout(60);
  check((await txt('.ems-name')) === 'Microwaves' && (await txt('.ems-facts')).includes('2.46 GHz'), `spectrum: microwave oven (${await txt('.ems-facts')})`);
  await page.$eval(R + '.ems-l', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(60);
  check((await txt('.ems-name')) === 'Gamma rays' && (await txt('.ems-lv')) === '100 fm' && (await page.$eval(R + '.ems-ex', (e) => e.value)) === '', `spectrum: shortest (${await txt('.ems-lv')})`);
  await page.$eval(R + '.ems-l', (e) => { e.value = '1600'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(60);
  check((await txt('.ems-name')) === 'Radio waves' && (await txt('.ems-lv')) === '1 km' && (await txt('.ems-facts')).includes('300 kHz'), 'spectrum: longest');
  check((await page.$$(R + '.eq-q')).length === 4, 'spectrum: four practice questions');
  const q3 = await page.textContent(R + '.eq-q:nth-child(3) p'), l = Number(q3.match(/photon of (\d+) nm/)[1]);
  await page.fill(R + '.eq-q:nth-child(3) .eq-in', String(1239.84 / l)); await page.click(R + '.eq-q:nth-child(3) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(3) .eq-res')).startsWith('Right'), 'spectrum: right answer accepted');

  // ---- Solve my numbers (em-spectrum) ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${k}"]`, v); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
  { // new block: no clashes with the checks above
  await psPre("Green light"); check((await psAns()).includes("visible light (green): wavelength 500 nm, frequency 6.00 × 10^14 Hz, photon energy 2.48 eV"), "em-spectrum: example Green light");
  await psPre("Microwave oven"); check((await psAns()).includes("microwaves: wavelength 122 mm"), "em-spectrum: example Microwave oven");
  await psPre("FM radio"); check((await psAns()).includes("radio waves: wavelength 3 m"), "em-spectrum: example FM radio");
  await psPre("Medical X-ray"); check((await psAns()).includes("X-rays: wavelength 31 pm"), "em-spectrum: example Medical X-ray");
  await psPre("Red laser"); check((await psAns()).includes("1.64 × 10^16 photons"), "em-spectrum: example Red laser");
  await psSet("lam", {"lam-l": "10"});
  await page.selectOption('.ps-host [data-k="lam-l-u"]', "µm"); await page.waitForTimeout(80);
  check((await psAns()).includes("infrared: wavelength 10 µm"), "em-spectrum: typed numbers lam infrared: wavelength 10 µm");
  await psSet("lam", {"lam-l": "0"}); check((await psAns()).includes("must be more than 0"), "em-spectrum: friendly message: must be more than 0");
  await psPre("Microwave oven"); { const w = await psWork(); check(w.includes("2.45 GHz = 2.45 × 10^9 Hz") && w.length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "em-spectrum: working shown, no NaN"); }
  }
};
