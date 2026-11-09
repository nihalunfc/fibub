// Ray diagrams for the school mirror and lens tools: a principal axis, the mirror or lens, the object arrow, the
// principal rays and the image, drawn to scale (paraxial: every ray from the object's tip meets at the image's tip).
import type { Figure, Palette } from './report';
import { mirrorImage, lensImage, type MirrorKind, type LensKind } from './sci/school-optics';

export type BenchOpts = { element: 'mirror' | 'lens'; kind: MirrorKind | LensKind; f: number; u: number; rays?: 2 | 3 | 4; W?: number; H?: number };
export type BenchView = { X0: number; Y0: number; s: number; W: number; H: number; h0: number };

/** Scale and origin for a bench: world cm to canvas px. */
export function benchView(o: BenchOpts): BenchView {
  const W = o.W ?? 400, H = o.H ?? 260, F = o.f;
  const left = Math.max(3.8 * F, Number.isFinite(o.u) ? 1.12 * o.u : 0), right = o.element === 'mirror' ? 2.3 * F : 3.8 * F;
  const s = W / (left + right), X0 = left * s, Y0 = H * 0.56;
  return { X0, Y0, s, W, H, h0: (H * 0.2) / s };
}

export function benchFigure(o: BenchOpts, alt: string): Figure {
  return { w: o.W ?? 400, h: o.H ?? 260, alt, draw: (ctx, w, h, pal) => drawBench(ctx, pal, o) };
}

type P = [number, number];
export function drawBench(ctx: CanvasRenderingContext2D, pal: Palette, o: BenchOpts) {
  const v = benchView(o), { X0, Y0, s, W, H, h0 } = v;
  const mir = o.element === 'mirror';
  const img = mir ? mirrorImage(o.kind as MirrorKind, o.f, o.u) : lensImage(o.kind as LensKind, o.f, o.u);
  const fS = img.f; // signed
  const px = (x: number, y: number): P => [X0 + x * s, Y0 - y * s];
  const font = (n: number, wgt = 400) => `${wgt} ${n}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  // Principal axis.
  ctx.strokeStyle = pal.muted; ctx.lineWidth = 1; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(0, Y0); ctx.lineTo(W, Y0); ctx.stroke();
  // Points on the axis.
  const marks: [number, string][] = mir ? [[0, 'P'], [fS, 'F'], [2 * fS, 'C']] : [[0, 'O'], [-o.f, 'F₁'], [-2 * o.f, '2F₁'], [o.f, 'F₂'], [2 * o.f, '2F₂']];
  ctx.font = font(12, 600); ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = pal.ink;
  for (const [x, t] of marks) {
    const [X] = px(x, 0);
    if (X < -5 || X > W + 5) continue;
    ctx.fillRect(X - 1, Y0 - 3, 2, 6);
    if (x !== 0 || !mir) ctx.fillText(t, x === 0 ? X - 9 : X, Y0 + 5);
    else ctx.fillText(t, X + (o.kind === 'concave' ? 9 : -9), Y0 + 5);
  }
  // Heights of every ray's hit, to size the mirror or lens.
  const hits: number[] = [];
  const finite = Number.isFinite(o.u), atF = finite && !Number.isFinite(img.v);
  const u = -o.u; // signed object position
  const yC = finite && mir && Math.abs(u - 2 * fS) > 1e-6 * o.f ? (2 * fS * h0) / (2 * fS - u) : NaN;
  type Ray = { hit: number; guide?: P; parallelOut?: boolean };
  const rays: Ray[] = [];
  if (!finite) for (const y of [0.85 * h0, 0.4 * h0, -0.45 * h0]) rays.push({ hit: y });
  else {
    rays.push({ hit: h0 });                                                   // parallel to the axis
    if (!atF) rays.push({ hit: img.m * h0, guide: mir ? [fS, 0] : [-fS, 0] }); // through (or towards) F
    if (mir) { if (Number.isFinite(yC)) rays.push({ hit: yC, guide: [2 * fS, 0] }); } // through (or towards) C
    else rays.push({ hit: 0 });                                               // through the optical centre
    if (mir && (o.rays ?? 3) >= 4) rays.push({ hit: 0 });                     // to the pole
  }
  for (const r of rays) hits.push(Math.abs(r.hit * s));
  const ap = Math.min(H * 0.5 - 4, Math.max(H * 0.36, ...hits.filter((x) => x < H).map((x) => x + 8)));
  const sag = (yPx: number) => (mir ? (o.kind === 'concave' ? -1 : 1) * 9 * (yPx / ap) ** 2 : 0);
  // The mirror or lens.
  ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5;
  if (mir) {
    ctx.beginPath();
    for (let k = -20; k <= 20; k++) { const y = (k / 20) * ap; const X = X0 + sag(y); if (k === -20) ctx.moveTo(X, Y0 - y); else ctx.lineTo(X, Y0 - y); }
    ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath();
    for (let k = -18; k <= 18; k += 3) { const y = (k / 20) * ap, X = X0 + sag(y); ctx.moveTo(X + 1, Y0 - y); ctx.lineTo(X + 7, Y0 - y - 6); }
    ctx.stroke();
  } else {
    const t = o.kind === 'convex' ? 7 : -6, edge = o.kind === 'convex' ? 1.5 : 7;
    ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(X0 - edge, Y0 - ap); ctx.quadraticCurveTo(X0 + edge + 2 * t, Y0, X0 + edge, Y0 + ap);
    ctx.lineTo(X0 - edge, Y0 + ap); ctx.quadraticCurveTo(X0 - edge - 2 * t, Y0, X0 - edge, Y0 - ap);
    ctx.closePath(); ctx.globalAlpha = 0.12; ctx.fillStyle = pal.accent; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
  }
  // Rays.
  const colours = [pal.accent, pal.accent2, pal.good, pal.muted];
  const line = (a: P, b: P, dash: boolean) => { ctx.setLineDash(dash ? [5, 4] : []); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
  const far = (a: P, d: P): P => { const n = Math.hypot(d[0], d[1]) || 1; return [a[0] + (d[0] / n) * 3000, a[1] + (d[1] / n) * 3000]; };
  const chevron = (a: P, b: P) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, an = Math.atan2(b[1] - a[1], b[0] - a[0]);
    if (mx < 0 || mx > W || my < 0 || my > H) return;
    ctx.setLineDash([]); ctx.beginPath();
    ctx.moveTo(mx - 6 * Math.cos(an - 0.5), my - 6 * Math.sin(an - 0.5)); ctx.lineTo(mx, my); ctx.lineTo(mx - 6 * Math.cos(an + 0.5), my - 6 * Math.sin(an + 0.5)); ctx.stroke();
  };
  const O: P = finite ? px(u, h0) : [0, 0];
  const I: P = finite && !atF ? px(img.v, img.m * h0) : px(fS, 0);
  const outDir = atF ? ((): P => { const a = px(0, 0), b = px(u, h0); return mir ? [b[0] - a[0], -(b[1] - a[1])] : [a[0] - b[0], a[1] - b[1]]; })() : null;
  rays.forEach((r, k) => {
    ctx.strokeStyle = colours[k % colours.length]; ctx.lineWidth = 1.6;
    const hp = r.hit * s, Hp: P = [X0 + sag(hp), Y0 - hp];
    const start: P = finite ? O : [0, Hp[1]];
    line(start, Hp, false); chevron(start, Hp);
    if (r.guide) {
      const G = px(r.guide[0], r.guide[1]);
      if (G[0] > X0 + 1) line(Hp, G, true);
      else if (finite && G[0] < O[0] - 1) line(G, O, true);
    }
    // Outgoing ray: through the image (real) or away from it (virtual, with a dashed line back to it).
    let d: P;
    if (outDir) d = outDir;
    else {
      const realSide = mir ? I[0] < Hp[0] : I[0] > Hp[0];
      if (realSide) d = [I[0] - Hp[0], I[1] - Hp[1]];
      else { d = [Hp[0] - I[0], Hp[1] - I[1]]; line(Hp, I, true); }
    }
    const end = far(Hp, d);
    line(Hp, end, false);
    const mid: P = [Hp[0] + (end[0] - Hp[0]) * 0.03, Hp[1] + (end[1] - Hp[1]) * 0.03];
    chevron(Hp, [mid[0] + (mid[0] - Hp[0]), mid[1] + (mid[1] - Hp[1])]);
  });
  ctx.setLineDash([]);
  // Object and image arrows.
  const arrow = (base: P, tip: P, colour: string, dash: boolean, label: string) => {
    ctx.strokeStyle = colour; ctx.fillStyle = colour; ctx.lineWidth = 3; ctx.setLineDash(dash ? [5, 4] : []);
    ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke(); ctx.setLineDash([]);
    const up = tip[1] < base[1] ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.lineTo(tip[0] - 6, tip[1] + 9 * up); ctx.lineTo(tip[0] + 6, tip[1] + 9 * up); ctx.closePath(); ctx.fill();
    ctx.font = font(12, 600); ctx.textAlign = 'center'; ctx.textBaseline = up > 0 ? 'bottom' : 'top';
    ctx.fillText(label, Math.min(W - 24, Math.max(24, tip[0])), tip[1] - 4 * up);
  };
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.font = font(12, 600); ctx.fillStyle = pal.ink;
  if (finite) arrow(px(u, 0), O, pal.ink, false, 'Object');
  else ctx.fillText('Object at infinity →', 6, 6);
  if (finite && !atF) {
    const [ix, iy] = px(img.v, img.m * h0);
    if (ix > -10 && ix < W + 10) arrow(px(img.v, 0), [ix, Math.max(-50, Math.min(H + 50, iy))], img.real ? pal.bad : pal.accent, !img.real, img.real ? 'Image' : 'Image (virtual)');
    else { ctx.textAlign = ix < 0 ? 'left' : 'right'; ctx.fillText(ix < 0 ? '← image far to the left' : 'image far to the right →', ix < 0 ? 6 : W - 6, 6); }
  } else if (atF) { ctx.textAlign = 'right'; ctx.fillText('Image at infinity', W - 6, 6); }
  else { const [fx] = px(fS, 0); ctx.fillStyle = img.real ? pal.bad : pal.accent; ctx.beginPath(); ctx.arc(fx, Y0, 4, 0, 2 * Math.PI); ctx.fill(); }
  ctx.restore();
}

/** World x (cm, signed) under a canvas x in CSS px for a canvas drawn `cssW` wide. */
export const worldX = (o: BenchOpts, cssX: number, cssW: number) => { const v = benchView(o); return ((cssX * v.W) / cssW - v.X0) / v.s; };
