---
title: 'Types of data: numbers, categories, text and time'
seoTitle: 'Types of data: numerical, categorical, text and time'
summary: 'Continuous and discrete numbers, nominal and ordinal categories, text, and dates and times. The type of a column decides what you can do with it. Sort real values into types in a quick game.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: Which of these is ordinal data?
    choices: ['Blood group (A, B, AB, O)', 'Clothing size (S, M, L, XL)', 'Weight in kg']
    ans: 1
    why: Sizes are categories with a natural order. Blood groups have no order; weight is a continuous number.
  - q: Why is it wrong to average postal codes?
    choices: ['Because they are too long', 'Because they are labels for places, not amounts, so their average means nothing', 'Because they contain letters only']
    ans: 1
    why: A postal code names a place. Even when it is all digits, adding or averaging codes produces nonsense.
  - q: 'You have a column "order time". Which feature would a model most likely use?'
    choices: ['The raw time stamp as one big number', 'Parts such as hour of day and day of week', 'Nothing: dates cannot be used']
    ans: 1
    why: Patterns repeat by hour, weekday and season, so models use those parts (and times since events) rather than the raw stamp.
sources:
  - 'Stevens, S. S. (1946), On the Theory of Scales of Measurement, Science 103(2684), 677-680 https://doi.org/10.1126/science.103.2684.677'
  - 'scikit-learn user guide: Preprocessing data (encoding categorical features) https://scikit-learn.org/stable/modules/preprocessing.html'
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapters 2 and 3 https://www.statlearning.com/'
---

**Module 2 · about 15 minutes · read first: 1.2.** You'll be able to name the main types of data, spot the traps, and say how each type is turned into numbers a model can use.

<div class="bigidea">The type of a column (number, category, text or time) decides what arithmetic makes sense on it, and so how it must be turned into numbers for a model.</div>

## 1. Why this matters

Not every number is really a number. You can average the temperatures of a week, but averaging the phone numbers of your friends gives nonsense. Sorting T-shirt sizes alphabetically puts L before M before S. Each type of column allows some operations and forbids others, like tools in a kitchen: a knife cuts, a whisk whisks, and swapping them makes a mess. Getting the type wrong is one of the quickest ways to build a model that learns rubbish.

## 2. The family tree of data types

| Type | What it is | Examples | You may | Turn into numbers by |
|---|---|---|---|---|
| **Continuous number** | Any value in a range | Temperature, price, weight | Average, subtract, scale | Use as is (then scale, Lesson 2.4) |
| **Discrete number** | Counts in whole steps | Children, visits, items in a basket | Average, subtract | Use as is |
| **Nominal category** | Names with no order | Blood group, city, colour | Count, find the most common | One-hot encoding (Lesson 1.2) |
| **Ordinal category** | Names with an order | Size S to XL, grades A to D, ratings 1 to 5 | Sort, find the median | Number them in order (S=1, M=2...) |
| **Text** | Free writing | Reviews, emails, notes | Count words, search | Word counts, TF-IDF or embeddings (Module 10) |
| **Date, time, sequence** | Points or values in order | Order time, daily rainfall | Order, take differences | Hour, weekday, month, time since, lagged values |

Numbers are also called **quantitative** or **numerical** data; categories are **qualitative** or **categorical** data.

<div class="meaning">

<dl>
<dt>Continuous</dt><dd>Can take any value in a range, like 21.37 °C. You can average and subtract.</dd>
<dt>Discrete</dt><dd>Comes in whole steps, like 3 children. Averages are fine (2.4 children per family is a useful summary).</dd>
<dt>Nominal</dt><dd>Names with no order, like city or blood group. Only "same or different" makes sense.</dd>
<dt>Ordinal</dt><dd>Names with an order, like S, M, L. You can sort, but the gaps may not be equal.</dd>
<dt>Physical meaning</dt><dd>A column's type is a promise about what its numbers mean. Weight in kg promises that 40 is twice 20. A postal code promises nothing of the kind: it is a name that happens to use digits. A model believes every number it is given, so you must keep only the promises that are true.</dd>
</dl>

</div>

## 3. Test yourself

<!--fig:data-types-->

## 4. The traps

- **Digits that are labels.** Postal codes, phone numbers, product codes, customer IDs and year groups written as numbers are categories. A spreadsheet will happily average them, and a model will happily learn that customer 90,001 is "bigger" than customer 12. Store them as text.
- **Ratings that look like numbers.** A 1-to-5 score is ordinal. Averaging it is common and often useful, but remember the steps may not be equal.
- **Categories with thousands of values.** A "city" column with 4,000 cities makes 4,000 one-hot columns. Group rare ones as "other", or use the city's population or region instead.
- **IDs that leak the answer.** Row numbers or IDs assigned in time order can secretly encode when something happened. Drop IDs before training (Lesson 7.4).
- **Times with time zones.** "09:00" in Toronto and in Mumbai are different moments. Store times in one zone, then make local-hour features if they matter.

<div class="myth">

**"If it's made of digits, it's a number."** Postal codes, phone numbers, product codes and customer IDs are labels written with digits. Customer 90,001 is not "bigger" than customer 12, and the average postal code of your customers is not a place. Store these columns as text so no tool is tempted to do arithmetic on them.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the levels of measurement decide which arithmetic is meaningful.

| Level | Meaningful | Example |
|---|---|---|
| Nominal | equal or not equal | `$\text{city}_1 = \text{city}_2$`? |
| Ordinal | also `$<$` and `$>$` | `$\text{S} < \text{M}$` |
| Interval | also differences | 20 °C − 10 °C = 10 degrees warmer |
| Ratio | also ratios (there is a true zero) | 40 kg is twice 20 kg |

Temperature in °C is interval, not ratio: 20 °C is not "twice as hot" as 10 °C, because 0 °C is not "no heat". In kelvin (293 K and 283 K) the ratio is only 1.04.

**Cyclic features:** hour 23 is next to hour 0, but as plain numbers they are 23 apart. Turn a cycle into two numbers on a circle,

```math
\left(\sin\frac{2\pi \cdot \text{hour}}{24},\ \cos\frac{2\pi \cdot \text{hour}}{24}\right)
```

so that 23:00 and 00:00 end up close together.

**Try it:** what are the (sin, cos) values for 06:00? (`$\sin(\pi/2) = 1$`, `$\cos(\pi/2) = 0$`: the point (1, 0).)
</details>

Watch one bike-share row become model-ready numbers:

<div class="steps">
<div class="step"><b>The raw row.</b> Station 7031, Saturday 23:00, 14 °C, weather "rain".</div>
<div class="step"><b>The station ID is a name.</b> 7031 is not "more" than station 12. Replace it with facts about the station, such as "near a university: yes", or one-hot encode it.</div>
<div class="step"><b>The time stamp is a cycle.</b> Hour 23 becomes the point (sin, cos) = (−0.26, 0.97) on a circle, right next to hour 0 at (0, 1). Saturday becomes a "weekend: yes" flag.</div>
<div class="step"><b>The temperature stays a number.</b> 14 °C is continuous: keep it, then scale it (Lesson 2.4).</div>
<div class="step"><b>The weather is ordered.</b> For cycling, clear &lt; cloudy &lt; rain &lt; snow, so rain becomes 2 on a 0-to-3 scale.</div>
</div>

<div class="problem" data-problem="types-of-data-cyclic"></div>

## 5. Worked example

*Made-up numbers.* A bike-share company wants to predict rentals per hour. Its raw table has: station ID, time stamp, temperature (°C), weather ("clear", "cloudy", "rain", "snow"), and a free-text "notes" column.

- **Station ID** (e.g. 7031): nominal. One-hot encode it if there are a few dozen stations, or replace it with station facts (near a university? near a station?).
- **Time stamp:** split into hour (as sine and cosine), weekday, month and a holiday flag. Rentals depend on all four.
- **Temperature:** continuous; scale it.
- **Weather:** looks nominal, but there is an order of "badness" for cycling (clear < cloudy < rain < snow), so it can be treated as ordinal: 0, 1, 2, 3.
- **Notes:** text; ignore it at first, or count a few key words such as "event" or "closed".

## 6. Practice

1. Is "number of rooms" continuous or discrete?
2. A survey asks for income band: under 30k, 30-60k, 60-100k, over 100k. What type is it?
3. Why is it a bad idea to one-hot encode a free-text review column?

<details>
<summary>Answers</summary>

1. Discrete: rooms come in whole numbers.
2. Ordinal: the bands have an order but unequal widths.
3. Nearly every review is different, so you'd get one column per review, which teaches nothing. Text needs word counts or embeddings (Module 10).
</details>

**Try it on your own data:** the [[csv-profiler]] guesses each column's type and shows its gaps and most common values.

**New words:** *continuous*, *discrete*, *nominal*, *ordinal*, *interval* and *ratio* scales, *cyclic feature*.

<div class="keypoints">

- Numbers can be continuous (any value) or discrete (whole steps); categories can be nominal (no order) or ordinal (ordered).
- Digits that name things (postal codes, IDs) are categories, not numbers.
- Nominal categories are one-hot encoded; ordinal ones can be numbered in order.
- Times are split into useful parts, and cycles such as the hour go on a circle with sine and cosine.

</div>
