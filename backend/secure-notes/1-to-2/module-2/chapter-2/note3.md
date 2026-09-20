# Working with Text Files

Imagine you are managing a digital notebook. Every time you save notes, read information, or update content, you are actually working with text files. In programming, text files are one of the most important ways to store information permanently.

Whenever applications save logs, store reports, keep configuration settings, or process datasets, they usually interact with text files behind the scenes.

Understanding how text files work is a major step toward building real-world AI and software systems.

# What Is a Text File?

A text file is a file that stores data as plain readable characters.

Examples include:

* `.txt`
* `.csv`
* `.md`
* `.json`
* `.py`

A text file does not store images or videos. It stores characters like:

```text
Hello World
AI Olympiad
Python is powerful
```

You can open text files using:

* Notepad
* VS Code
* Sublime Text
* PyCharm
* Any code editor

# Why Text Files Matter in AI

AI systems constantly process text files.

Examples:

| AI Task               | File Usage                   |
| --------------------- | ---------------------------- |
| Training chatbot data | Reading datasets             |
| Logging predictions   | Writing output logs          |
| NLP tasks             | Processing documents         |
| Configuration systems | Reading settings             |
| Data pipelines        | Storing intermediate results |

If you understand text files well, you understand how programs communicate with stored information.

# Opening Files Correctly

The `open()` function is the foundation of file handling.

Basic structure:

```python
file = open("filename.txt", "mode")
```

The mode determines what operation you want to perform.

| Mode   | Meaning        |
| ------ | -------------- |
| `"r"`  | Read           |
| `"w"`  | Write          |
| `"a"`  | Append         |
| `"x"`  | Create         |
| `"r+"` | Read and write |

Example:

```python
file = open("notes.txt", "r")
```

# Reading Entire File Content

Suppose a file contains:

```text
Artificial Intelligence
Machine Learning
Deep Learning
```

You can read everything at once:

```python
file = open("notes.txt", "r")

content = file.read()

print(content)

file.close()
```

Output:

```text
Artificial Intelligence
Machine Learning
Deep Learning
```

# Reading Line by Line

Large files should usually be processed line by line instead of loading everything into memory.

Example:

```python
file = open("notes.txt", "r")

for line in file:
    print(line)

file.close()
```

This is memory-efficient and commonly used in AI systems handling huge datasets.

# Understanding Newline Characters

Every line usually ends with a special invisible character:

```python
\n
```

This means “move to the next line.”

Example:

```python
file = open("data.txt", "w")

file.write("Python\n")
file.write("AI\n")
file.write("Machine Learning")

file.close()
```

The file becomes:

```text
Python
AI
Machine Learning
```

Without `\n`, all text would appear on one line.

# Using with Statement

Professional Python programmers rarely use manual `close()`.

Instead, they use:

```python
with open("notes.txt", "r") as file:
    content = file.read()
    print(content)
```

Why?

Because Python automatically closes the file afterward.

This prevents:

* memory leaks
* corrupted files
* accidental file locking

Think of `with` as an automatic safety system.

# Appending Data Safely

Suppose you already have:

```text
Python
AI
```

Now you want to add more data without deleting existing content.

Use append mode:

```python
with open("notes.txt", "a") as file:
    file.write("\nMachine Learning")
```

Now the file becomes:

```text
Python
AI
Machine Learning
```

# Processing Text Files

One of the biggest powers of programming is processing file data automatically.

Suppose a file contains:

```text
78
90
85
67
92
```

You can calculate the average score:

```python
with open("scores.txt", "r") as file:
    total = 0
    count = 0

    for line in file:
        total += int(line)
        count += 1

average = total / count

print("Average:", average)
```

Output:

```text
Average: 82.4
```

This is real data processing.

# Splitting Text Data

Suppose a file contains:

```text
Rahul,85
Ananya,92
Kabir,88
```

You can separate names and marks:

```python
with open("students.txt", "r") as file:
    for line in file:
        data = line.strip().split(",")

        name = data[0]
        marks = data[1]

        print(name, "scored", marks)
```

Output:

```text
Rahul scored 85
Ananya scored 92
Kabir scored 88
```

# Important String Functions in File Processing

These are heavily used while working with text files.

| Function    | Purpose                       |
| ----------- | ----------------------------- |
| `strip()`   | Removes extra spaces/newlines |
| `split()`   | Splits text into parts        |
| `replace()` | Replaces characters           |
| `lower()`   | Converts to lowercase         |
| `upper()`   | Converts to uppercase         |

Example:

```python
text = " AI Olympiad \n"

print(text.strip())
```

Output:

```text
AI Olympiad
```

# Counting Words in a File

This is a classic programming problem.

Example:

```python
with open("article.txt", "r") as file:
    text = file.read()

words = text.split()

print("Total words:", len(words))
```

This concept is used in:

* NLP systems
* search engines
* text analytics
* AI language models

# Searching Inside Files

Suppose you want to find whether a word exists.

```python
with open("notes.txt", "r") as file:
    content = file.read()

if "Python" in content:
    print("Found")
else:
    print("Not Found")
```

This simple idea powers:

* search systems
* document scanners
* recommendation engines

# Handling File Errors

What if the file does not exist?

This causes an error:

```python
FileNotFoundError
```

Professional programs handle such situations carefully.

Example:

```python
try:
    with open("missing.txt", "r") as file:
        print(file.read())

except FileNotFoundError:
    print("File does not exist")
```

This prevents program crashes.

# Text Encoding

Computers store text using encodings.

The most common encoding today is:

```text
UTF-8
```

Sometimes you may see:

```python
with open("file.txt", "r", encoding="utf-8") as file:
    content = file.read()
```

Encoding becomes extremely important in AI systems handling multilingual data.

# Real-World AI Example

Suppose an AI chatbot stores conversations in files.

Example log file:

```text
User: Hello
Bot: Hi there

User: What is AI?
Bot: Artificial Intelligence is...
```

The AI system may:

* read old conversations
* analyze patterns
* train models
* generate summaries

All using text file processing.

# Common Mistakes Beginners Make

## Forgetting to Close Files

Bad:

```python
file = open("data.txt", "r")
```

Better:

```python
with open("data.txt", "r") as file:
```

## Using Wrong Modes

Trying to write in `"r"` mode causes errors.

Always choose the correct mode.

## Ignoring Newlines

Without `\n`, text formatting becomes messy.

## Not Handling Errors

Professional programs always expect failures.

# Mini Practical Example

Program that copies one file into another:

```python
with open("source.txt", "r") as source:
    content = source.read()

with open("copy.txt", "w") as target:
    target.write(content)

print("File copied successfully")
```

This simple logic forms the foundation of:

* backup systems
* cloud storage
* data migration
* AI preprocessing pipelines

# Thinking Like an Olympiad Programmer

Strong programmers do not just read files.

They think:

* How large is the file?
* Can memory become a problem?
* What happens if the file is corrupted?
* Is the data clean?
* How can parsing become faster?

This analytical mindset separates advanced problem solvers from beginners.

# Conclusion

Working with text files allows programs to store, retrieve, analyze, and manipulate information permanently. It is one of the most practical and powerful skills in programming because nearly every real-world software system interacts with files in some form.

You learned:

* how text files work
* reading and writing operations
* line-by-line processing
* string manipulation
* file safety practices
* error handling
* real-world AI applications

Mastering text files is an important step toward building intelligent systems, data pipelines, automation tools, and advanced AI applications.
