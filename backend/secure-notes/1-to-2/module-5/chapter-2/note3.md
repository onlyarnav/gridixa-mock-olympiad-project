# Tracing Logic Errors

## What Is a Logic Error?

When programmers hear the word *error*, they often think about programs that crash immediately. However, one of the most dangerous types of errors is a **logic error**.

A logic error happens when:

* The program runs successfully.
* No error messages appear.
* The output is wrong.

In other words, the computer follows your instructions perfectly, but the instructions themselves are incorrect.

Think of giving directions to a friend.

You say:

"Go straight for 2 km, then turn right."

Your friend follows every instruction exactly.

But if you actually meant "turn left," your friend reaches the wrong destination.

The friend did nothing wrong.

The instructions were wrong.

That is exactly what a logic error is.

## Why Logic Errors Are Difficult

Syntax errors are usually easy to fix because Python points them out.

For example:

```python
print("Hello"
```

Python immediately reports an error.

Logic errors are harder because:

* The code executes normally.
* The output may look reasonable.
* The mistake may only appear in certain situations.

Example:

```python
age = 15

if age > 18:
    print("Eligible")
else:
    print("Not Eligible")
```

The program works correctly.

Now imagine:

```python
age = 18

if age > 18:
    print("Eligible")
else:
    print("Not Eligible")
```

The programmer intended 18-year-olds to be eligible.

However, because the condition uses `>` instead of `>=`, the result becomes incorrect.

The code runs perfectly.

The logic is wrong.

## What Does "Tracing" Mean?

**Tracing** means following a program step by step and observing exactly what happens during execution.

Think of yourself as a detective.

Instead of assuming what the program does, you carefully track:

* Variable values
* Conditions
* Decisions
* Outputs

By tracing each step, you can discover where the logic breaks.

## Example: Tracing a Simple Program

Consider:

```python
number = 5
result = number * 2
print(result)
```

Trace it manually:

| Step          | Variable | Value |
| ------------- | -------- | ----- |
| Start         | number   | 5     |
| Multiply by 2 | result   | 10    |
| Print         | Output   | 10    |

Everything works as expected.

Tracing confirms the logic is correct.

## Finding a Logic Error Through Tracing

Suppose we want to calculate the area of a rectangle.

Formula:

```text
Area = Length × Width
```

Program:

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

No error appears.

But the correct answer should be:

```python
50
```

Trace it:

| Step          | Value |
| ------------- | ----- |
| length        | 10    |
| width         | 5     |
| area = 10 + 5 | 15    |
| output        | 15    |

Tracing immediately reveals the problem.

The programmer used `+` instead of `*`.

## Tracing Conditional Statements

Conditions are common places where logic errors occur.

Example:

```python
score = 75

if score > 80:
    grade = "A"
else:
    grade = "B"

print(grade)
```

Trace:

| Step                | Value     |
| ------------------- | --------- |
| score               | 75        |
| score > 80          | False     |
| else block executes | grade = B |
| output              | B         |

The trace shows exactly why `"B"` was produced.

## Tracing Loops

Loops often create hidden logic mistakes.

Example:

```python
total = 0

for i in range(1, 4):
    total = total + i

print(total)
```

Trace:

| Iteration | i | total |
| --------- | - | ----- |
| Start     | - | 0     |
| 1         | 1 | 1     |
| 2         | 2 | 3     |
| 3         | 3 | 6     |

Output:

```python
6
```

Tracing helps verify that the loop behaves correctly.

## Example of a Loop Logic Error

Suppose we want the sum from 1 to 5.

Program:

```python
total = 0

for i in range(1, 5):
    total = total + i

print(total)
```

Trace:

| Iteration | i | total |
| --------- | - | ----- |
| 1         | 1 | 1     |
| 2         | 2 | 3     |
| 3         | 3 | 6     |
| 4         | 4 | 10    |

Output:

```python
10
```

Expected:

```python
15
```

Why?

Because:

```python
range(1, 5)
```

stops before 5.

Tracing exposes the missing iteration immediately.

## Using Print Statements for Tracing

Professional developers often insert temporary print statements to track program execution.

Example:

```python
number = 10

print("Before doubling:", number)

number = number * 2

print("After doubling:", number)
```

Output:

```python
Before doubling: 10
After doubling: 20
```

These print statements act like checkpoints.

They help identify where values become incorrect.

## Dry Running

A common debugging technique is called a **dry run**.

A dry run means executing the program manually on paper before running it on a computer.

Example:

```python
x = 3
y = x + 2
z = y * 4
```

Dry run table:

| Variable | Value |
| -------- | ----- |
| x        | 3     |
| y        | 5     |
| z        | 20    |

This method helps detect logic mistakes before execution.

## Common Logic Errors Beginners Make

### Wrong Operator

```python
result = 5 + 5
```

instead of

```python
result = 5 * 5
```

### Wrong Condition

```python
if marks > 50:
```

instead of

```python
if marks >= 50:
```

### Wrong Loop Range

```python
range(1, 5)
```

instead of

```python
range(1, 6)
```

### Updating the Wrong Variable

```python
count = 0

for i in range(5):
    total = total + i
```

when the intention was:

```python
count = count + 1
```

## A Real-Life Analogy

Imagine baking a cake.

The recipe says:

1. Add flour.
2. Add sugar.
3. Bake for 30 minutes.

You accidentally write:

1. Add flour.
2. Add salt.
3. Bake for 30 minutes.

The baker follows every step correctly.

The cake still gets baked.

But it tastes terrible.

The process worked.

The instructions were wrong.

That is exactly how logic errors behave in programming.

## Building the Habit of Tracing

Strong programmers rarely guess.

When something seems wrong, they:

* Follow the code step by step.
* Record variable values.
* Check conditions carefully.
* Verify loop iterations.
* Compare actual output with expected output.

Tracing transforms debugging from guessing into systematic investigation.

## Conclusion

Logic errors occur when a program runs successfully but produces incorrect results. Because no error messages appear, they can be difficult to identify. Tracing helps solve this problem by following program execution step by step, monitoring variables, conditions, and loops. Whether done manually through dry runs or using print statements, tracing is one of the most important debugging skills every programmer must master. As programs become larger and more complex, the ability to trace logic accurately becomes an essential skill for writing reliable and correct software.
