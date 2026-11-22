---
title: The World of Algorithms
seoTitle: 'Algorithms Class 9 notes: Euclid, search, sorting'
summary: 'Class 9 Algorithms with animations: flowcharts, Euclid’s HCF with squares, linear and binary search, bubble and selection sort, counting steps.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'Euclid’s algorithm for HCF(84, 36): 84 = 2 × 36 + 12, then 36 = 3 × 12 + 0. The HCF is:'
    choices: ['12', '36', '0', '3']
    ans: 0
    why: 'The algorithm stops when the remainder is 0, and the last divisor, 12, is the HCF.'
  - q: 'What is the largest number of guesses binary search needs on a sorted list of 100 items?'
    choices: ['7', '100', '50', '10']
    ans: 0
    why: 'Each guess halves the list: 100, 50, 25, 12, 6, 3, 1. Since 2⁷ = 128 is more than 100, seven guesses always suffice.'
  - q: 'In bubble sort, two neighbouring items are swapped when:'
    choices: ['the left one is bigger than the right one', 'they are equal', 'the left one is smaller', 'both are even']
    ans: 0
    why: 'Bubble sort compares neighbours and swaps a pair that is the wrong way round, so the biggest item “bubbles” to the end.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 11 “The World of Algorithms” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Euclid, Elements, Book VII, Propositions 1 and 2 (the repeated-subtraction method for the greatest common measure), and Book X, Proposition 3'
  - 'Donald Knuth, The Art of Computer Programming, volume 3 (1973), for the step counts of bubble, selection and binary search'
---

**Maths · Class 9 · Chapter 11 · about 55 minutes.** By the end you will be able to describe a method as an algorithm, draw and run a flowchart, find a HCF with Euclid’s algorithm, search a list by the linear and the binary method, sort a list by bubble and selection sort, and count how many steps each method takes.

<div class="bigidea">An algorithm is a recipe that always works: clear steps, in order, that end with the right answer. Computers follow algorithms, but so do you whenever you do long division or make chai. Two different algorithms can solve the same problem, and one can be thousands of times faster, so we count steps to compare them.</div>

## 1. What is an algorithm?

An **algorithm** is a **finite list of clear steps** that takes an **input** and gives an **output**. Recipes, the steps of long division, the route a bus conductor uses to give change, and the way Google Maps finds a route are all algorithms. A good one is:

- **Clear:** each step is simple and has only one meaning.
- **Finite:** it ends after a limited number of steps.
- **Correct:** it gives the right output for every allowed input.

Take a job we all do: find the biggest of five numbers. Keep a “biggest so far” card, look at each number once, and swap the card when you find a bigger one.

<div class="steps" data-fig="c9-algo-max">
<div class="step">Input: five numbers, 14, 9, 23, 17, 21. Output: the largest of them.</div>
<div class="step">Step 1: write down the first number, 14, as the biggest so far.</div>
<div class="step">Step 2: look at 9. Is it bigger than 14? No, so keep 14.</div>
<div class="step">Step 3: look at 23. Bigger than 14? Yes, so the biggest so far becomes 23.</div>
<div class="step">Step 4: look at 17. Bigger than 23? No. Keep 23.</div>
<div class="step">Step 5: look at 21. Bigger than 23? No. No numbers are left, so stop.</div>
<div class="step">Output: 23. The same steps work for five numbers or five thousand.</div>
</div>

<div class="myth">

**“An algorithm is only for computers.”** People have used algorithms for thousands of years. Euclid’s method for the HCF is over 2300 years old. A computer is just very fast and never gets bored of following the steps.

</div>

## 2. Flowcharts

A **flowchart** draws an algorithm as boxes joined by arrows. Everyone uses the same shapes:

- **Oval:** Start or Stop.
- **Parallelogram:** input (read a number) or output (print an answer).
- **Rectangle:** a step or calculation (S = S + i).
- **Diamond:** a decision, a yes/no question with two arrows leaving it.

Arrows show the order. An arrow that goes **back** up to an earlier box makes a **loop**: the algorithm repeats some steps until a test says stop.

<figure class="fig" data-fig="c9-algo-flow"><figcaption>Run two flowcharts. “Even or odd” has one decision. “Sum of 1 to n” has a loop: the diamond asks “i ≤ n?”, and as long as the answer is yes, the flow goes down, adds, and returns to the diamond. Step through and read the note under the figure.</figcaption></figure>

<div class="problem" data-problem="c9m-algo-loop"></div>

**Tracing** means following a flowchart by hand with a table of the values of each variable after every step. Always trace one small example before you trust an algorithm.

Now build and run any flowchart yourself:

<!--fig:tool flowchart-runner-->

<div class="keypoints">

- An algorithm is a clear, finite, correct list of steps from input to output.
- A flowchart uses ovals (start, stop), parallelograms (input, output), rectangles (steps) and diamonds (decisions).
- An arrow going back up makes a loop. Trace with a small example to test an algorithm.

</div>

## 3. Euclid’s algorithm for the HCF

The **highest common factor (HCF)** of two numbers is the biggest number that divides both. One way is to list all factors. For big numbers, such as 252 and 105, that is slow. Euclid’s algorithm is quick and always works.

**The picture first.** Imagine a tiled floor 252 cm by 105 cm. What is the biggest square tile that covers it exactly, with no cutting? Cut the biggest squares you can from the rectangle (the side is the shorter side). What is left is a smaller rectangle. Cut squares from that, and so on. When nothing is left, the last square is the answer.

<figure class="fig" data-fig="c9-algo-euclid"><figcaption>Choose two lengths and press Cut the squares. Each press cuts the biggest squares from the rectangle that is left. When nothing is left, the side of the last square is the HCF, and squares of that size tile the whole rectangle exactly. Under the picture each cut is written as a division.</figcaption></figure>

**The rule in numbers.** Each cut is a division: a = q × b + r. Then we repeat with b and r.

<div class="steps" data-fig="c9-algo-euclidsteps">
<div class="step">We want HCF(252, 105), the biggest number that divides both.</div>
<div class="step">Divide 252 by 105: 252 = 2 × 105 + 42. The remainder is 42, not 0.</div>
<div class="step">Now work with 105 and 42: 105 = 2 × 42 + 21. The remainder is 21, not 0.</div>
<div class="step">Now work with 42 and 21: 42 = 2 × 21 + 0. The remainder is 0, so stop.</div>
<div class="step">The last divisor, 21, is the HCF. Check: 252 = 12 × 21 and 105 = 5 × 21.</div>
</div>

<div class="meaning">
<dl>
<dt>a = q × b + r</dt><dd>divide a by b: quotient q, remainder r (0 ≤ r &lt; b)</dd>
<dt>HCF(a, b) = HCF(b, r)</dt><dd>replace the pair by the smaller number and the remainder: the answer does not change</dd>
<dt>Why it works</dt><dd>Any number that divides both a and b also divides r = a − q × b. And any number that divides both b and r also divides a. So the pairs (a, b) and (b, r) have exactly the same common factors, and the same HCF. Each round the numbers shrink, so the algorithm must end at remainder 0.</dd>
</dl>
</div>

<div class="problem" data-problem="c9m-algo-hcf"></div>

<div class="problem" data-problem="c9m-algo-count"></div>

Compare with the factor-and-Venn method:

<!--fig:tool hcf-lcm-venn-->

<div class="myth">

**“The HCF is the last remainder.”** The last remainder is always 0. The HCF is the last **divisor**, the number you divided by when the remainder became 0.

</div>

## 4. Searching: linear and binary

**Searching** means finding an item in a list. How you search depends on whether the list is in order.

**Linear search** checks the items one by one from the start, like looking for your name on a long school list. It works on any list, but if the list has 1000 names you may need 1000 checks.

**Binary search** needs a **sorted** list. Look at the **middle** item. If it is too small, the item is in the upper half, so throw away the lower half. If it is too big, throw away the upper half. Repeat on what is left. This is just how you look up a word in a dictionary, or guess a number in the “I am thinking of a number between 1 and 100” game: guess 50, then 25 or 75, and so on.

<figure class="fig" data-fig="c9-algo-search"><figcaption>Choose a hidden number from 1 to 100 and a method. Linear search crosses off 1, 2, 3, ... Binary search guesses the middle and throws away half the numbers each time. Press Run to the end: for most numbers binary search finishes in 7 guesses or fewer.</figcaption></figure>

Why seven? Each guess halves the list: 100 → 50 → 25 → 12 → 6 → 3 → 1 → 0. Seven halvings. In general, if 2<sup>k</sup> is bigger than the number of items, k guesses always suffice.

<div class="problem" data-problem="c9m-algo-binary"></div>

<div class="myth">

**“Binary search works on any list.”** It works only on a **sorted** list. If the list is jumbled, the middle item tells you nothing about where to look. That is why we also need sorting.

</div>

## 5. Sorting: bubble sort and selection sort

**Sorting** puts items in order (smallest to largest). A sorted list is far easier to search, and it helps in everything from a rank list to a phone contact list.

### Bubble sort

Go through the list comparing **neighbours**. If the left one is bigger, **swap** them. After one pass the biggest item has “bubbled” to the end. Repeat on the rest. If a pass makes no swaps, the list is sorted.

<figure class="fig" data-fig="c9-algo-bubble"><figcaption>Press Step or Play. The two bars being compared are orange; swapped pairs move. The green bars at the right are already in their final place. Press Shuffle for a new order and compare how many swaps are needed.</figcaption></figure>

<div class="problem" data-problem="c9m-algo-bubble"></div>

### Selection sort

Find the **smallest** item in the whole list and swap it into the first place. Then find the smallest of the rest and swap it into the second place, and so on. It makes few swaps (at most one a round) but always scans everything that is left.

<figure class="fig" data-fig="c9-algo-select"><figcaption>Step through: the bars are scanned left to right and the smallest so far is marked orange. At the end of each round it is swapped to the front of the unsorted part and turns green.</figcaption></figure>

<div class="problem" data-problem="c9m-algo-select"></div>

Watch many algorithms step by step in the algorithm stepper, and compare them:

<!--fig:tool algorithm-stepper-->

## 6. Counting steps: why a good algorithm matters

Two algorithms can give the same answer but need very different numbers of steps. To compare them we **count steps** in the worst case, as a function of the size n of the input.

- Linear search on n items: up to **n** checks.
- Binary search on n sorted items: about **log₂ n** checks (the number of times you can halve n).
- Selection sort on n items: (n − 1) + (n − 2) + … + 1 = **n(n − 1) ÷ 2** comparisons.

<figure class="fig" data-fig="c9-algo-growth"><figcaption>Slide the size of the list from 10 to 1,000,000,000. Linear search steps grow with the list; binary search adds only about three steps for every extra zero. A faster computer helps a little; a better algorithm helps a lot.</figcaption></figure>

Binary search on a billion names needs only 30 guesses. Bubble sort and selection sort, however, need about n²/2 comparisons, so sorting a long list this way gets slow quickly: double the list and the work becomes four times as big. Computer scientists therefore invented faster sorting methods. The idea of counting steps tells you which method to choose.

Another algorithm viewer:  the [Algorithm visualiser](/science/algorithm-visualiser/) animates searching and sorting methods with the number of steps counted.

<div class="history">

<ul class="timeline">
<li><b>about 300 BCE</b> Euclid describes the method of repeated subtraction (later division) for the greatest common measure, in the Elements.</li>
<li><b>about 820 CE</b> Al-Khwarizmi writes a book of step-by-step rules for arithmetic and algebra. The word “algorithm” comes from his name.</li>
<li><b>1150</b> Bhaskaracharya II gives the “cyclic method” (chakravala) to solve certain equations, a step-by-step rule that always ends.</li>
<li><b>1946</b> The first general-purpose electronic computers run stored lists of steps for the first time.</li>
</ul>

</div>

<div class="keypoints">

- An algorithm is a clear, finite, correct list of steps; a flowchart draws it with ovals, parallelograms, rectangles, diamonds and arrows, and a loop sends the flow back.
- Euclid’s algorithm: repeat a = q × b + r with (b, r) until the remainder is 0; the last divisor is the HCF. In the picture, it is the side of the biggest square that tiles the rectangle.
- Linear search checks one by one (up to n steps). Binary search halves a sorted list each time (about log₂ n steps; 7 for 100 items).
- Bubble sort swaps neighbours that are out of order; selection sort selects the smallest and places it. Both take about n²/2 comparisons.
- Counting steps lets us compare algorithms: a better algorithm beats a faster machine.

</div>
