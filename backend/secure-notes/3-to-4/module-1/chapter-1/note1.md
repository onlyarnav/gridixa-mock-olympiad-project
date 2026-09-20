# Linear Algebra Refresher

Linear algebra is the mathematics of **structured numbers**.

In Artificial Intelligence, almost every real-world object must first become numbers before a machine can process it.

A student profile becomes numbers.
An image becomes numbers.
A sentence becomes numbers.
A sound recording becomes numbers.
A neural network becomes numbers.

Linear algebra gives us the tools to organize, move, compare, transform, and learn from those numbers.

At beginner level, linear algebra may feel like “matrices and calculations.”

At AI level, it becomes much more important.

It becomes the language used to describe:

* data,
* features,
* embeddings,
* model weights,
* neural network layers,
* gradients,
* similarity,
* and transformations.

A strong AI student should not only know how to calculate linear algebra operations, but also understand what those operations mean inside an AI system.

# Why Linear Algebra Matters in AI

Imagine you are building an AI system that predicts whether a student will perform well in an exam.

The AI cannot directly understand a student the way a teacher does.

So we represent the student using numbers.

```python
student = [16, 92, 7, 85]
```

This could mean:

```text
[age, previous_score, study_hours_per_day, attendance_percentage]
```

Now the student has become a vector.

A vector is a numerical representation of an object.

If we have many students, we can arrange them into a matrix.

```python
students = [
    [16, 92, 7, 85],
    [15, 78, 5, 80],
    [17, 88, 6, 90]
]
```

Each row represents one student.
Each column represents one feature.

This is exactly how datasets are represented in Machine Learning.

A dataset is often just a large matrix.

# The Big Idea of Linear Algebra

Linear algebra is about working with numbers arranged in meaningful structures.

The most important structures are:

```text
Scalar  → single number
Vector  → list of numbers
Matrix  → table of numbers
Tensor  → multi-dimensional block of numbers
```

These structures are everywhere in AI.

A scalar may represent a prediction score.

```python
score = 0.87
```

A vector may represent one data point.

```python
student_vector = [16, 92, 7, 85]
```

A matrix may represent an entire dataset.

```python
dataset = [
    [16, 92, 7, 85],
    [15, 78, 5, 80],
    [17, 88, 6, 90]
]
```

A tensor may represent an image, a video, or a batch of training data.

```text
Image tensor: height × width × color_channels
Video tensor: frames × height × width × color_channels
```

Modern AI systems are built on these structures.

# Scalars

A scalar is a single value.

Examples:

```python
learning_rate = 0.01
temperature = 36.5
probability = 0.92
loss = 1.37
```

In Machine Learning, scalars are used for:

* model scores,
* probabilities,
* learning rates,
* loss values,
* accuracy values,
* and individual feature values.

For example:

```python
accuracy = 0.94
```

This means the model is correct 94 percent of the time.

A scalar is simple, but it often controls very important behavior.

For example, the learning rate decides how large each learning step should be during training.

# Vectors

A vector is a list of numbers.

```python
v = [3, 4]
```

You can think of a vector in two ways.

It can be a list of values.

```text
[marks, study_hours, attendance]
```

It can also be an arrow in space.

For example, `[3, 4]` can mean:

* move 3 units in the x-direction,
* move 4 units in the y-direction.

In AI, vectors are often used to represent objects.

A word can be represented as a vector.

```python
word_vector = [0.21, -0.44, 0.87, 0.12]
```

A user can be represented as a vector.

```python
user_vector = [5, 1, 0, 3]
```

A movie can be represented as a vector.

```python
movie_vector = [4, 1, 0, 2]
```

Once things become vectors, AI can compare them mathematically.

That is the power of vector representation.

# Vector Magnitude

The magnitude of a vector means its length.

For a vector:

```text
v = [3, 4]
```

The magnitude is:

```text
||v|| = √(3² + 4²)
||v|| = √(9 + 16)
||v|| = √25
||v|| = 5
```

In Python:

```python
import numpy as np

v = np.array([3, 4])

magnitude = np.linalg.norm(v)

print(magnitude)
```

Output:

```text
5.0
```

Magnitude is useful because it tells us the size or strength of a vector.

In AI, magnitude can help measure:

* distance,
* error size,
* gradient strength,
* and feature scale.

But magnitude alone is not enough.

Direction also matters.

# Vector Direction

A vector does not only have length.

It also has direction.

Imagine two students preparing for an exam.

One studies for 2 hours daily.
Another studies for 8 hours daily.

Their effort levels are different, but both are moving in the same direction: preparing for the exam.

Vectors can behave similarly.

Two vectors may have different magnitudes but still point in a similar direction.

This idea is extremely important in AI embeddings.

For example, two sentences with similar meaning may have vectors pointing in similar directions, even if their exact values are different.

That is why similarity in AI often depends on direction, not only distance.

# Matrices

A matrix is a rectangular table of numbers.

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6]
]
```

This matrix has 2 rows and 3 columns.

Its shape is:

```text
2 × 3
```

In Machine Learning, matrices are everywhere.

A dataset can be represented as a matrix.

```python
X = [
    [16, 92, 7],
    [15, 78, 5],
    [17, 88, 6]
]
```

Here:

* each row is one student,
* each column is one feature.

A neural network weight layer can also be represented as a matrix.

```python
W = [
    [0.2, 0.5],
    [0.8, 0.1],
    [0.4, 0.9]
]
```

The model uses this matrix to transform input features into output features.

# Matrix Shape

Shape is one of the most important ideas in AI coding.

A matrix with 3 rows and 4 columns has shape:

```text
3 × 4
```

In NumPy:

```python
import numpy as np

X = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print(X.shape)
```

Output:

```text
(2, 3)
```

This means the matrix has:

* 2 rows,
* 3 columns.

Shape errors are extremely common in Machine Learning.

Many AI bugs happen because the dimensions do not match.

An olympiad-level student should always ask:

```text
What is the shape of the input?
What is the shape of the weight matrix?
What will be the shape of the output?
```

# Tensors

A tensor is a higher-dimensional structure.

A scalar is a 0D tensor.
A vector is a 1D tensor.
A matrix is a 2D tensor.
A 3D or higher-dimensional structure is usually called a tensor.

For example, a grayscale image can be represented as a 2D matrix:

```text
height × width
```

A colored image needs three color channels: red, green, and blue.

So it becomes a 3D tensor:

```text
height × width × channels
```

A batch of colored images becomes a 4D tensor:

```text
batch_size × height × width × channels
```

This is why deep learning frameworks like TensorFlow and PyTorch are built around tensors.

The word “TensorFlow” itself means data flows through tensor operations.

# Addition of Vectors

Vector addition means adding matching positions.

```text
a = [1, 2, 3]
b = [4, 5, 6]

a + b = [5, 7, 9]
```

In Python:

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print(a + b)
```

Output:

```text
[5 7 9]
```

Vector addition is used in AI when combining features, updating parameters, or adding biases.

For example, in a neural network:

```text
output = input × weights + bias
```

The bias is often added using vector addition.

# Scalar Multiplication

Scalar multiplication means multiplying every element of a vector by a single number.

```text
v = [2, 4, 6]

3v = [6, 12, 18]
```

Python:

```python
import numpy as np

v = np.array([2, 4, 6])

print(3 * v)
```

Output:

```text
[ 6 12 18]
```

In Machine Learning, scalar multiplication appears in gradient descent.

For example:

```text
new_weights = old_weights - learning_rate × gradient
```

The learning rate is a scalar.

The gradient is a vector.

The scalar controls how large the update step is.

# Dot Product

The dot product combines two vectors into a single number.

For:

```text
a = [1, 2, 3]
b = [4, 5, 6]
```

The dot product is:

```text
a · b = (1×4) + (2×5) + (3×6)
a · b = 4 + 10 + 18
a · b = 32
```

Python:

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print(np.dot(a, b))
```

Output:

```text
32
```

The dot product tells us how aligned two vectors are.

If two vectors point in similar directions, their dot product is large.

If they point in opposite directions, the dot product may be negative.

If they are perpendicular, the dot product is zero.

This is one of the most important operations in AI.

# Dot Product in AI

Suppose a recommendation system represents a user and a movie as vectors.

```python
import numpy as np

user = np.array([5, 1, 0])
movie = np.array([4, 1, 0])

score = np.dot(user, movie)

print(score)
```

Output:

```text
21
```

The dimensions may represent:

```text
[action, romance, horror]
```

A high dot product means the user’s interests align well with the movie’s features.

The AI is not emotionally understanding the user.

It is mathematically comparing vectors.

This is the core idea behind many recommendation systems.

# Matrix Multiplication

Matrix multiplication is one of the most important operations in Machine Learning.

It is not simple element-by-element multiplication.

It works by taking dot products between rows and columns.

Example:

```python
import numpy as np

A = np.array([
    [1, 2],
    [3, 4]
])

B = np.array([
    [5, 6],
    [7, 8]
])

C = A @ B

print(C)
```

Output:

```text
[[19 22]
 [43 50]]
```

The first value, `19`, comes from:

```text
[1, 2] · [5, 7] = (1×5) + (2×7) = 19
```

Matrix multiplication is basically a structured system of dot products.

Neural networks use matrix multiplication constantly.

# Matrix Multiplication Shape Rule

Matrix multiplication works only when the inner dimensions match.

If:

```text
A has shape m × n
B has shape n × p
```

Then:

```text
A @ B has shape m × p
```

Example:

```text
A shape = 3 × 4
B shape = 4 × 2
Output shape = 3 × 2
```

The inner dimensions are both `4`, so multiplication is valid.

But this will not work:

```text
A shape = 3 × 4
B shape = 5 × 2
```

The inner dimensions are `4` and `5`.

They do not match.

Python example:

```python
import numpy as np

X = np.random.randn(5, 3)
W = np.random.randn(3, 2)

output = X @ W

print(output.shape)
```

Output:

```text
(5, 2)
```

This means:

* 5 data points entered the model,
* each had 3 features,
* the weight matrix transformed them into 2 output features.

# Matrix as a Transformation

A matrix can transform a vector.

It can stretch, rotate, shrink, flip, or project data.

Example:

```python
import numpy as np

A = np.array([
    [2, 0],
    [0, 3]
])

v = np.array([1, 1])

result = A @ v

print(result)
```

Output:

```text
[2 3]
```

The matrix changed `[1, 1]` into `[2, 3]`.

It stretched the x-direction by 2 and the y-direction by 3.

This is exactly what neural network layers do.

They transform input data into new representations.

# Neural Network Layer as Linear Algebra

A simple neural network layer can be written as:

```text
z = XW + b
```

Where:

```text
X = input matrix
W = weight matrix
b = bias vector
z = output before activation
```

Python example:

```python
import numpy as np

X = np.array([
    [1.0, 2.0, 3.0]
])

W = np.array([
    [0.2, 0.5],
    [0.8, 0.1],
    [0.4, 0.9]
])

b = np.array([0.1, 0.2])

z = X @ W + b

print(z)
```

Output:

```text
[[3.1 3.6]]
```

This is not just a calculation.

This is the model transforming input features into a new representation.

The input had 3 features.

The output has 2 features.

The weight matrix controls how information flows.

# Identity Matrix

The identity matrix is a special matrix that does not change a vector when multiplied by it.

For 2D:

```text
I = [
    [1, 0],
    [0, 1]
]
```

Example:

```python
import numpy as np

I = np.array([
    [1, 0],
    [0, 1]
])

v = np.array([7, 9])

print(I @ v)
```

Output:

```text
[7 9]
```

The vector remains unchanged.

The identity matrix is like multiplying by `1` in normal arithmetic.

In linear algebra, it represents “no transformation.”

# Transpose

The transpose of a matrix flips rows into columns.

Example:

```text
A = [
    [1, 2, 3],
    [4, 5, 6]
]
```

Transpose:

```text
Aᵀ = [
    [1, 4],
    [2, 5],
    [3, 6]
]
```

Python:

```python
import numpy as np

A = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print(A.T)
```

Output:

```text
[[1 4]
 [2 5]
 [3 6]]
```

Transpose is used frequently in Machine Learning, especially when aligning shapes for matrix multiplication.

# Inverse Matrix

The inverse of a matrix reverses the effect of a matrix transformation.

If:

```text
A transforms v into Av
```

Then:

```text
A⁻¹ transforms Av back into v
```

It is similar to how subtraction reverses addition or division reverses multiplication.

Example:

```python
import numpy as np

A = np.array([
    [2, 0],
    [0, 4]
])

A_inv = np.linalg.inv(A)

print(A_inv)
```

Output:

```text
[[0.5  0.  ]
 [0.   0.25]]
```

Not every matrix has an inverse.

A matrix that does not have an inverse is called singular.

In AI, we often avoid directly computing matrix inverses for large systems because it can be computationally expensive and numerically unstable.

Instead, optimized methods are used.

# Determinant

The determinant gives information about how a matrix changes space.

For a 2D matrix, the determinant tells how much area is scaled by the transformation.

Example:

```python
import numpy as np

A = np.array([
    [2, 0],
    [0, 3]
])

det = np.linalg.det(A)

print(det)
```

Output:

```text
6.0
```

This means the matrix scales area by a factor of 6.

If the determinant is zero, the matrix collapses space in some direction and does not have an inverse.

That means some information is lost during transformation.

# Norms

A norm measures the size of a vector.

The most common norm is the L2 norm.

For:

```text
v = [3, 4]
```

The L2 norm is:

```text
√(3² + 4²) = 5
```

Python:

```python
import numpy as np

v = np.array([3, 4])

print(np.linalg.norm(v))
```

Output:

```text
5.0
```

The L1 norm adds absolute values.

For:

```text
v = [3, -4]
```

The L1 norm is:

```text
|3| + |-4| = 7
```

Python:

```python
import numpy as np

v = np.array([3, -4])

print(np.linalg.norm(v, ord=1))
```

Output:

```text
7.0
```

Norms are used in:

* distance measurement,
* error calculation,
* optimization,
* regularization,
* and gradient updates.

# Distance Between Vectors

Distance tells us how far two vectors are from each other.

Example:

```python
import numpy as np

a = np.array([1, 2])
b = np.array([4, 6])

distance = np.linalg.norm(a - b)

print(distance)
```

Output:

```text
5.0
```

This is Euclidean distance.

In AI, distance is used to compare:

* users,
* documents,
* images,
* embeddings,
* and data points.

If two vectors are close, they may represent similar objects.

If they are far apart, they may represent different objects.

# Cosine Similarity

Cosine similarity measures how similar two vectors are based on direction.

Formula:

```text
cosine similarity = (a · b) / (||a|| ||b||)
```

Python:

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([2, 4, 6])

cosine_similarity = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(cosine_similarity)
```

Output:

```text
1.0
```

The answer is `1.0` because both vectors point in the same direction.

Cosine similarity is extremely important in:

* semantic search,
* recommendation systems,
* vector databases,
* document retrieval,
* and RAG pipelines.

When an AI chatbot retrieves relevant documents, it often compares query embeddings and document embeddings using similarity.

# Linear Independence

Vectors are linearly independent when none of them can be created from a combination of the others.

Example:

```text
v1 = [1, 0]
v2 = [0, 1]
```

These are independent because they point in different basic directions.

But:

```text
v1 = [1, 2]
v2 = [2, 4]
```

These are dependent because:

```text
v2 = 2 × v1
```

The second vector does not add a new direction.

In Machine Learning, this matters because redundant features may not add new information.

For example, if one feature is always double another feature, the model may not gain much extra knowledge from both.

# Span

The span of a set of vectors is the collection of all vectors that can be created by combining them.

For example:

```text
v1 = [1, 0]
v2 = [0, 1]
```

These two vectors can create any vector in 2D space.

Example:

```text
[5, 7] = 5[1, 0] + 7[0, 1]
```

So their span is the entire 2D plane.

In AI, span helps us understand what kind of representations a model can create.

A model with richer useful directions can represent more complex patterns.

# Basis

A basis is a set of independent vectors that can span an entire space.

For 2D space, a standard basis is:

```text
[1, 0] and [0, 1]
```

For 3D space:

```text
[1, 0, 0], [0, 1, 0], [0, 0, 1]
```

A basis is like a coordinate system.

If you know the basis, you can describe every point in that space.

In AI, changing the basis can make data easier to understand.

This idea appears in dimensionality reduction and representation learning.

# Rank

The rank of a matrix tells how many independent directions it contains.

Example:

```python
import numpy as np

A = np.array([
    [1, 2],
    [2, 4]
])

rank = np.linalg.matrix_rank(A)

print(rank)
```

Output:

```text
1
```

The second row is just twice the first row.

So the matrix only contains one independent direction.

Rank matters in AI because it helps detect:

* redundant features,
* compressed representations,
* low-rank approximations,
* and information loss.

Large AI models sometimes use low-rank techniques to reduce memory and computation.

# Orthogonality

Two vectors are orthogonal when they are perpendicular.

Their dot product is zero.

Example:

```python
import numpy as np

a = np.array([1, 0])
b = np.array([0, 1])

print(np.dot(a, b))
```

Output:

```text
0
```

Orthogonal vectors represent separate directions.

In AI, this can be useful because separate directions can represent different independent types of information.

For example, in an embedding space, different directions may capture different meaning patterns.

# Projection

Projection means measuring how much of one vector lies in the direction of another.

Imagine sunlight casting a shadow.

The shadow is like a projection.

Python example:

```python
import numpy as np

a = np.array([3, 4])
b = np.array([1, 0])

projection_length = np.dot(a, b) / np.linalg.norm(b)

print(projection_length)
```

Output:

```text
3.0
```

This tells us that vector `a` has 3 units in the direction of vector `b`.

Projection is important in:

* dimensionality reduction,
* regression,
* feature extraction,
* and optimization.

# Linear Algebra in Machine Learning Pipelines

A Machine Learning pipeline often looks like this:

```text
Raw data → numerical features → matrix representation → model transformation → prediction
```

For example:

```python
import numpy as np

X = np.array([
    [2, 3],
    [4, 5],
    [6, 7]
])

W = np.array([
    [0.5],
    [0.2]
])

b = np.array([1.0])

predictions = X @ W + b

print(predictions)
```

Output:

```text
[[2.6]
 [4. ]
 [5.4]]
```

Here:

* `X` is the input data,
* `W` contains model weights,
* `b` is the bias,
* `predictions` are the model outputs.

This is the basic structure behind many ML models.

Advanced models are larger and deeper, but the foundation remains linear algebra.

# Shape Reasoning in Olympiad Problems

Many difficult AI problems do not ask you to calculate every value.

They test whether you understand shapes.

Suppose:

```text
X shape = 100 × 5
W shape = 5 × 3
```

Then:

```text
X @ W shape = 100 × 3
```

This means:

* there are 100 data points,
* each input has 5 features,
* the model transforms each data point into 3 output values.

Now suppose:

```text
X shape = 100 × 5
W shape = 4 × 3
```

This multiplication is invalid because the inner dimensions do not match.

Strong AI students track dimensions carefully before writing code.

This habit prevents many real-world bugs.

# Linear Algebra as Representation and Transformation

The deepest idea in this refresher is simple:

Linear algebra lets AI represent data and transform it.

Representation means turning real-world information into vectors, matrices, or tensors.

Transformation means changing those representations to extract useful patterns.

For example:

```text
Input image → pixel tensor → neural network layers → feature vector → prediction
```

Each layer transforms the data into a more useful form.

A neural network does not understand the image like a human.

It transforms numerical representations until useful patterns emerge.

# Conclusion

Linear algebra is the foundation of modern Artificial Intelligence.

It provides the structures and operations used to represent data, compare information, transform features, train models, and build neural networks.

Scalars, vectors, matrices, tensors, dot products, matrix multiplication, norms, rank, basis, span, orthogonality, projection, and shape reasoning are not separate mathematical ideas.

They are the working parts inside AI systems.

When you understand linear algebra as representation and transformation, Machine Learning becomes easier to reason about.

You stop seeing AI as mysterious software and begin seeing it as a structured system of numbers, geometry, and learning.
