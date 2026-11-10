---
title: "Epidemic model: how SIR and SEIR curves rise, peak and fall"
summary: "How compartmental outbreak models work, what R0, the latent and infectious periods and contact cuts do to the curve, and a worked SIR example with vaccination."
tools: [epidemic-model, herd-immunity, epi-curve, plot-maker]
updated: 2026-11-10
sources:
  - "SIR model and its final-size relation: Kermack and McKendrick (1927), Proceedings of the Royal Society A 115: 700-721."
  - "SEIR and SEIRS models and the herd immunity threshold 1 − 1/R0: Anderson and May (1991), Infectious Diseases of Humans; Keeling and Rohani (2008), Modeling Infectious Diseases in Humans and Animals."
  - "The disease in the worked example is made up; its numbers come from the tool's own solver."
---

The epidemic model tool runs a small outbreak inside your browser. You describe a disease (how catching it is, how long people take to become infectious and how long they stay that way), choose a population and a vaccinated share, and it draws how many people are susceptible, exposed, infectious and immune on every day. It is meant for students of biology, public health and maths. It is a teaching model, not a forecast, and not medical advice. To work out the vaccine coverage that stops spread, open the [[herd-immunity]]; to draw a real outbreak from case dates, use the [[epi-curve]]; and to make your own charts from the daily numbers, try the [[plot-maker]].

## What it is

A **compartmental model** sorts every person into one box at a time and moves people between the boxes at set rates. The boxes are:

- **S**, susceptible: can still catch it.
- **E**, exposed: infected, but not yet passing it on (only in SEIR and SEIRS).
- **I**, infectious: can pass it on.
- **R**, recovered or immune, which also holds anyone vaccinated at the start.

New infections happen at the rate β S I / N, where N is the population. The **transmission rate** β is R0 / D, where **R0** is how many people one case infects when everyone is susceptible and D is the infectious period in days. Exposed people become infectious at the rate 1 / (latent period), and infectious people recover at the rate 1 / D. In SEIRS, immune people slowly drift back to S at the rate 1 / (immunity duration), so the disease can return.

The key number is the **R at the start**: R0 times the share susceptible. If it is above 1, each case more than replaces itself and cases grow. As S shrinks, the effective R falls, and when it drops below 1 the curve peaks and turns down. The **herd immunity threshold**, 1 − 1/R0, is the immune share at which that happens.

## How to use it

1. Pick **SIR**, **SEIR** or **SEIRS** in the Model box. The latent period box appears for SEIR and SEIRS, and "Immunity lasts" only for SEIRS.
2. Enter the **population**, **R0** and the **infectious period** in days, plus the **latent period** if the model has one.
3. Set the **initial infectious cases**, the **vaccinated at the start (%)** and the **days to run** (up to 3,650).
4. To test distancing or closures, type lines in **Interventions** as *from day, to day, % contact cut*. Cuts that overlap multiply together.
5. Read the result card: the peak day and peak size, the share infected during the run, the final-size answer, R at the start, the threshold and the share still susceptible. Two charts follow: the four boxes over time and new infections per day.
6. Use **Show as** to switch the charts between people and per cent, then download the daily numbers as CSV or the full report as an image, PDF or Word file.

## A worked example

Take a made-up illness in a town of **20,000 people**. Choose **SIR**, set **R0 = 1.8**, an **infectious period of 4 days**, **5 initial cases**, **0 % vaccinated** and **250 days**.

- Transmission rate: β = 1.8 ÷ 4 = **0.45 per day**; recovery rate γ = 1 ÷ 4 = **0.25 per day**.
- Herd immunity threshold: 1 − 1/1.8 = **44.4 %**.
- The tool puts the **peak on day 39.2** with **2,361 people infectious** at once (11.8 % of the town).
- By day 250, **73.3 %** have been infected, the same as the final-size equation, and 26.7 % never catch it.

Now vaccinate **25 %** at the start. R at the start drops to 1.8 × 14,995 ÷ 20,000 = **1.35**. The peak moves to **day 71.1** and shrinks to **558** infectious people, and only **35.2 %** of the town is infected over the run.

At **50 %** vaccinated, R at the start is **0.90**, below 1. The tool reports no outbreak: cases fall from day 0.

Back at 0 %, add the line `25, 55, 30` (contacts cut by 30 % from day 25 to day 55). During the cut, R0 is effectively 1.8 × 0.7 = 1.26. The peak comes slightly earlier, on **day 38.0**, but at only **825** people, and the total infected falls to **62.0 %**. By day 55 enough people are immune that it does not take off again.

Finally switch to **SEIR** with a **2-day latent period** and no cut. The peak slides to **day 66.7** and drops to **1,566**, but the final share infected stays at **73.3 %**. A latent stage slows an outbreak without changing how many it reaches.

## Where it is used

- **Public health teaching.** Courses use SIR and SEIR to explain R, peaks and herd immunity before moving to models with age groups and contact surveys.
- **Planning exercises.** Comparing peak size with and without a contact cut shows why spreading cases out matters for hospital beds, even when the total barely moves.
- **Ecology and animal health.** The same equations describe diseases in livestock, wildlife and plants.

## Common mistakes

- **Treating the curve as a prediction.** Real outbreaks depend on age, places, testing and behaviour. Use the model to compare scenarios, not to forecast a date.
- **Stopping the run too early.** If the result says "still rising at the end", raise the days to run before reading the peak.
- **Expecting a contact cut to end an outbreak.** A short cut started early often only delays the peak. Try different start days and lengths to see the difference.

## Questions people ask

**Why does a latent period change the peak but not the total?** It delays each generation of cases, so the curve stretches out. Each case still infects the same number of people on average, so the final size stays the same.

**What happens if immunity wears off?** Pick SEIRS and run for a few years. People return to the susceptible box, and the outbreak comes back in smaller waves until it settles at a steady level.
