// #1062 shm-circle
export const path = '/learn/shm-circle/';
export default async ({ page, check, BASE }) => {
  const R = '.shc ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.sh-eq'), f = await t('.sh-facts');
    check(e.includes('ω = 2π / T = 3.142 rad/s') && e.includes('v_max = Aω = 31.42 cm/s') && e.includes('a_max = Aω² = 0.9870 m/s²'), 'shm: circle A 10 cm T 2 s: ω, v_max, a_max (Python)');
    check(f.includes('0.02467 J') && f.includes('4.935 N/m') && f.includes('frequency 0.5000 Hz'), 'shm: energy ½kA² = 0.02467 J, k = mω² = 4.935 N/m'); }
  const inked = await page.$eval(R + '.sh-gr', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[i + 2]) > 60 || d[i] < 100) n++; return n; });
  check(inked > 300, `shm: graphs drawn (${inked})`);
  await page.click(R + '.sh-play'); await page.click(R + '.sh-zero'); await page.waitForTimeout(100);
  check((await t('.sh-live')).startsWith('t = 0.00 s:  x = 10.0 cm,  v = 0.0 cm/s,  a = −98.7 cm/s²'.replace('−', '-')), 'shm: at t = 0, x = A, v = 0, a = −Aω²');
  await slide('.sh-p', 90);
  check((await t('.sh-live')).includes('x = 0.0 cm,  v = -31.4 cm/s') && (await t('.sh-pv')) === '90°', 'shm: phase 90° starts in the middle moving left');
  await slide('.sh-p', 0);
  await slide('.sh-A', 20);
  check((await t('.sh-facts')).includes('0.09870 J') || (await t('.sh-facts')).includes('0.0987 J'), 'shm: double amplitude, four times the energy');
  check((await t('.sh-facts')).includes('Period T2 s'), 'shm: period unchanged by amplitude');
  await slide('.sh-A', 10);
  await page.click(R + '[data-m="spring"]'); await page.waitForTimeout(150);
  check((await t('.sh-eq')).includes('T = 2π√(m/k) = 2π√(0.5 / 20) = 0.9935 s') && await page.isVisible(R + '.sh-k') && await page.isHidden(R + '.sh-T'), 'shm: spring 0.5 kg, 20 N/m: T = 0.9935 s (Python)');
  await slide('.sh-k', 80);
  check((await t('.sh-eq')).includes('= 0.4967 s'), 'shm: four times stiffer halves the period');
  await page.click(R + '[data-m="pendulum"]'); await page.waitForTimeout(150);
  check((await t('.sh-eq')).includes('T = 2π√(L/g) = 2π√(1.00 / 9.8) = 2.007 s') && await page.isVisible(R + '.sh-L'), 'shm: pendulum 1 m: T = 2.007 s (Python)');
  await page.selectOption(R + '.sh-g', '1.62'); await page.waitForTimeout(150);
  check((await t('.sh-eq')).includes('= 4.937 s'), 'shm: pendulum on the Moon 4.937 s');
  await slide('.sh-L', 2.5);
  check((await t('.sh-Lv')) === '2.50 m', 'shm: length slider');
  await page.click(R + '[data-m="circle"]'); await page.waitForTimeout(150);
  await slide('.sh-T', 1);
  check((await t('.sh-eq')).includes('ω = 2π / T = 6.283 rad/s'), 'shm: T = 1 s gives ω = 2π');
  await page.check(R + '.sh-slow'); await page.click(R + '.sh-play');
  check((await t('.sh-play')) === 'Pause', 'shm: play again');
  // Check yourself
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'shm: five questions');
  const ans = await items[0].getAttribute('data-ans');
  await (await items[0].$('.lq-in')).fill(String(+(+ans).toPrecision(3))); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.', 'shm: spring period answer accepted');
  const ch = await items[4].$$('.lq-choice'), right = +(await items[4].getAttribute('data-ans'));
  await ch[2].click();
  check((await (await items[4].$('.lq-fb')).textContent()).startsWith('Not quite'), 'shm: wrong choice');
  await ch[right].click();
  check((await (await items[4].$('.lq-fb')).textContent()) === 'Right.' && await (await items[4].$('.lq-work')).isVisible(), 'shm: right choice shows working');

  // ---- Solve my numbers ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  {
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals, units = {}) => {
    await page.selectOption('.ps-host [data-k="prob"]', id);
    for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${id}-${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${id}-${k}"]`, v); else await page.fill(`.ps-host [data-k="${id}-${k}"]`, v); }
    for (const [k, u] of Object.entries(units)) await page.selectOption(`.ps-host [data-k="${id}-${k}-u"]`, u);
    await page.waitForTimeout(80);
  };
  const T = (cond, msg) => check(cond, `shm-circle: ${msg}`);
  await psPre('Mains 50 Hz'); T((await psAns()).includes('The period is 0.02 s and ω = 314 rad/s'), 'example Mains 50 Hz');
  await psPre('Spring at 0.25 s'); T((await psAns()).includes('x = 7.07 cm, v = 0.222 m/s and a = −0.698 m/s²'), 'example Spring at 0.25 s');
  await psPre('Speed at 6 cm'); T((await psAns()).includes('the speed is 0.251 m/s and the acceleration is 0.592 m/s²'), 'example Speed at 6 cm');
  await psPre('Mass on a spring'); T((await psAns()).includes('The period is 0.993 s'), 'example Mass on a spring');
  await psPre('Pendulum 1 m'); T((await psAns()).includes('The period is 2.01 s'), 'example Pendulum 1 m');
  await psPre('Lab: find g'); T((await psAns()).includes('g = 9.64 m/s²'), 'example Lab: find g');
  await psPre('Energy split'); T((await psAns()).includes('0.16 J is kinetic and 0.09 J is potential'), 'example Energy split');
  await psSet('Lp', {'T': '2', 'g': '9.8'}, {}); T((await psAns()).includes('The pendulum must be 0.993 m (99.3 cm) long.'), 'seconds pendulum is 0.993 m');
  await psSet('k', {'m': '0.2', 'T': '0.8'}, {}); T((await psAns()).includes('The spring constant is 12.3 N/m.'), 'k = 4 pi^2 m / T^2 = 12.3 N/m');
  await psSet('spring', {'m': '500', 'k': '0.2'}, {'m': 'g', 'k': 'N/cm'}); T((await psAns()).includes('The period is 0.993 s'), 'grams and N/cm units give 0.993 s');
  await psSet('x', {'A': '10', 'T': '2', 'p': '1.5707963267949', 't': '0'}, {'p': 'rad'}); T((await psAns()).includes('x = 10 cm, v = 0 m/s'), 'phase pi/2 in radians puts it at the end');
  await psSet('vx', {'A': '10', 'T': '2', 'x': '12'}); T((await psAns()).includes('cannot be more than the amplitude'), 'x beyond A gives a friendly message');
  await psSet('w', {'T': '0'}); T((await psAns()).includes('must be more than 0'), 'T = 0 gives a friendly message');
  await psPre('Mass on a spring');
  await psPre('Mains 50 Hz'); T((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), 'working shown, no NaN');
  }
};
