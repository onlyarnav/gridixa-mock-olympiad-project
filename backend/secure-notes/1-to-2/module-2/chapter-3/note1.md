# NumPy Basics

## Why NumPy Exists

Imagine you are working with thousands or even millions of numbers.

You want to:

* Add them
* Multiply them
* Find averages
* Build AI datasets
* Perform matrix calculations

Using normal Python lists for this becomes slow and inefficient.

That is where **NumPy** comes in.

NumPy stands for:

**Numerical Python**

It is one of the most important libraries in Artificial Intelligence, Machine Learning, Data Science, Robotics, and Scientific Computing.

Think of Python lists as:

> A normal bicycle

And NumPy arrays as:

> A high-speed sports car built specially for mathematical computation.

NumPy is optimized internally using low-level languages like C, making operations extremely fast.

Almost every major AI framework:

* TensorFlow
* PyTorch
* Scikit-learn
* OpenCV

depends heavily on NumPy.

So learning NumPy is like learning the “language of numbers” in AI.

---

# Installing NumPy

Before using NumPy, it must be installed.

In terminal or command prompt:

```python
pip install numpy
```

Then import it:

```python
import numpy as np
```

`np` is simply a short nickname for NumPy.

This is standard practice worldwide.

---

# Understanding Arrays

The heart of NumPy is the **array**.

A NumPy array is similar to a Python list but:

* Faster
* More memory efficient
* Designed for mathematics

Example:

```python
import numpy as np

numbers = np.array([1, 2, 3, 4, 5])

print(numbers)
```

Output:

```python
[1 2 3 4 5]
```

Notice:

* No commas in output
* NumPy displays arrays differently

---

# Why Arrays Are Better Than Lists

Normal Python list:

```python
a = [1, 2, 3]
```

NumPy array:

```python
a = np.array([1, 2, 3])
```

Now imagine adding 5 to every value.

With lists:

```python
result = []

for i in a:
    result.append(i + 5)

print(result)
```

With NumPy:

```python
a = np.array([1, 2, 3])

print(a + 5)
```

Output:

```python
[6 7 8]
```

NumPy performs operations on the entire array instantly.

This is called:

## Vectorized Computation

And it is one of the reasons AI systems can process huge datasets efficiently.

---

# Creating Arrays

## From Lists

```python
arr = np.array([10, 20, 30])
```

---

## Multi-Dimensional Arrays

Arrays can contain rows and columns.

```python
matrix = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print(matrix)
```

Output:

```python
[[1 2 3]
 [4 5 6]]
```

This is called a:

## 2D Array

It behaves like a matrix.

AI models often use huge multidimensional arrays.

---

# Understanding Dimensions

Dimensions tell us how data is organized.

## 1D Array

```python
[1, 2, 3]
```

Just one row of values.

---

## 2D Array

```python
[
 [1, 2],
 [3, 4]
]
```

Rows and columns.

---

## 3D Array

Imagine multiple matrices stacked together.

This is heavily used in:

* Image processing
* Deep learning
* Video analysis

---

# Checking Array Properties

## Shape

Tells rows and columns.

```python
arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print(arr.shape)
```

Output:

```python
(2, 3)
```

Meaning:

* 2 rows
* 3 columns

---

## Number of Dimensions

```python
print(arr.ndim)
```

Output:

```python
2
```

---

## Data Type

```python
print(arr.dtype)
```

Output:

```python
int64
```

NumPy stores data very efficiently using data types.

Common types:

* int
* float
* bool

---

# Creating Special Arrays

## Array of Zeros

```python
zeros = np.zeros((2, 3))

print(zeros)
```

Output:

```python
[[0. 0. 0.]
 [0. 0. 0.]]
```

---

## Array of Ones

```python
ones = np.ones((2, 2))

print(ones)
```

---

## Range of Numbers

```python
arr = np.arange(1, 10)

print(arr)
```

Output:

```python
[1 2 3 4 5 6 7 8 9]
```

---

# Random Numbers

AI models often start with random values.

NumPy can generate them.

```python
random_numbers = np.random.rand(5)

print(random_numbers)
```

Possible Output:

```python
[0.25 0.88 0.12 0.64 0.91]
```

Every run gives different numbers.

---

# Indexing Arrays

Just like lists:

```python
arr = np.array([10, 20, 30])

print(arr[0])
```

Output:

```python
10
```

---

# Accessing 2D Arrays

```python
matrix = np.array([
    [1, 2],
    [3, 4]
])

print(matrix[1][0])
```

Output:

```python
3
```

Explanation:

* Row 1 → `[3, 4]`
* Column 0 → `3`

---

# Slicing Arrays

Extract portions of arrays.

```python
arr = np.array([1, 2, 3, 4, 5])

print(arr[1:4])
```

Output:

```python
[2 3 4]
```

---

# Mathematical Operations

NumPy makes mathematics extremely simple.

## Addition

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print(a + b)
```

Output:

```python
[5 7 9]
```

---

## Multiplication

```python
print(a * b)
```

Output:

```python
[ 4 10 18]
```

---

## Square Root

```python
print(np.sqrt(a))
```

Output:

```python
[1.         1.41421356 1.73205081]
```

---

# Aggregation Functions

Aggregation means summarizing data.

## Sum

```python
arr = np.array([1, 2, 3, 4])

print(arr.sum())
```

Output:

```python
10
```

---

## Mean

```python
print(arr.mean())
```

Output:

```python
2.5
```

---

## Maximum

```python
print(arr.max())
```

---

## Minimum

```python
print(arr.min())
```

These operations are heavily used in Machine Learning preprocessing.

---

# Reshaping Arrays

Sometimes AI models expect data in specific shapes.

NumPy allows reshaping.

```python
arr = np.array([1, 2, 3, 4, 5, 6])

reshaped = arr.reshape(2, 3)

print(reshaped)
```

Output:

```python
[[1 2 3]
 [4 5 6]]
```

---

# NumPy in Real AI Systems

NumPy is used for:

* Storing datasets
* Image pixel manipulation
* Matrix operations
* Neural network computations
* Statistical analysis
* Data preprocessing

Even images are actually NumPy arrays.

For example:

* A grayscale image → 2D array
* A colored image → 3D array

Each pixel is stored as a numerical value.

---

# Comparing Python Lists vs NumPy Arrays

| Feature                   | Python List  | NumPy Array       |
| ------------------------- | ------------ | ----------------- |
| Speed                     | Slower       | Faster            |
| Memory Efficiency         | Lower        | Higher            |
| Mathematical Operations   | Manual loops | Direct operations |
| AI/ML Usage               | Limited      | Essential         |
| Multi-dimensional Support | Weak         | Strong            |

---

# Common Beginner Mistakes

## Mixing Different Data Types

```python
arr = np.array([1, 2, "hello"])
```

NumPy converts everything into strings.

Be careful with mixed data types.

---

## Wrong Shape During Reshape

```python
arr.reshape(2, 2)
```

This fails if total elements do not match.

Example:

* 6 elements cannot fit into 2×2

Because:

* 2×2 = 4 spaces only

---

# Thinking Like an AI Engineer

When experts look at data, they often think:

* What is the shape?
* How many dimensions?
* Is the data normalized?
* Can operations be vectorized?

NumPy trains your brain to think mathematically about data.

This mindset is essential for:

* Machine Learning
* Deep Learning
* Computer Vision
* Scientific AI systems

---

# Conclusion

NumPy is one of the foundational pillars of Artificial Intelligence and Machine Learning.

It transforms Python from a general programming language into a powerful mathematical engine capable of handling:

* Large datasets
* Matrix computations
* Numerical analysis
* AI model operations

By learning NumPy basics, you are not just learning a library —
you are learning how modern AI systems internally process numbers, images, features, and predictions.

Mastering arrays, dimensions, indexing, reshaping, and mathematical operations will make advanced AI topics much easier in the future.
