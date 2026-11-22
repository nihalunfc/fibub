// Speaking practice timer: preparation countdown, a beep, then the speaking countdown, like the real test.
// Optional "Record myself" uses the microphone through the browser; the recording stays in this tab
// (play it back, download it, or it is gone when you leave). Nothing is uploaded.
// In a lesson: <figure class="fig" data-fig="speak" data-prep="30" data-speak="90" data-task="Task text (HTML)">
import { put } from '../kit.js';

function beep() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)();
    const o = a.createOscillator(), g = a.createGain();
    o.frequency.value = 880; g.gain.value = 0.08;
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 0.25);
    o.onended = () => a.close();
  } catch { /* no sound: fine */ }
}

export default function (host, { data }) {
  const prep = +(data.prep || 30), speak = +(data.speak || 60);
  const box = put(host, document.createElement('div'));
  box.className = 'en-speak';
  box.innerHTML = `
    ${data.task ? `<div class="en-task">${data.task}</div>` : ''}
    <div class="en-phase" aria-live="polite">Ready: ${prep} s to prepare, then ${speak} s to speak.</div>
    <div class="en-bar"><span></span></div>
    <div class="lk-controls">
      <button type="button" class="lk-btn lk-primary" data-go>▶ Start</button>
      <label class="en-check"><input type="checkbox" data-rec> Record myself (stays on this device)</label>
    </div>
    <div class="en-rec" hidden></div>`;
  const phase = box.querySelector('.en-phase'), fill = box.querySelector('.en-bar span'), go = box.querySelector('[data-go]');
  const recBox = box.querySelector('.en-rec'), recOn = box.querySelector('[data-rec]');
  let timer = 0, rec = null, stream = null, chunks = [];
  const stopRec = () => { if (rec && rec.state !== 'inactive') rec.stop(); stream?.getTracks().forEach((t) => t.stop()); stream = null; };
  const stopAll = (msg) => { clearInterval(timer); timer = 0; go.textContent = '▶ Start again'; fill.style.width = '0'; if (msg) phase.textContent = msg; stopRec(); };
  const run = (secs, label, cls, next) => {
    const t0 = performance.now();
    box.dataset.phase = cls;
    const tick = () => {
      const left = Math.max(0, secs - (performance.now() - t0) / 1000);
      phase.textContent = `${label}: ${Math.ceil(left)} s`;
      fill.style.width = `${100 * (1 - left / secs)}%`;
      if (left <= 0) { clearInterval(timer); next(); }
    };
    clearInterval(timer); timer = setInterval(tick, 100); tick();
  };
  const startRec = async () => {
    if (!recOn.checked || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
        recBox.hidden = false;
        recBox.innerHTML = `<p><b>Your answer.</b> Listen back with the checklist in the lesson. It is not saved anywhere.</p><audio controls src="${url}"></audio> <a class="lk-btn" href="${url}" download="my-speaking-answer.webm">⤓ Download</a>`;
      };
      rec.start();
    } catch { recBox.hidden = false; recBox.textContent = 'The microphone was not allowed, so there is no recording. The timer still works.'; }
  };
  go.addEventListener('click', () => {
    if (timer) return stopAll('Stopped.');
    recBox.hidden = true;
    go.textContent = '■ Stop';
    run(prep, 'Prepare', 'prep', async () => {
      beep();
      await startRec();
      run(speak, 'Speak now', 'speak', () => { beep(); stopAll('Time is up. How did it go? Check your answer against the list in the lesson.'); box.dataset.phase = 'done'; });
    });
  });
}
