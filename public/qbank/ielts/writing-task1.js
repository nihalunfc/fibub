// IELTS Academic Writing Task 1: 24 original report tasks (line graphs, bar charts, tables, pie charts, processes, maps,
// mixed visuals). All data is invented. Charts are drawn by the small helpers below as self-contained inline SVG
// (no outside fonts or images). Every model answer is written to match its own data exactly.
const COL = ['#1f6feb', '#d4a017', '#2da44e', '#888', '#8e44ad'];
const svg = (H, inner) => `<div style="overflow-x:auto;max-width:100%"><svg viewBox="0 0 560 ${H}" width="100%" style="max-width:560px;min-width:500px" role="img" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">${inner}</svg></div>`;
const tx = (x, y, s, a = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${a}" fill="currentColor" ${extra}>${s}</text>`;
const head = (s) => tx(280, 18, s, 'middle', 'font-weight="bold"');
const legend = (names, y) => {
  const w = names.map((n) => 30 + n.length * 6.6);
  let x = (560 - w.reduce((a, b) => a + b, 0)) / 2, out = '';
  names.forEach((n, i) => { out += `<rect x="${x}" y="${y - 10}" width="12" height="12" fill="${COL[i]}"/>` + tx(x + 17, y, n, 'start'); x += w[i]; });
  return out;
};
const yAxis = (l, t, w, h, max, step, label) => {
  let s = '';
  for (let v = 0; v <= max + 1e-9; v += step) {
    const y = t + h - (v / max) * h;
    s += `<line x1="${l}" x2="${l + w}" y1="${y}" y2="${y}" stroke="currentColor" stroke-opacity="${v ? 0.15 : 0.8}"/>` + tx(l - 6, y + 4, v, 'end');
  }
  return s + `<text transform="rotate(-90)" x="${-(t + h / 2)}" y="14" text-anchor="middle" fill="currentColor">${label}</text>`;
};
const lineChart = ({ t, xs, series, max, step, ylabel, xlabel }) => {
  const l = 52, tp = 34, w = 490, h = 220, n = xs.length, px = (i) => l + 20 + (i * (w - 40)) / (n - 1), py = (v) => tp + h - (v / max) * h;
  let s = head(t) + yAxis(l, tp, w, h, max, step, ylabel);
  xs.forEach((x, i) => { s += tx(px(i), tp + h + 16, x); });
  series.forEach((se, k) => {
    s += `<polyline fill="none" stroke="${COL[k]}" stroke-width="2.5" points="${se.v.map((v, i) => `${px(i)},${py(v)}`).join(' ')}"/>`;
    se.v.forEach((v, i) => { s += `<circle cx="${px(i)}" cy="${py(v)}" r="3.5" fill="${COL[k]}"/>`; });
  });
  return svg(tp + h + 66, s + tx(l + w / 2, tp + h + 34, xlabel) + legend(series.map((x) => x.name), tp + h + 56));
};
const barChart = ({ t, cats, series, max, step, ylabel, xlabel, labels = true }) => {
  const l = 52, tp = 34, w = 490, h = 220, gw = w / cats.length, bw = Math.min(40, (gw * 0.75) / series.length);
  let s = head(t) + yAxis(l, tp, w, h, max, step, ylabel);
  cats.forEach((c, i) => {
    const x0 = l + gw * i + gw / 2 - (bw * series.length) / 2;
    series.forEach((se, k) => {
      const v = se.v[i], bh = (v / max) * h, x = x0 + k * bw;
      s += `<rect x="${x}" y="${tp + h - bh}" width="${bw - 2}" height="${bh}" fill="${COL[k]}"/>`;
      if (labels) s += tx(x + (bw - 2) / 2, tp + h - bh - 4, v, 'middle', 'font-size="10"');
    });
    s += tx(l + gw * i + gw / 2, tp + h + 16, c);
  });
  return svg(tp + h + 66, s + tx(l + w / 2, tp + h + 34, xlabel) + legend(series.map((x) => x.name), tp + h + 56));
};
const pieCharts = ({ t, names, pies }) => {
  const r = 68, cy = 118, xs = pies.length === 2 ? [140, 420] : [95, 280, 465];
  let s = head(t);
  pies.forEach((p, pi) => {
    const cx = xs[pi], tot = p.v.reduce((a, b) => a + b, 0);
    s += tx(cx, 40, p.label, 'middle', 'font-weight="bold"');
    let a0 = -Math.PI / 2;
    p.v.forEach((v, i) => {
      const a1 = a0 + (v / tot) * 2 * Math.PI, am = (a0 + a1) / 2, big = a1 - a0 > Math.PI ? 1 : 0;
      s += `<path d="M${cx},${cy} L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 ${big} 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} Z" fill="${COL[i]}" stroke="#fff" stroke-width="1.5"/>`;
      const lx = cx + (r + 16) * Math.cos(am), ly = cy + (r + 16) * Math.sin(am) + 4;
      s += tx(lx, ly, v + '%', Math.cos(am) > 0.3 ? 'start' : Math.cos(am) < -0.3 ? 'end' : 'middle', 'font-size="12"');
      a0 = a1;
    });
  });
  return svg(232, s + legend(names, 218));
};
const table = (cap, headRow, rows) => `<table style="border-collapse:collapse;max-width:560px;width:100%;font-size:14px;margin:6px 0"><caption style="font-weight:bold;text-align:left;padding:4px 0">${cap}</caption><thead><tr>${headRow.map((h) => `<th style="border:1px solid currentColor;padding:4px 8px;text-align:center">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td style="border:1px solid currentColor;padding:4px 8px;text-align:${i ? 'center' : 'left'}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
let mk_id = 0;
const flow = (t, steps, cols, note = '') => {
  const gx = 30, gy = 32, bh = 66, bw = Math.floor((520 - (cols - 1) * gx) / cols), rows = Math.ceil(steps.length / cols), top = 34, left = 20, id = 'ar' + ++mk_id;
  const pos = (i) => { const row = Math.floor(i / cols), c = row % 2 ? cols - 1 - (i % cols) : i % cols; return { row, x: left + c * (bw + gx), y: top + row * (bh + gy) }; };
  let s = head(t) + `<defs><marker id="${id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor"/></marker></defs>`;
  steps.forEach((st, i) => {
    const p = pos(i), lines = st.split('|');
    s += `<rect x="${p.x}" y="${p.y}" width="${bw}" height="${bh}" rx="6" fill="currentColor" fill-opacity="0.06" stroke="currentColor"/>`;
    lines.forEach((ln, k) => { s += tx(p.x + bw / 2, p.y + bh / 2 - (lines.length - 1) * 7 + 4 + k * 14, ln, 'middle', 'font-size="11"'); });
    if (i < steps.length - 1) {
      const q = pos(i + 1);
      if (q.row === p.row) { const y = p.y + bh / 2, fx = p.row % 2 ? p.x : p.x + bw, tx2 = p.row % 2 ? q.x + bw : q.x; s += `<line x1="${fx}" y1="${y}" x2="${tx2}" y2="${y}" stroke="currentColor" stroke-width="1.5" marker-end="url(#${id})"/>`; }
      else s += `<line x1="${p.x + bw / 2}" y1="${p.y + bh}" x2="${p.x + bw / 2}" y2="${q.y}" stroke="currentColor" stroke-width="1.5" marker-end="url(#${id})"/>`;
    }
  });
  const H = top + rows * bh + (rows - 1) * gy + (note ? 36 : 18);
  return svg(H, s + (note ? tx(280, H - 10, note, 'middle', 'font-style="italic"') : ''));
};
const mapSvg = (t, leftT, rightT, before, after) => {
  const panel = (x0, feats) => {
    let s = `<rect x="${x0}" y="44" width="260" height="240" fill="none" stroke="currentColor"/>`;
    feats.forEach((f) => {
      if (f.line) { s += `<line x1="${x0 + f.line[0]}" y1="${44 + f.line[1]}" x2="${x0 + f.line[2]}" y2="${44 + f.line[3]}" stroke="currentColor" stroke-width="${f.dash ? 2 : 5}" ${f.dash ? 'stroke-dasharray="5 4"' : 'stroke-opacity="0.45"'}/>`; if (f.l) s += tx(x0 + f.lx, 44 + f.ly, f.l, 'middle', 'font-size="10"'); return; }
      s += `<rect x="${x0 + f.x}" y="${44 + f.y}" width="${f.w}" height="${f.h}" fill="${f.c}" fill-opacity="0.3" stroke="currentColor" stroke-opacity="0.6"/>`;
      const ls = f.l.split('|');
      ls.forEach((ln, k) => { s += tx(x0 + f.x + f.w / 2, 44 + f.y + f.h / 2 - (ls.length - 1) * 6 + 4 + k * 12, ln, 'middle', 'font-size="10"'); });
    });
    return s;
  };
  return svg(300, head(t) + tx(145, 38, leftT, 'middle', 'font-weight="bold"') + tx(415, 38, rightT, 'middle', 'font-weight="bold"') + tx(540, 38, 'N &#8593;', 'end', 'font-size="11"') + panel(15, before) + panel(285, after));
};

const TAIL = ' Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.';
const SUBMAP = (k) => (/ and /.test(k) ? 'mixed' : k.startsWith('line') ? 'line' : k.startsWith('bar') ? 'bar' : k.startsWith('process') ? 'process' : k.startsWith('pie') ? 'pie' : k);
const mk = (n, level, sub, sentence, visual, model, checklist) => ({
  id: 'wt1-' + String(n).padStart(2, '0'), type: 'open', level, exams: ['academic'], facets: { skill: 'writing', qtype: 'task1' }, sub: SUBMAP(sub),
  q: `<p>You should spend about 20 minutes on this task.</p><p>${sentence}${TAIL}</p>${visual}`,
  model: model.map((p) => `<p>${p}</p>`).join(''), checklist, timers: { minutes: 20, words: 150 },
});

const G = '#2da44e', B = '#1f6feb', Y = '#d4a017', K = '#888';

export default {
  topic: 'writing-task1',
  items: [
    // ---------- line graphs (5) ----------
    mk(1, 2, 'line graph', 'The line graph below shows the percentage of households with internet access in three countries between 2000 and 2020.',
      lineChart({ t: 'Households with internet access (%)', xs: [2000, 2005, 2010, 2015, 2020], series: [{ name: 'Country A', v: [20, 45, 70, 85, 92] }, { name: 'Country B', v: [10, 25, 50, 75, 90] }, { name: 'Country C', v: [5, 10, 20, 35, 55] }], max: 100, step: 20, ylabel: 'Percentage of households', xlabel: 'Year' }),
      [`The line graph compares the proportion of households that were connected to the internet in three countries over a twenty-year period, from 2000 to 2020.`,
        `Overall, internet access rose in every country. Country A was the most connected throughout, but Country B closed the gap almost completely, while Country C remained the least connected.`,
        `In 2000, 20% of households in Country A were online, compared with 10% in Country B and only 5% in Country C. Country A then grew rapidly to reach 70% in 2010 and finished at 92% in 2020. Country B started more slowly, at 25% in 2005, but its growth accelerated, passing 50% in 2010 and reaching 90% by the end of the period, just two percentage points behind Country A.`,
        `Country C progressed far more gradually. Its figure doubled to 10% in 2005 and reached 20% in 2010, before climbing more steeply to 35% in 2015 and 55% in 2020. Even so, only just over half of its households had access at the end, compared with roughly nine in ten in the other two countries.`],
      ['Intro paraphrases the task (households, internet access, three countries, 2000 to 2020)', 'Overview says all three rose, A stayed highest and C stayed lowest', 'Overview has no figures in it', 'Figures for 2000 and 2020 are given for all three countries', 'B is shown catching up with A (50% in 2010, 90% in 2020)', 'Comparisons use words such as "whereas" and "compared with"', 'No opinion or reasons added']),
    mk(2, 2, 'line graph', 'The line graph below shows the weekly sales of ice cream and hot chocolate at a seaside kiosk over one year.',
      lineChart({ t: 'Weekly sales at a seaside kiosk', xs: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'], series: [{ name: 'Ice cream', v: [20, 35, 80, 120, 70, 25] }, { name: 'Hot chocolate', v: [110, 85, 40, 15, 45, 95] }], max: 140, step: 20, ylabel: 'Units sold per week', xlabel: 'Month' }),
      [`The line graph illustrates how many portions of ice cream and cups of hot chocolate a seaside kiosk sold each week at two-monthly intervals during one year.`,
        `Overall, the two products followed opposite seasonal patterns. Ice cream sales peaked in the summer months, whereas hot chocolate sales were highest in winter and lowest in summer.`,
        `Ice cream began the year at only 20 units a week in January and rose gently to 35 in March. Sales then jumped to 80 in May and reached a peak of 120 units in July. After that they fell back to 70 in September and 25 in November, almost the same level as at the start.`,
        `Hot chocolate showed a mirror image. It started at 110 units in January, which was 90 more than ice cream, and declined steadily to 85 in March and 40 in May. It bottomed out at just 15 units in July, exactly when ice cream was at its best. It then recovered to 45 in September and 95 in November. The two lines crossed twice, between March and May and again between September and November.`],
      ['Intro says what was sold, where, and over what period', 'Overview states the opposite seasonal patterns (summer peak for ice cream, winter peak for hot chocolate)', 'Peak of 120 (ice cream, July) and low of 15 (hot chocolate, July) are both given', 'Starting and ending figures are given for both products', 'The two lines crossing is mentioned', 'Time words such as "then", "after that" and "by November" are used', 'No reasons (weather) stated as fact']),
    mk(3, 3, 'line graph', 'The line graph below shows the number of passengers, in millions, who used three airports between 1995 and 2015.',
      lineChart({ t: 'Passengers using three airports', xs: [1995, 2000, 2005, 2010, 2015], series: [{ name: 'Airport X', v: [30, 34, 40, 38, 36] }, { name: 'Airport Y', v: [18, 22, 30, 41, 52] }, { name: 'Airport Z', v: [25, 24, 22, 19, 15] }], max: 60, step: 10, ylabel: 'Passengers (millions)', xlabel: 'Year' }),
      [`The graph compares passenger numbers, in millions, at three airports over a twenty-year period beginning in 1995.`,
        `Overall, traffic at Airport Y grew strongly and made it the busiest of the three by the end, whereas Airport Z declined steadily. Airport X rose at first but then slipped back slightly.`,
        `In 1995, Airport X was the busiest with 30 million passengers, followed by Airport Z with 25 million and Airport Y with only 18 million. Airport X reached a peak of 40 million in 2005 before easing to 38 million in 2010 and 36 million in 2015.`,
        `Airport Y, in contrast, grew in every period, almost tripling from 18 million to 52 million. It overtook Airport Z by 2005, when it handled 30 million passengers against 22 million, and passed Airport X by 2010, with 41 million against 38 million. Airport Z lost custom steadily, falling from 25 million to 15 million, so by 2015 it served less than a third of the passengers using Airport Y. In other words, the ranking of the three airports was almost reversed over the twenty years.`],
      ['Intro paraphrases the task (passengers in millions, three airports, 1995 to 2015)', 'Overview: Y grew most, Z fell, X rose then dipped', 'Y overtaking Z and then X is reported with the years', 'X peak (40 million in 2005) is mentioned', 'Start and end figures are given for all three airports', 'Verbs vary (rose, grew, fell, eased, overtook)', 'Units (millions) are included with the figures']),
    mk(4, 3, 'line graph', 'The line graph below shows the unemployment rate in the northern and southern regions of one country between 2008 and 2020.',
      lineChart({ t: 'Unemployment rate by region', xs: [2008, 2010, 2012, 2014, 2016, 2018, 2020], series: [{ name: 'North', v: [4, 8, 10, 9, 7, 5, 6] }, { name: 'South', v: [6, 9, 7, 5, 4, 4, 8] }], max: 12, step: 2, ylabel: 'Unemployment rate (%)', xlabel: 'Year' }),
      [`The line graph compares the percentage of people without work in the northern and southern regions of one country from 2008 to 2020.`,
        `Overall, both regions saw unemployment rise after 2008, fall for several years and then rise again at the end of the period. The northern peak came later and was higher than the southern one.`,
        `In the North, unemployment doubled from 4% in 2008 to 8% in 2010 and reached its highest point of 10% in 2012. It then declined steadily, to 9% in 2014, 7% in 2016 and 5% in 2018, before edging up to 6% in 2020.`,
        `The South began at a higher level, 6%, and peaked at 9% in 2010, two years earlier than the North. The rate then fell to 7% in 2012 and 5% in 2014, and stayed at a low of 4% in both 2016 and 2018. As a result, the South had the lower rate from 2012 to 2018. However, it then doubled to 8% in 2020, overtaking the North, which stood at 6%.`],
      ['Intro paraphrases the task (unemployment rate, two regions, 2008 to 2020)', 'Overview mentions the shared pattern: rise, fall, then rise again', 'Overview notes that the North peaked later and higher', 'Peaks are given with years (North 10% in 2012, South 9% in 2010)', 'The period when the South was lower (2012 to 2018) and the 2020 reversal are reported', 'Percentages carry the % sign', 'No explanation of why unemployment changed']),
    mk(5, 3, 'line graph', 'The line graph below shows the number of students, in thousands, enrolled in three types of course at one college between 2010 and 2020.',
      lineChart({ t: 'Students enrolled by type of course', xs: [2010, 2012, 2014, 2016, 2018, 2020], series: [{ name: 'Online', v: [2, 4, 8, 15, 24, 38] }, { name: 'On campus', v: [30, 31, 29, 27, 25, 22] }, { name: 'Evening', v: [12, 12, 13, 11, 12, 12] }], max: 40, step: 10, ylabel: 'Students (thousands)', xlabel: 'Year' }),
      [`The line graph shows how many thousand students enrolled in online, on-campus and evening courses at a college over a ten-year period from 2010.`,
        `Overall, online enrolment rose dramatically, on-campus enrolment declined gradually, and evening courses stayed almost unchanged. By the end of the period online learning had become the most popular option.`,
        `In 2010, on-campus courses were by far the largest, with 30,000 students, compared with 12,000 in evening classes and only 2,000 online. The on-campus figure peaked at 31,000 in 2012 and then fell steadily, to 27,000 in 2016 and 22,000 in 2020.`,
        `Online enrolment moved in the opposite direction. It doubled to 4,000 in 2012, reached 15,000 in 2016 and then accelerated to 24,000 in 2018 and 38,000 in 2020. It overtook on-campus study between 2018 and 2020, when 25,000 students were still on campus. Evening classes hardly changed at all, fluctuating between 11,000 and 13,000 throughout. Consequently, by 2020 online students were close to the number of on-campus and evening students combined, 38,000 against 34,000, which shows how far the balance had shifted.`],
      ['Intro paraphrases the task and notes the figures are in thousands', 'Overview contrasts the rise (online), fall (on campus) and stability (evening)', 'Online overtaking on-campus is reported with the correct period (2018 to 2020)', 'Figures for 2010 and 2020 are given for all three course types', 'Evening range (11,000 to 13,000) described as stable', 'Different verbs and adverbs used for different speeds of change', 'No opinion about online learning']),
    // ---------- bar charts (5) ----------
    mk(6, 2, 'bar chart', 'The bar chart below shows the percentage of adults in four age groups who exercised at least three times a week in one country in 2005 and 2020.',
      barChart({ t: 'Adults exercising three or more times a week (%)', cats: ['18-29', '30-44', '45-59', '60+'], series: [{ name: '2005', v: [40, 32, 25, 18] }, { name: '2020', v: [50, 38, 34, 30] }], max: 60, step: 10, ylabel: 'Percentage of adults', xlabel: 'Age group' }),
      [`The bar chart compares the proportion of adults in four age groups who took regular exercise, defined as three or more times a week, in 2005 and 2020.`,
        `Overall, exercise became more common in every age group. Younger adults were the most active in both years, but the biggest improvement came among people aged 60 and over, so the gap between the age groups narrowed.`,
        `In 2005, 40% of 18 to 29 year-olds exercised regularly, compared with 32% of those aged 30 to 44, 25% of those aged 45 to 59 and just 18% of the oldest group. By 2020, the youngest group had risen to 50%, which was still the highest figure on the chart.`,
        `The smallest change was among people aged 30 to 44, whose figure went up by 6 percentage points to 38%. The 45 to 59 group improved by 9 points to 34%. The most striking rise was in the 60-plus group, from 18% to 30%, an increase of 12 points. Consequently, the difference between the youngest and oldest groups shrank from 22 points to 20.`],
      ['Intro paraphrases the task and explains what "exercise" means in the chart', 'Overview: all groups rose, youngest highest, oldest rose most', 'Both years are given for all four age groups', 'Size of changes calculated correctly (6, 9, 10 and 12 points)', 'The narrowing gap between youngest and oldest is noticed', 'Percentages and "percentage points" used correctly', 'No reasons for the increase added']),
    mk(7, 3, 'bar chart', 'The bar chart below shows the average number of hours per day that men and women in one country spent on four activities.',
      barChart({ t: 'Average hours per day on four activities', cats: ['Paid work', 'Housework', 'Leisure', 'Sleep'], series: [{ name: 'Men', v: [7, 1.5, 4, 7.5] }, { name: 'Women', v: [5, 3.5, 3, 7.5] }], max: 8, step: 2, ylabel: 'Hours per day', xlabel: 'Activity' }),
      [`The bar chart compares the average number of hours that men and women in one country spent each day on paid work, housework, leisure and sleep.`,
        `Overall, men devoted more time to paid work and leisure, while women spent considerably longer on housework. Sleep was the only activity in which the two groups were identical.`,
        `Paid work took up the most time for men, at 7 hours a day, which was 2 hours more than the 5 hours recorded for women. Men also enjoyed an hour more leisure than women, at 4 hours against 3.`,
        `The pattern was reversed for housework. Women spent an average of 3.5 hours a day on domestic tasks, more than twice the 1.5 hours that men did. Sleep, meanwhile, was the largest activity for women and a close second for men, with both groups averaging 7.5 hours. In total, therefore, the men's selected activities added up to about 20 hours a day and the women's to about 19. This means that, although men worked longer for pay, the gap in total time spent on these tasks was small, because women's longer domestic work offset much of the difference.`],
      ['Intro paraphrases the task (hours per day, four activities, men and women)', 'Overview says who spent more on work and leisure, who on housework, and that sleep was equal', 'All eight figures are covered or grouped sensibly', 'Differences are quantified (2 hours, 1 hour, "more than twice")', 'Sleep is reported as the same for both (7.5 hours)', 'Numbers include units (hours)', 'No stereotypes or opinions added']),
    mk(8, 2, 'bar chart', 'The bar chart below shows the number of tourists, in thousands, who visited five islands in summer and winter in one year.',
      barChart({ t: 'Tourists visiting five islands', cats: ['Island A', 'Island B', 'Island C', 'Island D', 'Island E'], series: [{ name: 'Summer', v: [120, 90, 60, 45, 30] }, { name: 'Winter', v: [40, 55, 50, 20, 25] }], max: 140, step: 20, ylabel: 'Tourists (thousands)', xlabel: 'Island' }),
      [`The bar chart compares how many thousand tourists visited each of five islands during the summer and winter seasons of one year.`,
        `Overall, every island attracted more visitors in summer than in winter, but the size of the seasonal gap varied greatly. Island A was the most popular in summer, whereas Island B drew the most tourists in winter.`,
        `In summer, Island A led with 120,000 visitors, followed by Island B with 90,000 and Island C with 60,000. Islands D and E were much quieter, with 45,000 and 30,000 respectively. In winter, however, the order changed: Island A fell dramatically to 40,000, a drop of 80,000, and ranked only third.`,
        `Island B was the busiest in winter with 55,000 tourists, closely followed by Island C with 50,000. These two islands had the smallest seasonal differences among the larger destinations. Island D lost more than half of its summer visitors, dropping to 20,000, while Island E was the least affected, slipping by just 5,000 to 25,000. Taken together, the five islands received about 345,000 visitors in summer but only 190,000 in winter, which confirms how strongly the season affected tourism.`],
      ['Intro paraphrases the task (tourists in thousands, five islands, summer and winter)', 'Overview says summer was higher everywhere and mentions the most and least seasonal islands', 'Island A summer 120,000 and winter 40,000 are both given', 'Winter ranking (B, C, A, E, D) is reflected', 'Gaps are quantified (80,000 for A, 5,000 for E)', 'Figures are written in thousands consistently', 'No reasons for seasonal change added']),
    mk(9, 4, 'bar chart', 'The bar chart below shows the percentage of electricity generated from renewable sources in four countries in 2000, 2010 and 2020.',
      barChart({ t: 'Electricity from renewable sources (%)', cats: ['Country P', 'Country Q', 'Country R', 'Country S'], series: [{ name: '2000', v: [5, 20, 2, 35] }, { name: '2010', v: [12, 22, 8, 33] }, { name: '2020', v: [30, 25, 18, 28] }], max: 40, step: 10, ylabel: 'Share of electricity (%)', xlabel: 'Country' }),
      [`The bar chart compares the share of electricity that four countries generated from renewable sources in 2000, 2010 and 2020.`,
        `Overall, the share rose sharply in Countries P and R, rose slightly in Country Q and declined in Country S. As a result, the country that relied most on renewables changed over the two decades.`,
        `In 2000, Country S had the highest share, at 35%, followed by Country Q on 20%. Countries P and R were far behind, with only 5% and 2% respectively. Country S then slipped steadily, to 33% in 2010 and 28% in 2020, while Country Q edged up from 20% to 22% and finally 25%.`,
        `The most dramatic growth occurred in Country P, where the figure more than doubled to 12% in 2010 and then jumped to 30% in 2020, taking it above Country S for the first time. Country R followed a similar path from a lower base, increasing from 2% to 8% and then to 18%, a nine-fold rise over the period, although it still had the smallest share in 2020.`],
      ['Intro paraphrases the task (share of electricity, renewables, four countries, three years)', 'Overview groups countries: P and R sharp rise, Q slight rise, S fall', 'Overview mentions that S started highest but P finished highest', 'All three years are covered for at least the key countries', 'The moment P passes S (2020) is reported', 'Comparative language is accurate ("more than doubled", "nine-fold")', 'No numbers in the overview']),
    mk(10, 3, 'bar chart', 'The bar chart below shows the number of cars sold, in thousands, by fuel type in one country in 2016 and 2020.',
      barChart({ t: 'Cars sold by fuel type', cats: ['Petrol', 'Diesel', 'Hybrid', 'Electric'], series: [{ name: '2016', v: [520, 410, 60, 10] }, { name: '2020', v: [380, 190, 210, 95] }], max: 600, step: 100, ylabel: 'Cars sold (thousands)', xlabel: 'Fuel type' }),
      [`The bar chart illustrates how many thousand cars of four fuel types were sold in one country in 2016 and in 2020.`,
        `Overall, sales of petrol and diesel cars fell, while sales of hybrid and electric cars rose considerably. Petrol remained the most popular fuel type, but the gap between it and the newer technologies narrowed greatly.`,
        `In 2016, petrol cars dominated with 520,000 sales, followed by diesel with 410,000. Hybrid and electric models were minor, at 60,000 and just 10,000 respectively. By 2020, petrol sales had dropped by 140,000 to 380,000, and diesel sales had more than halved to 190,000.`,
        `Meanwhile, hybrids experienced the strongest absolute growth, rising from 60,000 to 210,000, which meant that they overtook diesel as the second most popular choice. Electric cars started from the lowest base but increased nearly tenfold, to 95,000. Even so, electric vehicles still accounted for the smallest number of sales in 2020. Total sales fell from 1,000,000 cars in 2016 to 875,000 in 2020, so the market as a whole shrank slightly while its make-up changed a great deal.`],
      ['Intro paraphrases the task (cars sold in thousands, four fuel types, 2016 and 2020)', 'Overview: petrol and diesel down, hybrid and electric up, petrol still first', 'Hybrid overtaking diesel is noticed', 'Figures for both years are given for every fuel type', 'Calculations are accurate (petrol down 140,000; diesel more than halved)', 'Units (thousands) are used consistently', 'No predictions about the future']),
    // ---------- tables (4) ----------
    mk(11, 2, 'table', 'The table below shows the average monthly spending, in euros, of a household on four items in three cities.',
      table('Average monthly household spending (€)', ['City', 'Food', 'Housing', 'Transport', 'Leisure'], [['Northfield', 420, 650, 180, 120], ['Eastbay', 380, 820, 150, 160], ['Westport', 450, 540, 210, 90]]),
      [`The table compares how much a typical household spent each month on food, housing, transport and leisure in three cities, Northfield, Eastbay and Westport.`,
        `Overall, housing was the biggest expense in every city, and the differences between cities were largest for this item. Eastbay households spent the most in total, while Westport households spent the least.`,
        `Housing costs ranged from €540 in Westport to €650 in Northfield and €820 in Eastbay, the highest figure in the table. Eastbay residents therefore spent about €1,510 a month across the four items, compared with €1,370 in Northfield and €1,290 in Westport.`,
        `For the other items the spending was much lower and more similar. Westport had the highest food bill, at €450, and the highest transport cost, at €210, although it spent only €90 on leisure, the smallest amount for that item. Eastbay households spent the most on leisure, at €160, but the least on food and transport, at €380 and €150. Northfield ranked in the middle for every item. In general, therefore, no single city was the most expensive for every item.`],
      ['Intro paraphrases the task (monthly spending, four items, three cities)', 'Overview says housing was the largest item everywhere', 'Overview names the highest and lowest spending city overall', 'Highest and lowest value is given for each item', 'Totals (if used) are added up correctly: 1,370, 1,510 and 1,290', 'Currency symbol or "euros" is used with figures', 'Not every number is copied: data is grouped and selected']),
    mk(12, 3, 'table', 'The table below shows the number of students, in thousands, enrolled in four subject areas at one university in 2000, 2010 and 2020.',
      table('University enrolment by subject (thousands of students)', ['Subject', '2000', '2010', '2020'], [['Engineering', 8, 11, 15], ['Business', 12, 14, 13], ['Arts', 9, 7, 5], ['Medicine', 3, 4, 6]]),
      [`The table presents the number of students, in thousands, who studied engineering, business, arts and medicine at one university in 2000, 2010 and 2020.`,
        `Overall, engineering and medicine became more popular, arts declined steadily and business stayed fairly stable. Total enrolment grew from 32,000 to 39,000 over the two decades.`,
        `Business was the largest subject in 2000, with 12,000 students, ahead of arts on 9,000, engineering on 8,000 and medicine on only 3,000. Business then rose to 14,000 in 2010 before slipping back to 13,000 in 2020, so it remained within a narrow range throughout.`,
        `Engineering grew at every stage, from 8,000 to 11,000 and then 15,000, which pushed it ahead of business to become the most popular subject by 2020. Medicine also doubled, from 3,000 to 6,000. Arts, in contrast, lost students in both periods, falling from 9,000 to 7,000 and finally to 5,000, which made it the second smallest subject, just below medicine on 6,000. By 2020 the four subjects were therefore ranked engineering, business, medicine and arts, a very different order from 2000, when business had led and medicine had come last.`],
      ['Intro paraphrases the task (students in thousands, four subjects, three years)', 'Overview: engineering and medicine up, arts down, business broadly stable', 'Engineering overtaking business is reported', 'Total enrolment (32,000 to 39,000) is correct if mentioned', 'Medicine doubling (3,000 to 6,000) is correct', 'Arts is described as falling at both stages', 'No explanation for the changes']),
    mk(13, 3, 'table', 'The table below shows the average number of minutes per day that people of four age groups spent on four mobile phone activities.',
      table('Minutes per day on mobile phone activities', ['Age group', 'Calls', 'Messaging', 'Video', 'Games'], [['16-24', 12, 55, 95, 40], ['25-44', 25, 45, 60, 20], ['45-64', 30, 30, 35, 10], ['65+', 28, 15, 12, 5]]),
      [`The table shows how many minutes a day people in four age groups spent on calls, messaging, video and games on their mobile phones.`,
        `Overall, younger people spent far more time on their phones than older people, mainly because of video and messaging. Calls were the only activity for which older groups matched or exceeded the youngest group.`,
        `The 16 to 24 group used their phones for about 200 minutes a day, with video the largest activity at 95 minutes, followed by messaging at 55 minutes and games at 40. They made the fewest calls, at only 12 minutes. The 25 to 44 group spent about 150 minutes in total, with video again first at 60 minutes and messaging at 45.`,
        `In the older groups, the pattern was quite different. People aged 45 to 64 spent about 105 minutes, with calls and messaging equal at 30 minutes each and video at 35. The 65-plus group used their phones least, at about 60 minutes. Calls, at 28 minutes, were their main activity, more than twice the time they spent on video, at 12, or messaging, at 15.`],
      ['Intro paraphrases the task (minutes per day, four activities, four age groups)', 'Overview: young use phones most for video and messaging; calls are the exception', 'Totals per age group are about right (202, 150, 105, 60)', 'Calls in the oldest groups compared with the youngest (12 against 30 and 28)', 'The main activity is identified for each age group', 'Numbers include units (minutes)', 'Data is grouped, not listed cell by cell']),
    mk(14, 4, 'table', 'The table below shows the percentage of waste that was recycled in four towns in 2022, by type of material.',
      table('Waste recycled by material, 2022 (%)', ['Town', 'Glass', 'Paper', 'Plastic'], [['Ashby', 78, 65, 30], ['Brook', 60, 70, 42], ['Clifton', 85, 55, 25], ['Dalton', 50, 48, 38]]),
      [`The table compares the percentage of glass, paper and plastic waste that was recycled in four towns in 2022.`,
        `Overall, glass was the most widely recycled material in three of the four towns, paper was in first place in the remaining one, and plastic had the lowest recycling rate in every town.`,
        `Clifton had the highest glass recycling rate, at 85%, followed by Ashby on 78%, whereas Dalton recorded the lowest, at 50%. Brook was the exception, because its paper rate of 70% was higher than its glass rate of 60%, and it was also the best performer for paper overall. Ashby came second for paper, with 65%, and Dalton had the lowest figure, at 48%.`,
        `Plastic recycling was much weaker everywhere. Brook led with 42%, followed by Dalton on 38% and Ashby on 30%, while Clifton recycled only a quarter of its plastic. Interestingly, Clifton therefore had the biggest gap between its best and worst materials, at 60 percentage points, whereas Dalton, with figures between 38% and 50%, was the most consistent town.`],
      ['Intro paraphrases the task (percentage recycled, three materials, four towns, 2022)', 'Overview: glass top in three towns, paper top in Brook, plastic always lowest', 'Highest and lowest town is named for each material', 'Brook is identified as the exception', 'Clifton gap calculated correctly (85 minus 25 is 60 points)', 'Percentages and "percentage points" are used correctly', 'No explanation of why towns recycle differently']),
    // ---------- pie charts (3) ----------
    mk(15, 2, 'pie chart', 'The pie charts below show how a typical household in one country used energy in 1990 and in 2020.',
      pieCharts({ t: 'Household energy use', names: ['Heating', 'Water heating', 'Appliances', 'Lighting and cooking'], pies: [{ label: '1990', v: [55, 20, 10, 15] }, { label: '2020', v: [45, 15, 30, 10] }] }),
      [`The pie charts compare the way a typical household in one country used energy for four purposes in 1990 and in 2020.`,
        `Overall, heating accounted for the biggest share of energy in both years, although its importance declined. The most significant change was the growth of appliances, which became far more important, while the other two uses fell slightly.`,
        `In 1990, more than half of household energy, 55%, went on heating, with water heating in second place at 20%. Lighting and cooking took 15%, and appliances used only 10%, the smallest share.`,
        `By 2020, heating had fallen by 10 percentage points to 45%, but it still came first. The share used by appliances tripled to 30%, which pushed water heating, now on 15%, down to third place. Lighting and cooking also decreased, from 15% to 10%, making it the smallest category in the later year. In other words, households used proportionally less energy to keep warm and more to power their devices. Together, heating and water heating still accounted for 60% of the total in 2020, against 75% in 1990, so warmth remained the main use of energy.`],
      ['Intro paraphrases the task (household energy, four uses, 1990 and 2020)', 'Overview: heating biggest in both years but smaller; appliances grew most', 'Appliances tripling (10% to 30%) is stated correctly', 'Heating 55% to 45% and water heating 20% to 15% are given', 'Changes in rank are noticed (water heating moves to third)', 'Percentages add up logically and are never exaggerated', 'No reasons given for the changes']),
    mk(16, 3, 'pie chart', 'The pie charts below show the sources of electricity in one country in 2000 and in 2020.',
      pieCharts({ t: 'Sources of electricity', names: ['Coal', 'Gas', 'Nuclear', 'Renewables'], pies: [{ label: '2000', v: [50, 25, 15, 10] }, { label: '2020', v: [20, 30, 10, 40] }] }),
      [`The pie charts illustrate the proportion of a country's electricity that came from four different sources in 2000 and in 2020.`,
        `Overall, coal was the dominant source at the start of the period but lost most of its importance, while renewable sources grew from a minor role to become the leading source of power by 2020.`,
        `In 2000, half of the country's electricity was generated from coal. Gas was the next largest source, at 25%, followed by nuclear power at 15%, and renewables supplied just 10%.`,
        `Twenty years later the picture had changed completely. Renewables had quadrupled to 40%, giving them the largest share, and gas had risen slightly to 30%. Coal fell sharply, by 30 percentage points, to only 20%, and nuclear power also declined, from 15% to 10%, which made it the smallest source in 2020. Fossil fuels combined, coal and gas, therefore dropped from 75% to 50% of the total. Renewables and nuclear power, which together supplied 25% in 2000, provided 50% in 2020, so half of the electricity no longer came from burning fuel.`],
      ['Intro paraphrases the task (electricity, four sources, 2000 and 2020)', 'Overview: coal dominated at the start, renewables led by the end', 'Renewables quadrupling (10% to 40%) is stated correctly', 'Coal 50% to 20% is reported as the biggest fall', 'Gas rising slightly and nuclear falling are both mentioned', 'If coal and gas are combined, 75% and 50% are correct', 'No comment on whether the change is good or bad']),
    mk(17, 2, 'pie chart', 'The pie charts below show how students at one school travelled to school in 2005 and in 2020.',
      pieCharts({ t: 'How students travel to school', names: ['Walk', 'Bus', 'Car', 'Cycle'], pies: [{ label: '2005', v: [40, 30, 20, 10] }, { label: '2020', v: [25, 25, 40, 10] }] }),
      [`The pie charts compare the methods of transport that students at one school used to get to school in 2005 and in 2020.`,
        `Overall, the car became the most common way to travel, replacing walking, which was the most popular method in 2005. The proportion of students cycling did not change.`,
        `In 2005, walking was the most common option, used by 40% of students, followed by the bus on 30% and the car on 20%. Cycling was the least popular, at 10%.`,
        `By 2020, the proportion of students walking had fallen by 15 percentage points to 25%, and bus travel had also declined slightly, to the same level of 25%. In contrast, the share of students arriving by car doubled from 20% to 40%, making it the leading method. Cycling remained the minority choice at 10% in both years. In short, children relied less on walking and public transport and more on being driven. Walking and cycling together accounted for 50% of journeys in 2005 but only 35% in 2020, which shows how much the pattern of travel had altered over fifteen years.`],
      ['Intro paraphrases the task (how students travelled, two years)', 'Overview: car now most common, walking down, cycling unchanged', 'Car doubling (20% to 40%) is correct', 'Walking 40% to 25% and bus 30% to 25% are given', 'Cycling is described as unchanged at 10%', 'The 2005 ranking and the 2020 ranking are both clear', 'No reasons (parents, safety) given as fact']),
    // ---------- processes (3) ----------
    mk(18, 2, 'process (natural)', 'The diagram below shows the life cycle of a butterfly. Summarise the information by selecting and reporting the main features.',
      flow('The life cycle of a butterfly', ['1. Female lays eggs|on a leaf', '2. Eggs hatch after about|a week: a caterpillar|(larva) comes out', '3. Caterpillar eats leaves|for 2 to 3 weeks|and grows', '4. Caterpillar hangs from a|twig and forms a|chrysalis (10 days)', '5. Adult butterfly comes|out, dries its wings|and flies off'], 3, 'The adult mates and the female lays eggs: the cycle starts again.'),
      [`The diagram shows the stages in the life cycle of a butterfly, from the laying of eggs to the emergence of the adult insect.`,
        `Overall, the process has five stages and forms a continuous cycle, since the adult butterfly produces eggs that start the process again.`,
        `The cycle begins when a female butterfly lays her eggs on a leaf. After about a week, the eggs hatch and a small caterpillar, which is known as a larva, comes out. The caterpillar then spends the next two to three weeks eating leaves, and it grows considerably during this time.`,
        `Once it is fully grown, the caterpillar hangs from a twig and forms a hard case called a chrysalis. It remains inside for around ten days while its body changes completely. Finally, an adult butterfly emerges from the chrysalis, dries its wings and flies away. The adult then mates, and the female lays new eggs on a leaf, so the whole cycle starts once more. In total, the journey from egg to flying adult takes roughly five weeks, and most of this time is spent as a caterpillar or inside the chrysalis.`],
      ['Intro paraphrases the task (life cycle of a butterfly, from eggs to adult)', 'Overview says there are five stages and that it is a cycle', 'Stages are in the correct order with linking words (then, once, finally)', 'Times are given (about a week, 2 to 3 weeks, about 10 days)', 'Passive or active voice is used accurately (eggs are laid, the caterpillar forms)', 'The cycle starting again is mentioned', 'No extra facts that are not in the diagram']),
    mk(19, 3, 'process (man-made)', 'The diagram below shows how paper is recycled. Summarise the information by selecting and reporting the main features.',
      flow('How used paper is recycled', ['1. Used paper is|collected from homes|and offices', '2. Paper is sorted and|pressed into large|blocks (bales)', '3. Bales are mixed with|water and broken up|into pulp', '4. Pulp is cleaned:|ink, staples and glue|are removed', '5. Clean pulp is spread|out, pressed and dried|by hot rollers', '6. Paper is wound into|large rolls and sent|to customers'], 3),
      [`The diagram illustrates the process by which used paper is turned into new paper for sale.`,
        `Overall, there are six stages in the process, which starts with the collection of waste paper and ends with the delivery of large rolls of new paper to customers.`,
        `First, used paper is collected from homes and offices. It is then sorted and pressed into large blocks, known as bales, so that it can be transported easily. Next, the bales are mixed with water in a machine, which breaks the paper up into a soft pulp.`,
        `After that, the pulp is cleaned. In this stage, ink, staples and glue are removed so that only the paper fibres remain. The clean pulp is then spread out in a thin layer, pressed to squeeze out the water and dried by hot rollers. Finally, the dry paper is wound into large rolls, which are sent to customers who will use it to make new products. Each stage prepares the material for the next one, which is why the fibres must be cleaned before the sheets can be formed.`],
      ['Intro paraphrases the task (recycling used paper into new paper)', 'Overview states the number of stages and the start and end points', 'All six stages are mentioned in order', 'Passive voice is used for most steps (is collected, are removed)', 'Sequence words are varied (first, then, next, after that, finally)', 'Purposes are linked clearly (so that it can be transported)', 'No opinion about recycling']),
    mk(20, 3, 'process (man-made)', 'The diagram below shows how a hydroelectric power station generates electricity. Summarise the information by selecting and reporting the main features.',
      flow('How a hydroelectric power station works', ['1. Rain and rivers fill|a reservoir behind|a dam', '2. Gates open and water|flows into a large|pipe', '3. Falling water spins|a turbine', '4. The turbine drives a|generator, which makes|electricity', '5. A transformer raises|the voltage', '6. Power lines carry|electricity to homes|and factories', '7. Used water flows|back into the river|below the dam'], 3),
      [`The diagram explains how electricity is produced in a hydroelectric power station and how it reaches consumers.`,
        `Overall, the process consists of seven stages, beginning with the collection of water behind a dam and finishing with the water returning to the river.`,
        `To begin with, rain and rivers fill a large reservoir behind a dam. When electricity is needed, gates are opened and the water flows into a large pipe, where it falls with great force. The falling water spins a turbine, and the turbine in turn drives a generator, which is the machine that actually produces the electricity.`,
        `The electricity then passes through a transformer, which increases the voltage so that it can travel over long distances without losing too much power. Power lines carry it from the station to homes and factories. Meanwhile, the water that has passed through the turbine is not wasted: it flows out of the station and rejoins the river below the dam. It is worth noting that no fuel is burned at any point, because the energy comes entirely from the falling water.`],
      ['Intro paraphrases the task (hydroelectric station, producing electricity)', 'Overview says seven stages, from reservoir to water returning to the river', 'The turbine and generator roles are not confused', 'Transformer and power lines are both mentioned', 'Last stage (used water returns to river) is included', 'Passive voice and linking words are used (which, so that, meanwhile)', 'No technical facts invented beyond the diagram']),
    // ---------- maps (2) ----------
    mk(21, 3, 'map', 'The maps below show a coastal town called Seaview in 2000 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      mapSvg('Seaview in 2000 and 2020', '2000', '2020',
        [{ x: 0, y: 0, w: 260, h: 45, c: B, l: 'Sea' }, { x: 90, y: 45, w: 70, h: 28, c: B, l: 'Fishing|harbour' }, { x: 175, y: 55, w: 70, h: 40, c: Y, l: 'Fish|market' }, { x: 15, y: 70, w: 65, h: 60, c: K, l: 'Houses' }, { x: 15, y: 150, w: 150, h: 80, c: G, l: 'Farmland' }, { x: 185, y: 120, w: 60, h: 45, c: K, l: 'Shops' }, { line: [172, 100, 172, 240] }],
        [{ x: 0, y: 0, w: 260, h: 45, c: B, l: 'Sea' }, { x: 60, y: 45, w: 130, h: 28, c: B, l: 'Marina' }, { x: 195, y: 55, w: 55, h: 40, c: Y, l: 'Hotel' }, { x: 15, y: 70, w: 65, h: 60, c: K, l: 'Houses' }, { x: 15, y: 150, w: 150, h: 80, c: K, l: 'New housing|estate' }, { x: 185, y: 105, w: 65, h: 65, c: K, l: 'Shopping|centre' }, { x: 185, y: 180, w: 65, h: 50, c: Y, l: 'Car park' }, { line: [172, 100, 172, 240] }]),
      [`The maps show how the coastal town of Seaview changed between 2000 and 2020.`,
        `Overall, the town became more developed and more geared towards tourism. The fishing industry and farmland disappeared, while housing, shopping and leisure facilities expanded.`,
        `In 2000, the northern edge of the town had a small fishing harbour, with a fish market next to it on the east side. There were some houses to the west of the harbour, and a row of shops stood beside the road on the east. A large area of farmland occupied the southwest of the town.`,
        `By 2020, the harbour had been enlarged to form a marina, and the fish market had been replaced by a hotel. The existing houses were unchanged, but the farmland had been built over to create a new housing estate. The shops had been expanded into a larger shopping centre, and a car park had been added to the south of it. The main road remained in the same position throughout the period. The only part of the town that kept its original use was the residential area in the northwest, which suggests that change was concentrated in the south and along the coast.`],
      ['Intro paraphrases the task (Seaview, 2000 and 2020)', 'Overview says the town developed and mentions the main types of change', 'Every changed feature is mentioned (harbour, fish market, farmland, shops, car park)', 'Unchanged features (houses, road) are mentioned', 'Past perfect or passive is used for change (had been replaced, was built over)', 'Compass directions are accurate (north, east, southwest)', 'No opinion about whether the changes are good']),
    mk(22, 3, 'map', 'The maps below show Riverside Park in 2005 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      mapSvg('Riverside Park in 2005 and 2020', '2005', '2020',
        [{ x: 15, y: 15, w: 80, h: 60, c: B, l: 'Tennis|courts' }, { x: 110, y: 25, w: 60, h: 50, c: B, l: 'Pond' }, { x: 15, y: 95, w: 155, h: 105, c: G, l: 'Open field' }, { x: 190, y: 110, w: 55, h: 35, c: Y, l: 'Small cafe' }, { x: 190, y: 165, w: 55, h: 55, c: K, l: 'Car park' }, { x: 100, y: 212, w: 50, h: 22, c: K, l: 'Entrance' }],
        [{ x: 15, y: 15, w: 80, h: 60, c: K, l: 'Skate park' }, { x: 110, y: 25, w: 60, h: 50, c: B, l: 'Pond' }, { x: 15, y: 95, w: 70, h: 105, c: Y, l: 'Play-|ground' }, { x: 90, y: 95, w: 80, h: 105, c: G, l: 'Open field' }, { x: 185, y: 100, w: 65, h: 55, c: Y, l: 'Cafe and|shop' }, { x: 205, y: 180, w: 40, h: 40, c: K, l: 'Car|park' }, { x: 100, y: 212, w: 50, h: 22, c: K, l: 'Entrance' }]),
      [`The maps show how Riverside Park looked in 2005 and how it had changed by 2020.`,
        `Overall, the park was redeveloped to serve younger visitors, with new play facilities replacing the sports courts and part of the open field. The cafe grew, while the car park became smaller.`,
        `In 2005, there were tennis courts in the northwest corner and a pond to their east. A large open field filled the western and central areas, and a small cafe stood on the east side, close to a car park in the southeast. The main entrance was at the southern edge of the park.`,
        `By 2020, the tennis courts had been replaced by a skate park, but the pond remained exactly where it was. A playground had been built on the western part of the field, so the open field was now about half its original width. The small cafe had been extended and now included a shop, whereas the car park had been reduced to roughly half its former size. The entrance had not moved.`],
      ['Intro paraphrases the task (Riverside Park, 2005 and 2020)', 'Overview mentions the shift to younger visitors and the main losses and gains', 'Tennis courts to skate park is reported', 'Field reduced by a playground; car park smaller; cafe larger', 'Unchanged features (pond, entrance) are mentioned', 'Location words are accurate (northwest, southeast, to the east of)', 'Tenses show before and after (had been replaced, was extended)']),
    // ---------- mixed (2) ----------
    mk(23, 4, 'bar chart and table', 'The chart below shows the number of students at a language school who came from four regions in 2020, and the table shows the main reason for study of the students from each region.',
      barChart({ t: 'Students at a language school by region', cats: ['Europe', 'Asia', 'South America', 'Middle East'], series: [{ name: 'Students', v: [120, 210, 90, 60] }], max: 250, step: 50, ylabel: 'Number of students', xlabel: 'Region of origin' })
        + table('Main reason for study (% of students from each region)', ['Region', 'Work', 'University', 'Travel'], [['Europe', 40, 20, 40], ['Asia', 30, 55, 15], ['South America', 45, 25, 30], ['Middle East', 35, 45, 20]]),
      [`The bar chart shows how many students from four regions attended a language school in 2020, while the table gives the percentage of each group that studied for work, university or travel.`,
        `Overall, Asia supplied by far the most students, and these students were also the most likely to be preparing for university. Work and travel were the more common motives among students from Europe and South America.`,
        `Asia sent 210 students, nearly twice as many as Europe, which sent 120. South America contributed 90 students and the Middle East 60, the smallest group. Of the Asian students, 55% were studying in order to enter university, far higher than in any other region, while only 15% were learning for travel.`,
        `The European students were the most evenly spread: 40% studied for work and 40% for travel, with just 20% aiming at university. South American students were the most likely to be learning for work, at 45%, although this group was small. In the Middle East, 45% wanted to go to university and 35% needed English for work, while only one in five was interested in travel.`],
      ['Intro mentions both the chart and the table', 'Overview links the two: Asia largest and most university-focused; Europe and South America more work and travel', 'Student numbers for all four regions are given', 'Highest and lowest percentage for each reason are identified', 'Comparisons are accurate ("nearly twice as many")', 'Data from the chart and table are combined, not described separately', 'Percentages and counts are not confused']),
    mk(24, 4, 'line graph and table', 'The graph below shows the number of visitors to a national park between 2015 and 2023, and the table shows the main activity of visitors in 2015 and 2023.',
      lineChart({ t: 'Visitors to a national park', xs: [2015, 2017, 2019, 2021, 2023], series: [{ name: 'Visitors (thousands)', v: [150, 170, 200, 260, 310] }], max: 350, step: 50, ylabel: 'Visitors (thousands)', xlabel: 'Year' })
        + table('Main activity of visitors (%)', ['Activity', '2015', '2023'], [['Walking', 50, 40], ['Cycling', 15, 30], ['Picnics', 25, 20], ['Wildlife watching', 10, 10]]),
      [`The line graph shows how many thousand people visited a national park between 2015 and 2023, and the table compares the activities that visitors chose in 2015 and 2023.`,
        `Overall, visitor numbers rose steadily throughout the period and more than doubled. Walking remained the most popular activity, but cycling became far more common.`,
        `The park received 150,000 visitors in 2015. This figure rose to 170,000 in 2017 and 200,000 in 2019, and then grew faster, reaching 260,000 in 2021 and 310,000 in 2023, an increase of 160,000 over eight years.`,
        `Turning to activities, walking was the main reason for half of all visits in 2015, but its share dropped to 40% in 2023. Cycling doubled from 15% to 30%, the biggest change in the table, and moved from third place to second. Picnics fell from 25% to 20%, while wildlife watching stayed the same at 10%. Since the number of visitors had increased, the actual number of cyclists therefore grew by far more than the percentage alone suggests: roughly 22,500 cyclists in 2015 against about 93,000 in 2023, if the activity shares are applied to the visitor totals.`],
      ['Intro mentions both the line graph and the table', 'Overview: visitors more than doubled; walking still first; cycling grew most', 'Visitor figures for 2015 and 2023 are given with units (thousands)', 'Increase (160,000) calculated correctly', 'Cycling doubling from 15% to 30% and its change in rank are reported', 'Wildlife watching described as unchanged', 'Percentages (table) and thousands (graph) are kept separate']),
  ],
};
