// Doppler effect with both a moving source and a moving observer. Wavefronts leave the source four times a second
// (slowed down) and spread at the speed of sound, 340 m/s. Set the two speeds and pick towards or apart: the observer
// counts the wavefronts reaching it and hears f' = f (v ± v_o)/(v ∓ v_s). A moving observer and a moving source are NOT
// symmetrical, because the wavefronts always travel at v relative to the air, not to the source.
import { canvas, text, title, arrow, dot, row, slider, choice, button, readout, loop } from '../kit.js';

const V = 340, F0 = 4, TMAX = 2.4;
export default function (host) {
  let vs = 80, vo = 0, t = 0, mode = 'toward';
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 300, label: 'Sound wavefronts from a moving source reaching a moving observer' });
  const ctl = row(host);
  slider(ctl, { label: 'Source speed', min: 0, max: 200, step: 5, value: vs, fmt: (v) => `${v} m/s`, oninput: (v) => { vs = v; reset(); } });
  slider(ctl, { label: 'Observer speed', min: 0, max: 200, step: 5, value: vo, fmt: (v) => `${v} m/s`, oninput: (v) => { vo = v; reset(); } });
  const c2 = row(host);
  choice(c2, 'Motion', [['toward', 'Towards each other'], ['apart', 'Moving apart']], mode, (v) => { mode = v; reset(); });
  const lp = loop(host, (dt) => { t += dt * 0.6; if (t > TMAX) t = 0; cv.redraw(); show(); }); lp.button(c2); button(c2, 'Restart', () => reset());
  const out = readout(host);
  // metres: toward = source starts at 40 moving right, observer at 760 moving left; apart = source at 380 moving left, observer at 420... observer moves right
  const geo = () => (mode === 'toward' ? { s0: 40, ds: 1, o0: 760, dO: -1 } : { s0: 380, ds: -1, o0: 480, dO: 1 });
  const src = (tt) => { const g = geo(); return g.s0 + g.ds * vs * tt; }, obs = (tt) => { const g = geo(); return g.o0 + g.dO * vo * tt; };
  const arrive = (te) => { // time the wavefront emitted at te reaches the observer (observer to the right of the source)
    const g = geo(), xe = src(te); // front at xe + V (ta - te) = o0 + dO vo ta
    return (g.o0 - xe + V * te) / (V - g.dO * vo);
  };
  const fObs = () => (mode === 'toward' ? (F0 * (V + vo)) / (V - vs) : (F0 * (V - vo)) / (V + vs));
  function reset() { t = 1; cv.redraw(); show(); }
  function show() {
    const f = fObs();
    out.innerHTML = `Emitted ${F0} wavefronts per second. ${mode === 'toward' ? 'Approaching' : 'Receding'}: f′ = f(v ${mode === 'toward' ? '+ v<sub>o</sub>)/(v − v<sub>s</sub>)' : '− v<sub>o</sub>)/(v + v<sub>s</sub>)'} = <b>${f.toFixed(2)} per second</b> (×${(f / F0).toFixed(2)}). ${vs === 0 && vo > 0 ? 'Only the observer moves: it runs into wavefronts more often (wavelength unchanged).' : vo === 0 && vs > 0 ? `Only the source moves: the wavelength ahead shortens to (v ∓ v<sub>s</sub>)/f = ${((V - (mode === 'toward' ? vs : -vs)) / F0).toFixed(0)} m, so the speed of the sound is unchanged but more crests pass per second.` : ''} Source Mach number ${(vs / V).toFixed(2)}.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Doppler: moving source and observer', col);
    const p = (w - 40) / 900, X = (m) => 20 + m * p, y0 = h * 0.58, n = Math.floor(t * F0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(10, y0); ctx.lineTo(w - 10, y0); ctx.stroke();
    let heard = 0;
    for (let i = 0; i <= n; i++) {
      const te = i / F0, r = V * (t - te) * p, cx = X(src(te));
      const ta = arrive(te), got = ta <= t; if (got) heard++;
      ctx.strokeStyle = got ? col.muted : col.s[0]; ctx.globalAlpha = got ? 0.35 : 1; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, y0, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const sx = X(src(t)), ox = X(obs(t));
    dot(ctx, sx, y0, 6, col.s[3], col.panel); text(ctx, 'source', sx, y0 + 22, { color: col.s[3], size: 11, weight: 600, align: 'center' });
    dot(ctx, ox, y0, 6, col.s[2], col.panel); text(ctx, 'observer', ox, y0 + 38, { color: col.s[2], size: 11, weight: 600, align: 'center' });
    const g = geo(); if (vs) arrow(ctx, sx, y0 - 20, sx + g.ds * 26, y0 - 20, col.s[3], 2.5); if (vo) arrow(ctx, ox, y0 - 20, ox + g.dO * 26, y0 - 20, col.s[2], 2.5);
    text(ctx, `wavefronts heard so far: ${heard}`, 12, h - 12, { color: col.s[2], size: 11, weight: 600 });
  };
  reset();
}
