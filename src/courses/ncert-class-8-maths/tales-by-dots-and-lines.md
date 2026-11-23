---
title: 'Tales by Dots and Lines'
seoTitle: 'Data Handling Class 8 notes: graphs, mean, median'
summary: 'Class 8 Maths: bar graphs, histograms, pie charts, line graphs, mean, median and mode, with charts that change as you drag the data.'
minutes: 55
updated: 2026-11-23
quiz:
  - q: 'The mean of 6, 8, 10, 12 and 14 is:'
    choices: ['10', '8', '12', '50']
    ans: 0
    why: 'The sum is 50 and there are 5 values: 50 ÷ 5 = 10.'
  - q: 'In a survey of 60 students, 15 chose cricket. The angle of the cricket sector in a pie chart is:'
    choices: ['90°', '15°', '60°', '150°']
    ans: 0
    why: '(15 ÷ 60) × 360° = 90°.'
  - q: 'The median of 9, 2, 7, 4, 100 is:'
    choices: ['7', '4', '24.4', '9']
    ans: 0
    why: 'In order: 2, 4, 7, 9, 100. The middle value is 7. The mean (24.4) is pulled up by the 100.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 12 “Tales by Dots and Lines” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school statistics (graphs, measures of central tendency). All data in the figures are made-up classroom examples; every worked answer was recomputed a second way.'
---

**Maths · Class 8 · Chapter 12 · about 55 minutes.** By the end you will be able to choose the right graph for a story, draw a bar graph, histogram, pie chart and line graph, read them honestly, and find the mean, median and mode of data and explain which one to trust.

<div class="bigidea">Numbers in a list are hard to see. A picture shows the story at once: who is biggest, how the parts fit into a whole, how things change with time. And three numbers (mean, median, mode) say what is “typical”. Choosing the right picture and the right number is the skill.</div>

## 1. Bar graphs and pie charts: comparing groups

A class of 40 students votes for their favourite sport: cricket 16, football 10, kabaddi 8, hockey 6. We can show this two ways.

- A **bar graph** has one bar for each group. The height shows how many. The gaps between bars remind us these are separate groups. Bars are best for comparing amounts.
- A **pie chart** is a circle cut into sectors. Each sector is one group’s share of the whole. The pie is best for showing parts of a whole.

Change the kabaddi count with the slider. The bars and the pie both change, and the pie’s angles always add up to 360°.

<figure class="fig" data-fig="c8-data-three"><figcaption>The same survey as a bar graph and as a pie chart. Angle of a sector = (count ÷ total) × 360°. Move the kabaddi slider and watch every angle adjust, because the total changes.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Frequency</dt><dd>how many times a value or group occurs (the height of a bar).</dd>
<dt>Sector angle</dt><dd>`$\dfrac{\text{count}}{\text{total}} \times 360^\circ$`. A sector of 90° is one quarter of the whole.</dd>
<dt>Physical meaning</dt><dd>a bar graph compares sizes side by side; a pie chart shows how a whole is shared.</dd>
</dl>
</div>

## 2. Drawing a pie chart, step by step

To draw a pie chart you must turn each count into an angle. Follow the steps for a survey of 36 students and their favourite fruit.

<div class="steps" data-fig="c8-data-piesteps">
<div class="step">Survey of 36 students. Mango 15, banana 9, apple 6, guava 6.</div>
<div class="step">Add the counts: 36. The whole circle stands for 36 students.</div>
<div class="step">One student is 360° ÷ 36 = 10°.</div>
<div class="step">Angles: mango 150°, banana 90°, apple 60°, guava 60°.</div>
<div class="step">Check: 150 + 90 + 60 + 60 = 360°.</div>
<div class="step">Draw the circle and mark each angle with a protractor. Label the sectors.</div>
</div>

<div class="problem" data-problem="c8m-data-pie"></div>

<div class="myth">

**“The angles of a pie chart add up to 100.”** They add to 360°, a full turn. The percentages add to 100. Always check the angle total before you colour the chart.

</div>

## 3. Histograms: graphs for grouped numbers

Suppose you measure the heights of 30 students. Heights are not neat categories like sports: they can be any number. So we group them into **class intervals** of equal width (125–135, 135–145, and so on), count how many fall into each, and draw a **histogram**. The bars **touch**, because one interval ends exactly where the next begins.

Choose a class width. A narrow width shows detail but looks messy. A wide width is tidy but hides the shape.

<figure class="fig" data-fig="c8-data-hist"><figcaption>Heights of 30 students. With 5 cm classes you can see the peak at 140–145 and the tail of taller students. With 20 cm classes the picture is simple but hides it. The tallest bar is the class with the most students. A value on the border of two classes goes into the upper one.</figcaption></figure>

A bar graph is for categories, with gaps. A histogram is for grouped continuous data, with no gaps.

Try your own data in the tools below.

<!--fig:tool grouped-data-stats-->

## 4. Line graphs: change over time

When you measure the same thing again and again over time (temperature every two hours, the price of onions each week), join the points with a line. This is a **line graph**. It shows trends: rising, falling, or flat. You can read between the points to get an estimate.

Move the time slider. The line gives an estimate between two measured points. Then switch the axis so it starts at 12 instead of 0.

<figure class="fig" data-fig="c8-data-line"><figcaption>Temperature in a winter day. The dots are real readings; the line between them is only an estimate. With the axis starting at 12 °C the afternoon looks more than twice as hot as the morning, but 28 is only twice 14. A cut axis exaggerates.</figcaption></figure>

<div class="myth">

**“A taller bar always means a much bigger number.”** Check where the axis starts. A graph that starts at 50 instead of 0 can make 52 look twice as big as 51. Always read the numbers on the axis, and be careful with graphs in advertisements.

</div>

## 5. The mean: the fair share

The **mean** (average) of some values is their sum divided by how many there are. It is the number each value would be if the total were shared out equally. Five friends read 3, 9, 5, 2 and 6 books. Total 25, so the mean is 25 ÷ 5 = 5 books each.

Drag the bars up and down, then press “Level them” to watch the tall bars pour into the short ones until all are at the mean.

<figure class="fig" data-fig="c8-data-mean"><figcaption>Five bars of books read. Drag a bar to change it; the dashed line is the mean. “Level them” moves books from taller bars to shorter ones until all are equal: each is the mean.</figcaption></figure>

```math
\text{mean} = \frac{\text{sum of all values}}{\text{number of values}}
```

Useful tricks. If you know the mean and the count, you know the sum: mean 12 for 5 numbers means the sum is 60. If a value is added or removed, change the sum, then divide again.

<div class="problem" data-problem="c8m-data-mean"></div>

<div class="problem" data-problem="c8m-data-leave"></div>

## 6. Median and mode

The **median** is the middle value when the data are arranged in order. With an odd number of values, take the middle one. With an even number, take the mean of the middle two. The **mode** is the value that occurs most often.

Slide the last score upwards. The mean runs after it, but the median hardly moves.

<figure class="fig" data-fig="c8-data-median"><figcaption>Nine scores as dots on a number line. The ninth score is slid upwards to act like a very large value. The mean (dashed) moves a long way; the median (solid) stays near the middle of the others.</figcaption></figure>

<div class="problem" data-problem="c8m-data-median"></div>

<div class="meaning">
<dl>
<dt>Mean</dt><dd>sum ÷ count. Uses every value, so a very large or small value (an outlier) pulls it.</dd>
<dt>Median</dt><dd>the middle value in order. Not affected by extreme values. Good for incomes or house prices.</dd>
<dt>Mode</dt><dd>the most common value. The only one that works for non-numbers: the most popular shirt size, the favourite fruit.</dd>
</dl>
</div>

**Which to use?** A shopkeeper stocking shirts wants the mode. A teacher summing up marks with no outliers uses the mean. For the typical salary in a village where one family is very rich, the median tells the truth.

Draw any data you like with the plot maker.

<!--fig:tool plot-maker-->

<div class="history">

**The pie chart.** The pie chart was invented by the Scottish engineer William Playfair in 1801, along with the bar graph. He wanted to make trade figures easy for ordinary people to read.

</div>

<div class="keypoints">

- Bar graph: separate groups with gaps. Histogram: grouped continuous numbers, bars touching.
- Pie chart: sector angle = (count ÷ total) × 360°; the angles add up to 360°.
- Line graph: change over time; between the dots the line is only an estimate. Beware a cut axis.
- Mean = sum ÷ count (the fair share). Median = middle value in order (mean of the middle two when the count is even). Mode = most common value.
- One huge value changes the mean a lot but the median very little.
- Choose the picture by the story, and the number by what you want to know.

</div>

Other tools to explore: the [Plot maker](/science/plot-maker/) and the [Grouped data stats tool](/learn/grouped-data-stats/) work on their own too. Ready for exam-style questions? Go to [Tales by Dots and Lines: practice questions](/learn/courses/ncert-class-8-maths/tales-by-dots-and-lines-practice/).
