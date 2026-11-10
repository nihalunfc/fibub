---
title: "PBO vs pyriproxyfen bed nets for malaria: Uganda cluster-randomised trial"
summary: "A 2025 open-access trial across 64 Ugandan communities found no clear difference in malaria between two newer types of insecticide net. Here is how to read a null result with an NNT calculator."
tools: [nnt-calculator, odds-risk-ratio, sample-size]
updated: 2026-11-10
sources:
  - "Gonahasa S, Namuganga JF, Nassali MJ et al. (2025), LLIN Evaluation in Uganda Project (LLINEUP2): Effect of long-lasting insecticidal nets (LLINs) treated with pyrethroid plus pyriproxyfen vs LLINs treated with pyrethroid plus piperonyl butoxide in Uganda: A cluster-randomised trial, PLOS Global Public Health 5(2): e0003558. Open access under the Creative Commons Attribution licence (CC BY 4.0), PLOS's licence for its articles; details checked in the DOAJ record, 2026-11-10."
  - "Altman DG (1998), Confidence intervals for the number needed to treat, BMJ 317: 1309-1312 (writing an NNT interval that crosses no effect)."
paper:
  title: "LLIN Evaluation in Uganda Project (LLINEUP2): Effect of long-lasting insecticidal nets (LLINs) treated with pyrethroid plus pyriproxyfen vs LLINs treated with pyrethroid plus piperonyl butoxide in Uganda: A cluster-randomised trial"
  authors: "Gonahasa S, Namuganga JF, Nassali MJ, Maiteki-Sebuguzi C, Nabende I et al."
  journal: "PLOS Global Public Health"
  year: 2025
  doi: "10.1371/journal.pgph.0003558"
  url: "https://doi.org/10.1371/journal.pgph.0003558"
  licence: "CC BY 4.0"
  reviewed: true
---

Insecticide-treated bed nets are one of the cheapest ways to cut malaria, but mosquitoes in much of Africa now shrug off the pyrethroid insecticides that ordinary nets carry. Two newer kinds of net add a second ingredient to get around that. A 2025 open-access trial in *PLOS Global Public Health* gave one kind or the other to 64 communities in Uganda during the national net campaign and followed them for two years. Malaria fell in both, and the trial found no clear difference between them. A "no difference" result is easy to misread, and the [[nnt-calculator]] is a good way to see what such a result does and does not rule out.

## What they found

Both groups started with roughly 675 clinic-diagnosed malaria episodes per 1,000 person-years. Two years after the nets arrived, the authors report about 465 per 1,000 in communities with one type of net and about 469 in communities with the other. The incidence rate ratio between the arms was 1.06, with a 95% confidence interval of 0.91 to 1.22, which includes 1 (no difference).

Surveys of children aged 2 to 10 told a similar story. The share carrying malaria parasites at 24 months was 26.1% in one arm and 29.5% in the other, and the odds ratio's interval (0.81 to 2.05) again included 1. A worrying side finding: two years on, only about 40% of households still had at least one net for every two people.

## Why it matters

Countries have to choose which nets to buy, and the two newer types cost more than plain ones. If neither is clearly better, price, supply and local mosquito resistance can guide the choice. The trial also suggests that nets wearing out or going missing may limit their benefit as much as the chemistry does, so how often nets are replaced deserves as much attention as which net is bought.

## How they did it

The two nets differ in their extra ingredient. One adds **piperonyl butoxide (PBO)**, which blocks the enzymes some mosquitoes use to break down pyrethroids. The other adds **pyriproxyfen**, an insect growth regulator that stops female mosquitoes that touch the net from laying eggs that hatch.

Rather than randomise people, the team randomised **clusters**: 64 communities around public health facilities in 32 districts, split equally between the two types of net. This design fits a national campaign and also captures community effects, because nets reduce mosquitoes for neighbours too. Malaria cases were counted from health facility records, and parasite prevalence came from household surveys.

## Check it yourself with fibub

The numbers below are **invented for practice**, rounded to look like a survey of this kind. They are not the trial's data.

1. Open the NNT calculator. In the first group, name it *Net type A*, set *Had the event* to 78 and *Group size* to 300 (26% of children carry parasites). In the control group, name it *Net type B*, with 90 out of 300 (30%).
2. Leave *The event is* on *Bad*, the interval on *Newcombe (score)* and confidence at 95%.
3. Read the top line: **NNTB 25**. If type A were truly 4 percentage points better, about 25 children would need to sleep under type A instead of type B to spare one infection at the time of the survey.
4. Now read the interval: it runs from **NNTB 8.99 through infinity to NNTH 31.4**. The risk difference is −4.0% with an interval of −11.1% to +3.2%, so the data fit type A being clearly better, no different, or somewhat worse. The relative risk is 0.867 (0.670 to 1.12), and the chi-square p is 0.28. This is what "no evidence of a difference" looks like.
5. Multiply both groups by ten: 780 out of 3,000 and 900 out of 3,000. The point estimate is still NNTB 25, but the interval shrinks to **NNTB 16.0 to 57.9** and p falls to about 0.0006. Same effect, more children, a firm answer. The [[sample-size]] tool works this out before a study starts, for two proportions and a chosen power.
6. Paste the same counts into the [[odds-risk-ratio]] tool to see the odds ratio (about 0.82 for the first version), which is how the trial reported its prevalence result.

## The fine print

- Our calculator treats every child as independent. In a cluster trial, children in the same community are alike, so real intervals are wider than this simple version gives. Cluster trials are analysed with methods that allow for this.
- The trial compared two new nets with each other, not with plain nets or with no nets, so it says nothing about how much either beats an ordinary net.
- Cases came from health facility records, which miss people who never visit a clinic.
- Mosquito resistance varies from place to place, so results in Uganda may not carry over elsewhere.
- Falling net coverage over two years weakens any comparison between the arms.
- This is general education about reading trial results, not health advice. For malaria prevention, follow your national health service, and read the paper for its exact methods and values.
