---
title: Probability
seoTitle: 'Probability Class 10 notes: coins, dice, cards'
summary: 'Class 10 Probability with simulators: theoretical probability, equally likely outcomes, complementary events, coins, dice, cards and spinners, with practice.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A fair die is thrown once. The probability of getting a prime number is:'
    choices: ['1/2', '1/3', '2/3', '1/6']
    ans: 0
    why: 'The prime numbers on a die are 2, 3 and 5: three favourable outcomes out of 6, so the probability is 3/6 = 1/2.'
  - q: 'If P(E) = 0.35, then P(not E) is:'
    choices: ['0.65', '0.35', '1.35', '−0.35']
    ans: 0
    why: 'P(not E) = 1 − P(E) = 1 − 0.35 = 0.65.'
  - q: 'The number of outcomes when two coins are tossed together is:'
    choices: ['4', '2', '3', '6']
    ans: 0
    why: 'Each coin has 2 outcomes, so two coins have 2 × 2 = 4: HH, HT, TH, TT.'
sources:
  - 'NCERT Class 10 Mathematics, Chapter 14 “Probability” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school probability: classical (theoretical) probability and complementary events. Written for fibub; examples checked by listing every outcome.'
---

**Maths · Class 10 · Chapter 14 · about 50 minutes.** By the end you will be able to list the possible outcomes of an experiment, find the probability of an event as a fraction, use the complement “not E”, and solve problems with coins, dice, cards, marbles and spinners.

<div class="bigidea">Probability puts a number between 0 and 1 on how likely something is. When all outcomes are equally likely, the probability of an event is simply the number of outcomes that make it happen divided by the total number of outcomes.</div>

## 1. Chance, experiments and outcomes

Will it rain tomorrow? Will India win the toss? We use words like *likely* and *unlikely*, but mathematics wants a number. Probability is that number.

An **experiment** is anything with an uncertain result: tossing a coin, throwing a die, picking a marble, spinning a wheel. Each possible result is an **outcome**. A single toss of a coin has 2 outcomes, head (H) and tail (T). A die has 6 outcomes, 1 to 6. The set of all outcomes is the **sample space**. An **event** is a collection of outcomes we care about, such as “an even number on a die”, which is {2, 4, 6}.

<div class="meaning">
<dl>
<dt>Outcome</dt><dd>one possible result of the experiment (for example, “3” when you throw a die).</dd>
<dt>Sample space</dt><dd>the list of all possible outcomes. Two coins: HH, HT, TH, TT.</dd>
<dt>Event E</dt><dd>a set of outcomes we are interested in. An event can have many outcomes (even number) or just one (a six).</dd>
<dt>Favourable outcomes</dt><dd>the outcomes inside the event E, the ones that make us say “it happened”.</dd>
<dt>Equally likely</dt><dd>no outcome is favoured over another: a fair coin, a fair die, a well-shuffled pack, a marble picked without looking.</dd>
</dl>
</div>

## 2. Theoretical probability

When all outcomes are equally likely, the probability of an event `$E$` is

```math
P(E) = \frac{\text{number of outcomes favourable to } E}{\text{total number of possible outcomes}}
```

Throw a fair die. The event “a number less than 5” has favourable outcomes 1, 2, 3, 4: four of six, so `$P = \tfrac46 = \tfrac23$`. Notice this is a prediction made by *thinking*, not by throwing the die. That is why it is called **theoretical** probability.

<div class="meaning">
<dl>
<dt>P(E)</dt><dd>the probability of event E, a number from 0 to 1.</dd>
<dt>Favourable</dt><dd>how many ways E can happen.</dd>
<dt>Total</dt><dd>how many things can happen, all equally likely.</dd>
<dt>Physical meaning</dt><dd>if you repeat the experiment very many times, the fraction of times E happens settles close to P(E). A probability of 1/6 does not mean one six in every six throws, but about one in six over a very long run.</dd>
</dl>
</div>

Do not take that on trust. Flip a coin yourself, many times. The graph shows the fraction of heads after each flip. At first it jumps about; with more flips it settles next to 1/2:

<figure class="fig" data-fig="c10-prob-coin"><figcaption>The wandering line is the fraction of heads after n flips. The dashed line is the theoretical 1/2. Press Play, then press New run a few times: every run starts differently but heads to the same place.</figcaption></figure>

The same idea for a die. Each face should turn up about one sixth (0.167) of the time. Choose an event such as “even” and the favourable faces change colour; the fraction of rolls landing on them approaches `$3/6 = 0.5$`:

<figure class="fig" data-fig="c10-prob-dice"><figcaption>Bars show the fraction of rolls for each face. The dashed line is 1/6. After a few rolls the bars are uneven, but after thousands they level out. Pick an event to see its favourable faces.</figcaption></figure>

<div class="myth">

**“If a coin shows heads five times in a row, tails is due.”** The coin has no memory. Each toss is independent and still has probability 1/2 of heads. Over a very long run the *fraction* evens out, but the numbers do not “make up” for earlier ones.

</div>

<div class="problem" data-problem="c10m-prob-bag"></div>

### The probability scale

The smallest possible number of favourable outcomes is 0 and the largest is the total, so a probability is always between 0 and 1.

- `$P(E) = 0$` means the event is **impossible** (a die showing 7).
- `$P(E) = 1$` means the event is **certain** (the sun rising in the east).
- A larger P means more likely, and 1/2 is an even chance.

<figure class="fig" data-fig="c10-prob-scale"><figcaption>Choose an event and the marker glides to its place on the scale. Events near 0 are unlikely, near 1 likely. No probability can be below 0 or above 1.</figcaption></figure>

<div class="myth">

**“A probability can be 3/2 or −0.2.”** Never. If your answer is outside 0 to 1, you have divided the wrong way round or counted too many favourable outcomes.

</div>

## 3. Equally likely outcomes: count carefully

The rule only works when you count *equally likely* outcomes. A bag has 1 red marble and 4 blue marbles. Red and blue are two colours, but picking red is not as likely as picking blue: there are five marbles, and each is equally likely, so `$P(\text{red}) = \tfrac15$`, not `$\tfrac12$`.

<figure class="fig" data-fig="c10-prob-equal"><figcaption>Switch between counting colours (wrong) and counting marbles (right). Only when the bag has as many red as blue marbles are the two colours equally likely. Try the four bags.</figcaption></figure>

A worked example with a bag. Watch each sentence become a counting step, including the complement:

<div class="steps" data-fig="c10-prob-bagsteps">
<div class="step">A bag has 3 red, 5 blue and 2 green marbles. One marble is picked at random without looking.</div>
<div class="step">Total possible outcomes: all 10 marbles, each equally likely.</div>
<div class="step">Favourable outcomes for the event “green”: 2 marbles.</div>
<div class="step">P(green) = favourable ÷ total = 2/10 = 1/5.</div>
<div class="step">The complement “not green” has 3 + 5 = 8 marbles, so P(not green) = 8/10 = 4/5. Notice 1/5 + 4/5 = 1.</div>
<div class="step">“Red or green” has 3 + 2 = 5 favourable marbles, so P = 5/10 = 1/2.</div>
</div>

<div class="problem" data-problem="c10m-prob-unknown"></div>

## 4. Complementary events

The event “E does not happen” is called the **complement** of E, written `$\bar{E}$` or “not E”. E and not E cover all the possibilities and share none, so their probabilities add to 1:

```math
P(E) + P(\bar{E}) = 1 \qquad\Longrightarrow\qquad P(\bar{E}) = 1 - P(E)
```

<div class="meaning">
<dl>
<dt>Ē (not E)</dt><dd>all the outcomes that are not in E.</dd>
<dt>P(E) + P(not E) = 1</dt><dd>something certainly happens: either E does or it does not.</dd>
<dt>Physical meaning</dt><dd>the whole bar of length 1 is split into two pieces: the chance that E happens and the chance that it does not. If one piece is big the other is small.</dd>
</dl>
</div>

Change the number of red marbles in the bag and watch the two pieces of the bar trade places. When there are no red marbles the chance of red is 0 (impossible); when all are red it is 1 (certain):

<figure class="fig" data-fig="c10-prob-comp"><figcaption>A bag of 20 marbles. The bar below is split into P(red) and P(not red), always totalling 1. Use “Pick one marble” a few times to see the colours you draw.</figcaption></figure>

The complement is a shortcut for “at least one” questions. Toss three coins. What is the probability of getting **at least one head**? Listing all the outcomes with a head takes work; instead, count the opposite:

<div class="steps" data-fig="c10-prob-athead">
<div class="step">Toss three coins. The sample space has 2 × 2 × 2 = 8 equally likely outcomes.</div>
<div class="step">The event “at least one head” contains every outcome that has a head: this is nearly all of them.</div>
<div class="step">Counting directly: 7 of the 8 outcomes are favourable.</div>
<div class="step">Faster: the complement “no head” has just one outcome, TTT.</div>
<div class="step">P(no head) = 1/8, so P(at least one head) = 1 − 1/8 = 7/8.</div>
</div>

<div class="problem" data-problem="c10m-prob-comp"></div>

<div class="myth">

**“Complement means opposite, so it is a different probability scale.”** It is the same scale. The complement of “even” on a die is “odd”, and the complement of “at least one head” is “no heads”. If P(rain) is 0.3, then P(no rain) is 0.7: you do not need to count again.

</div>

## 5. Coins, dice and sample spaces

For a single coin or die the sample space is short. For **two** objects we list pairs. Throw two dice together: there are 6 × 6 = 36 equally likely outcomes. Picture them as a grid, with the first die down the side and the second across the top. Then every event is just a set of cells. Choose an event below and count its cells:

<figure class="fig" data-fig="c10-prob-grid"><figcaption>All 36 outcomes of two dice. Pick an event: its favourable cells light up, and P = cells ÷ 36. Switch the cells to show the pair instead of the sum. Try “Sum is 7”: it is the biggest group, with 6 cells.</figcaption></figure>

Interactive tool: build your own events for dice, coins or cards, and run the experiment thousands of times.

<!--fig:tool sample-space-->

That the sum 7 is the most likely is easy to see by experiment too. Roll two dice many times and the bars grow towards the theoretical triangle: 1/36 for a sum of 2 up to 6/36 for 7 and back down to 1/36 for 12:

<figure class="fig" data-fig="c10-prob-sumhist"><figcaption>Experimental probability of each sum of two dice (bars) against the theoretical values (outlined). Sums near 7 can be made in more ways, so they occur more often.</figcaption></figure>

<div class="problem" data-problem="c10m-prob-dice"></div>

<div class="problem" data-problem="c10m-prob-coins"></div>

<div class="myth">

**“With two dice the sum 11 and the sum 12 are equally likely, because each is a single number.”** Count the pairs. A sum of 11 can be (5, 6) or (6, 5): 2 ways. A sum of 12 is only (6, 6): 1 way. So P(11) = 2/36 and P(12) = 1/36. Also (1, 2) and (2, 1) are different outcomes; do not merge them.

</div>

## 6. A pack of playing cards

A standard pack has 52 cards in four suits: spades ♠ and clubs ♣ are black, hearts ♥ and diamonds ♦ are red. Each suit has 13 cards: ace, 2 to 10, and the three **face cards** jack, queen and king. So there are 26 red cards, 26 black cards, 12 face cards, 4 aces and 4 kings. A card drawn from a well-shuffled pack is equally likely to be any of the 52.

<figure class="fig" data-fig="c10-prob-cards"><figcaption>The whole pack in four rows. Choose an event and its favourable cards light up. For “red face card” you get 6 cards (J, Q, K of hearts and of diamonds), so P = 6/52 = 3/26. Try “Not a heart”.</figcaption></figure>

<div class="problem" data-problem="c10m-prob-cards"></div>

<div class="myth">

**“The probability of a king or a heart is 4/52 + 13/52.”** The king of hearts is counted twice, once as a king and once as a heart. There are 4 + 13 − 1 = 16 different cards, so P = 16/52 = 4/13. Count each card once.

</div>

## 7. Spinners and other uses

A spinner with sectors of different sizes still follows the rule, but now the equally likely outcomes are equal *angles*: the probability of landing in a sector is its angle divided by 360°. A fair spinner with 8 equal sectors has 45° per sector, so each number has probability 45/360 = 1/8. Spin it and compare the experiment with the angle rule:

<figure class="fig" data-fig="c10-prob-spinner"><figcaption>Spin the wheel and tally where it lands. For the half-quarter-quarter spinner the theory is 1/2, 1/4, 1/4. Use “Spin 100 times” to see the tallies settle near the angle fractions. On the unfair spinner the thin red sector (36°) is hit about one time in ten.</figcaption></figure>

<div class="problem" data-problem="c10m-prob-spinner"></div>

Design your own spinner with the live tool; it also gives the probability of every sector from its angle:

<!--fig:tool spinner-designer-->

Probability is used everywhere. A weather forecast saying “30% chance of rain” means P(rain) = 0.3. A cricket analyst uses past matches to estimate that a batter reaches fifty in about one innings in four. Insurance companies, vaccines trials and quality checks all work with probabilities. For data that follows a pattern such as the bell curve, see the [Probability distribution explorer](/science/distribution-explorer/); you will meet it in later classes.

<div class="keypoints">

- An experiment has outcomes; the set of all outcomes is the sample space; an event is a set of outcomes.
- For equally likely outcomes: `$P(E) = \dfrac{\text{favourable outcomes}}{\text{total outcomes}}$`. Count equally likely cases (marbles, cells), not colours.
- 0 ≤ P(E) ≤ 1. An impossible event has P = 0 and a certain event has P = 1.
- Complement: `$P(\text{not } E) = 1 - P(E)$`. It is the shortcut for “at least one” questions.
- Two coins: 4 outcomes. Three coins: 8 outcomes. Two dice: 36 outcomes. A pack: 52 cards (26 red, 26 black, 12 face cards, 4 aces).
- Spinner: probability = sector angle ÷ 360°.
- Probability describes the long run. Past results do not change the next toss.

</div>

Ready for exam-style questions? Go to [Probability: practice questions](/learn/courses/ncert-class-10-maths/probability-practice/).
