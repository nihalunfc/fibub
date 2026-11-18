// Test audio for the DJ tools, made in the page: WAV files of clicks and synth chords (never committed audio).
// wavFiles(page, specs, inputSelector): specs = [{ name, kind: 'clicks', bpm, secs } | { name, kind: 'chords', midis: number[][], secs, bpm? }]
export const wavFiles = (page, specs, sel) => page.evaluate(([specs, sel]) => {
  const rate = 22050;
  const make = (sp) => {
    const n = Math.round(sp.kind === 'clicks' ? sp.secs * rate : sp.midis.length * sp.secs * rate), x = new Float32Array(n);
    if (sp.kind === 'clicks' || sp.bpm) {
      const per = 60 / sp.bpm;
      for (let t = 0; t * rate < n; t += per) { const at = Math.round(t * rate); for (let i = 0; i < 0.05 * rate && at + i < n; i++) x[at + i] += 0.5 * Math.sin(2 * Math.PI * 1000 * i / rate) * Math.exp(-i / rate / 0.012); }
    }
    if (sp.kind === 'chords') sp.midis.forEach((ms, ci) => {
      const s0 = Math.round(ci * sp.secs * rate), len = Math.round(sp.secs * rate);
      for (const m of ms) { const f = 440 * 2 ** ((m - 69) / 12); for (let h = 1; h <= 3; h++) for (let i = 0; i < len; i++) { const t = i / rate; x[s0 + i] += (0.08 / h) * Math.min(1, i / (0.01 * rate)) * Math.exp(-t * 0.8) * Math.sin(2 * Math.PI * f * h * t); } }
    });
    const b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, x[i])) * 32767), true);
    return new File([b], sp.name, { type: 'audio/wav' });
  };
  const dt = new DataTransfer(); for (const sp of specs) dt.items.add(make(sp));
  const inp = document.querySelector(sel); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
}, [specs, sel]);
// A minor (Am Dm E Am F Dm E Am) and a C major scale over a C drone, as MIDI note lists.
export const A_MINOR = [[45, 57, 60, 64], [50, 62, 65, 69], [40, 56, 59, 64], [45, 57, 60, 64], [41, 57, 60, 65], [50, 62, 65, 69], [40, 56, 59, 64], [45, 57, 60, 64]];
export const C_MAJOR = [60, 62, 64, 65, 67, 69, 71, 72, 71, 69, 67, 65, 64, 62, 60, 64, 67, 72].map((m) => [36, 48, 55, m]);
