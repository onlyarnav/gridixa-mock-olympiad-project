# Functions

Imagine you are building a machine that performs a task again and again. Instead of rebuilding the entire machine every time, you create the machine once and call it whenever needed.

That is exactly what a **function** is in Python.

A function is a reusable block of code designed to perform a specific task.

Functions help us:

* avoid repeating code
* organize programs better
* make debugging easier
* build larger projects efficiently

Think of functions as **mini programs inside your program**.

---

## Why Functions Exist

Without functions:

```python
print("Welcome")
print("Welcome")
print("Welcome")
```

If you later want to change the message:

```python
print("Hello Student")
```

You must edit every line.

With functions:

```python
def greet():
    print("Welcome")

greet()
greet()
greet()
```

Now changing one place updates everything.

---

## Creating Your First Function

Python uses the keyword `def`.

Basic structure:

```python
def function_name():
    # code
```

Example:

```python
def say_hello():
    print("Hello Python!")

say_hello()
```

Output:

```
Hello Python!
```

Explanation:

* `def` → tells Python you are creating a function
* `say_hello` → function name
* `()` → parentheses (inputs go here later)
* `:` → start of function body

---

## Function Execution Flow

When Python sees:

```python
say_hello()
```

It jumps into:

```python
def say_hello():
```

executes everything inside.

Then returns back.

Think of this like:

```
Main Program
      ↓
Call Function
      ↓
Execute Function
      ↓
Return
      ↓
Continue Program
```

---

## Functions With Parameters

Functions become powerful when they receive information.

Example:

```python
def greet(name):
    print("Hello", name)

greet("Aarav")
```

Output:

```
Hello Aarav
```

Here:

* `name` → parameter
* `"Aarav"` → argument

Parameter → placeholder
Argument → actual value

Analogy:

You order coffee.

* Parameter → cup size
* Argument → large

Same machine, different inputs.

---

## Multiple Parameters

Functions can accept multiple values.

Example:

```python
def add(a, b):
    print(a + b)

add(5, 8)
```

Output:

```
13
```

Execution:

```
a = 5
b = 8

5 + 8
```

---

## Returning Values

Printing is not always enough.

Functions can send results back using `return`.

Example:

```python
def square(x):
    return x * x

result = square(6)

print(result)
```

Output:

```
36
```

Flow:

```
Input
 ↓
Function computes
 ↓
return
 ↓
Store result
```

Without `return`:

```python
def square(x):
    x*x

print(square(6))
```

Output:

```
None
```

Because nothing was returned.

---

## Return Ends the Function

Example:

```python
def test():
    return 10
    print("Hello")

test()
```

Output:

```
10
```

The print never executes.

`return` immediately exits.

---

## Functions With Multiple Returns

Python can return multiple values.

Example:

```python
def stats(a, b):
    return a+b, a-b

x, y = stats(10, 4)

print(x)
print(y)
```

Output:

```
14
6
```

Python packs values together and unpacks them.

---

## Default Parameters

You can give default values.

Example:

```python
def greet(name="Student"):
    print("Hello", name)

greet()
greet("Riya")
```

Output:

```
Hello Student
Hello Riya
```

If no value is provided, default is used.

---

## Keyword Arguments

Arguments can be passed using names.

Example:

```python
def describe(name, age):
    print(name)
    print(age)

describe(age=15, name="Aryan")
```

Output:

```
Aryan
15
```

Order no longer matters.

---

## Local Variables vs Global Variables

Variables created inside functions exist only there.

Example:

```python
def test():
    x = 10

test()

print(x)
```

Error:

```
NameError
```

`x` disappears after function ends.

---

Global variable:

```python
x = 50

def show():
    print(x)

show()
```

Output:

```
50
```

Global variables exist everywhere.

---

## Modifying Global Variables

Use carefully.

Example:

```python
count = 0

def increase():
    global count
    count += 1

increase()

print(count)
```

Output:

```
1
```

Avoid overusing `global` because it makes programs harder to understand.

---

## Functions Calling Functions

Functions can use other functions.

Example:

```python
def double(x):
    return x*2

def triple(x):
    return double(x)+x

print(triple(4))
```

Output:

```
12
```

Large programs become easier through composition.

---

## Practical Example: Calculator

```python
def add(a,b):
    return a+b

def subtract(a,b):
    return a-b

print(add(10,5))
print(subtract(10,5))
```

Output:

```
15
5
```

Each function has one responsibility.

---

## Functions Make Thinking Easier

When writing programs:

Instead of asking:

> How do I solve everything at once?

Ask:

> Which smaller tasks can I separate into functions?

Good programs are built from many small functions working together.

Python functions are the foundation of modular programming, automation, data processing, machine learning workflows, and almost every real-world software system.

Once functions become natural, writing large programs stops feeling overwhelming.

Functions turn complicated problems into manageable pieces.
