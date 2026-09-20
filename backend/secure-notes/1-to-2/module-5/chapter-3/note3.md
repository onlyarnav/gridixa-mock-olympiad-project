# Fixing Simple Errors

Imagine that you are a detective reading a mystery novel. The author gives you clues, and your job is to find out what went wrong. Programming often feels the same way. A program may not work as expected, and your task is to identify and fix the mistake.

This process is called **debugging**.

A great programmer is not someone who never makes mistakes. A great programmer is someone who can quickly find and fix them.

## Why Do Errors Happen?

Computers follow instructions exactly as written. They do not guess what you meant.

If you write:

```python
prit("Hello")
```

you may know that you meant `print()`, but Python only sees `prit()`, which does not exist.

Even a tiny mistake can stop a program from running correctly.

## Types of Simple Errors

Most beginner programs contain one of three kinds of errors:

### Syntax Errors

These happen when Python's grammar rules are broken.

Example:

```python
print("Hello"
```

Python expects a closing bracket but cannot find it.

Correct version:

```python
print("Hello")
```

Think of syntax errors like writing a sentence without ending punctuation. The reader becomes confused because the structure is incomplete.

## Spelling Errors

Python is very strict about names.

Example:

```python
mesage = "Hi"
print(message)
```

Output:

```python
NameError
```

Why?

The variable was created as:

```python
mesage
```

but later used as:

```python
message
```

Those are different names.

Correct version:

```python
message = "Hi"
print(message)
```

## Missing Quotes

Text must be written inside quotation marks.

Wrong:

```python
print(Hello)
```

Python thinks `Hello` is a variable.

Correct:

```python
print("Hello")
```

## Missing Colons

Statements such as `if`, `for`, and `while` require a colon.

Wrong:

```python
if age > 18
    print("Adult")
```

Correct:

```python
if age > 18:
    print("Adult")
```

## Indentation Errors

Python uses spaces to organize code.

Wrong:

```python
if age > 18:
print("Adult")
```

Correct:

```python
if age > 18:
    print("Adult")
```

The indented line belongs to the `if` statement.

Think of indentation as placing books on the correct shelf. If a book is on the wrong shelf, the library becomes confusing.

## Logic Errors

Sometimes the program runs but gives the wrong answer.

Example:

```python
length = 10
width = 5

area = length + width

print(area)
```

Output:

```python
15
```

But the area of a rectangle should be:

```python
length × width
```

Correct version:

```python
area = length * width
```

Output:

```python
50
```

The code runs perfectly, but the logic is wrong.

These errors are often harder to find because Python does not show an error message.

## Finding Errors Step by Step

Suppose we have:

```python
name = "Alex"

print("Welcome" name)
```

Python reports an error.

How do we fix it?

### Step 1: Read the Error Message

The message usually points near the mistake.

### Step 2: Check Symbols

Are brackets, commas, quotes, and colons present?

### Step 3: Compare with Correct Syntax

The correct statement is:

```python
print("Welcome", name)
```

A comma was missing.

## Fixing Errors by Testing Small Pieces

Consider:

```python
a = 10
b = 5

result = a / b
print(result)

answer = result + unknown
print(answer)
```

The program crashes.

Instead of examining everything at once, test each part.

The first section works:

```python
result = a / b
print(result)
```

Output:

```python
2.0
```

The problem must be later.

Looking carefully:

```python
unknown
```

was never created.

We either define it or replace it with the correct variable.

This method is called **isolating the problem**.

## Common Beginner Mistakes

### Forgetting Parentheses

Wrong:

```python
print "Hello"
```

Correct:

```python
print("Hello")
```

### Using = Instead of ==

Wrong:

```python
if age = 18:
```

Correct:

```python
if age == 18:
```

Remember:

```python
=
```

assigns a value.

```python
==
```

compares values.

### Dividing by Zero

Wrong:

```python
x = 10 / 0
```

This causes an error because division by zero is impossible.

### Mixing Text and Numbers

Wrong:

```python
age = 15

print("Age: " + age)
```

Correct:

```python
print("Age:", age)
```

or

```python
print("Age: " + str(age))
```

## Becoming a Better Debugger

Professional programmers often spend more time fixing code than writing code.

To improve:

* Read error messages carefully.
* Check spelling.
* Verify brackets and quotes.
* Examine indentation.
* Test small parts separately.
* Think logically about the expected output.

Most bugs are not complicated. They are usually small details hiding in plain sight.

## The Debugging Mindset

When code fails, avoid guessing randomly.

Instead ask:

* What was the program supposed to do?
* What did it actually do?
* Where do those two differ?
* Which line could be causing the problem?

This systematic approach turns debugging into a logical investigation rather than frustration.

## Conclusion

Fixing simple errors is one of the most important programming skills. Syntax errors, spelling mistakes, indentation problems, and logic errors are common for every programmer, from beginners to experts. By carefully reading code, checking error messages, and testing small sections one at a time, you can quickly locate problems and correct them. The more programs you debug, the stronger your problem-solving abilities become, and debugging gradually transforms from a challenge into a powerful skill that helps you write reliable and accurate code.
