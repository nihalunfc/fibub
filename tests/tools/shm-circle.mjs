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
};
