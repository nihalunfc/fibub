---
title: Probability
seoTitle: 'Probability Class 11 notes: events and axioms'
summary: 'Class 11 Probability with animations: sample space, events and their algebra, the axioms, equally likely outcomes, the addition rule and complements.'
minutes: 90
updated: 2026-11-23
quiz:
  - q: 'A fair die is thrown once. The probability of getting a number greater than 4 is:'
    choices: ['1/3', '1/6', '2/3', '1/2']
    ans: 0
    why: 'The favourable outcomes are 5 and 6: 2 out of 6 equally likely outcomes, so 2/6 = 1/3.'
  - q: 'P(A) = 0.5, P(B) = 0.4 and P(A ∩ B) = 0.2. Then P(A ∪ B) is:'
    choices: ['0.7', '0.9', '0.1', '0.2']
    ans: 0
    why: 'Addition rule: P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 0.5 + 0.4 − 0.2 = 0.7.'
  - q: 'Three coins are tossed. The probability of at least one head is:'
    choices: ['7/8', '1/8', '3/8', '1/2']
    ans: 0
    why: 'The only outcome with no head is TTT, so P(at least one head) = 1 − 1/8 = 7/8.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 14 “Probability” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Kolmogorov, A. N., Grundbegriffe der Wahrscheinlichkeitsrechnung (1933) for the axioms; Pascal and Fermat letters (1654); standard treatments such as Ross, S., A First Course in Probability, Pearson. Every numerical example was recomputed in code.'
---

**Maths · Class 11 · Chapter 14 · about 90 minutes.** By the end you will be able to list the sample space of an experiment, describe events and combine them with "or", "and" and "not", state the rules every probability must follow, and find probabilities of events when outcomes are equally likely.

<div class="bigidea">Probability puts a number between 0 and 1 on how likely something is. Start by listing everything that can happen (the sample space). An event is a group of those outcomes. When all outcomes are equally likely, the probability of an event is simply (outcomes in the event) ÷ (all outcomes), so probability turns into careful counting. The rules at the end are just common sense about counting without double-counting.</div>

## 1. Random experiments and the sample space

A **random experiment** is something whose result you cannot predict exactly but whose possible results you can list: tossing a coin, throwing a die, picking a card, checking whether it rains tomorrow. Each possible result is an **outcome**. The set of all possible outcomes is the **sample space**, written `$S$`.

- Toss a coin: `$S = \{H, T\}$`.
- Throw a die: `$S = \{1, 2, 3, 4, 5, 6\}$`.
- Toss a coin twice: `$S = \{HH, HT, TH, TT\}$` (4 outcomes: the order matters).

Which cricketer bats first is decided by a coin toss. If you toss three coins, the sample space has `$2 \times 2 \times 2 = 8$` outcomes. Build it one toss at a time:

<div class="steps" data-fig="c11m-prob-treesteps">
<div class="step">Start: nothing has been tossed yet.</div>
<div class="step">Toss 1 has two outcomes, H or T.</div>
<div class="step">Toss 2: every branch splits again, giving 4 paths.</div>
<div class="step">Toss 3: 8 paths, so S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}.</div>
<div class="step">The event "exactly two heads" is HHT, HTH, THH: 3 of the 8 outcomes, so its probability is 3/8.</div>
</div>

Throwing two dice gives a `$6 \times 6$` table of 36 outcomes. Explore the sample space below and the events inside it:

<!--fig:tool sample-space-->

<div class="myth">

**"Tossing two coins gives three outcomes: 0, 1 or 2 heads."** Those three results are **not** equally likely: one head can happen in two ways (HT and TH), but zero heads only in one (TT). The sample space that treats each coin separately, `$\{HH, HT, TH, TT\}$`, has four equally likely outcomes. List outcomes so that each one is equally likely.

</div>

## 2. Events

An **event** is any subset of the sample space: a collection of outcomes we care about. We say the event **occurs** when the actual outcome is one of its members. For a die, "an even number" is the event `$E = \{2, 4, 6\}$`.

- A **simple event** has one outcome; a **compound event** has more than one.
- The **sure event** is `$S$` itself (always happens); the **impossible event** is the empty set `$\varnothing$` (never happens).
- Click cells in the grid below to build your own event, or use the ready-made ones. With equally likely outcomes `$P(E) = \dfrac{n(E)}{n(S)}$`.

<figure class="fig" data-fig="c11m-prob-grid"><figcaption>The 36 outcomes of two dice, each cell showing the sum. Pick an event or tap cells to make your own, and read P(E) = n(E)/36.</figcaption></figure>

<div class="meaning">
<dl>
<dt>`$S$`</dt><dd>the sample space: all possible outcomes.</dd>
<dt>`$E$`</dt><dd>an event: some of the outcomes. It occurs if the result is in `$E$`.</dd>
<dt>`$n(E)$`</dt><dd>the number of outcomes in `$E$`.</dd>
<dt>`$P(E) = n(E)/n(S)$`</dt><dd>the probability when all outcomes are equally likely.</dd>
</dl>
</div>

**Worked example.** Two dice are thrown. What is the probability that the sum is 9? The pairs are `$(3, 6), (4, 5), (5, 4), (6, 3)$`: 4 outcomes out of 36, so `$P = \dfrac{4}{36} = \dfrac19$`.

<div class="problem" data-problem="c11m-prob-dice"></div>

## 3. Algebra of events

Events are sets, so we combine them like sets. Take one throw of a die with `$A = $` "an even number" `$= \{2, 4, 6\}$` and `$B = $` "more than 3" `$= \{4, 5, 6\}$`:

- **Complement** `$A'$` ("not `$A$`"): the outcomes of `$S$` not in `$A$`: `$\{1, 3, 5\}$`.
- **Union** `$A \cup B$` ("`$A$` or `$B$`", or both): `$\{2, 4, 5, 6\}$`.
- **Intersection** `$A \cap B$` ("`$A$` and `$B$`"): `$\{4, 6\}$`.
- **Difference** `$A - B$` ("`$A$` but not `$B$`"): `$\{2\}$`.

Two events are **mutually exclusive** if they cannot happen together, `$A \cap B = \varnothing$` (even and odd on one throw). Events are **exhaustive** if together they cover the whole sample space, `$A \cup B = S$`. Try the pairs in this figure: pick an operation and see the matching outcomes filled in.

<figure class="fig" data-fig="c11m-prob-events"><figcaption>Two events on one throw of a die, drawn as a Venn diagram with the six outcomes inside. Choose a pair of events and an operation to see which outcomes make up the new event.</figcaption></figure>

<!--fig:tool event-algebra-->

Try the [probability tree](/learn/probability-tree/) for experiments with several stages.

## 4. Where do the probabilities come from?

You can learn a probability by repeating an experiment many times and counting. After 10 tosses you might see 7 heads, after 100 tosses 54, after 1000 tosses 503. The fraction of successes, the **relative frequency**, wobbles at first and then settles towards a fixed number. That settling is the reason we believe `$P(\text{head}) = \tfrac12$`. Run the experiment and watch (the same run every time you reload, so you can compare):

<figure class="fig" data-fig="c11m-prob-freq"><figcaption>Relative frequency of a success against the number of trials (log scale). It jumps about at first and then hugs the theoretical probability.</figcaption></figure>

Notice that it never lands **exactly** on the theory, and it does not "make up" for a bad run: a coin that has shown five heads in a row is still 50-50 on the next toss.

## 5. The axiomatic approach

Mathematicians gave probability rules that any sensible assignment must follow. Suppose each outcome `$\omega$` of `$S$` is given a number `$P(\omega)$`. These numbers form a **probability assignment** if:

1. Every `$P(\omega) \ge 0$` (no negative chances).
2. The total over the whole sample space is 1: `$P(S) = 1$`.
3. The probability of an event is the **sum** of the probabilities of the outcomes inside it (and for mutually exclusive events `$P(A \cup B) = P(A) + P(B)$`).

An equally likely assignment on `$n$` outcomes gives each outcome `$1/n$`, and then `$P(E) = n(E)/n$`. But the axioms allow unequal chances too. Mumbai's weather tomorrow could be heavy rain 0.30, light rain 0.20, cloudy 0.30 and clear 0.20. Drag the bars below: the checks turn green only when all three axioms hold.

<figure class="fig" data-fig="c11m-prob-axioms"><figcaption>Give each outcome a probability. The three checks show whether the assignment is valid. Choose an event E to see its probability as the sum of its outcomes.</figcaption></figure>

<div class="myth">

**"A probability can be 1.2, or 120%."** The axioms force every probability to lie between 0 and 1. If you compute something bigger than 1 (or negative), you have counted an overlap twice or made an arithmetic slip. Check by adding all the outcome probabilities: they must total exactly 1.

</div>

## 6. Probability of events: the addition rule and the complement

The rules that follow from the axioms are the ones you use most.

**Complement.** An event and "not the event" together make up `$S$` and cannot both happen, so

```math
P(A') = 1 - P(A)
```

**Addition rule.** For any two events `$A$` and `$B$`:

```math
P(A \cup B) = P(A) + P(B) - P(A \cap B)
```

Adding `$P(A)$` and `$P(B)$` counts the outcomes in both events twice, so subtract the overlap once. If `$A$` and `$B$` are mutually exclusive the overlap is empty and the rule becomes `$P(A \cup B) = P(A) + P(B)$`. Watch the rule work on a die:

<div class="steps" data-fig="c11m-prob-addsteps">
<div class="step">A die is thrown once. A = "an even number", B = "a number more than 3". Find P(A or B). S has 6 equally likely outcomes.</div>
<div class="step">List the events: A = {2, 4, 6}, B = {4, 5, 6}.</div>
<div class="step">P(A) = 3/6 and P(B) = 3/6.</div>
<div class="step">The overlap A ∩ B = {4, 6}, so P(A ∩ B) = 2/6.</div>
<div class="step">Adding counts 4 and 6 twice, so subtract the overlap once: P(A ∪ B) = 3/6 + 3/6 − 2/6.</div>
<div class="step">P(A ∪ B) = 4/6 = 2/3.</div>
<div class="step">Check by listing: A ∪ B = {2, 4, 5, 6}, which is 4 outcomes out of 6.</div>
</div>

A pack of cards is a good test. What is the probability that one card drawn from 52 is a king or a heart? There are 4 kings and 13 hearts, and one card (the king of hearts) is in both. So `$P = \dfrac{4 + 13 - 1}{52} = \dfrac{16}{52} = \dfrac{4}{13}$`.

<div class="problem" data-problem="c11m-prob-cards"></div>

<div class="problem" data-problem="c11m-prob-bag"></div>

**"At least one" problems.** When the event "at least one" is awkward to count, count the opposite instead. In three coin tosses, "at least one head" is every outcome except TTT. Change the number of coins and see how quickly "at least one" becomes nearly certain:

<figure class="fig" data-fig="c11m-prob-atleast"><figcaption>All outcomes of n coin tosses with the chosen event filled in. The complement of "at least one head" is the single outcome with no heads.</figcaption></figure>

For `$n$` tosses, `$P(\text{at least one head}) = 1 - \dfrac{1}{2^n}$`: 0.5 for one toss, 0.875 for three, 0.999 for ten.

<div class="problem" data-problem="c11m-prob-atleast"></div>

**Neither event.** The probability that neither `$A$` nor `$B$` happens is `$P(A' \cap B') = 1 - P(A \cup B)$`. With `$P(A) = 0.5$`, `$P(B) = 0.3$` and `$P(A \cap B) = 0.1$`, `$P(A \cup B) = 0.7$` and the answer is `$0.3$`.

<div class="problem" data-problem="c11m-prob-neither"></div>

<div class="problem" data-problem="c11m-prob-space"></div>

<div class="history">

- **1654:** A gambler's puzzle sends Blaise Pascal and Pierre de Fermat into a series of letters that start the mathematics of chance.
- **1713:** Jacob Bernoulli proves that relative frequencies settle near the probability (the law of large numbers).
- **1812:** Pierre-Simon Laplace writes down the "equally likely outcomes" definition used in school.
- **1933:** Andrey Kolmogorov builds probability on the three axioms you met above.

</div>

<div class="keypoints">

- The sample space `$S$` lists every outcome; an event is a subset of `$S$`; it occurs when the outcome is in it.
- With equally likely outcomes `$P(E) = n(E)/n(S)$`. List outcomes so that each one is equally likely.
- Algebra of events: `$A'$` (not), `$A \cup B$` (or), `$A \cap B$` (and), `$A - B$` (but not).
- Mutually exclusive means `$A \cap B = \varnothing$`; exhaustive means `$A \cup B = S$`.
- Axioms: `$P(\omega) \ge 0$`, `$P(S) = 1$`, probabilities of an event's outcomes add. Every probability lies from 0 to 1.
- `$P(A') = 1 - P(A)$` and `$P(A \cup B) = P(A) + P(B) - P(A \cap B)$`.
- Beyond the syllabus: conditional probability, independence and Bayes' theorem are in Class 12.

</div>

Going further for JEE/NEET: [Probability](/learn/courses/engineering-entrance/probability/) has the exam-level problems on conditional probability, binomial trials and counting-based probability.
