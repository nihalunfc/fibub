// 5.7 The classic universes, each a solution of Friedmann's equation, all passing through today's size and
// expansion rate (a = 1, H0 = 70) so their shapes can be compared: Einstein-de Sitter (matter only, flat),
// closed (twice the critical matter: recollapses), open (little matter: coasts), de Sitter (dark energy only:
// grows exponentially, no beginning) and today's best model (ΛCDM). Einstein's static universe is a flat line.
import { canvas, axes, text, title, line, row, choice, readout } from '../../kit.js';
import { scaleHistory } from '../phys.js';

const MODELS = {
  eds: { name: 'Einstein-de Sitter', p: { Om: 1, OL: 0 }, note: 'Matter only, exactly the critical amount (1932). It starts with a Big Bang 9.3 billion years ago and slows forever, never quite stopping. For decades the favourite model.' },
  closed: { name: 'Closed', p: { Om: 2, OL: 0 }, note: 'Twice the critical matter. Gravity wins: it grows to twice today\'s size, stops 36 billion years from now and collapses in a Big Crunch.' },
  open: { name: 'Open', p: { Om: 0.1, OL: 0 }, note: 'Little matter. Gravity barely slows it, so it coasts outwards forever, at an almost steady rate.' },
  ds: { name: 'de Sitter', p: { Om: 0, OL: 1 }, note: 'Dark energy only (de Sitter, 1917). It doubles in size every 9.7 billion years forever, and has no beginning: run it back and it just gets smaller and smaller.' },
  lcdm: { name: 'ΛCDM (ours)', p: { Om: 0.31, OL: 0.69 }, note: 'Our universe: matter slowed the expansion for 7 to 8 billion years, then dark energy took over. It will grow faster and faster, becoming like de Sitter.' },
  static: { name: 'Einstein static', p: null, note: 'Einstein, 1917: matter balanced by a cosmological constant, so the size never changes. Unstable: the smallest nudge starts it expanding or collapsing.' },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 300, label: 'Size against time for the classic model universes' });
  let pick = 'lcdm';
  const ctl = row(host);
  choice(ctl, 'Highlight', Object.entries(MODELS).map(([k, m]) => [k, m.name]), pick, (v) => { pick = v; show(); cv.redraw(); });
  const out = readout(host);
  const show = () => { out.innerHTML = `<b>${MODELS[pick].name}.</b> ${MODELS[pick].note}`; };
  const hist = {};
  for (const [k, m] of Object.entries(MODELS)) if (m.p) hist[k] = scaleHistory({ H0: 70, ...m.p }, { tPast: 20, tFuture: 40, aMax: 4.5 });
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-20, 40], y: [0, 4], t: 40, xlabel: 'Time from today (billion years)', ylabel: 'Size a (today = 1)' });
    const cs = { eds: col.s[1], closed: col.s[3], open: col.s[4], ds: col.s[5], lcdm: col.s[0], static: col.muted };
    ctx.save(); A.clip();
    for (const k of Object.keys(MODELS)) {
      const pts = k === 'static' ? [[A.X(-20), A.Y(1)], [A.X(40), A.Y(1)]] : hist[k].map(({ t, a }) => [A.X(t), A.Y(a)]);
      line(ctx, pts, cs[k], k === pick ? 3.2 : 1.3, k === pick ? undefined : [5, 4]);
    }
    ctx.restore();
    text(ctx, MODELS[pick].name, A.L + 8, A.T + 12, { color: cs[pick], size: 12.5, weight: 700, halo: col.panel });
    title(ctx, 'Six universes that all match today', col);
  };
  show(); cv.redraw();
}
