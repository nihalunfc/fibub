---
title: 'The Mathematics of Maybe: Introduction to Probability'
seoTitle: 'Probability Class 9 notes: experiments, outcomes, events'
summary: 'Class 9 Probability with simulators: experiments, outcomes, events, experimental probability from data, the long-run idea and simple theoretical probability.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A fair die is rolled once. The probability of getting a number less than 3 is:'
    choices: ['1/3', '1/2', '1/6', '2/3']
    ans: 0
    why: 'The favourable outcomes are 1 and 2, so 2 out of 6: 2/6 = 1/3.'
  - q: 'A coin is tossed 80 times and gives 36 heads. The experimental probability of heads is:'
    choices: ['0.45', '0.5', '0.36', '2.2']
    ans: 0
    why: 'Experimental probability = 36 ÷ 80 = 0.45. It is close to, but not exactly, the theoretical 0.5.'
  - q: 'The probability that a bus is late is 0.2. The probability that it is NOT late is:'
    choices: ['0.8', '0.2', '1.2', '0.5']
    ans: 0
    why: 'The two events cover every possibility, so their probabilities add to 1: 1 − 0.2 = 0.8.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 7 “The Mathematics of Maybe: Introduction to Probability” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school probability: equally likely outcomes, relative frequency and the long-run idea. All simulations in this lesson run in your browser with the browser’s random numbers; the weather and travel tables are made-up example data.'
  - 'Pack of 52 cards: 4 suits (spades, hearts, diamonds, clubs) of 13 cards, 12 face cards; standard.'
---

**Maths · Class 9 · Chapter 7 · about 50 minutes.** By the end you will be able to name the outcomes and events of an experiment, find experimental probability from a table of results, say what the long-run idea means, and work out simple theoretical probabilities for coins, dice, spinners and bags of marbles.

<div class="bigidea">We cannot predict a single toss of a coin, but we can say what happens over many tosses. Probability is a number from 0 to 1 that says how likely something is. We find it either by experiment (count what happened) or by reasoning (count the equally likely outcomes).</div>

## 1. Experiments, outcomes and events

Before the toss at the start of a cricket match, nobody knows which side will win it. That is a **random experiment**: something we can repeat, where each time the result could be one of several possible results and we cannot say beforehand which one.

- Each possible result is an **outcome**. Tossing a coin has two outcomes: Head (H) and Tail (T).
- The list of all the outcomes is the **sample space**. Rolling one die has sample space {1, 2, 3, 4, 5, 6}.
- An **event** is a group of outcomes we care about. “An even number” on a die is the event {2, 4, 6}.
- The outcomes that make the event happen are the **favourable outcomes**.

Follow it on a die:

<div class="steps" data-fig="c9-prob-termsteps">
<div class="step">Experiment: roll one fair die. We cannot say beforehand which face will come up.</div>
<div class="step">Outcomes: 1, 2, 3, 4, 5, 6. Together they form the sample space, and all six are equally likely.</div>
<div class="step">Event: “the die shows an even number”, which is the group {2, 4, 6}.</div>
<div class="step">Favourable outcomes: 3 of them. All outcomes: 6.</div>
<div class="step">P(even) = favourable ÷ all = 3 ÷ 6 = ½.</div>
<div class="step">A different event: “more than 4” is {5, 6}. P = 2 ÷ 6 = ⅓.</div>
</div>

<div class="myth">

**“An event is the same as an outcome.”** An outcome is a single result (the die shows 4). An event can be one outcome or several (the die shows an even number). Rolling a 4 is both an outcome and an event, but “even” is an event made of three outcomes.

</div>

## 2. How likely? The probability scale

Some events are sure, some are impossible and most are in between. Probability puts a number on this, between **0** and **1**.

- Impossible event: P = 0. (A die showing 7.)
- Certain event: P = 1. (The sun rising in the east tomorrow.)
- Everything else is a number between 0 and 1. A fair coin showing heads: ½. Closer to 1 means more likely.

Choose some events and see where they land on the scale, or set your own numbers.

<figure class="fig" data-fig="c9-prob-scale"><figcaption>The probability scale. P = favourable ÷ all outcomes, so it can never be below 0 (no favourable outcomes) or above 1 (every outcome is favourable). Try 7 favourable out of 5: the slider will not let you, because it is impossible.</figcaption></figure>

<div class="meaning">
<dl>
<dt>P(E)</dt><dd>the probability of event E.</dd>
<dt>Equally likely outcomes</dt><dd>outcomes that have the same chance, like the six faces of a fair die.</dd>
<dt>P(E) from a count</dt><dd>`$P(E) = \dfrac{\text{number of favourable outcomes}}{\text{number of all possible outcomes}}$` (only when the outcomes are equally likely).</dd>
<dt>Physical meaning</dt><dd>if you did the experiment a huge number of times, about P of the results would be the event. P = 0.3 means about 3 in 10.</dd>
</dl>
</div>

<div class="myth">

**“A probability can be more than 1, or negative.”** It cannot. A probability of 1.4 or −0.2 means something has gone wrong with the counting. Always check that your answer is between 0 and 1.

</div>

## 3. Experimental probability: what actually happened

A bowler wants to know how often she takes a wicket. She cannot work it out by thinking, so she counts. If she bowled 50 balls and took a wicket 4 times, the **experimental probability** is

```math
P(E) = \frac{\text{number of times the event happened}}{\text{total number of trials}} = \frac{4}{50} = 0.08
```

Experimental probability comes from data. Here is a table turned into probabilities:

<div class="steps" data-fig="c9-prob-tablesteps">
<div class="step">We asked 40 students how they travel to school. The table gives each frequency.</div>
<div class="step">The total number asked is 12 + 8 + 14 + 6 = 40. That is the total number of trials.</div>
<div class="step">P(walk) = 12 ÷ 40 = 0.30: frequency of the event divided by the total.</div>
<div class="step">Do the same for each row: 0.30, 0.20, 0.35 and 0.15.</div>
<div class="step">Add up: 0.30 + 0.20 + 0.35 + 0.15 = 1. The probabilities of all outcomes add to 1.</div>
<div class="step">Events can combine rows: P(bus or car) = (14 + 6) ÷ 40 = 0.5.</div>
</div>

<div class="problem" data-problem="c9m-prob-freq"></div>

Probabilities of an event and of its opposite always add up to 1, because between them they cover every possibility:

```math
P(E) + P(\text{not } E) = 1 \quad\Longrightarrow\quad P(\text{not } E) = 1 - P(E)
```

If the chance of rain is 0.3, the chance of no rain is 0.7. That is often quicker than counting.

<div class="problem" data-problem="c9m-prob-rain"></div>

## 4. Tossing coins: the long-run idea

Toss a coin 10 times. You may well get 7 heads. Toss it 1000 times and you will get close to 500. This is the **long-run idea**: the more trials you do, the closer the experimental probability gets to the true probability. Start with Toss 1 and press it a few times, then Toss 1000.

<figure class="fig" data-fig="c9-prob-coin"><figcaption>The blue line is the relative frequency of heads (heads ÷ tosses so far). It jumps about for the first few tosses and then settles close to the dashed line at 0.5. Choose the loaded coin: the line settles near 0.7 instead, and you could discover that only by tossing many times. This is how experiments find probabilities we cannot work out by thinking.</figcaption></figure>

Short runs are unreliable: three heads in a row means nothing about the coin. Long runs are stable. Watch five separate runs of the same experiment race each other:

<figure class="fig" data-fig="c9-prob-longrun"><figcaption>Five runs, each starting from zero. In the first few trials they disagree wildly; after hundreds they all crowd round the dashed line, the theoretical probability. Change the event to see it work for a die and a spinner too.</figcaption></figure>

<div class="myth">

**“After five heads in a row, a tail is due.”** The coin has no memory. Each toss is a fresh start and the chance of heads is still ½. The long-run idea works because there are so many tosses that early streaks are drowned out, not because the coin “makes up” for them.

</div>

<div class="problem" data-problem="c9m-prob-expect"></div>

## 5. Rolling dice

A fair die has six faces, each with probability ⅙ ≈ 0.167. Roll it ten times: the bars of relative frequency will be wildly uneven. Roll it a thousand times: they flatten out to the line.

<figure class="fig" data-fig="c9-prob-dice"><figcaption>Bars show how often each face appeared, as a fraction of all rolls. The dashed line is 1/6. Roll 1, then 10, then 1000, and watch the bars level out. Press Play to keep rolling.</figcaption></figure>

Because the six faces are equally likely, the probability of any event on one die is just a count: `$P = \dfrac{\text{favourable faces}}{6}$`. For example, P(a number greater than 4) = `$\tfrac{2}{6} = \tfrac{1}{3}$`.

<div class="problem" data-problem="c9m-prob-die"></div>

## 6. Theoretical probability: counting equally likely outcomes

When every outcome is equally likely we do not need to experiment. We can reason out the probability by counting. This is **theoretical probability**.

**Spinners.** On a spinner with 8 equal sectors, 3 of them orange, P(orange) = 3/8. Change the number of orange sectors and spin, and compare the tally with the theory. Spin 100 times at once and see how close the experiment gets.

<figure class="fig" data-fig="c9-prob-spinner"><figcaption>The theoretical probability is the number of orange sectors out of 8. The experimental probability changes as you spin, and tends towards it. P(orange) + P(blue) always makes 1.</figcaption></figure>

**Bags of marbles.** P(orange) = number of orange marbles ÷ total marbles. Set the numbers in the bag, then draw many marbles (each is put back after drawing) and compare the solid bars (experiment) with the outlines (theory).

<figure class="fig" data-fig="c9-prob-bag"><figcaption>Draw 1000 times: the solid bars grow to fill the dashed outlines. More marbles of a colour means a taller outline and a higher probability. Set a colour to 0 marbles: P = 0, an impossible event.</figcaption></figure>

<div class="problem" data-problem="c9m-prob-bag"></div>

**A pack of cards.** A standard pack has 52 cards: 4 suits (spades, hearts, diamonds, clubs) of 13 cards each. Hearts and diamonds are red; spades and clubs are black. There are 4 kings, and 12 face cards (jack, queen, king in each suit). So P(a king) = 4/52 = 1/13 and P(a red card) = 26/52 = ½.

<div class="problem" data-problem="c9m-prob-cards"></div>

**Two things at once.** If you toss two coins or roll two dice together, list all the outcomes first. Two coins: HH, HT, TH, TT, which are 4 equally likely outcomes. Two dice: 6 × 6 = 36 equally likely pairs. Pick an event and see its favourable outcomes light up:

<figure class="fig" data-fig="c9-prob-sample"><figcaption>The grid shows every outcome. The green cells are the favourable ones for the chosen event. Count them and divide by the total: for “sum is 7” there are 6 cells out of 36, so P = 1/6.</figcaption></figure>

<!--fig:tool sample-space-->

<div class="myth">

**“With two coins, getting one head and one tail has the same chance as two heads.”** It does not. HT and TH are two different outcomes, so “one head and one tail” has probability 2/4 = ½, while “two heads” (just HH) has only 1/4. Write all the outcomes down in order to avoid this.

</div>

<div class="problem" data-problem="c9m-prob-twodice"></div>

Design your own spinner with chosen sectors and probabilities, and compare the experiments with the theory:

<!--fig:tool spinner-designer-->

## 7. Experimental or theoretical?

- **Theoretical** probability comes from reasoning: only when all outcomes are equally likely (a fair coin, a fair die, a well-mixed bag).
- **Experimental** probability comes from data: it works even when we cannot reason it out (will it rain? will this bowler take a wicket?).
- They agree in the long run when the experiment is fair. If they do not, the die may be loaded or the spinner uneven.

Probability is also at the heart of how data is spread; the [Probability distribution explorer](/science/distribution-explorer/) shows the shapes that long runs of experiments make.

<div class="keypoints">

- A random experiment has outcomes we cannot predict one at a time. All the outcomes form the sample space; an event is a group of outcomes.
- Probability is a number from 0 (impossible) to 1 (certain). P(not E) = 1 − P(E); the probabilities of all outcomes add to 1.
- Experimental probability = number of times the event happened ÷ number of trials. It comes from data.
- Theoretical probability = favourable outcomes ÷ all outcomes, when all outcomes are equally likely.
- The long-run idea: the more trials, the closer the experimental probability gets to the theoretical one. Short runs are unreliable and a coin has no memory.
- For two coins or two dice, list the sample space (4 or 36 outcomes) and count carefully.

</div>

Ready for exam-style questions? Go to [The Mathematics of Maybe: Introduction to Probability: practice questions](/learn/courses/ncert-class-9-maths/introduction-to-probability-practice/).
