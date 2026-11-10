// Tiny line chart (SVG string) and CSV download for the money tools. No DOM reads except in downloadCsv.
export interface Series { label: string; ys: number[]; color: string; dash?: boolean }
const nice = (v: number) => { const p = Math.pow(10, Math.floor(Math.log10(v || 1))); const m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; };
const short = (v: number) => (Math.abs(v) >= 1e6 ? (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : Math.abs(v) >= 1e3 ? Math.round(v / 1e3) + 'k' : String(Math.round(v)));
/** xs are labels for each point (same length for every series). Colours are CSS values. */
export function lineSvg(series: Series[], xs: number[], title: string): string {
  const W = 640, H = 260, L = 46, R = 10, T = 12, B = 30;
  const all = series.flatMap((s) => s.ys);
  const lo = Math.min(0, ...all), hi = nice(Math.max(1, ...all));
  const x = (k: number) => L + (xs.length < 2 ? 0 : (k / (xs.length - 1)) * (W - L - R));
  const y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  let g = '';
  for (let k = 0; k <= 4; k++) { const v = lo + ((hi - lo) * k) / 4; g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${short(v)}</text>`; }
  const step = Math.max(1, Math.ceil(xs.length / 8));
  xs.forEach((v, k) => { if (k % step === 0 || k === xs.length - 1) g += `<text x="${x(k)}" y="${H - 10}" text-anchor="middle" font-size="11" fill="var(--muted)">${v}</text>`; });
  const lines = series.map((s) => `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" ${s.dash ? 'stroke-dasharray="7 5"' : ''} points="${s.ys.map((v, k) => `${x(k).toFixed(1)},${y(v).toFixed(1)}`).join(' ')}"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}" style="width:100%;height:auto;display:block">${g}${lines}</svg>`;
}
export const legend = (series: Series[]) => series.map((s) => `<span class="lg"><svg width="26" height="8" aria-hidden="true"><line x1="0" x2="26" y1="4" y2="4" stroke="${s.color}" stroke-width="3" ${s.dash ? 'stroke-dasharray="6 4"' : ''}/></svg>${s.label}</span>`).join('');
export function downloadCsv(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => (typeof c === 'string' && /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c)).join(',')).join('\r\n') + '\r\n';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
