---
title: 'Just enough Python'
summary: 'The Python you need for pandas and nothing more: variables, numbers and text, lists and dictionaries, functions and methods, and reading error messages.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What does prices[0] give for prices = [4.5, 9.0, 12.0]?'
    choices: ['4.5', '9.0', 'An error']
    ans: 0
    why: 'Python counts from 0, so [0] is the first item.'
  - q: 'Which is a dictionary?'
    choices: ['[1, 2, 3]', "{'S01': 'Harbourview', 'S02': 'Maple Ridge'}", "('a', 'b')"]
    ans: 1
    why: 'A dictionary maps keys to values with curly braces and colons. pandas uses them to rename columns and build tables.'
  - q: "What's the difference between len(x) and x.upper()?"
    choices: ['None', 'len is a function you pass x to; upper is a method that belongs to text and is called on it with a dot', 'upper is faster']
    ans: 1
    why: 'pandas is mostly methods: df.head(), df.groupby(...), s.sum().'
sources:
  - 'The Python Tutorial, sections 3-5 https://docs.python.org/3/tutorial/'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 1 · about 20 minutes · no Python needed.** You'll be able to read and write the small amount of Python that pandas code uses.

<div class="bigidea">Just enough Python for pandas: names that hold values, lists and dictionaries, and calling functions and methods.</div>

**In everyday terms:** a variable is a labelled jar: put a value in, and use the label to get it back. A list is a row of jars in order; a dictionary is a set of jars with name tags you look up by name.

## 1. Values and variables

A **variable** is a name for a value. `=` stores the value; the name then stands for it.

```python
price = 12.49        # a float (a number with a decimal point)
qty = 3              # an int (a whole number)
store = 'Harbourview'  # a str (text), in quotes
total = price * qty
print(store, 'sold', qty, 'for', total)
round(total, 2)
```

Anything after `#` is a **comment**, for humans. `print()` shows values; the last line's value is shown too.

**f-strings** put values into text: `f'{store} sold {qty} items'`. Add `:.2f` for two decimals: `f'{total:.2f}'`.

## 2. Lists and dictionaries

A **list** holds values in order, in square brackets. A **dictionary** maps **keys** to **values**, in curly braces.

```python
prices = [18.99, 12.49, 2.29]
print(prices[0], prices[-1], len(prices), sum(prices))

stores = {'S01': 'Harbourview', 'S02': 'Maple Ridge'}
print(stores['S02'])
stores['S03'] = 'Cedar Falls'
stores
```

`[0]` is the first item (Python counts from 0), `[-1]` the last. pandas uses lists for "these columns" (`df[['store', 'qty']]`) and dictionaries for "rename this to that" (`df.rename(columns={'qty': 'units'})`).

## 3. Functions and methods

A **function** takes inputs in brackets: `len(prices)`, `round(3.14159, 2)`. A **method** belongs to a value and is called with a dot: `'maple'.upper()`, `prices.append(5.99)`. Inputs can be named: `round(number=3.14159, ndigits=2)`. pandas code is mostly methods, often with named options: `df.sort_values('qty', ascending=False)`.

You can write your own function with `def`:

```python
def with_tax(amount, rate=0.13):
    return round(amount * (1 + rate), 2)

print(with_tax(100))
print(with_tax(100, rate=0.05))
```

The indented lines belong to the function; `rate=0.13` is a default you can override.

## 4. Choices and loops (briefly)

```python
prices = [18.99, 12.49, 2.29]
for p in prices:
    if p > 10:
        print(p, 'is over $10')
    else:
        print(p, 'is $10 or less')
```

You'll rarely loop over rows in pandas: whole-column operations are shorter and much faster (Lesson 8.8). But it helps to read loops.

<div class="meaning">

<dl>
<dt>x = 5</dt><dd>Put 5 in a jar labelled x (assignment, not "equals").</dd>
<dt>[1, 2, 3]</dt><dd>A list: values in order, counted from 0.</dd>
<dt>{'S01': 'Harbourview'}</dt><dd>A dictionary: look up a value by its key.</dd>
<dt>f(x) and x.method()</dt><dd>A function takes inputs; a method is a function that belongs to a value, such as text.upper().</dd>
<dt>Physical meaning</dt><dd>Python reads top to bottom and remembers every name you created. In pandas you keep reassigning tables to names (orders, clean, monthly), so the name always points at the latest version.</dd>
</dl>

</div>

<div class="myth">

**"= means equal."** In Python <code>=</code> means "store this under that name". Comparing uses <code>==</code>. Writing <code>if qty = 3</code> is an error; <code>if qty == 3</code> asks the question.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Store.</b> <code>price = 18.99</code> and <code>qty = 3</code>.</div>
<div class="step"><b>Compute.</b> <code>total = price * qty</code> → 56.97.</div>
<div class="step"><b>List.</b> <code>stores = ['S01', 'S02', 'WEB']</code>; <code>stores[0]</code> is 'S01' (counting starts at 0).</div>
<div class="step"><b>Dictionary.</b> <code>names = {'S01': 'Harbourview'}</code>; <code>names['S01']</code> → 'Harbourview'.</div>
<div class="step"><b>Method.</b> <code>'harbourview'.title()</code> → 'Harbourview'. pandas works the same way: <code>orders.head()</code>.</div>
</div>

<div class="problem" data-problem="pd-list-index"></div>

## 5. Your turn

```python exercise
prices = [18.99, 12.49, 2.29, 6.99]
# 1. Make a variable called average: the sum of prices divided by how many there are.
# 2. Put average on the last line, rounded to 2 decimals.
```
```python solution
prices = [18.99, 12.49, 2.29, 6.99]
average = sum(prices) / len(prices)
round(average, 2)
```
```python check
assert 'average' in dir(), 'Make a variable called average.'
assert abs(average - 10.19) < 0.01, f'average is {average}; it should be the sum divided by the count.'
assert _ == 10.19, 'Show round(average, 2) on the last line.'
```
```hint
sum(prices) adds them up and len(prices) counts them. Then put round(average, 2) on the last line.
```

```python exercise
codes = {'S01': 'Harbourview', 'S02': 'Maple Ridge', 'S03': 'Cedar Falls'}
# Add 'S04' for 'Pine Lake', then show the name for 'S04'.
```
```python solution
codes = {'S01': 'Harbourview', 'S02': 'Maple Ridge', 'S03': 'Cedar Falls'}
codes['S04'] = 'Pine Lake'
codes['S04']
```
```python check
assert codes.get('S04') == 'Pine Lake', "Add the key 'S04' with the value 'Pine Lake'."
assert _ == 'Pine Lake', "Show codes['S04'] on the last line."
```
```hint
Assign with codes['S04'] = 'Pine Lake', then read it back with codes['S04'].
```

<details class="maths" open>
<summary>How it works: reading an error</summary>

**Principle:** Python stops at the first problem and names it. Read the **last line** first: the error type and message, then the line number.

- `NameError: name 'totl' is not defined`: a typo, or a variable made in another box.
- `SyntaxError`: a missing bracket, quote or colon.
- `TypeError: can only concatenate str (not "int") to str`: mixing text and numbers; use an f-string.
- `KeyError: 'S09'`: that key (or, in pandas, column) doesn't exist.
- `IndentationError`: the spaces at the start of a line don't line up.

Run this box to see one, then fix it:

```python error
qty = 3
message = 'Sold ' + qty + ' items'
message
```
</details>

## 6. Practice

1. What does `[10, 20, 30][1]` give?
2. Write an f-string that shows `price = 4.5` as `$4.50`.
3. Why does `'5' + 5` fail, and how would you fix it?

<details>
<summary>Answers</summary>

1. 20 (the second item; counting starts at 0).
2. `f'${price:.2f}'`.
3. It mixes text and a number. Use `int('5') + 5` for 10, or `'5' + str(5)` for `'55'`.
</details>

**New words:** *variable*, *int*, *float*, *str*, *list*, *dictionary*, *function*, *method*, *f-string*, *comment*.

<div class="keypoints">

- = stores a value under a name; == compares.
- Lists are ordered and counted from 0; negative numbers count from the end.
- Dictionaries map keys to values.
- Methods are called with a dot: value.method().

</div>
