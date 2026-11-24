---
title: "Rebuilding a survey's headline scores from its own answer counts"
summary: "A 2026 survey of 598 lung cancer patients reports knowledge, attitude and practice scores. From its published answer counts, fibub's Likert chart tool rebuilds all three, and recovers the reliability the paper never reports for them."
tools: [likert-chart, reliability-analysis, questionnaire-scorer]
updated: 2026-11-24
sources:
  - "Cao, J., Xiang, F., Zhang, J., Tang, Y., Hu, M. and Li, F. (2026), Knowledge, attitudes, and practices of lung cancer patients regarding nutritional management during chemotherapy, Frontiers in Nutrition 13: 1678612, doi:10.3389/fnut.2026.1678612. Licence CC BY 4.0, taken from the Crossref record (api.crossref.org/works?filter=doi:10.3389/fnut.2026.1678612), checked 2026-11-24; no correction or retraction on the record. Values used here: N = 598; the response counts and percentages of the ten knowledge items (3 answers each), nine attitude items and six practice items (5 answers each); the domain scores 12.07 ± 4.69 (range 0-20), 35.89 ± 4.98 (9-45) and 23.28 ± 4.12 (6-30); and Cronbach's alpha from a 36-person pilot (0.895 overall, 0.887, 0.788, 0.809)."
  - "Methods: Likert, R. (1932), A technique for the measurement of attitudes, Archives of Psychology 140; diverging stacked bars as in Robbins, N. B. and Heiberger, R. M. (2011), Plotting Likert and other rating scales, JSM Proceedings; Cronbach, L. J. (1951), Coefficient alpha and the internal structure of tests, Psychometrika 16: 297-334."
paper:
  title: "Knowledge, attitudes, and practices of lung cancer patients regarding nutritional management during chemotherapy"
  authors: "Cao J, Xiang F, Zhang J, Tang Y, Hu M, Li F"
  journal: "Frontiers in Nutrition"
  year: 2026
  doi: "10.3389/fnut.2026.1678612"
  url: "https://www.frontiersin.org/articles/10.3389/fnut.2026.1678612/full"
  licence: "CC BY 4.0"
  reviewed: true
---

A knowledge-attitude-practice survey, or KAP survey, is one of the commonest designs in health research: ask people what they know, what they think and what they do, add each block of answers into a score, and report the three totals. A 2026 paper in *Frontiers in Nutrition* ran one with 598 lung cancer patients on chemotherapy and reports knowledge 12.07 out of 20, attitude 35.89 out of 45 and practice 23.28 out of 30. It also prints, as most KAP papers do, how many of the 598 chose each answer to each of its 25 items. Those two things have to fit together, and the [[likert-chart]] checks that they do. It also squeezes out something the paper does not report: how reliable the three scales were in the 598, not in the pilot. For the reliability itself see the [[reliability-analysis]], and for scoring your own instrument the [[questionnaire-scorer]].

## The paper in brief

Six hundred and thirty-nine patients at one hospital were approached and 598 usable questionnaires came back. The instrument has ten knowledge items answered on three levels (not clear, heard of it, very familiar; scored 0, 1 and 2, so the knowledge score runs from 0 to 20), nine attitude items on a five-point agree-disagree scale (9 to 45) and six practice items on a five-point never-to-always scale (6 to 30). A pilot of 36 people gave Cronbach's alpha of 0.895 overall and 0.887, 0.788 and 0.809 for the three blocks.

The authors' reading is that knowledge is the weak link: 12.07 of 20 is about 60 % of the maximum, while attitude is 80 % and practice 78 %. In other words these patients are willing and mostly doing the right things, but do not know much about nutrition during chemotherapy — the standard KAP conclusion that knowledge is where to intervene.

## Checked with the tools

The tool's `summarise` function takes one item's counts, most negative answer first, and returns the percentage choosing each answer, the share who agree, the share who disagree, the median and the mean with its standard deviation. Run it over all 25 published items and the paper's own arithmetic appears.

**Step 1: the counts are clean.** Every one of the 25 items has counts adding to exactly 598, with no missing answers anywhere. The 45 percentages printed beside the nine attitude items all equal the count divided by 598, the largest disagreement being 0.005 of a percentage point. Nothing has been transcribed wrongly.

**Step 2: all three headline scores come straight back out.** A domain score is the sum of its items, so its mean must be the sum of the item means. Adding the item means the tool works out:

| Domain | Items | Sum of the tool's item means | Score in the paper |
|---|---|---|---|
| Knowledge (scored 0-2) | 10 | 12.0686 | 12.07 |
| Attitude (scored 1-5) | 9 | 35.8880 | 35.89 |
| Practice (scored 1-5) | 6 | 23.2826 | 23.28 |

All three land on the published value, to the last digit the paper prints. (The tool codes answers 1 to k, so for the knowledge items it reports means between 1 and 3; subtract one per item, 22.0686 − 10, to get the paper's 0-to-2 scoring.) A KAP paper that fails this check has either mis-added its items or dropped cases from some of them.

<!-- fig:likert -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 428" role="img" aria-label="Diverging stacked bars for the nine attitude items, centred on the neutral answer. Agreement runs from 66 per cent for item A1 to 82 per cent for item A8." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:12px system-ui,sans-serif"><title>The nine attitude items as diverging stacked bars</title><text x="280" y="16" dy="0.35em" font-size="14" fill="var(--ink)" text-anchor="middle" font-weight="700">Attitudes to nutrition during chemotherapy (n = 598)</text>
<polyline points="64.2,30 64.2,314.8" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<text x="64.2" y="320.8" dy="0.8em" font-size="10" fill="var(--muted)" text-anchor="middle">50 %</text>
<polyline points="138.33,30 138.33,314.8" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<text x="138.33" y="320.8" dy="0.8em" font-size="10" fill="var(--muted)" text-anchor="middle">25 %</text>
<polyline points="212.47,30 212.47,314.8" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="round"/>
<text x="212.47" y="320.8" dy="0.8em" font-size="10" fill="var(--muted)" text-anchor="middle">0 %</text>
<polyline points="286.6,30 286.6,314.8" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<text x="286.6" y="320.8" dy="0.8em" font-size="10" fill="var(--muted)" text-anchor="middle">25 %</text>
<polyline points="360.73,30 360.73,314.8" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<text x="360.73" y="320.8" dy="0.8em" font-size="10" fill="var(--muted)" text-anchor="middle">50 %</text>
<polyline points="434.87,30 434.87,314.8" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<text x="434.87" y="320.8" dy="0.8em" font-size="10" fill="var(--muted)" text-anchor="middle">75 %</text>
<polyline points="509,30 509,314.8" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<text x="509" y="320.8" dy="0.8em" font-size="10" fill="var(--muted)" text-anchor="middle">100 %</text>
<text x="515" y="28" dy="0" font-size="10" fill="var(--muted)" text-anchor="start">Agree</text>
<polygon points="140.81,39.62 146.76,39.62 146.76,59.58 140.81,59.58" fill="#e08214"/>
<polygon points="146.76,39.62 184.45,39.62 184.45,59.58 146.76,59.58" fill="#fdb863"/>
<text x="165.61" y="49.6" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">13</text>
<polygon points="184.45,39.62 240.48,39.62 240.48,59.58 184.45,59.58" fill="#c8c8c8"/>
<text x="212.47" y="49.6" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">19</text>
<polygon points="240.48,39.62 381.81,39.62 381.81,59.58 240.48,59.58" fill="#b2abd2"/>
<text x="311.15" y="49.6" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">48</text>
<polygon points="381.81,39.62 437.35,39.62 437.35,59.58 381.81,59.58" fill="#8073ac"/>
<text x="409.58" y="49.6" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">19</text>
<text x="56.2" y="49.6" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A1</text>
<text x="515" y="49.6" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">66 %</text>
<polygon points="175.28,70.82 177.76,70.82 177.76,90.78 175.28,90.78" fill="#e08214"/>
<polygon points="177.76,70.82 188.17,70.82 188.17,90.78 177.76,90.78" fill="#fdb863"/>
<polygon points="188.17,70.82 236.76,70.82 236.76,90.78 188.17,90.78" fill="#c8c8c8"/>
<text x="212.47" y="80.8" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">16</text>
<polygon points="236.76,70.82 369.16,70.82 369.16,90.78 236.76,90.78" fill="#b2abd2"/>
<text x="302.96" y="80.8" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">45</text>
<polygon points="369.16,70.82 471.81,70.82 471.81,90.78 369.16,90.78" fill="#8073ac"/>
<text x="420.49" y="80.8" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">35</text>
<text x="56.2" y="80.8" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A2</text>
<text x="515" y="80.8" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">79 %</text>
<polygon points="178,102.02 180.48,102.02 180.48,121.98 178,121.98" fill="#e08214"/>
<polygon points="180.48,102.02 190.4,102.02 190.4,121.98 180.48,121.98" fill="#fdb863"/>
<polygon points="190.4,102.02 234.53,102.02 234.53,121.98 190.4,121.98" fill="#c8c8c8"/>
<text x="212.47" y="112" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">15</text>
<polygon points="234.53,102.02 374.37,102.02 374.37,121.98 234.53,121.98" fill="#b2abd2"/>
<text x="304.45" y="112" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">47</text>
<polygon points="374.37,102.02 474.54,102.02 474.54,121.98 374.37,121.98" fill="#8073ac"/>
<text x="424.45" y="112" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">34</text>
<text x="56.2" y="112" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A3</text>
<text x="515" y="112" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">81 %</text>
<polygon points="171.8,133.22 176.76,133.22 176.76,153.18 171.8,153.18" fill="#e08214"/>
<polygon points="176.76,133.22 189.66,133.22 189.66,153.18 176.76,153.18" fill="#fdb863"/>
<polygon points="189.66,133.22 235.28,133.22 235.28,153.18 189.66,153.18" fill="#c8c8c8"/>
<text x="212.47" y="143.2" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">15</text>
<polygon points="235.28,133.22 376.6,133.22 376.6,153.18 235.28,153.18" fill="#b2abd2"/>
<text x="305.94" y="143.2" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">48</text>
<polygon points="376.6,133.22 468.34,133.22 468.34,153.18 376.6,153.18" fill="#8073ac"/>
<text x="422.47" y="143.2" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">31</text>
<text x="56.2" y="143.2" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A4</text>
<text x="515" y="143.2" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">79 %</text>
<polygon points="173.04,164.42 174.53,164.42 174.53,184.38 173.04,184.38" fill="#e08214"/>
<polygon points="174.53,164.42 184.95,164.42 184.95,184.38 174.53,184.38" fill="#fdb863"/>
<polygon points="184.95,164.42 239.99,164.42 239.99,184.38 184.95,184.38" fill="#c8c8c8"/>
<text x="212.47" y="174.4" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">19</text>
<polygon points="239.99,164.42 378.34,164.42 378.34,184.38 239.99,184.38" fill="#b2abd2"/>
<text x="309.16" y="174.4" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">47</text>
<polygon points="378.34,164.42 469.58,164.42 469.58,184.38 378.34,184.38" fill="#8073ac"/>
<text x="423.96" y="174.4" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">31</text>
<text x="56.2" y="174.4" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A5</text>
<text x="515" y="174.4" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">77 %</text>
<polygon points="169.33,195.62 171.31,195.62 171.31,215.58 169.33,215.58" fill="#e08214"/>
<polygon points="171.31,195.62 186.68,195.62 186.68,215.58 171.31,215.58" fill="#fdb863"/>
<polygon points="186.68,195.62 238.25,195.62 238.25,215.58 186.68,215.58" fill="#c8c8c8"/>
<text x="212.47" y="205.6" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">17</text>
<polygon points="238.25,195.62 376.11,195.62 376.11,215.58 238.25,215.58" fill="#b2abd2"/>
<text x="307.18" y="205.6" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">46</text>
<polygon points="376.11,195.62 465.86,195.62 465.86,215.58 376.11,215.58" fill="#8073ac"/>
<text x="420.98" y="205.6" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">30</text>
<text x="56.2" y="205.6" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A6</text>
<text x="515" y="205.6" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">77 %</text>
<polygon points="163.38,226.82 166.85,226.82 166.85,246.78 163.38,246.78" fill="#e08214"/>
<polygon points="166.85,226.82 179.74,226.82 179.74,246.78 166.85,246.78" fill="#fdb863"/>
<polygon points="179.74,226.82 245.19,226.82 245.19,246.78 179.74,246.78" fill="#c8c8c8"/>
<text x="212.47" y="236.8" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">22</text>
<polygon points="245.19,226.82 384.54,226.82 384.54,246.78 245.19,246.78" fill="#b2abd2"/>
<text x="314.86" y="236.8" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">47</text>
<polygon points="384.54,226.82 459.91,226.82 459.91,246.78 384.54,246.78" fill="#8073ac"/>
<text x="422.22" y="236.8" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">25</text>
<text x="56.2" y="236.8" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A7</text>
<text x="515" y="236.8" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">72 %</text>
<polygon points="179.99,258.02 181.47,258.02 181.47,277.98 179.99,277.98" fill="#e08214"/>
<polygon points="181.47,258.02 191.89,258.02 191.89,277.98 181.47,277.98" fill="#fdb863"/>
<polygon points="191.89,258.02 233.05,258.02 233.05,277.98 191.89,277.98" fill="#c8c8c8"/>
<text x="212.47" y="268" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">14</text>
<polygon points="233.05,258.02 381.31,258.02 381.31,277.98 233.05,277.98" fill="#b2abd2"/>
<text x="307.18" y="268" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">50</text>
<polygon points="381.31,258.02 476.52,258.02 476.52,277.98 381.31,277.98" fill="#8073ac"/>
<text x="428.92" y="268" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">32</text>
<text x="56.2" y="268" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A8</text>
<text x="515" y="268" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">82 %</text>
<polygon points="168.33,289.22 168.83,289.22 168.83,309.18 168.33,309.18" fill="#e08214"/>
<polygon points="168.83,289.22 181.23,289.22 181.23,309.18 168.83,309.18" fill="#fdb863"/>
<polygon points="181.23,289.22 243.71,289.22 243.71,309.18 181.23,309.18" fill="#c8c8c8"/>
<text x="212.47" y="299.2" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">21</text>
<polygon points="243.71,289.22 390.49,289.22 390.49,309.18 243.71,309.18" fill="#b2abd2"/>
<text x="317.1" y="299.2" dy="0.35em" font-size="10" fill="#111111" text-anchor="middle">49</text>
<polygon points="390.49,289.22 464.87,289.22 464.87,309.18 390.49,309.18" fill="#8073ac"/>
<text x="427.68" y="299.2" dy="0.35em" font-size="10" fill="#ffffff" text-anchor="middle">25</text>
<text x="56.2" y="299.2" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="end">Item A9</text>
<text x="515" y="299.2" dy="0.35em" font-size="12" fill="var(--ink)" text-anchor="start" font-weight="700">75 %</text>
<polygon points="10,344.8 22,344.8 22,356.8 10,356.8" fill="#e08214"/>
<text x="28" y="350.8" dy="0.35em" font-size="11" fill="var(--ink)" text-anchor="start">Strongly disagree</text>
<polygon points="290,344.8 302,344.8 302,356.8 290,356.8" fill="#fdb863"/>
<text x="308" y="350.8" dy="0.35em" font-size="11" fill="var(--ink)" text-anchor="start">Disagree</text>
<polygon points="10,365.2 22,365.2 22,377.2 10,377.2" fill="#c8c8c8"/>
<text x="28" y="371.2" dy="0.35em" font-size="11" fill="var(--ink)" text-anchor="start">Neutral</text>
<polygon points="290,365.2 302,365.2 302,377.2 290,377.2" fill="#b2abd2"/>
<text x="308" y="371.2" dy="0.35em" font-size="11" fill="var(--ink)" text-anchor="start">Agree</text>
<polygon points="10,385.6 22,385.6 22,397.6 10,397.6" fill="#8073ac"/>
<text x="28" y="391.6" dy="0.35em" font-size="11" fill="var(--ink)" text-anchor="start">Strongly agree</text>
<text class="fibub-mark" x="556" y="424" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The paper’s nine attitude items drawn by the Likert chart tool from its published response counts, centred on the neutral answer, most agreement first. The number on each segment is its percentage; the figure on the right is % agree.</figcaption></figure>
<!-- /fig:likert -->

**Step 3: the chart says what the score cannot.** All nine attitude items have a median of exactly 4, "Agree", so the median ranks nothing. The means are nearly as flat, 3.68 to 4.10. What separates the items is the tail: item A1 has 14.7 % disagreeing, three times the next highest, and only 66.4 % agreeing against 82.1 % for item A8. On the knowledge side the spread is wide and useful: 43.0 % are "very familiar" with the subject of item K1 but only 24.2 % with item K4, whose mean of 0.93 out of 2 is the lowest of the ten. A single "knowledge 12.07/20" hides the fact that one item is doing most of the damage.

**Step 4: the reliability of the real sample, which the paper does not give.** The paper's alphas come from the 36-person pilot. But a scale's alpha depends only on the item variances and the variance of the total, and the paper publishes enough to recover both: the item variances come from the counts and the total's standard deviation is printed beside each score. Cronbach's formula `α = k/(k−1) · (1 − Σσᵢ²/σ²_total)` then gives, for the 598:

| Domain | Σ item variances | SD if the items were unrelated | SD in the paper | Alpha from the 598 | Alpha in the 36-person pilot | Average correlation between items |
|---|---|---|---|---|---|---|
| Knowledge | 4.686 | 2.165 | 4.69 | 0.874 | 0.887 | 0.41 |
| Attitude | 6.614 | 2.572 | 4.98 | 0.825 | 0.788 | 0.34 |
| Practice | 5.414 | 2.327 | 4.12 | 0.817 | 0.809 | 0.43 |

Three results worth having. First, the pilot's alphas hold up in the full sample: the largest change is attitude, 0.788 to 0.825. Second, the reason the totals spread so widely is that the items agree with each other: if the ten knowledge items were unrelated, the score would have a standard deviation of 2.17, not the 4.69 reported. Third, that pins the average correlation between items at about 0.41, 0.34 and 0.43 — high enough to be measuring one thing each, not so high that the items are repetitive.

<!-- fig:sd -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="The standard deviation a domain score would have if every pair of its items correlated by the same amount, against that correlation. The paper’s printed SDs cross the curves at 0.41, 0.34 and 0.43." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Total score spread against item agreement</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Total score spread against item agreement</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="209" y2="209" style="stroke:var(--line)"/><text x="52" y="213" text-anchor="end" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="156" y2="156" style="stroke:var(--line)"/><text x="52" y="160" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="103" y2="103" style="stroke:var(--line)"/><text x="52" y="107" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="139.3" y="279" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="220.7" x2="220.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="220.7" y="279" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="302" x2="302" y1="262" y2="266" style="stroke:var(--muted)"/><text x="302" y="279" text-anchor="middle" style="fill:var(--muted)">0.3</text><line x1="383.3" x2="383.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="383.3" y="279" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="464.7" x2="464.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="464.7" y="279" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Average correlation between items</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">SD of the domain score</text><line x1="58" x2="546" y1="119.4" y2="119.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="114.4" text-anchor="end" style="fill:var(--muted)">Knowledge 4.69</text><line x1="58" x2="546" y1="104.1" y2="104.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="99.1" text-anchor="end" style="fill:var(--muted)">Attitude 4.98</text><line x1="58" x2="546" y1="149.6" y2="149.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="144.6" text-anchor="end" style="fill:var(--muted)">Practice 4.12</text><path d="M58 253.3L66.1 248.2L74.3 243.4L82.4 238.8L90.5 234.3L98.7 229.9L106.8 225.7L114.9 221.6L123.1 217.6L131.2 213.8L139.3 210L147.5 206.3L155.6 202.7L163.7 199.2L171.9 195.7L180 192.3L188.1 189L196.3 185.7L204.4 182.5L212.5 179.4L220.7 176.2L228.8 173.2L236.9 170.2L245.1 167.2L253.2 164.3L261.3 161.5L269.5 158.6L277.6 155.8L285.7 153L293.9 150.3L302 147.6L310.1 145L318.3 142.3L326.4 139.7L334.5 137.2L342.7 134.6L350.8 132.1L358.9 129.6L367.1 127.2L375.2 124.7L383.3 122.3L391.5 119.9L399.6 117.5L407.7 115.2L415.9 112.9L424 110.6L432.1 108.3L440.3 106L448.4 103.8L456.5 101.6L464.7 99.3L472.8 97.2L480.9 95L489.1 92.8L497.2 90.7L505.3 88.6L513.5 86.5L521.6 84.4L529.7 82.3L537.9 80.3L546 78.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 231.7L66.1 226.4L74.3 221.2L82.4 216.3L90.5 211.5L98.7 206.8L106.8 202.3L114.9 197.9L123.1 193.6L131.2 189.4L139.3 185.3L147.5 181.3L155.6 177.4L163.7 173.5L171.9 169.8L180 166.1L188.1 162.5L196.3 158.9L204.4 155.4L212.5 151.9L220.7 148.5L228.8 145.2L236.9 141.8L245.1 138.6L253.2 135.4L261.3 132.3L269.5 129.1L277.6 126.1L285.7 123L293.9 120L302 117L310.1 114.1L318.3 111.2L326.4 108.4L334.5 105.5L342.7 102.7L350.8 99.9L358.9 97.2L367.1 94.5L375.2 91.8L383.3 89.1L391.5 86.5L399.6 83.9L407.7 81.3L415.9 78.7L424 76.2L432.1 73.6L440.3 71.1L448.4 68.7L456.5 66.2L464.7 63.7L472.8 61.3L480.9 58.9L489.1 56.5L497.2 54.2L505.3 51.8L513.5 49.5L521.6 47.2L529.7 44.9L537.9 42.6L546 40.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 244.7L66.1 241.6L74.3 238.7L82.4 235.8L90.5 233L98.7 230.1L106.8 227.4L114.9 224.7L123.1 222.1L131.2 219.5L139.3 217L147.5 214.5L155.6 212.1L163.7 209.7L171.9 207.3L180 205L188.1 202.6L196.3 200.4L204.4 198.1L212.5 195.9L220.7 193.7L228.8 191.6L236.9 189.4L245.1 187.3L253.2 185.2L261.3 183.1L269.5 181.1L277.6 179.1L285.7 177.1L293.9 175.1L302 173.2L310.1 171.2L318.3 169.3L326.4 167.4L334.5 165.5L342.7 163.7L350.8 161.8L358.9 160L367.1 158.2L375.2 156.4L383.3 154.6L391.5 152.8L399.6 151.1L407.7 149.3L415.9 147.6L424 145.9L432.1 144.2L440.3 142.5L448.4 140.8L456.5 139.1L464.7 137.5L472.8 135.9L480.9 134.2L489.1 132.6L497.2 131L505.3 129.4L513.5 127.8L521.6 126.3L529.7 124.7L537.9 123.1L546 121.6" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="391.9" cy="119.4" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="337.6" cy="104.1" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="405.4" cy="149.6" r="4.5" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Knowledge</text><line x1="148.8" x2="160.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="164.8" y="40" style="fill:var(--muted)">Attitude</text><line x1="232.4" x2="244.4" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="248.4" y="40" style="fill:var(--muted)">Practice</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How wide a domain score can be. Each curve is the standard deviation the total would have if every pair of items in that domain correlated by the amount on the x-axis, worked out from the item variances in the paper’s tables. The dashed lines are the standard deviations the paper prints; where each line crosses its curve is the average correlation between that domain’s items.</figcaption></figure>
<!-- /fig:sd -->

This also doubles as a check on the printed standard deviations. An SD below the "unrelated" line would be impossible unless items were negatively correlated, and an SD near the sum of the item SDs (6.83 for knowledge) would mean the items are the same question asked ten times. The paper's three values sit comfortably between.

## How we made the graphs

Both figures and every number come from `scripts/blog-figures/lung-cancer-nutrition-kap-item-scores-from-response-counts.mjs` in fibub's public code. It calls `summarise`, `sortItems`, `chartHeight`, `palette` and `drawLikert` from `src/lib/sci/likert.ts`, the maths and the drawing behind the [[likert-chart]]. Figure 1 is drawn by `drawLikert` itself through the same SVG painter the tool uses for its SVG download, so it is the tool's own chart in the page's colours.

The inputs are the 75 response counts of the paper's Tables 2, 3 and 4, its sample size of 598, the three domain scores with their standard deviations, and the pilot alphas. Nothing is assumed. Figure 2's curves use the identity `σ²_total = Σσᵢ² + r̄ ((Σσᵢ)² − Σσᵢ²)`, which holds when every pair of items shares the same correlation `r̄`; real items vary around that average, so `r̄` is an average, not a claim about any particular pair.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/likert-chart.mjs`, which pins the summaries against hand-worked and pandas values:

- On made-up counts, the percentages, % agree, median, mean and SD of each item must match the independent calculation, and the diverging segments must be centred so that half of the middle answer sits either side of zero.
- An item whose answers are given as labels rather than codes must give the same summary, and an answer that is neither must be refused by name.
- New with this article: the 25 published items must give item-mean sums of 22.0686 (knowledge, on the tool's 1-3 codes), 35.8880 (attitude) and 23.2826 (practice), every item must have n = 598, and the item variances must give Cronbach alphas of 0.8744, 0.8250 and 0.8173 against the paper's printed standard deviations.

## Check it yourself

On the [[likert-chart]]:

1. Press **Counts per answer** at the top of the *Your answers* card.
2. Replace the box with these ten lines, the paper's nine attitude items (tab or comma separated):
   `Statement, Strongly disagree, Disagree, Neutral, Agree, Strongly agree`
   `Item A1, 12, 76, 113, 285, 112`
   `Item A2, 5, 21, 98, 267, 207`
   `Item A3, 5, 20, 89, 282, 202`
   `Item A4, 10, 26, 92, 285, 185`
   `Item A5, 3, 21, 111, 279, 184`
   `Item A6, 4, 31, 104, 278, 181`
   `Item A7, 7, 26, 132, 281, 152`
   `Item A8, 3, 21, 83, 299, 192`
   `Item A9, 1, 25, 126, 296, 150`
3. Leave *Answer options* on **5** and *Order of statements* on **Most agreement first**.
4. The chart puts **Item A8** at the top with **82.1 %** agreeing and **Item A1** at the bottom with **66.4 %**, and every bar's n in the summary table reads **598**.
5. In the *Summary* table, add up the *Mean (SD)* column: 4.10 + 4.10 + 4.09 + 4.02 + 4.04 + 4.01 + 3.95 + 3.91 + 3.68 = **35.90**, which is the paper's attitude score of 35.89 plus the rounding of nine two-decimal means (unrounded they add to 35.888). The SD column gives 0.80, 0.83, 0.85, 0.89, 0.82, 0.86, 0.80, 0.86 and 0.98; squared and added they come to **6.60**, against 6.614 from the unrounded SDs, which is the figure Step 4 needs.

## What researchers can use it for

- **Check a KAP or scale paper before citing it**: the sum of the item means must equal the reported domain mean. It takes a minute and it catches dropped cases and mis-added blocks.
- **Recover reliability from a published table.** Item counts plus the total's SD give Cronbach's alpha for the sample that was actually analysed, even when the paper reports only a pilot's alpha.
- **Sanity-check a printed standard deviation.** It must lie between the square root of the summed item variances and the sum of the item SDs; outside that range something is wrong.
- **Find the item that is dragging a score down**, which a total never shows: here one knowledge item out of ten.
- **Report percentages, not just means.** When every median is 4 and every mean is near 4, the share who disagree is the only number that separates the items.

## The fine print

- We did not have the item wordings, only the paper's labels K1 to K10, A1 to A9 and P1 to P6, so the chart names the items by their labels.
- Treating the five answers as the numbers 1 to 5 is what the paper does when it adds them up; strictly, Likert answers are ordered categories, and the tool says so under its own summary table.
- The average inter-item correlation and the alphas assume the paper's printed standard deviations are the SDs of the summed scores, which is how it labels them.
- The tool's *Answer options* menu offers 4, 5, 6 and 7, so the three-answer knowledge items cannot be charted in the page as it stands; our script calls the same `summarise` function directly for those, and the chart here uses the five-answer attitude items.
- This is one hospital's patients at one time, with no control group. Nothing here tests whether the survey's conclusions generalise, only whether its own numbers hold together.
