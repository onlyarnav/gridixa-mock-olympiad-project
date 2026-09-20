# Simple Data Cleaning

Imagine you are preparing ingredients before cooking a meal.

Before you start cooking, you:

* Remove spoiled vegetables
* Wash the ingredients
* Remove unwanted parts
* Organize everything properly

Only then do you begin cooking.

Data scientists follow a very similar process. Before training an AI model, they must prepare the data. Raw data collected from websites, surveys, sensors, or databases is often messy, incomplete, inconsistent, and difficult to use directly.

The process of fixing and preparing data is called **data cleaning**.

Data cleaning is one of the most important stages in every AI and Machine Learning project because even the most advanced algorithm cannot produce good results if the input data is poor.

# What is Data Cleaning?

Data cleaning is the process of identifying and correcting errors, inconsistencies, and unwanted information in a dataset.

The goal is to transform messy data into reliable, structured, and usable data.

Think of data cleaning as quality control for information.

Raw Data:

| Name  | Age | City   |
| ----- | --- | ------ |
| Aditi | 15  | Delhi  |
| Rohan | ?   | Mumbai |
| aditi | 15  | DELHI  |
| Priya | 16  | Delhi  |

Cleaned Data:

| Name  | Age  | City   |
| ----- | ---- | ------ |
| Aditi | 15   | Delhi  |
| Rohan | 15.5 | Mumbai |
| Priya | 16   | Delhi  |

Notice what changed:

* Missing values were handled
* Duplicate information was removed
* Capitalization became consistent

This is data cleaning in action.

# Why Data Cleaning Matters

Imagine training an AI model to predict student performance.

Suppose the dataset contains:

* Missing marks
* Incorrect ages
* Duplicate students
* Different spellings of the same city

The model may learn incorrect patterns and produce poor predictions.

Clean data leads to:

* Better accuracy
* More reliable insights
* Faster model training
* Improved decision-making

Many professional data scientists spend more time cleaning data than building models.

# Common Data Quality Problems

Several issues commonly appear in real-world datasets.

# Missing Values

Some information may not be recorded.

Example:

| Name  | Age |
| ----- | --- |
| Aditi | 15  |
| Rohan | ?   |
| Priya | 16  |

Rohan's age is missing.

Missing values must be handled before analysis.

# Duplicate Records

The same information may appear multiple times.

Example:

| Name  | Age |
| ----- | --- |
| Aditi | 15  |
| Aditi | 15  |
| Priya | 16  |

The duplicate record can distort calculations and statistics.

# Inconsistent Formatting

Data may be written in different styles.

Example:

| City  |
| ----- |
| Delhi |
| delhi |
| DELHI |

Humans recognize these as the same city, but computers treat them as different values.

# Incorrect Data

Sometimes data contains obvious mistakes.

Example:

| Name  | Age |
| ----- | --- |
| Aditi | 15  |
| Rohan | 250 |

An age of 250 years is clearly incorrect.

Such values should be investigated and corrected.

# Extra Spaces

Data entry often introduces unnecessary spaces.

Example:

```python
"Delhi"
" Delhi"
"Delhi "
```

These look identical to humans but are different for computers.

# Detecting Data Problems Using Python

Let's create a small dataset.

```python
import pandas as pd

data = {
    "Name": ["Aditi", "Rohan", "Aditi"],
    "Age": [15, None, 15],
    "City": ["Delhi", "Mumbai", "Delhi"]
}

df = pd.DataFrame(data)

print(df)
```

Output:

```python
    Name   Age    City
0  Aditi  15.0   Delhi
1  Rohan   NaN  Mumbai
2  Aditi  15.0   Delhi
```

We can immediately notice:

* One missing value
* One duplicate record

# Cleaning Missing Values

A common approach is to replace missing values.

Example:

```python
df["Age"] = df["Age"].fillna(df["Age"].mean())
```

Output:

```python
    Name   Age
0  Aditi  15.0
1  Rohan  15.0
2  Aditi  15.0
```

The missing age has been replaced.

# Removing Duplicate Records

Pandas provides a simple function.

```python
df = df.drop_duplicates()
```

Output:

```python
    Name   Age    City
0  Aditi  15.0   Delhi
1  Rohan  15.0  Mumbai
```

The repeated record is removed.

# Fixing Text Formatting

Suppose city names have inconsistent capitalization.

Example:

```python
df["City"] = ["DELHI", "mumbai", "Delhi"]
```

We can standardize them:

```python
df["City"] = df["City"].str.title()
```

Output:

```python
Delhi
Mumbai
Delhi
```

Now all values follow the same format.

# Removing Extra Spaces

Consider this dataset:

```python
cities = [" Delhi", "Mumbai ", " Chennai "]
```

Extra spaces can cause problems.

We can remove them:

```python
df["City"] = df["City"].str.strip()
```

Output:

```python
Delhi
Mumbai
Chennai
```

The unnecessary spaces disappear.

# Correcting Invalid Values

Suppose a dataset contains:

| Name  | Age |
| ----- | --- |
| Aditi | 15  |
| Rohan | 250 |
| Priya | 16  |

An age of 250 is unrealistic.

We can identify unusual values using conditions.

```python
invalid = df[df["Age"] > 120]

print(invalid)
```

Output:

```python
   Name  Age
1 Rohan 250
```

The suspicious record is detected for review.

# Real-World Example

Imagine an online shopping company collecting customer information.

Raw data:

| Customer | City  |
| -------- | ----- |
| Aditi    | Delhi |
| Rohan    | DELHI |
| Priya    | Delhi |
| Arjun    | Delhi |

A computer sees four different city names because of formatting differences.

After cleaning:

| Customer | City  |
| -------- | ----- |
| Aditi    | Delhi |
| Rohan    | Delhi |
| Priya    | Delhi |
| Arjun    | Delhi |

Now the dataset accurately represents reality.

# Data Cleaning Workflow

Most AI projects follow a similar sequence:

Collect Data

↓

Inspect Data

↓

Find Errors

↓

Handle Missing Values

↓

Remove Duplicates

↓

Standardize Formats

↓

Validate Data

↓

Train Machine Learning Model

Skipping the cleaning step often leads to poor model performance.

# Data Cleaning in AI Projects

Consider a recommendation system like those used in streaming platforms.

Before training the recommendation model, engineers must clean:

* Missing user information
* Incorrect ratings
* Duplicate accounts
* Corrupted records
* Inconsistent formatting

Only after cleaning can the AI learn meaningful patterns.

This is why data cleaning is often considered one of the foundations of machine learning.

# Best Practices for Data Cleaning

When working with datasets:

* Always inspect the data first
* Check for missing values
* Remove duplicate records
* Standardize text formatting
* Validate numerical values
* Document all cleaning steps
* Never assume raw data is correct

Professional AI teams follow these practices to ensure reliable results.

# Key Insight

Machine learning models learn exactly what they see in the data. If the data contains mistakes, the model learns those mistakes as well. Data cleaning improves the quality of information before it reaches the model, making predictions more accurate and trustworthy.

# Conclusion

Data cleaning is the process of identifying and correcting issues in a dataset before analysis or machine learning. Common problems include missing values, duplicate records, inconsistent formatting, extra spaces, and incorrect data entries. Using tools such as Pandas, data scientists can detect and fix these issues efficiently. Clean data forms the foundation of successful AI systems, helping models learn accurate patterns and generate reliable predictions.
