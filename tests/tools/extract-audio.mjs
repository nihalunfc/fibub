// #T965 Extract audio (same component as #T963; check the page asks for videos and reads a WebM's sound)
export const path = '/everyday/extract-audio/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/extract-audio/`); await page.waitForTimeout(300);
  const R = '.acv ';
  check((await page.textContent(R + '.acv-open')) === 'Open video files', 'extract-audio: asks for videos');
  // Make a 1.5 s WebM video with a 440 Hz sound track in the page itself (canvas + oscillator through MediaRecorder).
  const ok = await page.evaluate(async () => {
    if (!('MediaRecorder' in window)) return false;
    const c = document.createElement('canvas'); c.width = 64; c.height = 64; const g = c.getContext('2d'); let f = 0;
    const iv = setInterval(() => { g.fillStyle = f++ % 2 ? '#000' : '#fff'; g.fillRect(0, 0, 64, 64); }, 40);
    const ac = new AudioContext(), o = ac.createOscillator(), d = ac.createMediaStreamDestination(); o.connect(d); o.start();
    const stream = new MediaStream([...c.captureStream(25).getVideoTracks(), ...d.stream.getAudioTracks()]);
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm' }), parts = [];
    rec.ondataavailable = (e) => parts.push(e.data);
    const done = new Promise((r) => (rec.onstop = r)); rec.start(); await new Promise((r) => setTimeout(r, 1500)); rec.stop(); await done; clearInterval(iv); o.stop();
    const dt = new DataTransfer(); dt.items.add(new File(parts, 'clip.webm', { type: 'video/webm' }));
    const inp = document.querySelector('.acv .acv-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
  check(ok, 'extract-audio: test video made');
  await page.waitForFunction(() => !document.querySelector('.acv-list .st')?.textContent.includes('Reading'), null, { timeout: 15000 });
  const st = await page.textContent(R + '.acv-list .st');
  check(/^1\.\d s, .* → clip\.mp3/.test(st), `extract-audio: reads the sound track of a WebM (${st})`);
  await page.selectOption(R + '.acv-fmt', 'wav16');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.acv-save')]); const f = OUT + 'ex.wav'; await d.saveAs(f); const b = readFileSync(f);
  check(d.suggestedFilename() === 'clip.wav' && b.toString('latin1', 0, 4) === 'RIFF' && b.readUInt32LE(40) > 48000 * 2, `extract-audio: saves the sound as WAV (${b.length} bytes)`);
};
