# The Solution: Vision Transformers (ViT)

As your AI teacher, let us now see how researchers solved the **pixel problem** that prevents standard Transformers from processing images directly.

Instead of feeding millions of individual pixels into the model, researchers introduced a clever idea called the **Vision Transformer (ViT)**.

The key insight was simple: treat an image **like a paragraph of text**.

In text processing, a paragraph is divided into **tokens** before being fed into the Transformer. Similarly, the Vision Transformer divides an image into **smaller visual pieces called patches**, which act like tokens for images.

This process allows the model to handle visual data efficiently without overwhelming GPU memory.

---

### The Patching Pipeline

To convert an image into a format that a Transformer can understand, the system performs several steps known as the **patching pipeline**.

---

**Chopping the Image into Patches**

The first step is to divide the image into small square sections called **patches**.

A common patch size used in Vision Transformers is:

16 \times 16

Each patch contains a small group of pixels. Instead of analyzing millions of individual pixels, the model now processes **a manageable number of patches**, which greatly reduces the computational cost.

---

**Flattening the Patch**

Each patch originally exists as a **two-dimensional grid of pixels**.

To make it compatible with the Transformer architecture, the patch is **flattened** into a one-dimensional vector. This means all pixel values are arranged into a single list of numbers.

---

**Linear Projection**

The raw pixel values are then transformed using a **linear projection** operation.

In this step, the flattened pixel vector is multiplied by a **weight matrix** to convert it into an **embedding vector**.

This process is very similar to how words in a sentence are converted into **word embeddings** before being processed by a language model.

Now each patch behaves like a **visual token**.

---

**Positional Encoding**

Once the patches are converted into embeddings, the model must still know **where each patch came from in the original image**.

To solve this, engineers add **positional encoding**.

These positional signals act like **geometric coordinates**, allowing the model to understand the spatial arrangement of the patches in the image.

This step is similar to how positional encoding is used in text models to indicate the order of words in a sentence.

---

**Processing with a Transformer**

Finally, the patch embeddings are passed into a **standard Transformer block**.

Inside the Transformer, the **self-attention mechanism** analyzes relationships between patches. For example, the model may learn how the patch containing a **dog’s ear** relates to the patch containing the **dog’s nose**.

Through this process, the Vision Transformer can understand patterns, shapes, and objects in the image.

---

**Key Idea**

Vision Transformers allow AI systems to process images by **dividing them into small patches and treating each patch like a token**. These patch embeddings are then processed by the Transformer using attention, allowing the model to understand visual relationships within the image.
