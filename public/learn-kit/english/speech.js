// Listening by speech synthesis for the English exam courses (CELPIP, TOEFL). The browser's own voices read an
// original script aloud: nothing is downloaded or sent anywhere. Scripts are [{ who: 'A' | 'B' | 'C' | 'N', text }]
// (N = narrator). Each speaker gets a different voice when the device has several English voices.
const synth = typeof speechSynthesis !== 'undefined' ? speechSynthesis : null;

export const canSpeak = () => !!synth;

let cache = null;
function voices(accent) {
  if (!synth) return [];
  const all = synth.getVoices().filter((v) => /^en[-_]/i.test(v.lang) || v.lang === 'en');
  if (!all.length) return [];
  const want = (accent || 'en-CA').toLowerCase();
  const score = (v) => (v.lang.toLowerCase().replace('_', '-') === want ? 0 : /en-(ca|us)/i.test(v.lang) ? 1 : 2) + (v.localService ? 0 : 0.5);
  return [...all].sort((a, b) => score(a) - score(b));
}

/** Wait until the voice list is ready (Chrome fills it a moment after load). */
export function ready() {
  if (!synth) return Promise.resolve([]);
  if (synth.getVoices().length) return Promise.resolve(synth.getVoices());
  return new Promise((res) => {
    const done = () => res(synth.getVoices());
    synth.addEventListener?.('voiceschanged', done, { once: true });
    setTimeout(done, 1500);
  });
}

/**
 * Read a script aloud. Returns { stop, done } where done resolves when the last line ends.
 * onLine(i) is called as each line starts (to highlight a transcript).
 */
export function play(script, { rate = 1, accent = 'en-CA', onLine } = {}) {
  if (!synth) return { stop() {}, done: Promise.resolve() };
  synth.cancel();
  const vs = voices(accent);
  cache = vs;
  const who = [...new Set(script.map((l) => l.who || 'N'))];
  // Give speakers voices that differ: narrator first voice, A and B the next ones, wrapping round.
  const pickFor = (w) => (vs.length ? vs[(who.indexOf(w) * 2 + (w === 'N' ? 0 : 1)) % vs.length] : null);
  const pitch = { N: 1, A: 1.05, B: 0.85, C: 1.2 };
  let stopped = false;
  const done = new Promise((resolve) => {
    script.forEach((l, i) => {
      const u = new SpeechSynthesisUtterance(l.text.replace(/<[^>]+>/g, ''));
      const v = pickFor(l.who || 'N');
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = accent;
      u.rate = rate;
      u.pitch = vs.length > 1 ? 1 : pitch[l.who || 'N'] || 1; // one voice only: tell speakers apart by pitch
      u.onstart = () => onLine && onLine(i);
      if (i === script.length - 1) { u.onend = () => resolve(); u.onerror = () => resolve(); }
      synth.speak(u);
    });
  });
  return { stop() { stopped = true; synth.cancel(); }, done, get stopped() { return stopped; } };
}

export function stopAll() { synth?.cancel(); }

/**
 * A small player: Play / Stop, speed, "exam mode" (one play only) and a transcript that opens on request.
 * Returns the element.
 */
export function player(script, { accent = 'en-CA', examOnce = false, title = 'Listen', showTranscript = true, lock = false } = {}) {
  const box = document.createElement('div');
  box.className = 'en-player';
  const head = document.createElement('p');
  head.className = 'en-player-head';
  head.textContent = '🔊 ' + title;
  const bar = document.createElement('div');
  bar.className = 'lk-controls';
  const playB = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn lk-primary', textContent: '▶ Play' });
  const speed = document.createElement('select');
  speed.setAttribute('aria-label', 'Speed');
  for (const [v, t] of [['0.8', 'Slower'], ['1', 'Normal'], ['1.15', 'Faster']]) speed.append(new Option(t, v, v === '1', v === '1'));
  const once = document.createElement('label');
  once.className = 'en-check';
  const onceBox = Object.assign(document.createElement('input'), { type: 'checkbox', checked: examOnce });
  once.append(onceBox, document.createTextNode(' Exam mode: play once'));
  bar.append(playB, speed, once);
  const tr = document.createElement('details');
  tr.className = 'en-transcript';
  tr.innerHTML = '<summary>Transcript</summary>';
  const lines = script.map((l) => {
    const p = document.createElement('p');
    p.innerHTML = (l.who && l.who !== 'N' ? `<b>${l.name || 'Speaker ' + l.who}:</b> ` : '') + l.text;
    tr.appendChild(p);
    return p;
  });
  const note = document.createElement('p');
  note.className = 'en-note';
  box.append(head, bar);
  if (showTranscript) box.append(tr);
  box.append(note);
  if (!canSpeak()) { playB.disabled = true; note.textContent = 'Your browser cannot read text aloud. Open the transcript and read it instead.'; return box; }
  let cur = null, plays = 0;
  const reset = () => { playB.textContent = '▶ Play'; lines.forEach((p) => p.classList.remove('en-on')); cur = null; };
  playB.addEventListener('click', async () => {
    if (cur) { cur.stop(); reset(); return; }
    if (onceBox.checked && plays >= 1) { note.textContent = 'Exam mode: the recording plays once, as in the real test. Untick exam mode to hear it again.'; return; }
    await ready();
    plays++;
    note.textContent = '';
    playB.textContent = '■ Stop';
    cur = play(script, { rate: +speed.value, accent, onLine: (i) => lines.forEach((p, j) => p.classList.toggle('en-on', i === j)) });
    cur.done.then(() => { if (cur && !cur.stopped) reset(); });
  });
  // lock: keep the transcript out of sight until the answers are checked (it would give dictation answers away).
  if (lock) { tr.hidden = true; note.textContent = 'The transcript appears after you check your answers.'; }
  box.reveal = () => { tr.hidden = false; tr.open = true; };
  return box;
}
