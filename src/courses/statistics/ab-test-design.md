---
title: Designing an A/B test
summary: 'The parts of a good online experiment: a clear hypothesis, the unit you randomise, a fair random split, one primary metric, a planned sample size and duration, and a written decision rule, all fixed before the test starts.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Why randomise who sees the new version instead of letting users opt in?'
    choices: ['Random is faster', 'Opt-in users differ from others (keener, more active), so any difference could be them, not the change', 'Opt-in is illegal']
    ans: 1
    why: 'Randomisation spreads every other cause evenly across groups, so the only systematic difference is the change.'
  - q: 'A pricing test randomises page views, so one customer can see both prices. What is the problem?'
    choices: ['None', 'The unit is wrong: the same customer is in both groups, which mixes the effects and can annoy customers', 'Page views are too many']
    ans: 1
    why: 'Randomise the unit that experiences the change (usually the user or account) so each person sees one version throughout.'
  - q: 'What should be written down before an A/B test starts?'
    choices: ['Only the hypothesis', 'Hypothesis, primary metric, sample size and duration, and the decision rule', 'Nothing, it is better to stay flexible']
    ans: 1
    why: 'Fixing these in advance prevents peeking, metric shopping and moving goalposts, the commonest ways tests go wrong.'
---

**Module 7 · about 25 minutes · no new maths.** You'll be able to design an A/B test: state a hypothesis, choose the randomisation unit and metric, and write a plan that holds up when the results come in.

## 1. Why experiments

Observational data (Lesson 4.2) is full of self-selection: customers who use a feature differ from those who don't. An **A/B test** (randomised controlled experiment) removes that problem by letting chance decide who gets the change.

<!--fig:ab-flow-->

## 2. The parts of a design

**1. Hypothesis.** "Showing delivery dates on product pages will raise purchase conversion, because uncertainty about delivery stops people buying." A *because* gives you something to learn even if the test loses.

**2. Randomisation unit.** Who gets assigned: user, account, session, store, region. Choose the unit that experiences the change and that you analyse. Usually the **user**: assigned by a stable ID so they see the same version on every visit. If you randomise users, analyse per user (not per page view), or the standard errors are wrong.

**3. Population and trigger.** Who is eligible (all visitors? logged-in? Canada only?), and when does someone count as "in" the test? Only include people who could see the difference, such as visitors who reached checkout for a checkout change. Including others adds noise.

**4. Split.** Usually 50/50 for the most power. A smaller treatment share (10 %) limits risk but needs a longer test.

**5. Metrics.** One primary metric, a few secondary, and guardrails (next lesson).

**6. Sample size and duration.** From the baseline, the smallest worthwhile effect and power (Lesson 7.3). Run **whole weeks** (weekday and weekend behaviour differ) and at least one full business cycle.

**7. Decision rule.** Written before launch: "Ship if the 95 % CI for the conversion lift is above 0 and no guardrail worsens significantly; otherwise keep the current page."

## 3. Before launch

- **A/A test** (both groups get the same version) to check the pipeline: you should see no difference and a correct split.
- **Check the assignment** is random and stable: the split should match the plan (Lesson 7.6).
- **Freeze** the plan in a document with a date.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** with random assignment, the expected difference between groups in *anything* other than the treatment is zero, so the measured difference estimates the treatment's causal effect.

**Equation:** average treatment effect

```math
\text{ATE} = E[Y \mid B] - E[Y \mid A]
```

estimated by `$\bar{y}_B - \bar{y}_A$` with standard error `$\sqrt{s_A^2/n_A + s_B^2/n_B}$` (Lesson 4.4).

**Hashing:** a common way to assign users stably is `hash(user_id + test_name) mod 100 < 50 → B`. Including the test name keeps different tests' assignments independent.
</details>

## 4. Worked example

*Made-up plan* for "show delivery dates":

| Item | Plan |
|---|---|
| Hypothesis | Delivery dates raise purchase conversion by reducing uncertainty |
| Unit | Logged-in user, hashed ID, 50/50 |
| Trigger | User views a product page during the test |
| Primary metric | Share of triggered users who purchase within 7 days |
| Secondary | Add-to-cart rate; average order value |
| Guardrails | Cancellations; "where is my order" contacts; page load time |
| Baseline / MDE | 4.0 %; smallest worthwhile lift +10 % relative (to 4.4 %) |
| Size / duration | About 39,500 users per group; at 6,000 eligible users a day, 14 days (2 full weeks) |
| Decision rule | Ship if 95 % CI for lift > 0 and no guardrail worse at p < 0.05 |

## 5. Practice

1. A store tests a new shelf layout. What is a sensible randomisation unit, and why not the customer?
2. Why should a checkout test only include users who reach checkout?
3. Write a decision rule for a test whose goal is "don't hurt revenue while simplifying the menu".

<details>
<summary>Answers</summary>

1. The store (or store-week): customers can't be shown different shelves in the same store. With store-level randomisation, analyse per store, and you'll need many stores.
2. Users who never reach checkout can't be affected; including them adds noise and dilutes the effect, so you need more traffic for the same power.
3. Example: "Ship the simpler menu if the 95 % CI for the change in revenue per user is above −1 % (a non-inferiority test) and support contacts don't rise."
</details>

**Try it on your own data:** the [[sample-size]] calculator plans the test size; the [[bayesian-ab-test]] tool reads finished tests.

**New words:** *A/B test*, *randomised controlled experiment*, *randomisation unit*, *trigger*, *A/A test*, *decision rule*, *average treatment effect*, *non-inferiority*.
