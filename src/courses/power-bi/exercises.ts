// Practice editors for the Power BI course, by id: used in a lesson as <!--fig:dax-pad <id>-->.
// task: what to do (HTML allowed). starter: the code already in the box. solution: the expected answer; "Check my
// answer" compares the learner's LAST measure (or query) with the solution's on every row of the "Split by"
// column and the total. append: code added to both before checking (for calculated column tasks).
// by: the column the result is split by at the start. Every solution is run by tests/dax-exercises.mjs.
export type Exercise = {
  task?: string; starter: string; solution?: string; hint?: string; by?: string; append?: string; ordered?: boolean;
  slicers?: { col: string; values: (string | number)[] }[];

  // Module 4
  'm-basics': {
    task: 'Write three measures: <code>Units</code> (total Quantity), <code>Order Lines</code> (number of Sales rows) and <code>Products Sold</code> (how many different products appear in Sales).',
    starter: 'Total Sales = SUM(Sales[Amount])\nUnits = \nOrder Lines = \nProducts Sold = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nUnits = SUM(Sales[Quantity])\nOrder Lines = COUNTROWS(Sales)\nProducts Sold = DISTINCTCOUNT(Sales[ProductKey])',
    hint: 'SUM adds a column, COUNTROWS counts the rows of a table, DISTINCTCOUNT counts different values in a column.',
    by: 'Store[Store]',
  },
  'm-min-max': {
    task: 'Find the first and last date each store sold something: <code>First Sale = MIN(Sales[Date])</code> and <code>Last Sale</code> with MAX. Which store opened in 2025?',
    starter: 'First Sale = MIN(Sales[Date])\nLast Sale = ',
    solution: 'First Sale = MIN(Sales[Date])\nLast Sale = MAX(Sales[Date])',
    by: 'Store[Store]',
  },
  'm-avg-line': {
    task: 'Write <code>Average Line</code>: Total Sales divided by Order Lines, using <code>DIVIDE</code>.',
    starter: 'Total Sales = SUM(Sales[Amount])\nOrder Lines = COUNTROWS(Sales)\nAverage Line = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nOrder Lines = COUNTROWS(Sales)\nAverage Line = DIVIDE([Total Sales], [Order Lines])',
    hint: 'DIVIDE(numerator, denominator). Use the measures in square brackets.',
    by: 'Product[Category]',
  },
  'm-margin-pct': {
    task: 'Write <code>Margin %</code> = Total Margin ÷ Total Sales. Split by category: which category has the best margin?',
    starter: 'Total Sales = SUM(Sales[Amount])\nTotal Cost = SUMX(Sales, Sales[Quantity] * Sales[UnitCost])\nTotal Margin = [Total Sales] - [Total Cost]\nMargin % = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nTotal Cost = SUMX(Sales, Sales[Quantity] * Sales[UnitCost])\nTotal Margin = [Total Sales] - [Total Cost]\nMargin % = DIVIDE([Total Margin], [Total Sales])',
    by: 'Product[Category]',
  },
  'm-divide-zero': {
    task: 'Run this. Then split by <code>Store[Store]</code>: Forks Market has no 2024 sales. Compare what <code>/</code> and <code>DIVIDE</code> give for it.',
    starter: `Sales 2025 = CALCULATE(SUM(Sales[Amount]), 'Date'[Year] = 2025)
Sales 2024 = CALCULATE(SUM(Sales[Amount]), 'Date'[Year] = 2024)
Ratio with slash = [Sales 2025] / [Sales 2024]
Ratio with DIVIDE = DIVIDE([Sales 2025], [Sales 2024])`,
    by: 'Store[Store]',
  },
  'x-revenue': {
    task: 'Write <code>Revenue</code> with SUMX: for every Sales row, Quantity × UnitPrice, added up. (It should equal SUM of Amount.)',
    starter: 'Revenue = ',
    solution: 'Revenue = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    hint: 'SUMX(table, expression): SUMX(Sales, Sales[Quantity] * Sales[UnitPrice]).',
    by: 'Product[Category]',
  },
  'x-wrong': {
    task: 'Run both. Why is the second one wildly wrong? Click a row and use <strong>Show me what happened</strong> on each (change which is last to trace it).',
    starter: 'Wrong = SUM(Sales[Quantity]) * SUM(Sales[UnitPrice])\nRight = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    by: 'Product[Category]',
  },
  'x-biggest-line': {
    task: 'Write <code>Biggest Line</code>: the largest single order line value (Quantity × UnitPrice), with MAXX.',
    starter: 'Biggest Line = ',
    solution: 'Biggest Line = MAXX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    by: 'Store[Store]',
  },
  'r-list-price': {
    task: 'Product[UnitPrice] is the 2024 list price. Write <code>At List Price</code>: each line\'s Quantity × the product\'s list price from Product, using RELATED inside SUMX. Split by Year: in which year did Northbay charge more than list?',
    starter: 'Total Sales = SUM(Sales[Amount])\nAt List Price = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nAt List Price = SUMX(Sales, Sales[Quantity] * RELATED(Product[UnitPrice]))',
    hint: 'Inside SUMX(Sales, ...) there is a current Sales row, so RELATED(Product[UnitPrice]) can fetch that row\'s product price.',
    by: "'Date'[Year]",
  },
  'r-region-col': {
    task: 'Add a calculated column <code>Sales[Region]</code> with the store\'s region, then the query counts lines per region.',
    starter: 'Sales[Region] = \nEVALUATE SUMMARIZECOLUMNS(Sales[Region], "Lines", COUNTROWS(Sales))',
    solution: 'Sales[Region] = RELATED(Store[Region])\nEVALUATE SUMMARIZECOLUMNS(Sales[Region], "Lines", COUNTROWS(Sales))',
  },
  'v-margin': {
    task: 'Rewrite <code>Margin %</code> as one measure with variables: <code>VAR SalesAmt = ...</code>, <code>VAR Cost = ...</code>, then <code>RETURN DIVIDE(SalesAmt - Cost, SalesAmt)</code>.',
    starter: 'Margin % =\nVAR SalesAmt = SUM(Sales[Amount])\nVAR Cost = \nRETURN ',
    solution: 'Margin % =\nVAR SalesAmt = SUM(Sales[Amount])\nVAR Cost = SUMX(Sales, Sales[Quantity] * Sales[UnitCost])\nRETURN DIVIDE(SalesAmt - Cost, SalesAmt)',
    by: 'Product[Category]',
  },
  'v-band': {
    task: 'Write <code>Size</code> that says "Big" when Total Sales is at least 100,000, "Medium" from 50,000, and "Small" otherwise, with <code>SWITCH(TRUE(), ...)</code>.',
    starter: 'Total Sales = SUM(Sales[Amount])\nSize = SWITCH(TRUE(),\n    [Total Sales] >= 100000, "Big",\n    \n)',
    solution: 'Total Sales = SUM(Sales[Amount])\nSize = SWITCH(TRUE(),\n    [Total Sales] >= 100000, "Big",\n    [Total Sales] >= 50000, "Medium",\n    "Small"\n)',
    hint: 'SWITCH(TRUE(), test1, result1, test2, result2, else). The first true test wins, so put the biggest threshold first.',
    by: 'Store[Store]',
  },
  'v-if-blank': {
    task: 'Make <code>Sales or zero</code> show 0 instead of blank, using IF and ISBLANK. Split by <code>\'Date\'[YearMonth]</code> to see Forks Market\'s months before it opened (a slicer keeps only Forks Market).',
    starter: 'Total Sales = SUM(Sales[Amount])\nSales or zero = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nSales or zero = IF(ISBLANK([Total Sales]), 0, [Total Sales])',
    by: "'Date'[YearMonth]",
    slicers: [{ col: 'Store[Store]', values: ['Forks Market'] }],
  },
};

export const EXERCISES: Record<string, Exercise> = {
  playground: {
    starter: `Total Sales = SUM(Sales[Amount])
Orders = COUNTROWS(Sales)
Average Order Line = DIVIDE([Total Sales], [Orders])`,
    by: 'Product[Category]',
  },

  // Module 1
  'first-total': {
    task: 'Press <strong>Run</strong>. Then change <em>Split by</em> to <code>Store[Store]</code> and run it again. Which store sold the most?',
    starter: 'Total Sales = SUM(Sales[Amount])',
    by: 'Product[Category]',
  },
  'try-editor': {
    task: 'Add a second measure on a new line: <code>Units = SUM(Sales[Quantity])</code>. Run it, then press <strong>Check my answer</strong>.',
    starter: 'Total Sales = SUM(Sales[Amount])\n',
    solution: 'Total Sales = SUM(Sales[Amount])\nUnits = SUM(Sales[Quantity])',
    hint: 'Each measure goes on its own line: a name, an equals sign, then the formula. Column names go in square brackets after the table name.',
    by: 'Product[Category]',
  },
  'see-steps': {
    task: 'Run this, click the <strong>Home</strong> row in the result, then press <strong>Show me what happened</strong> and step through it.',
    starter: 'Total Sales = SUM(Sales[Amount])',
    by: 'Product[Category]',
  },
  'fix-error': {
    task: 'This measure has an error. Run it, read the message, and fix it so it adds up the Amount column.',
    starter: 'Total Sales = Sales[Amount]',
    solution: 'Total Sales = SUM(Sales[Amount])',
    hint: 'A measure has no "current row", so a bare column means nothing. Wrap it in an aggregation: SUM( ... ).',
    by: 'Store[Region]',
  },

  // Module 3
  'calendar-table': {
    task: 'Run this query to build the first days of a date table. Then add a <code>"Quarter"</code> column using <code>QUARTER([Date])</code>.',
    starter: `EVALUATE
ADDCOLUMNS(
    CALENDAR(DATE(2025, 1, 1), DATE(2025, 1, 10)),
    "Year", YEAR([Date]),
    "Month", FORMAT([Date], "MMM"),
    "Weekday", FORMAT([Date], "ddd")
)`,
    solution: `EVALUATE
ADDCOLUMNS(
    CALENDAR(DATE(2025, 1, 1), DATE(2025, 1, 10)),
    "Year", YEAR([Date]),
    "Month", FORMAT([Date], "MMM"),
    "Weekday", FORMAT([Date], "ddd"),
    "Quarter", QUARTER([Date])
)`,
    hint: 'Add a comma after the Weekday line, then "Quarter", QUARTER([Date]) before the closing bracket.',
    ordered: true,
  },
  'calc-column-margin': {
    task: 'Add a calculated column <code>Sales[Margin]</code> that is the Amount minus Quantity × UnitCost for each row. The measure below adds it up; run to check.',
    starter: `Sales[Margin] =
Total Margin = SUM(Sales[Margin])`,
    solution: `Sales[Margin] = Sales[Amount] - Sales[Quantity] * Sales[UnitCost]
Total Margin = SUM(Sales[Margin])`,
    hint: 'In a calculated column there is a current row, so you can use the columns of Sales directly: Sales[Amount] - Sales[Quantity] * Sales[UnitCost].',
    by: 'Product[Category]',
  },
  'measure-margin': {
    task: 'Now get the same total margin with a <strong>measure only</strong> (no new column), using <code>SUMX</code> to work row by row. You will learn SUMX properly in Lesson 4.3.',
    starter: 'Total Margin = SUMX(Sales, )',
    solution: 'Total Margin = SUMX(Sales, Sales[Amount] - Sales[Quantity] * Sales[UnitCost])',
    hint: 'SUMX(Sales, expression) works the expression out for each row of Sales and adds them up. The expression is the same as the column formula.',
    by: 'Product[Category]',
  },
  'related-category': {
    task: 'Add a calculated column <code>Sales[Category]</code> that copies each line\'s product category from the Product table, using <code>RELATED</code>. The query then counts lines per category.',
    starter: `Sales[Category] =
EVALUATE SUMMARIZECOLUMNS(Sales[Category], "Lines", COUNTROWS(Sales))`,
    solution: `Sales[Category] = RELATED(Product[Category])
EVALUATE SUMMARIZECOLUMNS(Sales[Category], "Lines", COUNTROWS(Sales))`,
    hint: 'RELATED follows the relationship from the current Sales row to its Product row: RELATED(Product[Category]).',
  },
  'filter-direction': {
    task: 'Split by <code>Store[Store]</code> and run. <code>Products</code> counts rows of the Product table: why is it the same (12) for every store, while <code>Products Sold</code> changes?',
    starter: `Products = COUNTROWS(Product)
Products Sold = DISTINCTCOUNT(Sales[ProductKey])`,
    by: 'Store[Store]',
  },

  // Module 4
  'm-basics': {
    task: 'Write three measures: <code>Units</code> (total Quantity), <code>Order Lines</code> (number of Sales rows) and <code>Products Sold</code> (how many different products appear in Sales).',
    starter: 'Total Sales = SUM(Sales[Amount])\nUnits = \nOrder Lines = \nProducts Sold = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nUnits = SUM(Sales[Quantity])\nOrder Lines = COUNTROWS(Sales)\nProducts Sold = DISTINCTCOUNT(Sales[ProductKey])',
    hint: 'SUM adds a column, COUNTROWS counts the rows of a table, DISTINCTCOUNT counts different values in a column.',
    by: 'Store[Store]',
  },
  'm-min-max': {
    task: 'Find the first and last date each store sold something: <code>First Sale = MIN(Sales[Date])</code> and <code>Last Sale</code> with MAX. Which store opened in 2025?',
    starter: 'First Sale = MIN(Sales[Date])\nLast Sale = ',
    solution: 'First Sale = MIN(Sales[Date])\nLast Sale = MAX(Sales[Date])',
    by: 'Store[Store]',
  },
  'm-avg-line': {
    task: 'Write <code>Average Line</code>: Total Sales divided by Order Lines, using <code>DIVIDE</code>.',
    starter: 'Total Sales = SUM(Sales[Amount])\nOrder Lines = COUNTROWS(Sales)\nAverage Line = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nOrder Lines = COUNTROWS(Sales)\nAverage Line = DIVIDE([Total Sales], [Order Lines])',
    hint: 'DIVIDE(numerator, denominator). Use the measures in square brackets.',
    by: 'Product[Category]',
  },
  'm-margin-pct': {
    task: 'Write <code>Margin %</code> = Total Margin ÷ Total Sales. Split by category: which category has the best margin?',
    starter: 'Total Sales = SUM(Sales[Amount])\nTotal Cost = SUMX(Sales, Sales[Quantity] * Sales[UnitCost])\nTotal Margin = [Total Sales] - [Total Cost]\nMargin % = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nTotal Cost = SUMX(Sales, Sales[Quantity] * Sales[UnitCost])\nTotal Margin = [Total Sales] - [Total Cost]\nMargin % = DIVIDE([Total Margin], [Total Sales])',
    by: 'Product[Category]',
  },
  'm-divide-zero': {
    task: 'Run this. Then split by <code>Store[Store]</code>: Forks Market has no 2024 sales. Compare what <code>/</code> and <code>DIVIDE</code> give for it.',
    starter: `Sales 2025 = CALCULATE(SUM(Sales[Amount]), 'Date'[Year] = 2025)
Sales 2024 = CALCULATE(SUM(Sales[Amount]), 'Date'[Year] = 2024)
Ratio with slash = [Sales 2025] / [Sales 2024]
Ratio with DIVIDE = DIVIDE([Sales 2025], [Sales 2024])`,
    by: 'Store[Store]',
  },
  'x-revenue': {
    task: 'Write <code>Revenue</code> with SUMX: for every Sales row, Quantity × UnitPrice, added up. (It should equal SUM of Amount.)',
    starter: 'Revenue = ',
    solution: 'Revenue = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    hint: 'SUMX(table, expression): SUMX(Sales, Sales[Quantity] * Sales[UnitPrice]).',
    by: 'Product[Category]',
  },
  'x-wrong': {
    task: 'Run both. Why is the second one wildly wrong? Click a row and use <strong>Show me what happened</strong> on each (change which is last to trace it).',
    starter: 'Wrong = SUM(Sales[Quantity]) * SUM(Sales[UnitPrice])\nRight = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    by: 'Product[Category]',
  },
  'x-biggest-line': {
    task: 'Write <code>Biggest Line</code>: the largest single order line value (Quantity × UnitPrice), with MAXX.',
    starter: 'Biggest Line = ',
    solution: 'Biggest Line = MAXX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    by: 'Store[Store]',
  },
  'r-list-price': {
    task: 'Product[UnitPrice] is the 2024 list price. Write <code>At List Price</code>: each line\'s Quantity × the product\'s list price from Product, using RELATED inside SUMX. Split by Year: in which year did Northbay charge more than list?',
    starter: 'Total Sales = SUM(Sales[Amount])\nAt List Price = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nAt List Price = SUMX(Sales, Sales[Quantity] * RELATED(Product[UnitPrice]))',
    hint: 'Inside SUMX(Sales, ...) there is a current Sales row, so RELATED(Product[UnitPrice]) can fetch that row\'s product price.',
    by: "'Date'[Year]",
  },
  'r-region-col': {
    task: 'Add a calculated column <code>Sales[Region]</code> with the store\'s region, then the query counts lines per region.',
    starter: 'Sales[Region] = \nEVALUATE SUMMARIZECOLUMNS(Sales[Region], "Lines", COUNTROWS(Sales))',
    solution: 'Sales[Region] = RELATED(Store[Region])\nEVALUATE SUMMARIZECOLUMNS(Sales[Region], "Lines", COUNTROWS(Sales))',
  },
  'v-margin': {
    task: 'Rewrite <code>Margin %</code> as one measure with variables: <code>VAR SalesAmt = ...</code>, <code>VAR Cost = ...</code>, then <code>RETURN DIVIDE(SalesAmt - Cost, SalesAmt)</code>.',
    starter: 'Margin % =\nVAR SalesAmt = SUM(Sales[Amount])\nVAR Cost = \nRETURN ',
    solution: 'Margin % =\nVAR SalesAmt = SUM(Sales[Amount])\nVAR Cost = SUMX(Sales, Sales[Quantity] * Sales[UnitCost])\nRETURN DIVIDE(SalesAmt - Cost, SalesAmt)',
    by: 'Product[Category]',
  },
  'v-band': {
    task: 'Write <code>Size</code> that says "Big" when Total Sales is at least 100,000, "Medium" from 50,000, and "Small" otherwise, with <code>SWITCH(TRUE(), ...)</code>.',
    starter: 'Total Sales = SUM(Sales[Amount])\nSize = SWITCH(TRUE(),\n    [Total Sales] >= 100000, "Big",\n    \n)',
    solution: 'Total Sales = SUM(Sales[Amount])\nSize = SWITCH(TRUE(),\n    [Total Sales] >= 100000, "Big",\n    [Total Sales] >= 50000, "Medium",\n    "Small"\n)',
    hint: 'SWITCH(TRUE(), test1, result1, test2, result2, else). The first true test wins, so put the biggest threshold first.',
    by: 'Store[Store]',
  },
  'v-if-blank': {
    task: 'Make <code>Sales or zero</code> show 0 instead of blank, using IF and ISBLANK. Split by <code>\'Date\'[YearMonth]</code> to see Forks Market\'s months before it opened (a slicer keeps only Forks Market).',
    starter: 'Total Sales = SUM(Sales[Amount])\nSales or zero = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nSales or zero = IF(ISBLANK([Total Sales]), 0, [Total Sales])',
    by: "'Date'[YearMonth]",
    slicers: [{ col: 'Store[Store]', values: ['Forks Market'] }],
  },

  // Module 5
  'fc-see': {
    task: 'Split by <code>Store[Region]</code>, run, click <strong>East</strong>, then <strong>Show me what happened</strong>. Then change Split by to <code>\'Date\'[Year]</code> and trace 2025.',
    starter: 'Total Sales = SUM(Sales[Amount])',
    by: 'Store[Region]',
  },
  'fc-slicer': {
    task: 'A slicer on this editor keeps only <strong>Home</strong> products. Split by Store and run: each cell now has two filters (the store row and the slicer). Trace one row to see both.',
    starter: 'Total Sales = SUM(Sales[Amount])',
    by: 'Store[Store]',
    slicers: [{ col: 'Product[Category]', values: ['Home'] }],
  },
  'c-home': {
    task: 'Write <code>Home Sales</code>: Total Sales for the Home category only, whatever the visual shows. Split by Store.',
    starter: 'Total Sales = SUM(Sales[Amount])\nHome Sales = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nHome Sales = CALCULATE([Total Sales], Product[Category] = "Home")',
    hint: 'CALCULATE(expression, filter): CALCULATE([Total Sales], Product[Category] = "Home").',
    by: 'Store[Store]',
  },
  'c-overwrite': {
    task: 'Split by <code>Product[Category]</code> and run. Why does <code>Home Sales</code> show the same number on every row? Then try the KEEPFILTERS version.',
    starter: 'Total Sales = SUM(Sales[Amount])\nHome Sales = CALCULATE([Total Sales], Product[Category] = "Home")\nHome Keep = CALCULATE([Total Sales], KEEPFILTERS(Product[Category] = "Home"))',
    by: 'Product[Category]',
  },
  'c-weekend': {
    task: 'Write <code>Weekend Sales</code> for Saturday and Sunday only, using <code>IN {"Sat", "Sun"}</code> on <code>\'Date\'[Weekday]</code>, and <code>Weekend %</code> = Weekend Sales ÷ Total Sales.',
    starter: 'Total Sales = SUM(Sales[Amount])\nWeekend Sales = \nWeekend % = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nWeekend Sales = CALCULATE([Total Sales], \'Date\'[Weekday] IN {"Sat", "Sun"})\nWeekend % = DIVIDE([Weekend Sales], [Total Sales])',
    by: 'Store[Store]',
  },
  'c-two-filters': {
    task: 'Write <code>West Outdoor 2025</code>: sales of Outdoor products in West stores in 2025. CALCULATE takes several filters, separated by commas.',
    starter: 'Total Sales = SUM(Sales[Amount])\nWest Outdoor 2025 = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nWest Outdoor 2025 = CALCULATE([Total Sales], Store[Region] = "West", Product[Category] = "Outdoor", \'Date\'[Year] = 2025)',
    hint: 'Each filter is its own argument: CALCULATE([Total Sales], filter1, filter2, filter3). Filters on different columns are combined with AND.',
  },
  'a-share': {
    task: 'Write <code>All Categories</code> (Total Sales ignoring any Product filter) and <code>Share</code> = Total Sales ÷ All Categories. Split by Category.',
    starter: 'Total Sales = SUM(Sales[Amount])\nAll Categories = \nShare = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nAll Categories = CALCULATE([Total Sales], ALL(Product))\nShare = DIVIDE([Total Sales], [All Categories])',
    hint: 'ALL(Product) inside CALCULATE removes every filter on the Product table.',
    by: 'Product[Category]',
  },
  'a-region-share': {
    task: 'Split by Store. Write <code>Region Sales</code>: the sales of the store\'s whole region, by removing the Store filters with <code>ALL(Store)</code> and putting back the region with <code>VALUES(Store[Region])</code>. Then <code>Share of Region</code>.',
    starter: 'Total Sales = SUM(Sales[Amount])\nRegion Sales = CALCULATE([Total Sales], ALL(Store), )\nShare of Region = DIVIDE([Total Sales], [Region Sales])',
    solution: 'Total Sales = SUM(Sales[Amount])\nRegion Sales = CALCULATE([Total Sales], ALL(Store), VALUES(Store[Region]))\nShare of Region = DIVIDE([Total Sales], [Region Sales])',
    hint: 'VALUES(Store[Region]) is worked out before the filters change, so on the Falls Centre row it is the list {West}. CALCULATE removes the Store filters, then sets Region to that list.',
    by: 'Store[Store]',
  },
  'a-allselected': {
    task: 'A slicer keeps only the West region. Compare <code>Share of All</code> (ALL) with <code>Share of Visible</code> (ALLSELECTED). Which one adds up to 100 % in this visual?',
    starter: 'Total Sales = SUM(Sales[Amount])\nShare of All = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Store)))\nShare of Visible = DIVIDE([Total Sales], CALCULATE([Total Sales], ALLSELECTED(Store)))',
    by: 'Store[Store]',
    slicers: [{ col: 'Store[Region]', values: ['West'] }],
  },
  'f-big-lines': {
    task: 'Write <code>Big Line Sales</code>: sales from order lines of $100 or more, using <code>FILTER(Sales, Sales[Amount] >= 100)</code> inside CALCULATE. Trace a row to watch FILTER keep and drop lines.',
    starter: 'Total Sales = SUM(Sales[Amount])\nBig Line Sales = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nBig Line Sales = CALCULATE([Total Sales], FILTER(Sales, Sales[Amount] >= 100))',
    by: 'Product[Category]',
  },
  'f-top-products': {
    task: 'Write <code>Strong Products</code>: how many products have Total Sales above 40,000 in the current context. Iterate the product list with FILTER and a measure.',
    starter: 'Total Sales = SUM(Sales[Amount])\nStrong Products = COUNTROWS(FILTER(VALUES(Product[Product]), ))',
    solution: 'Total Sales = SUM(Sales[Amount])\nStrong Products = COUNTROWS(FILTER(VALUES(Product[Product]), [Total Sales] > 40000))',
    hint: 'The condition goes after the comma: [Total Sales] > 40000. For each product, the measure is worked out for that product (context transition, Lesson 5.5).',
    by: "'Date'[Year]",
  },
  'ct-demo': {
    task: 'Run both, split by Category. <code>Without</code> repeats the same number for every product; <code>With</code> gives the right total. Trace each (put it last) to see why.',
    starter: 'Total Sales = SUM(Sales[Amount])\nWithout = SUMX(Product, SUM(Sales[Amount]))\nWith = SUMX(Product, [Total Sales])',
    by: 'Product[Category]',
  },
  'ct-best-day': {
    task: 'Write <code>Best Day</code>: the highest daily sales in the current context, with MAXX over the visible dates.',
    starter: 'Total Sales = SUM(Sales[Amount])\nBest Day = MAXX(VALUES(\'Date\'[Date]), )',
    solution: 'Total Sales = SUM(Sales[Amount])\nBest Day = MAXX(VALUES(\'Date\'[Date]), [Total Sales])',
    by: 'Store[Store]',
  },
  'ct-avg-daily': {
    task: 'Write <code>Average Daily Sales</code> with AVERAGEX over the dates. Compare it with Total Sales ÷ number of days. Why are they different for Forks Market?',
    starter: 'Total Sales = SUM(Sales[Amount])\nAverage Daily Sales = \nPer Calendar Day = DIVIDE([Total Sales], COUNTROWS(\'Date\'))',
    solution: 'Total Sales = SUM(Sales[Amount])\nAverage Daily Sales = AVERAGEX(VALUES(\'Date\'[Date]), [Total Sales])',
    by: 'Store[Store]',
  },
  'rk-rank': {
    task: 'Write <code>Product Rank</code>: each product\'s rank by Total Sales among all products (1 = best), with <code>RANKX(ALL(Product[Product]), [Total Sales])</code>.',
    starter: 'Total Sales = SUM(Sales[Amount])\nProduct Rank = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nProduct Rank = RANKX(ALL(Product[Product]), [Total Sales])',
    by: 'Product[Product]',
  },
  'rk-top3': {
    task: 'Write a query that returns the top 3 products by Total Sales, with their sales, sorted from best. Use TOPN and ADDCOLUMNS.',
    starter: 'Total Sales = SUM(Sales[Amount])\nEVALUATE\nTOPN(3, ADDCOLUMNS(VALUES(Product[Product]), "Sales", [Total Sales]), [Sales])\nORDER BY [Sales] DESC',
    solution: 'Total Sales = SUM(Sales[Amount])\nEVALUATE\nTOPN(3, ADDCOLUMNS(VALUES(Product[Product]), "Sales", [Total Sales]), [Sales])\nORDER BY [Sales] DESC',
    ordered: true,
  },
  'q-first': {
    task: 'Run each query on its own (put the one you want last). Queries return tables, like Power BI\'s DAX query view.',
    starter: 'EVALUATE VALUES(Store[Region])\n// EVALUATE FILTER(Product, Product[UnitPrice] > 40)\n// EVALUATE Store',
  },
  'q-summarize': {
    task: 'Write a query: total sales and order lines per region, sorted by sales from highest. Use SUMMARIZECOLUMNS.',
    starter: 'Total Sales = SUM(Sales[Amount])\nEVALUATE\nSUMMARIZECOLUMNS(\n    Store[Region],\n    "Sales", [Total Sales]\n)',
    solution: 'Total Sales = SUM(Sales[Amount])\nEVALUATE\nSUMMARIZECOLUMNS(\n    Store[Region],\n    "Sales", [Total Sales],\n    "Lines", COUNTROWS(Sales)\n)\nORDER BY [Sales] DESC',
    ordered: true,
  },
  'q-two-cols': {
    task: 'Write a query with sales by Year and Category, filtered to the Outdoor and Electronics categories only (add a filter table argument such as <code>TREATAS({"Outdoor", "Electronics"}, Product[Category])</code>).',
    starter: 'Total Sales = SUM(Sales[Amount])\nEVALUATE\nSUMMARIZECOLUMNS(\'Date\'[Year], Product[Category], "Sales", [Total Sales])',
    solution: 'Total Sales = SUM(Sales[Amount])\nEVALUATE\nSUMMARIZECOLUMNS(\'Date\'[Year], Product[Category], TREATAS({"Outdoor", "Electronics"}, Product[Category]), "Sales", [Total Sales])',
  },

  // Module 6
  'ti-ytd': {
    task: 'Write <code>Sales YTD</code> with <code>TOTALYTD([Total Sales], \'Date\'[Date])</code>. It is split by YearMonth: watch it climb through each year and start again in January.',
    starter: 'Total Sales = SUM(Sales[Amount])\nSales YTD = ',
    solution: "Total Sales = SUM(Sales[Amount])\nSales YTD = TOTALYTD([Total Sales], 'Date'[Date])",
    hint: "TOTALYTD(measure, date column): TOTALYTD([Total Sales], 'Date'[Date]).",
    by: "'Date'[YearMonth]",
  },
  'ti-qtd': {
    task: 'Write <code>Sales QTD</code> using CALCULATE with <code>DATESQTD(\'Date\'[Date])</code>. Trace a month to see which dates it keeps.',
    starter: 'Total Sales = SUM(Sales[Amount])\nSales QTD = ',
    solution: "Total Sales = SUM(Sales[Amount])\nSales QTD = CALCULATE([Total Sales], DATESQTD('Date'[Date]))",
    by: "'Date'[YearMonth]",
  },
  'ti-py': {
    task: 'Write <code>Sales LY</code>: the same period last year, with <code>SAMEPERIODLASTYEAR</code>. Then <code>Growth %</code> = (Total Sales − Sales LY) ÷ Sales LY.',
    starter: 'Total Sales = SUM(Sales[Amount])\nSales LY = \nGrowth % = ',
    solution: "Total Sales = SUM(Sales[Amount])\nSales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))\nGrowth % = DIVIDE([Total Sales] - [Sales LY], [Sales LY])",
    by: "'Date'[YearMonth]",
  },
  'ti-growth-store': {
    task: 'A slicer keeps 2025. Split by Store: Forks Market had no 2024 sales. Make <code>Growth %</code> blank when there are no sales last year (it already is with DIVIDE: check why) and add <code>Change</code> = Total Sales − Sales LY that is blank for new stores too.',
    starter: "Total Sales = SUM(Sales[Amount])\nSales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))\nGrowth % = DIVIDE([Total Sales] - [Sales LY], [Sales LY])\nChange = ",
    solution: "Total Sales = SUM(Sales[Amount])\nSales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))\nGrowth % = DIVIDE([Total Sales] - [Sales LY], [Sales LY])\nChange = IF(ISBLANK([Sales LY]), BLANK(), [Total Sales] - [Sales LY])",
    by: 'Store[Store]',
    slicers: [{ col: "'Date'[Year]", values: [2025] }],
  },
  'ti-r28': {
    task: 'Write <code>Sales 28d</code>: sales in the 28 days up to the last visible date, with <code>DATESINPERIOD(\'Date\'[Date], MAX(\'Date\'[Date]), -28, DAY)</code>.',
    starter: 'Total Sales = SUM(Sales[Amount])\nSales 28d = ',
    solution: "Total Sales = SUM(Sales[Amount])\nSales 28d = CALCULATE([Total Sales], DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -28, DAY))",
    by: "'Date'[YearMonth]",
  },
  'ti-3m-avg': {
    task: 'Write <code>3M Avg</code>: the average monthly sales over the last 3 months, ending with the current month.',
    starter: "Total Sales = SUM(Sales[Amount])\n3M Avg =\nVAR Last3 = CALCULATE([Total Sales], DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -3, MONTH))\nRETURN ",
    solution: "Total Sales = SUM(Sales[Amount])\n3M Avg =\nVAR Last3 = CALCULATE([Total Sales], DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -3, MONTH))\nRETURN DIVIDE(Last3, 3)",
    hint: 'Last3 is the total of the three months; divide by 3.',
    by: "'Date'[YearMonth]",
  },
  'ti-target': {
    task: 'Targets has a YearMonth column but no relationship to Date. Write <code>Target</code> that sums Targets and moves the Date filter across with <code>TREATAS(VALUES(\'Date\'[YearMonth]), Targets[YearMonth])</code>. Then <code>vs Target %</code>.',
    starter: "Total Sales = SUM(Sales[Amount])\nTarget = CALCULATE(SUM(Targets[Target]), )\nvs Target % = DIVIDE([Total Sales] - [Target], [Target])",
    solution: "Total Sales = SUM(Sales[Amount])\nTarget = CALCULATE(SUM(Targets[Target]), TREATAS(VALUES('Date'[YearMonth]), Targets[YearMonth]))\nvs Target % = DIVIDE([Total Sales] - [Target], [Target])",
    by: "'Date'[YearMonth]",
  },
  'ti-pace': {
    task: 'Pace: this year to date against last year to date. Write <code>YTD LY</code> by shifting the YTD dates back a year, and <code>Pace %</code>.',
    starter: "Total Sales = SUM(Sales[Amount])\nYTD = TOTALYTD([Total Sales], 'Date'[Date])\nYTD LY = CALCULATE([YTD], )\nPace % = DIVIDE([YTD] - [YTD LY], [YTD LY])",
    solution: "Total Sales = SUM(Sales[Amount])\nYTD = TOTALYTD([Total Sales], 'Date'[Date])\nYTD LY = CALCULATE([YTD], SAMEPERIODLASTYEAR('Date'[Date]))\nPace % = DIVIDE([YTD] - [YTD LY], [YTD LY])",
    hint: "Move the whole period back a year with SAMEPERIODLASTYEAR('Date'[Date]); the YTD measure then runs inside the shifted dates.",
    by: "'Date'[YearMonth]",
  },

  // Modules 7-9
  'v-title': {
    task: 'Write a dynamic title: <code>Title</code> = "Sales for " followed by the selected region, or "all regions" when none or several are selected. Use <code>SELECTEDVALUE(Store[Region], "all regions")</code>. Try Split by Region, then nothing.',
    starter: 'Title = "Sales for " & ',
    solution: 'Title = "Sales for " & SELECTEDVALUE(Store[Region], "all regions")',
    by: 'Store[Region]',
  },
  'v-tooltip': {
    task: 'A tooltip page often shows a small summary for the hovered item. Write <code>Top Product</code>: the name of the best-selling product in the current context, with <code>CONCATENATEX(TOPN(1, VALUES(Product[Product]), [Total Sales]), Product[Product], ", ")</code>.',
    starter: 'Total Sales = SUM(Sales[Amount])\nTop Product = ',
    solution: 'Total Sales = SUM(Sales[Amount])\nTop Product = CONCATENATEX(TOPN(1, VALUES(Product[Product]), [Total Sales]), Product[Product], ", ")',
    by: 'Store[Store]',
  },
  'rls-west': {
    task: 'This editor applies a row-level security rule as a slicer: <code>Store[Region] = "West"</code>. Split by Store and by Category: the person only ever sees West data. What does <code>Share of All</code> show, and why could that leak information?',
    starter: 'Total Sales = SUM(Sales[Amount])\nShare of All = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Store)))',
    by: 'Store[Store]',
    slicers: [{ col: 'Store[Region]', values: ['West'] }],
  },
  'field-param': {
    task: 'A "pick a measure" switch (the classic pattern before field parameters). Split by <code>Product[Category]</code>. The slicer picks Margin; change the starter so "Units" also works.',
    starter: `Total Sales = SUM(Sales[Amount])
Units = SUM(Sales[Quantity])
Margin = SUMX(Sales, Sales[Amount] - Sales[Quantity] * Sales[UnitCost])
Chosen = VAR Pick = "Margin"
RETURN SWITCH(Pick, "Sales", [Total Sales], "Margin", [Margin], BLANK())`,
    solution: `Total Sales = SUM(Sales[Amount])
Units = SUM(Sales[Quantity])
Margin = SUMX(Sales, Sales[Amount] - Sales[Quantity] * Sales[UnitCost])
Chosen = VAR Pick = "Margin"
RETURN SWITCH(Pick, "Sales", [Total Sales], "Margin", [Margin], "Units", [Units], BLANK())`,
    by: 'Product[Category]',
  },
  'perf-iterate': {
    task: 'Both measures give the same total. <code>Slow</code> calls a measure for each of the 7,328 Sales rows, so the engine builds a new filter context per row (context transition); <code>Fast</code> adds a column in one pass. Run, then swap the lines so the other is last, and compare the time under the result.',
    starter: `Line Value = SUM(Sales[Amount])
Slow = SUMX(Sales, [Line Value])
Fast = SUM(Sales[Amount])`,
  },
  'cap-cards': {
    task: 'Capstone check: write the four card measures for the Northbay dashboard (<code>Sales YTD</code>, <code>Pace %</code>, <code>Target YTD</code>, <code>vs Target %</code>) on top of the base measures given. Split by Region to check them.',
    starter: `Total Sales = SUM(Sales[Amount])
Target = CALCULATE(SUM(Targets[Target]), TREATAS(VALUES('Date'[YearMonth]), Targets[YearMonth]))
Sales YTD = 
Sales YTD LY = CALCULATE([Sales YTD], SAMEPERIODLASTYEAR('Date'[Date]))
Pace % = 
Target YTD = 
vs Target % = `,
    solution: `Total Sales = SUM(Sales[Amount])
Target = CALCULATE(SUM(Targets[Target]), TREATAS(VALUES('Date'[YearMonth]), Targets[YearMonth]))
Sales YTD = TOTALYTD([Total Sales], 'Date'[Date])
Sales YTD LY = CALCULATE([Sales YTD], SAMEPERIODLASTYEAR('Date'[Date]))
Pace % = DIVIDE([Sales YTD] - [Sales YTD LY], [Sales YTD LY])
Target YTD = CALCULATE([Target], DATESYTD('Date'[Date]))
vs Target % = DIVIDE([Sales YTD] - [Target YTD], [Target YTD])`,
    by: 'Store[Region]',
    slicers: [{ col: "'Date'[Year]", values: [2025] }],
  },
};
