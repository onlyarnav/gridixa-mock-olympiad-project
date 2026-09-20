# Pandas Basics

## What is Pandas?

Imagine you are working with:

* Student marks
* Sales records
* AI datasets
* Survey responses
* Sensor readings
* CSV files with thousands of rows

Handling all of this using normal Python lists becomes extremely difficult.

This is where **Pandas** comes in.

Pandas is one of the most important Python libraries for:

* Data analysis
* Data cleaning
* Data manipulation
* AI dataset handling
* Machine Learning preprocessing

If NumPy is the “engine” of numerical computing,
then Pandas is the “smart data manager” built on top of that engine.

Pandas allows us to work with data in a way that feels similar to spreadsheets like Excel —
but far more powerful.

---

# Why Pandas is Important in AI

Before training an AI model, data must usually be:

* Cleaned
* Organized
* Filtered
* Converted
* Analyzed

Real-world datasets are messy.

Some problems include:

* Missing values
* Wrong formats
* Duplicate rows
* Irrelevant columns
* Huge file sizes

Pandas is designed specifically to solve these problems efficiently.

Most Machine Learning workflows start with Pandas.

---

# Installing Pandas

Install using:

``` 
pip install pandas
```

Import it:

``` 
import pandas as pd
```

`pd` is the standard shortcut used worldwide.

---

# Understanding DataFrames

The most important structure in Pandas is the:

# DataFrame

A DataFrame is like:

* A smart Excel sheet
* A database table
* A grid of rows and columns

Example:

| Name  | Marks | City      |
| ----- | ----- | --------- |
| Rahul | 92    | Delhi     |
| Aisha | 88    | Mumbai    |
| John  | 95    | Bangalore |

This entire table can exist inside Python using Pandas.

---

# Creating a DataFrame

``` 
import pandas as pd

data = {
    "Name": ["Rahul", "Aisha", "John"],
    "Marks": [92, 88, 95],
    "City": ["Delhi", "Mumbai", "Bangalore"]
}

df = pd.DataFrame(data)

print(df)
```

Output:

``` 
    Name  Marks       City
0  Rahul     92      Delhi
1  Aisha     88     Mumbai
2   John     95  Bangalore
```

Notice:

* Rows automatically get indexes
* Columns have names
* Data is organized neatly

---

# Understanding Rows and Columns

Think of a DataFrame as a school register.

## Columns

Columns represent categories.

Example:

* Name
* Marks
* City

---

## Rows

Rows represent individual records.

Example:

* One student
* One customer
* One AI training example

---

# Reading CSV Files

Most AI datasets come as CSV files.

CSV means:

## Comma Separated Values

Example file:

``` 
students.csv
```

Reading it:

``` 
df = pd.read_csv("students.csv")

print(df)
```

This is one of the most important Pandas operations.

AI engineers constantly load datasets using `read_csv()`.

---

# Viewing Data

## First Few Rows

``` 
print(df.head())
```

By default:

* Shows first 5 rows

Useful when datasets contain thousands of rows.

---

## Last Few Rows

``` 
print(df.tail())
```

Shows last rows.

---

# Understanding Dataset Information

## Dataset Structure

``` 
print(df.info())
```

This tells:

* Number of rows
* Number of columns
* Data types
* Missing values

AI engineers check this immediately after loading data.

---

# Statistical Summary

``` 
print(df.describe())
```

Output includes:

* Mean
* Standard deviation
* Minimum
* Maximum
* Quartiles

This helps understand data patterns.

---

# Selecting Columns

Suppose you only want marks.

``` 
print(df["Marks"])
```

Output:

``` 
0    92
1    88
2    95
```

This is called a:

# Series

A single column in Pandas is called a Series.

---

# Selecting Multiple Columns

``` 
print(df[["Name", "Marks"]])
```

---

# Accessing Specific Rows

## Using iloc

`iloc` means:

> Integer Location

``` 
print(df.iloc[0])
```

Gets first row.

---

## Access Specific Cell

``` 
print(df.iloc[1, 2])
```

Meaning:

* Row 1
* Column 2

---

# Filtering Data

Suppose we want students with marks above 90.

``` 
high_scores = df[df["Marks"] > 90]

print(high_scores)
```

Output:

``` 
    Name  Marks       City
0  Rahul     92      Delhi
2   John     95  Bangalore
```

Filtering is extremely important in:

* AI preprocessing
* Data cleaning
* Analytics systems

---

# Adding New Columns

``` 
df["Grade"] = ["A", "B", "A"]

print(df)
```

Pandas allows dynamic modification of datasets.

---

# Updating Data

``` 
df["Marks"] = df["Marks"] + 5
```

This increases every mark by 5.

Notice how simple vectorized operations become.

---

# Handling Missing Values

Real datasets often contain missing information.

Example:

| Name  | Marks |
| ----- | ----- |
| Rahul | 92    |
| Aisha | NaN   |
| John  | 95    |

`NaN` means:

> Not a Number

Missing values are dangerous in Machine Learning.

---

# Detecting Missing Values

``` 
print(df.isnull())
```

---

# Counting Missing Values

``` 
print(df.isnull().sum())
```

---

# Filling Missing Values

``` 
df["Marks"] = df["Marks"].fillna(0)
```

This replaces missing marks with 0.

---

# Removing Missing Data

``` 
df = df.dropna()
```

Removes rows containing missing values.

---

# Sorting Data

``` 
sorted_df = df.sort_values("Marks")

print(sorted_df)
```

---

# Grouping Data

One of Pandas’ most powerful features.

Example:

* Group students by city
* Find average marks

``` 
grouped = df.groupby("City")["Marks"].mean()

print(grouped)
```

This is heavily used in:

* Data analytics
* AI reporting
* Business intelligence

---

# Saving Data

After processing data:

``` 
df.to_csv("new_file.csv", index=False)
```

This creates a new CSV file.

---

# Pandas + NumPy Relationship

Pandas is built on top of NumPy.

Think of it like this:

| Tool   | Purpose                   |
| ------ | ------------------------- |
| NumPy  | Fast numerical operations |
| Pandas | Smart data handling       |

Most Pandas operations internally use NumPy arrays.

---

# Real AI Workflow Using Pandas

A typical AI engineer often follows this workflow:

## Step 1: Load Data

``` 
df = pd.read_csv("data.csv")
```

---

## Step 2: Explore Data

``` 
df.head()
df.info()
```

---

## Step 3: Clean Data

``` 
df.dropna()
```

---

## Step 4: Filter Useful Information

``` 
df[df["Age"] > 18]
```

---

## Step 5: Convert Data for Machine Learning

Eventually:

* Pandas data
  → becomes
* NumPy arrays
  → fed into
* AI models

---

# Common Beginner Mistakes

## Forgetting Parentheses

Wrong:

``` 
df.head
```

Correct:

``` 
df.head()
```

---

## Using Wrong Column Names

Column names are case-sensitive.

``` 
df["marks"]
```

may fail if actual column is:

``` 
"Marks"
```

---

## Modifying Original Data Accidentally

Sometimes operations overwrite datasets.

Always be careful when cleaning data.

---

# Thinking Like a Data Scientist

When professionals look at datasets, they think:

* Are there missing values?
* Are data types correct?
* Are there outliers?
* Is the dataset balanced?
* Which columns matter most?

Pandas helps transform raw data into meaningful information.

This mindset is essential for:

* Machine Learning
* AI systems
* Business analytics
* Research
* Data engineering

---

# Why Pandas is So Powerful

Without Pandas:

* Data preprocessing becomes extremely difficult
* AI workflows slow down
* Cleaning datasets becomes frustrating

With Pandas:

* Large datasets become manageable
* Data operations become simple
* Analysis becomes efficient

This is why Pandas is considered one of the most important tools in the entire AI ecosystem.

---

# Conclusion

Pandas is the backbone of data manipulation in Artificial Intelligence and Machine Learning.

It allows us to:

* Organize datasets
* Clean messy data
* Analyze information
* Filter records
* Handle missing values
* Prepare data for AI models

Understanding DataFrames, filtering, grouping, reading CSV files, and preprocessing techniques is a major step toward becoming an AI engineer or data scientist.

Almost every real-world AI project begins with Pandas.
