// A slice through IceCube: strings of light sensors 125 m apart, sensors 17 m apart, 1.45 to 2.45 km deep.
// Pick an event type and watch the light spread out at the speed of light in ice. Each sensor lights up
// when the light reaches it, coloured by arrival time (early = warm, late = cool) and sized by the light it got.
import { stage, clear, text, dot, line, rng, type Stage } from '../kit';

const STRINGS = 10, DOMS = 30, SP = 125, DZ = 34; // drawn: every other sensor, so 34 m apart in the picture
const V = 0.22; // light speed in ice, metres per nanosecond (c / 1.31 ≈ 0.229; group speed a little lower)
const ABS = 70; // an effective light-fading length (m), rounded; real ice varies with depth

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: an event display', title: 'Send a neutrino into the ice', h: 400, alt: 'Columns of dots are sensor strings. A neutrino interacts, light spreads out, and the sensors light up from warm to cool colours in time order.', caption: 'One vertical slice of the detector, to scale. Light fades over tens of metres in deep ice, so distant sensors see little or nothing. Colours: arrival time; size: amount of light.' });
  const r = rng(11);
  const W = (STRINGS - 1) * SP, Hm = (DOMS - 1) * DZ;
  const sx = (x: number) => 40 + (x / W) * (s.W - 80), sy = (z: number) => 30 + (z / Hm) * (s.H - 60);
  let kind = 'track', t = 0, ev = make();
  function make() {
    const a = r() * Math.PI, start = { x: W * (0.2 + 0.6 * r()), z: Hm * (0.2 + 0.6 * r()) };
    const dir = { x: Math.cos(a), z: Math.sin(a) - 0.3 };
    const m = Math.hypot(dir.x, dir.z); dir.x /= m; dir.z /= m;
    const energy = kind === 'track' ? 30 + r() * 300 : 60 + r() * 2000;
    return { start, dir, energy };
  }
  // Light source points: a track lights all along its path; a cascade at one spot; a "double bang" (tau) at two spots.
  const sources = () => {
    const { start, dir } = ev, out: { x: number; z: number; t0: number; w: number }[] = [];
    if (kind === 'track') for (let d = -1600; d <= 1600; d += 20) out.push({ x: start.x + dir.x * d, z: start.z + dir.z * d, t0: d / 0.2998 + 6000, w: 1 });
    else if (kind === 'cascade') out.push({ x: start.x, z: start.z, t0: 6000, w: 60 });
    else { out.push({ x: start.x - dir.x * 150, z: start.z - dir.z * 150, t0: 6000, w: 40 }); out.push({ x: start.x + dir.x * 150, z: start.z + dir.z * 150, t0: 6000 + 300 / 0.2998, w: 40 }); }
    return out;
  };
  let src = sources();
  // For each sensor: first arrival time and the light it collects.
  const hits = () => {
    const out: { x: number; z: number; t: number; q: number }[] = [];
    for (let i = 0; i < STRINGS; i++) for (let j = 0; j < DOMS; j++) {
      const x = i * SP, z = j * DZ; let tf = Infinity, q = 0;
      for (const p of src) { const d = Math.max(8, Math.hypot(x - p.x, z - p.z)); tf = Math.min(tf, p.t0 + d / V); q += (p.w * ev.energy * Math.exp(-d / ABS)) / d; }
      if (q > 0.6) out.push({ x, z, t: tf, q });
    }
    return out;
  };
  let H = hits();
  const reset = () => { ev = make(); src = sources(); H = hits(); t = Math.min(...H.map((h) => h.t), 6000) - 300; };
  s.choice([['track', 'Muon track'], ['cascade', 'Cascade'], ['tau', 'Double bang (tau)']], kind, (v) => { kind = v; reset(); });
  s.button('New event', reset);
  reset();
  s.play((dt) => {
    t += dt * 2400;
    const tMax = Math.max(...H.map((h) => h.t), 6000);
    if (t > tMax + 2500) reset();
    clear(s); const c = s.col;
    for (let i = 0; i < STRINGS; i++) line(s, [[sx(i * SP), sy(0)], [sx(i * SP), sy(Hm)]], c.line, 1);
    for (let i = 0; i < STRINGS; i++) for (let j = 0; j < DOMS; j++) dot(s, sx(i * SP), sy(j * DZ), 1.6, c.muted, 0.6);
    // Light fronts.
    for (const p of src.filter((_, k) => kind !== 'track' || k % 10 === 0)) { const rr = (t - p.t0) * V; if (rr > 0 && rr < 900) { s.c.strokeStyle = c.blue; s.c.globalAlpha = Math.max(0, 0.25 * (1 - rr / 900)); s.c.beginPath(); s.c.ellipse(sx(p.x), sy(p.z), (rr / W) * (s.W - 80), (rr / Hm) * (s.H - 60), 0, 0, Math.PI * 2); s.c.stroke(); s.c.globalAlpha = 1; } }
    if (kind === 'track') { const d = (t - 6000) * 0.2998; const { start, dir } = ev; line(s, [[sx(start.x - dir.x * 1600), sy(start.z - dir.z * 1600)], [sx(start.x + dir.x * Math.min(1600, d)), sy(start.z + dir.z * Math.min(1600, d))]], c.ink, 1.2, [6, 5]); }
    const t0 = Math.min(...H.map((h) => h.t)), t1 = Math.max(...H.map((h) => h.t));
    let lit = 0;
    for (const h of H) if (h.t <= t) { lit++; const f = (h.t - t0) / Math.max(1, t1 - t0); dot(s, sx(h.x), sy(h.z), Math.min(11, 2.5 + 2 * Math.log10(1 + h.q)), `hsl(${Math.round(10 + 220 * f)} 80% 50%)`, 0.9); }
    text(s, `${kind === 'track' ? 'Muon track' : kind === 'cascade' ? 'Cascade' : 'Double bang'} · ${lit} sensors hit · ${Math.round(Math.max(0, t - t0))} ns`, 14, 20, { bold: true, size: 13 });
    text(s, '125 m', sx(0) + 2, s.H - 12, { size: 11, colour: c.muted }); line(s, [[sx(0), s.H - 22], [sx(SP), s.H - 22]], c.muted, 1.5);
    s.mark();
    s.out(kind === 'track' ? 'A <b>muon</b> made by a muon neutrino flies kilometres in a straight line. The sensors light up in order along it, so the direction can be found to within about a degree: good for pointing at sources.' : kind === 'cascade' ? 'An electron or tau neutrino (or any neutrino bumping a nucleus) dumps its energy in a <b>cascade</b> a few metres long: a nearly round ball of light. Direction is rough (often 10° or more), but almost all the energy stays inside, so the energy is measured well.' : 'A <b>tau neutrino</b> can make two cascades: one where the tau is made and one where it decays, tens to hundreds of metres later at PeV energies. Seeing such pairs shows that some cosmic neutrinos arrive as the tau flavour.');
  });
}
