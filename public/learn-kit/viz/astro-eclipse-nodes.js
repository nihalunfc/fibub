// Why there is not an eclipse every month: the Moon's orbit is tilted 5.1° to the Sun's yearly path (the ecliptic), and they
// cross only at two points, the nodes. Press Play to run a year in 3D (drag to turn; the tilt is drawn 3 times too big).
// The strip below marks every new and full Moon; filled dots are eclipses. Switch the tilt off and every one becomes an eclipse.
import { canvas, text, row, slider, choice, button, readout, loop, title, dot } from '../kit.js';
import { orbit, shapes, wire } from './_3d.js';

const D = Math.PI / 180, SYN = 29.53, SID = 27.32, NODE = 40, TILT = 5.14;
export default function (host) {
  let t = 0, tilt = 'real';
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 320, label: 'The Sun path and the tilted Moon orbit crossing at two nodes, with new and full Moons marked on a year strip' });
  const cam = orbit(cv, { yaw: 0.5, pitch: 0.38 });
  const c1 = row(host), c2 = row(host);
  const st = slider(c1, { label: 'Day of the year', min: 0, max: 365, step: 0.5, value: t, fmt: (v) => `day ${Math.round(v)}`, oninput: (v) => { t = v; show(); } });
  choice(c2, 'Moon orbit', [['real', 'Tilted 5.1°'], ['flat', 'Not tilted']], tilt, (v) => { tilt = v; build(); show(); });
  const anim = loop(host, (dt) => { t = (t + dt * 12) % 365; st.set(t); show(); }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  const lamS = (d) => 280 + (360 * d) / 365.25, lamM = (d) => 20 + (360 * d) / SID;
  const beta = (d) => (tilt === 'flat' ? 0 : Math.asin(Math.sin(TILT * D) * Math.sin((lamM(d) - NODE) * D)) / D);
  const elong = (d) => (((lamM(d) - lamS(d)) % 360) + 360) % 360;
  let ev = [];
  function build() {
    ev = [];
    for (let d = 0; d < 365; d += 0.05) {
      const e0 = elong(d), e1 = elong(d + 0.05);
      [[0, 'new'], [180, 'full']].forEach(([k, name]) => {
        const a = ((e0 - k + 540) % 360) - 180, b = ((e1 - k + 540) % 360) - 180;
        if (a < 0 && b >= 0 && Math.abs(a) < 5) { const lim = name === 'new' ? 1.55 : 1.05; ev.push({ d, name, eclipse: Math.abs(beta(d)) < lim }); }
      });
    }
  }
  function show() {
    const e = elong(t), b = beta(t), ne = ev.filter((x) => x.eclipse).length;
    out.innerHTML = `Moon is <b>${Math.abs(b).toFixed(1)}°</b> ${b >= 0 ? 'north' : 'south'} of the Sun's path and ${Math.min(e, 360 - e).toFixed(0)}° from the Sun in the sky. An eclipse needs a new or full Moon <i>and</i> the Moon within about 1.5° of the path. This year: <b>${ev.length}</b> new and full Moons, <b>${ne}</b> eclipse${ne === 1 ? '' : 's'}, in clumps near the two node crossings (the eclipse seasons).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Sun path and Moon orbit from outside (Moon tilt drawn ×3)', col);
    const k = h - 70, P = cam.proj(w, k, Math.min(w, k) * 0.4, w / 2, k / 2 + 22);
    const pos = (lam) => [Math.cos(lam * D), 0, -Math.sin(lam * D)];
    wire(ctx, P, shapes.ring(1), col.s[1], 1.8);
    const nd = pos(NODE), tt = pos(NODE + 90), ti = (tilt === 'flat' ? 0 : TILT * 3) * D, R2 = 0.55;
    const mp = (u) => [0, 1, 2].map((q) => R2 * (Math.cos(u) * nd[q] + Math.sin(u) * (Math.cos(ti) * tt[q] + (q === 1 ? Math.sin(ti) : 0))));
    wire(ctx, P, [Array.from({ length: 73 }, (_, i) => mp((i / 72) * 2 * Math.PI))], col.s[0], 2);
    const E = P([0, 0, 0]); dot(ctx, E[0], E[1], 6, col.s[2]); text(ctx, 'Earth', E[0] + 8, E[1] + 10, { color: col.s[2], size: 10.5, weight: 600 });
    [NODE, NODE + 180].forEach((l, i) => { const q = P(pos(l).map((v) => v * 0.55)); dot(ctx, q[0], q[1], 3.5, col.ink); text(ctx, i ? 'node' : 'node', q[0] + 6, q[1] - 6, { color: col.ink, size: 10 }); });
    const S = P(pos(lamS(t)).map((v) => v)); dot(ctx, S[0], S[1], 8, col.s[1]); text(ctx, 'Sun', S[0] + 10, S[1], { color: col.s[1], size: 11, weight: 700 });
    const M = P(mp((lamM(t) - NODE) * D)); dot(ctx, M[0], M[1], 5, col.bg, col.ink); text(ctx, 'Moon', M[0] + 8, M[1] - 6, { color: col.ink, size: 11, weight: 700 });
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(S[0], S[1]); ctx.lineTo(E[0], E[1]); ctx.lineTo(M[0], M[1]); ctx.stroke(); ctx.restore();
    // year strip
    const x0 = 18, x1 = w - 18, y = h - 28;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ev.forEach((q) => { const x = x0 + (q.d / 365) * (x1 - x0), yy = y + (q.name === 'new' ? -9 : 9); ctx.beginPath(); ctx.arc(x, yy, 3.6, 0, 7); if (q.eclipse) { ctx.fillStyle = col.bad; ctx.fill(); } else { ctx.strokeStyle = col.muted; ctx.stroke(); } });
    const xn = x0 + (t / 365) * (x1 - x0); ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(xn, y - 16); ctx.lineTo(xn, y + 16); ctx.stroke();
    text(ctx, 'above line: new Moons (solar)   below: full Moons (lunar)   red = eclipse', 10, h - 6, { color: col.muted, size: 9.5 });
  };
  build(); show();
}
