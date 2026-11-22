---
name: Labour productivity
num: 3086
shelf: money
code: T1067
section: small-business
title: "Labour productivity: hours, people and cost per unit sold"
summary: "Work out the labour hours, people, full-time equivalents and cost per sale you need by department, at any busy level, with a what-if for volume, time and wages."
status: live
ads: false
order: 3086
icon: clock
works: offline
updated: 2026-11-22
related: [shift-scheduler, timesheet, hourly-salary, demand-forecaster]
sources:
  - "Plain arithmetic: work hours = units times minutes each, divided by the productive share of a paid shift, plus support and fixed hours, never below the minimum staffing."
  - "The example departments, minutes and wages are made up; set your own from your own time studies."
flow:
  - { icon: pencil, label: "Business" }
  - { icon: clock, label: "Standards" }
  - { icon: table, label: "Staffing" }
  - { icon: coin, label: "Cost" }
---

## What it does

Labour is usually the biggest cost in a service business, and the hardest to plan, because the work rises and falls with how much you sell. This tool turns your standards (minutes per job, shift length, minimum staffing, wages) into the hours, the people and the cost you need on a typical day, by department. It then shows the same plan at every busy level from 30% to 100%, so you can see how many people to roster on a quiet Tuesday and on a full Saturday.

It works for hotels, restaurants, clinics, shops and any business whose work follows its sales. Each department has up to two kinds of work, each tied to something you can count: all units sold, new customers, continuing customers, your full capacity, or an extra volume such as meals served. The results give hours, people, full-time equivalents, labour cost per unit sold and labour cost as a share of sales. Once you know how many people you need, build the rota with the [[shift-scheduler]], check pay with the [[hourly-salary]] calculator, and use the [[demand-forecaster]] to know how busy to expect.

## How to use it

1. **Pick an example** (hotel, restaurant, clinic or shop) and change the numbers to match your business.
2. **Your business:** the most you could sell in a day, the share you sell, the share that are new customers, the average price, benefits, shift length and days open.
3. **Departments:** for each one, say what the work follows and the minutes each takes, the productive hours in a paid shift, support hours, fixed hours, the fewest people on a shift and the wage.
4. **Read the results:** hours, people and cost by department, and the staffing guide.
5. **What if:** move the sliders for how much you sell, how long jobs take and wage changes, then copy them into your plan if you like.

## What each setting does

- **Productive hours in a paid shift:** a person paid for 8 hours may spend 7 on the work. The tool divides the work by this share to find the paid hours.
- **Support hours per work hour:** supervisors, kitchen helpers or cover. 8% means one extra hour for every 12 hours of work.
- **Fixed hours a day:** work that happens whatever the volume, such as a manager or opening and closing.
- **Fewest people on a shift:** staffing never falls below this, so cost does not drop on slow days. The tool tells you when a department is held up by its minimum.
- **Core team:** mark the departments to include in the second set of cost figures.

## Worked example

A restaurant can seat 400 covers a day and sells 70% of that, 280 covers, at an average of 28. Servers take 8 minutes a cover, the kitchen 6, dishwashing 2.5 and the host desk 1.5. With shifts of 8 paid hours (7 productive), benefits of 15% and a manager for 8 fixed hours, the tool shows 105.3 labour hours a day, 15 people on shift, 18.4 full-time equivalents and a labour cost of 1,961 a day. That is 7.00 a cover, or 25.0% of sales.

## FAQs

**Where do the minutes per job come from?** From your own observation: time a few jobs. The examples are made-up starting points.

**Why is my cost the same on a quiet day?** A department may be at its minimum staffing. The table marks these, and a flexible roster or shorter shifts can lower them.

**Does it include breaks, overtime or local pay rules?** No. Add a margin in the support hours if you need one, and check the employment rules where you work.

**Is anything kept?** Only if you tick "Remember my numbers on this device". Nothing is sent anywhere.
