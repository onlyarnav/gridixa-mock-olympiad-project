const fs = require("fs/promises");
const path = require("path");

const express = require("express");
const router = express.Router();

const { getModules } = require("../controllers/module");
const { authMiddleware } = require("../middleware/auth");

// 🔐 only logged-in users
router.get("/all", authMiddleware, getModules);

router.get("/notes", authMiddleware, async (req, res) => {
  try {

    const requestedPath = req.query.path;

    if (
      typeof requestedPath !== "string" ||
      !requestedPath.trim()
    ) {
      return res.status(400).json({
        message: "Path required",
      });
    }

    const notesRoot = path.resolve(
      process.cwd(),
      "secure-notes"
    );

    const fullPath = path.resolve(
      notesRoot,
      requestedPath
    );

    // 🔒 Prevent ../../../ attacks
    if (!fullPath.startsWith(notesRoot)) {

      return res.status(403).json({
        message: "Invalid path",
      });

    }

    const content = await fs.readFile(
      fullPath,
      "utf8"
    );

    const ext = path.extname(
      fullPath
    ).toLowerCase();

    // =====================
    // JSON (practice/module tests)
    // =====================

    if (ext === ".json") {

      try {

        return res.json(
          JSON.parse(content)
        );

      } catch {

        return res.status(500).json({
          message: "Invalid JSON file",
        });

      }

    }

    // =====================
    // Markdown (notes)
    // =====================

    if (ext === ".md") {

      res.setHeader(
        "Content-Type",
        "text/markdown; charset=utf-8"
      );

      return res.send(content);

    }

    // =====================
    // Unsupported
    // =====================

    return res.status(415).json({
      message: "Unsupported file type",
    });

  } catch (err) {

    console.error(err);

    return res.status(404).json({
      message: "File not found",
    });

  }
});

module.exports = router;