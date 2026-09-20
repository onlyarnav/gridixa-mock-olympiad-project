# Scatter Plots

Imagine you are investigating whether students who study more hours score higher marks in exams. You collect data from many students:

| Hours Studied | Marks |
| ------------- | ----- |
| 2             | 40    |
| 4             | 55    |
| 5             | 60    |
| 7             | 75    |
| 9             | 90    |

Looking at a table gives some information, but a **scatter plot** allows you to immediately see whether a relationship exists between study time and exam performance.

Scatter plots are among the most important visualization tools in data science, machine learning, statistics, and scientific research because they help us discover patterns and relationships hidden inside data.

## What is a Scatter Plot?

A **scatter plot** is a graph that displays individual data points on a coordinate system.

Each point represents a pair of values:

* One value on the X-axis
* One value on the Y-axis

Unlike bar charts or line charts, scatter plots focus on showing relationships between two numerical variables.

For example:

* Study Hours vs Exam Score
* Height vs Weight
* Temperature vs Ice Cream Sales
* Advertising Budget vs Revenue

Every observation becomes a single dot on the graph.

## Why Scatter Plots Are Important

In AI and Machine Learning, one of the first questions we ask is:

**"Are these variables related?"**

For example:

* Does more study time lead to higher scores?
* Do larger houses cost more?
* Does age affect purchasing behavior?
* Does experience affect salary?

Scatter plots help answer these questions visually before any mathematical modeling begins.

Data scientists often create scatter plots before training machine learning models because they reveal patterns that numbers alone may hide.

## Understanding the Axes

### X-Axis

Represents one variable.

Example:

```text
Hours Studied
```

### Y-Axis

Represents another variable.

Example:

```text
Exam Score
```

Each student's data becomes a point:

```text
(2, 40)
(4, 55)
(5, 60)
(7, 75)
(9, 90)
```

The first number is placed on the X-axis.

The second number is placed on the Y-axis.

## Visualizing the Data

A scatter plot might look like:

```text
90 |                 •
80 |
70 |            •
60 |        •
50 |    •
40 | •
   ---------------------
    2  4  6  8 10
```

Notice how the points move upward.

This suggests that students who study more tend to score higher.

## Correlation

Scatter plots are excellent tools for understanding **correlation**.

Correlation means how strongly two variables are related.

### Positive Correlation

As one variable increases, the other increases.

Example:

* Study Hours ↑
* Marks ↑

Visual pattern:

```text
•
  •
    •
      •
        •
```

The points move upward from left to right.

### Negative Correlation

As one variable increases, the other decreases.

Example:

* Speed ↑
* Travel Time ↓

Visual pattern:

```text
        •
      •
    •
  •
•
```

The points move downward.

### No Correlation

The points appear random.

Example:

* Shoe Size
* Exam Marks

Visual pattern:

```text
•      •
    •
       •
 •
```

No clear relationship exists.

## Scatter Plots in Machine Learning

Suppose we want to predict house prices.

Dataset:

| House Size (sq ft) | Price ($) |
| ------------------ | --------- |
| 1000               | 150000    |
| 1200               | 180000    |
| 1500               | 230000    |
| 1800               | 280000    |
| 2200               | 350000    |

A scatter plot immediately shows:

* Larger houses generally cost more.
* The relationship appears positive.
* Linear Regression might work well.

This is exactly how data scientists explore data before selecting algorithms.

## Creating a Scatter Plot in Python

Matplotlib provides the `scatter()` function.

```python
import matplotlib.pyplot as plt

hours = [2, 4, 5, 7, 9]
marks = [40, 55, 60, 75, 90]

plt.scatter(hours, marks)

plt.title("Study Hours vs Marks")
plt.xlabel("Hours Studied")
plt.ylabel("Marks")

plt.show()
```

This creates a basic scatter plot.

## Understanding the Code

```python
hours = [2, 4, 5, 7, 9]
```

X-axis values.

```python
marks = [40, 55, 60, 75, 90]
```

Y-axis values.

```python
plt.scatter(hours, marks)
```

Creates individual dots.

```python
plt.show()
```

Displays the graph.

## Changing Marker Colors

We can customize the appearance.

```python
import matplotlib.pyplot as plt

hours = [2, 4, 5, 7, 9]
marks = [40, 55, 60, 75, 90]

plt.scatter(
    hours,
    marks,
    color="red"
)

plt.show()
```

The points become red.

## Changing Point Size

Larger points are easier to see.

```python
plt.scatter(
    hours,
    marks,
    s=100
)
```

The parameter `s` controls marker size.

## Adding a Grid

Grids make plots easier to read.

```python
plt.scatter(hours, marks)

plt.grid(True)

plt.show()
```

Now viewers can estimate values more accurately.

## Real AI Example

Suppose we collect data about houses.

```python
house_size = [1000, 1200, 1500, 1800, 2200]
price = [150000, 180000, 230000, 280000, 350000]
```

Scatter plot:

```python
plt.scatter(house_size, price)

plt.xlabel("House Size")
plt.ylabel("Price")

plt.show()
```

A clear upward pattern indicates a strong positive relationship.

This is exactly the type of visualization used before training a Linear Regression model.

## Detecting Outliers

Scatter plots are excellent at finding unusual data points.

Consider:

| Hours Studied | Marks |
| ------------- | ----- |
| 2             | 40    |
| 4             | 55    |
| 5             | 60    |
| 7             | 75    |
| 9             | 10    |

Most students follow the trend except the last one.

The point (9,10) appears far away from the others.

This unusual point is called an **outlier**.

Outliers can:

* Indicate data entry mistakes
* Represent unusual events
* Affect machine learning models

Scatter plots make outliers easy to identify.

## Scatter Plots with Pandas

Pandas can create scatter plots directly.

```python
import pandas as pd
import matplotlib.pyplot as plt

data = {
    "Hours": [2, 4, 5, 7, 9],
    "Marks": [40, 55, 60, 75, 90]
}

df = pd.DataFrame(data)

df.plot(
    kind="scatter",
    x="Hours",
    y="Marks"
)

plt.show()
```

This combines data handling and visualization efficiently.

## Common Mistakes

### Using Scatter Plots for Categories

Bad example:

```text
Apple
Banana
Orange
```

Scatter plots are designed primarily for numerical variables.

For categories, bar charts are often better.

### Ignoring Outliers

An unusual point can significantly affect conclusions.

Always inspect scatter plots carefully.

### Missing Labels

Without axis labels, viewers cannot understand the variables being compared.

Always include:

* Title
* X-axis label
* Y-axis label

## When Should You Use a Scatter Plot?

Use scatter plots when:

✅ Studying relationships between variables

✅ Detecting trends

✅ Identifying outliers

✅ Exploring datasets

✅ Preparing for machine learning

Avoid them when:

❌ Comparing categories

❌ Showing parts of a whole

❌ Displaying simple counts

In those situations, bar charts or pie charts may be better choices.

## How Data Scientists Use Scatter Plots

Scatter plots are used extensively to:

* Explore datasets
* Detect correlations
* Find anomalies
* Evaluate model assumptions
* Analyze features
* Understand relationships before training models

Many machine learning projects begin with scatter plots because understanding the data is often more important than selecting an algorithm.

## Conclusion

A scatter plot is a visualization tool that displays individual data points to reveal relationships between two numerical variables. It helps identify positive correlations, negative correlations, no correlation, and unusual outliers. In AI, machine learning, and data science, scatter plots are among the most valuable exploratory tools because they allow us to understand patterns in data before building predictive models. Mastering scatter plots is an important step toward becoming a skilled data analyst and machine learning practitioner.
