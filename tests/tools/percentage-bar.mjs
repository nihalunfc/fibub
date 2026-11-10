// #1242 Percentage bar
export const path = '/learn/percentage-bar/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/percentage-bar/`); await page.waitForSelector('.pb .pb-fig .pb-h');
  const R = '.pb ', txt = (s) => page.textContent(R + s);
  check((await txt('.pb-big')) === '35% of 240 = 84' && (await txt('.pb-steps')).includes('35 × 2.4 = 84') && (await txt('.pb-steps')).includes('block on the bar is 24'), 'pb: 35% of 240 = 84 with steps');
  check((await page.$$(R + '.pb-fig .pb-blk')).length === 9, 'pb: ten 10% blocks');
  // Drag the handle to the 50% mark.
  const el = await page.$(R + '.pb-fig'); await el.scrollIntoViewIfNeeded(); const box = await el.boundingBox(), k = box.width / 340;
  await page.mouse.move(box.x + (20 + 110) * k, box.y + 58 * k); await page.mouse.down();
  await page.mouse.move(box.x + (20 + 110) * k + 1, box.y + 58 * k); await page.mouse.up(); await page.waitForTimeout(80);
  check((await txt('.pb-big')) === '50% of 240 = 120' && (await page.inputValue(R + '.pb-p')) === '50', 'pb: drag to 50%');
  await page.click(R + '.pb-pre[data-p="150,60"]'); await page.waitForTimeout(80);
  check((await txt('.pb-big')) === '150% of 60 = 90' && (await page.$$(R + '.pb-over')).length === 1, 'pb: 150% of 60 grows past the whole');
  await page.click(R + '.pb-pre[data-p="12.5,640"]'); await page.waitForTimeout(80);
  check((await txt('.pb-big')) === '12.5% of 640 = 80', 'pb: 12.5% of 640');
  await page.fill(R + '.pb-n', '4500'); await page.fill(R + '.pb-p', '7'); await page.waitForTimeout(80);
  check((await txt('.pb-big')) === '7% of 4,500 = 315', 'pb: typed 7% of 4500');
  await page.fill(R + '.pb-n', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.pb-err'), 'pb: whole must be above 0');
  await page.fill(R + '.pb-n', '240'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.pb-err'), 'pb: message clears');
  // Up then down.
  check((await txt('.pb-steps2')).includes('500 × 1.2 = 600') && (await txt('.pb-steps2')).includes('600 × 0.8 = 480') && (await txt('.pb-net')).includes('fall of 4%') && (await txt('.pb-net')).includes('20² ÷ 100 = 4%'), 'pb: up 20 down 20 = 480, 4% fall');
  check((await page.$$(R + '.pb-fig2 .pb-bar')).length === 3, 'pb: three bars');
  await page.click(R + '.pb-sw'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.pb-c1')) === '-20' && (await txt('.pb-steps2')).includes('500 × 0.8 = 400') && (await txt('.pb-steps2')).includes('= 480'), 'pb: swap order still 480');
  await page.fill(R + '.pb-c1', '50'); await page.fill(R + '.pb-c2', '-50'); await page.waitForTimeout(80);
  check((await txt('.pb-net')).includes('fall of 25%'), 'pb: up 50 down 50 = 25% fall');
  await page.fill(R + '.pb-c2', '-150'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.pb-err2'), 'pb: change below −99% message');
  await page.fill(R + '.pb-c2', '10'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.pb-err2') && (await txt('.pb-net')).includes('rise of 65%'), 'pb: up 50 then up 10 = 65% rise');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 5, 'pb: five questions');
  const get = [/= ([\d.]+)\.$/, /= ([\d.]+)%\.$/, /= ([\d.]+)\.$/, /fell by ([\d.]+)%/, /= ([\d.]+)\. \(Taking/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = get[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `pb: quiz question ${i} (${w})`);
  }
};
