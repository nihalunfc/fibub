// Class 10 Surface Areas and Volumes: a turning wireframe of the four basic solids (cylinder, cone, sphere, hemisphere) with
// sliders for the radius r and height h. The formulas update as you change them: cylinder V = πr²h, CSA = 2πrh, TSA = 2πr(r + h);
// cone V = ⅓πr²h, CSA = πrl, TSA = πr(r + l), with slant height l = √(r² + h²); sphere V = ⁴⁄₃πr³, area 4πr²;
// hemisphere V = ⅔πr³, CSA = 2πr², TSA = 3πr². Each solid is built by spinning a profile curve about the vertical axis.
import { canvas, text, title, line, row, slider, choice, readout, loop } from '../../kit.js';

const PI = Math.PI, T = 0.3; // T: how much the circles are squashed into ellipses (a view from slightly above)
const fillA = (ctx, c, a = 0.6) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1; };
const strk = (ctx, c, w = 2) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); };
/** Cylinder standing on y = yb: curved side colour `side`, lid colour `top` (null = open top, no lid). */
function cyl(ctx, col, cx, yb, r, h, side, top, a = 0.6) {
  const ry = r * T, yt = yb - h;
  ctx.beginPath(); ctx.moveTo(cx - r, yt); ctx.lineTo(cx - r, yb); ctx.ellipse(cx, yb, r, ry, 0, PI, 0, true); ctx.lineTo(cx + r, yt); ctx.ellipse(cx, yt, r, ry, 0, 0, PI, true); ctx.closePath(); fillA(ctx, side, a); strk(ctx, col.ink, 1.8);
  ctx.beginPath(); ctx.ellipse(cx, yt, r, ry, 0, 0, 2 * PI); if (top) fillA(ctx, top, a); strk(ctx, col.ink, 1.8);
}
/** Cone with its base on y = yb. */
function cone(ctx, col, cx, yb, r, h, side, a = 0.6) {
  const ry = r * T;
  ctx.beginPath(); ctx.moveTo(cx, yb - h); ctx.lineTo(cx - r, yb); ctx.ellipse(cx, yb, r, ry, 0, PI, 0, true); ctx.closePath(); fillA(ctx, side, a); strk(ctx, col.ink, 1.8);
}
/** Hemisphere, curved side DOWN, flat face (ellipse, colour `flat`) at y = yt. */
function bowl(ctx, col, cx, yt, r, side, flat, a = 0.6) {
  const ry = r * T;
  ctx.beginPath(); ctx.moveTo(cx - r, yt); ctx.arc(cx, yt, r, PI, 0, true); ctx.ellipse(cx, yt, r, ry, 0, 0, PI, true); ctx.closePath(); fillA(ctx, side, a); strk(ctx, col.ink, 1.8);
  ctx.beginPath(); ctx.ellipse(cx, yt, r, ry, 0, 0, 2 * PI); if (flat) fillA(ctx, flat, a); strk(ctx, col.ink, 1.8);
}
/** Hemisphere, curved side UP (a dome), flat face at y = yb. */
function dome(ctx, col, cx, yb, r, side, flat, a = 0.6) {
  const ry = r * T;
  ctx.beginPath(); ctx.moveTo(cx - r, yb); ctx.arc(cx, yb, r, PI, 2 * PI); ctx.ellipse(cx, yb, r, ry, 0, 0, PI); ctx.closePath(); fillA(ctx, side, a); strk(ctx, col.ink, 1.8);
  if (flat) { ctx.beginPath(); ctx.ellipse(cx, yb, r, ry, 0, 0, 2 * PI); fillA(ctx, flat, a); strk(ctx, col.ink, 1.8); }
}

export default function (host) {
  let shape = 'cyl', r = 3, h = 5, yaw = 0.6, spin = true;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A slowly turning wireframe of a cylinder, cone, sphere or hemisphere with sliders for radius and height' });
  const ctl = row(host);
  choice(ctl, 'Solid', [['cyl', 'Cylinder'], ['cone', 'Cone'], ['sph', 'Sphere'], ['hem', 'Hemisphere']], 'cyl', (v) => { shape = v; hs.hidden(v === 'sph' || v === 'hem'); say(); });
  slider(ctl, { label: 'Radius r', min: 1, max: 5, step: 0.5, value: r, fmt: (v) => v + ' cm', oninput: (v) => { r = v; say(); } });
  const hs = (() => { const s = slider(ctl, { label: 'Height h', min: 1, max: 8, step: 0.5, value: h, fmt: (v) => v + ' cm', oninput: (v) => { h = v; say(); } }); const lab = ctl.lastElementChild; return { hidden(b) { lab.style.display = b ? 'none' : ''; }, s }; })();
  const anim = loop(host, (dt) => { yaw += dt * 0.6; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const prof = () => { // profile [rho, y] from bottom centre round to top centre, y up
    const p = [];
    if (shape === 'cyl') { for (let i = 0; i <= 4; i++) p.push([(r * i) / 4, 0]); for (let i = 1; i <= 8; i++) p.push([r, (h * i) / 8]); for (let i = 3; i >= 0; i--) p.push([(r * i) / 4, h]); }
    else if (shape === 'cone') { for (let i = 0; i <= 4; i++) p.push([(r * i) / 4, 0]); for (let i = 1; i <= 8; i++) p.push([r * (1 - i / 8), (h * i) / 8]); }
    else if (shape === 'sph') { for (let i = 0; i <= 16; i++) { const a = -PI / 2 + (i * PI) / 16; p.push([r * Math.cos(a), r + r * Math.sin(a)]); } }
    else { for (let i = 0; i <= 4; i++) p.push([(r * i) / 4, 0]); for (let i = 1; i <= 8; i++) { const a = (i * PI) / 16; p.push([r * Math.cos(a), r * Math.sin(a)]); } }
    return p;
  };
  const H = () => (shape === 'cyl' || shape === 'cone' ? h : shape === 'sph' ? 2 * r : r);
  function say() {
    const P = PI, l = Math.hypot(r, h), f = (v) => v.toFixed(1);
    const t = { cyl: `Cylinder: V = πr²h = <b>${f(P * r * r * h)}</b> cm³. Curved surface 2πrh = <b>${f(2 * P * r * h)}</b> cm². Total surface 2πr(r + h) = <b>${f(2 * P * r * (r + h))}</b> cm².`,
      cone: `Cone: slant height l = √(r² + h²) = ${f(l)} cm. V = ⅓πr²h = <b>${f(P * r * r * h / 3)}</b> cm³. Curved surface πrl = <b>${f(P * r * l)}</b> cm². Total πr(r + l) = <b>${f(P * r * (r + l))}</b> cm².`,
      sph: `Sphere: V = ⁴⁄₃πr³ = <b>${f(4 * P * r ** 3 / 3)}</b> cm³. Surface area 4πr² = <b>${f(4 * P * r * r)}</b> cm² (a sphere has only a curved surface).`,
      hem: `Hemisphere: V = ⅔πr³ = <b>${f(2 * P * r ** 3 / 3)}</b> cm³. Curved surface 2πr² = <b>${f(2 * P * r * r)}</b> cm². Total (with the flat face) 3πr² = <b>${f(3 * P * r * r)}</b> cm².` }[shape];
    out.innerHTML = t; cv.redraw();
  }
  cv.draw = (ctx, w, h2, col) => {
    title(ctx, 'Wireframe: spin a profile about an axis', col);
    const hh = H(), pitch = 0.45, k = Math.min((w - 40) / (2 * r), (h2 - 80) / (hh * Math.cos(pitch) + 2 * r * Math.sin(pitch))) * 0.92, cx = w / 2, cy = h2 / 2 + 14;
    const pr = (rho, y, a) => { const x = rho * Math.cos(a + yaw), z = rho * Math.sin(a + yaw); return [cx + x * k, cy + ((hh / 2 - y) * Math.cos(pitch) + z * Math.sin(pitch)) * k * 1, z]; };
    const p = prof(), N = 14, ringsAt = p.filter((q, i) => i % 2 === 0 && q[0] > 0.01);
    // rings
    ctx.lineWidth = 1; ringsAt.forEach(([rho, y]) => { ctx.beginPath(); for (let j = 0; j <= 40; j++) { const q = pr(rho, y, (j / 40) * 2 * PI); j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.strokeStyle = col.muted; ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1; });
    // meridians (front ones stronger)
    for (let m = 0; m < N; m++) { const a = (m / N) * 2 * PI, zf = Math.sin(a + yaw); ctx.beginPath(); p.forEach(([rho, y], i) => { const q = pr(rho, y, a); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.strokeStyle = zf > 0 ? col.s[0] : col.line; ctx.lineWidth = zf > 0 ? 1.6 : 1; ctx.stroke(); }
    // outline of the profile (the silhouette)
    ctx.beginPath(); p.forEach(([rho, y], i) => { const q = [cx + rho * k, cy + (hh / 2 - y) * Math.cos(pitch) * k]; void q; }); 
    line(ctx, [[cx, cy - (hh / 2) * Math.cos(pitch) * k - 4], [cx, cy + (hh / 2) * Math.cos(pitch) * k + 4]], col.muted, 1, [3, 4]);
    text(ctx, shape === 'sph' ? '2r' : shape === 'hem' ? 'r' : 'h = ' + hh.toFixed(1), cx + 6, cy - (hh / 2) * Math.cos(pitch) * k - 10, { color: col.muted, size: 11 });
  };
  hs.hidden(false); say();
}
