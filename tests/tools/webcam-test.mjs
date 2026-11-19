// #T1053 Webcam Test. No camera headless: getUserMedia is replaced by a 640x480 grey canvas stream at about 30 fps.
export const path = '/everyday/webcam-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/webcam-test/`); await page.waitForTimeout(300);
  const R = '.wc ', t = (s) => page.textContent(R + s);
  await page.evaluate(() => { navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('no', 'NotFoundError'); }; });
  await page.click(R + '.wc-start'); await page.waitForTimeout(200);
  check((await t('.wc-status')).includes('No camera was found'), 'webcam-test: a missing camera says so plainly');
  await page.evaluate(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const c = document.createElement('canvas'); c.width = 640; c.height = 480; const x = c.getContext('2d');
      const paint = () => { x.fillStyle = 'rgb(128,128,128)'; x.fillRect(0, 0, 640, 480); };
      paint(); setInterval(paint, 33); return c.captureStream(30);
    };
  });
  await page.click(R + '.wc-start'); await page.waitForTimeout(1500);
  check((await t('.wc-res')).includes('640') && (await t('.wc-res')).includes('480') && (await t('.wc-asp')) === '4:3', `webcam-test: shows resolution and shape (${await t('.wc-res')}, ${await t('.wc-asp')})`);
  const fps = parseInt(await t('.wc-fps')), lum = parseInt(await t('.wc-lum'));
  check(fps >= 5 && fps <= 70, `webcam-test: measures a frame rate (${fps})`);
  check(lum >= 45 && lum <= 55, `webcam-test: mid grey reads about 50% brightness (${lum})`);
  check((await t('.wc-caps')).includes('Picture now') && !(await page.isDisabled(R + '.wc-snap')), 'webcam-test: capabilities table and snapshot are ready');
  await page.click(R + '.wc-snap');
  check(await page.isVisible(R + '.wc-img'), 'webcam-test: snapshot shows in the page');
  await page.click(R + '.wc-stop');
  check(await page.isVisible(R + '.wc-start') && (await t('.wc-status')) === 'Camera off.', 'webcam-test: stop switches the camera off');
};
