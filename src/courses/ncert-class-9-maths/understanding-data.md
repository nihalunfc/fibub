---
title: 'How Quantities Combine: Understanding Data'
seoTitle: 'Understanding Data Class 9 notes: mean, median, histogram'
summary: 'Class 9 Understanding Data with animations: frequency tables, bar graphs, histograms, polygons, mean, median, mode and combining averages.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The median of 7, 3, 9, 5, 12 is:'
    choices: ['7', '5', '9', '7.2']
    ans: 0
    why: 'Line the values up: 3, 5, 7, 9, 12. The middle value is 7. (The mean is also 7.2, but that is a different measure.)'
  - q: 'Class A has 20 students with mean 50, and class B has 30 students with mean 70. The mean of all 50 students is:'
    choices: ['62', '60', '64', '70']
    ans: 0
    why: 'Total marks = 20 × 50 + 30 × 70 = 1000 + 2100 = 3100, and 3100 ÷ 50 = 62. The simple average 60 is wrong because the classes are different sizes.'
  - q: 'In a histogram, the bars touch because:'
    choices: ['the classes follow one another on a number line', 'the data are all equal', 'the mean is in the middle', 'there is no mode']
    ans: 0
    why: 'Each class begins where the one before it ends, so the bars join. A bar graph of categories has gaps instead.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 10 “How Quantities Combine: Understanding Data” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Edward Tufte, The Visual Display of Quantitative Information (1983), for the “lie factor” idea behind misleading axes; Karl Pearson (1895) for the name “histogram”'
---

**Maths · Class 9 · Chapter 10 · about 55 minutes.** By the end you will be able to collect and organise data, draw bar graphs, histograms and frequency polygons, find the mean, median and mode, and combine the averages of two groups correctly.

<div class="bigidea">Data is just a pile of numbers until you organise it. A frequency table counts, a graph shows the shape, and three numbers (mean, median, mode) say where the middle is. The mean is the balance point, the median is the middle one when lined up, the mode is the most common. When you combine groups, bigger groups must count for more.</div>

## 1. Collecting data

**Data** are facts or numbers that we collect to answer a question: how many cups of chai do students drink, how tall are Class 9 students, how many runs did a batter score?

- **Primary data** you collect yourself (a survey, a measurement). **Secondary data** someone else collected (the census, a cricket scorecard).
- A **population** is everyone you want to know about. Asking everyone (a census) is slow and costly, so we often ask a **sample**, a smaller group.
- A good sample is **fair**: chosen at random, big enough, and not only your friends. Asking only the cricket club about favourite sport gives a wrong answer for the whole school.

Pick random samples from a group of 100 students and see how close the sample mean gets to the true mean.

<figure class="fig" data-fig="c9-data-sample"><figcaption>Choose a sample size and press Pick a sample. The red dots on the line are sample means. Samples of 5 jump around; samples of 50 stay close to the true mean. A big fair sample tells you about the whole group.</figcaption></figure>

<div class="myth">

**“A bigger survey is always a better survey.”** Not if it is unfair. Asking 1000 people outside a cricket stadium about favourite sport tells you little about the whole city. A fair, random sample of 100 beats a biased one of 1000.

</div>

## 2. Organising data: tally and frequency table

Raw data, such as 2, 1, 3, 2, 0, 2, 1 …, is hard to read. We organise it in a **frequency table**: for each value, count how many times it occurs. That count is the **frequency**. A **tally chart** is a quick way to count: make one stroke per item and cross every fourth stroke with a fifth, so groups of five are easy to count.

<div class="steps" data-fig="c9-data-tally">
<div class="step">Twenty students were asked how many cups of chai they drank yesterday. The raw list is not easy to read.</div>
<div class="step">Go through the list once and make a tally mark for each value in its row. Every fifth mark crosses the first four.</div>
<div class="step">Count each row: the frequencies are 2, 5, 8, 4 and 1. They add up to 20, the number of students. Always check the total.</div>
<div class="step">Draw a bar for each value, as tall as its frequency. Leave gaps because each value is a separate category.</div>
<div class="step">The tallest bar is the mode: 2 cups was the most common answer, given by 8 students.</div>
</div>

## 3. Bar graphs and histograms

A **bar graph** shows the frequency of separate things: sports, fruits, towns. The **height** of the bar is the frequency, bars have gaps and equal widths, and because the categories have no natural order you may arrange them any way you like (for example, tallest first).

When the data are **numbers spread over a range** (marks, heights, ages), we group them into **classes** (class intervals) such as 0–10, 10–20, 20–30. The usual rule: a value on the upper limit goes into the **next** class, so 20 belongs to 20–30. The picture is a **histogram**: bars with no gaps, because one class ends exactly where the next starts.

<figure class="fig" data-fig="c9-data-barvshist"><figcaption>Switch between a bar graph of sports and a histogram of mark classes. Try Shuffle: bars of categories can be reordered, but classes on a number line cannot, and they touch.</figcaption></figure>

<div class="steps" data-fig="c9-data-hist">
<div class="step">Raw marks of 24 students in a test out of 50. We cannot read much from the list.</div>
<div class="step">Choose classes of equal width 10: 0–10, 10–20, 20–30, 30–40, 40–50. A mark of 10 goes into 10–20.</div>
<div class="step">Count the marks in each class: 1, 4, 7, 8 and 4. These are the frequencies, and they add to 24.</div>
<div class="step">Draw the histogram: a bar for each class with no gaps. The height shows the frequency.</div>
<div class="step">A frequency polygon: put a dot at the middle of the top of each bar (the class mark 5, 15, 25, 35, 45), add an empty class at each end, and join the dots with straight lines.</div>
<div class="step">The tallest bar is the modal class, 30–40. Eight students are in it. Polygons are handy for comparing two sets of data on one graph.</div>
</div>

The **class mark** of a class is its middle value: for 20–30 it is (20 + 30) ÷ 2 = 25.

How wide should the classes be? Try it.

<figure class="fig" data-fig="c9-data-bins"><figcaption>Heights of 40 students with different class widths. Width 2 is lumpy, width 20 hides the shape; widths 5 or 10 show it well. The data never change, only how we group them.</figcaption></figure>

<div class="problem" data-problem="c9m-data-classfreq"></div>

**Beware of misleading graphs.** A bar chart whose axis does not start at zero can make a tiny difference look huge. Slide the axis start and watch.

<figure class="fig" data-fig="c9-data-misleading"><figcaption>Three batteries last 96, 98 and 100 hours, a difference of 4%. Move the axis start up and bar C seems to be many times bar A. Always read the numbers on the axis.</figcaption></figure>

Make your own histogram from any list of numbers:

<!--fig:tool histogram-builder-->

<div class="keypoints">

- A frequency is a count. A frequency table lists each value or class with its frequency; the frequencies add up to the number of data items.
- Bar graph: separate categories, gaps, any order. Histogram: classes on a number line, no gaps, fixed order.
- A value on the upper limit of a class goes into the next class.
- A frequency polygon joins the class marks at the tops of the bars, starting and ending on the axis.
- A graph can mislead if its axis does not start at zero.

</div>

## 4. The mean: the balance point

The **mean** (average) is the total divided by the number of values:

```math
\text{mean} = \frac{\text{sum of all values}}{\text{number of values}}
```

If 4 friends pay ₹20, ₹30, ₹40 and ₹50 for snacks and decide to share the bill equally, each pays (20 + 30 + 40 + 50) ÷ 4 = ₹35. The mean is the equal share.

<div class="meaning">
<dl>
<dt>Σ x</dt><dd>the sum of all the values</dd>
<dt>n</dt><dd>the number of values</dd>
<dt>mean = Σx ÷ n</dt><dd>the value each item would have if the total were shared out equally</dd>
<dt>Physical meaning</dt><dd>Put each value as a weight on a ruler. The ruler balances exactly at the mean. Values below the mean pull one way, values above pull the other, and the pulls cancel.</dd>
</dl>
</div>

<figure class="fig" data-fig="c9-data-mean"><figcaption>The values are weights on a beam. Move the fulcrum: the beam tips to the heavier side and balances exactly at the mean. The sum of (value − fulcrum) is zero there. In the data 2, 3, 3, 4, 18 one large value drags the mean far to the right.</figcaption></figure>

<div class="problem" data-problem="c9m-data-mean"></div>

**Finding a missing value.** If you know the mean and n, the total is mean × n. A cricketer averaging 40 in 5 innings has scored 200 runs in all. If four scores add up to 170, the fifth was 30.

<div class="problem" data-problem="c9m-data-missing"></div>

**Mean from a frequency table.** When values repeat, multiply each value x by its frequency f, add these products, and divide by the total frequency:

```math
\text{mean} = \frac{\sum f x}{\sum f}
```

<div class="steps" data-fig="c9-data-freqmean">
<div class="step">Goals scored in 20 school matches: the value x (goals) and the frequency f (matches).</div>
<div class="step">Add the f column to get the number of matches: 3 + 6 + 5 + 4 + 2 = 20.</div>
<div class="step">Multiply each row: f × x gives the goals scored by that group of matches, for example 6 matches with 1 goal each is 6 goals.</div>
<div class="step">Add the fx column: 0 + 6 + 10 + 12 + 8 = 36 goals in total.</div>
<div class="step">Mean = 36 ÷ 20 = 1.8 goals a match.</div>
</div>

<div class="problem" data-problem="c9m-data-freqmean"></div>

<div class="myth">

**“The mean must be one of the values in the data.”** It need not be, and it may not even make sense as a single item: the average family has 2.4 children, yet no family has 2.4. The mean is a summary, not a member of the list.

</div>

Check frequency-table and grouped-data averages in the grouped data tool:

<!--fig:tool grouped-data-stats-->

## 5. The median and the mode

The **median** is the middle value after the data are lined up in order.

1. Line the values up from smallest to largest.
2. If there are an **odd** number of values, the median is the middle one.
3. If there are an **even** number, the median is the **mean of the two middle values**.

Data 7, 3, 9, 5, 12 lined up: 3, 5, **7**, 9, 12. The median is 7. With 3, 5, 7, 9 the middle two are 5 and 7, so the median is 6.

<figure class="fig" data-fig="c9-data-median"><figcaption>Monthly pay of workers in a small factory. Press Line up to sort the bars; the middle bar (or two bars) shows the median. Now drag the last person’s pay up: the mean races ahead, but the median hardly moves. That is why we quote median house prices and median salaries.</figcaption></figure>

<div class="problem" data-problem="c9m-data-median"></div>

The **mode** is the value that occurs **most often**: the tallest bar in a bar graph. A set can have one mode, two modes (bimodal), or none if every value appears once. For categories, like the most popular shoe size sold in a shop, the mode is the only average that makes sense: you cannot find the “mean” shoe size to order for the shop.

<figure class="fig" data-fig="c9-data-three"><figcaption>Mean, median and mode of shoe sizes on one picture. With an even spread the three agree. With a long tail to the right the mean is dragged above the median. With two peaks there are two modes and the mean falls in the gap.</figcaption></figure>

**Which average to use?** Mean: when values are fairly even and you want to use every value. Median: when there are extreme values, such as salaries. Mode: when you want the most common value or the data are categories.

## 6. Combining groups: the weighted mean

Section A of Class 9 has 20 students with mean mark 50. Section B has 30 students with mean 70. What is the mean of all 50? The tempting answer, (50 + 70) ÷ 2 = 60, is wrong, because section B has more students. Go back to totals:

```math
\text{combined mean} = \frac{n_1 \bar{x}_1 + n_2 \bar{x}_2}{n_1 + n_2} = \frac{20 \times 50 + 30 \times 70}{20 + 30} = \frac{3100}{50} = 62
```

The combined mean sits **closer to the bigger group’s mean**, like a see-saw where the heavier child sits nearer the middle. This is also called a **weighted mean**: each mean is weighted by the size of its group.

<figure class="fig" data-fig="c9-data-weighted"><figcaption>Two classes on a see-saw: the bigger the class, the bigger the ball. The combined mean (green) leans towards the bigger class. Make the classes equal in size and it moves to the simple average in the middle.</figcaption></figure>

<div class="problem" data-problem="c9m-data-combine"></div>

<div class="myth">

**“The average of two averages is the average.”** Only when the two groups are the same size. Otherwise always add the totals first, then divide by the total number of students.

</div>

Other tools in this area: the [Publication plot maker](/science/plot-maker/) draws clean graphs from your own numbers.

<div class="history">

<ul class="timeline">
<li><b>1662</b> John Graunt studies London’s weekly lists of deaths and finds patterns in them: an early use of tables of data.</li>
<li><b>1801</b> William Playfair invents the bar chart (and the line and pie charts).</li>
<li><b>1895</b> Karl Pearson gives the histogram its name.</li>
<li><b>1950s</b> P. C. Mahalanobis builds the Indian Statistical Institute and the National Sample Survey, which use samples to describe a country.</li>
</ul>

</div>

<div class="keypoints">

- Mean = sum ÷ number of values; with a frequency table, mean = Σfx ÷ Σf. It is the balance point of the data.
- Median = the middle value when lined up (for an even count, the mean of the middle two). It is not dragged by extreme values.
- Mode = the most frequent value; there can be one, two or none.
- Total = mean × number of values; use it to find a missing value.
- Combined mean of two groups = (n₁x̄₁ + n₂x̄₂) ÷ (n₁ + n₂): add the totals, never average the averages (unless the groups are equal).
- Collect data fairly: a random, big enough sample describes the whole population.

</div>
