// #T922 Video trimmer
export const path = '/everyday/video-trimmer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/video-trimmer/`); await page.waitForTimeout(300);
  const R = '.vtr ';
  check(await page.isHidden(R + '.vtr-stage'), 'video-trimmer: waits for a video');
  // Make a 2 s test clip in the page: a moving square and a 440 Hz tone, recorded as WebM.
  await page.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 160; c.height = 120; const g = c.getContext('2d'); let f = 0;
    const iv = setInterval(() => { g.fillStyle = '#fff'; g.fillRect(0, 0, 160, 120); g.fillStyle = '#c00'; g.fillRect((f++ * 4) % 160, 40, 30, 30); }, 33);
    const ac = new AudioContext(), o = ac.createOscillator(), d = ac.createMediaStreamDestination(); o.connect(d); o.start();
    const rec = new MediaRecorder(new MediaStream([...c.captureStream(30).getVideoTracks(), ...d.stream.getAudioTracks()]), { mimeType: 'video/webm;codecs=vp8,opus' });
    const ch = []; rec.ondataavailable = (e) => ch.push(e.data); rec.start(100);
    await new Promise((r) => setTimeout(r, 2100)); rec.stop(); await new Promise((r) => (rec.onstop = r)); clearInterval(iv); o.stop(); ac.close();
    const dt = new DataTransfer(); dt.items.add(new File(ch, 'test-clip.webm', { type: 'video/webm' }));
    const inp = document.querySelector('.vtr .vtr-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.vtr-stage:not([hidden])', { timeout: 10000 }); await page.waitForTimeout(300);
  const info = () => page.textContent(R + '.vtr-info');
  await page.fill(R + '.vtr-s', '0.5'); await page.fill(R + '.vtr-e', '0.4');
  check((await info()).includes('end must be after') && await page.isDisabled(R + '.vtr-make'), 'video-trimmer: end before start is refused');
  await page.fill(R + '.vtr-e', '1.5');
  check((await info()).startsWith('Clip from 0.5 s to 1.5 s: 1 s long') && await page.isEnabled(R + '.vtr-make'), `video-trimmer: 0.5 to 1.5 s is a 1 s clip (${await info()})`);
  const clip = async (name) => {
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), (async () => { await page.click(R + '.vtr-make'); await page.waitForSelector(R + '.vtr-out:not([hidden])', { timeout: 20000 }); await page.click(R + '.vtr-dl'); })()]);
    const f = OUT + name; await d.saveAs(f); return readFileSync(f);
  };
  const a = await clip('vtr-sound.webm');
  check(a.length > 1000 && a.readUInt32BE(0) === 0x1a45dfa3 && a.includes(Buffer.from('webm')) && a.includes(Buffer.from('A_OPUS')), `video-trimmer: WebM clip with a sound track (${a.length} bytes)`);
  await page.check(R + '.vtr-mute');
  check((await info()).includes('no sound'), 'video-trimmer: mute shows in the summary');
  const b = await clip('vtr-mute.webm');
  check(b.length > 1000 && b.readUInt32BE(0) === 0x1a45dfa3 && !b.includes(Buffer.from('A_OPUS')) && /V_VP[89]/.test(b.toString('latin1')), `video-trimmer: muted clip has video and no sound track (${b.length} bytes)`);
};
