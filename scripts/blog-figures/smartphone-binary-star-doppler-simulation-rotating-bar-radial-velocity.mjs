// Figures for src/blog/discoveries/smartphone-binary-star-doppler-simulation-rotating-bar-radial-velocity.md, made
// with the maths of Doppler and beats (src/lib/sci/phdoppler.ts: soundDoppler, sourceSpeed, airSpeed, beats).
// Run: node scripts/blog-figures/smartphone-binary-star-doppler-simulation-rotating-bar-radial-velocity.mjs
import fs from 'node:fs';
import { soundDoppler, sourceSpeed, airSpeed, beats } from '../../src/lib/sci/phdoppler.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/smartphone-binary-star-doppler-simulation-rotating-bar-radial-velocity.md', import.meta.url);

// Inputs from the paper: Di Laccio, Núñez and Gil (2021), Rev. Bras. Ensino Fís. 43: e20210241 (CC BY 4.0).
// Phone 1: 4.0 kHz at R1 = 0.60 m; phone 2: 4.4 kHz at R2 = 0.36 m on the opposite end; ω = 15.3 s⁻¹; microphone
// d0 = 0.70 m from the axis, in the plane of rotation. Air at 20 °C is OUR assumption (the paper gives no temperature).
const T_AIR = 20, c = airSpeed(T_AIR), W = 15.3, D0 = 0.70;
const PHONES = [{ id: 'Phone 1', f0: 4000, R: 0.60, ph: 0 }, { id: 'Phone 2', f0: 4400, R: 0.36, ph: Math.PI }];

// One phone on the circle; listener at (d, 0). Speed towards the listener v_r = −V d sin θ / r (θ = ωt + φ).
function track(p, d, n = 361, turns = 2) {
  const P = (2 * Math.PI) / W, out = [];
  for (let i = 0; i < n; i++) {
    const te = (turns * P * i) / (n - 1), th = W * te + p.ph;
    const r = Math.hypot(d - p.R * Math.cos(th), p.R * Math.sin(th)), vr = (-p.R * W * d * Math.sin(th)) / r;
    out.push({ t: te + r / c, f: soundDoppler(p.f0, c, vr, 0), vr });
  }
  return out;
}
const res = PHONES.map((p) => {
  const tr = track(p, D0, 4001, 1), fmax = Math.max(...tr.map((q) => q.f)), fmin = Math.min(...tr.map((q) => q.f));
  const V = p.R * W;
  return { ...p, V, fmax, fmin, up: fmax - p.f0, down: p.f0 - fmin, vBack: sourceSpeed(p.f0, fmax, c), vBack2: sourceSpeed(p.f0, fmin, c) };
});
const ratio = res[1].vBack / res[0].vBack;
const cs = [10, 20, 30].map((t) => ({ t, c: airSpeed(t), v: sourceSpeed(4000, res[0].fmax, airSpeed(t)) }));
const bt = beats(4000, 4400);
const period = (2 * Math.PI) / W;

const ms = (a) => a.map((q) => +(q.t * 1000).toFixed(1));
const tr1 = track(PHONES[0], D0), tr2 = track(PHONES[1], D0);
const fig1 = chart({
  title: 'Two phones on a spinning bar: pitch at the microphone', xLabel: 'Time at the microphone (ms)', yLabel: 'Frequency heard (Hz)',
  series: [
    { name: 'Phone 1 (4.0 kHz, 0.60 m)', kind: 'line', x: ms(tr1), y: tr1.map((q) => +q.f.toFixed(1)) },
    { name: 'Phone 2 (4.4 kHz, 0.36 m)', kind: 'line', x: ms(tr2), y: tr2.map((q) => +q.f.toFixed(1)) },
  ],
  xDomain: [0, 800], yDomain: [3850, 4500],
  desc: `Frequency heard over two turns. Phone 1 swings between ${res[0].fmin.toFixed(0)} and ${res[0].fmax.toFixed(0)} Hz, phone 2 between ${res[1].fmin.toFixed(0)} and ${res[1].fmax.toFixed(0)} Hz, always in opposite directions.`, height: 280,
});
// Shape: the same phone heard from 0.70 m (α = 0.86) and from 6 m (α = 0.10), as speed towards the listener.
const near = track(PHONES[0], D0, 361, 1), far = track(PHONES[0], 6, 361, 1);
const ph = (a, d) => a.map((q, i) => +((360 * i) / (a.length - 1)).toFixed(1));
const fig2 = chart({
  title: 'Phone 1: same speed, different shape', xLabel: 'Position on the circle at emission (degrees)', yLabel: 'Speed towards mic (m/s)',
  series: [
    { name: 'Mic at 0.70 m (α = 0.86)', kind: 'line', x: ph(near), y: near.map((q) => +q.vr.toFixed(2)) },
    { name: 'Mic at 6 m (α = 0.10)', kind: 'line', x: ph(far), y: far.map((q) => +q.vr.toFixed(2)), dash: '5 4' },
  ],
  xDomain: [0, 360], yDomain: [-10, 10], xTicks: [0, 90, 180, 270, 360], hlines: [{ y: 0, text: '' }],
  desc: `Line-of-sight speed of phone 1 over one turn. Both curves reach plus and minus ${res[0].V.toFixed(2)} m/s; close to the circle the curve is lopsided, far away it is a sine wave.`, height: 260,
});

console.log(JSON.stringify({ c: +c.toFixed(2), period: +period.toFixed(4), rev: +(W / 2 / Math.PI).toFixed(3), res: res.map((r) => ({ id: r.id, V: +r.V.toFixed(3), fmax: +r.fmax.toFixed(1), fmin: +r.fmin.toFixed(1), up: +r.up.toFixed(1), down: +r.down.toFixed(1), vBack: +r.vBack.toFixed(3), vBack2: +r.vBack2.toFixed(3), Rback: +(r.vBack / W).toFixed(3) })), ratio: +ratio.toFixed(3), cs: cs.map((q) => ({ t: q.t, c: +q.c.toFixed(2), v: +q.v.toFixed(3) })), beats: bt, alpha: [0.6 / 0.7, 0.6 / 6] }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pitch', figure(fig1, 'Figure 1. The frequency each phone would be heard at, worked out with the Doppler and beats maths for the paper\'s set-up (radii, speed of rotation, microphone distance) in air at 20 °C (our assumption). A calculation, not the paper\'s recording.'));
  md = inject(md, 'shape', figure(fig2, 'Figure 2. The speed of phone 1 along the line to the microphone over one turn. With the microphone 0.70 m from the axis the curve is lopsided; from 6 m away it is a plain sine. Both peak at the phone\'s full speed, Rω.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
