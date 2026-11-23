---
title: Probability
seoTitle: 'Probability Class 12 notes: Bayes theorem and binomial'
summary: 'Class 12 Probability with animations: conditional probability, independence, total probability, Bayes, random variables and the binomial distribution.'
minutes: 100
updated: 2026-11-22
quiz:
  - q: 'P(A) = 0.5, P(B) = 0.4 and P(A ∩ B) = 0.2. Then P(A | B) is:'
    choices: ['0.5', '0.4', '0.2', '0.8']
    ans: 0
    why: 'P(A | B) = P(A ∩ B)/P(B) = 0.2/0.4 = 0.5. It equals P(A), so A and B are independent.'
  - q: 'A fair coin is tossed 4 times. The probability of exactly 2 heads is:'
    choices: ['3/8', '1/4', '1/2', '5/16']
    ans: 0
    why: 'C(4, 2) (1/2)² (1/2)² = 6/16 = 3/8.'
  - q: 'Machine X makes 60% of the items with 2% defective, machine Y makes 40% with 5% defective. An item is found defective. The probability it came from X is:'
    choices: ['3/8', '5/8', '1/2', '3/5']
    ans: 0
    why: 'P(X and D) = 0.6 × 0.02 = 0.012; P(Y and D) = 0.4 × 0.05 = 0.020; P(D) = 0.032. So P(X | D) = 0.012/0.032 = 3/8.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 13 “Probability” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Bayes, T. (1763), “An Essay towards solving a Problem in the Doctrine of Chances”, Philosophical Transactions of the Royal Society 53, 370-418 (published by Richard Price after Bayes died).'
  - 'Bernoulli, J., Ars Conjectandi (Basel, 1713): Bernoulli trials and the law of large numbers.'
  - 'Every worked example was recomputed a second way (counting out of 1000 or 10000 items, or by listing every sequence).'
---

**Maths · Class 12 · Chapter 13 · about 100 minutes.** By the end you will be able to find the probability of one event given another, use the multiplication theorem and independence, split a problem into causes with total probability, reverse it with Bayes' theorem, work with random variables and their means, and use the binomial distribution for repeated trials.

<div class="bigidea">Probability changes when you learn something. If you know the first card was an ace, the chance the second is an ace is different from before. Conditional probability is the rule for updating, and Bayes' theorem turns it round: from “how likely is this evidence if the cause is true” to “how likely is the cause now that I see the evidence”. When trials are repeated and independent, the same ideas give the binomial distribution.</div>

## 1. Conditional probability

The probability of event A **given** that B has happened is

```math
P(A \mid B) = \frac{P(A\cap B)}{P(B)},\qquad P(B) \neq 0
```

<div class="meaning">

<dl>
<dt>P(A | B)</dt><dd>“Probability of A given B.” The chance of A once we know B has happened.</dd>
<dt>P(A ∩ B)</dt><dd>The chance that both happen.</dd>
<dt>Dividing by P(B)</dt><dd>B becomes the new sample space: we only look at the outcomes where B happened and ask what fraction of them also have A.</dd>
<dt>Physical meaning</dt><dd>If it is cloudy (B) in Mumbai in July, rain (A) is more likely than on a random day. Knowing B shrinks the world to cloudy days.</dd>
</dl>

</div>

Dots are equally likely outcomes. Set the sizes of A and B and how much they overlap, then switch to “given B” and see the sample space shrink to B:

<figure class="fig" data-fig="c12m-prob-cond"><figcaption>200 equally likely outcomes. Blue is A only, orange is B only, green is both. In “given B” mode only the B dots remain, and P(A | B) is the fraction of them that are green.</figcaption></figure>

<div class="problem" data-problem="c12m-prob-cond"></div>

<div class="myth">

**“P(A | B) and P(B | A) are the same.”** They are usually different. Most people with a cough do not have TB (P(TB | cough) is small), but most people with TB do cough (P(cough | TB) is large). Mixing these up is the “prosecutor's fallacy”.

</div>

Properties: `$P(S\mid B) = 1$`; `$P(A'\mid B) = 1 - P(A\mid B)$`; `$P((A\cup C)\mid B) = P(A\mid B) + P(C\mid B) - P((A\cap C)\mid B)$`.

## 2. Multiplication theorem

Rearranging the definition gives the rule for “both happen”:

```math
P(A\cap B) = P(A)\,P(B\mid A) = P(B)\,P(A\mid B)
```

For three events, `$P(A\cap B\cap C) = P(A)\,P(B\mid A)\,P(C\mid A\cap B)$`. Along a **probability tree** you multiply along a path and add paths. A bag has 4 red and 6 blue marbles and two are drawn without replacement:

<div class="steps" data-fig="c12m-prob-tree">
<div class="step">First draw: P(red) = 4/10 and P(blue) = 6/10.</div>
<div class="step">After a red one has gone, 3 red and 6 blue remain: the second draw is red with 3/9 and blue with 6/9.</div>
<div class="step">After a blue one has gone, 4 red and 5 blue remain: red with 4/9 and blue with 5/9.</div>
<div class="step">Multiply along a path: P(red then red) = 4/10 × 3/9 = 12/90 = 2/15.</div>
<div class="step">“One of each colour” has two paths (RB and BR). Add them: 24/90 + 24/90 = 48/90 = 8/15.</div>
<div class="step">All four paths add up to 1: 12/90 + 24/90 + 24/90 + 30/90.</div>
</div>

<div class="problem" data-problem="c12m-prob-twodraws"></div>

Build and read your own trees:

<!--fig:tool probability-tree-->

## 3. Independent events

Events A and B are **independent** if knowing one tells you nothing about the other: `$P(B\mid A) = P(B)$`, which is the same as

```math
P(A\cap B) = P(A)\,P(B)
```

Two tosses of a coin, or a die thrown today and a die thrown tomorrow, are independent. Drawing two cards without replacement are not: the first card changes what is left. Below, B fills the same share of A and of the rest exactly when they are independent:

<figure class="fig" data-fig="c12m-prob-indep"><figcaption>The unit square is the sample space. Change P(A), P(B) and P(A ∩ B). When P(A ∩ B) equals P(A) P(B), B fills the same fraction of “A” and “not A” and the events are independent. The button snaps to that point.</figcaption></figure>

<div class="problem" data-problem="c12m-prob-indep"></div>

Facts: if A and B are independent, so are A and B′, A′ and B, A′ and B′. Three events are independent only if every pair and the triple multiply. And **independent is not the same as mutually exclusive**: if A and B cannot both happen (and both have non-zero probability), knowing A happened tells you B did not, so they are dependent.

<div class="myth">

**“Mutually exclusive events are independent.”** They are the opposite: if A happens, B surely does not. Independence means `$P(A\cap B) = P(A)P(B)$`, while mutually exclusive means `$P(A\cap B) = 0$`. Both hold only if one of the events has probability 0.

</div>

## 4. Total probability and Bayes' theorem

A **partition** of the sample space is a set of events `$E_1, E_2, \dots, E_n$` that cannot overlap and together cover everything (for example “which of three machines made this bolt”). For any event A:

```math
P(A) = \sum_{i=1}^{n} P(E_i)\,P(A\mid E_i)\qquad\text{(total probability)}
```

and **Bayes' theorem** reverses the conditioning:

```math
P(E_i\mid A) = \frac{P(E_i)\,P(A\mid E_i)}{\sum_{j=1}^{n} P(E_j)\,P(A\mid E_j)}
```

<div class="meaning">

<dl>
<dt>P(Eᵢ)</dt><dd>The **prior**: how likely cause i was before you saw anything (machine i's share of output).</dd>
<dt>P(A | Eᵢ)</dt><dd>The **likelihood**: how likely the evidence is if cause i is true (machine i's defect rate).</dd>
<dt>P(Eᵢ | A)</dt><dd>The **posterior**: how likely cause i is now that the evidence A has been seen.</dd>
<dt>Physical meaning</dt><dd>Bayes shares out the blame for the evidence in proportion to how much each cause contributes to it.</dd>
</dl>

</div>

Play with shares and defect rates below. The middle bars add up to P(A) (total probability); the bottom bar is each machine's share of the blame (Bayes).

<figure class="fig" data-fig="c12m-prob-total"><figcaption>Three machines. Top: share of all items. Middle: the defective part of each (wide means more items, tall means more defects per item). Bottom: given that an item is defective, the share of each machine. Change the sliders and watch the blame shift.</figcaption></figure>

The easiest way to do a Bayes problem is to imagine 1000 items and count:

<div class="steps" data-fig="c12m-prob-bayessteps">
<div class="step">Machines M1, M2, M3 make 50%, 30% and 20% of the items. Out of 1000 items that is 500, 300 and 200.</div>
<div class="step">Their defect rates are 2%, 3% and 5%: 10, 9 and 10 defective items.</div>
<div class="step">In all 10 + 9 + 10 = 29 items are defective, so P(defective) = 29/1000. This is total probability.</div>
<div class="step">Pick one of the 29 defective items. 10 of them are from M1, 9 from M2, 10 from M3, so P(M1 | D) = 10/29.</div>
<div class="step">The same in symbols: P(M1 | D) = (0.5 × 0.02)/(0.5×0.02 + 0.3×0.03 + 0.2×0.05) = 0.01/0.029 = 10/29.</div>
</div>

<div class="problem" data-problem="c12m-prob-total"></div>

<div class="problem" data-problem="c12m-prob-bayes"></div>

A medical test is the classic case: a rare disease and a good but imperfect test. A thousand dots show why a positive result is often a false alarm:

<figure class="fig" data-fig="@math-bayes-dots"><figcaption>A thousand people. Change how common the condition is and how good the test is: the dots show the true and false positives, and P(condition | positive).</figcaption></figure>

<div class="myth">

**“The test is 99% accurate, so a positive result means a 99% chance I have it.”** Only if the condition is common. When it is rare, most positives come from the many healthy people with a small false-alarm rate. The prior matters, and Bayes' theorem is how to include it.

</div>

<div class="history">

- **1713:** Jacob Bernoulli's book on chances is published after his death: Bernoulli trials and the law of large numbers.
- **1763:** The Reverend Thomas Bayes's essay is read to the Royal Society by his friend Richard Price, two years after Bayes died. It contains the theorem that now carries his name.
- **Today:** spam filters, medical diagnosis and weather forecasts are updated with Bayes' rule every day.

</div>

## 5. Random variables and their distributions

A **random variable** X is a rule that gives each outcome a number: “the number of heads in 3 tosses”, “the sum of two dice”, “the winnings in a game”. Its **probability distribution** lists each value `$x_i$` and its probability `$p_i = P(X = x_i)$`, with every `$p_i \ge 0$` and `$\sum p_i = 1$`.

The **mean** (expected value) is the long-run average:

```math
E(X) = \mu = \sum x_i\,p_i
```

<div class="meaning">

<dl>
<dt>E(X)</dt><dd>Multiply each value by its probability and add. It need not be a value X can actually take (the mean of one die is 3.5).</dd>
<dt>Physical meaning</dt><dd>The balance point of the bars. If you repeat the experiment many times, the average of the results settles onto E(X): the law of large numbers.</dd>
</dl>

</div>

Choose an experiment, press “Run” a few times, then run 500 trials and watch the orange (what happened) settle onto the blue (what the theory says), with the average settling onto E(X):

<figure class="fig" data-fig="c12m-prob-rv"><figcaption>Three random variables: heads in 3 tosses, the sum of two dice and the larger of two dice. Blue bars are the exact distribution, orange bars are simulated results, the dashed line is E(X).</figcaption></figure>

<!--fig:tool random-variable-->

<div class="problem" data-problem="c12m-prob-mean"></div>

Beyond the syllabus: the **variance** `$\mathrm{Var}(X) = \sum (x_i - \mu)^2p_i = E(X^2) - \mu^2$` and the standard deviation measure how spread out X is. Check your school's syllabus whether they are asked; for the binomial distribution below, `$\mathrm{Var}(X) = npq$`.

## 6. Bernoulli trials and the binomial distribution

A **Bernoulli trial** has exactly two outcomes, success (probability p) and failure (probability `$q = 1 - p$`): a throw at the stumps hits or misses, a seed sprouts or not. **Bernoulli trials** are repeated, independent trials with the same p each time. If X is the number of successes in n trials, X follows the **binomial distribution** B(n, p):

```math
P(X = k) = \binom{n}{k}p^k q^{\,n-k},\quad k = 0, 1, \dots, n,\qquad E(X) = np
```

Where it comes from, for 3 throws with p = 0.4:

<div class="steps" data-fig="c12m-prob-binsteps">
<div class="step">Three independent throws. Write S for a hit and F for a miss: there are 2³ = 8 sequences.</div>
<div class="step">Each sequence's probability is found by multiplying: every S gives 0.4 and every F gives 0.6.</div>
<div class="step">Group the sequences by the number of hits k.</div>
<div class="step">The number of sequences in each group is C(3, k): 1, 3, 3, 1.</div>
<div class="step">So P(X = k) = C(3, k) 0.4ᵏ 0.6³⁻ᵏ: 0.216, 0.432, 0.288, 0.064. They add to 1. In general C(n, k) pᵏ qⁿ⁻ᵏ.</div>
</div>

Slide n and p to see the shape change and light up P(X = k) and P(X ≤ k):

<figure class="fig" data-fig="c12m-prob-binom"><figcaption>The binomial bars for n trials with success probability p. The dashed line is the mean np. At p = 0.5 the bars are symmetric; for other p they lean to one side. Pick k to read P(X = k) and the cumulative P(X ≤ k).</figcaption></figure>

<div class="problem" data-problem="c12m-prob-binom"></div>

<div class="myth">

**“After 5 heads in a row, a tail is due.”** Trials are independent: the coin has no memory, so the next toss is still 1/2. The proportion of heads settles towards 1/2 because new tosses swamp the early ones, not because tails catch up.

</div>

Another tool: the [Distribution explorer](/science/distribution-explorer/) draws and compares many distributions, and [Spinner designer](/learn/spinner-designer/) lets you build your own random variable.

<div class="keypoints">

- `$P(A\mid B) = P(A\cap B)/P(B)$`: B becomes the sample space. `$P(A\cap B) = P(A)P(B\mid A)$`: multiply along a tree path, add the paths.
- Independent: `$P(A\cap B) = P(A)P(B)$` (so `$P(B\mid A) = P(B)$`). Not the same as mutually exclusive.
- Partition `$E_1,\dots,E_n$`: total probability `$P(A) = \sum P(E_i)P(A\mid E_i)$`; Bayes `$P(E_i\mid A) = \frac{P(E_i)P(A\mid E_i)}{P(A)}$`.
- Random variable X: values with probabilities adding to 1. Mean `$E(X) = \sum x_ip_i$`.
- Binomial B(n, p): `$P(X = k) = \binom{n}{k}p^kq^{n-k}$`, mean `$np$` (independent trials, two outcomes, constant p).
- Beyond the syllabus (check your board): variance `$\sum(x_i-\mu)^2p_i$`; for the binomial it is `$npq$`.

</div>

Going further for JEE/NEET: the exam-level problems (geometric and distribution problems, tricky Bayes and conditional chains, binomial with a minimum number of trials) are in [Probability (JEE)](/learn/courses/engineering-entrance/probability/).
