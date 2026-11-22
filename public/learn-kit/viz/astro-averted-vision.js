// Why a faint smudge vanishes when you stare at it. Cones (colour, daylight) are packed in the fovea at the centre of
// your gaze; rods (dim light) are missing there and peak about 15 to 20 degrees away. Slide where you look relative to a faint
// galaxy: the galaxy is brightest to your eye when you look beside it. One eye also has a blind spot about 15 degrees from the centre.
import { canvas, text, row, slider, choice, readout, title, dot, axes, line } from '../kit.js';

const rod = (e) => { const a = Math.abs(e); return a < 1 ? 0 : (1 - Math.exp(-(((a - 0.8) / 5) ** 2))) * Math.exp(-(((a - 18) / 55) ** 2)) * 1.02 + (a > 55 ? 0 : 0); };
const cone = (e) => Math.exp(-Math.abs(e) / 2.2) * 1 + 0.03;
export default function (host) {
  let off = 0, blind = false;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 300, label: 'A faint galaxy at the side of the gaze with a plot of rod and cone density across the retina' });
  const c1 = row(host);
  slider(c1, { label: 'Look this far from the galaxy', min: 0, max: 40, step: 0.5, value: off, fmt: (v) => `${v.toFixed(1)}°`, oninput: (v) => { off = v; show(); } });
  choice(c1, 'Blind spot', [[false, 'Hide'], [true, 'Show (right eye)']], blind, (v) => { blind = v; show(); });
  const out = readout(host);
  const sens = () => { let s = rod(off); if (blind && Math.abs(off - 15) < 2) s *= Math.max(0, (Math.abs(off - 15) - 0.8) / 1.2); return s; };
  function show() {
    const s = sens();
    out.innerHTML = `Looking <b>${off.toFixed(1)}°</b> from the galaxy, its image falls on a part of the retina with <b>${Math.round(rod(off) * 100)}%</b> of the best rod density (cones: ${Math.round(cone(off) * 100)}%). ${off < 2 ? 'You are looking straight at it: only cones, which need much more light, so it fades.' : off < 8 ? 'Better, but still thin on rods.' : off < 28 ? 'This is averted vision: the image sits on the rod-rich ring, so the galaxy looks brightest.' : 'Rods thin out again.'} Observers try looking about 8 to 15° to the side, or "roll the eyes" gently, to keep new light on fresh rods.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Sky view: your gaze is the cross', col);
    const top = h * 0.42, cy = 30 + top / 2, gx = w * 0.78, scale = (gx - w * 0.22) / Math.max(40, 40), gaze = gx - off * ((gx - 28) / 40);
    ctx.fillStyle = '#05060a'; ctx.fillRect(10, 28, w - 20, top);
    const rd = Math.max(0, Math.min(1, sens()));
    const g = ctx.createRadialGradient(gx, cy, 0, gx, cy, 26); g.addColorStop(0, `rgba(235,235,225,${0.9 * rd})`); g.addColorStop(1, 'rgba(235,235,225,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gx, cy, 26, 0, 7); ctx.fill();
    text(ctx, 'faint galaxy', gx, cy + 34, { color: '#9aa', size: 10.5, align: 'center' });
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gaze - 9, cy); ctx.lineTo(gaze + 9, cy); ctx.moveTo(gaze, cy - 9); ctx.lineTo(gaze, cy + 9); ctx.stroke();
    if (blind) { const bx = gaze + 15 * ((gx - 28) / 40); dot(ctx, bx, cy - 20, 3, '#555'); text(ctx, 'blind spot', bx, cy - 30, { color: '#999', size: 9.5, align: 'center' }); }
    const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, 1.1], t: 40 + top, l: 40, b: 36, xlabel: 'degrees from the centre of gaze', yt: [0, 0.5, 1], fy: (v) => v, xt: [0, 10, 20, 30, 40], fx: (v) => v });
    const rp = [], cp = []; for (let i = 0; i <= 160; i++) { const e = (i / 160) * 40; rp.push([A.X(e), A.Y(rod(e))]); cp.push([A.X(e), A.Y(Math.min(1.05, cone(e)))]); }
    line(ctx, rp, col.s[0], 2.4); line(ctx, cp, col.s[5], 2.4);
    text(ctx, 'rods (dim light)', A.X(20), A.Y(1.0) - 10, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'cones', A.X(3.5), A.Y(0.95), { color: col.s[5], size: 11, weight: 700 });
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(A.X(off), A.B); ctx.lineTo(A.X(off), A.T); ctx.stroke(); ctx.restore();
    dot(ctx, A.X(off), A.Y(rod(off)), 5, col.s[0], col.panel);
  };
  show();
}
