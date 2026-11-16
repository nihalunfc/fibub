---
title: "Dropping aspirin early after a stent: meta-analysis of bleeding and heart attacks"
summary: "A 2026 meta-analysis of 7 trials (27,743 patients) finds that stopping aspirin early after a stent halves bleeding without more heart attacks. We recheck it with fibub's meta-analysis and NNT tools."
tools: [meta-analysis, nnt-calculator, odds-risk-ratio]
updated: 2026-11-16
sources:
  - "Navarese, E. P., Gurbel, P., Tantry, U., Talanas, G., Grzelakowska, K., Umińska, J. et al. (2026), Early aspirin withdrawal versus dual antiplatelet therapy in high-risk patients after percutaneous coronary intervention: Meta-analysis of randomized trials, PLOS Medicine 23(3): e1004995, doi:10.1371/journal.pmed.1004995. Licence CC BY 4.0, stated on the article page, checked 2026-11-16. Values used here, from the Results text: 7 trials, 27,743 patients; events, monotherapy against DAPT: heart attack 215/13,865 and 194/13,878, clinically relevant bleeding 527/13,865 and 840/13,878, major bleeding 94/9,169 and 197/9,198, stroke 102/13,865 and 97/13,878; pooled hazard ratios 1.11 (0.91 to 1.35) for heart attack, 0.55 (0.42 to 0.71, I² 79%) for bleeding, 0.48 (0.38 to 0.62) for major bleeding, 1.00 (0.83 to 1.21) for death; subgroup hazard ratios for heart attack 1.41 (1.01 to 1.97) with no aspirin from the start and 0.97 (0.76 to 1.24) with aspirin stopped by 3 months, for bleeding 0.61 (0.28 to 1.33) and 0.53 (0.46 to 0.61); the authors' modelled NNTs of 12 and 57."
  - "DerSimonian, R. and Laird, N. (1986), Meta-analysis in clinical trials, Controlled Clinical Trials 7: 177-188 (the pooling method)."
  - "Altman, D. G. (1998), Confidence intervals for the number needed to treat, BMJ 317: 1309-1312 (NNT limits)."
paper:
  title: "Early aspirin withdrawal versus dual antiplatelet therapy in high-risk patients after percutaneous coronary intervention: Meta-analysis of randomized trials"
  authors: "Navarese EP, Gurbel P, Tantry U, Talanas G, Grzelakowska K, Umińska J et al."
  journal: "PLOS Medicine"
  year: 2026
  doi: "10.1371/journal.pmed.1004995"
  url: "https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1004995"
  licence: "CC BY 4.0"
  reviewed: true
---

After a stent is put into a heart artery (percutaneous coronary intervention, PCI), patients usually take two blood thinners together: aspirin plus a stronger P2Y12 blocker such as ticagrelor or clopidogrel. This is **dual antiplatelet therapy (DAPT)**. It prevents clots in the stent but makes bleeding more likely. A 2026 meta-analysis in PLOS Medicine pools seven randomised trials that stopped aspirin early, or never started it, and kept the P2Y12 blocker alone. This article shows how the [[meta-analysis]], the [[nnt-calculator]] and the [[odds-risk-ratio|odds and risk ratio tool]] let anyone recheck the headline numbers and turn them into "how many patients" terms.

*General education only, not medical advice. Never change a heart medicine without your own doctor.*

## The paper in brief

The authors pooled 7 trials with **27,743** high-risk patients. Pooling means combining each trial's result, weighted by how precise it is, into one overall estimate; they used a **random-effects** model, which allows the true effect to differ a little from trial to trial. Their main findings:

- **Heart attacks:** no clear difference, hazard ratio (HR) 1.11 (95% CI 0.91 to 1.35). A hazard ratio compares how often an event happens over time in one group against the other; 1 means no difference.
- **Bleeding that needs medical care:** cut by almost half, HR 0.55 (0.42 to 0.71), though the size of the cut varied between trials (I² 79%, a measure of how much the trials disagree beyond chance).
- **Death and stroke:** no difference.
- **Timing matters:** with **no aspirin at all from the start**, heart attacks were more common (HR 1.41); when aspirin was stopped **within 3 months**, they were not (HR 0.97).

## Checked with the tools

We had only what the paper prints in its text: pooled event counts and hazard ratios with their intervals. That is enough for three checks. Everything below is a **recomputation from the published numbers**, not a re-analysis of patient data.

**Check 1: do the two timings really differ?** The paper gives heart-attack HRs for the two timing groups. Typing both into the Meta-analysis tool's *Effect + CI* mode and pooling them with a fixed effect gives **1.105 (0.907 to 1.347)**, almost exactly the paper's overall 1.11 (0.91 to 1.35). The tool's heterogeneity test, which with two groups is a test of whether they differ, gives **Q = 3.13, p = 0.077** and I² of 68%. So the hint of harm from never starting aspirin is real enough to take seriously, but not firm on its own. For bleeding the two timings agree well (Q = 0.12, p = 0.73), pooling to **0.53 (0.46 to 0.61)** (Figure 1).

<!-- fig:forest -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Heart attack: no-aspirin-from-start HR 1.41 against 0.97 when aspirin stopped by 3 months (heterogeneity p 0.08). Bleeding: 0.61 and 0.53, consistent (p 0.73), pooled 0.53." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Hazard ratios by when aspirin stopped (log scale)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Hazard ratios by when aspirin stopped (log scale)</text><line x1="58" x2="58" y1="254" y2="258" style="stroke:var(--muted)"/><text x="58" y="271" text-anchor="middle" style="fill:var(--muted)">0.25</text><line x1="213.5" x2="213.5" y1="254" y2="258" style="stroke:var(--muted)"/><text x="213.5" y="271" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="369.1" x2="369.1" y1="254" y2="258" style="stroke:var(--muted)"/><text x="369.1" y="271" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="524.6" x2="524.6" y1="254" y2="258" style="stroke:var(--muted)"/><text x="524.6" y="271" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Hazard ratio, P2Y12 alone vs DAPT</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)"></text><line x1="369.1" x2="369.1" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="373.1" y="44" text-anchor="start" style="fill:var(--muted)">no difference</text><path d="M371.3 63.7L521.2 63.7" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="446.3" cy="63.7" r="4" style="fill:var(--ink);opacity:1"/><text x="62" y="56.7" text-anchor="start" style="fill:var(--ink)">Heart attack: no aspirin</text><path d="M307.6 95.4L417.3 95.4" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="362.3" cy="95.4" r="4" style="fill:var(--ink);opacity:1"/><text x="62" y="88.4" text-anchor="start" style="fill:var(--ink)">Heart attack: stopped by 3 mo</text><path d="M347.3 127.1L435.9 127.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="391.5" cy="127.1" r="6" style="fill:var(--c-blog);opacity:1"/><text x="62" y="120.1" text-anchor="start" style="fill:var(--ink)">Heart attack: pooled (Q p = 0.08)</text><path d="M83.4 158.9L433 158.9" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="258.2" cy="158.9" r="4" style="fill:var(--ink);opacity:1"/><text x="62" y="151.9" text-anchor="start" style="fill:var(--ink)">Bleeding: no aspirin</text><path d="M194.7 190.6L258.2 190.6" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="226.6" cy="190.6" r="4" style="fill:var(--ink);opacity:1"/><text x="62" y="183.6" text-anchor="start" style="fill:var(--ink)">Bleeding: stopped by 3 mo</text><path d="M196.5 222.3L258.7 222.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="227.7" cy="222.3" r="6" style="fill:var(--c-blog);opacity:1"/><text x="62" y="215.3" text-anchor="start" style="fill:var(--ink)">Bleeding: pooled (Q p = 0.73)</text></svg><figcaption>Figure 1. The paper's subgroup hazard ratios (dots, 95% CI lines) by when aspirin was stopped, pooled with the Meta-analysis tool's fixed-effect maths to test whether the two timings agree. Recomputed from the published estimates, not from patient data.</figcaption></figure>
<!-- /fig:forest -->

**Check 2: the counts as risks.** From the pooled event counts, the NNT calculator gives the crude risks and their differences:

| Outcome | Paper (pooled HR) | Tool, crude risk ratio from the counts | Risk difference |
|---|---|---|---|
| Clinically relevant bleeding | 0.55 (0.42 to 0.71) | 0.628 (0.565 to 0.698) | 3.80% against 6.05%: 2.25 points fewer |
| Major bleeding | 0.48 (0.38 to 0.62) | 0.479 (0.375 to 0.611) | 1.03% against 2.14%: 1.12 points fewer |
| Heart attack | 1.11 (0.91 to 1.35) | 1.109 (0.915 to 1.345) | 1.55% against 1.40% |
| Stroke | 1.05 (0.79 to 1.39) | 1.053 (0.798 to 1.388) | 0.74% against 0.70% |

The crude ratios match the paper's for heart attack, major bleeding and stroke. For clinically relevant bleeding they differ (0.63 against 0.55). That is expected: adding up counts across trials ignores that the trials had different patients and follow-up, while a proper meta-analysis compares within each trial first. When trials disagree a lot (I² 79% here) the two can part company. It is a good reminder to pool trial by trial, as the Meta-analysis tool does.

**Check 3: how many patients for one bleed avoided?** From the crude counts, the NNT calculator gives **NNTB 44.4 (36.2 to 57.3)**: about 45 patients switched to a P2Y12 blocker alone for one fewer bleed needing care, over the trials' follow-up. For major bleeding it is **NNTB 89.6 (67.4 to 131.9)**. For heart attacks the interval crosses zero, so the tool reports it as running from benefit to harm, which is how a "no clear difference" looks in NNT terms.

The authors' own NNTs (12 for patients at high bleeding risk, 57 at high clot risk) are lower and come from a model of particular risk groups. The tool's *For a different baseline risk* box shows why: the same relative reduction (37% from the counts) gives an NNT of about 90 at 3% bleeding risk, 27 at 10% and 18 at 15% (Figure 2). Patients with a higher starting risk gain more.

<!-- fig:nnt -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="With the trials' relative reduction of 37%, the NNT falls from about 269 at 1% risk to 13 at 20%." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Patients to switch to prevent one bleed</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Patients to switch to prevent one bleed</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="201.5" y2="201.5" style="stroke:var(--line)"/><text x="52" y="205.5" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="100.5" y2="100.5" style="stroke:var(--line)"/><text x="52" y="104.5" text-anchor="end" style="fill:var(--muted)">150</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">200</text><line x1="160.7" x2="160.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="160.7" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="289.2" x2="289.2" y1="252" y2="256" style="stroke:var(--muted)"/><text x="289.2" y="269" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="417.6" x2="417.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="417.6" y="269" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Bleeding risk on DAPT over the trial period (%)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Number needed to treat</text><line x1="187.7" x2="187.7" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="191.7" y="62" text-anchor="start" style="fill:var(--muted)">trial DAPT arms 6.05%</text><path d="M58 -19.5L70.8 71L83.7 116.3L96.5 143.4L109.4 161.5L122.2 174.4L135.1 184.1L147.9 191.7L160.7 197.7L173.6 202.6L186.4 206.8L199.3 210.2L212.1 213.2L224.9 215.8L237.8 218.1L250.6 220.1L263.5 221.8L276.3 223.4L289.2 224.8L302 226.1L314.8 227.4L327.7 228.4L340.5 229.4L353.4 230.3L366.2 231.1L379.1 231.9L391.9 232.6L404.7 233.3L417.6 233.9L430.4 234.5L443.3 235L456.1 235.5L468.9 236L481.8 236.4L494.6 237L507.5 237.4L520.3 237.8L533.2 238.1L546 238.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 -82.9L70.8 28.7L83.7 84.5L96.5 118.1L109.4 140.4L122.2 156.4L135.1 168.3L147.9 177.6L160.7 185L173.6 191.1L186.4 196.1L199.3 200.5L212.1 204.1L224.9 207.4L237.8 210.2L250.6 212.6L263.5 214.8L276.3 216.8L289.2 218.5L302 220.1L314.8 221.6L327.7 222.9L340.5 224.1L353.4 225.2L366.2 226.2L379.1 227.2L391.9 228.1L404.7 228.9L417.6 229.7L430.4 230.4L443.3 231.1L456.1 231.7L468.9 232.3L481.8 232.9L494.6 233.4L507.5 233.9L520.3 234.3L533.2 234.8L546 235.2" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><path d="M58 20L70.8 97.4L83.7 136.1L96.5 159.2L109.4 174.6L122.2 185.7L135.1 194L147.9 200.5L160.7 205.6L173.6 209.8L186.4 213.3L199.3 216.3L212.1 218.9L224.9 221.1L237.8 223L250.6 224.7L263.5 226.2L276.3 227.6L289.2 228.8L302 229.9L314.8 230.9L327.7 231.8L340.5 232.7L353.4 233.4L366.2 234.1L379.1 234.8L391.9 235.4L404.7 236L417.6 236.5L430.4 237.1L443.3 237.5L456.1 238L468.9 238.4L481.8 238.8L494.6 239.1L507.5 239.5L520.3 239.8L533.2 240.1L546 240.4" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">NNT</text><line x1="105.6" x2="117.6" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:4 4"/><text x="121.6" y="40" style="fill:var(--muted)">95% limits</text></svg><figcaption>Figure 2. The NNT calculator's "different baseline risk" maths: the relative bleeding reduction from the pooled counts applied to other starting risks. An illustration of the method, not advice for any patient.</figcaption></figure>
<!-- /fig:nnt -->

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/aspirin-free-p2y12-monotherapy-pci-meta-analysis-bleeding-nnt.mjs` in fibub's public code. It calls:

- `parseStudies` and `metaAnalysis` from `src/lib/sci/meta.ts`, the maths behind the [[meta-analysis]] (the interval turned into a standard error on the log scale, then inverse-variance pooling and Cochran's Q).
- `compare` and `patientNNT` from `src/lib/sci/nnt.ts`, the maths behind the [[nnt-calculator]] (risks, risk ratio with log limits, Newcombe limits for the risk difference, and the NNT for another baseline risk).

Every input, the subgroup hazard ratios and the pooled event counts, is copied from the paper's Results text. Figure 2 applies the relative reduction from the crude counts to baseline risks we chose (1% to 20%); it illustrates the method and is not taken from the paper.

## How we test the maths

On every change to fibub, `tests/sci-tools/meta-analysis.mjs` and `tests/sci-tools/nnt-calculator.mjs` pin these functions against statsmodels and published formulas:

- The *Effect + CI* example (five hazard ratios) must pool to the values statsmodels gives, and a set of eight two-arm trials must give a random-effects odds ratio of **0.6475 (0.4462 to 0.9397)**, with **Q = 10.991** and **I² = 36.3%**.
- 30/250 against 50/250 must give a risk ratio of **0.6 (0.3953 to 0.9107)** and **NNTB 12.5 (6.94 to 64.0)**, the Altman (1998) limits.
- The same trial applied to a 40% baseline risk must give an NNT of **6.25 (4.13 to 28.0)**.

## Check it yourself

**The timing test, on the [[meta-analysis]]:**

1. Press **Effect + CI**.
2. Replace the example in the box with two rows (tab or comma between columns): `Immediate, 1.41, 1.01, 1.97` and `Early, 0.97, 0.76, 1.24`, under a header row such as `Group, HR, Lower, Upper`.
3. Keep *Interval in the papers* on **95 %** and the box **These are ratios (OR, RR, HR): pool on the log scale** ticked.
4. Set *Main result* to **Fixed effect**.
5. You should see *Fixed effect* about **1.105 (0.907 to 1.347)**, *Heterogeneity Q* about **3.134 (1 df), p = 0.077** and *I²* about **68.1 %**. Swap in `0.61, 0.28, 1.33` and `0.53, 0.46, 0.61` for bleeding: Q falls to 0.121.

**The NNT, on the [[nnt-calculator]]:**

1. In the first group type *Had the event* **527** and *Group size* **13865**; in the second, **840** and **13878**.
2. Leave *The event is* on **Bad (death, relapse)**.
3. The big result reads **NNTB 44.4 (round up: 45)**, with *Relative risk (RR)* **0.628 (0.565 to 0.698)**.
4. Type **10** in *Risk without treatment (%)*: *NNT for this risk* is about **26.9**.

## What researchers can use it for

- **Test a subgroup claim** from a paper's printed intervals with the [[meta-analysis]]: two subgroup estimates pooled with a fixed effect give the Q test for a difference between them.
- **Sanity-check a pooled table** by turning event counts into crude risk ratios with the [[odds-risk-ratio]] or [[nnt-calculator]], and spotting where crude pooling and trial-by-trial pooling part company.
- **Translate ratios into patients** for a guideline or teaching slide: NNT with honest limits, and for other baseline risks.
- **Plan the next trial**: the 2.25-point bleeding difference feeds straight into the [[sample-size]] tool.
- **Teach heterogeneity**: the bleeding result (I² 79%) shows why random effects and prediction intervals matter.

## The fine print

- The paper pooled hazard ratios trial by trial; we only had pooled counts and subgroup estimates, so our crude risk ratios are a check, not a replacement.
- The two timing subgroups contain different trials, so a difference between them may come from other differences between those trials, not only the timing.
- The paper reports the death count against a smaller DAPT total (12,655), so we left death out of the counts table.
- NNTs here are over each trial's own follow-up (mostly about a year) and for the trials' high-risk patients.
