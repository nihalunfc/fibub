// Row-level security: one report, different people see different rows. Pick who is looking; their role's rule filters the
// Sales table before any slicer or measure runs, so every total, chart and export changes. Someone in two roles sees the
// union (rows allowed by either). Rows are made up.
import { canvas, text, title, row, choice, readout } from '../kit.js';
import { SALES, table, money } from './_biz.js';

const ROLES = {
  admin: { n: 'Head office', rule: '(no rule: all rows)', ok: () => true },
  rideau: { n: 'Rideau manager', rule: '[Store] = "Rideau"', ok: (r) => r.store === 'Rideau' },
  outdoor: { n: 'Outdoor buyer', rule: '[Category] = "Outdoor"', ok: (r) => r.cat === 'Outdoor' },
  both: { n: 'Both roles', rule: 'Rideau OR Outdoor (roles combine)', ok: (r) => r.store === 'Rideau' || r.cat === 'Outdoor' },
};
export default function (host) {
  let role = 'rideau';
  const cv = canvas(host, { aspect: 0.92, max: 400, min: 350, label: 'Sales rows visible to a chosen role' });
  const ctl = row(host);
  choice(ctl, 'View as', Object.entries(ROLES).map(([k, v]) => [k, v.n]), role, (v) => { role = v; cv.redraw(); show(); });
  const out = readout(host);
  const vis = () => SALES.filter(ROLES[role].ok);
  function show() { const v = vis(); out.innerHTML = `<b>${ROLES[role].n}</b> sees <b>${v.length} of 9 rows</b> and a grand total of <b>${money(v.reduce((a, r) => a + r.amt, 0))}</b>. Hidden rows are not greyed out for the real viewer: they simply do not exist for them. Security belongs in roles, never in a slicer.`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'What this person can see', col);
    text(ctx, 'Role rule: ' + ROLES[role].rule, 10, 40, { color: col.s[1], size: 11, weight: 700 });
    const end = table(ctx, col, 8, 50, w - 16, [{ label: 'Month', w: 0.18, f: (r) => r.m }, { label: 'Store', w: 0.25, f: (r) => r.store }, { label: 'Category', w: 0.3, f: (r) => r.cat }, { label: 'Amount', w: 0.27, align: 'right', f: (r) => '$' + r.amt }], SALES, { rowH: 20, style: (r) => (ROLES[role].ok(r) ? 'on' : 'off') });
    ctx.fillStyle = col.soft; ctx.fillRect(8, end + 6, w - 16, 36);
    text(ctx, 'Total Sales (for this viewer)', 14, end + 24, { color: col.muted, size: 11 }); text(ctx, money(vis().reduce((a, r) => a + r.amt, 0)), w - 14, end + 24, { color: col.s[0], size: 17, weight: 800, align: 'right' });
  };
  show(); cv.redraw();
}
