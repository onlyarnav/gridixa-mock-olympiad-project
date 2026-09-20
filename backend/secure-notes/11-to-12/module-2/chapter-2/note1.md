# The Pixel Problem: Why Images Break Transformers

As your AI teacher, let us explore an important challenge that appears when we try to extend language models beyond text.

So far, Transformer models have been trained using **text tokens**. Each word or part of a word is converted into a token, and the model processes these tokens using the attention mechanism.

But modern AI systems often need to handle **images, audio, and other types of data**. For example, imagine building an AI that can look at a **photograph of a MUN poster** and read the information written on it.

At first glance, it might seem that we could simply feed the **raw pixels of the image** into a Transformer. However, this approach creates a major computational problem.

A standard high-definition image has a resolution of **1920 × 1080 pixels**, which means the image contains **more than two million individual pixels**.

If each pixel were treated as a token, the Transformer would need to compute attention between **every pixel and every other pixel** in the image.

Earlier we learned that the attention mechanism has a computational complexity of **O(N²)**, which means the number of comparisons grows extremely quickly as the number of tokens increases.

O(N^2)

When applied to millions of pixels, this calculation becomes enormous. The system would need to store a **massive Key–Value cache matrix**, potentially containing trillions of numerical values.

Such a large memory requirement would exceed the limits of most GPUs, causing the system to run out of memory almost immediately.

Because of this limitation, raw images cannot be processed directly by a standard Transformer architecture.

To solve this challenge, researchers developed specialized techniques that **compress images into smaller representations** before passing them to the model. These techniques allow Transformers to process visual information without overwhelming computational resources.

**Key Idea**

Images contain millions of pixels, and if each pixel were treated as a token, the attention mechanism with **O(N²)** complexity would require enormous memory and computation. This “pixel problem” explains why raw images cannot be directly fed into standard Transformer models.
