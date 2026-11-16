---
title: "1RM prediction equations: accuracy before and after 16 weeks of resistance training"
summary: "A study of 119 young adults tested nine one-rep max formulas against real 1RM tests in the bench press, squat and arm curl. We put the formulas side by side with fibub's One-rep max calculator."
tools: [one-rep-max]
updated: 2026-11-16
sources:
  - "Ribeiro, A., da Silva, J. A., Nascimento, M., Martinho, D., dos Santos, L., de Salles, B., Mayhew, J. and Cyrino, E. S. (2024), Accuracy of 1RM Prediction Equations Before and After Resistance Training in Three Different Lifts, International Journal of Strength and Conditioning 4(1), doi:10.47206/ijsc.v4i1.327. Licence CC BY 4.0, checked in the article on the journal site, 2026-11-16. Values used here: 62 women and 57 men; 16 weeks of supervised training; test set at 80 % of 1RM to failure, about 10 reps; nine equations (Adams, Brown, Brzycki, Lander, Lombardi, Mayhew, O'Connor, Wathen, Welday)."
  - "Formulas as used by the One-rep max calculator: Epley (1985), Brzycki (1993), Lombardi (1989), O'Connor et al. (1989), Wathen (1994), Mayhew et al. (1992), Lander (1985)."
paper:
  title: "Accuracy of 1RM Prediction Equations Before and After Resistance Training in Three Different Lifts"
  authors: "Ribeiro, A.; da Silva, J. A.; Nascimento, M.; Martinho, D.; dos Santos, L.; de Salles, B.; Mayhew, J.; Cyrino, E. S."
  journal: "International Journal of Strength and Conditioning"
  year: 2024
  doi: "10.47206/ijsc.v4i1.327"
  url: "https://journal.iusca.org/index.php/Journal/article/view/327"
  licence: "CC BY 4.0"
  reviewed: true
---

Testing a true **one-rep max** (1RM), the heaviest weight you can lift once, is tiring and carries some risk, so coaches often estimate it instead: lift a lighter weight as many times as you can, then put the weight and the reps into a formula. There are many such formulas, named after the people who wrote them: Epley, Brzycki, Lombardi and others. A study from Brazil asked which ones actually work, for which lifts, for men and for women, and whether they still work after months of training. This article lines the formulas up with the [[one-rep-max]] calculator, which shows seven of them side by side.

## The paper in brief

The team tested 119 young adults (62 women and 57 men, around 22 years old) who were new to structured training. Each did a real 1RM test in three lifts: the **bench press**, the **squat** and the **arm curl**. Each also did one set at **80 % of their 1RM** until they could not do another rep, which came to about 10 reps. The weight and reps from that set went into **nine formulas**, and the estimates were compared with the real 1RM. Everyone then trained for **16 weeks** under supervision, and the whole test was repeated.

The findings, in short:

- **Men:** the **Lombardi** formula matched the real 1RM in the bench press and the squat, both before and after training. No formula matched in the arm curl.
- **Women:** the **Brown**, **Brzycki** and **Lander** formulas matched in the bench press and the squat; **Mayhew**, **Wathen** and **Welday** matched in the arm curl.
- Getting stronger did not spoil the formulas that worked: the good ones stayed good after 16 weeks.

The message: no one formula suits every lift and every person, so it helps to see several at once.

## Checked with the tools

We did not have the study's per-person data, so we did not redo its statistics. What we **recomputed** is what the formulas themselves say, using the exact functions in fibub's One-rep max calculator. Seven of the paper's nine formulas are in the tool (Brzycki, Lander, Lombardi, Mayhew, O'Connor, Wathan, which the paper spells Wathen, plus Epley, which the paper did not test); Adams, Brown and Welday are not.

**Step 1: what each formula adds.** Every formula turns "this load for this many reps" into "the 1RM is this many percent of the load". Figure 1 draws that for 1 to 15 reps. For 2 or 3 reps they agree within a few percent. By 10 reps they spread from **125 % (O'Connor)** to **135 % (Wathan)**.

<!-- fig:curves -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Seven 1RM formulas agree for a few reps and spread apart as reps rise; at 10 reps they range from 125 to 135 % of the load." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>What each formula adds on top of the weight you lifted</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">What each formula adds on top of the weight you lifted</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="198" y2="198" style="stroke:var(--line)"/><text x="52" y="202" text-anchor="end" style="fill:var(--muted)">120</text><line x1="58" x2="546" y1="124" y2="124" style="stroke:var(--line)"/><text x="52" y="128" text-anchor="end" style="fill:var(--muted)">140</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">160</text><line x1="110.3" x2="110.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="110.3" y="289" text-anchor="middle" style="fill:var(--muted)">2.5</text><line x1="197.4" x2="197.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="197.4" y="289" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="284.6" x2="284.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="284.6" y="289" text-anchor="middle" style="fill:var(--muted)">7.5</text><line x1="371.7" x2="371.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="371.7" y="289" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="458.9" x2="458.9" y1="272" y2="276" style="stroke:var(--muted)"/><text x="458.9" y="289" text-anchor="middle" style="fill:var(--muted)">12.5</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Reps done to near failure</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Estimated 1RM (% of load)</text><line x1="58" x2="546" y1="179.5" y2="179.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="174.5" text-anchor="end" style="fill:var(--muted)">80 % load</text><path d="M58 272L92.9 247.3L127.7 235L162.6 222.7L197.4 210.3L232.3 198L267.1 185.7L302 173.3L336.9 161L371.7 148.7L406.6 136.3L441.4 124L476.3 111.7L511.1 99.3L546 87" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 272L92.9 261.4L127.7 250.2L162.6 238.4L197.4 225.8L232.3 212.3L267.1 198L302 182.7L336.9 166.3L371.7 148.7L406.6 129.7L441.4 109.2L476.3 87L511.1 62.9L546 36.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 272L92.9 245.4L127.7 229L162.6 217L197.4 207.4L232.3 199.4L267.1 192.5L302 186.5L336.9 181.1L371.7 176.2L406.6 171.7L441.4 167.6L476.3 163.8L511.1 160.3L546 156.9" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><path d="M58 262.8L92.9 253.5L127.7 244.3L162.6 235L197.4 225.8L232.3 216.5L267.1 207.3L302 198L336.9 188.8L371.7 179.5L406.6 170.3L441.4 161L476.3 151.8L511.1 142.5L546 133.3" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><path d="M58 267.2L92.9 252.9L127.7 238.8L162.6 224.6L197.4 210.7L232.3 196.8L267.1 183.1L302 169.6L336.9 156.4L371.7 143.4L406.6 130.8L441.4 118.5L476.3 106.5L511.1 94.9L546 83.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 239.2L92.9 229.7L127.7 220.2L162.6 210.9L197.4 201.7L232.3 192.6L267.1 183.6L302 174.7L336.9 166.1L371.7 157.6L406.6 149.2L441.4 141L476.3 133L511.1 125.3L546 117.6" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 266.9L92.9 256.4L127.7 245.4L162.6 233.7L197.4 221.3L232.3 208.1L267.1 194.1L302 179.1L336.9 163.1L371.7 145.9L406.6 127.5L441.4 107.7L476.3 86.2L511.1 63L546 37.8" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Epley</text><line x1="120" x2="132" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="136" y="40" style="fill:var(--muted)">Brzycki</text><line x1="196.4" x2="208.4" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="212.4" y="40" style="fill:var(--muted)">Lombardi</text><line x1="280" x2="292" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2"/><text x="296" y="40" style="fill:var(--muted)">O'Connor</text><line x1="363.6" x2="375.6" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="379.6" y="40" style="fill:var(--muted)">Wathan</text><line x1="432.8" x2="444.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="448.8" y="40" style="fill:var(--muted)">Mayhew</text><line x1="502" x2="514" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="518" y="40" style="fill:var(--muted)">Lander</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The seven formulas in the One-rep max calculator, each turned into "estimated 1RM as a share of the load". The dashed line is 125 %, the answer if the load really was 80 % of the 1RM. Recomputed from the formulas; no paper data.</figcaption></figure>
<!-- /fig:curves -->

**Step 2: the paper's test set.** If a load really is 80 % of your 1RM, the right answer is 1 ÷ 0.8 = **125 %** of the load (the dashed line). At 10 reps, Lombardi gives **125.9 %** and O'Connor **125 %**, right on it; Epley and Brzycki give **133.3 %**, Lander 134.1 %, Wathan 134.7 % and Mayhew 130.9 %. That fits the paper's finding that Lombardi matched for the men's bench press and squat. Turned round, the formulas expect someone at 80 % to manage between **7.3 reps (Wathan)** and **10 reps (O'Connor)**: Epley 7.5, Mayhew 7.5, Lander 8.0, Brzycki 8.2, Lombardi 9.3. People who can do more reps at 80 % than a formula expects will be over-estimated by it.

**Step 3: one made-up lifter.** Figure 2 takes our own example, **60 kg for 10 reps**, through the tool. The estimates run from **75.0 kg (O'Connor)** and **75.5 kg (Lombardi)** to **80.0 kg (Epley, Brzycki)**, **80.4 kg (Lander)** and **80.8 kg (Wathan)**. If 10 reps really were 80 %, the true 1RM would be 75 kg, so the spread between formulas, about 6 kg, is as big as the training gain many beginners make in a month.

<!-- fig:example -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="For 60 kg done 10 times the formulas give 75.0 to 80.8 kg." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>One set of 60 kg for 10 reps, seven estimates</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">One set of 60 kg for 10 reps, seven estimates</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--line)"/><text x="52" y="238" text-anchor="end" style="fill:var(--muted)">70</text><line x1="58" x2="546" y1="191.9" y2="191.9" style="stroke:var(--line)"/><text x="52" y="195.9" text-anchor="end" style="fill:var(--muted)">72.5</text><line x1="58" x2="546" y1="149.8" y2="149.8" style="stroke:var(--line)"/><text x="52" y="153.8" text-anchor="end" style="fill:var(--muted)">75</text><line x1="58" x2="546" y1="107.8" y2="107.8" style="stroke:var(--line)"/><text x="52" y="111.8" text-anchor="end" style="fill:var(--muted)">77.5</text><line x1="58" x2="546" y1="65.7" y2="65.7" style="stroke:var(--line)"/><text x="52" y="69.7" text-anchor="end" style="fill:var(--muted)">80</text><line x1="92.9" x2="92.9" y1="234" y2="238" style="stroke:var(--muted)"/><text x="92.9" y="251" text-anchor="middle" style="fill:var(--muted)">Epley</text><line x1="162.6" x2="162.6" y1="234" y2="238" style="stroke:var(--muted)"/><text x="162.6" y="251" text-anchor="middle" style="fill:var(--muted)">Brzycki</text><line x1="232.3" x2="232.3" y1="234" y2="238" style="stroke:var(--muted)"/><text x="232.3" y="251" text-anchor="middle" style="fill:var(--muted)">Lombardi</text><line x1="302" x2="302" y1="234" y2="238" style="stroke:var(--muted)"/><text x="302" y="251" text-anchor="middle" style="fill:var(--muted)">O'Con.</text><line x1="371.7" x2="371.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="371.7" y="251" text-anchor="middle" style="fill:var(--muted)">Wathan</text><line x1="441.4" x2="441.4" y1="234" y2="238" style="stroke:var(--muted)"/><text x="441.4" y="251" text-anchor="middle" style="fill:var(--muted)">Mayhew</text><line x1="511.1" x2="511.1" y1="234" y2="238" style="stroke:var(--muted)"/><text x="511.1" y="251" text-anchor="middle" style="fill:var(--muted)">Lander</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Formula</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Estimated 1RM (kg)</text><line x1="58" x2="546" y1="149.8" y2="149.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="144.8" text-anchor="end" style="fill:var(--muted)">75 kg if 10 reps = 80 %</text><circle cx="92.9" cy="65.7" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="162.6" cy="65.7" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="232.3" cy="140.7" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="149.8" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="371.7" cy="51.4" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="441.4" cy="89.9" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="511.1" cy="58.3" r="5" style="fill:var(--c-blog);opacity:1"/><text class="fibub-mark" x="546" y="272" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. A made-up lifter: 60 kg for 10 reps, through each formula. The dashed line is 75 kg, what the paper's 80 % set implies. An illustration, not the study's measurements.</figcaption></figure>
<!-- /fig:example -->

| Check | Paper | Our tool result |
|---|---|---|
| Lombardi suits a set of about 10 reps at 80 % (men, bench and squat) | matched the real 1RM | 125.9 % of the load at 10 reps, against 125 % expected |
| Brzycki and Lander suit women's bench and squat | matched the real 1RM | 133.3 % and 134.1 % at 10 reps, so these women likely did fewer than 10 reps |
| Formulas disagree more as reps rise | implied by the lift-by-lift results | spread 106 to 114 % at 3 reps, 125 to 135 % at 10 |
| One formula for everyone | no | seven estimates from 75.0 to 80.8 kg for the same set |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/one-rep-max-prediction-equations-accuracy-before-after-training.mjs` in fibub's public code. It calls `FORMULAS` (the functions `epley`, `brzycki`, `lombardi`, `oconnor`, `wathan`, `mayhew` and `lander`) from `src/lib/everyday/body.ts`, the maths behind the One-rep max calculator.

Where the inputs come from: the 80 % load and "about 10 reps" are from the paper. The 60 kg lifter is **our own made-up example**, not a participant. Figure 1 is recomputed from the formulas alone; Figure 2 is an illustration. Neither shows the study's measurements, and we copied none of its tables.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/one-rep-max.mjs`, which checks each formula against arithmetic done by hand:

- 60 kg for 10 reps must give **80 kg** by Epley (60 × (1 + 10/30)) and by Brzycki (60 × 36 / 27).
- Lombardi must give 60 × 10^0.1 = **75.536 kg**, and O'Connor 60 × 1.25 = **75 kg**.
- Wathan must give **80.848**, Mayhew **78.560** and Lander **80.442 kg**.
- One rep must return the load itself, Brzycki must refuse 37 reps or more, and Epley turned round must give 60 kg for 10 reps from an 80 kg max.

`tests/everyday.mjs` also pins Epley (116.667) and Brzycki (112.5) for 100 kg × 5.

## Check it yourself

On the [[one-rep-max]] calculator:

1. Type **60** in *Weight lifted* and leave the unit on **kg**.
2. Type **10** in *Reps done (to near failure)*.
3. Set *Round the table to* to **No rounding (0.1)**.
4. Under **All formulas** it lists Epley **80.0**, Brzycki **80.0**, Lombardi **75.5**, O'Connor **75.0**, Wathan **80.8**, Mayhew **78.6** and Lander **80.4** kg.
5. Change the reps to **3** and watch the formulas close up; change them to **15** and watch them spread.
6. Under **What can I lift for a number of reps?**, type **10** in *Reps wanted* to see about **60 kg**: the tool takes the average of Epley and Brzycki (80 kg) and turns Epley round.

## What researchers can use it for

- **Compare formulas at a glance** for a given load and rep count before choosing one for a study or a team.
- **See where formulas part ways**: plan test sets with few reps (3 to 5) when you need formulas to agree.
- **Check a reported estimate** in a paper or a training log by re-running the load and reps through each formula.
- **Teach** why a "% of 1RM" table is only a rule of thumb, and why the reps people manage at 80 % differ between lifts and between people.
- **Set training loads**: use the reps table to turn an estimated max into working weights.

## The fine print

- The study tested young, untrained adults; trained lifters, older adults and other lifts may suit different formulas.
- "Matched" in the paper means no statistically significant difference on average; any one person's estimate can still be several kilograms out.
- Three of the paper's formulas (Adams, Brown, Welday) are not in the calculator.
- Our 125 % line assumes the test set was exactly 80 % of the 1RM; in the study it was 80 % of each person's measured 1RM, and the reps people managed varied.
- Lift only with good technique, and test a true max only with a spotter or with a coach.
