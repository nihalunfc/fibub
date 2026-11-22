// A tappable timeline. Choose a story (data-set="econ", "freedom" or "constitution" in the lesson, or switch here): tap a
// dot, use the slider or press Play to step through events in order; each event says what happened and why it matters.
// Dates are well-known landmarks; the dots are evenly spaced, not to scale.
import { canvas, row, choice, button, readout, loop, text, title } from '../kit.js';

const SETS = {
  econ: { name: 'India\'s economy since 1951', ev: [
    [1951, 'First Five-Year Plan', 'Planning begins. The first plan puts most money into agriculture and irrigation.'],
    [1956, 'Industrial Policy Resolution', 'The state takes the lead in heavy industry; the private sector works under licences.'],
    [1966, 'Green Revolution begins', 'High-yielding wheat and rice seeds, fertiliser and irrigation lift foodgrain output.'],
    [1969, '14 banks nationalised', 'Large banks come under the government so credit reaches farmers and small business.'],
    [1991, 'New Economic Policy', 'Liberalisation, privatisation and globalisation: licences cut, trade opened, a balance of payments crisis addressed.'],
    [1995, 'India in the WTO', 'India becomes a founding member of the World Trade Organization and lowers import barriers over time.'],
    [2005, 'MGNREGA passed', 'A legal guarantee of up to 100 days of paid work a year for rural households that ask for it.'],
    [2016, 'Insolvency Code', 'A time-bound process for dealing with firms that cannot pay their debts.'],
    [2017, 'GST starts (1 July)', 'One national tax on goods and services replaces many central and state taxes.'],
  ] },
  freedom: { name: 'The road to independence', ev: [
    [1857, 'The Revolt of 1857', 'A wide uprising against the East India Company; afterwards the Crown takes over the rule of India.'],
    [1885, 'Indian National Congress formed', 'Educated Indians gather in Bombay to petition for a larger say in government.'],
    [1905, 'Partition of Bengal', 'Protests against the division grow into the Swadeshi movement and boycott of foreign goods.'],
    [1915, 'Gandhi returns to India', 'He comes back from South Africa with satyagraha, non-violent resistance, as his method.'],
    [1919, 'Jallianwala Bagh', 'Troops fire on a peaceful crowd in Amritsar; anger at this and the Rowlatt Act spreads.'],
    [1920, 'Non-Cooperation Movement', 'Boycott of courts, schools and foreign cloth, together with the Khilafat movement.'],
    [1930, 'Dandi March', 'Gandhi walks to the sea to break the salt law, starting the Civil Disobedience Movement.'],
    [1942, 'Quit India Movement', '"Do or die": a mass call for the British to leave, launched in August.'],
    [1946, 'Cabinet Mission', 'British ministers propose a plan for transferring power; talks end in partition.'],
    [1947, 'Independence (15 August)', 'India becomes independent; Pakistan is created.'],
  ] },
  constitution: { name: 'Making the Constitution', ev: [
    [1946, 'Constituent Assembly meets', 'It first sits on 9 December; Dr Rajendra Prasad later becomes its president.'],
    [1947, 'Drafting Committee set up', 'Formed in August with Dr B. R. Ambedkar as chairman.'],
    [1949, 'Constitution adopted (26 Nov)', 'The Assembly finishes its work after nearly three years.'],
    [1950, 'Comes into force (26 Jan)', 'India becomes a republic; Republic Day is marked every year.'],
    [1973, 'Kesavananda Bharati case', 'The Supreme Court says Parliament may amend the Constitution but not change its basic structure.'],
    [1976, '42nd Amendment', 'Adds "socialist", "secular" and "integrity" to the Preamble and adds the Fundamental Duties.'],
    [1978, '44th Amendment', 'The right to property stops being a Fundamental Right and becomes a legal right.'],
    [1992, '73rd and 74th Amendments', 'Panchayats and municipalities get constitutional status: local self-government.'],
    [2002, '86th Amendment', 'Education for ages 6 to 14 becomes a Fundamental Right (Article 21A).'],
    [2017, '101st Amendment', 'The Goods and Services Tax is made possible.'],
  ] },
};
const wrap = (ctx, s, maxW) => { const out = []; let a = ''; for (const wd of s.split(' ')) { const t = a ? a + ' ' + wd : wd; if (ctx.measureText(t).width > maxW && a) { out.push(a); a = wd; } else a = t; } out.push(a); return out; };
export default function (host) {
  let set = host.dataset.set in SETS ? host.dataset.set : 'econ', i = 0, tm = 0;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 320, label: 'A timeline of events' });
  const c0 = row(host), c = row(host);
  choice(c0, 'Story', [['econ', 'Economy'], ['freedom', 'Freedom struggle'], ['constitution', 'Constitution']], set, (v) => { set = v; i = 0; show(); });
  button(c, '◀ Earlier', () => { i = Math.max(0, i - 1); show(); }); button(c, 'Later ▶', () => { i = Math.min(SETS[set].ev.length - 1, i + 1); show(); });
  const a = loop(host, (dt) => { tm += dt; if (tm > 3) { tm = 0; i = (i + 1) % SETS[set].ev.length; show(); } }, { autoplay: false }); a.button(c);
  const out = readout(host), hits = [];
  const show = () => { const e = SETS[set].ev[i]; out.innerHTML = `<b>${e[0]}: ${e[1]}.</b> ${e[2]}`; cv.redraw(); };
  cv.c.addEventListener('click', (e) => { const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left; let best = 0, bd = 1e9; hits.forEach((hx, k) => { if (Math.abs(hx - x) < bd) { bd = Math.abs(hx - x); best = k; } }); i = best; show(); });
  cv.draw = (ctx, w, h, col) => {
    hits.length = 0; const S = SETS[set], n = S.ev.length; title(ctx, S.name, col);
    const L = 22, R = w - 22, y = 78; ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
    S.ev.forEach((e, k) => { const x = L + (R - L) * k / (n - 1); hits.push(x); const on = k === i, past = k <= i;
      ctx.beginPath(); ctx.arc(x, y, on ? 9 : 5, 0, 7); ctx.fillStyle = on ? col.s[1] : past ? col.s[0] : col.panel; ctx.fill(); ctx.strokeStyle = on ? col.ink : col.s[0]; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.translate(x, y + (on ? 16 : 14)); ctx.rotate(-Math.PI / 3.2); text(ctx, String(e[0]), 0, 0, { color: on ? col.ink : col.muted, size: on ? 11.5 : 10, weight: on ? 700 : 400, align: 'right', fit: false }); ctx.restore(); });
    const e = S.ev[i], y0 = 140; ctx.fillStyle = col.soft; ctx.fillRect(10, y0, w - 20, h - y0 - 10); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(10, y0, w - 20, h - y0 - 10);
    text(ctx, String(e[0]), 20, y0 + 22, { color: col.s[1], size: 22, weight: 800 }); text(ctx, e[1], 20, y0 + 48, { color: col.ink, size: 13.5, weight: 700 });
    ctx.save(); ctx.font = '400 12.5px system-ui'; const ls = wrap(ctx, e[2], w - 44); ctx.restore(); ls.forEach((l, r) => text(ctx, l, 20, y0 + 72 + r * 17, { color: col.ink, size: 12.5 }));
    text(ctx, `${i + 1} of ${n}`, w - 20, y0 + 22, { color: col.muted, size: 11, align: 'right' });
  };
  show();
}
