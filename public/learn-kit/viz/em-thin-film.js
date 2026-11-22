// Colours of a thin film, from interference between the light reflected at the top and at the bottom surface. The extra path
// is 2nt cosθ and one of the reflections may flip the phase by half a wavelength. The bars show how strongly each part of the
// visible spectrum (400 to 700 nm) is reflected; missing bars are the colours that cancel. Soap film in air: dark at t = 0.
// Coating on glass: choose t = λ/4n and the reflection at that wavelength is cancelled (anti-reflection coating).
import { canvas, axes, text, row, slider, choice, readout } from '../kit.js';

const BAND = [[400, 3], [450, 0], [490, 4], [530, 2], [575, 6], [600, 1], [650, 5]];
const colOf = (l) => { let c = BAND[0][1]; for (const [a, ci] of BAND) if (l >= a) c = ci; return c; };
export default function (host) {
  let kind = 'soap', nf = 1.33, tt = 250, ang = 0;
  const cv = canvas(host, { aspect: 0.7, max: 340, min: 250, label: 'Reflected intensity against wavelength for a thin film' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Film', [['soap', 'Soap film in air'], ['coat', 'Coating on glass (n = 1.5)']], kind, (v) => { kind = v; if (kind === 'coat') { nf = 1.38; sn.set(1.38); } else { nf = 1.33; sn.set(1.33); } upd(); });
  slider(c2, { label: 'Thickness t', min: 0, max: 1200, value: tt, step: 5, fmt: (x) => x + ' nm', oninput: (x) => { tt = x; upd(); } });
  const sn = slider(c2, { label: 'Film index n', min: 1.1, max: 1.45, value: nf, step: 0.01, fmt: (x) => x.toFixed(2), oninput: (x) => { nf = x; upd(); } });
  slider(c2, { label: 'Viewing angle', min: 0, max: 70, value: ang, step: 1, fmt: (x) => x + '°', oninput: (x) => { ang = x; upd(); } });
  const out = readout(host);
  const I = (l) => { const ct = Math.sqrt(1 - (Math.sin(ang * Math.PI / 180) / nf) ** 2), d = 4 * Math.PI * nf * tt * ct / l + (kind === 'soap' ? Math.PI : 0); return (1 + Math.cos(d)) / 2; };
  function upd() { const lam = []; for (let l = 400; l <= 700; l += 2) if (I(l) > 0.97 && I(l - 2) <= I(l) && I(l + 2) <= I(l)) lam.push(l); const ct = Math.sqrt(1 - (Math.sin(ang * Math.PI / 180) / nf) ** 2);
    out.innerHTML = `Extra path 2nt cosθ = ${(2 * nf * tt * ct).toFixed(0)} nm. ${kind === 'soap' ? 'One reflection flips the phase (air → film), the other does not, so bright when 2nt cosθ = (m + ½)λ, dark when = mλ.' : 'Both reflections flip the phase (n rises each time), so bright when 2nt cosθ = mλ, dark when = (m + ½)λ.'} Strongest reflection near: <b>${lam.length ? lam.join(', ') + ' nm' : 'no clear peak in the visible (looks dull white or dark)'}</b>. ${kind === 'coat' ? 'Quarter-wave coating for 550 nm: t = λ/4n = ' + (550 / 4 / nf).toFixed(0) + ' nm.' : 'Thinner than ~50 nm the film looks black; thick films give pale, mixed colours.'} Tilt the viewing angle: colours shift to shorter wavelengths.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const G = axes(ctx, w, h, col, { x: [400, 700], y: [0, 1.05], xlabel: 'wavelength (nm)', ylabel: 'reflected strength', l: 44, t: 24, b: 40, xt: [400, 450, 500, 550, 600, 650, 700], yt: [0, 0.5, 1], fy: (v) => v });
    const bw = (G.R - G.L) / 60;
    for (let l = 400; l < 700; l += 5) { const v = I(l + 2.5); ctx.fillStyle = col.s[colOf(l)]; ctx.fillRect(G.X(l) + 0.5, G.Y(v), Math.max(1, G.X(l + 5) - G.X(l) - 1), G.B - G.Y(v)); }
    text(ctx, 'violet … blue … green … yellow … red', G.L + 6, G.T - 8 + 4, { color: col.muted, size: 10.5 });
  };
  upd();
}
