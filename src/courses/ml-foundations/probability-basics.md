---
title: Probability, mean, variance and the normal curve
seoTitle: 'Probability, mean, variance and the normal curve'
summary: 'The few ideas from statistics that machine learning uses all the time: probability, the mean, variance and standard deviation, and the bell-shaped normal curve. Draw samples and watch the averages settle.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'The values 2, 4, 4, 4, 5, 5, 7, 9 have mean 5. What is their population variance?'
    choices: ['2', '4', '5']
    ans: 1
    why: 'Squared gaps from 5: 9, 1, 1, 1, 0, 0, 4, 16, which add to 32. 32 ÷ 8 = 4. (The standard deviation is √4 = 2.)'
  - q: Roughly what share of a normal distribution lies within one standard deviation of the mean?
    choices: ['50 %', '68 %', '95 %']
    ans: 1
    why: About 68 % lies within ±1σ, about 95 % within ±2σ and about 99.7 % within ±3σ.
  - q: Why does the sample mean wobble less as you draw more values?
    choices: ['Because large samples have no outliers', 'Because random highs and lows cancel out more and more (the law of large numbers)', 'Because the true mean changes']
    ans: 1
    why: The spread of the sample mean shrinks like σ ÷ √n, so with 100 times more data it wobbles 10 times less.
sources:
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapters 2 and 3 https://www.statlearning.com/'
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, Chapter 3 (probability and information theory) https://www.deeplearningbook.org/'
  - 'Freedman, D., Pisani, R. and Purves, R. (2007), Statistics, 4th ed., W. W. Norton, Chapters 4, 5 and 16 to 17 (average, standard deviation, normal curve, law of averages)'
---

**Module 1 · about 25 minutes · school maths.** You'll be able to compute a mean, variance and standard deviation, read a normal curve, and say why bigger samples give steadier answers.

<div class="bigidea">Data is noisy, so we describe it by its centre (the mean) and its spread (the standard deviation), and averages of many values are far steadier than single values.</div>

## 1. Why this matters

Data is noisy. The same student doesn't get the same mark twice, and two flats of the same size sell for different prices. Models cope with this wobble by working with **probabilities** (how likely) and **averages** (what is typical). Logistic regression outputs a probability (Module 4), naive Bayes multiplies probabilities (Lesson 4.8), regression errors are measured with squared gaps like variance (Lesson 3.2), and a language model's output is a probability for every possible next word (Lesson 10.3).

## 2. Probability

A **probability** is a number from 0 (impossible) to 1 (certain) that says how likely something is. A fair coin lands heads with probability 0.5: in the long run, about half of all tosses. A weather app's "30 % chance of rain" is 0.3. Some rules:

- The probabilities of all possible outcomes add up to 1.
- `$P(\text{not } A) = 1 - P(A)$`.
- For two things that don't affect each other (**independent**), `$P(A \text{ and } B) = P(A) \times P(B)$`. Two heads in a row: 0.5 × 0.5 = 0.25.
- **Conditional probability** `$P(A \mid B)$` is the chance of A once you know B happened: `$P(A \mid B) = P(A \text{ and } B) \,/\, P(B)$`. "The chance an email is spam, given it contains the word *prize*" is a conditional probability. Lesson 4.8 builds a spam filter from these.

Try it: drag the score bars, press Add 2 to all, and move the temperature.

<figure class="fig" data-fig="@ai-softmax-lab"><figcaption>Softmax turns any scores into probabilities that are positive and add to 100%. Adding the same number to every score changes nothing; a low temperature makes the leader win nearly everything and a high one flattens the odds.</figcaption></figure>

## 3. The centre: mean and median

The **mean** (average) of `$n$` values is their sum divided by `$n$`:

```math
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
```

The **median** is the middle value once they are sorted. Lesson 2.2 shows when each one is the better summary.

Try it: slide the style from honest to over-confident and watch the bars drop below the diagonal.

<figure class="fig" data-fig="@ai-calibration"><figcaption>A calibrated model's confidence can be trusted. An over-confident model sounds sure when it should not, which is how confident wrong answers, called hallucinations, appear.</figcaption></figure>

## 4. The spread: variance and standard deviation

Think of two bus routes that both take 30 minutes on average. On one, the bus is always within a minute or two. On the other, it can take 15 minutes or 50. The average is the same; the **spread** is very different, and it is the spread that makes you late.

Two classes can both average 60 % while one has every mark between 55 and 65 and the other runs from 20 to 100. The **variance** measures spread as the average squared distance from the mean:

```math
\sigma^2 = \frac{1}{n} \sum_{i=1}^{n} (x_i - \bar{x})^2
```

Squaring makes every gap positive and counts big gaps much more than small ones. Because squaring also squares the units (marks²), we take the square root to get the **standard deviation** `$\sigma$`, back in the original units: "a typical distance from the mean".

Here it is step by step, with five delivery times:

<div class="steps">
<div class="step"><b>The data.</b> Five deliveries took 20, 24, 25, 27 and 34 minutes.</div>
<div class="step"><b>The mean.</b> Add them and divide by 5: 130 ÷ 5 = 26 minutes.</div>
<div class="step"><b>The gaps.</b> Each value minus 26: −6, −2, −1, +1, +8. They always add to zero, which is why we square them next.</div>
<div class="step"><b>Square and average.</b> 36, 4, 1, 1, 64 add to 106. Divide by 5: the variance is 21.2 (in minutes²).</div>
<div class="step"><b>Back to minutes.</b> √21.2 ≈ 4.6. The standard deviation says a typical delivery is about 4.6 minutes from the average.</div>
</div>

<div class="problem" data-problem="probability-basics-sd"></div>

When the values are a **sample** used to estimate a bigger population, divide by `$n - 1$` instead of `$n$` (this is written `$s$`). It corrects a small bias: a sample's own mean sits closer to its values than the true mean does. For large `$n$` the difference is tiny.

Try it: press Generate 20 with 1 word of memory, then with 2 words.

<figure class="fig" data-fig="@ai-bigram-gen"><figcaption>A language model is a table of what tends to come next. More memory gives more sensible text but copies the source, because there is only one continuation. Real models do this with billions of numbers instead of a table.</figcaption></figure>

## 5. The normal curve

Many measurements pile up in a symmetric bell shape: heights, measurement errors, marks in a large exam. This shape is the **normal distribution**, set by its mean `$\mu$` (the centre) and standard deviation `$\sigma$` (the width):

```math
p(x) = \frac{1}{\sigma\sqrt{2\pi}} \, e^{-\frac{(x-\mu)^2}{2\sigma^2}}
```

The curve is a **density**: the area under it between two values is the probability of landing between them, and the total area is 1. The useful rule of thumb is **68-95-99.7**: about 68 % of values lie within 1σ of the mean, 95 % within 2σ and 99.7 % within 3σ.

<!--fig:sampling-histogram-->

Draw 1 value at a time, then 1,000. Small samples look nothing like the curve, and their mean can be well off. Large samples match it closely. This is the **law of large numbers**, and it is why models need plenty of data.

<div class="myth">

**"After five heads in a row, tails is due."** No. A fair coin has no memory: the next toss is still 50-50. The law of large numbers does not "even things out" by pushing back against a streak. It works because a streak of five becomes a tiny part of the total once you have thousands of tosses. This mistake has a name, the gambler's fallacy.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the mean measures the centre, the variance measures the spread, and the average of many random draws settles near the true mean.

**Equations:** `$\bar{x} = \frac{1}{n}\sum x_i$`; `$\sigma^2 = \frac{1}{n}\sum (x_i - \bar{x})^2$`; the sample mean's own typical error (its **standard error**) is

```math
\text{SE}(\bar{x}) = \frac{\sigma}{\sqrt{n}}
```

**Analogy:** asking one person the time gives an answer a few minutes off. Ask 100 people and average: the individual errors mostly cancel.

**Try it:** with `$\sigma = 10$`, what is the standard error of the mean for 25 values? For 2,500? (`$10/5 = 2$`; `$10/50 = 0.2$`. A hundred times the data, a tenth of the wobble.)
</details>

<div class="meaning">

<dl>
<dt>x̄ (mean)</dt><dd>The balance point of the values: add them up and divide by how many there are.</dd>
<dt>σ² (variance)</dt><dd>The average squared distance from the mean. Big gaps count much more than small ones.</dd>
<dt>σ (standard deviation)</dt><dd>The square root of the variance, back in the original units: a typical distance from the mean.</dd>
<dt>σ / √n (standard error)</dt><dd>How much an average of n values wobbles from sample to sample.</dd>
<dt>Physical meaning</dt><dd>The mean tells you where things usually land; the standard deviation tells you how far off they can land. A delivery firm promising "26 minutes" lives or dies by the 5-minute standard deviation, and a pollster asking 1,000 people instead of 10 gets an answer ten times steadier.</dd>
</dl>

</div>

<div class="problem" data-problem="probability-basics-se"></div>

## 6. Worked example

*Made-up numbers.* Five deliveries took 20, 24, 25, 27 and 34 minutes.

- Mean: (20 + 24 + 25 + 27 + 34) ÷ 5 = 130 ÷ 5 = **26 minutes**.
- Gaps from the mean: −6, −2, −1, 1, 8. Squared: 36, 4, 1, 1, 64. Sum: 106.
- Population variance: 106 ÷ 5 = 21.2; standard deviation √21.2 ≈ **4.6 minutes**.
- Sample standard deviation (dividing by 4): √(106 ÷ 4) = √26.5 ≈ 5.1 minutes.

If delivery times are roughly normal with mean 26 and σ ≈ 5, about 95 % of deliveries take between 16 and 36 minutes (26 ± 2 × 5). A firm promising "within 35 minutes" would miss a few percent of the time.

## 7. Practice

1. Find the mean and population standard deviation of 3, 7, 7, 11.
2. Test marks are normal with mean 65 and σ = 8. About what share of students score above 81?
3. A spam filter says `$P(\text{spam}) = 0.3$`. What is `$P(\text{not spam})$`?

<details>
<summary>Answers</summary>

1. Mean 7. Squared gaps 16, 0, 0, 16: variance 32 ÷ 4 = 8, σ = √8 ≈ 2.83.
2. 81 is 2σ above the mean. 95 % lie within ±2σ, so 5 % lie outside, half of them above: about 2.5 %.
3. 0.7.
</details>

**Try it on your own data:** the [[distribution-explorer]] draws normal and other curves and shades any probability you ask for.

**New words:** *probability*, *independent*, *conditional probability*, *mean*, *median*, *variance*, *standard deviation*, *normal distribution*, *density*, *standard error*, *law of large numbers*.

<div class="keypoints">

- A probability runs from 0 (impossible) to 1 (certain); all outcomes add to 1.
- The mean is the centre; the variance is the average squared gap from it; the standard deviation is its square root, in the original units.
- For a normal curve, about 68 %, 95 % and 99.7 % of values lie within 1, 2 and 3 standard deviations of the mean.
- An average of n values wobbles like σ ÷ √n, so more data gives steadier answers.

</div>
