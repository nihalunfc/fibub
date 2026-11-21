---
title: 'Types of data: numbers, categories, text and time'
seoTitle: 'Types of data: numerical, categorical, text and time'
summary: 'Continuous and discrete numbers, nominal and ordinal categories, text, and dates and times. The type of a column decides what you can do with it. Sort real values into types in a quick game.'
minutes: 15
updated: 2026-11-21
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
---

**Module 2 · about 15 minutes · read first: 1.2.** You'll be able to name the main types of data, spot the traps, and say how each type is turned into numbers a model can use.

## 1. Why this matters

Each column type allows some operations and forbids others. Averaging a continuous column is fine; averaging an ID number is nonsense; sorting T-shirt sizes alphabetically puts L before M before S. Getting the type wrong is one of the quickest ways to build a model that learns rubbish.

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

## 3. Test yourself

<!--fig:data-types-->

## 4. The traps

- **Digits that are labels.** Postal codes, phone numbers, product codes, customer IDs and year groups written as numbers are categories. A spreadsheet will happily average them, and a model will happily learn that customer 90,001 is "bigger" than customer 12. Store them as text.
- **Ratings that look like numbers.** A 1-to-5 score is ordinal. Averaging it is common and often useful, but remember the steps may not be equal.
- **Categories with thousands of values.** A "city" column with 4,000 cities makes 4,000 one-hot columns. Group rare ones as "other", or use the city's population or region instead.
- **IDs that leak the answer.** Row numbers or IDs assigned in time order can secretly encode when something happened. Drop IDs before training (Lesson 7.4).
- **Times with time zones.** "09:00" in Toronto and in Mumbai are different moments. Store times in one zone, then make local-hour features if they matter.

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
