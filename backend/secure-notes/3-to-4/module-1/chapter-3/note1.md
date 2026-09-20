# Partial Derivatives

Partial derivatives are one of the most important ideas behind Machine Learning optimization.

In earlier calculus, you may have learned derivatives for functions with one variable.

For example:

```text
y = x²
```

Here, `y` depends only on `x`.

The derivative tells us how `y` changes when `x` changes.

But in Artificial Intelligence, most functions do not depend on just one variable.

A model may depend on thousands, millions, or even billions of parameters.

For example, a neural network may have weights like:

```text
w₁, w₂, w₃, w₄, ..., wₙ
```

The model’s loss depends on all of them.

So we need a way to ask:

How does the loss change if only one parameter changes, while all other parameters stay fixed?

That is exactly what a partial derivative tells us.

# The Core Idea

A partial derivative measures how a function changes with respect to one variable while treating all other variables as constants.

Suppose we have a function:

```text
f(x, y) = x² + y²
```

This function depends on two variables: `x` and `y`.

Now we can ask two different questions:

How does `f` change when `x` changes and `y` stays fixed?

How does `f` change when `y` changes and `x` stays fixed?

These two questions give two partial derivatives.

```text
∂f/∂x
```

means:

```text
Partial derivative of f with respect to x
```

And:

```text
∂f/∂y
```

means:

```text
Partial derivative of f with respect to y
```

The symbol `∂` is used instead of `d` because we are dealing with functions that have multiple variables.

# A Simple Analogy

Imagine you are adjusting the taste of a dish.

The final taste depends on:

* salt,
* sugar,
* spice,
* lemon,
* cooking time.

Now suppose the dish tastes bad.

You want to know:

What happens if I increase only the salt?

That is like a partial derivative with respect to salt.

What happens if I increase only the spice?

That is like a partial derivative with respect to spice.

You are not changing everything at once.

You are checking the effect of one ingredient while keeping others fixed.

Machine Learning does the same thing.

A model asks:

What happens to the loss if I change this one weight slightly?

# Why Partial Derivatives Matter in AI

Machine Learning models learn by reducing error.

This error is usually called the loss.

A simple loss function may depend on many parameters:

```text
Loss = L(w₁, w₂, w₃, ..., wₙ)
```

Each weight affects the loss differently.

Some weights may increase the loss if changed upward.

Some may decrease the loss.

Some may have almost no effect.

Partial derivatives help the model understand how each parameter influences the loss.

This is essential for gradient descent.

Without partial derivatives, a model would not know how to update its weights intelligently.

# Single-Variable Derivative Refresher

Before partial derivatives, remember the normal derivative.

For:

```text
f(x) = x²
```

The derivative is:

```text
df/dx = 2x
```

This tells us the rate of change of `f` with respect to `x`.

If:

```text
x = 3
```

then:

```text
df/dx = 2(3) = 6
```

This means that near `x = 3`, the function is increasing at a rate of about `6`.

In simple terms:

The derivative tells the slope.

# From Derivative to Partial Derivative

Now consider:

```text
f(x, y) = x² + y²
```

To find the partial derivative with respect to `x`, treat `y` as constant.

```text
∂f/∂x = 2x
```

Why?

Because `x²` changes with `x`, but `y²` is treated like a constant.

The derivative of a constant is zero.

So:

```text
∂/∂x (x² + y²) = 2x + 0 = 2x
```

Now find the partial derivative with respect to `y`.

Treat `x` as constant.

```text
∂f/∂y = 2y
```

So for:

```text
f(x, y) = x² + y²
```

we get:

```text
∂f/∂x = 2x
∂f/∂y = 2y
```

# Python Example: Calculating Partial Derivatives Numerically

We can approximate partial derivatives using small changes.

This is called numerical differentiation.

```python
def f(x, y):
    return x**2 + y**2


x = 3
y = 4
h = 0.0001

partial_x = (f(x + h, y) - f(x, y)) / h
partial_y = (f(x, y + h) - f(x, y)) / h

print("Partial derivative with respect to x:", partial_x)
print("Partial derivative with respect to y:", partial_y)
```

Expected output will be close to:

```text
Partial derivative with respect to x: 6
Partial derivative with respect to y: 8
```

Mathematically:

```text
∂f/∂x = 2x = 2(3) = 6
∂f/∂y = 2y = 2(4) = 8
```

The numerical method gives an approximation because it uses a very small step instead of an exact symbolic formula.

# Geometric Meaning

A function with one variable can be drawn as a curve.

A function with two variables can be drawn as a surface.

For example:

```text
f(x, y) = x² + y²
```

creates a bowl-shaped surface.

The partial derivative with respect to `x` tells the slope of the surface in the x-direction.

The partial derivative with respect to `y` tells the slope of the surface in the y-direction.

Imagine standing on a hill.

You can ask:

How steep is the hill if I walk east?

How steep is the hill if I walk north?

Each direction gives a different slope.

Partial derivatives measure those directional slopes along coordinate axes.

# Partial Derivatives and Loss Surfaces

In Machine Learning, the loss function can be imagined as a surface.

The model’s weights are like coordinates on that surface.

The height of the surface represents the loss.

A high point means high error.

A low point means low error.

Training a model means moving downhill toward lower loss.

Partial derivatives tell us how steep the loss is in each parameter direction.

For example:

```text
∂L/∂w₁
```

tells us how the loss changes if weight `w₁` changes.

```text
∂L/∂w₂
```

tells us how the loss changes if weight `w₂` changes.

The model uses these values to decide how to update each weight.

# The Gradient

When we collect all partial derivatives together, we get the gradient.

For a function:

```text
f(x, y)
```

the gradient is:

```text
∇f = [∂f/∂x, ∂f/∂y]
```

For:

```text
f(x, y) = x² + y²
```

we found:

```text
∂f/∂x = 2x
∂f/∂y = 2y
```

So:

```text
∇f = [2x, 2y]
```

At the point:

```text
(x, y) = (3, 4)
```

the gradient is:

```text
∇f = [6, 8]
```

This vector points in the direction of steepest increase.

In Machine Learning, we usually want to reduce the loss.

So we move in the opposite direction of the gradient.

# Gradient Descent Connection

Gradient descent updates parameters using this idea:

```text
new_parameter = old_parameter - learning_rate × partial_derivative
```

For multiple parameters:

```text
w₁_new = w₁_old - η × ∂L/∂w₁
w₂_new = w₂_old - η × ∂L/∂w₂
w₃_new = w₃_old - η × ∂L/∂w₃
```

Here:

```text
η = learning rate
L = loss function
w = weight
```

The partial derivative tells the direction and strength of change.

The learning rate controls the step size.

# Simple Gradient Descent Example

Suppose:

```text
L(w) = w²
```

The derivative is:

```text
dL/dw = 2w
```

If:

```text
w = 5
```

then:

```text
dL/dw = 10
```

Using learning rate:

```text
η = 0.1
```

Update:

```text
w_new = 5 - 0.1 × 10
w_new = 4
```

The weight moves from `5` to `4`, closer to the minimum at `w = 0`.

Now for multiple weights, partial derivatives do the same job for each weight.

# Partial Derivatives in a Two-Weight Loss Function

Suppose a model has two weights:

```text
w₁ and w₂
```

And the loss is:

```text
L(w₁, w₂) = w₁² + 3w₂²
```

Find the partial derivatives.

With respect to `w₁`:

```text
∂L/∂w₁ = 2w₁
```

With respect to `w₂`:

```text
∂L/∂w₂ = 6w₂
```

Notice that `w₂` has a stronger effect because it is multiplied by `3` in the loss.

If:

```text
w₁ = 2
w₂ = 2
```

then:

```text
∂L/∂w₁ = 4
∂L/∂w₂ = 12
```

This means the loss changes faster in the `w₂` direction.

The model should adjust `w₂` more strongly than `w₁`.

# Python Example: Gradient Descent with Two Variables

```python
def loss(w1, w2):
    return w1**2 + 3 * w2**2


def grad_w1(w1, w2):
    return 2 * w1


def grad_w2(w1, w2):
    return 6 * w2


w1 = 2.0
w2 = 2.0
learning_rate = 0.1

for step in range(10):
    dw1 = grad_w1(w1, w2)
    dw2 = grad_w2(w1, w2)

    w1 = w1 - learning_rate * dw1
    w2 = w2 - learning_rate * dw2

    print(step, w1, w2, loss(w1, w2))
```

This code repeatedly updates `w1` and `w2` to reduce the loss.

The model is not guessing randomly.

It is using partial derivatives to decide how to move.

# Partial Derivatives in Linear Regression

In linear regression, a model may look like:

```text
ŷ = wx + b
```

Here:

```text
w = weight
b = bias
x = input
ŷ = predicted output
```

The loss may be:

```text
L = (y - ŷ)²
```

Since:

```text
ŷ = wx + b
```

the loss depends on both `w` and `b`.

So we need:

```text
∂L/∂w
```

and:

```text
∂L/∂b
```

These tell us:

* how to update the weight,
* how to update the bias.

This is the basic mechanism behind training many Machine Learning models.

# Deriving Partial Derivatives for Linear Regression

Let:

```text
L = (y - ŷ)²
```

and:

```text
ŷ = wx + b
```

So:

```text
L = (y - (wx + b))²
```

The partial derivative with respect to `w` is:

```text
∂L/∂w = -2x(y - ŷ)
```

The partial derivative with respect to `b` is:

```text
∂L/∂b = -2(y - ŷ)
```

These formulas tell us how prediction error changes when `w` or `b` changes.

If the prediction is too low or too high, the gradients guide the correction.

# Python Example: One Step of Linear Regression Training

```python
x = 2
y = 10

w = 1.0
b = 0.0

learning_rate = 0.01

y_pred = w * x + b
error = y - y_pred

dL_dw = -2 * x * error
dL_db = -2 * error

w = w - learning_rate * dL_dw
b = b - learning_rate * dL_db

print("Prediction before update:", y_pred)
print("Updated weight:", w)
print("Updated bias:", b)
```

Here, the model predicts using current `w` and `b`.

Then it calculates how the loss changes with respect to each parameter.

Finally, it updates the parameters to reduce future error.

This is the foundation of learning.

# Partial Derivatives in Neural Networks

A neural network may contain millions of weights.

Each weight contributes to the final loss.

Training means computing:

```text
∂L/∂w
```

for every weight in the network.

This is done using an algorithm called backpropagation.

Backpropagation efficiently applies the chain rule to compute partial derivatives layer by layer.

Without partial derivatives, neural networks would not know how to improve.

They would be like students taking exams but never receiving feedback about what went wrong.

# Chain Rule and Partial Derivatives

In neural networks, functions are nested.

For example:

```text
z = wx + b
a = activation(z)
L = loss(a, y)
```

The loss depends on `a`.

But `a` depends on `z`.

And `z` depends on `w`.

So to know how `L` changes with respect to `w`, we need the chain rule.

Conceptually:

```text
∂L/∂w = ∂L/∂a × ∂a/∂z × ∂z/∂w
```

This is the mathematical engine of backpropagation.

It lets the model trace responsibility backward from the final error to each parameter.

# Chain Rule Analogy

Imagine a factory producing a final product.

The product has a defect.

To fix it, you trace backward:

* Was the packaging wrong?
* Was the assembly wrong?
* Was the cutting wrong?
* Was the raw material wrong?

Backpropagation does the same thing.

The final loss is the defect.

Partial derivatives help identify how much each earlier step contributed to the error.

# Partial Derivatives and Feature Importance

Partial derivatives can also help us understand sensitivity.

Suppose a model predicts house price using:

```text
price = f(size, location_score, age)
```

A partial derivative like:

```text
∂price/∂size
```

tells us how sensitive the predicted price is to house size, assuming other inputs are fixed.

Similarly:

```text
∂price/∂age
```

tells us how sensitive the prediction is to house age.

This idea is important in interpretability.

It helps us understand which inputs strongly affect predictions.

# Local Meaning of Partial Derivatives

A partial derivative is local.

This means it describes behavior near a specific point.

For example:

```text
∂f/∂x at (x, y) = (3, 4)
```

tells us how `f` changes with `x` near that point.

It does not necessarily describe the entire function everywhere.

This is important because Machine Learning loss surfaces can be very complex.

A gradient tells the model the best direction locally, not globally.

That is why optimization can sometimes get stuck in local minima, saddle points, or flat regions.

# Saddle Points

A saddle point is a point where the gradient may be zero, but the point is not a true minimum.

Imagine a horse saddle.

It curves upward in one direction and downward in another.

In high-dimensional neural networks, saddle points are common.

Partial derivatives may suggest little or no movement at such points, even though better directions may exist nearby.

This is one reason optimization in deep learning is complex.

# Partial Derivatives and High Dimensions

In real AI systems, functions may depend on millions or billions of variables.

For example:

```text
L(w₁, w₂, w₃, ..., w₁₀₀₀₀₀₀)
```

This may look impossible to handle manually.

But computers can calculate gradients efficiently using automatic differentiation.

Frameworks like PyTorch and TensorFlow compute partial derivatives automatically.

The programmer defines the computation.

The framework tracks operations.

Then it computes gradients for training.

# Automatic Differentiation

Automatic differentiation is a method used by deep learning frameworks to compute derivatives accurately and efficiently.

It is not the same as symbolic differentiation.

It is also not simple numerical approximation.

It tracks operations step by step and applies the chain rule automatically.

In PyTorch, this is done using `autograd`.

Example concept:

```python
import torch

w = torch.tensor(5.0, requires_grad=True)

loss = w**2

loss.backward()

print(w.grad)
```

Output:

```text
tensor(10.)
```

Because:

```text
d(w²)/dw = 2w = 10
```

This is a simple example, but the same mechanism scales to huge neural networks.

# Why Numerical Derivatives Are Not Enough

Earlier, we approximated a partial derivative using:

```text
[f(x + h, y) - f(x, y)] / h
```

This is useful for intuition.

But in large AI models, numerical differentiation is inefficient.

If a model has 1 million parameters, calculating numerical derivatives would require changing each parameter separately and evaluating the loss many times.

That would be extremely slow.

Automatic differentiation is much more efficient.

This is why deep learning frameworks rely on computational graphs and backpropagation.

# Computational Graphs

A computational graph represents calculations as connected operations.

Example:

```text
w → z = wx + b → a = activation(z) → L = loss(a, y)
```

Each node is a value or operation.

During backpropagation, the model moves backward through the graph and calculates partial derivatives.

This allows efficient gradient computation.

In simple words:

The forward pass computes predictions.
The backward pass computes partial derivatives.
The optimizer updates parameters.

# Partial Derivatives and Optimizers

Optimizers use gradients to update model parameters.

Gradient descent is the simplest optimizer.

More advanced optimizers include:

* Momentum,
* RMSProp,
* Adam,
* AdamW.

These optimizers still rely on partial derivatives.

They just use gradient information more intelligently.

For example, Adam adapts learning rates for different parameters.

But the core signal remains:

```text
How does the loss change with respect to each parameter?
```

That question is answered by partial derivatives.

# Positive, Negative, and Zero Partial Derivatives

The sign of a partial derivative matters.

If:

```text
∂L/∂w > 0
```

then increasing `w` increases the loss.

So gradient descent decreases `w`.

If:

```text
∂L/∂w < 0
```

then increasing `w` decreases the loss.

So gradient descent increases `w`.

If:

```text
∂L/∂w = 0
```

then small changes in `w` do not affect the loss locally.

This may mean:

* the parameter is at an optimum,
* the surface is flat,
* or the model is at a saddle point.

# Magnitude of Partial Derivatives

The magnitude tells how strongly the function changes.

A large partial derivative means the function is highly sensitive to that variable.

A small partial derivative means the function is less sensitive.

In neural networks:

* very large gradients can cause unstable updates,
* very small gradients can slow learning.

These problems are known as:

* exploding gradients,
* vanishing gradients.

Partial derivatives are therefore directly connected to training stability.

# Exploding Gradients

Exploding gradients happen when gradients become extremely large.

This can cause model weights to update too aggressively.

The loss may jump around or become unstable.

This often happens in deep networks or recurrent networks when repeated multiplications amplify gradient values.

Techniques like gradient clipping can help.

Gradient clipping limits the maximum size of gradients.

# Vanishing Gradients

Vanishing gradients happen when gradients become extremely small.

If gradients are close to zero, early layers in a deep network learn very slowly.

This was a major challenge in training deep neural networks.

Activation functions, better initialization, normalization, residual connections, and modern architectures help reduce this problem.

The root issue is still about partial derivatives becoming too small during backpropagation.

# Partial Derivatives in Multivariable Functions

Let us consider another function:

```text
f(x, y) = 3x²y + 2xy²
```

Find:

```text
∂f/∂x
```

Treat `y` as constant.

```text
∂/∂x (3x²y) = 6xy
∂/∂x (2xy²) = 2y²
```

So:

```text
∂f/∂x = 6xy + 2y²
```

Now find:

```text
∂f/∂y
```

Treat `x` as constant.

```text
∂/∂y (3x²y) = 3x²
∂/∂y (2xy²) = 4xy
```

So:

```text
∂f/∂y = 3x² + 4xy
```

This shows the main rule clearly:

Differentiate with respect to one variable.
Freeze the rest.

# Python Symbolic Example with SymPy

For learning and verification, we can use SymPy.

```python
import sympy as sp

x, y = sp.symbols("x y")

f = 3*x**2*y + 2*x*y**2

partial_x = sp.diff(f, x)
partial_y = sp.diff(f, y)

print(partial_x)
print(partial_y)
```

Output:

```text
6*x*y + 2*y**2
3*x**2 + 4*x*y
```

This is useful for checking calculations, but in real deep learning, frameworks use automatic differentiation instead of symbolic differentiation.

# Directional Derivatives

A partial derivative measures change along one axis.

But sometimes we want to know how a function changes in any direction.

That is called a directional derivative.

The gradient helps with this.

The gradient points in the direction of steepest increase.

The negative gradient points in the direction of steepest decrease.

This is why gradient descent follows:

```text
-∇L
```

It moves opposite to the direction of greatest loss increase.

# Partial Derivatives and Optimization Landscape

A loss landscape may contain:

* valleys,
* hills,
* flat areas,
* saddle points,
* sharp minima,
* wide minima.

Partial derivatives describe local slopes in this landscape.

Optimization algorithms use these slopes to move through the landscape.

In simple models, the landscape may be smooth and bowl-shaped.

In deep learning, the landscape is high-dimensional and complex.

Yet the basic idea remains the same:

Use partial derivatives to decide how to move.

# Common Mistakes Students Make

Many students confuse normal derivatives and partial derivatives.

A normal derivative is used when a function has one independent variable.

A partial derivative is used when a function has multiple independent variables.

Another mistake is forgetting to treat other variables as constants.

For example, in:

```text
f(x, y) = x²y
```

when differentiating with respect to `x`, `y` is treated as constant.

So:

```text
∂f/∂x = 2xy
```

When differentiating with respect to `y`, `x²` is treated as constant.

So:

```text
∂f/∂y = x²
```

Students also sometimes think the gradient is a single number.

It is not.

The gradient is a vector of partial derivatives.

# Olympiad-Level Thinking

At olympiad level, you should not only calculate partial derivatives mechanically.

You should understand what they mean in AI.

When you see:

```text
∂L/∂w
```

ask:

What parameter is being changed?
What stays fixed?
Does increasing this parameter increase or decrease loss?
How large is the effect?
How should the optimizer update the parameter?
Could the gradient be too large or too small?
How does this connect to backpropagation?

This is the difference between solving calculus problems and understanding Machine Learning systems.

# Formula Layer, Code Layer, AI Layer

A strong AI student should understand partial derivatives in three layers.

Formula layer:

```text
∂f/∂x
```

means the rate of change of `f` with respect to `x`, while other variables are fixed.

Code layer:

```python
loss.backward()
```

or:

```python
gradient = partial_derivative(loss, parameter)
```

AI interpretation layer:

```text
The model uses this value to decide how to update one parameter to reduce error.
```

This three-layer understanding is essential for advanced AI.

# Conclusion

Partial derivatives measure how a multivariable function changes with respect to one variable while keeping other variables fixed.

They are the foundation of gradients, gradient descent, backpropagation, neural network training, and modern optimization.

In AI, every learnable parameter affects the loss in some way.

Partial derivatives tell the model how each parameter should change to reduce that loss.

When collected together, partial derivatives form the gradient.

The gradient guides the model through the loss landscape toward better performance.

Understanding partial derivatives means understanding how AI systems learn from mistakes, adjust their internal parameters, and improve through training.
